import Layout from "../components/layout"

export default function LearnMorePage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-accent py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 gradient-text text-center">Learn More About Mind Ease</h1>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 gradient-text">Our Mission</h2>
              <p className="text-gray-700">
                At Mind Ease, our mission is to make mental health support accessible to everyone, anytime, anywhere. We
                believe that technology can play a crucial role in providing immediate, personalized support for those
                dealing with mental health challenges.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 gradient-text">How It Works</h2>
              <p className="text-gray-700">
                Mind Ease uses advanced AI technology to provide empathetic, personalized responses to your concerns.
                Our chatbot is available 24/7, offering a judgment-free space for you to express your thoughts and
                feelings, and receive supportive guidance.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 gradient-text">Privacy & Security</h2>
              <p className="text-gray-700">
                We prioritize your privacy and data security. All conversations with Mind Ease are encrypted and
                confidential. We do not store personal information without your explicit consent, ensuring a safe
                environment for your mental health journey.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 gradient-text">Continuous Improvement</h2>
              <p className="text-gray-700">
                Mind Ease is constantly evolving. We work with mental health professionals to refine our AI models and
                ensure that the support we provide is always up-to-date, relevant, and beneficial to our users.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
