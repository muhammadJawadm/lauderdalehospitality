interface BookingPromptOption {
  label: string;
  onClick: () => void;
}

interface BookingPromptProps {
  question: string;
  options: BookingPromptOption[];
}

export default function BookingPrompt({ question, options }: BookingPromptProps) {
  return (
    <div className="mx-auto max-w-lg space-y-7 rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
      <h3 className="font-display text-xl font-bold text-ink">{question}</h3>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        {options.map((opt) => (
          <button
            key={opt.label}
            type="button"
            onClick={opt.onClick}
            className="flex-1 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
