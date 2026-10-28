import { useNavigate } from "react-router-dom";
import { FaTrash, FaPlus, FaShoppingCart } from "react-icons/fa";
import BookingHeader from "../components/bookings/BookingHeader";
import { useBookingCart } from "../contexts/BookingCartContext";
import { LEG_TYPE_LABELS, legDateTime } from "../lib/cartTypes";
import { inputClass, labelClass, primaryButtonClass } from "../lib/bookingTypes";

export default function BookingCart() {
  const { legs, guestInfo, updateGuestInfo, removeLeg, totalPrice } = useBookingCart();
  const navigate = useNavigate();

  const totalServiceFees = legs.reduce((sum, leg) => sum + (leg.serviceFee || 0), 0);
  const fareTotal = totalPrice - totalServiceFees;

  return (
    <div className="min-h-screen bg-bg-light">
      <BookingHeader />
      <div className="mx-auto max-w-5xl space-y-8 px-6 py-14">
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
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <FaShoppingCart className="mx-auto text-gray-300" size={40} />
            <p className="mt-4 font-display text-lg font-semibold text-ink">No transfers yet</p>
            <p className="mt-1 text-sm text-body">Add a transfer to get started with your booking.</p>
            <button
              type="button"
              onClick={() => navigate("/booking")}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              <FaPlus size={12} /> Book a Transfer
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {legs.map((leg, i) => {
                const { date, time } = legDateTime(leg);
                const pax = parseInt(leg.adults, 10);
                const fareOnly = leg.perPersonPrice * pax;
                return (
                  <div key={leg.id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <div className="flex items-center justify-between bg-gray-50 px-6 py-3">
                      <p className="font-display text-sm font-bold uppercase tracking-wide text-primary">
                        {i + 1}. {LEG_TYPE_LABELS[leg.legType]}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeLeg(leg.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        aria-label="Remove transfer"
                      >
                        <FaTrash size={13} />
                      </button>
                    </div>
                    <div className="space-y-3 px-6 py-5">
                      <p className="text-sm font-semibold text-ink">
                        {leg.pickupLoc} &rarr; {leg.dropoffLoc}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-body">
                        {date && <span>{date}</span>}
                        {time && <span>{time}</span>}
                        <span>{leg.adults} passenger{pax !== 1 ? "s" : ""}</span>
                        {leg.legType === "airport" && leg.airline && (
                          <span>{leg.airline} &middot; Flight {leg.flightNum}</span>
                        )}
                        {leg.legType === "cruise" && leg.cruiseLine && (
                          <span>{leg.cruiseLine} &middot; {leg.cruiseShip}</span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-gray-100 pt-3 text-sm">
                        <span className="text-body">
                          ${leg.perPersonPrice}/person &times; {leg.adults} = ${fareOnly}
                        </span>
                        {leg.serviceFee > 0 && (
                          <span className="text-body">+ ${leg.serviceFee} service fee</span>
                        )}
                        <span className="ml-auto font-display text-lg font-bold text-ink">${leg.totalPrice}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => navigate("/booking")}
              className="inline-flex items-center gap-2 rounded-full border-2 border-gray-200 px-6 py-3 text-sm font-bold text-ink transition-colors hover:border-primary hover:text-primary"
            >
              <FaPlus size={12} /> Add Another Transfer
            </button>

            <div className="rounded-2xl bg-primary px-7 py-6 text-white">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-white/70">
                  <span>Fare Total</span>
                  <span>${fareTotal}</span>
                </div>
                {totalServiceFees > 0 && (
                  <div className="flex justify-between text-sm text-white/70">
                    <span>Service Fees</span>
                    <span>${totalServiceFees}</span>
                  </div>
                )}
                <div className="flex items-end justify-between border-t border-white/20 pt-3">
                  <span className="text-xs font-bold uppercase tracking-wide text-white/70">Grand Total</span>
                  <span className="font-display text-2xl font-extrabold">${totalPrice}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/booking/checkout")}
              disabled={legs.length === 0}
              className={primaryButtonClass}
            >
              Proceed to Checkout ({legs.length} transfer{legs.length !== 1 ? "s" : ""})
            </button>
          </>
        )}
      </div>
    </div>
  );
}
