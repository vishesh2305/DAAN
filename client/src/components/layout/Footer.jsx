import React from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Mail,
  Phone,
  Users,
  Twitter,
  Facebook,
  Instagram,
} from "lucide-react";
import Button from "../common/Button";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 ">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>

              <span className="font-bold text-xl text-gray-800 dark:text-white">
                DAAN
              </span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400">
              Empowering communities to make a difference. Connect with causes
              you care about and help create positive change.
            </p>

            {/* <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <p className="flex items-center">
                <Mail className="h-4 w-4 mr-2" /> support@fundhope.com
              </p>

              <p className="flex items-center">
                <Phone className="h-4 w-4 mr-2" /> +1 (555) 123-4567
              </p>

              <p className="flex items-center">
                <Users className="h-4 w-4 mr-2" /> San Francisco, CA
              </p>
            </div> */}
          </div>
          {/* Links Columns */}{" "}
          <div>
            {" "}
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
              Platform
            </h3>{" "}
            <ul className="space-y-2">
              {" "}
              <li>
                <Link
                  to="#"
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600"
                >
                  How it Works
                </Link>
              </li>{" "}
              <li>
                <Link
                  to="#"
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600"
                >
                  Trust & Safety
                </Link>
              </li>{" "}
              <li>
                <Link
                  to="#"
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600"
                >
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
              Support
            </h3>

            <ul className="space-y-2">
              <li>
                <Link
                  to="#"
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600"
                >
                  Contact Us
                </Link>
              </li>

              <li>
                <Link
                  to="#"
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600"
                >
                  Report Campaign
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="#"
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600"
                >
                  Terms of Service
                </Link>
              </li>

              <li>
                <Link
                  to="#"
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  to="#"
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600"
                >
                  Donation Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter and Social */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white">
              Stay Updated
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Get notified about new campaigns and platform updates.
            </p>
          </div>
          <form className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full md:w-64 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; 2025 FundHope. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <p>Follow us:</p>
            <a href="#" className="hover:text-blue-600">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-blue-600">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-blue-600">
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
