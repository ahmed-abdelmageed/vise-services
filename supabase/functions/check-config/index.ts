
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 200,
    });
  }

  try {
    // Check if RESEND_API_KEY is set
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const hasResendKey = !!resendApiKey;
    
    // Mask the key if it exists
    const maskedKey = hasResendKey ? 
      `${resendApiKey.substring(0, 4)}****${resendApiKey.substring(resendApiKey.length - 4)}` : 
      null;

    // Get all environment variables (names only, not values for security)
    const envVars = Object.keys(Deno.env.toObject());

    return new Response(
      JSON.stringify({
        hasResendKey,
        maskedKey,
        environmentVariables: envVars,
        message: hasResendKey ? 
          "RESEND_API_KEY is properly configured." : 
          "RESEND_API_KEY is not set. Please configure it in the Supabase Edge Function settings."
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error checking configuration:", error);
    return new Response(
      JSON.stringify({
        error: `Error checking configuration: ${error.message}`
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
