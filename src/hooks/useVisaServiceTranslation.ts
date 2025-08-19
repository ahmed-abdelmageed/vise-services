
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { translateServiceContent } from "@/utils/translation/translateServiceContent";
import { fallbackTranslations } from "@/utils/translation/fallbackTranslations";
import { EditVisaServiceFormValues } from "./useEditVisaServiceForm";

export function useVisaServiceTranslation(
  form: UseFormReturn<EditVisaServiceFormValues>,
  setActiveTab: (tab: string) => void
) {
  const [isTranslating, setIsTranslating] = useState(false);

  const handleAutoTranslate = async () => {
    try {
      setIsTranslating(true);
      
      // Get current English values
      const content = {
        title: form.getValues("title"),
        formTitle: form.getValues("formTitle"),
        formDescription: form.getValues("formDescription"),
        processingTime: form.getValues("processingTime")
      };
      
      console.log("Content to translate:", content);
      
      // Check if there's content to translate
      if (!content.title && !content.formTitle && !content.formDescription && !content.processingTime) {
        toast.error("No content to translate. Please fill in the English fields first.");
        setIsTranslating(false);
        return;
      }
      
      // Create a loading toast that shows progress
      
      try {
        // Translate content
        const translations = await translateServiceContent(content);
        
        console.log("Received translations:", translations);
        
        // Dismiss the loading toast
        
        // Set translated values in form
        if (translations.title_ar) form.setValue("title_ar", translations.title_ar);
        if (translations.formTitle_ar) form.setValue("formTitle_ar", translations.formTitle_ar);
        if (translations.formDescription_ar) form.setValue("formDescription_ar", translations.formDescription_ar);
        if (translations.processingTime_ar) form.setValue("processingTime_ar", translations.processingTime_ar);
        
        // Check if we received any translations
        const hasTranslations = 
          translations.title_ar || 
          translations.formTitle_ar || 
          translations.formDescription_ar || 
          translations.processingTime_ar;
          
        if (hasTranslations) {
          // Switch to Arabic tab to show translations
          setActiveTab("arabic");
          toast.success("Content translated successfully!");
        } else {
          toast.error("Translation service did not return any content. Using fallback translations.");
          applyFallbackTranslations(content, form);
          setActiveTab("arabic");
          toast.success("Applied fallback translations");
        }
      } catch (error) {
        throw error; // Re-throw to be caught by outer try-catch
      }
    } catch (error) {
      console.error("Translation error:", error);
      toast.error("Failed to translate content. Using fallback translations.");
      
      // Manual translation fallback
      applyFallbackTranslations(form.getValues(), form);
      setActiveTab("arabic");
      toast.success("Basic translation completed using fallback method.");
    } finally {
      setIsTranslating(false);
    }
  };

  return {
    isTranslating,
    handleAutoTranslate
  };
}

// Helper function to apply fallback translations
function applyFallbackTranslations(
  content: EditVisaServiceFormValues,
  form: UseFormReturn<EditVisaServiceFormValues>
) {
  const title = content.title;
  const formTitle = content.formTitle;
  const formDescription = content.formDescription;
  const processingTime = content.processingTime;
  
  // Try to find title in fallback translations
  if (title && fallbackTranslations[title]) {
    form.setValue("title_ar", fallbackTranslations[title]);
  } else if (title) {
    // Generic translation attempt
    if (title.includes("Visa")) {
      const country = title.replace(" Visa", "");
      form.setValue("title_ar", `تأشيرة ${country}`);
    } else {
      form.setValue("title_ar", title);
    }
  }
  
  // Try to find formTitle in fallback translations
  if (formTitle && fallbackTranslations[formTitle]) {
    form.setValue("formTitle_ar", fallbackTranslations[formTitle]);
  } else if (formTitle) {
    // Generic translation attempt
    if (formTitle.includes("Visa Application")) {
      const country = formTitle.replace(" Visa Application", "");
      form.setValue("formTitle_ar", `طلب تأشيرة ${country}`);
    } else if (formTitle.includes("Visa for")) {
      const parts = formTitle.split("Visa for");
      if (parts.length > 1) {
        const countryAndRest = parts[1].trim();
        form.setValue("formTitle_ar", `تأشيرة ${countryAndRest}`);
      } else {
        form.setValue("formTitle_ar", "طلب تأشيرة");
      }
    } else {
      form.setValue("formTitle_ar", "طلب تأشيرة");
    }
  }
  
  // Try to find formDescription in fallback translations
  if (formDescription && fallbackTranslations[formDescription]) {
    form.setValue("formDescription_ar", fallbackTranslations[formDescription]);
  } else if (formDescription) {
    if (formDescription.includes("Provide your information")) {
      form.setValue("formDescription_ar", "قدم معلوماتك للتقديم على التأشيرة");
    } else {
      form.setValue("formDescription_ar", "قدم معلوماتك للتقديم على التأشيرة");
    }
  }
  
  // Try to find processingTime in fallback translations
  if (processingTime && fallbackTranslations[processingTime]) {
    form.setValue("processingTime_ar", fallbackTranslations[processingTime]);
  } else if (processingTime) {
    let processedTime = processingTime;
    if (processingTime.includes("Processing time")) {
      processedTime = processingTime.replace("Processing time", "وقت المعالجة");
    }
    // Extract numbers and preserve them
    const numbersAndDashMatch = processingTime.match(/(\d+[-]?\d*)/);
    if (numbersAndDashMatch) {
      const numbersAndDash = numbersAndDashMatch[0];
      form.setValue("processingTime_ar", `وقت المعالجة: ${numbersAndDash} أيام`);
    } else {
      form.setValue("processingTime_ar", processedTime);
    }
  }
}
