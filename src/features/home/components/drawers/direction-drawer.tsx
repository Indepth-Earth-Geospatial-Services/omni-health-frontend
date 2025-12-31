"use client";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useState } from "react";
import { useUserStore } from "../../store/userStore";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Phone, X } from "lucide-react";
import exportIcon from "@assets/img/icons/svg/Export.svg";
import compass from "@assets/img/icons/svg/compass-rose.svg";
import { useDrawerStore } from "../../store/drawerStore";

interface ResultsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function DirectionDrawer({ isOpen, onClose }: ResultsDrawerProps) {
  const [snap, setSnap] = useState<number | string | null>(0.5);
  const hasStartDirections = useDrawerStore(
    (state) => state.hasStartDirections,
  );
  const endDirections = useDrawerStore((state) => state.endDirections);
  const startDirections = useDrawerStore((state) => state.startDirections);
  const userLocation = useUserStore((state) => state.userLocation);

  const handleStartDirections = () => {
    startDirections();
  };
  const handleEndDirections = () => {
    endDirections();
  };
  return (
    <Drawer
      open={isOpen}
      onOpenChange={onClose}
      snapPoints={[0.5]}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      dismissible={false}
      modal={false}
    >
      <DrawerContent className="flex h-full">
        <div className="px-5 pt-8.5 pb-5">
          {!hasStartDirections ? (
            <>
              <div className="flex justify-between gap-x-2">
                <h2 className="text-[19px] font-normal">
                  7mins Drive to Rumueme Hp
                </h2>
                <div className="shrink-0 space-x-3">
                  <Button className="rounded-full bg-[#E2E4E9]" size="icon-sm">
                    <Image
                      src={exportIcon}
                      alt=""
                      className="size-5 object-cover"
                    />
                  </Button>
                  <Button
                    onClick={onClose}
                    className="rounded-full bg-[#E2E4E9]"
                    size="icon-sm"
                  >
                    <X size={20} color="black" />
                  </Button>
                </div>
              </div>

              <div className="text-[11px] font-normal text-[#868C98]">
                <h6 className="text-primary">
                  74 Queen&apos;s Drive, Port Harcourt{" "}
                </h6>
                <p className="text-[15px] text-[#868C98]">Arrive by 18:20pm</p>
              </div>

              <div className="mt-3 space-x-3">
                <Button
                  onClick={handleStartDirections}
                  size="lg"
                  className="bg-primary rounded-full text-[11px]"
                >
                  <Image
                    src={compass}
                    alt=""
                    className="size-3.5 object-cover"
                  />
                  Start Directions
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border border-[#868C98] text-[11px] text-[#868C98]"
                  onClick={() => window.open(`tel:8080`)}
                >
                  <Phone size={14} /> Call
                </Button>
              </div>
            </>
          ) : (
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-[28px] font-normal">7 mins left</h4>
                <Button
                  onClick={handleEndDirections}
                  className="rounded-full"
                  variant="destructive"
                  size="lg"
                >
                  End
                </Button>
              </div>
              <p className="text-[19px] text-[#868C98]">28.km</p>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default DirectionDrawer;
