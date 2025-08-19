
import { toast } from "sonner";
import { translateText } from './translateText';

/**
 * Translates service content from English to Arabic
 * @param content Object with content fields to translate
 * @returns Object with translated Arabic fields
 */
export const translateServiceContent = async (content: {
  title?: string;
  formTitle?: string;
  formDescription?: string;
  processingTime?: string;
}) => {
  const translations = {
    title_ar: '',
    formTitle_ar: '',
    formDescription_ar: '',
    processingTime_ar: ''
  };

  try {
    // Create a batch of promises to translate all fields in parallel
    const translationPromises = [];
    const fieldNames = [];
    
    if (content.title && content.title.trim() !== '') {
      translationPromises.push(translateText(content.title, 'ar', 'en'));
      fieldNames.push('title');
    }
    
    if (content.formTitle && content.formTitle.trim() !== '') {
      translationPromises.push(translateText(content.formTitle, 'ar', 'en'));
      fieldNames.push('formTitle');
    }
    
    if (content.formDescription && content.formDescription.trim() !== '') {
      translationPromises.push(translateText(content.formDescription, 'ar', 'en'));
      fieldNames.push('formDescription');
    }
    
    if (content.processingTime && content.processingTime.trim() !== '') {
      translationPromises.push(translateText(content.processingTime, 'ar', 'en'));
      fieldNames.push('processingTime');
    }
    
    // Execute all translations in parallel for better performance
    if (translationPromises.length > 0) {
      const results = await Promise.allSettled(translationPromises);
      
      // Process results and set translations
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const fieldName = fieldNames[index];
          translations[`${fieldName}_ar`] = result.value;
        } else {
          console.error(`Failed to translate ${fieldNames[index]}:`, result.reason);
          // Apply fallback for this specific field
          const englishValue = content[fieldNames[index]];
          if (fieldNames[index] === 'title' && englishValue) {
            translations.title_ar = englishValue.includes('Visa') 
              ? `تأشيرة ${englishValue.replace(' Visa', '')}` 
              : englishValue;
          } else if (fieldNames[index] === 'formTitle' && englishValue) {
            translations.formTitle_ar = englishValue.includes('Visa Application')
              ? `طلب تأشيرة ${englishValue.replace(' Visa Application', '')}`
              : 'طلب تأشيرة';
          } else if (fieldNames[index] === 'formDescription') {
            translations.formDescription_ar = "قدم معلوماتك للتقديم على التأشيرة";
          } else if (fieldNames[index] === 'processingTime' && englishValue) {
            translations.processingTime_ar = englishValue.replace('Processing time', 'وقت المعالجة');
          }
        }
      });
    }
    
    // Check if any translations were successfully obtained
    const hasTranslations = 
      translations.title_ar || 
      translations.formTitle_ar || 
      translations.formDescription_ar || 
      translations.processingTime_ar;
    
    if (!hasTranslations) {
      console.warn("No translations were generated. Using fallback methods.");
      applyFallbackTranslations(content, translations);
    }

    // Log the translations for debugging
    console.log("Translation results:", translations);

    return translations;
  } catch (error) {
    console.error("Error translating service content:", error);
    
    applyFallbackTranslations(content, translations);
    return translations;
  }
};

// Helper function to apply fallback translations
const applyFallbackTranslations = (
  content: {
    title?: string;
    formTitle?: string;
    formDescription?: string;
    processingTime?: string;
  },
  translations: {
    title_ar: string;
    formTitle_ar: string;
    formDescription_ar: string;
    processingTime_ar: string;
  }
) => {
  if (content.title) {
    if (content.title.includes("Visa")) {
      const country = content.title.replace(" Visa", "");
      translations.title_ar = `تأشيرة ${country}`;
    } else if (content.title.includes("British")) {
      translations.title_ar = "تأشيرة بريطانيا";
    } else {
      translations.title_ar = content.title;
    }
  }
  
  if (content.formTitle) {
    if (content.formTitle.includes("Visa Application")) {
      const country = content.formTitle.replace(" Visa Application", "");
      translations.formTitle_ar = `طلب تأشيرة ${country}`;
    } else if (content.formTitle.includes("Visa for")) {
      const parts = content.formTitle.split("Visa for");
      if (parts.length > 1) {
        const countryAndRest = parts[1].trim();
        translations.formTitle_ar = `تأشيرة ${countryAndRest}`;
      } else {
        translations.formTitle_ar = "طلب تأشيرة";
      }
    } else if (content.formTitle.includes("British")) {
      translations.formTitle_ar = "تأشيرة بريطانيا";
    } else if (content.formTitle.includes("GCC Nationals")) {
      translations.formTitle_ar = "لمواطني دول مجلس التعاون الخليجي";
    } else {
      translations.formTitle_ar = content.formTitle;
    }
  }
  
  if (content.formDescription) {
    translations.formDescription_ar = "قدم معلوماتك للتقديم على التأشيرة";
  }
  
  if (content.processingTime) {
    const numbersMatch = content.processingTime.match(/(\d+[-]?\d*)/);
    if (numbersMatch) {
      const numbers = numbersMatch[0];
      translations.processingTime_ar = `وقت المعالجة: ${numbers} أيام`;
    } else {
      translations.processingTime_ar = content.processingTime.replace("Processing time", "وقت المعالجة");
    }
  }
};
