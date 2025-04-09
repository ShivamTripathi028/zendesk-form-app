
import React from "react";
import IoTQuestionnaire from "@/components/IoTQuestionnaire";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-iot-light-blue">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-10 mt-4">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-10 h-10 rounded-full bg-iot-blue flex items-center justify-center mr-2">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              RAK <span className="text-iot-blue">IoT</span> Device Requirements
            </h1>
          </div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Help us understand your IoT needs. Complete this questionnaire to
            receive tailored recommendations for RAK IoT devices that match your
            project requirements.
          </p>
        </header>

        <main className="bg-white/60 backdrop-blur-sm rounded-xl shadow-md p-6">
          <IoTQuestionnaire />
        </main>

        <footer className="mt-20 mb-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} RAK Wireless. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
