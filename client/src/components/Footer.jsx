import React from "react";
import { assets } from "../assets/assets_frontend/assets";

const Footer = () => {
  const date = new Date();
  const year = date.getFullYear();

  return (
    <footer className=" text-gray-700 px-6 md:px-20 py-10 mt-40">
      {/* Top Section */}
      <div className="grid md:grid-cols-3 gap-20 mb-10">
        {/* Logo + Description */}
        <div>
          <img className="w-36 mb-4" src={assets.logo} alt="Logo" />
          <p className="text-sm leading-6 text-gray-600">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-primary cursor-pointer">Home</li>
            <li className="hover:text-primary cursor-pointer">About Us</li>
            <li className="hover:text-primary cursor-pointer">Delivery</li>
            <li className="hover:text-primary cursor-pointer">
              Privacy Policy
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
          <ul className="space-y-2 text-sm">
            <li>+0-000-000-000</li>
            <li>atharvamalve21@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* Bottom Line */}
      <hr className="border-gray-300" />
      <p className="text-center text-xs mt-6 text-gray-500">
        &copy; {year} AtharvaMalve.dev — All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
