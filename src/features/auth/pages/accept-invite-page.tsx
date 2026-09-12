"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { MapPin, Shield, BarChart3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

// Dynamically import map to avoid SSR issues
const AnimatedMapBackground = dynamic(
  () => import("../components/animated-map-bg"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50" />
    ),
  },
);

const AcceptInviteForm = dynamic(
  () => import("../components/accept-invite-form"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-12">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    ),
  },
);

const features = [
  {
    icon: MapPin,
    title: "23 LGAs Covered",
    description: "Rivers State primary healthcare",
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

export default function AcceptInvitePage() {
  return (
    <div className="relative flex min-h-screen">
      {/* Left Side - Map Background with Info */}
      <div className="relative hidden w-1/2 lg:block xl:w-3/5">
        <AnimatedMapBackground />

        <div className="relative z-10 flex h-full flex-col justify-between p-12 pl-16 xl:pl-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/" className="group flex items-center gap-2 sm:gap-2.5">
              <div className="flex h-18 items-center gap-4 px-4">
                <Image
                  src="/img/image.png"
                  alt="RSPHCMB logo"
                  priority
                  width={60}
                  height={60}
                  quality={75}
                />
                <h1 className="text-primary text-sm font-bold tracking-tight drop-shadow-lg transition-transform group-hover:scale-105 sm:text-base md:text-xl">
                  RSPHCMB
                </h1>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-lg"
          >
            <h2 className="mb-4 text-4xl leading-tight font-bold text-gray-900 xl:text-5xl">
              You have been invited to{" "}
              <span className="text-primary">OmniHealth</span>
            </h2>
            <p className="mb-8 text-lg text-gray-600">
              Set a password to activate your account and start managing
              healthcare facilities across Rivers State.
            </p>

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

          <div />
        </div>
      </div>

      {/* Right Side - Accept Invite Form */}
      <div className="flex w-full items-center justify-center bg-white px-6 py-12 lg:w-1/2 xl:w-2/5">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 text-center lg:hidden"
          >
            <Link href="/" className="group flex items-center gap-2 sm:gap-2.5">
              <div className="flex h-18 items-center gap-4 px-4">
                <Image
                  src="/img/image.png"
                  alt="RSPHCMB logo"
                  priority
                  width={40}
                  height={40}
                  quality={75}
                />
                <h1 className="text-primary text-sm font-bold tracking-tight drop-shadow-lg transition-transform group-hover:scale-105 sm:text-base md:text-xl">
                  RSPHCMB
                </h1>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900">
              Accept your invitation
            </h2>
            <p className="mt-2 text-gray-600">
              Choose a password to finish setting up your account.
            </p>
          </motion.div>

          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
              </div>
            }
          >
            <AcceptInviteForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
