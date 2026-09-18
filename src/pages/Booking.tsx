import BookingHeader from "../components/bookings/BookingHeader";
import BookingOptions from "../components/bookings/BookingOptions";

export default function Booking() {
  return (
    <div className="min-h-screen bg-bg-light">
      <BookingHeader />
      <div className="mx-auto max-w-6xl px-6 py-14">
        <BookingOptions />
      </div>
    </div>
  );
}
