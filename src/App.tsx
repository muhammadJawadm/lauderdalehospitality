import { Routes, Route } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import PanelProtectedRoute from "./routes/PanelProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Booking from "./pages/Booking";
import BookingDetails from "./pages/BookingDetails";
import BookingSummary from "./pages/BookingSummary";
import Checkout from "./pages/Checkout";

export default function App() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/booking"
        element={
          <PanelProtectedRoute user={currentUser}>
            <Booking />
          </PanelProtectedRoute>
        }
      />
      <Route
        path="/booking/details"
        element={
          <PanelProtectedRoute user={currentUser}>
            <BookingDetails />
          </PanelProtectedRoute>
        }
      />
      <Route
        path="/booking/summary"
        element={
          <PanelProtectedRoute user={currentUser}>
            <BookingSummary />
          </PanelProtectedRoute>
        }
      />
      <Route
        path="/booking/checkout"
        element={
          <PanelProtectedRoute user={currentUser}>
            <Checkout />
          </PanelProtectedRoute>
        }
      />
    </Routes>
  );
}
