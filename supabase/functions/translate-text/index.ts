
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TranslateRequest {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Only proceed for POST requests
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse request body
    const requestData = await req.json();
    const { text, targetLanguage = 'ar', sourceLanguage = 'en' } = requestData as TranslateRequest;

    if (!text || !targetLanguage) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters: text or targetLanguage" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Skip translation if text is empty
    if (text.trim() === '') {
      console.log("Empty text received, returning empty string");
      return new Response(
        JSON.stringify({ 
          translation: "",
          sourceLanguage,
          targetLanguage,
          originalText: text
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Translating text from ${sourceLanguage} to ${targetLanguage}`);
    console.log(`Text to translate: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);

    // Use Google Translate API instead of LibreTranslate for better reliability
    const GOOGLE_TRANSLATE_URL = `https://translation.googleapis.com/language/translate/v2?key=${Deno.env.get("GOOGLE_TRANSLATE_API_KEY")}`;
    
    try {
      // Enhanced fallback dictionary with more countries and languages
      const fallbackTranslations: Record<string, string> = {
        // Common service titles
        "USA Visa": "تأشيرة أمريكا",
        "UK Visa": "تأشيرة بريطانيا",
        "British Visa": "تأشيرة بريطانيا", 
        "Schengen Visa": "تأشيرة شنغن",
        "Canada Visa": "تأشيرة كندا",
        "Australia Visa": "تأشيرة أستراليا",
        "Italy Visa": "تأشيرة إيطاليا",
        "Spain Visa": "تأشيرة إسبانيا",
        "France Visa": "تأشيرة فرنسا",
        "Germany Visa": "تأشيرة ألمانيا",
        "Austria Visa": "تأشيرة النمسا",
        "Czech Republic Visa": "تأشيرة جمهورية التشيك",
        "UAE Visa": "تأشيرة الإمارات",
        "Saudi Visa": "تأشيرة المملكة العربية السعودية",
        "Jordan Visa": "تأشيرة الأردن",
        // Form related
        "USA Visa Application": "طلب تأشيرة أمريكا",
        "UK Visa Application": "طلب تأشيرة بريطانيا",
        "British Visa Application": "طلب تأشيرة بريطانيا",
        "British Visa for GCC Nationals": "تأشيرة بريطانيا لمواطني دول مجلس التعاون الخليجي",
        "Schengen Visa Application": "طلب تأشيرة شنغن",
        "Canada Visa Application": "طلب تأشيرة كندا",
        "Australia Visa Application": "طلب تأشيرة أستراليا",
        "Italy Visa Application": "طلب تأشيرة إيطاليا",
        "Austria Visa Application": "طلب تأشيرة النمسا",
        "Visa Application": "طلب تأشيرة",
        "Provide your information to apply for a USA Visa": "قدم معلوماتك للتقديم على تأشيرة أمريكا",
        "Provide your information to apply for a UK Visa": "قدم معلوماتك للتقديم على تأشيرة بريطانيا",
        "Provide your information to apply for a British Visa": "قدم معلوماتك للتقديم على تأشيرة بريطانيا",
        "Provide your information to apply for a Schengen Visa": "قدم معلوماتك للتقديم على تأشيرة شنغن",
        "Provide your information to apply for an Italy Visa": "قدم معلوماتك للتقديم على تأشيرة إيطاليا",
        "Provide your information to apply for an Austria Visa": "قدم معلوماتك للتقديم على تأشيرة النمسا",
        "Provide your information to apply for a Czech Republic Visa": "قدم معلوماتك للتقديم على تأشيرة جمهورية التشيك",
        "Processing time: 3-5 days": "وقت المعالجة: 3-5 أيام",
        "Processing time: 5-7 days": "وقت المعالجة: 5-7 أيام",
        "Processing time: 7-10 days": "وقت المعالجة: 7-10 أيام",
      };
      
      // Fall back to a local mapping for common phrases if there's no API key
      // This ensures base functionality even without translation API
      if (!Deno.env.get("GOOGLE_TRANSLATE_API_KEY")) {
        console.log("No Google Translate API key found, using fallback translation");
        
        // Check if we have a fallback translation
        const fallbackTranslation = fallbackTranslations[text];
        
        if (fallbackTranslation) {
          console.log(`Found fallback translation: "${fallbackTranslation}"`);
          return new Response(
            JSON.stringify({ 
              translation: fallbackTranslation,
              sourceLanguage,
              targetLanguage,
              originalText: text,
              method: "fallback"
            }),
            {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
        
        // If no direct match, try to find partial matches or process translation
        if (text.includes("Processing time")) {
          const translatedText = text.replace("Processing time", "وقت المعالجة");
          console.log(`Generated translation for processing time: "${translatedText}"`);
          return new Response(
            JSON.stringify({ 
              translation: translatedText,
              sourceLanguage,
              targetLanguage,
              originalText: text,
              method: "pattern"
            }),
            {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        // Attempt to handle generic visa titles
        if (text.includes("Visa") && !text.includes("Application")) {
          const country = text.replace(" Visa", "");
          const translatedText = `تأشيرة ${country}`;
          console.log(`Generated translation for visa: "${translatedText}"`);
          return new Response(
            JSON.stringify({
              translation: translatedText,
              sourceLanguage,
              targetLanguage,
              originalText: text,
              method: "pattern"
            }),
            {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        // Attempt to handle visa application titles
        if (text.includes("Visa Application")) {
          const country = text.replace(" Visa Application", "");
          const translatedText = `طلب تأشيرة ${country}`;
          console.log(`Generated translation for visa application: "${translatedText}"`);
          return new Response(
            JSON.stringify({
              translation: translatedText,
              sourceLanguage,
              targetLanguage,
              originalText: text,
              method: "pattern"
            }),
            {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        // Handle form descriptions
        if (text.includes("Provide your information to apply for")) {
          const translatedText = "قدم معلوماتك للتقديم على التأشيرة";
          console.log(`Generated translation for form description: "${translatedText}"`);
          return new Response(
            JSON.stringify({
              translation: translatedText,
              sourceLanguage,
              targetLanguage,
              originalText: text,
              method: "pattern"
            }),
            {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
        
        // For other text, return transliteration (maintaining Latin characters)
        // This is less optimal but prevents errors
        console.log("No fallback translation found, returning original text");
        return new Response(
          JSON.stringify({ 
            translation: text, // Return original as fallback
            sourceLanguage,
            targetLanguage,
            originalText: text,
            method: "passthrough"
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      // If we have a Google Translate API key, use it
      console.log("Calling Google Translate API...");
      const response = await fetch(GOOGLE_TRANSLATE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: text,
          source: sourceLanguage,
          target: targetLanguage,
          format: "text"
        }),
        // Add timeout to avoid hanging requests
        signal: AbortSignal.timeout(15000) // 15 second timeout
      });

      console.log("Google Translate API response status:", response.status);
      
      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Google Translate API error status:", response.status);
        console.error("Google Translate API error response:", errorBody);
        
        // Fall back to local translations
        console.log("API error, falling back to local translations");
        
        const fallbackTranslation = fallbackTranslations[text];
        
        if (fallbackTranslation) {
          return new Response(
            JSON.stringify({ 
              translation: fallbackTranslation,
              sourceLanguage,
              targetLanguage,
              originalText: text,
              method: "fallback-after-error"
            }),
            {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
        
        if (text.includes("Processing time")) {
          const translatedText = text.replace("Processing time", "وقت المعالجة");
          return new Response(
            JSON.stringify({ 
              translation: translatedText,
              sourceLanguage,
              targetLanguage,
              originalText: text,
              method: "pattern-after-error"
            }),
            {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        // Attempt to handle generic visa titles
        if (text.includes("Visa") && !text.includes("Application")) {
          const country = text.replace(" Visa", "");
          const translatedText = `تأشيرة ${country}`;
          return new Response(
            JSON.stringify({
              translation: translatedText,
              sourceLanguage,
              targetLanguage,
              originalText: text,
              method: "pattern-after-error"
            }),
            {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        // Attempt to handle visa application titles
        if (text.includes("Visa Application")) {
          const country = text.replace(" Visa Application", "");
          const translatedText = `طلب تأشيرة ${country}`;
          return new Response(
            JSON.stringify({
              translation: translatedText,
              sourceLanguage,
              targetLanguage,
              originalText: text,
              method: "pattern-after-error"
            }),
            {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        // Handle form descriptions
        if (text.includes("Provide your information to apply for")) {
          const translatedText = "قدم معلوماتك للتقديم على التأشيرة";
          return new Response(
            JSON.stringify({
              translation: translatedText,
              sourceLanguage,
              targetLanguage,
              originalText: text,
              method: "pattern-after-error"
            }),
            {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
        
        return new Response(
          JSON.stringify({ 
            translation: text, // Return original as fallback
            sourceLanguage,
            targetLanguage,
            originalText: text,
            method: "passthrough-after-error"
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const responseData = await response.json();
      console.log("Google Translate API response:", JSON.stringify(responseData).substring(0, 200) + "...");
      
      const translatedText = responseData.data?.translations?.[0]?.translatedText;
      
      if (!translatedText) {
        console.error("Invalid response from Google Translate API:", JSON.stringify(responseData));
        // Use the fallback mechanism here too
        
        const fallbackTranslation = fallbackTranslations[text];
        
        if (fallbackTranslation) {
          return new Response(
            JSON.stringify({ 
              translation: fallbackTranslation,
              sourceLanguage,
              targetLanguage,
              originalText: text,
              method: "fallback-after-invalid-response"
            }),
            {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
        
        // Try pattern matching as fallback
        if (text.includes("Processing time")) {
          const translatedText = text.replace("Processing time", "وقت المعالجة");
          return new Response(
            JSON.stringify({ 
              translation: translatedText,
              sourceLanguage,
              targetLanguage,
              originalText: text,
              method: "pattern-after-invalid-response"
            }),
            {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        // Attempt to handle generic visa titles
        if (text.includes("Visa") && !text.includes("Application")) {
          const country = text.replace(" Visa", "");
          const translatedText = `تأشيرة ${country}`;
          return new Response(
            JSON.stringify({
              translation: translatedText,
              sourceLanguage,
              targetLanguage,
              originalText: text,
              method: "pattern-after-invalid-response"
            }),
            {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        // Attempt to handle visa application titles
        if (text.includes("Visa Application")) {
          const country = text.replace(" Visa Application", "");
          const translatedText = `طلب تأشيرة ${country}`;
          return new Response(
            JSON.stringify({
              translation: translatedText,
              sourceLanguage,
              targetLanguage,
              originalText: text,
              method: "pattern-after-invalid-response"
            }),
            {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        // Handle form descriptions
        if (text.includes("Provide your information to apply for")) {
          const translatedText = "قدم معلوماتك للتقديم على التأشيرة";
          return new Response(
            JSON.stringify({
              translation: translatedText,
              sourceLanguage,
              targetLanguage,
              originalText: text,
              method: "pattern-after-invalid-response"
            }),
            {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
        
        return new Response(
          JSON.stringify({ 
            translation: text, // Return original text as fallback
            sourceLanguage,
            targetLanguage,
            originalText: text,
            method: "api-invalid-response"
          }),
          {
            status: 200, // Return 200 to avoid errors in the client
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      console.log(`Translation result: "${translatedText.substring(0, 50)}${translatedText.length > 50 ? '...' : ''}"`);

      return new Response(
        JSON.stringify({ 
          translation: translatedText.trim(),
          sourceLanguage,
          targetLanguage,
          originalText: text,
          method: "google-translate"
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Error calling translation API:", error);
      
      // Advanced fallback mechanism
      const fallbackTranslations: Record<string, string> = {
        // Same fallback dictionary as above
        "USA Visa": "تأشيرة أمريكا",
        "UK Visa": "تأشيرة بريطانيا",
        "British Visa": "تأشيرة بريطانيا",
        "Schengen Visa": "تأشيرة شنغن",
        "Canada Visa": "تأشيرة كندا",
        "Australia Visa": "تأشيرة أستراليا",
        "Italy Visa": "تأشيرة إيطاليا",
        "Austria Visa": "تأشيرة النمسا",
        "Czech Republic Visa": "تأشيرة جمهورية التشيك",
        "USA Visa Application": "طلب تأشيرة أمريكا",
        "UK Visa Application": "طلب تأشيرة بريطانيا",
        "British Visa Application": "طلب تأشيرة بريطانيا",
        "British Visa for GCC Nationals": "تأشيرة بريطانيا لمواطني دول مجلس التعاون الخليجي",
        "Schengen Visa Application": "طلب تأشيرة شنغن",
        "Canada Visa Application": "طلب تأشيرة كندا",
        "Australia Visa Application": "طلب تأشيرة أستراليا",
        "Italy Visa Application": "طلب تأشيرة إيطاليا",
        "Austria Visa Application": "طلب تأشيرة النمسا",
        "Visa Application": "طلب تأشيرة",
        "Provide your information to apply for a USA Visa": "قدم معلوماتك للتقديم على تأشيرة أمريكا",
        "Provide your information to apply for a UK Visa": "قدم معلوماتك للتقديم على تأشيرة بريطانيا",
        "Provide your information to apply for a British Visa": "قدم معلوماتك للتقديم على تأشيرة بريطانيا",
        "Provide your information to apply for a Schengen Visa": "قدم معلوماتك للتقديم على تأشيرة شنغن",
        "Provide your information to apply for an Italy Visa": "قدم معلوماتك للتقديم على تأشيرة إيطاليا",
        "Provide your information to apply for an Austria Visa": "قدم معلوماتك للتقديم على تأشيرة النمسا",
        "Processing time: 3-5 days": "وقت المعالجة: 3-5 أيام",
        "Processing time: 5-7 days": "وقت المعالجة: 5-7 أيام",
        "Processing time: 7-10 days": "وقت المعالجة: 7-10 أيام",
      };
      
      const fallbackTranslation = fallbackTranslations[text];
      
      if (fallbackTranslation) {
        return new Response(
          JSON.stringify({ 
            translation: fallbackTranslation,
            sourceLanguage,
            targetLanguage,
            originalText: text,
            method: "fallback-after-api-error"
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      // Try pattern matching as a more aggressive fallback
      if (text.includes("Processing time")) {
        const translatedText = text.replace("Processing time", "وقت المعالجة");
        return new Response(
          JSON.stringify({ 
            translation: translatedText,
            sourceLanguage,
            targetLanguage,
            originalText: text,
            method: "pattern-after-api-error"
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Attempt to handle generic visa titles
      if (text.includes("Visa") && !text.includes("Application")) {
        const country = text.replace(" Visa", "");
        const translatedText = `تأشيرة ${country}`;
        return new Response(
          JSON.stringify({
            translation: translatedText,
            sourceLanguage,
            targetLanguage,
            originalText: text,
            method: "pattern-after-api-error"
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Attempt to handle visa application titles
      if (text.includes("Visa Application")) {
        const country = text.replace(" Visa Application", "");
        const translatedText = `طلب تأشيرة ${country}`;
        return new Response(
          JSON.stringify({
            translation: translatedText,
            sourceLanguage,
            targetLanguage,
            originalText: text,
            method: "pattern-after-api-error"
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Handle form descriptions
      if (text.includes("Provide your information to apply for")) {
        const translatedText = "قدم معلوماتك للتقديم على التأشيرة";
        return new Response(
          JSON.stringify({
            translation: translatedText,
            sourceLanguage,
            targetLanguage,
            originalText: text,
            method: "pattern-after-api-error"
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      // Always return a 200 response with the original text to avoid client errors
      return new Response(
        JSON.stringify({ 
          translation: text, // Return original text as fallback
          sourceLanguage,
          targetLanguage,
          originalText: text,
          error: error.message,
          method: "error-fallback"
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error processing translation request:", error);
    // Always return a 200 response with the original text to avoid client errors
    return new Response(
      JSON.stringify({ 
        translation: typeof requestData?.text === 'string' ? requestData.text : "Translation error",
        error: error.message,
        method: "critical-error-fallback"
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
