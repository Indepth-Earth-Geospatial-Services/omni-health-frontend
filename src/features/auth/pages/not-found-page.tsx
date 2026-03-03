"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/auth-store";

function useHomeHref(): string {
  const role = useAuthStore((s) => s.user?.role);
  if (role === "admin") return "/admin";
  if (role === "super_admin") return "/super-admin/dashboard";
  return "/";
}

export default function NotFoundPage() {
  const router = useRouter();
  const homeHref = useHomeHref();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-16">
      {/* Illustration */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
        className="mb-6"
      >
        <NotFoundSVG />
      </motion.div>

      {/* 404 badge */}
      <motion.p
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, delay: 0.12 }}
        className="mb-2 select-none text-8xl font-extrabold tracking-tight text-[#51a199]"
      >
        404
      </motion.p>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.22 }}
        className="mb-3 text-2xl font-bold tracking-tight text-slate-900 md:text-[28px]"
      >
        Page Not Found
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.32 }}
        className="mb-10 max-w-[420px] text-center text-[15px] leading-relaxed text-slate-500"
      >
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        Check the URL or return to safety.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.42 }}
        className="flex flex-col items-center gap-3 sm:flex-row"
      >
        <Button
          variant="outline"
          size="lg"
          onClick={() => router.back()}
          className="w-40 gap-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Go Back
        </Button>
        <Button
          asChild
          size="lg"
          className="w-40 gap-2 bg-[#51a199] text-white hover:bg-[#3d8880]"
        >
          <Link href={homeHref}>
            <Home size={16} />
            Go to Home
          </Link>
        </Button>
      </motion.div>
    </main>
  );
}

function NotFoundSVG() {
  return (
    <svg
      width="260"
      height="260"
      viewBox="0 0 260 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="404 illustration"
    >
      {/* Outer dashed orbit — clockwise */}
      <motion.g
        style={{ transformOrigin: "130px 130px" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        <circle
          cx="130"
          cy="130"
          r="112"
          stroke="#51a199"
          strokeWidth="1"
          strokeDasharray="7 5"
          opacity="0.18"
        />
        <circle cx="130" cy="18" r="5" fill="#51a199" opacity="0.4" />
        <circle cx="242" cy="130" r="4" fill="#51a199" opacity="0.3" />
        <circle cx="130" cy="242" r="5" fill="#51a199" opacity="0.4" />
      </motion.g>

      {/* Inner dashed orbit — counter-clockwise */}
      <motion.g
        style={{ transformOrigin: "130px 130px" }}
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        <circle
          cx="130"
          cy="130"
          r="76"
          stroke="#51a199"
          strokeWidth="1"
          strokeDasharray="4 7"
          opacity="0.12"
        />
        <circle cx="130" cy="54" r="3.5" fill="#51a199" opacity="0.3" />
        <circle cx="206" cy="130" r="3" fill="#51a199" opacity="0.22" />
      </motion.g>

      {/* Floating magnifying glass */}
      <motion.g
        animate={{ y: [-7, 7, -7] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Lens fill */}
        <circle cx="114" cy="114" r="52" fill="#51a199" fillOpacity="0.05" />
        {/* Lens stroke */}
        <circle cx="114" cy="114" r="52" stroke="#51a199" strokeWidth="4" />
        {/* Inner dashed ring */}
        <circle
          cx="114"
          cy="114"
          r="37"
          stroke="#51a199"
          strokeWidth="1.5"
          strokeDasharray="5 5"
          opacity="0.3"
        />
        {/* Handle */}
        <line
          x1="155"
          y1="155"
          x2="188"
          y2="188"
          stroke="#51a199"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Question mark */}
        <text
          x="114"
          y="131"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#51a199"
          fontSize="42"
          fontWeight="800"
          fontFamily="system-ui, sans-serif"
        >
          ?
        </text>
      </motion.g>

      {/* Staggered pulsing dots */}
      <motion.circle
        cx="50"
        cy="72"
        r="3.5"
        fill="#51a199"
        animate={{ opacity: [0.2, 0.55, 0.2] }}
        transition={{ duration: 2.6, repeat: Infinity, delay: 0 }}
      />
      <motion.circle
        cx="210"
        cy="80"
        r="3"
        fill="#51a199"
        animate={{ opacity: [0.15, 0.45, 0.15] }}
        transition={{ duration: 2.6, repeat: Infinity, delay: 0.9 }}
      />
      <motion.circle
        cx="62"
        cy="198"
        r="3"
        fill="#51a199"
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 2.6, repeat: Infinity, delay: 1.6 }}
      />
      <motion.circle
        cx="200"
        cy="188"
        r="2.5"
        fill="#51a199"
        animate={{ opacity: [0.15, 0.4, 0.15] }}
        transition={{ duration: 2.6, repeat: Infinity, delay: 0.5 }}
      />

      {/* Decorative plus / crosshair marks */}
      <g opacity="0.18" stroke="#51a199" strokeWidth="1.5" strokeLinecap="round">
        <line x1="34" y1="142" x2="44" y2="142" />
        <line x1="39" y1="137" x2="39" y2="147" />
      </g>
      <g opacity="0.18" stroke="#51a199" strokeWidth="1.5" strokeLinecap="round">
        <line x1="216" y1="162" x2="226" y2="162" />
        <line x1="221" y1="157" x2="221" y2="167" />
      </g>
    </svg>
  );
}
