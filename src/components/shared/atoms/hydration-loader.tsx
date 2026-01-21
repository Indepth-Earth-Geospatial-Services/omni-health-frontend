import brandImage from "@assets/img/image.png";
import Image from "next/image";

function HydrationLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl bg-white shadow-xl ring-1 shadow-slate-200 ring-slate-100">
          <Image
            src={brandImage}
            alt="App Logo"
            className="h-16 w-16 object-contain"
            priority
          />
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex space-x-1.5">
            <div className="bg-primary h-2 w-2 animate-bounce rounded-full delay-75"></div>
            <div className="bg-primary h-2 w-2 animate-bounce rounded-full delay-150"></div>
            <div className="bg-primary h-2 w-2 animate-bounce rounded-full delay-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HydrationLoader;
