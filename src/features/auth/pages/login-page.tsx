"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { MapPin, Shield, BarChart3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react"; // ✅ Add this

// Dynamically import map to avoid SSR issues
const AnimatedMapBackground = dynamic(
  () => import("../components/animated-map-bg"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50" />
    ),
  }
);

// ✅ Dynamically import LoginForm with Suspense
const LoginForm = dynamic(() => import("../components/login-form"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  ),
});

const features = [
  {
    icon: MapPin,
    title: "Location-Based Search",
    description: "Find facilities near you",
  },
  {
    icon: Shield,
    title: "Verified Facilities",
    description: "Quality healthcare guaranteed",
  },
  {
    icon: BarChart3,
    title: "Performance Metrics",
    description: "Data-driven decisions",
  },
];

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen">
      {/* Left Side - Map Background with Info */}
      <div className="relative hidden w-1/2 lg:block xl:w-3/5">
        <AnimatedMapBackground />

        {/* Content Overlay */}
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
              Find the Right{" "}
              <span className="text-primary">Medical Facility</span>
            </h2>
            <p className="mb-8 text-lg text-gray-600">
              Based on location, capacity, and performance. Your health journey
              starts here.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm"
                >
                  <feature.icon className="text-primary h-4 w-4" />
                  <span className="text-sm font-medium text-gray-700">
                    {feature.title}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bottom Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex gap-8"
          >
            <div>
              <p className="text-primary text-3xl font-bold"> 347+</p>
              <p className="text-sm text-gray-600">Healthcare Facilities</p>
            </div>
            {/* <div>
              <p className="text-primary text-3xl font-bold">50k+</p>
              <p className="text-sm text-gray-600">Happy Patients</p>
            </div> */}
            <div>
              <p className="text-primary text-3xl font-bold">23 </p>
              <p className="text-sm text-gray-600">LGAs Covered</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full items-center justify-center bg-white px-6 py-12 lg:w-1/2 xl:w-2/5">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 text-center lg:hidden"
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
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-gray-600">
              Sign in to your account to continue
            </p>
          </motion.div>

          {/* ✅ Wrap LoginForm in Suspense */}
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  )}