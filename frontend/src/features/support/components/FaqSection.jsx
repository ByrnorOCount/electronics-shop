import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { getFaqs } from "../supportSlice";
import Spinner from "../../../components/ui/Spinner";

const FaqItem = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="w-full flex justify-between items-center text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium text-gray-800">{faq.question}</h3>
        <span
          className={`transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </span>
      </button>
      {isOpen && (
        <div className="mt-3 text-gray-600">
          <p>{faq.answer}</p>
        </div>
      )}
    </div>
  );
};

const FaqSection = () => {
  const dispatch = useAppDispatch();
  const { faqs, faqStatus, faqError } = useAppSelector(
    (state) => state.support
  );

  useEffect(() => {
    if (faqStatus === "idle") {
      dispatch(getFaqs());
    }
  }, [faqStatus, dispatch]);

  if (faqStatus === "loading") return <Spinner />;
  if (faqStatus === "failed")
    return <p className="text-red-500">Error: {faqError}</p>;

  return (
    <div>{faqs && faqs.map((faq) => <FaqItem key={faq.id} faq={faq} />)}</div>
  );
};

export default FaqSection;
