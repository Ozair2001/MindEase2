import Layout from "../components/layout";
import Image from "next/image";

export default function AboutUsPage() {
  const teamMembers = [
    { name: "Ozair Ahmed", role: "Web App Developer", image: "/ozair.jpg" },
    { name: "Saad Hasan", role: "Model Refining", image: "/saad.png" },
    { name: "Imad", role: "Research and Model finetuning", image: "/imad.png" },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-accent py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 gradient-text text-center">About Mind Ease Pakistan</h1>
          <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 shadow-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4 gradient-text">Our Story</h2>
            <p className="text-gray-700 mb-4">
              Mind Ease Pakistan was founded in 2025 with a vision to address the unique mental health challenges faced
              by the Pakistani community. Our team of Pakistani mental health professionals, AI researchers, and
              technology experts came together to create an innovative solution that combines cultural sensitivity with
              cutting-edge technology.
            </p>
            <p className="text-gray-700">
              We understand the stigma surrounding mental health in Pakistan and the lack of accessible resources.
              That's why we've developed an AI-powered platform that provides immediate, personalized, and culturally
              appropriate support to those who need it most. Our journey is just beginning, and we're committed to
              improving mental health awareness and support across Pakistan.
            </p>
          </div>
          <h2 className="text-3xl font-bold mb-6 gradient-text text-center">Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-md rounded-lg p-6 shadow-lg text-center">
                <div className="relative w-48 h-48 mx-auto mb-4">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={192} // Fixed width
                    height={192} // Fixed height
                    className="rounded-full object-cover" // Ensure the image fills the circle and crops if necessary
                    style={{ objectPosition: "center" }} // Ensure the image is centered within the circle
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2 gradient-text">{member.name}</h3>
                <p className="text-gray-700">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
