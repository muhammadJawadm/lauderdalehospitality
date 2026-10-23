import { inputClass, labelClass } from "../../lib/bookingTypes";

interface CommonPassengersProps {
  value: string;
  onChange: (value: string) => void;
  /** Highest exact count offered before a "15+" catch-all option. Defaults to 14 per the airport large-vehicle rule. */
  max?: number;
  label?: string;
  id?: string;
}

export default function CommonPassengers({ value, onChange, max = 14, label = "Passengers", id = "adults" }: CommonPassengersProps) {
  const options = Array.from({ length: max - 1 }, (_, i) => String(i + 2)); // 2..max

  return (
    <div>
      <label htmlFor={id} className={labelClass}>{label}</label>
      <select id={id} className={inputClass} value={value} onChange={(e) => onChange(e.target.value)} required>
        {options.map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
        <option value={`${max + 1}+`}>{max + 1}+</option>
      </select>
    </div>
  );
}
