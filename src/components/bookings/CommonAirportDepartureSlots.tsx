import { inputClass, labelClass } from "../../lib/bookingTypes";

const SLOTS = [
  "4:00 AM", "5:00 AM", "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM",
  "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM",
];

interface CommonAirportDepartureSlotsProps {
  updateFormData: (data: Record<string, unknown>) => void;
  formData: { pickupTime: string };
}

export default function CommonAirportDepartureSlots({ updateFormData, formData }: CommonAirportDepartureSlotsProps) {
  return (
    <div>
      <label htmlFor="pickup_time" className={labelClass}>Pickup Time</label>
      <select
        id="pickup_time"
        className={inputClass}
        value={formData.pickupTime}
        onChange={(e) => updateFormData({ pickupTime: e.target.value })}
        required
      >
        <option value="" disabled>Select Time</option>
        {SLOTS.map((slot) => (
          <option key={slot} value={slot}>{slot}</option>
        ))}
      </select>
    </div>
  );
}
