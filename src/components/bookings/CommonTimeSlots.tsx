const TIME_SLOTS = [
  "5:00 AM", "5:30 AM", "6:00 AM", "6:30 AM", "7:00 AM", "7:30 AM", "8:00 AM", "8:30 AM",
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
  "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM",
  "9:00 PM", "9:30 PM", "10:00 PM",
];

const selectClass =
  "bg-white border border-gray-200 text-ink text-sm rounded-lg disabled:text-gray-300 disabled:cursor-not-allowed disabled:border-gray-100 outline-none focus:border-primary block w-full px-3.5 py-2.5 placeholder:text-sm placeholder:font-medium";
const labelClass = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-body";

interface CommonTimeSlotsProps {
  updateFormData: (data: Record<string, unknown>) => void;
  formData: { pickupTime: string };
}

export default function CommonTimeSlots({ updateFormData, formData }: CommonTimeSlotsProps) {
  return (
    <div>
      <label htmlFor="time" className={labelClass}>Pickup time</label>
      <select
        id="time"
        className={selectClass}
        defaultValue={formData.pickupTime}
        onChange={(e) => updateFormData({ pickupTime: e.target.value })}
        required
      >
        <option value="" disabled>Select Time</option>
        {TIME_SLOTS.map((slot) => (
          <option key={slot} value={slot}>{slot}</option>
        ))}
      </select>
    </div>
  );
}
