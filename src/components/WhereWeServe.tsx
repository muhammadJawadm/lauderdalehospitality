import { FaPlane, FaShip, FaHotel, FaMapMarkerAlt, FaShuttleVan } from "react-icons/fa";

const AIRPORTS = [
  { code: "FLL", name: "Fort Lauderdale-Hollywood International", desc: "Door-to-door convenience, right from your arrivals terminal." },
  { code: "MIA", name: "Miami International Airport", desc: "Stress-free transfer through Miami's busy corridors." },
  { code: "PBI", name: "Palm Beach International Airport", desc: "Sleek, executive transport serving Palm Beach County travelers." },
];

const PORTS = [
  { code: "PEV", name: "Port Everglades", desc: "Fort Lauderdale's premier cruise ship right in our backyard." },
  { code: "MIA", name: "Port of Miami", desc: "Reliable terminal transfers to start your vacation on the right." },
  { code: "PBI", name: "Port of Palm Beach", desc: "Easy, comfortable connections to Palm Beach departures." },
];

const HUB_NODES = [
  { label: "Airport", icon: FaPlane, topPct: 18, leftPct: 15 },
  { label: "Hotel", icon: FaHotel, topPct: 18, leftPct: 85 },
  { label: "Cruise Port", icon: FaShip, topPct: 78, leftPct: 17 },
  { label: "Destination", icon: FaMapMarkerAlt, topPct: 78, leftPct: 83 },
];
const HUB_CENTER = { topPct: 46, leftPct: 50 };

function ServiceHub() {
  return (
    <div className="relative mx-auto mt-16 h-70 max-w-3xl sm:h-85">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {HUB_NODES.map((n) => (
          <line
            key={n.label}
            x1={HUB_CENTER.leftPct}
            y1={HUB_CENTER.topPct}
            x2={n.leftPct}
            y2={n.topPct}
            stroke="#cbd5e1"
            strokeWidth="0.9"
            strokeDasharray="3 3"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      <div
        className="absolute flex w-40 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2.5 rounded-2xl border border-gray-100 bg-white px-3 py-5 text-center shadow-md sm:w-48 sm:gap-3 sm:px-4 sm:py-6"
        style={{ top: `${HUB_CENTER.topPct}%`, left: `${HUB_CENTER.leftPct}%` }}
      >
        <span className="flex h-16 w-32 items-center justify-center rounded-xl text-primary sm:h-16 sm:w-20">
          <FaShuttleVan size={48} />
        </span>
        <p className="font-display text-xl font-bold leading-snug text-primary sm:text-lg">
          Lauderdale Hospitality Group
        </p>
      </div>

      {HUB_NODES.map(({ label, icon: Icon, topPct, leftPct }) => (
        <div
          key={label}
          className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
          style={{ top: `${topPct}%`, left: `${leftPct}%` }}
        >
          <span className="flex h-16 w-32 items-center justify-center rounded-full bg-white text-ink shadow-sm ring-1 ring-gray-100 sm:h-16 sm:w-16">
            <Icon size={30} />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wide text-ink sm:text-[11px]">{label}</span>
        </div>
      ))}
    </div>
  );
}

function LocationGroup({
  icon: Icon,
  title,
  items,
}: {
  icon: React.ElementType;
  title: string;
  items: typeof AIRPORTS;
}) {
  return (
    <div className="bg-primary/5 rounded-2xl p-4 px-10 lg:px-8 lg:py-10">
      <div className="mb-6 flex items-center gap-3 ">
        <span className="flex h-11 w-11 items-center justify-center rounded-full  text-primary">
          <Icon size={24} />
        </span>
        <h3 className="font-display text-2xl font-bold text-primary">{title}</h3>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.name}
            className="group rounded-2xl border border-gray-100 bg-white/75 px-1 py-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start gap-2">
              <span className="relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bg-light font-display text-[11px] font-extrabold text-primary-dark">

                <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-white" />
              </span>
              <div>
                <p className="font-display text-lg font-bold text-ink">{item.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-body">{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WhereWeServe() {
  return (
    <section className="bg-bg-light py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Where We Serve</span>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-ink sm:text-4xl">
            Airports &amp; Cruise Ports
          </h2>
          <p className="mt-4 text-body">
            Reliable point-to-point transportation connecting all major transport hubs, hotels, and
            tourist destinations in South Florida &mdash; and everywhere in between!
          </p>
        </div>

        <ServiceHub />

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <LocationGroup icon={FaPlane} title="Airports We Serve" items={AIRPORTS} />
          <LocationGroup icon={FaShip} title="Cruise Ports We Serve" items={PORTS} />
        </div>
      </div>
    </section>
  );
}
