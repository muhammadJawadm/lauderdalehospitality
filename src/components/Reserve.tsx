import { useState } from "react";
import { FaMapMarkerAlt, FaCheckCircle, FaCcPaypal, FaCcStripe } from "react-icons/fa";

const STEPS = ["Ride Details", "Contact Details", "Booking Summary"];

interface RideDetails {
  pickupDate: string;
  pickupTime: string;
  waypoint: string;
  pickupLocation: string;
  dropoffLocation: string;
  transferType: "one-way" | "return" | "return-new";
  returnDate: string;
  returnTime: string;
  adults: number;
  children: number;
}

interface ContactDetails {
  name: string;
  phone: string;
  email: string;
  notes: string;
}

const initialRide: RideDetails = {
  pickupDate: "",
  pickupTime: "",
  waypoint: "",
  pickupLocation: "",
  dropoffLocation: "",
  transferType: "one-way",
  returnDate: "",
  returnTime: "",
  adults: 1,
  children: 0,
};

const initialContact: ContactDetails = { name: "", phone: "", email: "", notes: "" };

export default function Reserve() {
  const [step, setStep] = useState(0);
  const [ride, setRide] = useState<RideDetails>(initialRide);
  const [contact, setContact] = useState<ContactDetails>(initialContact);
  const [payment, setPayment] = useState<"paypal" | "stripe">("stripe");
  const [submitted, setSubmitted] = useState(false);

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-primary";
  const labelClass = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-body";

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section id="reserve" className="bg-bg-light py-24">
        <div className="mx-auto max-w-lg px-6 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <FaCheckCircle size={28} />
          </span>
          <h2 className="mt-6 font-display text-2xl font-extrabold text-ink">Booking Request Sent Successfully!</h2>
          <p className="mt-3 text-sm text-body">
            Thanks, {contact.name || "there"}. Our team will confirm your reservation shortly at{" "}
            {contact.email || "your email"}.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setStep(0);
              setRide(initialRide);
              setContact(initialContact);
            }}
            className="mt-8 inline-flex items-center justify-center rounded-full bg-linear-to-br from-primary to-primary-dark px-7 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
          >
            Book Another Ride
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="reserve" className="bg-bg-light py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Instant Reservations</span>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-ink sm:text-4xl">Reserve Online</h2>
          <p className="mt-4 text-body">
            Skip the phone call &mdash; book your ride in minutes with our secure online reservation form.
          </p>
        </div>

        {/* Step indicator */}
        <div className="mx-auto mt-12 flex max-w-md items-center justify-between">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    i <= step ? "bg-primary text-white" : "bg-white text-body border border-gray-200"
                  }`}
                >
                  {i + 1}
                </div>
                <span className={`hidden text-[11px] font-semibold sm:block ${i <= step ? "text-ink" : "text-body"}`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`mx-2 h-0.5 flex-1 rounded-full transition-colors ${i < step ? "bg-primary" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-3xl bg-white p-6 shadow-md sm:p-9">
          {step === 0 && (
            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Pickup Date</label>
                  <input type="date" className={inputClass} value={ride.pickupDate} onChange={(e) => setRide({ ...ride, pickupDate: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Pickup Time</label>
                  <input type="time" className={inputClass} value={ride.pickupTime} onChange={(e) => setRide({ ...ride, pickupTime: e.target.value })} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Pickup Location</label>
                <div className="relative">
                  <FaMapMarkerAlt className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-primary" size={13} />
                  <input
                    type="text"
                    placeholder="e.g. Fort Lauderdale-Hollywood Intl (FLL)"
                    className={inputClass + " pl-9"}
                    value={ride.pickupLocation}
                    onChange={(e) => setRide({ ...ride, pickupLocation: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Drop-off Location</label>
                <div className="relative">
                  <FaMapMarkerAlt className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-accent-dark" size={13} />
                  <input
                    type="text"
                    placeholder="e.g. Hard Rock Hotel, Hollywood FL"
                    className={inputClass + " pl-9"}
                    value={ride.dropoffLocation}
                    onChange={(e) => setRide({ ...ride, dropoffLocation: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Waypoint (optional)</label>
                <input
                  type="text"
                  placeholder="Add a stop along the way"
                  className={inputClass}
                  value={ride.waypoint}
                  onChange={(e) => setRide({ ...ride, waypoint: e.target.value })}
                />
              </div>

              <div>
                <label className={labelClass}>Transfer Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    ["one-way", "One Way"],
                    ["return", "Return"],
                    ["return-new", "Return (new ride)"],
                  ] as const).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRide({ ...ride, transferType: value })}
                      className={`rounded-lg border px-3 py-2.5 text-xs font-bold transition-colors ${
                        ride.transferType === value
                          ? "border-primary bg-primary text-white"
                          : "border-gray-200 bg-white text-body hover:border-primary/40"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {ride.transferType !== "one-way" && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Return Date</label>
                    <input type="date" className={inputClass} value={ride.returnDate} onChange={(e) => setRide({ ...ride, returnDate: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>Return Time</label>
                    <input type="time" className={inputClass} value={ride.returnTime} onChange={(e) => setRide({ ...ride, returnTime: e.target.value })} />
                  </div>
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Adults</label>
                  <input
                    type="number"
                    min={1}
                    className={inputClass}
                    value={ride.adults}
                    onChange={(e) => setRide({ ...ride, adults: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Children</label>
                  <input
                    type="number"
                    min={0}
                    className={inputClass}
                    value={ride.children}
                    onChange={(e) => setRide({ ...ride, children: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="flex justify-between rounded-lg bg-bg-light px-4 py-3 text-xs font-semibold text-body">
                <span>Total distance: 0 mi</span>
                <span>Total time: 0 h 0 m</span>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Full Name</label>
                <input type="text" className={inputClass} value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input type="tel" className={inputClass} value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Email Address</label>
                  <input type="email" className={inputClass} value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Special Requests / Flight &amp; Cruise Details</label>
                <textarea
                  rows={3}
                  className={inputClass}
                  value={contact.notes}
                  onChange={(e) => setContact({ ...contact, notes: e.target.value })}
                />
              </div>

              <div>
                <label className={labelClass}>Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPayment("paypal")}
                    className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-bold transition-colors ${
                      payment === "paypal" ? "border-primary bg-primary/5 text-primary" : "border-gray-200 text-body"
                    }`}
                  >
                    <FaCcPaypal size={18} /> PayPal
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayment("stripe")}
                    className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-bold transition-colors ${
                      payment === "stripe" ? "border-primary bg-primary/5 text-primary" : "border-gray-200 text-body"
                    }`}
                  >
                    <FaCcStripe size={18} /> Stripe
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <SummaryRow label="Pickup" value={`${ride.pickupLocation || "—"} on ${ride.pickupDate || "—"} at ${ride.pickupTime || "—"}`} />
              <SummaryRow label="Drop-off" value={ride.dropoffLocation || "—"} />
              <SummaryRow label="Transfer Type" value={ride.transferType.replace("-", " ")} />
              <SummaryRow label="Passengers" value={`${ride.adults} adult(s), ${ride.children} child(ren)`} />
              <SummaryRow label="Contact" value={`${contact.name || "—"} · ${contact.phone || "—"} · ${contact.email || "—"}`} />
              <SummaryRow label="Payment" value={payment === "paypal" ? "PayPal" : "Stripe"} />
              <p className="pt-2 text-center text-xs text-body">You will be redirected to the payment page within 5 seconds.</p>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
            <button
              type="button"
              onClick={back}
              disabled={step === 0}
              className="rounded-full px-5 py-2.5 text-sm font-bold text-body transition-colors hover:text-ink disabled:opacity-0"
            >
              Back
            </button>
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={next}
                className="inline-flex items-center justify-center rounded-full bg-linear-to-br from-primary to-primary-dark px-7 py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center justify-center rounded-full bg-linear-to-br from-accent to-accent-dark px-7 py-2.5 text-sm font-bold text-ink transition-transform hover:-translate-y-0.5"
              >
                Confirm Booking
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-bg-light px-4 py-3">
      <span className="text-xs font-bold uppercase tracking-wide text-body">{label}</span>
      <span className="text-sm font-semibold capitalize text-ink">{value}</span>
    </div>
  );
}
