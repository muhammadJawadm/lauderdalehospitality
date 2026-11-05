import { inputClass, labelClass } from "../../lib/bookingTypes";

interface CommonPassengersProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  id?: string;
}

export default function CommonPassengers({ value, onChange, label = "Passengers", id = "adults" }: CommonPassengersProps) {
  const options = Array.from({ length: 34 }, (_, i) => String(i + 2));

  return (
    <div>
      <label htmlFor={id} className={labelClass}>{label}</label>
      <select id={id} className={inputClass} value={value} onChange={(e) => onChange(e.target.value)} required>
        {options.map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>
    </div>
  );
}
