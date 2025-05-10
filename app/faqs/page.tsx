import Layout from "../components/layout"

export default function FAQsPage() {
  const faqs = [
    {
      question: "What is Mind Ease?",
      answer:
        "Mind Ease is an AI-powered mental health support chatbot designed to provide immediate, personalized support for individuals dealing with mental health challenges.",
    },
    {
      question: "Is Mind Ease a substitute for professional mental health care?",
      answer:
        "No, Mind Ease is not a substitute for professional mental health care. It's designed to provide support and guidance, but for serious mental health issues, we always recommend consulting with a qualified mental health professional.",
    },
    {
      question: "How does Mind Ease protect my privacy?",
      answer:
        "Mind Ease takes your privacy seriously. All conversations are encrypted and we do not store personal information without your explicit consent. Our systems are designed with privacy and security as top priorities.",
    },
    {
      question: "Can I use Mind Ease for free?",
      answer:
        "Yes, Mind Ease offers a free tier with basic support features. We also offer premium plans for users who want access to advanced features and more in-depth support.",
    },
    {
      question: "How accurate is the AI in understanding my problems?",
      answer:
        "Our AI is continuously improving and has been trained on a wide range of mental health topics. While it's quite advanced, it's important to remember that it's an AI and may not always perfectly understand complex human emotions and situations.",
    },
    {
      question: "What should I do in a mental health emergency?",
      answer:
        "If you're experiencing a mental health emergency, please contact your local emergency services immediately. Mind Ease is not equipped to handle crisis situations and should not be relied upon in emergencies.",
    },
  ]

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-accent py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 gradient-text text-center">Frequently Asked Questions</h1>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-md rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-2 gradient-text">{faq.question}</h2>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
