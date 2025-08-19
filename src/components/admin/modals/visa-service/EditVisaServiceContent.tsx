import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader, Languages } from "lucide-react";
import { useVisaServiceTranslation } from "@/hooks/useVisaServiceTranslation";
import { GeneralFields } from "./GeneralFields";
import { RequirementToggles } from "./RequirementToggles";
import { DialogFooter } from "@/components/ui/dialog";
import { Save } from "lucide-react";

interface EditVisaServiceContentProps {
  form: ReturnType<
    typeof import("@/hooks/useEditVisaServiceForm").useEditVisaServiceForm
  >["form"];
  isSubmitting: boolean;
  onSubmit: (data: any) => Promise<void>;
  onCancelClick: () => void;
}

export const EditVisaServiceContent = ({
  form,
  isSubmitting,
  onSubmit,
  onCancelClick,
}: EditVisaServiceContentProps) => {
  const [activeTab, setActiveTab] = useState<string>("english");
  const { isTranslating, handleAutoTranslate } = useVisaServiceTranslation(
    form,
    setActiveTab
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="mb-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleAutoTranslate}
            disabled={isTranslating || isSubmitting}
            className="w-full flex items-center justify-center"
          >
            {isTranslating ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" /> Translating...
              </>
            ) : (
              <>
                <Languages className="mr-2 h-4 w-4" /> Auto-Translate to Arabic
              </>
            )}
          </Button>
        </div>

        <GeneralFields
          form={form}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <RequirementToggles form={form} />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onCancelClick}
            disabled={isSubmitting || isTranslating}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || isTranslating}
            className="bg-visa-gold hover:bg-visa-gold/90"
          >
            {isSubmitting ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
