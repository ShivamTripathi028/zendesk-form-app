
import React from "react";
import { cn } from "@/lib/utils";

type OptionCardProps = {
  icon: React.ReactNode;
  title: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
};

const OptionCard: React.FC<OptionCardProps> = ({
  icon,
  title,
  selected,
  onClick,
  className,
}) => {
  return (
    <div
      className={cn(
        "option-card flex flex-col items-center justify-center gap-3 p-6 transition-all duration-300 hover:shadow-lg",
        selected ? "selected ring-2 ring-iot-blue" : "hover:border-iot-blue/50",
        className
      )}
      onClick={onClick}
    >
      <div className={`text-3xl ${selected ? "text-iot-blue" : "text-gray-500"} transition-colors duration-300`}>
        {icon}
      </div>
      <h3 className={`text-sm font-medium text-center ${selected ? "text-iot-blue" : "text-gray-700"} transition-colors duration-300`}>
        {title}
      </h3>
      {selected && (
        <div className="absolute top-2 right-2 w-4 h-4 bg-iot-blue rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default OptionCard;
