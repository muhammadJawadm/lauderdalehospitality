import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaShoppingCart } from "react-icons/fa";
import logo from "../../assets/logo.png";
import { useAuth } from "../../contexts/AuthContext";
import { useBookingCart } from "../../contexts/BookingCartContext";

export default function BookingHeader() {
  const { currentUser, logout } = useAuth();
  const { legs } = useBookingCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img src={logo} alt="Lauderdale Hospitality Group" className="h-10 w-auto" />
        </Link>

        <div className="flex items-center gap-5">
          <Link to="/" className="text-xs font-bold uppercase tracking-wide text-body transition-colors hover:text-primary">
            Home
          </Link>
          <Link to="/booking/cart" className="relative text-body transition-colors hover:text-primary">
            <FaShoppingCart size={18} />
            {legs.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-black">
                {legs.length}
              </span>
            )}
          </Link>
          {currentUser && (
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-body transition-colors hover:text-primary"
            >
              <FaSignOutAlt size={12} /> Log Out
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
