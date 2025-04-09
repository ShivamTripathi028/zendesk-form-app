// netlify/functions/submit-form.ts

import type {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerResponse,
} from "@netlify/functions";
import axios from "axios";

// Define the expected structure of the incoming request body
interface SubmissionPayload {
  clientInfo: {
    name: string;
    email: string;
    company?: string;
    contactNumber?: string;
  };
  region?: { selected: string; frequencyBand: string };
  deployment?: { environment: string | null };
  application?: { type: string; subtypes: string[]; otherSubtype?: string };
  scale?: string;
  connectivity?: { lorawanType: string | null; options: string[] };
  power?: string[];
  additionalDetails?: string;
}

// Define the expected type for headers to satisfy HandlerResponse
type ResponseHeaders = { [header: string]: string | number | boolean };

// Define common headers
const commonHeaders: ResponseHeaders = {
  "Content-Type": "application/json",
};

// Define headers for Method Not Allowed
const methodNotAllowedHeaders: ResponseHeaders = {
  ...commonHeaders,
  Allow: "POST", // Allow header is specifically for 405
};

// Helper function to safely get environment variables
const getEnvVariable = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required environment variable: ${name}`);
    throw new Error(
      `Configuration error: Environment variable ${name} is not set.`
    );
  }
  return value;
};

// The main function Netlify will execute
const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
): Promise<HandlerResponse> => {
  // Explicitly return Promise<HandlerResponse>
  // 1. Check if the request method is POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed. Please use POST." }),
      headers: methodNotAllowedHeaders, // Use predefined headers
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
      statusCode: 400,
      body: JSON.stringify({
        message: "Invalid JSON body. Please ensure you are sending valid JSON.",
      }),
      headers: commonHeaders, // Use predefined headers
    };
  }

  // 3. Validate essential data (name, email) and construct message
  const { name, email } = payload.clientInfo || {};
  const message = `
<h2>RAK IoT Requirements Submission</h2>

<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px;">
  <tr><th colspan="2">Client Information</th></tr>
  <tr><td><strong>Name</strong></td><td>${name || "N/A"}</td></tr>
  <tr><td><strong>Email</strong></td><td>${email || "N/A"}</td></tr>
  <tr><td><strong>Company</strong></td><td>${
    payload.clientInfo?.company || "N/A"
  }</td></tr>
  <tr><td><strong>Contact Number</strong></td><td>${
    payload.clientInfo?.contactNumber || "N/A"
  }</td></tr>

  <tr><th colspan="2">Deployment Context</th></tr>
  <tr><td><strong>Region</strong></td><td>${
    payload.region?.selected || "N/A"
  } (${payload.region?.frequencyBand || "N/A"})</td></tr>
  <tr><td><strong>Environment</strong></td><td>${
    payload.deployment?.environment || "N/A"
  }</td></tr>
  <tr><td><strong>Scale</strong></td><td>${payload.scale || "N/A"}</td></tr>

  <tr><th colspan="2">Application Details</th></tr>
  <tr><td><strong>Type</strong></td><td>${
    payload.application?.type || "N/A"
  }</td></tr>
  <tr><td><strong>Subtypes</strong></td><td>${
    payload.application?.subtypes?.join(", ") || "N/A"
  }</td></tr>
  ${
    payload.application?.otherSubtype &&
    payload.application?.subtypes?.includes("Other")
      ? `<tr><td><strong>Other Subtype Specified</strong></td><td>${payload.application.otherSubtype}</td></tr>`
      : ""
  }

  <tr><th colspan="2">Technical Requirements</th></tr>
  <tr><td><strong>LoRaWAN Network Type</strong></td><td>${
    payload.connectivity?.lorawanType || "N/A"
  }</td></tr>
  <tr><td><strong>Additional Connectivity</strong></td><td>${
    payload.connectivity?.options?.join(", ") || "None"
  }</td></tr>
  <tr><td><strong>Power Sources</strong></td><td>${
    payload.power?.join(", ") || "N/A"
  }</td></tr>

  <tr><th colspan="2">Additional Details / Message</th></tr>
  <tr><td colspan="2">${
    payload.additionalDetails || "No additional details provided."
  }</td></tr>
</table>
`;

  if (!name || !email) {
    console.error("Validation Error: Missing required fields:", {
      name,
      email,
    });
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Missing required fields: 'name' and 'email' are mandatory.",
      }),
      headers: commonHeaders, // Use predefined headers
    };
  }

  // 4. Get Zendesk credentials from environment variables
  let zendeskSubdomain, zendeskApiToken, zendeskUserEmail, zendeskAssigneeId;
  try {
    zendeskSubdomain = getEnvVariable("ZENDESK_SUBDOMAIN");
    zendeskApiToken = getEnvVariable("ZENDESK_API_TOKEN");
    zendeskUserEmail = getEnvVariable("ZENDESK_USER_EMAIL");
    zendeskAssigneeId = getEnvVariable("ZENDESK_SALES_ASSIGNEE_ID");
  } catch (error: any) {
    console.error("Internal Configuration Error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal server configuration error. Please contact support.",
      }),
      headers: commonHeaders, // Use predefined headers
    };
  }

  // 5. Construct Zendesk API payload
  const zendeskApiUrl = `https://${zendeskSubdomain}.zendesk.com/api/v2/tickets.json`;
  const zendeskTicketData = {
    ticket: {
      subject: `RAK Inquiry from ${name}`,
      comment: { html_body: message },
      requester: { name: name, email: email },
      // assignee_id: parseInt(zendeskAssigneeId, 10) || null,
      group_id: parseInt(zendeskAssigneeId, 10) || null, // Use this if ID is for a group
      // tags: ["rak_iot_form", "sales_lead", "website_inquiry"],
      // priority: "normal",
    },
  };

  // 6. Make API call to Zendesk using axios
  try {
    const authToken = Buffer.from(
      `${zendeskUserEmail}/token:${zendeskApiToken}`
    ).toString("base64");
    const response = await axios.post(zendeskApiUrl, zendeskTicketData, {
      headers: {
        // Headers for the outgoing axios request
        "Content-Type": "application/json",
        Authorization: `Basic ${authToken}`,
      },
    });

    // 7. Handle Zendesk success response
    console.log(
      "Successfully created Zendesk ticket:",
      response.data?.ticket?.id
    );
    return {
      statusCode: 201, // Created
      body: JSON.stringify({
        message:
          "Your inquiry has been submitted successfully! Our team will be in touch.",
      }),
      headers: commonHeaders, // Use predefined headers for the response to the client
    };
  } catch (error: any) {
    // 7. Handle Zendesk error response
    console.error("Error creating Zendesk ticket:");
    if (axios.isAxiosError(error)) {
      console.error("Status:", error.response?.status);
      console.error("Data:", error.response?.data);
      const errorDetails =
        error.response?.data?.error ||
        error.response?.data?.details ||
        error.message;
      const statusCode = error.response?.status || 500;
      return {
        statusCode: statusCode === 401 ? 401 : 500,
        body: JSON.stringify({
          message: `Failed to create ticket. ${
            errorDetails || "Please try again later."
          }`,
        }),
        headers: commonHeaders, // Use predefined headers
      };
    } else {
      console.error("Non-Axios error:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({
          message:
            "An unexpected error occurred while submitting your inquiry.",
        }),
        headers: commonHeaders, // Use predefined headers
      };
    }
  }
};

// Export the handler function
export { handler };
