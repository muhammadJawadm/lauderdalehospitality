import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import type { LocationDoc } from "./bookingTypes";

/**
 * Fetches Firestore `locations` docs split into two buckets by locationType.
 * Shared across all booking forms (Airport, Cruise Port, Post-Cruise, Departure)
 * so the fetch/split logic only lives in one place.
 */
export function useLocations(typeA: string, typeB: string) {
  const [groupA, setGroupA] = useState<LocationDoc[]>([]);
  const [groupB, setGroupB] = useState<LocationDoc[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchLocations = async () => {
      try {
        setIsLoading(true);
        const querySnapshot = await getDocs(
          query(collection(db, "locations"), where("locationType", "in", [typeA, typeB]))
        );
        const a: LocationDoc[] = [];
        const b: LocationDoc[] = [];
        querySnapshot.docs.forEach((doc) => {
          const location = { id: doc.id, ...doc.data() } as LocationDoc;
          if (location.locationType === typeA) a.push(location);
          else if (location.locationType === typeB) b.push(location);
        });
        if (!cancelled) {
          setGroupA(a);
          setGroupB(b);
        }
      } catch (error) {
        console.error("Error fetching locations: ", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchLocations();
    return () => {
      cancelled = true;
    };
  }, [typeA, typeB]);

  return { groupA, groupB, isLoading };
}

/** Looks up the per-person route fare between two locations and returns pricing for the given passenger count. */
export async function resolveRouteFare(pickupLoc: string, dropoffLoc: string, adults: string) {
  const routesCollectionRef = collection(db, "routes");
  const query1 = query(routesCollectionRef, where("routeFrom", "==", pickupLoc), where("routeTo", "==", dropoffLoc));
  const query2 = query(routesCollectionRef, where("routeFrom", "==", dropoffLoc), where("routeTo", "==", pickupLoc));
  const [snapshot1, snapshot2] = await Promise.all([getDocs(query1), getDocs(query2)]);
  const existingRoute = snapshot1.docs[0] || snapshot2.docs[0];
  if (!existingRoute) return null;

  const routeData = existingRoute.data();
  const perPersonPrice = parseInt(routeData?.routeFare);
  const totalPrice = perPersonPrice * parseInt(adults);
  return { perPersonPrice, totalPrice };
}
