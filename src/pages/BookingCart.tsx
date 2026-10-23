import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import BookingHeader from "../components/bookings/BookingHeader";
import { useBookingCart } from "../contexts/BookingCartContext";
import { LEG_TYPE_LABELS, legDateTime } from "../lib/cartTypes";
import { inputClass, labelClass, primaryButtonClass } from "../lib/bookingTypes";
import type { BookingState } from "../lib/bookingTypes";

export default function BookingCart() {
  const { legs, guestInfo, updateGuestInfo, removeLeg, totalPrice } = useBookingCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (legs.length !== 1) return;
    const leg = legs[0];
    // Reuses the existing single-booking Details -> Summary -> Checkout pipeline unchanged.
    const booking: BookingState = {
      bookingType: leg.legType === "airport" || leg.legType === "cruise" ? leg.bookingType : "AP",
      adults: leg.adults,
      fName: guestInfo.fName,
      lName: guestInfo.lName,
      email: guestInfo.email,
      phone: guestInfo.phone,
      comments: leg.comments,
      pickupLoc: leg.pickupLoc,
      dropoffLoc: leg.dropoffLoc,
      transferType: "transferType" in leg ? leg.transferType : "One Way",
      perPersonPrice: leg.perPersonPrice,
      totalPrice: leg.totalPrice,
      ...(leg.legType === "airport" && {
        pickupDate: leg.pickupDate,
        pickupTime: leg.pickupTime,
        airline: leg.airline,
        flightNum: leg.flightNum,
        arrival: leg.arrival,
      }),
      ...(leg.legType === "cruise" && {
        cruiseDate: leg.cruiseDate,
        cruiseLine: leg.cruiseLine,
        cruiseShip: leg.cruiseShip,
        departureTime: leg.departureTime,
        returnTrip: leg.returnTrip,
      }),
      ...(leg.legType === "post-cruise-airport" && { cruiseShip: leg.cruiseShip, airline: leg.airline }),
      ...(leg.legType === "post-cruise-hotel" && { cruiseShip: leg.cruiseShip }),
      ...(leg.legType === "departure" && { pickupDate: leg.departureDate, pickupTime: leg.pickupTime, airline: leg.airline }),
    };
    navigate("/booking/details", { state: booking });
  };

  return (
    <div className="min-h-screen bg-bg-light">
      <BookingHeader />
      <div className="mx-auto max-w-5xl space-y-10 px-6 py-14">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Review</span>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-ink">Your Transfers</h1>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm">
          <h3 className="font-display text-lg font-bold text-ink">Contact Information</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>First Name</label>
              <input className={inputClass} value={guestInfo.fName} onChange={(e) => updateGuestInfo({ fName: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Last Name</label>
              <input className={inputClass} value={guestInfo.lName} onChange={(e) => updateGuestInfo({ lName: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input className={inputClass} value={guestInfo.email} onChange={(e) => updateGuestInfo({ email: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input className={inputClass} value={guestInfo.phone} onChange={(e) => updateGuestInfo({ phone: e.target.value })} />
            </div>
          </div>
        </div>

        {legs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <p className="text-body">You haven&apos;t added any transfers yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {legs.map((leg) => {
              const { date, time } = legDateTime(leg);
              return (
                <div key={leg.id} className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-display text-sm font-bold uppercase tracking-wide text-primary">{LEG_TYPE_LABELS[leg.legType]}</p>
                    <p className="mt-1 text-sm text-ink">
                      {leg.pickupLoc} &rarr; {leg.dropoffLoc}
                    </p>
                    <p className="mt-1 text-xs text-body">
                      {date && <>{date} &middot; </>}
                      {time && <>{time} &middot; </>}
                      {leg.adults} passenger{leg.adults !== "1" ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-display text-lg font-bold text-ink">${leg.totalPrice}</p>
                    <button
                      type="button"
                      onClick={() => removeLeg(leg.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-50"
                      aria-label="Remove transfer"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex flex-col gap-4 rounded-2xl bg-primary px-7 py-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-white/70">Reservation Total</p>
            <p className="font-display text-2xl font-extrabold">${totalPrice}</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/booking")}
            className="rounded-full border-2 border-white/40 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
          >
            + Add Another Transfer
          </button>
        </div>

        {legs.length > 1 ? (
          <p className="rounded-xl bg-accent/15 px-5 py-4 text-sm text-ink">
            Combined checkout for multiple transfers is coming soon. For now, please remove transfers down to one at
            a time to check out, or check back shortly.
          </p>
        ) : (
          <button
            type="button"
            onClick={handleCheckout}
            disabled={legs.length !== 1}
            className={primaryButtonClass}
          >
            Proceed to Checkout
          </button>
        )}
      </div>
    </div>
  );
}
