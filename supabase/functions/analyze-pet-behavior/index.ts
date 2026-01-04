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
    const { petType, petAge, behaviorIssue } = body;

    // Input validation
    if (!petType || typeof petType !== 'string') {
      return new Response(
        JSON.stringify({ error: "Pet type is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!behaviorIssue || typeof behaviorIssue !== 'string') {
      return new Response(
        JSON.stringify({ error: "Behavior issue description is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (behaviorIssue.length > 2000) {
      return new Response(
        JSON.stringify({ error: "Behavior description too long (max 2000 characters)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const validPetTypes = ['dog', 'cat', 'bird', 'rabbit', 'other'];
    if (!validPetTypes.includes(petType.toLowerCase())) {
      return new Response(
        JSON.stringify({ error: "Invalid pet type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("Service configuration error");
    }

    const systemPrompt = `You are an expert veterinary behaviorist helping pet owners understand and solve their pets' behavior problems. Provide practical, empathetic, and actionable advice.

Analyze the behavior issue and respond with a JSON object in this exact format:
{
  "diagnosisSummary": "A clear, concise explanation of what might be causing this behavior (2-3 sentences)",
  "solutions": [
    "First practical solution with specific steps",
    "Second practical solution with specific steps", 
    "Third practical solution with specific steps"
  ],
  "vetAdvice": "When to seek professional help - be specific about warning signs"
}`;

    const userPrompt = `Pet Type: ${petType}
Pet Age: ${petAge || 'Unknown'}
Behavior Issue: ${behaviorIssue}

Please analyze this behavior problem and provide your expert advice.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
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
      throw new Error("AI analysis failed");
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content;

    console.log("Analysis completed for user:", user.id);

    return new Response(
      JSON.stringify({ analysis: analysisText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in analyze-pet-behavior function:", error);
    
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
