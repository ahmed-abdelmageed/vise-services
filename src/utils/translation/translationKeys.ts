
import { toast } from "sonner";
import { translations } from '@/contexts/language/translations';
import { TranslationDictionary } from '@/contexts/language/types';
import { translateText } from './translateText';

/**
 * Adds a new translation key to all language files
 * @param category The category file to add the translation to (e.g., 'header', 'form', 'common')
 * @param key The translation key to add
 * @param values Object containing values for each language (must include at least 'en')
 * @returns Promise that resolves to boolean indicating success
 */
export const addTranslationKey = async (
  category: string,
  key: string,
  values: { en: string; ar?: string }
): Promise<boolean> => {
  try {
    // Validate inputs
    if (!category || !key || !values.en) {
      toast.error("Missing required parameters for adding translation");
      return false;
    }

    // If Arabic translation isn't provided, try to get it via the translation service
    if (!values.ar) {
      try {
        values.ar = await translateText(values.en, 'ar', 'en');
      } catch (error) {
        console.error("Error translating to Arabic:", error);
        toast.error("Failed to auto-translate to Arabic");
        values.ar = values.en; // Fallback to English value
      }
    }

    // In a real implementation, this would update the actual translation files
    // For now, we'll simulate adding to the in-memory translations object
    
    // Apply the new translation to the in-memory translations object
    if (!translations.en[key]) {
      translations.en[key] = values.en;
    }
    
    if (!translations.ar[key]) {
      translations.ar[key] = values.ar || values.en;
    }

    // Log the update that would be made to the file system
    console.log(`Translation key "${key}" added to category "${category}":`, {
      en: values.en,
      ar: values.ar || values.en
    });
    
    toast.success(`Added translation key: ${key}`);
    return true;
  } catch (error) {
    console.error("Error adding translation key:", error);
    toast.error("Failed to add translation key");
    return false;
  }
};

/**
 * Helper function to get all translation keys from a specific category
 * @param category The category to get keys from (e.g., 'header', 'form', 'common')
 * @returns Array of translation keys
 */
export const getTranslationKeys = (category: string): string[] => {
  try {
    // This is a placeholder for getting keys from a specific category
    // In a real implementation, we would read the actual file
    // For now we'll return a sample based on the category
    
    // Sample implementation
    switch (category) {
      case 'header':
        return ['home', 'services', 'journey', 'fastSecure', 'searchServices', 'changeLanguage'];
      case 'form':
        return ['fullName', 'mothersName', 'nationality', 'travelers', 'travelDate', 'email'];
      case 'common':
        return ['loading', 'noData', 'error', 'tryAgain', 'success', 'saved'];
      default:
        return [];
    }
  } catch (error) {
    console.error(`Error getting translation keys for category: ${category}`, error);
    return [];
  }
};
