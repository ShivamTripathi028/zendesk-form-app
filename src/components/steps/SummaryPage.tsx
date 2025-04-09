// src/components/steps/SummaryPage.tsx

import React, { useState } from "react";
// Use 'import type' for FormData from formUtils
import type { FormData } from "@/utils/formUtils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Loader2, Download, RotateCcw } from "lucide-react"; // Added Download, RotateCcw
import { useToast } from "@/components/ui/use-toast"; // Using the correct shadcn toast hook

type SummaryPageProps = {
  formData: FormData; // This refers to your type from formUtils
  onPrev: () => void;
  onReset: () => void; // Added onReset prop for resetting the form
};

// --- Define the path to your Netlify function ---
// This path is relative to the root of your site during runtime on Netlify
const API_ENDPOINT = "/.netlify/functions/submit-form";
// --- End Netlify Function Path ---


const SummaryPage: React.FC<SummaryPageProps> = ({
  formData,
  onPrev,
  onReset,
}) => {
  const { toast } = useToast(); // Use the shadcn toast hook
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle'); // Track submission status

  // --- Handles background form submission to Netlify Function ---
  const handleFormSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault(); // Prevent default form submission if triggered by form element
    if (isSubmitting || submissionStatus === 'success') {
        return; // Prevent double submission or re-submission after success
    }
    setIsSubmitting(true);
    setSubmissionStatus('idle'); // Reset status on new submission attempt

    try {
      // Send the form data directly to your Netlify function
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Sending JSON data
        },
        // Body needs to be the formData state object, stringified
        body: JSON.stringify(formData),
      });

      // Parse the JSON response from the Netlify function
      const result = await response.json();

      if (response.ok && response.status < 300) { // Check for 2xx status codes (e.g., 200 OK, 201 Created)
        console.log('Submission successful:', result);
        setSubmissionStatus('success');
        toast({
          title: "Inquiry Sent Successfully!",
          description: result.message || "Thank you! Our sales team will contact you soon.", // Use message from backend
          variant: "default", // Or use a custom 'success' variant
          duration: 7000,
        });
        // Optionally trigger reset after a delay, or let user do it manually
        // setTimeout(onReset, 5000);

      } else {
        // Handle errors returned from the Netlify function (e.g., 400, 500)
        console.error("Submission Error:", response.status, result);
        setSubmissionStatus('error');
        toast({
          title: "Submission Failed",
          description: result.message || `An error occurred (Status: ${response.status}). Please try again.`, // Use message from backend
          variant: "destructive", // Use destructive variant for errors
          duration: 9000,
        });
      }
    } catch (error) {
      // Handle network errors or issues reaching the function
      console.error("Network or Fetch Error submitting form:", error);
      setSubmissionStatus('error');
      toast({
        title: "Network Error",
        description: "Could not send inquiry due to a network issue. Please check your connection and try again.",
        variant: "destructive",
        duration: 9000,
      });
    } finally {
      setIsSubmitting(false); // Reset loading state regardless of outcome
    }
  };

  // --- Handles JSON Download ---
  const handleDownloadJson = () => {
    // Use the original formData state directly
    const jsonString = JSON.stringify(formData, null, 2); // Pretty print JSON
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    // Use client name in the filename if available
    const clientName = formData.clientInfo.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    a.download = `rak_iot_requirements_${clientName || 'summary'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Summary Downloaded",
      description: "Your requirements summary has been saved as a JSON file.",
      variant: "default",
    });
  };


  // No need for hidden inputs or the <form> element wrapping everything if submitting via JS fetch
  // We trigger submission directly from the button's onClick handler.

  return (
    // We don't strictly need the <form> tag anymore since submission is handled by the button's onClick
    // But keeping it can be semantically okay. Attach onSubmit for potential Enter key submission.
    <div className="form-card animate-fade-in">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Summary & Submission</h2>
        <p className="text-gray-600 mt-1">Review your IoT requirements below and submit your inquiry.</p>
      </div>

      {/* --- Display Summary Sections (Keep these as they are) --- */}

      {/* Client Information */}
      <div className="bg-iot-light-blue/60 p-4 rounded-md mb-6 border border-iot-blue/30">
        <h3 className="font-medium text-lg mb-2 text-iot-dark-blue">Client Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <p><span className="font-medium text-gray-700">Name:</span> {formData.clientInfo.name || <span className="text-gray-500">N/A</span>}</p>
          <p><span className="font-medium text-gray-700">Email:</span> {formData.clientInfo.email || <span className="text-gray-500">N/A</span>}</p>
          {formData.clientInfo.company && (
            <p><span className="font-medium text-gray-700">Company:</span> {formData.clientInfo.company}</p>
          )}
          <p><span className="font-medium text-gray-700">Contact:</span> {formData.clientInfo.contactNumber || <span className="text-gray-500">N/A</span>}</p>
        </div>
      </div>

      {/* Deployment Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="border p-4 rounded-md text-sm bg-white shadow-sm">
              <h3 className="font-medium text-base mb-2 text-gray-800">Deployment Context</h3>
              <p><span className="font-medium text-gray-700">Region:</span> {formData.region.selected || <span className="text-gray-500">N/A</span>}</p>
              <p><span className="font-medium text-gray-700">Frequency Band:</span> {formData.region.frequencyBand || <span className="text-gray-500">N/A</span>}</p>
              <p><span className="font-medium text-gray-700">Environment:</span> {formData.deployment.environment || <span className="text-gray-500">N/A</span>}</p>
              <p><span className="font-medium text-gray-700">Scale:</span> {formData.scale || <span className="text-gray-500">N/A</span>}</p>
          </div>
          <div className="border p-4 rounded-md text-sm bg-white shadow-sm">
              <h3 className="font-medium text-base mb-2 text-gray-800">Application</h3>
              <p><span className="font-medium text-gray-700">Type:</span> {formData.application.type || <span className="text-gray-500">N/A</span>}</p>
              <div>
                  <span className="font-medium text-gray-700">Subtypes:</span>{" "}
                  {formData.application.subtypes.length > 0 ? (
                      <span className="italic">{formData.application.subtypes.join(", ")}</span>
                  ) : (
                      <span className="text-gray-500 ml-1">N/A</span>
                  )}
                  {/* Display "Other" subtype text only if "Other" is selected and text exists */}
                  {formData.application.otherSubtype && formData.application.subtypes.includes("Other") && <span className="italic"> (Other: {formData.application.otherSubtype})</span>}
              </div>
          </div>
      </div>

      {/* Technical Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="border p-4 rounded-md text-sm bg-white shadow-sm">
              <h3 className="font-medium text-base mb-2 text-gray-800">Connectivity</h3>
              <p><span className="font-medium text-gray-700">LoRaWAN Type:</span> {formData.connectivity.lorawanType ? `${formData.connectivity.lorawanType} Network` : <span className="text-gray-500">N/A</span>}</p>
              <div>
                  <span className="font-medium text-gray-700 block mt-1">Additional Options:</span>
                  {formData.connectivity.options.length > 0 ? (
                      <ul className="list-disc list-inside ml-4 text-gray-600">
                      {formData.connectivity.options.map((option) => (
                          <li key={option}>{option}</li>
                      ))}
                      </ul>
                  ) : (
                      <span className="ml-2 text-gray-500">None selected</span>
                  )}
              </div>
          </div>
            <div className="border p-4 rounded-md text-sm bg-white shadow-sm">
              <h3 className="font-medium text-base mb-2 text-gray-800">Power Sources</h3>
              {formData.power.length > 0 ? (
                  <ul className="list-disc list-inside ml-4 text-gray-600">
                      {formData.power.map((source) => (
                          <li key={source}>{source}</li>
                      ))}
                  </ul>
              ) : (
                  <p className="text-gray-500">None selected</p>
              )}
          </div>
      </div>

      {/* Additional Details */}
      {formData.additionalDetails && formData.additionalDetails.trim() !== '' ? (
        <div className="border p-4 rounded-md mb-6 text-sm bg-white shadow-sm">
          <h3 className="font-medium text-base mb-2 text-gray-800">Additional Details Provided</h3>
          <p className="whitespace-pre-wrap text-gray-700">{formData.additionalDetails}</p>
        </div>
      ) : (
        <div className="border p-4 rounded-md mb-6 text-sm bg-white shadow-sm border-dashed border-gray-300">
          <h3 className="font-medium text-base mb-1 text-gray-600">Additional Details</h3>
          <p className="text-gray-500 italic">No additional details were provided.</p>
        </div>
      )}


      {/* --- Action Buttons --- */}
      <div className="flex flex-col sm:flex-row flex-wrap justify-between items-center mt-8 pt-6 border-t gap-4">
        {/* Back Button */}
        {/* Disable Back button if submission was successful to prevent accidental edits */}
        <Button variant="outline" onClick={onPrev} type="button" disabled={isSubmitting || submissionStatus === 'success'}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Edit
        </Button>

        <div className="flex gap-3 flex-wrap justify-center sm:justify-end">
          {/* Download Button */}
          <Button variant="outline" onClick={handleDownloadJson} type="button" disabled={isSubmitting}>
            <Download className="mr-2 h-4 w-4" /> Download JSON
          </Button>

          {/* Conditional Submit / Reset Button */}
          {submissionStatus === 'success' ? (
             <Button variant="outline" onClick={onReset} type="button" >
                <RotateCcw className="mr-2 h-4 w-4" /> Start New Inquiry
             </Button>
          ) : (
             <Button
                onClick={() => handleFormSubmit()} // Call handler directly
                type="button" // Change type to button as it's not submitting a native form
                disabled={isSubmitting || !formData.clientInfo.name || !formData.clientInfo.email } // Also disable if required fields missing
                className="min-w-[150px]"
             >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                {isSubmitting ? "Submitting..." : submissionStatus === 'error' ? "Retry Submission" : "Submit Inquiry"}
             </Button>
          )}

        </div>
      </div>

      {/* Optional: Notice */}
      <p className="text-xs text-gray-500 mt-4 text-center">
          Your information will be sent securely to our team.
      </p>

    </div>
  );
};

export default SummaryPage;