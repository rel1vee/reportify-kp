"use client";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
  faqs: FAQItem[];
}

const FAQModal = ({ isOpen, onClose, faqs }: FAQModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      {/* Modal Content */}
      <div className="relative bg-white rounded-xl w-full max-w-3xl mx-4 p-8 z-50 shadow-lg overflow-y-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h3 className="text-3xl font-bold text-gray-800">FAQs</h3>
        </div>
        {/* Content */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border rounded-xl p-4 bg-gray-50 hover:bg-gray-100"
            >
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <span className="text-sm md:text-base font-medium text-gray-700">
                    {faq.question}
                  </span>
                  <span className="transition group-open:rotate-180">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </span>
                </summary>
                <div className="text-sm md:text-base mt-4 text-gray-600">
                  {faq.answer}
                </div>
              </details>
            </div>
          ))}
        </div>
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 transition-colors"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FAQModal;
