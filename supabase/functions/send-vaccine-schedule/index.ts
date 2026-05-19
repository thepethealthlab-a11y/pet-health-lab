import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { getCorsHeaders, handleCorsPrelight } from "../_shared/cors.ts";
import { authenticateRequest } from "../_shared/auth.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface VaccineEvent {
  name: string;
  dueDate: string;
  description: string;
  type: string;
  urgent?: boolean;
}

interface VaccineScheduleRequest {
  email: string;
  petType: string;
  breed?: string;
  birthDate: string;
  country: string;
  schedule: VaccineEvent[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  const corsResponse = handleCorsPrelight(req);
  if (corsResponse) return corsResponse;

  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  try {
    // Authenticate the request
    const user = await authenticateRequest(req);
    console.log("Authenticated user:", user.id);

    const body: VaccineScheduleRequest = await req.json();
    const { email, petType, breed, birthDate, country, schedule } = body;

    // HTML escape helper to prevent injection in email content
    const esc = (s: unknown) =>
      String(s ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

    // Input validation
    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({ error: "Valid email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Restrict sending to the authenticated user's own email to prevent
    // attackers from sending phishing mail to arbitrary addresses.
    if (!user.email || email.toLowerCase() !== user.email.toLowerCase()) {
      return new Response(
        JSON.stringify({ error: "Can only send the schedule to your own account email" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!petType || typeof petType !== 'string') {
      return new Response(
        JSON.stringify({ error: "Pet type is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!birthDate || typeof birthDate !== 'string') {
      return new Response(
        JSON.stringify({ error: "Birth date is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!country || typeof country !== 'string') {
      return new Response(
        JSON.stringify({ error: "Country is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!schedule || !Array.isArray(schedule) || schedule.length === 0) {
      return new Response(
        JSON.stringify({ error: "Vaccine schedule is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Limit schedule size
    if (schedule.length > 50) {
      return new Response(
        JSON.stringify({ error: "Schedule too large" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Sending vaccine schedule to:", email, "for user:", user.id);

    // Build the email HTML
    const scheduleHTML = schedule.map((event) => {
      const urgentBadge = event.urgent ? '<span style="background-color: #ef4444; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; margin-left: 8px;">REQUIRED</span>' : '';
      const typeColor = event.type === "vaccine" ? "#8b5cf6" : event.type === "checkup" ? "#10b981" : "#f59e0b";
      
      return `
        <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 12px; background-color: #ffffff;">
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <div style="width: 4px; height: 40px; background-color: ${typeColor}; border-radius: 2px; margin-right: 12px;"></div>
            <div>
              <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #111827;">
                ${event.name}${urgentBadge}
              </h3>
              <p style="margin: 4px 0 0 0; font-size: 14px; color: #6b7280;">
                ${new Date(event.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
          <p style="margin: 8px 0 0 0; font-size: 14px; color: #374151; line-height: 1.5;">
            ${event.description}
          </p>
        </div>
      `;
    }).join('');

    const emailHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); padding: 32px 24px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">
                🐾 Pet Vaccine Schedule
              </h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">
                The Pet Health Lab
              </p>
            </div>
            
            <!-- Content -->
            <div style="padding: 32px 24px;">
              <div style="background-color: #f3f4f6; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <h2 style="margin: 0 0 12px 0; font-size: 18px; color: #111827;">Pet Information</h2>
                <p style="margin: 4px 0; font-size: 14px; color: #374151;"><strong>Pet:</strong> ${breed || petType}</p>
                <p style="margin: 4px 0; font-size: 14px; color: #374151;"><strong>Birth Date:</strong> ${new Date(birthDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                <p style="margin: 4px 0; font-size: 14px; color: #374151;"><strong>Location:</strong> ${country}</p>
              </div>
              
              <h2 style="margin: 0 0 16px 0; font-size: 20px; color: #111827;">Vaccination & Health Timeline</h2>
              <p style="margin: 0 0 20px 0; font-size: 14px; color: #6b7280;">
                Here's your personalized schedule with ${schedule.length} important health events for ${breed || `your ${petType.toLowerCase()}`}.
              </p>
              
              ${scheduleHTML}
              
              <!-- Important Note -->
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin-top: 24px; border-radius: 4px;">
                <p style="margin: 0; font-size: 13px; color: #92400e; line-height: 1.6;">
                  <strong>⚠️ Important:</strong> Vaccine schedules may vary by region and individual pet needs. Always consult your veterinarian for personalized medical advice. Regional requirements in ${country} may differ from this general schedule.
                </p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">
                Keep your pet healthy with The Pet Health Lab
              </p>
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                Visit <a href="https://thepethealthlab.com" style="color: #8b5cf6; text-decoration: none;">thepethealthlab.com</a> for more pet care tools
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "The Pet Health Lab <onboarding@resend.dev>",
      to: [email],
      subject: `🐾 Vaccine Schedule for ${breed || petType}`,
      html: emailHTML,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending vaccine schedule email:", error);
    
    // Check if it's an auth error
    if (error instanceof Error && error.message.includes('Authentication')) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }), 
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: "Failed to send email. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
