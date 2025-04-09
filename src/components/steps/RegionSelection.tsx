
import React, { useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import QuestionContainer from "../QuestionContainer";
import { FormData, Region, regions } from "@/utils/formUtils";
import { MapPin } from "lucide-react";

type RegionSelectionProps = {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onNext: () => void;
  onPrev: () => void;
};

const RegionSelection: React.FC<RegionSelectionProps> = ({
  formData,
  setFormData,
  onNext,
  onPrev,
}) => {
  const handleRegionChange = (regionName: string) => {
    const selectedRegion = regions.find((region) => region.name === regionName);
    
    if (selectedRegion) {
      setFormData((prev) => ({
        ...prev,
        region: {
          selected: selectedRegion.name,
          frequencyBand: selectedRegion.frequencyBand,
        },
      }));
    }
  };

  // Get geolocation on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // This is a simplified approach - in a real application you would use reverse geocoding
          // to get the actual region from latitude and longitude
          // For now, we'll just detect if it's roughly North America or Europe
          const latitude = position.coords.latitude;
          
          let detectedRegion: Region | undefined;
          
          if (latitude > 15 && latitude < 60) {
            if (position.coords.longitude < -30) {
              // North America
              detectedRegion = regions.find((r) => r.name === "North America");
            } else if (position.coords.longitude > -10 && position.coords.longitude < 40) {
              // Europe
              detectedRegion = regions.find((r) => r.name === "Europe");
            }
          }
          
          if (detectedRegion && formData.region.selected === "") {
            setFormData((prev) => ({
              ...prev,
              region: {
                selected: detectedRegion!.name,
                frequencyBand: detectedRegion!.frequencyBand,
              },
            }));
          }
        },
        (error) => {
          console.log("Error getting location:", error);
        }
      );
    }
  }, []);

  return (
    <QuestionContainer
      title="Region Selection"
      description="Select your deployment region"
      onNext={onNext}
      onPrev={onPrev}
      isFirstStep={false}
      isLastStep={false}
      nextDisabled={formData.region.selected === ""}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <MapPin className="text-iot-blue h-5 w-5" />
            <h3 className="text-lg font-medium">Select Your Region</h3>
          </div>
          
          <Select 
            value={formData.region.selected} 
            onValueChange={handleRegionChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem key={region.name} value={region.name}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {formData.region.selected && (
          <div className="p-4 bg-iot-light-blue rounded-md animate-fade-in">
            <h4 className="font-medium mb-2">LoRaWAN Frequency Band</h4>
            <p>
              Based on your region, the following frequency band will be used:
              <span className="font-semibold block mt-1">
                {formData.region.frequencyBand}
              </span>
            </p>
          </div>
        )}
      </div>
    </QuestionContainer>
  );
};

export default RegionSelection;
