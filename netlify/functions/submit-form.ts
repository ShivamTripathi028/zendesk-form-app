// netlify/functions/submit-form.ts

// Import the Handler type from Netlify Functions
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

// Define the expected structure of the incoming request body (from the frontend form)
// Adapt this based on what fields you absolutely need for Zendesk
interface SubmissionPayload {
    clientInfo: {
        name: string;
        email: string;
        // Include other fields if needed for the ticket body
        company?: string;
        contactNumber?: string;
    };
    // Include other top-level form data sections if needed
    region?: { selected: string; frequencyBand: string };
    deployment?: { environment: string | null };
    application?: { type: string; subtypes: string[]; otherSubtype?: string };
    scale?: string;
    connectivity?: { lorawanType: string | null; options: string[] };
    power?: string[];
    additionalDetails?: string;
}


// The main function Netlify will execute
const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    // 1. Check if the request method is POST
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405, // Method Not Allowed
            body: JSON.stringify({ message: "Method Not Allowed. Please use POST." }),
            headers: { 'Content-Type': 'application/json' },
        };
    }

    // 2. Parse the incoming JSON data
    let payload: SubmissionPayload;
    try {
        if (!event.body) {
            throw new Error("Missing request body");
        }
        payload = JSON.parse(event.body);
    } catch (error) {
        console.error("Error parsing JSON body:", error);
        return {
            statusCode: 400, // Bad Request
            body: JSON.stringify({ message: "Invalid JSON body" }),
            headers: { 'Content-Type': 'application/json' },
        };
    }

    // 3. Validate essential data (name, email, message/details)
    const { name, email } = payload.clientInfo || {};
    // Combine relevant details into a message string for Zendesk
    const message = `
    **RAK IoT Requirements Submission**

    **Client Info:**
    Name: ${name || 'N/A'}
    Email: ${email || 'N/A'}
    Company: ${payload.clientInfo?.company || 'N/A'}
    Contact: ${payload.clientInfo?.contactNumber || 'N/A'}

    **Deployment:**
    Region: ${payload.region?.selected || 'N/A'} (${payload.region?.frequencyBand || 'N/A'})
    Environment: ${payload.deployment?.environment || 'N/A'}
    Scale: ${payload.scale || 'N/A'}

    **Application:**
    Type: ${payload.application?.type || 'N/A'}
    Subtypes: ${payload.application?.subtypes?.join(', ') || 'N/A'}
    ${payload.application?.otherSubtype ? `Other Subtype: ${payload.application.otherSubtype}` : ''}

    **Connectivity & Power:**
    LoRaWAN Type: ${payload.connectivity?.lorawanType || 'N/A'}
    Additional Connectivity: ${payload.connectivity?.options?.join(', ') || 'N/A'}
    Power Sources: ${payload.power?.join(', ') || 'N/A'}

    **Additional Details:**
    ${payload.additionalDetails || 'None provided'}
    `;

    if (!name || !email || !message.trim()) {
         console.error("Missing required fields:", { name, email, message: message.trim() });
        return {
            statusCode: 400, // Bad Request
            body: JSON.stringify({ message: "Missing required fields: name, email, or message content." }),
            headers: { 'Content-Type': 'application/json' },
        };
    }

    // 4. TODO: Get Zendesk credentials from environment variables

    // 5. TODO: Construct Zendesk API payload

    // 6. TODO: Make API call to Zendesk using fetch or axios

    // 7. TODO: Handle Zendesk response and return success/error to frontend

    // Placeholder response
    console.log("Received payload:", payload);
    console.log("Constructed message:", message);
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Form data received (Zendesk integration not implemented yet).",
            // dataPreview: { name, email, messagePreview: message.substring(0, 100) + '...' }
         }),
        headers: { 'Content-Type': 'application/json' },
    };
};

// Export the handler function
export { handler };