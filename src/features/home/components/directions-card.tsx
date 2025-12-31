import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpLeft,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowDownRight,
  CornerUpLeft,
  CornerUpRight,
  CornerDownLeft,
  CornerDownRight,
  RotateCcw,
  RotateCw,
  MoveUp,
  Circle,
  Navigation,
  Flag,
} from "lucide-react";

const directionsIcon = {
  // Straight movements
  straight: <ArrowUp />,
  continue: <ArrowUp />,

  // Turns
  left: <CornerUpLeft size={40} />,
  right: <CornerUpRight />,
  "slight left": <ArrowUpLeft />,
  "slight right": <ArrowUpRight />,
  "sharp left": <CornerDownLeft />,
  "sharp right": <CornerDownRight />,

  // U-turns
  "uturn left": <RotateCcw />,
  "uturn right": <RotateCw />,
  uturn: <RotateCcw />,

  // Roundabouts
  roundabout: <Circle />,
  "roundabout left": <RotateCcw />,
  "roundabout right": <RotateCw />,

  // Ramps (highway entry/exit)
  "ramp left": <CornerUpLeft />,
  "ramp right": <CornerUpRight />,
  "on ramp": <MoveUp />,
  "off ramp": <ArrowDownRight />,

  // Merge
  merge: <ArrowUpRight />,
  "merge left": <ArrowUpLeft />,
  "merge right": <ArrowUpRight />,

  // Fork
  fork: <ArrowUpRight />,
  "fork left": <ArrowUpLeft />,
  "fork right": <ArrowUpRight />,

  // Arrival
  arrive: <Flag />,
  depart: <Navigation />,

  // Default
  default: <ArrowUp />,
} as const;
function DirectionsCard() {
  return (
    <div className="bg-primary flex h-25 items-start gap-3 rounded-2xl p-5 text-white">
      <div>{directionsIcon.left}</div>
      <div>
        <h4 className="font-normal] text-[28px] text-white">
          Take a left turn
        </h4>
        <p className="text-[15px] text-shadow-white">Towards Ozouba Road</p>
      </div>
    </div>
  );
}

export default DirectionsCard;
