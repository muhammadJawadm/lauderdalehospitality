const DEPARTURE_SLOTS = ["9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM", "12:00 PM","12:30 PM", "1:00 PM"];

const selectClass =
  "bg-white border border-gray-200 text-ink text-sm rounded-lg disabled:text-gray-300 disabled:cursor-not-allowed disabled:border-gray-100 outline-none focus:border-primary block w-full px-3.5 py-2.5 placeholder:text-sm placeholder:font-medium";
const labelClass = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-body";

interface CommonDepartureTimeProps {
  updateFormData: (data: Record<string, unknown>) => void;
  formData: { departureTime: string };
}

export default function CommonDepartureTime({ updateFormData, formData }: CommonDepartureTimeProps) {
  return (
    <div>
      <label htmlFor="departure_time" className={labelClass}>Departure Time</label>
      <select
        id="departure_time"
        className={selectClass}
        value={formData.departureTime}
        onChange={(e) => updateFormData({ departureTime: e.target.value })}
        required
      >
        <option value="" disabled>Select Time</option>
        {DEPARTURE_SLOTS.map((slot) => (
          <option key={slot} value={slot}>{slot}</option>
        ))}
      </select>
    </div>
  );
}
