import { useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { inputClass, labelClass, sectionHeaderClass, primaryButtonClass } from "../../lib/bookingTypes";
import { useLocations, resolveRouteFare } from "../../lib/useLocations";
import { useBookingCart } from "../../contexts/BookingCartContext";
import { usePricingSettings, calculateServiceFee, isInquiryOnlyPickup } from "../../lib/pricingUtils";
import type { AirportLeg } from "../../lib/cartTypes";
import CommonAirports from "./CommonAirports";
import CommonTimeSlots from "./CommonTimeSlots";
import CommonPassengers from "./CommonPassengers";
import LoaderAnimation from "../LoaderAnimation";

interface AirportFormState {
  adults: string;
  airline: string;
  arrival: string;
  bookingType: "AS" | "AP";
  comments: string;
  dropoffLoc: string;
  flightNum: string;
  pickupDate: string;
  pickupLoc: string;
  pickupTime: string;
  transferType: string;
}

const initialFormData: AirportFormState = {
  adults: "2",
  airline: "",
  arrival: "",
  bookingType: "AS",
  comments: "",
  dropoffLoc: "",
  flightNum: "",
  pickupDate: "",
  pickupLoc: "",
  pickupTime: "",
  transferType: "",
};

interface AirportProps {
  onComplete: (leg: AirportLeg) => void;
  onInquiryRedirect?: () => void;
}

export default function Airport({ onComplete, onInquiryRedirect }: AirportProps) {
  const { groupA: propertyLocations, groupB: airportLocations, isLoading: locationsLoading } = useLocations("Hotel", "Airport");
  const { settings, isLoading: pricingLoading } = usePricingSettings();
  const { guestInfo, updateGuestInfo, setLastHotel } = useBookingCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState<AirportFormState>(initialFormData);
  const [contact, setContact] = useState({ fName: guestInfo.fName, lName: guestInfo.lName, email: guestInfo.email, phone: guestInfo.phone });

  const updateFormData = (newData: Partial<AirportFormState>) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
  };

  const selectedAirport = formData.bookingType === "AP" ? formData.pickupLoc : formData.dropoffLoc;
  const inquiryBlocked = formData.bookingType === "AP" && !!selectedAirport && isInquiryOnlyPickup(selectedAirport, settings);

  const airportHandleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (formData.bookingType === "AS") {
      updateFormData({ dropoffLoc: e.target.value });
    } else {
      updateFormData({ pickupLoc: e.target.value });
    }
  };

  const propertyHandleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (formData.bookingType === "AS") {
      updateFormData({ pickupLoc: e.target.value });
    } else {
      updateFormData({ dropoffLoc: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inquiryBlocked) return;
    setMessage("");
    try {
      setIsSubmitting(true);
      const fare = await resolveRouteFare(formData.pickupLoc, formData.dropoffLoc, formData.adults);
      if (!fare) {
        setMessage("The chosen route is unavailable. Please select a different route.");
        return;
      }
      const passengers = parseInt(formData.adults, 10);
      const fee = calculateServiceFee(formData.pickupLoc, passengers, settings);
      updateGuestInfo(contact);
      const hotel = formData.bookingType === "AS" ? formData.pickupLoc : formData.dropoffLoc;
      if (hotel) setLastHotel(hotel);
      const leg: AirportLeg = {
        id: crypto.randomUUID(),
        legType: "airport",
        ...formData,
        perPersonPrice: fare.perPersonPrice,
        totalPrice: fare.totalPrice + fee,
        serviceFee: fee,
      };
      onComplete(leg);
    } catch (error) {
      console.error("Error checking route or submitting booking:", error);
      alert("Failed to submit booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (locationsLoading || pricingLoading || isSubmitting) return <LoaderAnimation />;

  return (
    <div className="space-y-7">
      <div className={sectionHeaderClass}>
        <p className="text-lg">Book your reservation</p>
      </div>
      <form className="space-y-7" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <p className="text-sm text-body">Select Trip Type</p>
          <div className="flex flex-wrap gap-6 sm:gap-10">
            <div className="inline-flex items-center">
              <label className="relative flex cursor-pointer items-center" htmlFor="to">
                <input
                  name="radio"
                  type="radio"
                  defaultChecked={formData.bookingType === "AS"}
                  onChange={() => updateFormData({ bookingType: "AS" })}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 transition-all checked:border-slate-400"
                  id="to"
                />
                <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary opacity-0 transition-opacity duration-200 peer-checked:opacity-100" />
              </label>
              <label className="ml-2 cursor-pointer text-sm text-slate-600" htmlFor="to">To airport</label>
            </div>
            <div className="inline-flex items-center">
              <label className="relative flex cursor-pointer items-center" htmlFor="from">
                <input
                  name="radio"
                  type="radio"
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 transition-all checked:border-slate-400"
                  id="from"
                  defaultChecked={formData.bookingType === "AP"}
                  onChange={() => updateFormData({ bookingType: "AP" })}
                />
                <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary opacity-0 transition-opacity duration-200 peer-checked:opacity-100" />
              </label>
              <label className="ml-2 cursor-pointer text-sm text-slate-600" htmlFor="from">From Airport</label>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="pickup_date" className={labelClass}>Pickup date</label>
          <input
            type="date"
            id="pickup_date"
            className={inputClass}
            value={formData.pickupDate}
            onChange={(e) => updateFormData({ pickupDate: e.target.value })}
            required
          />
        </div>

        <CommonTimeSlots updateFormData={updateFormData} formData={formData} />

        <div>
          <label htmlFor="transfer" className={labelClass}>Transfer type</label>
          <select
            id="transfer"
            className={inputClass}
            value={formData.transferType}
            onChange={(e) => updateFormData({ transferType: e.target.value })}
            required
          >
            <option value="" disabled>Select Transfer Type</option>
            <option value="One Way">One way</option>
            <option value="Tow Way">Roundtrip</option>
          </select>
        </div>

        <div className={sectionHeaderClass}>
          <p className="text-lg">Personal Information</p>
        </div>

        <div>
          <label htmlFor="first_name" className={labelClass}>First Name</label>
          <input
            type="text"
            id="first_name"
            className={inputClass}
            placeholder="First Name"
            value={contact.fName}
            onChange={(e) => setContact({ ...contact, fName: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="last_name" className={labelClass}>Last Name</label>
          <input
            type="text"
            id="last_name"
            className={inputClass}
            placeholder="Last Name"
            value={contact.lName}
            onChange={(e) => setContact({ ...contact, lName: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>Email Address</label>
          <input
            type="email"
            id="email"
            className={inputClass}
            placeholder="john.doe@example.com"
            value={contact.email}
            onChange={(e) => setContact({ ...contact, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>Phone No</label>
          <input
            type="tel"
            id="phone"
            className={inputClass}
            placeholder="Phone #"
            value={contact.phone}
            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="comments" className={labelClass}>Comments</label>
          <textarea
            id="comments"
            rows={4}
            className={inputClass}
            placeholder="Comments"
            value={formData.comments}
            onChange={(e) => updateFormData({ comments: e.target.value })}
          />
        </div>

        <div className={sectionHeaderClass}>
          <p className="text-lg">No. Passengers</p>
        </div>
        <CommonPassengers
          value={formData.adults}
          onChange={(v) => updateFormData({ adults: v })}
          max={14}
        />

        <div className={sectionHeaderClass}>
          <p className="text-lg">Flight Details</p>
        </div>
        <div>
          <label htmlFor="flight_number" className={labelClass}>Flight Number</label>
          <input
            type="text"
            id="flight_number"
            className={inputClass}
            placeholder="Airline Number"
            value={formData.flightNum}
            onChange={(e) => updateFormData({ flightNum: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="arrival_time" className={labelClass}>
            {formData.bookingType === "AS" ? "Departure Time" : "Arrival Time"}
          </label>
          <input
            type="time"
            id="arrival_time"
            className={inputClass}
            value={formData.arrival}
            onChange={(e) => updateFormData({ arrival: e.target.value })}
            required
          />
        </div>
        <CommonAirports updateFormData={updateFormData} formData={formData} />
        <div>
          <label htmlFor="airport" className={labelClass}>Airport</label>
          <select
            id="airport"
            className={inputClass}
            value={formData.bookingType === "AS" ? formData.dropoffLoc : formData.pickupLoc}
            onChange={airportHandleChange}
            required
          >
            <option value="" disabled>
              Select {formData.bookingType === "AS" ? "drop off" : "pickup"} location
            </option>
            {airportLocations.map((location) => (
              <option key={location.id} value={location.locationName}>{location.locationName}</option>
            ))}
          </select>
        </div>

        {inquiryBlocked && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
            <FaExclamationTriangle className="mt-0.5 shrink-0 text-amber-600" size={18} />
            <div className="space-y-2">
              <p className="text-sm font-semibold text-amber-800">
                Pickups from {selectedAirport} require staff coordination.
              </p>
              <p className="text-sm text-amber-700">
                Please submit an inquiry and our team will arrange your transfer.
              </p>
              {onInquiryRedirect && (
                <button
                  type="button"
                  onClick={onInquiryRedirect}
                  className="mt-1 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                >
                  Submit an Inquiry
                </button>
              )}
            </div>
          </div>
        )}

        <div className={sectionHeaderClass}>
          <p className="text-lg">Location</p>
        </div>
        <div>
          <label htmlFor="pickup_location" className={labelClass}>
            {formData.bookingType === "AS" ? "Pickup" : "Drop off"} Location
          </label>
          <select
            id="pickup_location"
            className={inputClass}
            value={formData.bookingType === "AS" ? formData.pickupLoc : formData.dropoffLoc}
            onChange={propertyHandleChange}
            required
          >
            <option value="" disabled>Select Pickup Location</option>
            {propertyLocations.map((location) => (
              <option key={location.id} value={location.locationName}>{location.locationName}</option>
            ))}
          </select>
        </div>

        {message && (
          <p className="text-sm font-medium text-red-600 underline underline-offset-2">{message}</p>
        )}

        <button type="submit" className={primaryButtonClass} disabled={inquiryBlocked}>
          Confirm Reservation
        </button>
      </form>
    </div>
  );
}
