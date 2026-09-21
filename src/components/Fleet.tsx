import LuxurySUVs from "../assets/Luxury_SUVs.jpg";
import MercedesSprinterVans from "../assets/Mercedes.jpg";
import ExecutiveShuttleVehicles from "../assets/Executive.avif";
import GroupTransportSolutions from "../assets/Group.avif";

const VEHICLES = [
   { name: "Luxury SUVs", desc: "Premium spacious SUVs (Cadillac Escalade, Chevy Suburban) offering ultimate comfort and extra luggage storage.", image: LuxurySUVs },
  { name: "Mercedes Sprinter Vans", desc: "High-top luxury passenger Sprinters configured for up to 14 guests. Ideal for groups, families, and corporate outings.", image: MercedesSprinterVans },
  { name: "Executive Shuttle Vehicles", desc: "Spacious executive shuttles that combine large group capacity with first-class airport and cruise port transit comfort.", image: ExecutiveShuttleVehicles },
  { name: "Mini Coaches & Buses", desc: "High-capacity mini coaches designed for tour groups, corporate outings, and large events.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOTJOFY8R9-dV6mACNOyZi7mH4-x15MyBoBl5coheHOA&s=10" },
  { name: "Group Transport Solutions", desc: "Custom multi-vehicle logistics plans, providing unified fleet coordination for conventions, weddings, and corporate events.", image: GroupTransportSolutions },
];

export default function Fleet() {
  return (
    <section id="services" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Luxury Vehicles</span>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-ink sm:text-4xl">Our Premium Fleet</h2>
          <p className="mt-4 text-body">
            Select from our range of meticulously maintained, modern, and insured vehicles operated by
            professional chauffeurs.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {VEHICLES.map(({ name, desc, image }) => (
            <div
              key={name}
              className="group overflow-hidden rounded-2xl bg-bg-light shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <img
                src={image}
                alt={name}
                className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="p-6">
                <h3 className="font-display text-lg font-bold text-primary">{name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-body">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
