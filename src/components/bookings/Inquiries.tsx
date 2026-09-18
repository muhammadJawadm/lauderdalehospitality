import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../config/firebase";
import { inputClass, labelClass, primaryButtonClass } from "../../lib/bookingTypes";

interface InquiryFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  serviceDescription: string;
}

const initialFormData: InquiryFormData = {
  firstName: "", lastName: "", email: "", phoneNumber: "", serviceDescription: "",
};

export default function Inquiries() {
  const [formData, setFormData] = useState<InquiryFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await addDoc(collection(db, "inquiries"), { ...formData, createdAt: new Date() });
      toast.success("Inquiry submitted! We'll get back to you within 24/48 hours.", { position: "bottom-right", autoClose: 3000 });
      setFormData(initialFormData);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit your inquiry. Please try again.", { position: "bottom-right", autoClose: 3000 });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[810px] space-y-7">
      <div className="rounded-2xl bg-bg-light p-6">
        <p className="font-display text-xl font-bold text-ink">Inquiries Information</p>
        <p className="mt-2 text-sm text-body">
          If your request is outside of our regular booking parameters, please submit an inquiry and someone
          from our team will get back to you within 24/48 hours with a service quote.
        </p>
      </div>

      <form className="space-y-5 rounded-2xl border border-gray-100 bg-white p-7 shadow-sm" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName" className={labelClass}>First Name</label>
          <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className={inputClass} placeholder="First Name" required />
        </div>
        <div>
          <label htmlFor="lastName" className={labelClass}>Last Name</label>
          <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className={inputClass} placeholder="Last Name" required />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="you@example.com" required />
        </div>
        <div>
          <label htmlFor="phoneNumber" className={labelClass}>Phone #</label>
          <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className={inputClass} placeholder="Phone #" required />
        </div>
        <div>
          <label htmlFor="serviceDescription" className={labelClass}>Description of Services</label>
          <input type="text" id="serviceDescription" name="serviceDescription" value={formData.serviceDescription} onChange={handleChange} className={inputClass} placeholder="Description" required />
        </div>
        <button type="submit" disabled={submitting} className={primaryButtonClass}>
          {submitting ? "Submitting..." : "Submit Inquiry"}
        </button>
      </form>
    </div>
  );
}
