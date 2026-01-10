import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
const FAQList = [
  {
    title: "How do i find the nearest medical facility",
    content:
      "The platform automatically detects your location and shows facilities sorted by distance. You can also use the map view to visually explore nearby facilities, or switch to the Facilities tab for a detailed list view with advanced filtering options.",
  },
  {
    title: "How is the doctor to patient ratio calculated?",
    content:
      "The doctor-to-patient ratio is calculated by dividing the total number of registered doctors in a facility or region by the population they serve. This metric helps you understand healthcare accessibility and the potential wait times at different facilities.",
  },
  {
    title: "Can i book an appointment through this platform?",
    content:
      "Yes, you can book appointments directly through the platform. Simply navigate to the Facilities page or select a specific facility from the list, then click the 'Request Appointment' button. Fill out the appointment form with your details and preferred date/time, and the facility will receive your request.",
  },
  {
    title: "How do i compare multiple facilities?",
    content:
      "Navigate to the Compare page where you can select up to 4 facilities for side-by-side comparison. This feature allows you to evaluate key metrics like services offered, doctor-to-patient ratios, operating hours, distance, and available specialties to help you make an informed decision about which facility best meets your needs.",
  },
  {
    title: "Is my personal information secure?",
    content:
      "Yes, your privacy is our priority. We only use your location data to show nearby facilities and do not store or share your personal information with third parties. All location data is processed locally on your device and is not transmitted to our servers.",
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
