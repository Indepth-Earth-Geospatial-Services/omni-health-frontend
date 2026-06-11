"use client";

import { Mail, Phone, HelpCircle, MessageSquare, HeadphonesIcon } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarContentNav } from "@/features/user/components/desktop/sidebar-content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeedbackForm from "@/features/help/components/contact-form";
import FAQ from "@/features/help/components/FAQ";
import HelpLine from "@/features/help/components/help-line";

export function HelpDesktopLayout() {
  return (
    <SidebarProvider
      defaultOpen={false}
      className="!mx-0 !max-w-full h-dvh overflow-hidden"
    >
      <SidebarContentNav />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[#E2E4E9] px-5 py-4">
          <SidebarTrigger className="flex size-9 items-center justify-center rounded-full bg-[#E2E4E9] transition-colors hover:bg-gray-200" />
          <h1 className="text-[23px] font-medium">Help</h1>
        </div>

        {/* Content */}
        <main className="scrollbar-hide flex-1 overflow-auto">
          <div className="mx-auto max-w-4xl px-5 py-6">
            {/* Hero */}
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-semibold text-[#343434]">Help &amp; Support</h2>
              <p className="mt-2 text-[#868C98]">
                Find answers to common questions, send us a message, or reach out directly.
              </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="faq">
              <TabsList className="mx-auto flex w-fit">
                <TabsTrigger value="faq">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  FAQ
                </TabsTrigger>
                <TabsTrigger value="contact">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact
                </TabsTrigger>
                <TabsTrigger value="support">
                  <HeadphonesIcon className="mr-2 h-4 w-4" />
                  Support
                </TabsTrigger>
              </TabsList>

              <div className="mt-8">
                <TabsContent value="faq">
                  <FAQ />
                </TabsContent>

                <TabsContent value="contact">
                  <div className="mx-auto max-w-lg">
                    <FeedbackForm />
                  </div>
                </TabsContent>

                <TabsContent value="support">
                  <div className="mx-auto max-w-lg space-y-4">
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
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
