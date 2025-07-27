
import React from 'react';

const PricingFAQ = () => {
  const faqs = [
    {
      question: 'Can I change my plan anytime?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, UPI, and net banking for Indian customers.'
    },
    {
      question: 'Is there a free trial for Pro?',
      answer: 'Yes, new users get a 7-day free trial of Pro features when they sign up.'
    },
    {
      question: 'What happens if I exceed my article limit?',
      answer: 'Free users will see a prompt to upgrade. Pro users have unlimited access.'
    }
  ];

  return (
    <section className="py-16 px-4 bg-card/50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {faqs.map((faq, index) => (
            <div key={index} className="space-y-3">
              <h3 className="text-lg font-semibold text-ura-green">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingFAQ;
