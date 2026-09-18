import { Link, useLocation, Navigate } from "react-router-dom";
import BookingHeader from "../components/bookings/BookingHeader";
import { BOOKING_TYPE_LABELS, type BookingState } from "../lib/bookingTypes";

export default function BookingDetails() {
  const { state } = useLocation();
  const booking = state as BookingState | null;

  if (!booking) return <Navigate to="/booking" replace />;

  const isCruiseBooking = booking.bookingType === "CS" || booking.bookingType === "CP";

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
              <h5 className="font-display text-2xl font-semibold text-ink">Booking Details</h5>
            </div>
            <Link to="/booking/summary" state={booking}>
              <button className="cursor-pointer rounded-lg bg-primary px-8 py-3 font-medium text-white transition-colors hover:bg-primary-dark sm:px-14 sm:py-3.5">
                Next
              </button>
            </Link>
          </div>

          <div className="mx-auto max-w-[848px] space-y-8">
            <div className="flex items-center gap-2">
              <div className="size-[30px] shrink-0 rounded-full bg-primary" />
              <h5 className="font-display text-xl font-semibold text-ink">{BOOKING_TYPE_LABELS[booking.bookingType]}</h5>
            </div>

            <div className="rounded-lg border-l-4 border-primary bg-bg-light px-6 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-body"><span className="font-semibold text-ink">From:</span> {booking.pickupLoc}</p>
                  <p className="text-sm text-body"><span className="font-semibold text-ink">To:</span> {booking.dropoffLoc}</p>
                  <p className="text-sm text-body"><span className="font-semibold text-ink">Pickup:</span> {booking.pickupTime}</p>
                </div>
                <div>
                  <p className="text-sm text-body"><span className="font-semibold text-ink">Passengers:</span> {booking.adults}</p>
                  <p className="text-sm text-body"><span className="font-semibold text-ink">Date:</span> {booking.pickupDate}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6 rounded-xl bg-white px-5 py-6 shadow-lg sm:px-10">
              {isCruiseBooking ? (
                <div className="space-y-6">
                  <h5 className="font-display text-xl font-semibold text-ink">Cruise Details</h5>
                  <div className="flex flex-col items-center justify-around gap-5 text-center sm:flex-row">
                    <div className="space-y-3 sm:space-y-7">
                      <h5 className="font-display text-lg font-medium text-ink sm:text-2xl">Cruise Line / Ship</h5>
                      <p className="text-body">{booking.cruiseShip}</p>
                    </div>
                    <div className="space-y-3 sm:space-y-7">
                      <h5 className="font-display text-lg font-medium text-ink sm:text-2xl">Cruise Date</h5>
                      <p className="text-body">{booking.cruiseDate}</p>
                    </div>
                    <div className="space-y-3 sm:space-y-7">
                      <h5 className="font-display text-lg font-medium text-ink sm:text-2xl">Return Trip</h5>
                      <p className="text-body">{booking.returnTrip ? "Yes" : "No"}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <h5 className="font-display text-xl font-semibold text-ink">Airline Details</h5>
                  <div className="flex flex-col items-center justify-around gap-5 text-center sm:flex-row">
                    <div className="space-y-3 sm:space-y-7">
                      <h5 className="font-display text-lg font-medium text-ink sm:text-2xl">Airline code</h5>
                      <p className="text-body">{booking.airline}</p>
                    </div>
                    <div className="space-y-3 sm:space-y-7">
                      <h5 className="font-display text-lg font-medium text-ink sm:text-2xl">Flight #</h5>
                      <p className="text-body">{booking.flightNum}</p>
                    </div>
                    <div className="space-y-3 sm:space-y-7">
                      <h5 className="font-display text-lg font-medium text-ink sm:text-2xl">Arrival Time</h5>
                      <p className="text-body">{booking.arrival}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="border-b border-gray-100" />

              <div className="space-y-6">
                <h5 className="font-display text-xl font-semibold text-ink">Fare Details</h5>
                <div className="flex flex-col items-center justify-around gap-5 text-center sm:flex-row">
                  <div className="space-y-3 sm:space-y-7">
                    <h5 className="font-display text-lg font-medium text-ink sm:text-2xl">Base Fee</h5>
                    <p className="text-body">$ {booking.perPersonPrice}</p>
                  </div>
                  <div className="space-y-3 sm:space-y-7">
                    <h5 className="font-display text-lg font-medium text-ink sm:text-2xl">Total Cost</h5>
                    <p className="text-body">$ {booking.totalPrice}</p>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-100" />

              <Link to="/">
                <button className="w-full bg-red-500 py-4 text-sm font-semibold text-white transition-colors hover:bg-red-600">
                  Cancel Booking
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
