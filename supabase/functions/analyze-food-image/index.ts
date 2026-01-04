import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getCorsHeaders, handleCorsPrelight } from "../_shared/cors.ts";
import { authenticateRequest } from "../_shared/auth.ts";

serve(async (req) => {
  // Handle CORS preflight
  const corsResponse = handleCorsPrelight(req);
  if (corsResponse) return corsResponse;

  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  try {
    // Authenticate the request
    const user = await authenticateRequest(req);
    console.log("Authenticated user:", user.id);

    // Parse and validate input
    const body = await req.json();
    const { imageData } = body;
    
    if (!imageData || typeof imageData !== 'string') {
      return new Response(
        JSON.stringify({ error: "Image data is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate image data format (should be base64 or URL)
    const isBase64 = imageData.startsWith('data:image/');
    const isUrl = imageData.startsWith('http://') || imageData.startsWith('https://');
    
    if (!isBase64 && !isUrl) {
      return new Response(
        JSON.stringify({ error: "Invalid image format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Limit base64 image size (roughly 10MB)
    if (isBase64 && imageData.length > 10 * 1024 * 1024 * 1.37) {
      return new Response(
        JSON.stringify({ error: "Image too large (max 10MB)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("Service configuration error");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are a pet food safety expert. Analyze images of food items or product labels and identify any ingredients that may be toxic to dogs or cats. List ALL ingredients you can identify in the image, and specify which ones are toxic, their toxicity level (High, Medium, or Low), and why they're dangerous to pets."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please analyze this image and identify:\n1. All visible ingredients or food items\n2. Which ones are toxic to pets (dogs/cats)\n3. The toxicity level (High/Medium/Low) for each toxic item\n4. Brief explanation of why each toxic item is dangerous\n\nFormat your response as a JSON array with objects containing: ingredient, isToxic (boolean), toxicityLevel (if toxic), and reason (if toxic)."
              },
              {
                type: "image_url",
                image_url: {
                  url: imageData
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Service temporarily busy. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Image analysis failed");
    }

    const data = await response.json();
    const analysisText = data.choices?.[0]?.message?.content;

    if (!analysisText) {
      throw new Error("No analysis result received");
    }

    console.log("Image analysis completed for user:", user.id);

    return new Response(
      JSON.stringify({ analysis: analysisText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error analyzing food image:", error);
    
    // Check if it's an auth error
    if (error instanceof Error && error.message.includes('Authentication')) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }), 
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: "An error occurred. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
