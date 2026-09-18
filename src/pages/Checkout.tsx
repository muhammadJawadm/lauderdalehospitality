import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Link, Navigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";
import { toast } from "react-toastify";
import BookingHeader from "../components/bookings/BookingHeader";
import { functions } from "../config/firebase";
import type { BookingState } from "../lib/bookingTypes";

// Minimal shape of the Square Web Payments SDK surface this page touches.
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

interface CreateSquarePaymentResponse {
  success: boolean;
  bookingId: string;
  paymentId: string | null;
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

export default function Checkout() {
  const { state } = useLocation();
  const booking = state as BookingState | null;
  const navigate = useNavigate();

  const cardContainerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<SquareCard | null>(null);

  const [cardReady, setCardReady] = useState(false);
  const [configError, setConfigError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<CreateSquarePaymentResponse | null>(null);

  useEffect(() => {
    if (!SQUARE_APP_ID || !SQUARE_LOCATION_ID) {
      setConfigError("Online payments aren't configured yet. Please contact support to complete this booking.");
      return;
    }
    if (!booking) return;

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
  }, [booking]);

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

      const createSquarePayment = httpsCallable<
        { sourceId: string; booking: BookingState },
        CreateSquarePaymentResponse
      >(functions, "createSquarePayment");
      const result = await createSquarePayment({
        sourceId: tokenResult.token!,
        booking: booking!,
      });

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

  useEffect(() => {
    if (!booking) {
      navigate("/booking", { replace: true });
    }
  }, [booking, navigate]);

  if (!booking) return <Navigate to="/booking" replace />;

  return (
    <div className="min-h-screen bg-bg-light">
      <BookingHeader />
      <div className="mx-auto max-w-6xl px-6 py-14">
        {confirmation ? (
          <div className="mx-auto max-w-xl space-y-6 py-12 text-center sm:py-24">
            <h5 className="font-display text-2xl font-semibold text-ink">Booking Confirmed!</h5>
            <p className="text-body">Your payment was successful and your booking is confirmed.</p>
            <p className="break-all text-sm text-body">
              Booking Reference: <span className="font-semibold text-ink">{confirmation.bookingId}</span>
            </p>
            <Link to="/">
              <button className="rounded-xl bg-primary px-10 py-4 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">
                Back to Home
              </button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-14">
            <div className="flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.99996 14L4.34996 8.35C4.25835 8.25654 4.20703 8.13088 4.20703 8C4.20703 7.86912 4.25835 7.74346 4.34996 7.65L9.99996 2" stroke="#222222" strokeWidth="1.5" />
              </svg>
              <h5 className="font-display text-2xl font-semibold text-ink">Payment Details</h5>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-20">
              <div className="space-y-5 rounded-xl border border-gray-200 bg-white p-5 lg:col-span-2">
                {configError ? (
                  <p className="text-sm font-medium text-red-600">{configError}</p>
                ) : (
                  <>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-body">Card Details</label>
                    <div ref={cardContainerRef} id="card-container" className="min-h-[56px] rounded-lg border border-gray-200 p-3" />
                    {!cardReady && <p className="text-xs text-body">Loading secure payment form...</p>}
                  </>
                )}
              </div>
              <div className="space-y-5 rounded-xl border border-gray-200 bg-white p-5 lg:col-span-1">
                <h4 className="font-display text-lg font-bold text-ink">Summary</h4>
                <div className="flex items-center justify-between">
                  <p className="text-lg text-body sm:text-xl">Passengers</p>
                  <p className="text-xl font-medium text-ink sm:text-2xl">{booking.adults}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-lg text-body sm:text-xl">Per Head</p>
                  <p className="text-xl font-medium text-ink sm:text-2xl">$ {booking.perPersonPrice}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-lg text-body sm:text-xl">Total</p>
                  <p className="text-xl font-medium text-ink sm:text-2xl">$ {booking.totalPrice}</p>
                </div>
              </div>
            </div>

            <div className="mx-auto max-w-2xl">
              <button
                type="submit"
                disabled={!cardReady || submitting || !!configError}
                className="w-full cursor-pointer rounded-xl bg-primary py-4 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Processing..." : "Submit"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
