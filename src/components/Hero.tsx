import { FaPhoneAlt, FaShieldAlt, FaClock, FaStar } from "react-icons/fa";
import { PHONE_DISPLAY, PHONE_HREF } from "../lib/constants";
import heroBg from "../assets/hero-bg.jpg";

const BADGES = [
  { icon: FaShieldAlt, label: "Licensed & Insured" },
  { icon: FaClock, label: "24/7 Availability" },
  { icon: FaStar, label: "5-Star Chauffeurs" },
];

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-cover bg-center pt-40 pb-28 lg:pt-48 lg:pb-36"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      {/* Brand gradient fade over the photo */}
      <div className="pointer-events-none absolute inset-0 bg-primary-dark/40" />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent">
          South Florida's Premier Chauffeur Service
        </span>

        <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
          Book Your Transportation Now
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
          Reliable point-to-point transportation connecting all major transport hubs, hotels, and
          tourist destinations in South Florida.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#reserve"
            className="inline-flex items-center justify-center rounded-full bg-linear-to-br from-accent to-accent-dark px-8 py-4 text-sm font-bold text-ink shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(255,183,3,0.45)]"
          >
            Reserve Online
          </a>
          <a
            href={PHONE_HREF}
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/30 px-8 py-4 text-sm font-bold text-white transition-all hover:border-white hover:bg-white/10"
          >
            <FaPhoneAlt size={13} /> {PHONE_DISPLAY}
          </a>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {BADGES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-white/85">
              <Icon className="text-accent" size={16} />
              <span className="text-sm font-semibold">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
