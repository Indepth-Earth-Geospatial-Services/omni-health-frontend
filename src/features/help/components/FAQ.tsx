import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQList = [
  {
    title: "How do I find healthcare facilities near me?",
    content:
      "The platform uses your device's location to automatically detect and display nearby healthcare facilities. You can view them in two ways: on the interactive map with visual pins, or in the list view sorted by distance. Use the search bar to find specific facilities by name, or apply filters to narrow down by category, services offered, or performance tier.",
  },
  {
    title: "How does the navigation feature work?",
    content:
      "When you select a facility and click 'Get Directions', we provide an estimated travel time and distance. Clicking 'Start Navigation' will automatically open Google Maps (Android/Web) or Apple Maps (iOS) on your device with the facility pre-loaded as the destination. If the automatic redirect doesn't work, we provide direct links to ensure you can access turn-by-turn navigation.",
  },
  {
    title: "How accurate are the distance and travel time estimates?",
    content:
      "We use straight-line (Haversine) distance calculations for initial estimates, which give you a quick approximation. For more accurate road distances and travel times, we integrate with professional mapping services that consider current traffic conditions and road networks. Travel times are based on average driving speeds and may vary with real-time conditions.",
  },
  {
    title: "What information can I see about each facility?",
    content:
      "Each facility profile includes comprehensive details: services offered, specialist availability, bed capacity, doctor-to-patient ratio, average daily patients, working hours, contact information, and location. The overview tab shows key metrics, while the statistics tab provides detailed operational data to help you make informed healthcare decisions.",
  },
  {
    title: "Can I filter facilities based on my specific needs?",
    content:
      "Yes, our advanced filtering system lets you narrow facilities by multiple criteria: facility category (hospital, clinic, etc.), services offered (emergency, maternity, surgery), performance tier, location (LGA), and available specialties. You can combine multiple filters to find facilities that match your exact healthcare requirements.",
  },
  {
    title: "How do I contact a facility directly?",
    content:
      "From any facility's detail page, you can use the 'Call' button to instantly connect via phone. The contact information is displayed prominently, including phone numbers and addresses. For facilities with available data, you'll also see email addresses and operating hours to plan your visit.",
  },

  {
    title: "Is my location data stored or shared?",
    content:
      "Your location is used only in real-time to show nearby facilities and calculate distances. We do not store your exact location data on our servers or share it with third parties. All location-based calculations happen locally on your device, and you have full control over when location services are active.",
  },
  {
    title: "How do I use the map features effectively?",
    content:
      "The interactive map shows all facilities in your area with color-coded pins. You can tap any pin to see basic info, or select a facility to open its detailed profile. The map automatically centers on your location and adjusts zoom based on the facilities displayed. Use the location button to re-center the map on your current position.",
  },
  {
    title: "What should I do if navigation doesn't open automatically?",
    content:
      "If the automatic redirect to Google Maps or Apple Maps fails, we provide a direct link below the navigation message. Click this link to open the navigation app manually. If you don't have a navigation app installed, we provide links to download Google Maps or Apple Maps from their respective app stores.",
  },
  {
    title: "How often is facility information updated?",
    content:
      "Facility data is regularly updated through our partnerships with healthcare authorities and direct facility reporting. Key operational metrics like bed availability and doctor counts are updated monthly, while contact information and services are verified quarterly. Each facility card shows the last update date for transparency.",
  },

  {
    title: "What if a facility's information appears incorrect?",
    content:
      "We strive for accuracy, but healthcare information can change rapidly. If you notice outdated or incorrect information, please contact our support team with the facility name and the specific correction needed. We work with facility administrators to verify and update information promptly.",
  },
  {
    title: "How does the platform help in medical emergencies?",
    content:
      "While we provide facility locations and contact information, in emergencies you should always call emergency services first (112 in Nigeria). Our platform helps you quickly identify the nearest appropriate facility for follow-up care. Emergency-ready facilities are marked with special indicators showing 24/7 availability and emergency service capacity.",
  },
  {
    title: "Can I use the platform without internet access?",
    content:
      "Basic functionality requires an internet connection to load facility data and maps. However, once loaded, you can view previously accessed facility information offline. For navigation, you'll need an internet connection initially, but most mapping apps allow you to download areas for offline use once navigation is started.",
  },
];
function FAQ() {
  return (
    <div>
      <h2 className="flex h-[49px] items-center text-[19px] font-normal">
        Frequent Asked Questions
      </h2>
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="item-1"
      >
        {FAQList.map((faq, i) => (
          <AccordionItem key={i + 1} value={`item-${i + 1}`}>
            <AccordionTrigger className="text-[15px] font-normal">
              {faq.title}
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-[15px] font-normal text-balance text-[#00000099]">
              <p>{faq.content}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default FAQ;
