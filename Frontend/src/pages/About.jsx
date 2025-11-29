import React from "react";
import { motion } from "motion/react";
import AboutImg from "../assets/About_img.png";

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 200 }}
      transition={{ duration: 1.5 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      id="About"
      className="w-full min-h-screen bg-blue-100 flex items-center justify-center px-6 md:px-20 lg:px-32 py-20 overflow-hidden"
    >
      <div className="w-full max-w-7xl">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-center">About</h1>
        <hr className="border-t border-gray-300 w-full mb-6" />

        <div className="flex flex-col md:flex-row items-center md:items-start md:gap-x-16 gap-y-8">
          {/* Left: Image */}
          <img
            src={AboutImg}
            alt="About illustration"
            className="w-full md:w-1/2 max-w-md object-contain mt-4 rounded-4xl shadow-2xl"
          />

          {/* Right: Points */}
          <div className="flex flex-col text-gray-700 text-base md:text-lg gap-6 mt-4 max-w-xl">
            <p className="text-gray-600 font-semibold text-lg">KEY FEATURES:</p>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 text-xl">✅</span>
              <p>Instant medical advice for common symptoms like cough, fever, body pain, etc.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 text-xl">✅</span>
              <p>Awareness tool for users who want to understand symptoms before visiting a clinic.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 text-xl">✅</span>
              <p>Support for rural communities where hospitals are far away.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 text-xl">✅</span>
              <p>Students & working people get quick health answers without wasting time on unreliable websites.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 text-xl">✅</span>
              <p>Elderly people can get guidance for routine health care, diet, and exercise.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default About;
