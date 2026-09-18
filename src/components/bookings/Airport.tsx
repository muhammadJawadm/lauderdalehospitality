import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebase";
import { inputClass, labelClass, sectionHeaderClass, primaryButtonClass, type LocationDoc } from "../../lib/bookingTypes";
import CommonAirports from "./CommonAirports";
import CommonTimeSlots from "./CommonTimeSlots";
import LoaderAnimation from "../LoaderAnimation";

interface AirportFormData {
  adults: string;
  airline: string;
  arrival: string;
  bookingType: "AS" | "AP";
  comments: string;
  dropoffLoc: string;
  email: string;
  fName: string;
  flightNum: string;
  lName: string;
  phone: string;
  pickupDate: string;
  pickupLoc: string;
  pickupTime: string;
  totalPrice: string;
  transferType: string;
}

const initialFormData: AirportFormData = {
  adults: "",
  airline: "",
  arrival: "",
  bookingType: "AS",
  comments: "",
  dropoffLoc: "",
  email: "",
  fName: "",
  flightNum: "",
  lName: "",
  phone: "",
  pickupDate: "",
  pickupLoc: "",
  pickupTime: "",
  totalPrice: "",
  transferType: "",
};

export default function Airport() {
  const [propertyLocations, setPropertyLocations] = useState<LocationDoc[]>([]);
  const [airportLocations, setAirportLocations] = useState<LocationDoc[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState<AirportFormData>(initialFormData);

  const fetchLocations = async () => {
    try {
      setIsLoading(true);
      const querySnapshot = await getDocs(
        query(collection(db, "locations"), where("locationType", "in", ["Hotel", "Airport"]))
      );
      const propertyData: LocationDoc[] = [];
      const airportData: LocationDoc[] = [];
      querySnapshot.docs.forEach((doc) => {
        const location = { id: doc.id, ...doc.data() } as LocationDoc;
        if (location.locationType === "Hotel") {
          propertyData.push(location);
        } else if (location.locationType === "Airport") {
          airportData.push(location);
        }
      });
      setPropertyLocations(propertyData);
      setAirportLocations(airportData);
    } catch (error) {
      console.error("Error fetching locations: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (newData: Partial<AirportFormData>) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
  };

  const router = useNavigate();

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
    setMessage("");
    try {
      setIsLoading(true);
      const routesCollectionRef = collection(db, "routes");
      const query1 = query(
        routesCollectionRef,
        where("routeFrom", "==", formData.pickupLoc),
        where("routeTo", "==", formData.dropoffLoc)
      );
      const query2 = query(
        routesCollectionRef,
        where("routeFrom", "==", formData.dropoffLoc),
        where("routeTo", "==", formData.pickupLoc)
      );
      const [snapshot1, snapshot2] = await Promise.all([getDocs(query1), getDocs(query2)]);
      const existingRoute = snapshot1.docs[0] || snapshot2.docs[0];
      if (!existingRoute) {
        setMessage("The chosen route is unavailable. Please select a different route.");
        return;
      }
      const routeData = existingRoute.data();
      const perPerson = parseInt(routeData?.routeFare);
      const totalFare = perPerson * parseInt(formData.adults);
      const finaldata = { ...formData, perPersonPrice: perPerson, totalPrice: totalFare };
      router("/booking/details", { state: finaldata });
    } catch (error) {
      console.error("Error checking route or submitting booking:", error);
      alert("Failed to submit booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  if (isLoading) return <LoaderAnimation />;

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
            <option value="Tow Way">Two way</option>
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
            value={formData.fName}
            onChange={(e) => updateFormData({ fName: e.target.value })}
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
            value={formData.lName}
            onChange={(e) => updateFormData({ lName: e.target.value })}
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
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
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
            value={formData.phone}
            onChange={(e) => updateFormData({ phone: e.target.value })}
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
            required
          />
        </div>

        <div className={sectionHeaderClass}>
          <p className="text-lg">No. Passengers</p>
        </div>
        <div>
          <label htmlFor="adults" className={labelClass}>Passengers</label>
          <input
            type="number"
            id="adults"
            min={1}
            className={inputClass}
            placeholder="1"
            value={formData.adults}
            onChange={(e) => updateFormData({ adults: e.target.value })}
            required
          />
        </div>

        <div className={sectionHeaderClass}>
          <p className="text-lg">Airline Details</p>
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
        {formData.bookingType === "AS" && (
          <CommonAirports updateFormData={updateFormData} formData={formData} />
        )}
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

        <button type="submit" className={primaryButtonClass}>Confirm Reservation</button>
      </form>
    </div>
  );
}
