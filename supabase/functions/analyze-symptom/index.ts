import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { petType, symptoms, age, breed, duration } = await req.json();
    
    console.log("Analyzing symptoms for:", { petType, age, breed, duration });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a veterinary education assistant. Provide educational information about pet symptoms.

CRITICAL: You MUST respond with ONLY the function call. Do not include any other text, explanations, or markdown.

Important disclaimers:
- This is educational information only
- Not a diagnosis or medical advice
- Always recommend consulting a licensed veterinarian
- Be clear about limitations

Provide helpful, accurate educational information about common pet symptoms.`;

    const userPrompt = `Pet Type: ${petType}
${age ? `Age: ${age}` : ""}
${breed ? `Breed: ${breed}` : ""}
${duration ? `Duration: ${duration}` : ""}

Symptoms: ${symptoms}

Provide educational information about these symptoms including:
1. Urgency level (HIGH, MEDIUM, or LOW)
2. 3-4 possible common causes
3. General educational information
4. Warning signs requiring immediate help
5. Home monitoring tips`;

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
        tools: [
          {
            type: "function",
            function: {
              name: "provide_symptom_information",
              description: "Provide educational information about pet symptoms",
              parameters: {
                type: "object",
                properties: {
                  urgency: {
                    type: "string",
                    enum: ["HIGH", "MEDIUM", "LOW"],
                    description: "Urgency level based on symptoms"
                  },
                  urgencyMessage: {
                    type: "string",
                    description: "Brief message about urgency (e.g., 'See veterinarian within 24 hours')"
                  },
                  possibleCauses: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-4 common possible causes"
                  },
                  generalInfo: {
                    type: "string",
                    description: "2-3 paragraphs of educational information about these symptoms"
                  },
                  warningSignsImmediate: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-4 warning signs requiring immediate veterinary help"
                  },
                  homeMonitoringTips: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-4 tips for monitoring at home"
                  }
                },
                required: ["urgency", "urgencyMessage", "possibleCauses", "generalInfo", "warningSignsImmediate", "homeMonitoringTips"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "provide_symptom_information" } }
      })
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }), 
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
      if (response.status === 402) {
        console.error("Payment required");
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), 
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received");
    
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("No tool call in response");
    }

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Error in analyze-symptom function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
