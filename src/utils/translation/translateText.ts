
import { supabase } from '@/integrations/supabase/client';
import { fallbackTranslations } from './fallbackTranslations';
import { toast } from "sonner";

/**
 * Translates text using translation service via Supabase Edge Functions
 * @param text Text to translate
 * @param targetLanguage Target language code (e.g., 'ar' for Arabic)
 * @param sourceLanguage Source language code (e.g., 'en' for English)
 * @returns Translated text
 */
export const translateText = async (
  text: string,
  targetLanguage: string = 'ar',
  sourceLanguage: string = 'en'
): Promise<string> => {
  if (!text || text.trim() === '') return '';

  // Check if we have a fallback translation locally first
  if (fallbackTranslations[text]) {
    console.log(`Using local fallback translation for: "${text}"`);
    return fallbackTranslations[text];
  }

  // Special case handling for common visa-related texts
  if (text.toLowerCase().includes("processing time")) {
    console.log(`Using pattern replacement for processing time: "${text}"`);
    // Extract numbers if present
    const numbersMatch = text.match(/(\d+[-]?\d*)/);
    if (numbersMatch) {
      const numbers = numbersMatch[0];
      return `وقت المعالجة: ${numbers} أيام`;
    }
    return text.replace(/Processing time|processing time/gi, "وقت المعالجة");
  }

  // Generic fallback for visa-related content
  if (text.toLowerCase().includes("visa") && !text.toLowerCase().includes("application")) {
    const visaName = text.replace(/\s+visa\b/i, "");
    console.log(`Using pattern replacement for visa type: "${visaName} Visa"`);
    return `تأشيرة ${visaName}`;
  }

  if (text.toLowerCase().includes("visa application")) {
    const visaName = text.replace(/\s+visa application\b/i, "");
    console.log(`Using pattern replacement for visa application: "${visaName} Visa Application"`);
    return `طلب تأشيرة ${visaName}`;
  }

  if (text.toLowerCase().includes("visa for")) {
    const parts = text.split(/visa for/i);
    if (parts.length > 1) {
      const countryAndRest = parts[1].trim();
      return `تأشيرة ${countryAndRest}`;
    }
  }

  if (text.toLowerCase().includes("provide your information")) {
    console.log(`Using pattern replacement for form description: "${text}"`);
    return "قدم معلوماتك للتقديم على التأشيرة";
  }

  let retries = 0;
  const maxRetries = 1; // Reduced retries to avoid long wait times

  const attemptTranslation = async (): Promise<string> => {
    try {
      console.log(`Attempting to translate: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`);
      
      const { data, error } = await supabase.functions.invoke("translate-text", {
        body: {
          text,
          targetLanguage,
          sourceLanguage,
        },
      });

      if (error) {
        console.error("Edge function error during translation:", error);
        return applyFallbackStrategies(text);
      }
      
      if (!data) {
        console.error("No data returned from translation service");
        return applyFallbackStrategies(text);
      }
      
      if (data.error) {
        console.error("Translation service returned error:", data.error, data.details);
        return applyFallbackStrategies(text);
      }
      
      // Check if we have an actual translation
      if (data.translation === undefined) {
        console.error("Invalid translation response", data);
        return applyFallbackStrategies(text);
      }
      
      // If translation is empty but original text wasn't, use fallback strategies
      if (!data.translation && text) {
        console.log("Empty translation received, using fallback methods");
        return applyFallbackStrategies(text);
      }
      
      console.log(`Translation successful: "${data.translation?.substring(0, 30)}${data.translation?.length > 30 ? '...' : ''}"`);
      return data.translation || text;
    } catch (error) {
      console.error(`Translation attempt ${retries + 1} failed:`, error);
      
      if (retries < maxRetries) {
        retries++;
        console.log(`Retrying translation (${retries}/${maxRetries})...`);
        // Wait 1 second before retrying to avoid overwhelming the service
        await new Promise(resolve => setTimeout(resolve, 1000));
        return attemptTranslation();
      }
      
      return applyFallbackStrategies(text);
    }
  };

  // Helper function to apply fallback strategies
  const applyFallbackStrategies = (originalText: string): string => {
    // Check for common patterns and apply corresponding translations
    if (originalText.toLowerCase().includes("processing time")) {
      const numbersMatch = originalText.match(/(\d+[-]?\d*)/);
      if (numbersMatch) {
        const numbers = numbersMatch[0];
        return `وقت المعالجة: ${numbers} أيام`;
      }
      return originalText.replace(/Processing time|processing time/gi, "وقت المعالجة");
    }
    
    if (originalText.toLowerCase().includes("visa") && !originalText.toLowerCase().includes("application")) {
      const visaName = originalText.replace(/\s+visa\b/i, "");
      return `تأشيرة ${visaName}`;
    }
    
    if (originalText.toLowerCase().includes("visa application")) {
      const visaName = originalText.replace(/\s+visa application\b/i, "");
      return `طلب تأشيرة ${visaName}`;
    }
    
    if (originalText.toLowerCase().includes("visa for")) {
      const parts = originalText.split(/visa for/i);
      if (parts.length > 1) {
        const countryAndRest = parts[1].trim();
        return `تأشيرة ${countryAndRest}`;
      }
    }
    
    if (originalText.toLowerCase().includes("provide your information")) {
      return "قدم معلوماتك للتقديم على التأشيرة";
    }
    
    // For British Visa specifically
    if (originalText.toLowerCase().includes("british visa")) {
      return "تأشيرة بريطانيا";
    }

    // For GCC Nationals specifically
    if (originalText.toLowerCase().includes("gcc nationals")) {
      return "لمواطني دول مجلس التعاون الخليجي";
    }
    
    return originalText; // Return original text if no fallback available
  };

  try {
    return await attemptTranslation();
  } catch (error) {
    console.error("All translation attempts failed:", error);
    return applyFallbackStrategies(text);
  }
};
