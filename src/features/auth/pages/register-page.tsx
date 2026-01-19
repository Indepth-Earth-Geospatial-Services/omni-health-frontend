"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import RegisterForm from "../components/register-form";
import Image from "next/image";

const benefits = [
  "Access to 347+ verified healthcare facilities",
  "Real-time availability and capacity updates",
  "Performance metrics and quality ratings",
  "Easy appointment booking",
  "Location-based facility search",
];

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-screen">
      {/* Left Side - Benefits & Branding */}
      <div className="relative hidden w-1/2 bg-gradient-to-br from-primary/10 via-primary/5 to-blue-50 lg:block xl:w-3/5">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="bg-primary/10 absolute -left-20 -top-20 h-96 w-96 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-200/20 blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-between p-12 pl-16 xl:pl-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group">
              <div className="flex h-18 items-center px-4 gap-4">
                <Image
                  src="/img/image.png"
                  alt="Healthcare facility background"
                  priority
                  width={60}
                  height={60}
                  quality={75}
                />
                <h1 className="text-primary text-sm sm:text-base md:text-xl font-bold tracking-tight drop-shadow-lg transition-transform group-hover:scale-105">
                  RSPHCMB
                </h1>
              </div>
            </Link>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-lg"
          >
            <h2 className="mb-4 text-4xl font-bold leading-tight text-gray-900 xl:text-5xl">
              Join{" "}
              <span className="text-primary">Thousands</span> of Users
            </h2>
            <p className="mb-8 text-lg text-gray-600">
              Create your free account and start discovering quality healthcare
              facilities near you.
            </p>

            {/* Benefits List */}
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="text-primary h-5 w-5 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="max-w-md rounded-2xl bg-white/60 p-6 backdrop-blur-sm"
          >
            <p className="mb-4 text-gray-700 italic">
              &ldquo;OmniHealth made it so easy to find a quality hospital near me.
              The performance metrics helped me make an informed decision.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 flex h-10 w-10 items-center justify-center rounded-full">
                <span className="text-primary font-semibold">AO</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Adaeze Okonkwo</p>
                <p className="text-sm text-gray-500">Rivers, Nigeria</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex w-full items-center justify-center bg-white px-6 py-8 lg:w-1/2 xl:w-2/5">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 text-center lg:hidden"
          >
            <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group">
              <div className="flex h-18 items-center px-4 gap-4">
                <Image
                  src="/img/image.png"
                  alt="Healthcare facility background"
                  priority
                  width={40}
                  height={40}
                  quality={75}
                />
                <h1 className="text-primary text-sm sm:text-base md:text-xl font-bold tracking-tight drop-shadow-lg transition-transform group-hover:scale-105">
                  RSPHCMB
                </h1>
              </div>
            </Link>
          </motion.div>

          {/* Form Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <h2 className="text-2xl font-bold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-gray-600">
              Get started with OmniHealth today
            </p>s
          </motion.div>

          {/* Register Form */}
          <RegisterForm />

          {/* Terms */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center text-xs text-gray-500"
          >
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </motion.p>
        </div>
      </div>
    </div>
  );
}
