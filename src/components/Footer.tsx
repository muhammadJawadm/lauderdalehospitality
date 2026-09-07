import { FaPhoneAlt, FaEnvelope, FaGlobe } from "react-icons/fa";
import { EMAIL, NAV_LINKS, PHONE_DISPLAY, PHONE_HREF, SITE_URL } from "../lib/constants";
import logo from "../assets/LHGlogo.png";
export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-3">
          

          <div>
            <h4 className="relative pb-2 font-display text-sm font-bold uppercase tracking-wide text-white after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-8 after:rounded-full after:bg-accent">
              Quick Links
            </h4>
            <ul className="mt-5 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-white/70 transition-colors hover:text-accent">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
              <div>
                <img src={logo} alt="Lauderdale Hospitality Group Logo" className="h-36 w-auto" />
              </div>
          <div>
            <h4 className="relative pb-2 font-display text-sm font-bold uppercase tracking-wide text-white after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-8 after:rounded-full after:bg-accent">
              Visit Us
            </h4>
            <ul className="mt-5 space-y-3">
              <li>
                <a href={PHONE_HREF} className="flex items-center gap-2.5 text-sm text-white/70 transition-colors hover:text-accent">
                  <FaPhoneAlt size={12} /> {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`} className="flex items-center gap-2.5 text-sm text-white/70 transition-colors hover:text-accent">
                  <FaEnvelope size={12} /> {EMAIL}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-white/70">
                <FaGlobe size={12} /> {SITE_URL}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-6 sm:flex-row">
          <p className="text-xs text-white/50">&copy; {new Date().getFullYear()} Lauderdale Hospitality Group. All Rights Reserved.</p>
          <p className="text-xs text-white/50">Premium Transportation Services &bull; Fort Lauderdale, FL</p>
        </div>
      </div>
    </footer>
  );
}
