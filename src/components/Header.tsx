import { useEffect, useState } from "react";
import { FaPhoneAlt, FaBars, FaTimes } from "react-icons/fa";
import { NAV_LINKS, PHONE_DISPLAY, PHONE_HREF } from "../lib/constants";
import logo from "../assets/logo.png"
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkColor = scrolled ? "text-white/90 hover:text-accent" : "text-ink hover:text-primary";

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full backdrop-blur-xl transition-all duration-500 ${
        scrolled ? "bg-primary-dark/95 shadow-lg" : "bg-white/85 border-b border-white/40 shadow-sm"
      }`}
    >
      <div className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-500 ${scrolled ? "h-14.5" : "h-17.5"}`}>
        {/* Logo placeholder — swap in the real logo image here */}
        <a href="#home" className="flex items-center gap-2.5 shrink-0">
         <img src={logo} alt="Logo" className="h-18 w-auto" />
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`relative py-1.5 text-[0.74rem] font-bold uppercase tracking-wide transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:transition-all after:duration-300 hover:after:w-full ${
                scrolled ? "after:bg-accent" : "after:bg-primary"
              } ${linkColor}`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <a
            href={PHONE_HREF}
            className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${scrolled ? "text-white/80" : "text-body"}`}
          >
            <FaPhoneAlt size={11} />
            {PHONE_DISPLAY}
          </a>
          <a
            href={PHONE_HREF}
            className={`inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-bold shadow-sm transition-all hover:-translate-y-0.5 ${
              scrolled
                ? "bg-linear-to-br from-accent to-accent-dark text-ink hover:shadow-[0_4px_15px_rgba(255,183,3,0.4)]"
                : "bg-linear-to-br from-primary to-primary-dark text-white hover:shadow-[0_4px_15px_rgba(45,106,79,0.3)]"
            }`}
          >
            Book Now
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className={`lg:hidden flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${scrolled ? "text-white" : "text-ink"}`}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className={`lg:hidden border-t px-6 py-4 ${scrolled ? "bg-primary-dark border-white/10" : "bg-white border-gray-100"}`}>
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-semibold uppercase tracking-wide transition-colors ${
                  scrolled ? "text-white/90 hover:bg-white/10" : "text-ink hover:bg-bg-light"
                }`}
              >
                {link.label}
              </a>
            ))}
            <a
              href={PHONE_HREF}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-br from-primary to-primary-dark px-6 py-3 text-sm font-bold text-white"
            >
              <FaPhoneAlt size={12} /> Call {PHONE_DISPLAY}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
