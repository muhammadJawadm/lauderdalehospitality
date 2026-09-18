import { Link, useLocation, Navigate } from "react-router-dom";
import BookingHeader from "../components/bookings/BookingHeader";
import type { BookingState } from "../lib/bookingTypes";

function SummaryRow({ label, value }: { label: string; value: string | number | undefined }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-base text-body sm:text-xl">{label}</p>
      <p className="break-words text-lg font-medium text-ink sm:text-2xl">{value}</p>
    </div>
  );
}

export default function BookingSummary() {
  const { state } = useLocation();
  const booking = state as BookingState | null;

  if (!booking) return <Navigate to="/booking" replace />;

  return (
    <div className="min-h-screen bg-bg-light">
      <BookingHeader />
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="space-y-8 sm:space-y-14">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.99996 14L4.34996 8.35C4.25835 8.25654 4.20703 8.13088 4.20703 8C4.20703 7.86912 4.25835 7.74346 4.34996 7.65L9.99996 2" stroke="#222222" strokeWidth="1.5" />
              </svg>
              <h5 className="font-display text-2xl font-semibold text-ink">Booking Summary</h5>
            </div>
            <Link to="/booking/checkout" state={booking}>
              <button className="cursor-pointer rounded-lg bg-primary px-8 py-3 font-medium text-white transition-colors hover:bg-primary-dark sm:px-14 sm:py-3.5">
                Checkout
              </button>
            </Link>
          </div>

          <div className="mx-auto max-w-[848px] space-y-8">
            <div className="rounded-lg bg-primary px-5 py-4 text-white sm:px-8 sm:py-6">
              <h5 className="font-display text-xl font-medium sm:text-2xl">Contact & Billing Details</h5>
            </div>
            <div className="space-y-4 rounded-xl bg-white px-5 py-6 shadow-lg sm:px-10">
              <SummaryRow label="First name" value={booking.fName} />
              <div className="border-b border-gray-100" />
              <SummaryRow label="Last name" value={booking.lName} />
              <div className="border-b border-gray-100" />
              <SummaryRow label="Email" value={booking.email} />
              <div className="border-b border-gray-100" />
              <SummaryRow label="Phone no" value={booking.phone} />
              <div className="border-b border-gray-100" />
              <SummaryRow label="Comments" value={booking.comments} />
              <div className="border-b border-gray-100" />
              <SummaryRow label="Passengers" value={booking.adults} />
            </div>

            <div className="rounded-lg bg-primary px-5 py-4 text-white sm:px-8 sm:py-6">
              <h5 className="font-display text-xl font-medium sm:text-2xl">Ride Details</h5>
            </div>
            <div className="space-y-4 rounded-xl bg-white px-5 py-6 shadow-lg sm:px-10">
              <SummaryRow label="Cost" value={booking.totalPrice} />
              <div className="border-b border-gray-100" />
              <SummaryRow label="Transfer Type" value={booking.transferType} />
              <div className="border-b border-gray-100" />
              <SummaryRow label="From" value={booking.pickupLoc} />
              <div className="border-b border-gray-100" />
              <SummaryRow label="To" value={booking.dropoffLoc} />
              <div className="border-b border-gray-100" />
              <SummaryRow label="Pickup Date" value={booking.pickupDate} />
              <div className="border-b border-gray-100" />
              <SummaryRow label="Pickup Time" value={booking.pickupTime} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
