import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-primary";
const labelClass = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-body";

function GetInTouchForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <FaCheckCircle className="text-primary" size={32} />
        <p className="mt-4 font-display text-base font-bold text-ink">Message sent!</p>
        <p className="mt-1 text-sm text-body">We'll answer within 24 hours.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm"
    >
      <h3 className="font-display text-lg font-bold text-ink">Get In Touch</h3>
      <p className="mt-1 text-sm text-body">Have questions before you book? Fill out the form and we'll answer within 24 hours.</p>

      <div className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Name</label>
            <input required type="text" className={inputClass} placeholder="Your Full Name" />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input required type="tel" className={inputClass} placeholder="Your Phone Number"/>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Email</label>
          <input required type="email" className={inputClass} placeholder="Your Email Address"/>
        </div>
        <div>
          <label className={labelClass}>Subject</label>
          <input required type="text" className={inputClass} placeholder="What are you inquiring about?"/>
        </div>
        </div>
        <div>
          <label className={labelClass}>Message</label>
          <textarea required rows={4} className={inputClass} placeholder="Write your message here..."/>
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-linear-to-br from-primary to-primary-dark py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
        >
          Send Message
        </button>
      </div>
    </form>
  );
}


export default function Contact() {
  return (
    <section id="contact" className="bg-bg-light py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Get In Touch</span>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-ink sm:text-4xl">Contact Us</h2>
        </div>

        <div className="mt-14 grid gap-8">
          <GetInTouchForm />
        </div>

      </div>
    </section>
  );
}
