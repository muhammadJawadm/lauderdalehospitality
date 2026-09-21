import {
  FaBriefcase, FaCarSide, FaWater, FaShoppingBag, FaHotel,
  FaFutbol, FaGlassCheers,
} from "react-icons/fa";
import cruise from "../assets/cruise.avif";
import group from "../assets/group_cha.avif";
import night from "../assets/Night.avif";
import everglades from "../assets/Everglades.avif";



const ATTRACTIONS = [
  { icon: FaBriefcase, name: "Corporate Groups" },
  { icon: FaCarSide, name: "Private Transportation" },
  { icon: FaWater, name: "Everglades Tours" },
  { icon: FaShoppingBag, name: "Sawgrass Mills Mall" },
  { icon: FaHotel, name: "Hard Rock Hotel" },
  { icon: FaFutbol, name: "Sporting Events" },
  { icon: FaGlassCheers, name: "Nightlife and Dinner" },
];

const CATEGORIES = [
  { name: "Cruise Excursions", image: cruise },
  { name: "Group Charters", image: group },
  { name: "Nightlife & Dinner", image: night },
  { name: "Everglades Tours", image: everglades },
];

export default function Excursions() {
  return (
    <section id="excursions" className="bg-accent-dark py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-white/90">Local Tours</span>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-white sm:text-4xl">
            Additional Transportation
          </h2>
          <p className="mt-4 text-black/60">
            Make the most of your South Florida stay. We offer dedicated private charters to all top
            local attractions and tour destinations.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-4">
            {ATTRACTIONS.map(({ icon: Icon, name }, i) => (
              <div
                key={name}
                className={`flex items-center gap-3 rounded-2xl bg-white/15 px-5 py-2 backdrop-blur-sm transition-colors hover:bg-white/25 sm:gap-4 sm:px-8 ${
                  i === ATTRACTIONS.length - 1 && ATTRACTIONS.length % 2 !== 0 ? "col-span-2" : ""
                }`}
              >
                <span className="flex h-12 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white">
                  <Icon size={20} />
                </span>
                <p className="font-display text-lg font-bold leading-snug text-white">{name}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {CATEGORIES.map(({ name, image }) => (
              <div key={name} className="group relative aspect-square overflow-hidden rounded-2xl shadow-md">
                <img
                  src={image}
                  alt={name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />
                <p className="absolute bottom-4 left-4 right-4 font-display text-base font-bold text-white sm:text-lg">
                  {name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
