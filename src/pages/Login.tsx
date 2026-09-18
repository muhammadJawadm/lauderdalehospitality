import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock } from "react-icons/fa";
import BookingHeader from "../components/bookings/BookingHeader";
import { useAuth } from "../contexts/AuthContext";
import { inputClass, labelClass, primaryButtonClass } from "../lib/bookingTypes";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const from = (location.state as { from?: string } | null)?.from || "/booking";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      setSubmitting(true);
      await login(email, password);
      toast.success("Welcome back!", { position: "bottom-right", autoClose: 2000 });
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-light">
      <BookingHeader />
      <div className="mx-auto flex max-w-md flex-col justify-center px-6 py-20">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Welcome Back</span>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-ink">Sign In</h1>
          <p className="mt-2 text-sm text-body">Sign in to book your ride or check an existing reservation.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5 rounded-2xl border border-gray-100 bg-white p-7 shadow-sm">
          <div>
            <label htmlFor="email" className={labelClass}>Email Address</label>
            <div className="relative">
              <FaEnvelope className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-primary" size={13} />
              <input
                type="email"
                id="email"
                className={inputClass + " pl-9"}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className={labelClass}>Password</label>
            <div className="relative">
              <FaLock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-primary" size={13} />
              <input
                type="password"
                id="password"
                className={inputClass + " pl-9"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}

          <button type="submit" disabled={submitting} className={primaryButtonClass}>
            {submitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-body">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="font-bold text-primary hover:text-primary-dark">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
