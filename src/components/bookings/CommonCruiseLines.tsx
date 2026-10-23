import { inputClass, labelClass } from "../../lib/bookingTypes";

// Starter list of major cruise lines sailing from South Florida ports.
// Swap in the client's exact list once confirmed.
const CRUISE_LINES = [
  "Royal Caribbean International",
  "Carnival Cruise Line",
  "Norwegian Cruise Line",
  "MSC Cruises",
  "Celebrity Cruises",
  "Disney Cruise Line",
  "Princess Cruises",
  "Holland America Line",
  "Virgin Voyages",
  "Oceania Cruises",
  "Regent Seven Seas Cruises",
];

interface CommonCruiseLinesProps {
  updateFormData: (data: Record<string, unknown>) => void;
  formData: { cruiseLine: string };
}

export default function CommonCruiseLines({ updateFormData, formData }: CommonCruiseLinesProps) {
  return (
    <div>
      <label htmlFor="cruiseLine" className={labelClass}>Cruise Line</label>
      <select
        id="cruiseLine"
        className={inputClass}
        value={formData.cruiseLine}
        onChange={(e) => updateFormData({ cruiseLine: e.target.value })}
        required
      >
        <option value="" disabled>Select a cruise line</option>
        {CRUISE_LINES.map((line) => (
          <option key={line} value={line}>{line}</option>
        ))}
      </select>
    </div>
  );
}
