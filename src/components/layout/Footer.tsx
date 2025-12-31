'use client';

import { Send, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#F5F5F5] border-t border-gray-200">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Logo Section */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <div className="w-6 h-6 grid grid-cols-2 gap-0.5">
                  <div className="bg-white rounded-sm"></div>
                  <div className="bg-white/70 rounded-sm"></div>
                  <div className="bg-white/70 rounded-sm"></div>
                  <div className="bg-white rounded-sm"></div>
                </div>
              </div>
              <span className="text-lg font-medium text-primary">Omni-HealthCare</span>
            </div>
          </div>

          {/* Info Section */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-medium text-gray-400 uppercase mb-4 tracking-wide">Info</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#services"
                  className="text-gray-700 hover:text-primary transition-colors text-sm"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-gray-700 hover:text-primary transition-colors text-sm"
                >
                  About us
                </a>
              </li>
              <li>
                <a
                  href="#blog"
                  className="text-gray-700 hover:text-primary transition-colors text-sm"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#contacts"
                  className="text-gray-700 hover:text-primary transition-colors text-sm"
                >
                  Contacts
                </a>
              </li>
            </ul>
          </div>

          {/* Map Section */}
          <div className="lg:col-span-4">
            <div className="w-full h-48 bg-gray-300 rounded-lg overflow-hidden relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.8087486315785!2d7.047584!3d4.815600000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwNDgnNTYuMiJOIDfCsDAyJzUxLjMiRQ!5e0!3m2!1sen!2sng!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale"
              ></iframe>
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/10 to-transparent"></div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-start">
              <div className="space-y-6 flex-1">
                {/* Phone */}
                <div>
                  <h4 className="text-xs font-medium text-gray-400 uppercase mb-2 tracking-wide">
                    Contact Us
                  </h4>
                  <a
                    href="tel:+2348012345678"
                    className="text-gray-700 hover:text-primary transition-colors text-sm font-medium"
                  >
                    +234 801 234 5678
                  </a>
                </div>

                {/* Location */}
                <div>
                  <h4 className="text-xs font-medium text-gray-400 uppercase mb-2 tracking-wide">
                    Location
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Port Harcourt, Rivers State,<br />
                    Nigeria
                  </p>
                </div>

                {/* Email */}
                <div>
                  <h4 className="text-xs font-medium text-gray-400 uppercase mb-2 tracking-wide">
                    Email
                  </h4>
                  <a
                    href="mailto:hello@omnihealth.com"
                    className="text-gray-700 hover:text-primary transition-colors text-sm"
                  >
                    hello@omnihealth.com
                  </a>
                </div>
              </div>

              {/* Social Icons */}
              <div className="flex flex-col gap-3 ml-4">
                <a
                  href="https://t.me/omnihealth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center transition-colors"
                  aria-label="Telegram"
                >
                  <Send className="w-5 h-5 text-white" />
                </a>
                <a
                  href="https://wa.me/2348012345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-gray-300">
          <p className="text-center text-xs text-gray-500">
            © 2025 Omni-HealthCare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
