import { useState } from "react";
import { inputClass, labelClass, sectionHeaderClass, primaryButtonClass } from "../../lib/bookingTypes";
import { useLocations, resolveRouteFare } from "../../lib/useLocations";
import { useBookingCart } from "../../contexts/BookingCartContext";
import type { PostCruiseAirportLeg } from "../../lib/cartTypes";
import CommonAirports from "./CommonAirports";
import CommonPassengers from "./CommonPassengers";
import LoaderAnimation from "../LoaderAnimation";

interface FormState {
  comments: string;
  adults: string;
  cruiseShip: string;
  airline: string;
  pickupLoc: string;
  dropoffLoc: string;
}

const initialFormData: FormState = {
  comments: "",
  adults: "2",
  cruiseShip: "",
  airline: "",
  pickupLoc: "",
  dropoffLoc: "",
};

export default function PostCruiseAirport({ onComplete }: { onComplete: (leg: PostCruiseAirportLeg) => void }) {
  const { groupA: cruisePortLocations, groupB: airportLocations, isLoading: locationsLoading } = useLocations("Port", "Airport");
  const { guestInfo, updateGuestInfo } = useBookingCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState<FormState>(initialFormData);
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
      const leg: PostCruiseAirportLeg = {
        id: crypto.randomUUID(),
        legType: "post-cruise-airport",
        ...formData,
        ...fare,
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
        <p className="text-lg">Cruise Port &rarr; Airport</p>
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
          <p className="text-lg">Cruise &amp; Flight Details</p>
        </div>
        <div>
          <label htmlFor="cruiseShip" className={labelClass}>Cruise Ship</label>
          <input type="text" id="cruiseShip" className={inputClass} placeholder="e.g. Icon of the Seas" value={formData.cruiseShip} onChange={(e) => updateFormData({ cruiseShip: e.target.value })} required />
        </div>
        <CommonAirports updateFormData={updateFormData} formData={formData} />

        <div className={sectionHeaderClass}>
          <p className="text-lg">No. Passengers</p>
        </div>
        <CommonPassengers value={formData.adults} onChange={(v) => updateFormData({ adults: v })} />

        <div className={sectionHeaderClass}>
          <p className="text-lg">Location</p>
        </div>
        <div>
          <label htmlFor="cruise_port" className={labelClass}>Cruise Port</label>
          <select
            id="cruise_port"
            className={inputClass}
            value={formData.pickupLoc}
            onChange={(e) => updateFormData({ pickupLoc: e.target.value })}
            required
          >
            <option value="" disabled>Select cruise port</option>
            {cruisePortLocations.map((location) => (
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
