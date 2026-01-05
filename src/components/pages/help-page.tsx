import FeedbackForm from "@/features/help/components/contact-form";
import FAQ from "@/features/help/components/FAQ";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { Card } from "../ui/card";
import HelpLine from "@/features/help/components/help-line";

function HelpPage() {
  return (
    <main className="h-dvh p-5">
      <div className="mb-3 flex items-center gap-3">
        <Link href="/">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-[23px] font-medium"> Help</h1>
        </div>
      </div>

      <section className="mt-3.5">
        <FeedbackForm />

        <div className="mt-8">
          <FAQ />
        </div>

        {/* FOOTER */}
        <div className="mt-13 pb-10">
          <div className="mb-4 flex h-[49px] items-center">
            <h3 className="text-[19px]">Other Ways to Reach Us</h3>
          </div>
          <div className="space-y-4">
            <HelpLine
              icon={<Phone size={24} color="#51A199" />}
              title="Helpline"
              value={"+2343802332800"}
            />

            <HelpLine
              icon={<Mail size={24} color="#51A199" />}
              title="Email Support"
              value={"support@omni-health.org"}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

export default HelpPage;
