import { useState } from "react";
import { FaPlane, FaShip, FaQuestionCircle } from "react-icons/fa";
import Airport from "./Airport";
import CruisePort from "./CruisePort";
import Inquiries from "./Inquiries";

const TABS = [
  { id: 1, label: "Airport", icon: FaPlane },
  { id: 2, label: "Cruise Port", icon: FaShip },
  { id: 3, label: "Inquiries", icon: FaQuestionCircle },
] as const;

export default function BookingOptions() {
  const [selectedOption, setSelectedOption] = useState(1);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 sm:gap-5">
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = selectedOption === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setSelectedOption(id)}
              className={`flex max-w-[148px] flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded pb-2 pt-4 transition-colors sm:pt-6 ${
                active ? "bg-primary text-white" : "bg-white text-primary"
              }`}
            >
              <Icon size={24} />
              <span className="text-center text-xs">{label}</span>
            </button>
          );
        })}
      </div>

      {selectedOption === 1 && (
        <div className="w-full max-w-[810px]">
          <Airport />
        </div>
      )}
      {selectedOption === 2 && (
        <div className="w-full max-w-[810px]">
          <CruisePort />
        </div>
      )}
      {selectedOption === 3 && <Inquiries />}
    </div>
  );
}
