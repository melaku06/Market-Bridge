'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  questions: FAQItem[];
}

export default function FAQAccordion({ questions }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="divide-y divide-gray-100">
      {questions.map((item, index) => (
        <div key={index} className="py-4">
          <button
            onClick={() => toggleItem(index)}
            className="w-full flex items-center justify-between text-left gap-4"
          >
            <span className={`font-medium transition-colors ${openIndex === index ? 'text-blue-600' : 'text-gray-900'}`}>
              {item.question}
            </span>
            <ChevronDown
              className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${openIndex === index ? 'rotate-180 text-blue-600' : 'text-gray-400'}`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96 mt-3' : 'max-h-0'}`}
          >
            <p className="text-sm text-gray-600 leading-relaxed pb-2">{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
