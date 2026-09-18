const AIRLINES = [
  "Aerolineas Argentinas - AR", "Aeromexico - AM", "Air Canada - AC", "Aer Lingus - EI",
  "Air Europa - UX", "Air France - AF", "Alaska Airlines - AS", "American Airlines - AA",
  "Avianca - AV, TA", "Bahamasair - UP", "BOA-Boliviana de Aviacion - OB", "British Airways - BA",
  "Caribbean Airlines - BW", "Cayman Airways - KX", "COPA Airlines - CM", "CONDOR - DE",
  "Delta Air Lines - DL", "Eastern Airlines - 2D", "Eastern Air Express - HWA", "El Al - LY",
  "Emirates - EK", "Finnair - AY", "French Bee - BF", "Frontier Airlines - F9", "GlobalX - G6",
  "GOL - G3", "Iberia - IB", "ITA Airways - AZ", "JetBlue - B6", "KLM - KL",
  "LATAM Airlines - 4M, JJ, LA, LP, XP", "LOT Polish Airlines - LO", "Lufthansa - LH",
  "Norse Atlantic - NO, ZO", "Qatar - QR", "Porter Airlines - PD", "Red Air - L5",
  "Royal Air Maroc - AT", "SAS - SK", "Sky - H8", "Sky High Aviation Services Dominicana - SHH",
  "Southwest - WN", "Spirit - NK", "Sun Country - SY", "Surinam Airways - PY",
  "Swiss International - LX", "TAP Air Portugal - TP", "Turkish - TK", "United Airlines - UA",
  "Virgin Atlantic - VS", "Viva Aerobus - VB", "Volaris - Y4", "Volaris El Salvador - N3",
  "WestJet - WS", "World Atlantic - WAL",
];

const selectClass =
  "bg-white border border-gray-200 text-ink text-sm rounded-lg disabled:text-gray-300 disabled:cursor-not-allowed disabled:border-gray-100 outline-none focus:border-primary block w-full px-3.5 py-2.5 placeholder:text-sm placeholder:font-medium";
const labelClass = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-body";

interface CommonAirportsProps {
  updateFormData: (data: Record<string, unknown>) => void;
  formData: { airline: string };
}

export default function CommonAirports({ updateFormData, formData }: CommonAirportsProps) {
  return (
    <div>
      <label htmlFor="airline" className={labelClass}>
        Airline
      </label>
      <select
        id="airline"
        className={selectClass}
        defaultValue={formData.airline}
        onChange={(e) => updateFormData({ airline: e.target.value })}
        required
      >
        <option value="" disabled>Select an airline</option>
        {AIRLINES.map((airline) => (
          <option key={airline} value={airline}>{airline}</option>
        ))}
      </select>
    </div>
  );
}
