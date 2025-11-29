import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div
      className="pt-5 px-4 md:px-20 lg:px-32 bg-gray-900 w-full overflow-hidden"
      id="Footer"
    >
      {/* <div className="container mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="w-full md:w-1/3">
          <img src={assets.logo_dark} alt="" />
          <p className="text-gray-400 mt-4">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero
            fugiat autem cupiditate id laborum Maxime voluptatem eligendi at
            temporibus.
          </p>
        </div>

        <div className="w-full md:w-1/5">
          <h3 className="text-white text-lg font-bold mb-4">Company</h3>
          <ul className="flex flex-col gap-2 text-gray-400 font-normal">
            <a href="#Header" className="hover:text-white">Home</a>
            <a href="#About" className="hover:text-white">About Us</a>
            <a href="#Contact" className="hover:text-white">Contact Us</a>
            <a href="#" className="hover:text-white">Privacy Policy</a>
          </ul>
        </div>

        <div className="w-full md:w-1/3">
          <h3 className="text-white text-lg font-bold mb-2">
            Subscribe to our newsletter
          </h3>
          <p className="text-gray-400 font-normal mb-4 max-w-80">
            The latest news, articles, and resources, sent to your inbox weekly.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-2 rounded bg-gray-800 text-gray-400 border border-gray-700 focus:outline-none w-full sm:w-auto"
            />
            <button className="py-2 px-4 rounded bg-blue-500 text-white">
              Subscribe
            </button>
          </div>
        </div>
      </div> */}
      <div className="w-full border-t border-gray-700 py-4 mt-10 text-center">
        <p className="text-gray-400 text-sm sm:text-base px-2">
          Copyright 2025 © <span className="font-semibold">Health Chat</span>. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
