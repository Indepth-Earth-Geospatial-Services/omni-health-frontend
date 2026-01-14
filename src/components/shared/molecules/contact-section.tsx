import { Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataSection } from "../atoms/data-section";

interface ContactSectionProps {
  phone: string;
  email: string;
  address: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  phone,
  email,
  address,
}) => {
  const handleCallFacility = () => {
    if (phone) {
      window.open(`tel:0${phone}`);
    }
  };

  const handleSendEmail = () => {
    if (email) {
      window.open(`mailto:${email}`);
    }
  };

  return (
    <DataSection
      title="Contact Information"
      icon={<Phone className="h-5 w-5" />}
      data={{ phone, email, address }}
      emptyMessage="Contact information not available"
    >
      <div className="space-y-4">
        {phone && (
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-blue-100 p-2">
              <Phone size={16} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Phone Number</p>
              <p className="text-gray-600">{phone}</p>
              <Button
                size="sm"
                variant="ghost"
                className="mt-1 text-blue-600 hover:text-blue-700"
                onClick={handleCallFacility}
              >
                Call Now
              </Button>
            </div>
          </div>
        )}

        {email && (
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-green-100 p-2">
              <Mail size={16} className="text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Email Address</p>
              <p className="text-gray-600">{email}</p>
              <Button
                size="sm"
                variant="ghost"
                className="mt-1 text-green-600 hover:text-green-700"
                onClick={handleSendEmail}
              >
                Send Email
              </Button>
            </div>
          </div>
        )}

        {address && (
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-purple-100 p-2">
              <MapPin size={16} className="text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Address</p>
              <p className="text-gray-600">{address}</p>
            </div>
          </div>
        )}
      </div>
    </DataSection>
  );
};
