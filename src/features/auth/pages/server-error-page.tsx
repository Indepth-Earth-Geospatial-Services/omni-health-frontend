"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/auth-store";

interface ServerErrorPageProps {
  reset?: () => void;
}

function useHomeHref(): string {
  const role = useAuthStore((s) => s.user?.role);
  if (role === "admin") return "/admin";
  if (role === "super_admin") return "/super-admin/dashboard";
  return "/";
}

export default function ServerErrorPage({ reset }: ServerErrorPageProps) {
  const router = useRouter();
  const homeHref = useHomeHref();

  const handleRetry = () => {
    if (reset) {
      reset();
    } else {
      router.refresh();
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-16">
      {/* Illustration */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
        className="mb-6"
      >
        <ServerErrorSVG />
      </motion.div>

      {/* 500 badge */}
      <motion.p
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, delay: 0.12 }}
        className="mb-2 text-8xl font-extrabold tracking-tight text-[#51a199] select-none"
      >
        500
      </motion.p>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.22 }}
        className="mb-3 text-2xl font-bold tracking-tight text-slate-900 md:text-[28px]"
      >
        Server Error
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.32 }}
        className="mb-10 max-w-[420px] text-center text-[15px] leading-relaxed text-slate-500"
      >
        Something went wrong on our end. Our team has been notified and is
        working to resolve the issue. Please try again shortly.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.42 }}
        className="flex flex-col items-center gap-3 sm:flex-row"
      >
        <Button
          size="lg"
          onClick={handleRetry}
          className="w-40 gap-2 bg-[#51a199] text-white hover:bg-[#3d8880]"
        >
          <RefreshCw size={16} />
          Try Again
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="w-40 gap-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
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

function ServerErrorSVG() {
  return (
    <svg
      width="260"
      height="240"
      viewBox="0 0 260 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="500 server error illustration"
    >
      {/* Subtle background ring */}
      <circle
        cx="130"
        cy="152"
        r="92"
        stroke="#e2e8f0"
        strokeWidth="1"
        strokeDasharray="6 4"
      />

      {/* Warning badge — floating */}
      <motion.g
        animate={{ y: [-5, 4, -5] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Circle */}
        <circle
          cx="130"
          cy="46"
          r="28"
          stroke="#f59e0b"
          strokeWidth="2.5"
          fill="white"
        />
        {/* Exclamation body */}
        <rect x="127" y="34" width="6" height="14" rx="3" fill="#f59e0b" />
        {/* Exclamation dot */}
        <circle cx="130" cy="54" r="3.2" fill="#f59e0b" />
      </motion.g>

      {/* Server rack 1 — healthy */}
      <rect
        x="56"
        y="88"
        width="148"
        height="32"
        rx="7"
        stroke="#51a199"
        strokeWidth="2.5"
        fill="#51a199"
        fillOpacity="0.05"
      />
      <line
        x1="74"
        y1="101"
        x2="134"
        y2="101"
        stroke="#51a199"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.45"
      />
      <line
        x1="74"
        y1="108"
        x2="112"
        y2="108"
        stroke="#51a199"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.25"
      />
      <circle cx="180" cy="104" r="5.5" fill="#51a199" opacity="0.65" />

      {/* Server rack 2 — error */}
      <rect
        x="56"
        y="130"
        width="148"
        height="32"
        rx="7"
        stroke="#ef4444"
        strokeWidth="2.5"
        fill="#ef4444"
        fillOpacity="0.04"
      />
      <line
        x1="74"
        y1="143"
        x2="134"
        y2="143"
        stroke="#94a3b8"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.3"
      />
      <line
        x1="74"
        y1="150"
        x2="112"
        y2="150"
        stroke="#94a3b8"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.22"
      />
      {/* Pulsing error indicator */}
      <motion.g
        style={{ transformOrigin: "180px 146px" }}
        animate={{ scale: [1, 1.9, 1], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
      >
        <circle cx="180" cy="146" r="13" fill="#ef4444" fillOpacity="0.15" />
      </motion.g>
      <circle cx="180" cy="146" r="5.5" fill="#ef4444" opacity="0.9" />

      {/* Server rack 3 — healthy */}
      <rect
        x="56"
        y="172"
        width="148"
        height="32"
        rx="7"
        stroke="#51a199"
        strokeWidth="2.5"
        fill="#51a199"
        fillOpacity="0.05"
      />
      <line
        x1="74"
        y1="185"
        x2="134"
        y2="185"
        stroke="#51a199"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.45"
      />
      <line
        x1="74"
        y1="192"
        x2="112"
        y2="192"
        stroke="#51a199"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.25"
      />
      <circle cx="180" cy="188" r="5.5" fill="#51a199" opacity="0.65" />

      {/* Animated scan line sweeping down the server stack */}
      <clipPath id="server-clip">
        <rect x="56" y="88" width="148" height="116" rx="0" />
      </clipPath>
      <motion.rect
        x="56"
        y="88"
        width="148"
        height="2.5"
        fill="#51a199"
        opacity="0.16"
        clipPath="url(#server-clip)"
        animate={{ y: [88, 202, 88] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "linear" }}
      />

      {/* Decorative plus marks */}
      <g
        opacity="0.18"
        stroke="#51a199"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <line x1="30" y1="128" x2="40" y2="128" />
        <line x1="35" y1="123" x2="35" y2="133" />
      </g>
      <g
        opacity="0.18"
        stroke="#51a199"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <line x1="222" y1="155" x2="232" y2="155" />
        <line x1="227" y1="150" x2="227" y2="160" />
      </g>

      {/* Small floating dots */}
      <motion.circle
        cx="44"
        cy="172"
        r="3"
        fill="#51a199"
        animate={{ opacity: [0.15, 0.45, 0.15] }}
        transition={{ duration: 2.8, repeat: Infinity, delay: 0.3 }}
      />
      <motion.circle
        cx="218"
        cy="108"
        r="2.5"
        fill="#51a199"
        animate={{ opacity: [0.15, 0.4, 0.15] }}
        transition={{ duration: 2.8, repeat: Infinity, delay: 1.2 }}
      />
    </svg>
  );
}
