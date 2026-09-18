import { Link } from "react-router-dom";
import { FaPlane, FaShip, FaArrowRight } from "react-icons/fa";
import { PHONE_DISPLAY, PHONE_HREF } from "../lib/constants";

const PICKUPS = ["FLL Airport", "MIA Airport", "PBI Airport", "Port Everglades", "Miami Port", "Palm Beach Port"];
const RETURNS = ["FLL Port Return", "Miami Port Return", "PBI Port Return", "Port Everglades", "Miami Port", "Palm Beach Port"];

function LinkList({ title, icon: Icon, items }: { title: string; icon: React.ElementType; items: string[] }) {
  return (
    <div className="rounded-2xl bg-primary/30 shadow-sm p-10 px-8">
      <div className="mb-10 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon size={32} className="text-accent" />
        </span>
        <h3 className="font-display text-xl font-bold text-white ">{title}</h3>
      </div>
      <div className="grid grid-cols-2 gap-2.5 border-t pt-4 border-amber-50/20">
        {items.map((item) => (
          <Link
            key={item}
            to="/booking"
            className="group flex items-center justify-center rounded-lg bg-primary/50 px-4.5 py-3.5 text-xs font-bold text-white transition-colors hover:bg-accent hover:text-black"
          >
            {item}
            <FaArrowRight size={9} className="opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Booking() {
  return (
    <section className="py-24 bg-primary-dark">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-light bg-primary/20 p-3 rounded-3xl">Booking Options</span>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-white sm:text-4xl">Book Transportation</h2>
          <p className="mt-4 text-white">
            For booking please click links below to fill out booking forms from your smart device or
            call{" "}
            <a href={PHONE_HREF} className="font-bold text-yellow-500">
              {PHONE_DISPLAY}
            </a>
            .
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <LinkList title="Airport Pickups" icon={FaPlane} items={PICKUPS} />
          <LinkList title="Return to Port" icon={FaShip} items={RETURNS} />
        </div>
      </div>
    </section>
  );
}
