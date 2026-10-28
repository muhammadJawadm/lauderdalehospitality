import { useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";
import { toast } from "react-toastify";
import BookingHeader from "../components/bookings/BookingHeader";
import { functions } from "../config/firebase";
import { useBookingCart } from "../contexts/BookingCartContext";
import { LEG_TYPE_LABELS, legDateTime, type CartLeg } from "../lib/cartTypes";
import type { GuestInfo } from "../lib/cartTypes";

interface SquareCard {
  attach: (element: HTMLElement) => Promise<void>;
  destroy: () => Promise<void>;
  tokenize: () => Promise<{ status: string; token?: string; errors?: { message: string }[] }>;
}
interface SquarePayments {
  card: () => Promise<SquareCard>;
}
interface SquareGlobal {
  payments: (appId: string, locationId: string) => Promise<SquarePayments>;
}
declare global {
  interface Window {
    Square?: SquareGlobal;
  }
}

interface CombinedPaymentResponse {
  success: boolean;
  groupId: string | null;
  bookingIds: string[];
  paymentId: string | null;
  totalCharged: number;
}

const SQUARE_APP_ID = import.meta.env.VITE_SQUARE_APP_ID as string | undefined;
const SQUARE_LOCATION_ID = import.meta.env.VITE_SQUARE_LOCATION_ID as string | undefined;
const SQUARE_ENV = import.meta.env.VITE_SQUARE_ENV === "production" ? "production" : "sandbox";
const SQUARE_SDK_URL =
  SQUARE_ENV === "production"
    ? "https://web.squarecdn.com/v1/square.js"
    : "https://sandbox.web.squarecdn.com/v1/square.js";

function loadSquareSdk(): Promise<SquareGlobal> {
  if (window.Square) return Promise.resolve(window.Square);

  return new Promise((resolve, reject) => {
    const existing = document.getElementById("square-web-payments-sdk");
    if (existing) {
      existing.addEventListener("load", () => resolve(window.Square!));
      existing.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.id = "square-web-payments-sdk";
    script.src = SQUARE_SDK_URL;
    script.onload = () => resolve(window.Square!);
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

interface OrderSnapshot {
  legs: CartLeg[];
  guestInfo: GuestInfo;
  totalPrice: number;
}

export default function Checkout() {
  const { legs, guestInfo, totalPrice, clearCart } = useBookingCart();

  const [order] = useState<OrderSnapshot>(() => ({
    legs: legs.map((l) => ({ ...l })),
    guestInfo: { ...guestInfo },
    totalPrice,
  }));

  const cardContainerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<SquareCard | null>(null);

  const [cardReady, setCardReady] = useState(false);
  const [configError, setConfigError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<CombinedPaymentResponse | null>(null);

  const totalServiceFees = order.legs.reduce((s, l) => s + (l.serviceFee || 0), 0);
  const fareTotal = order.totalPrice - totalServiceFees;

  useEffect(() => {
    if (!SQUARE_APP_ID || !SQUARE_LOCATION_ID) {
      setConfigError("Online payments aren't configured yet. Please contact support to complete this booking.");
      return;
    }
    if (order.legs.length === 0) return;

    let cancelled = false;

    loadSquareSdk()
      .then((Square) => Square.payments(SQUARE_APP_ID, SQUARE_LOCATION_ID))
      .then((payments) => payments.card())
      .then((card) => {
        if (cancelled || !cardContainerRef.current) return;
        return card.attach(cardContainerRef.current).then(() => {
          cardRef.current = card;
          setCardReady(true);
        });
      })
      .catch((error) => {
        console.error("Error initializing Square payment form:", error);
        setConfigError("Unable to load the payment form. Please refresh and try again.");
      });

    return () => {
      cancelled = true;
      cardRef.current?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardRef.current || submitting) return;

    setSubmitting(true);
    try {
      const tokenResult = await cardRef.current.tokenize();
      if (tokenResult.status !== "OK") {
        const detail = tokenResult.errors?.[0]?.message || "Please check your card details and try again.";
        toast.error(detail, { position: "bottom-right", autoClose: 3000 });
        return;
      }

      const createCombinedPayment = httpsCallable<
        { sourceId: string; legs: CartLeg[]; guestInfo: GuestInfo },
        CombinedPaymentResponse
      >(functions, "createCombinedPayment");

      const result = await createCombinedPayment({
        sourceId: tokenResult.token!,
        legs: order.legs,
        guestInfo: order.guestInfo,
      });

      clearCart();
      setConfirmation(result.data);
      toast.success("Payment successful! Your booking is confirmed.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Payment error:", error);
      const message = error instanceof Error ? error.message : "Payment failed. Please try again.";
      toast.error(message, { position: "bottom-right", autoClose: 4000 });
    } finally {
      setSubmitting(false);
    }
  };

  if (order.legs.length === 0 && !confirmation) {
    return <Navigate to="/booking" replace />;
  }

  return (
    <div className="min-h-screen bg-bg-light">
      <BookingHeader />
      <div className="mx-auto max-w-6xl px-6 py-14">
        {confirmation ? (
          <div className="mx-auto max-w-xl space-y-6 py-12 text-center sm:py-24">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h5 className="font-display text-2xl font-semibold text-ink">Booking Confirmed!</h5>
            <p className="text-body">
              Your payment of <span className="font-semibold text-ink">${confirmation.totalCharged}</span> was
              successful and {confirmation.bookingIds.length === 1 ? "your transfer is" : `all ${confirmation.bookingIds.length} transfers are`} confirmed.
            </p>
            <div className="space-y-1 text-sm text-body">
              {confirmation.bookingIds.map((id, i) => (
                <p key={id} className="break-all">
                  Transfer {i + 1} ref: <span className="font-semibold text-ink">{id}</span>
                </p>
              ))}
            </div>
            <Link to="/">
              <button className="mt-4 rounded-xl bg-primary px-10 py-4 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">
                Back to Home
              </button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex items-center gap-1.5">
              <Link to="/booking/cart" className="text-ink transition-colors hover:text-primary">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.99996 14L4.34996 8.35C4.25835 8.25654 4.20703 8.13088 4.20703 8C4.20703 7.86912 4.25835 7.74346 4.34996 7.65L9.99996 2" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </Link>
              <h5 className="font-display text-2xl font-semibold text-ink">Checkout</h5>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  <h4 className="font-display text-base font-bold text-ink">Transfer Summary</h4>
                  <div className="mt-4 divide-y divide-gray-100">
                    {order.legs.map((leg, i) => {
                      const { date, time } = legDateTime(leg);
                      return (
                        <div key={leg.id} className="py-3 first:pt-0 last:pb-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="text-xs font-bold uppercase tracking-wide text-primary">
                                {i + 1}. {LEG_TYPE_LABELS[leg.legType]}
                              </p>
                              <p className="mt-1 text-sm text-ink">
                                {leg.pickupLoc} &rarr; {leg.dropoffLoc}
                              </p>
                              <p className="mt-0.5 text-xs text-body">
                                {date && <>{date} &middot; </>}
                                {time && <>{time} &middot; </>}
                                {leg.adults} pax
                              </p>
                            </div>
                            <p className="shrink-0 font-display text-sm font-bold text-ink">${leg.totalPrice}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  <h4 className="font-display text-base font-bold text-ink">Guest</h4>
                  <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                    <p className="text-body">Name</p>
                    <p className="font-medium text-ink">{order.guestInfo.fName} {order.guestInfo.lName}</p>
                    <p className="text-body">Email</p>
                    <p className="font-medium text-ink">{order.guestInfo.email}</p>
                    <p className="text-body">Phone</p>
                    <p className="font-medium text-ink">{order.guestInfo.phone}</p>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  {configError ? (
                    <p className="text-sm font-medium text-red-600">{configError}</p>
                  ) : (
                    <>
                      <label className="mb-3 block text-xs font-bold uppercase tracking-wide text-body">Card Details</label>
                      <div ref={cardContainerRef} id="card-container" className="min-h-[56px] rounded-lg border border-gray-200 p-3" />
                      {!cardReady && <p className="mt-2 text-xs text-body">Loading secure payment form...</p>}
                    </>
                  )}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-6 space-y-5 rounded-xl border border-gray-200 bg-white p-5">
                  <h4 className="font-display text-lg font-bold text-ink">Order Summary</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-body">Transfers</span>
                      <span className="font-medium text-ink">{order.legs.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-body">Fare Total</span>
                      <span className="font-medium text-ink">${fareTotal}</span>
                    </div>
                    {totalServiceFees > 0 && (
                      <div className="flex justify-between">
                        <span className="text-body">Service Fees</span>
                        <span className="font-medium text-ink">${totalServiceFees}</span>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-end justify-between">
                      <span className="font-display text-base font-bold text-ink">Total</span>
                      <span className="font-display text-2xl font-extrabold text-ink">${order.totalPrice}</span>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={!cardReady || submitting || !!configError}
                    className="w-full cursor-pointer rounded-xl bg-primary py-4 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Processing..." : `Pay $${order.totalPrice}`}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
