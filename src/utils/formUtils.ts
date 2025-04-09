export type Region = {
  name: string;
  frequencyBand: string;
};

export const regions: Region[] = [
  { name: "North America", frequencyBand: "US915" },
  { name: "Europe", frequencyBand: "EU868" },
  { name: "Asia Pacific", frequencyBand: "AS923" },
  { name: "Australia", frequencyBand: "AU915" },
  { name: "Korea", frequencyBand: "KR920" },
  { name: "India", frequencyBand: "IN865" },
  { name: "Russia", frequencyBand: "RU864" }
];

export type ApplicationType = {
  type: string;
  subtypes: string[];
};

export const applicationTypes: ApplicationType[] = [
  {
    type: "Monitoring",
    subtypes: ["Temperature", "Humidity", "Air Quality", "Water Quality", "Vibration", "Pressure", "Light", "Motion", "Other"]
  },
  {
    type: "Communication",
    subtypes: ["IoT Gateway", "Connectivity Solutions", "Mesh Network", "Point-to-Point", "Other"]
  },
  {
    type: "Control & Automation",
    subtypes: ["Actuators", "Smart Relays", "Smart Switches", "Valve Control", "Motor Control", "Other"]
  },
  {
    type: "Asset Tracking",
    subtypes: ["GPS Tracking", "RFID", "BLE Beacons", "UWB Tracking", "Indoor Positioning", "Other"]
  }
];

export const deploymentScales = [
  "Single Device",
  "Small Deployment (1-10 devices)",
  "Medium Deployment (11-50 devices)",
  "Large Deployment (50+ devices)"
];

export const powerOptions = [
  "Battery Powered",
  "Solar Powered",
  "Mains Powered"
];

export type FormData = {
  clientInfo: {
    name: string;
    email: string;
    company?: string;
    contactNumber: string;
  };
  region: {
    selected: string;
    frequencyBand: string;
  };
  deployment: {
    environment: "Indoor" | "Outdoor" | "Both" | null;
  };
  application: {
    type: string;
    subtypes: string[];
    otherSubtype?: string;
  };
  scale: string;
  connectivity: {
    lorawanType: "Public" | "Private" | null;
    options: string[];
  };
  power: string[];
  additionalDetails: string;
};

export const initialFormData: FormData = {
  clientInfo: {
    name: "",
    email: "",
    company: "",
    contactNumber: "",
  },
  region: {
    selected: "",
    frequencyBand: "",
  },
  deployment: {
    environment: null,
  },
  application: {
    type: "",
    subtypes: [],
    otherSubtype: "",
  },
  scale: "",
  connectivity: {
    lorawanType: null,
    options: [],
  },
  power: [],
  additionalDetails: "",
};

// Checks if client information is complete
export const isClientInfoComplete = (clientInfo: FormData["clientInfo"]) => {
  return clientInfo.name.trim() !== "" && 
         clientInfo.email.trim() !== "" && 
         clientInfo.contactNumber.trim() !== "";
};

// Format form data to JSON for submission
export const formatFormData = (formData: FormData) => {
  return JSON.stringify(formData, null, 2);
};

// Helper to check if a step is valid
export const isStepValid = (step: number, formData: FormData): boolean => {
  switch (step) {
    case 1:
      return isClientInfoComplete(formData.clientInfo);
    case 2:
      return formData.region.selected !== "";
    case 3:
      return formData.deployment.environment !== null;
    case 4:
      return formData.application.type !== "" && formData.application.subtypes.length > 0;
    case 5:
      return formData.scale !== "";
    case 6:
      return formData.connectivity.lorawanType !== null && formData.power.length > 0;
    case 7:
      return true; // Additional details are optional
    default:
      return false;
  }
};
