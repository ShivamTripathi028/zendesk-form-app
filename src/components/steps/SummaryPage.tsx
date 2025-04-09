import React, { useState } from "react";
// Use 'import type' for FormData from formUtils
import type { FormData } from "@/utils/formUtils";
import { formatFormData } from "@/utils/formUtils"; // Keep formatFormData as a regular import
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Send, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type SummaryPageProps = {
  formData: FormData; // This now correctly refers to your type from formUtils
  onPrev: () => void;
  onReset: () => void;
};

// Helper function to flatten the nested formData object for hidden inputs
const flattenObject = (obj: any, prefix = '', res: { [key: string]: string } = {}) => {
    for(const key in obj){
        const newKey = prefix ? prefix + '.' + key : key;
        if(typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])){
            flattenObject(obj[key], newKey, res);
        } else if (Array.isArray(obj[key])) {
            // Join arrays into a comma-separated string
            res[newKey] = obj[key].join(', ');
        } else if (obj[key] !== null && obj[key] !== undefined) {
            // Assign primitive values directly
            // Ensure value is explicitly converted to string
            res[newKey] = String(obj[key]);
        }
    }
    return res;
};


const SummaryPage: React.FC<SummaryPageProps> = ({
  formData,
  onPrev,
  onReset,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  // --- Use the direct email address in the FormSubmit URL ---
  const FORM_SUBMIT_ENDPOINT = "https://formsubmit.co/sibi.john@rakwireless.com";
  // --- End Email Address Update ---

  // --- Handles background form submission ---
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default browser page navigation
    if (isSubmitting) {
        return; // Prevent double submission
    }
    setIsSubmitting(true);

    const formElement = event.target as HTMLFormElement;
    // Use the GLOBAL FormData Web API here
    const formDataPayload = new window.FormData(formElement);

    // Ensure necessary FormSubmit fields are added
    // These will override hidden inputs if names conflict, which is fine.
    formDataPayload.set('_subject', `RAK IoT Inquiry - ${formData.clientInfo.name || 'New Lead'}`);
    formDataPayload.set('_template', 'table');
    formDataPayload.set('_captcha', 'false'); // Disable FormSubmit CAPTCHA

    try {
      const response = await fetch(FORM_SUBMIT_ENDPOINT, {
        method: 'POST',
        body: formDataPayload,
        headers: {
          'Accept': 'application/json' // Request JSON response from FormSubmit
        }
      });

      // FormSubmit often redirects on success even with AJAX, but checking status is good practice
      if (response.ok || response.status === 200) { // Status 200 might indicate success even if redirected
        // Check if response has JSON content (FormSubmit might not always return JSON on success with _captcha=false)
        const contentType = response.headers.get("content-type");
        let resultMessage = "Submission potentially successful."; // Default message
        if (contentType && contentType.indexOf("application/json") !== -1) {
            try {
                const result = await response.json();
                console.log('FormSubmit Result:', result); // For debugging
                resultMessage = result.message || resultMessage;
            } catch (jsonError) {
                console.error("Failed to parse successful FormSubmit JSON response:", jsonError);
                // Keep default success message
            }
        } else {
            // Handle non-JSON response (likely HTML redirect page)
            console.log('FormSubmit responded with non-JSON content, assuming success.');
        }


        toast({
          title: "Inquiry Sent Successfully!",
          description: "Thank you for your submission. Our sales team will contact you soon.",
          variant: "default", // Or use a custom 'success' variant
          duration: 7000,
        });
        // Optionally reset the main questionnaire state after successful submission
        // setTimeout(() => { onReset(); }, 1000); // Add a small delay if needed
      } else {
        // Handle potential errors from FormSubmit server (e.g., config error)
         let errorMsg = 'Please try again later.';
        try {
             const errorData = await response.json();
             console.error("FormSubmit Server Error:", errorData);
             errorMsg = errorData.message || errorMsg;
        } catch (jsonError) {
            console.error("Failed to parse FormSubmit error response:", response.status, response.statusText);
            errorMsg = `Server returned status ${response.status}. Please check configuration or try later.`;
        }
        toast({
          title: "Submission Error",
          description: `Could not send inquiry. ${errorMsg}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      // Handle network errors during fetch
      console.error("Network Error submitting form:", error);
      toast({
        title: "Network Error",
        description: "Could not send inquiry due to a network issue. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false); // Reset loading state in all cases
    }
  };

  // --- Handles JSON Download ---
  const handleDownloadJson = () => {
    const jsonString = formatFormData(formData);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "iot-requirements-summary.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Summary Downloaded",
      description: "Your requirements summary has been downloaded as JSON.",
      variant: "default",
    });
  };

  // Flatten data for hidden inputs (needed by FormData constructor)
  const flattenedData = flattenObject(formData);

  return (
    // Attach onSubmit to the form element
    <form onSubmit={handleFormSubmit}>
        {/* === Hidden Fields for FormSubmit and Data === */}
        {/* FormSubmit config fields (These are mainly fallback, JS sets them) */}
        <input type="hidden" name="_subject" value={`RAK IoT Inquiry - ${formData.clientInfo.name || 'New Lead'}`} />
        <input type="hidden" name="_template" value="table" />
        <input type="hidden" name="_captcha" value="false" />
        {/* No _next field needed if we handle the response via JS */}

        {/* Hidden inputs for all the actual form data */}
        {Object.entries(flattenedData).map(([key, value]) => {
            // Render hidden input only if value is a non-empty string
            if (value && typeof value === 'string' && value.trim() !== '') {
                return <input key={key} type="hidden" name={key} value={value} />;
            }
            return null; // Don't render input for empty/null/undefined values
        })}


      {/* === Visible Summary UI === */}
      <div className="form-card animate-fade-in">
        <div className="mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">Summary & Submission</h2>
          <p className="text-gray-600 mt-1">Review your IoT requirements below and submit your inquiry.</p>
        </div>

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
                    {/* Display "Other" subtype text only if "Other" is actually selected */}
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
        ) : ( // Check if details exist and are not just whitespace
          <div className="border p-4 rounded-md mb-6 text-sm bg-white shadow-sm border-dashed border-gray-300">
            <h3 className="font-medium text-base mb-1 text-gray-600">Additional Details</h3>
            <p className="text-gray-500 italic">No additional details were provided.</p>
          </div>
         )}

        {/* --- Action Buttons --- */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-between items-center mt-8 pt-6 border-t gap-4">
          {/* Back Button */}
          <Button variant="outline" onClick={onPrev} type="button" disabled={isSubmitting}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Edit
          </Button>
          <div className="flex gap-3 flex-wrap justify-center sm:justify-end">
            {/* Download Button */}
            <Button variant="outline" onClick={handleDownloadJson} type="button" disabled={isSubmitting}>
              <Download className="mr-2 h-4 w-4" /> Download JSON
            </Button>
            {/* Submit Button */}
            <Button
                type="submit"
                disabled={isSubmitting} // Only disable when actively submitting
                className="min-w-[150px]"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              {isSubmitting ? "Submitting..." : "Submit Inquiry"}
            </Button>
          </div>
        </div>

        {/* Spam Protection Notice (Optional but recommended) */}
        <p className="text-xs text-gray-500 mt-4 text-center">
            Form submissions are processed securely. We respect your privacy.
        </p>

      </div>
    </form>
  );
};

export default SummaryPage;