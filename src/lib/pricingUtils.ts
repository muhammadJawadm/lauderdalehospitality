import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export interface PricingSettings {
  serviceFees: {
    smallGroupFee: number;
    largeGroupFee: number;
    largeGroupThreshold: number;
    triggerLocations: string[];
  };
  inquiryOnlyPickups: string[];
}

const DEFAULTS: PricingSettings = {
  serviceFees: {
    smallGroupFee: 6,
    largeGroupFee: 25,
    largeGroupThreshold: 15,
    triggerLocations: ["FLL"],
  },
  inquiryOnlyPickups: ["MIA", "PBI"],
};

export function usePricingSettings() {
  const [settings, setSettings] = useState<PricingSettings>(DEFAULTS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getDoc(doc(db, "settings", "pricing"))
      .then((snap) => {
        if (!cancelled && snap.exists()) {
          const data = snap.data();
          setSettings({
            serviceFees: { ...DEFAULTS.serviceFees, ...data.serviceFees },
            inquiryOnlyPickups: data.inquiryOnlyPickups ?? DEFAULTS.inquiryOnlyPickups,
          });
        }
      })
      .catch((e) => console.error("Failed to load pricing settings:", e))
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return { settings, isLoading };
}

export function calculateServiceFee(
  pickupLocName: string,
  passengers: number,
  settings: PricingSettings,
): number {
  const matches = settings.serviceFees.triggerLocations.some((t) =>
    pickupLocName.toUpperCase().includes(t.toUpperCase()),
  );
  if (!matches) return 0;
  return passengers >= settings.serviceFees.largeGroupThreshold
    ? settings.serviceFees.largeGroupFee
    : settings.serviceFees.smallGroupFee;
}

export function isInquiryOnlyPickup(
  locName: string,
  settings: PricingSettings,
): boolean {
  return settings.inquiryOnlyPickups.some((p) =>
    locName.toUpperCase().includes(p.toUpperCase()),
  );
}
