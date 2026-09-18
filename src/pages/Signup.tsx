import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock } from "react-icons/fa";
import BookingHeader from "../components/bookings/BookingHeader";
import { useAuth } from "../contexts/AuthContext";
import { inputClass, labelClass, primaryButtonClass } from "../lib/bookingTypes";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);
      await signup(email, password);
      toast.success("Account created! Let's get you booked.", { position: "bottom-right", autoClose: 2000 });
      navigate("/booking", { replace: true });
    } catch (err) {
      console.error("Signup error:", err);
      setError("Could not create your account. That email may already be in use.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-light">
      <BookingHeader />
      <div className="mx-auto flex max-w-md flex-col justify-center px-6 py-20">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Get Started</span>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-ink">Create Account</h1>
          <p className="mt-2 text-sm text-body">Create an account to book and track your reservations.</p>
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
                minLength={6}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="confirm_password" className={labelClass}>Confirm Password</label>
            <div className="relative">
              <FaLock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-primary" size={13} />
              <input
                type="password"
                id="confirm_password"
                className={inputClass + " pl-9"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
          </div>

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}

          <button type="submit" disabled={submitting} className={primaryButtonClass}>
            {submitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-body">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-primary hover:text-primary-dark">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
