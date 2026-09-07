import Header from "./components/Header";
import Hero from "./components/Hero";
import WhereWeServe from "./components/WhereWeServe";
import Fleet from "./components/Fleet";
import Excursions from "./components/Excursions";
import Booking from "./components/Booking";
import Reserve from "./components/Reserve";
import Reviews from "./components/Reviews";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <WhereWeServe />
        <Fleet />
        <Excursions />
        <Booking />
        <Reserve />
        <Reviews />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
