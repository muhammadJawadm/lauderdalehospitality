import { useState } from "react";
import { inputClass, labelClass, sectionHeaderClass, primaryButtonClass } from "../../lib/bookingTypes";
import { useLocations, resolveRouteFare } from "../../lib/useLocations";
import { useBookingCart } from "../../contexts/BookingCartContext";
import type { DepartureLeg } from "../../lib/cartTypes";
import CommonAirports from "./CommonAirports";
import CommonAirportDepartureSlots from "./CommonAirportDepartureSlots";
import CommonPassengers from "./CommonPassengers";
import LoaderAnimation from "../LoaderAnimation";

interface FormState {
  comments: string;
  adults: string;
  departureDate: string;
  pickupTime: string;
  airline: string;
  pickupLoc: string;
  dropoffLoc: string;
}

interface DepartureTransferProps {
  onComplete: (leg: DepartureLeg) => void;
  /** Prefills the hotel pickup location, e.g. the hotel just dropped off at on an earlier Post-Cruise leg. */
  prefillHotel?: string;
}

export default function DepartureTransfer({ onComplete, prefillHotel }: DepartureTransferProps) {
  const { groupA: hotelLocations, groupB: airportLocations, isLoading: locationsLoading } = useLocations("Hotel", "Airport");
  const { guestInfo, updateGuestInfo } = useBookingCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState<FormState>({
    comments: "", adults: "2", departureDate: "", pickupTime: "", airline: "",
    pickupLoc: prefillHotel ?? "", dropoffLoc: "",
  });
  const [contact, setContact] = useState({ fName: guestInfo.fName, lName: guestInfo.lName, email: guestInfo.email, phone: guestInfo.phone });

  const updateFormData = (newData: Partial<FormState>) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      setIsSubmitting(true);
      const fare = await resolveRouteFare(formData.pickupLoc, formData.dropoffLoc, formData.adults);
      if (!fare) {
        setMessage("The chosen route is unavailable. Please select a different route.");
        return;
      }
      updateGuestInfo(contact);
      const leg: DepartureLeg = {
        id: crypto.randomUUID(),
        legType: "departure",
        ...formData,
        ...fare,
        serviceFee: 0,
      };
      onComplete(leg);
    } catch (error) {
      console.error("Error checking route or submitting booking:", error);
      alert("Failed to submit booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (locationsLoading || isSubmitting) return <LoaderAnimation />;

  return (
    <div className="space-y-7">
      <div className={sectionHeaderClass}>
        <p className="text-lg">Hotel &rarr; Airport Departure</p>
      </div>
      <form className="space-y-7" onSubmit={handleSubmit}>
        <div className={sectionHeaderClass}>
          <p className="text-lg">Personal Information</p>
        </div>
        <div>
          <label htmlFor="first_name" className={labelClass}>First Name</label>
          <input type="text" id="first_name" className={inputClass} value={contact.fName} onChange={(e) => setContact({ ...contact, fName: e.target.value })} required />
        </div>
        <div>
          <label htmlFor="last_name" className={labelClass}>Last Name</label>
          <input type="text" id="last_name" className={inputClass} value={contact.lName} onChange={(e) => setContact({ ...contact, lName: e.target.value })} required />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input type="email" id="email" className={inputClass} value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} required />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>Phone #</label>
          <input type="tel" id="phone" className={inputClass} value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} required />
        </div>

        <div className={sectionHeaderClass}>
          <p className="text-lg">Departure Details</p>
        </div>
        <div>
          <label htmlFor="departure_date" className={labelClass}>Date of Departure</label>
          <input type="date" id="departure_date" className={inputClass} value={formData.departureDate} onChange={(e) => updateFormData({ departureDate: e.target.value })} required />
        </div>
        <CommonAirportDepartureSlots updateFormData={updateFormData} formData={formData} />
        <CommonAirports updateFormData={updateFormData} formData={formData} />

        <div className={sectionHeaderClass}>
          <p className="text-lg">No. Passengers</p>
        </div>
        <CommonPassengers value={formData.adults} onChange={(v) => updateFormData({ adults: v })} />

        <div className={sectionHeaderClass}>
          <p className="text-lg">Location</p>
        </div>
        <div>
          <label htmlFor="hotel" className={labelClass}>Pickup Hotel</label>
          <select
            id="hotel"
            className={inputClass}
            value={formData.pickupLoc}
            onChange={(e) => updateFormData({ pickupLoc: e.target.value })}
            required
          >
            <option value="" disabled>Select pickup hotel</option>
            {hotelLocations.map((location) => (
              <option key={location.id} value={location.locationName}>{location.locationName}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="airport" className={labelClass}>Airport</label>
          <select
            id="airport"
            className={inputClass}
            value={formData.dropoffLoc}
            onChange={(e) => updateFormData({ dropoffLoc: e.target.value })}
            required
          >
            <option value="" disabled>Select airport</option>
            {airportLocations.map((location) => (
              <option key={location.id} value={location.locationName}>{location.locationName}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="comments" className={labelClass}>Comments</label>
          <textarea id="comments" rows={4} className={inputClass} value={formData.comments} onChange={(e) => updateFormData({ comments: e.target.value })} />
        </div>

        {message && (
          <p className="text-sm font-medium text-red-600 underline underline-offset-2">{message}</p>
        )}

        <button type="submit" className={primaryButtonClass}>Confirm Reservation</button>
      </form>
    </div>
  );
}
