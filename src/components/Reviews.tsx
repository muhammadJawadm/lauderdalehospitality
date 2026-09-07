import { FaQuoteRight, FaStar } from "react-icons/fa";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const TESTIMONIALS = [
  {
    name: "Margaret S.",
    role: "Travel Agent Partner",
    quote:
      "Good day, I want to let you know how pleased we were with your service while staying at the Ft Lauderdale Embassy Suites. We scheduled a pickup for October 2nd at the cruise port to be taken to the Ft. Lauderdale Airport, I received a call as I was told and the driver was there at the agreed upon time and place. This could not have gone any smoother!",
  },
  {
    name: "John D.",
    role: "Frequent Traveler",
    quote:
      "We recently used your services to go to the port from Miami and then return to the airport after going off the ship. We were especially pleased with your service and would like to use your services again in the future.",
  },
];

export default function Reviews() {
  return (
    <section id="reviews" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-lg font-bold uppercase tracking-widest text-primary">Reviews</span>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-ink sm:text-4xl">Testimonials</h2>
          <p className="mt-4 text-body">
            Hear what our satisfied passengers have to say about our professional, courteous, and
            timely services.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="relative rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex gap-0.5 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar key={i} size={13} />
                  ))}
                </div>
              <FaQuoteRight className="text-accent/45" size={32} />
              </div>
              <p className="mt-4 text-lg leading-relaxed text-body">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary-light to-primary-dark text-sm font-bold text-white">
                  {initials(t.name)}
                </div>
                <div>
                  <p className="font-display text-sm font-bold text-ink">{t.name}</p>
                  <p className="text-xs text-body">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
