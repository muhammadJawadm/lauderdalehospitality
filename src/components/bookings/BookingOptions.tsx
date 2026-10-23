import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlane, FaShip, FaQuestionCircle } from "react-icons/fa";
import { useBookingCart } from "../../contexts/BookingCartContext";
import type { AirportLeg, CruiseLeg, PostCruiseAirportLeg, PostCruiseHotelLeg, DepartureLeg } from "../../lib/cartTypes";
import Airport from "./Airport";
import CruisePort from "./CruisePort";
import Inquiries from "./Inquiries";
import PostCruiseAirport from "./PostCruiseAirport";
import PostCruiseHotel from "./PostCruiseHotel";
import DepartureTransfer from "./DepartureTransfer";
import BookingPrompt from "./BookingPrompt";

type Stage =
  | "select"
  | "airport-form"
  | "cruise-prompt"
  | "cruise-form"
  | "post-cruise-prompt"
  | "post-cruise-airport-form"
  | "post-cruise-hotel-form"
  | "hotel-departure-prompt"
  | "departure-form"
  | "inquiries";

const TABS = [
  { stage: "airport-form" as const, label: "Airport", icon: FaPlane },
  { stage: "cruise-form" as const, label: "Cruise Port", icon: FaShip },
  { stage: "inquiries" as const, label: "Other Inquiries", icon: FaQuestionCircle },
];

export default function BookingOptions() {
  const [stage, setStage] = useState<Stage>("select");
  const { addLeg, lastHotel } = useBookingCart();
  const navigate = useNavigate();

  const finishToCart = () => navigate("/booking/cart");

  const handleAirportComplete = (leg: AirportLeg) => {
    addLeg(leg);
    // "From Airport" (AP) = arrival, i.e. the FLL-to-hotel scenario the cruise follow-up question applies to.
    setStage(leg.bookingType === "AP" ? "cruise-prompt" : "select");
    if (leg.bookingType !== "AP") finishToCart();
  };

  const handleCruiseComplete = (leg: CruiseLeg) => {
    addLeg(leg);
    // "To Cruise Port" (CS) = heading out on the cruise, i.e. where the post-cruise follow-up applies.
    if (leg.bookingType === "CS") {
      setStage("post-cruise-prompt");
    } else {
      finishToCart();
    }
  };

  const handlePostCruiseAirportComplete = (leg: PostCruiseAirportLeg) => {
    addLeg(leg);
    finishToCart();
  };

  const handlePostCruiseHotelComplete = (leg: PostCruiseHotelLeg) => {
    addLeg(leg);
    setStage("hotel-departure-prompt");
  };

  const handleDepartureComplete = (leg: DepartureLeg) => {
    addLeg(leg);
    finishToCart();
  };

  if (stage === "cruise-prompt") {
    return (
      <BookingPrompt
        question="Do you need transportation to the cruise port?"
        options={[
          { label: "Yes", onClick: () => setStage("cruise-form") },
          { label: "No", onClick: finishToCart },
        ]}
      />
    );
  }

  if (stage === "post-cruise-prompt") {
    return (
      <BookingPrompt
        question="Do you need transportation after your cruise?"
        options={[
          { label: "Return to FLL Airport", onClick: () => setStage("post-cruise-airport-form") },
          { label: "Return to a Hotel", onClick: () => setStage("post-cruise-hotel-form") },
          { label: "No additional transportation", onClick: finishToCart },
        ]}
      />
    );
  }

  if (stage === "hotel-departure-prompt") {
    return (
      <BookingPrompt
        question="Do you also need transportation from your hotel back to the airport?"
        options={[
          { label: "Yes", onClick: () => setStage("departure-form") },
          { label: "No", onClick: finishToCart },
        ]}
      />
    );
  }

  if (stage === "airport-form") {
    return <div className="w-full max-w-202.5"><Airport onComplete={handleAirportComplete} /></div>;
  }
  if (stage === "cruise-form") {
    return <div className="w-full max-w-202.5"><CruisePort onComplete={handleCruiseComplete} prefillHotel={lastHotel} /></div>;
  }
  if (stage === "post-cruise-airport-form") {
    return <div className="w-full max-w-202.5"><PostCruiseAirport onComplete={handlePostCruiseAirportComplete} /></div>;
  }
  if (stage === "post-cruise-hotel-form") {
    return <div className="w-full max-w-202.5"><PostCruiseHotel onComplete={handlePostCruiseHotelComplete} /></div>;
  }
  if (stage === "departure-form") {
    return <div className="w-full max-w-202.5"><DepartureTransfer onComplete={handleDepartureComplete} prefillHotel={lastHotel} /></div>;
  }
  if (stage === "inquiries") {
    return <Inquiries />;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 sm:gap-5">
        {TABS.map(({ stage: tabStage, label, icon: Icon }) => (
          <button
            key={tabStage}
            type="button"
            onClick={() => setStage(tabStage)}
            className="flex max-w-37 flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded bg-white pb-2 pt-4 text-primary transition-colors sm:pt-6"
          >
            <Icon size={24} />
            <span className="text-center text-xs">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
