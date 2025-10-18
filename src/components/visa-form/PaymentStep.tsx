import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader,
  CreditCard,
  Shield,
  CheckCircle,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  initiatePayment,
  checkPaymentStatus,
  generateOrderId,
  PaymentInitiateRequest,
  testPaymentIntegration,
} from "@/api/payment";
import { useUserEmail } from "@/hooks/useUserQuery";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";

interface PaymentStepProps {
  totalPrice: number;
  formData: any;
  travellers: any[];
  selectedService: any;
  applicationId?: string;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentFailed: (error: string) => void;
  onPayLater?: () => void;
  handlePrevStep: () => void;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  totalPrice,
  formData,
  travellers,
  selectedService,
  applicationId,
  onPaymentSuccess,
  onPaymentFailed,
  onPayLater,
  handlePrevStep,
}) => {
  const { t, language } = useLanguage();
  const { data: userEmail } = useUserEmail();
  const location = useLocation();
  console.log("🚀 ~ PaymentStep ~ location.pathname:", location.pathname);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string>("");
  const [paymentId, setPaymentId] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "processing" | "completed" | "failed" | null
  >(null);
  const [checkingStatus, setCheckingStatus] = useState(false);

  useEffect(() => {
    // Generate order ID when component mounts
    const newOrderId = generateOrderId(applicationId);
    setOrderId(newOrderId);
  }, [applicationId]);

  const handlePayment = async () => {
    console.log("🚀 ~ handlePayment ~ formData:", formData);

    // Get email from form data or current user
    const customerEmail = formData.email || userEmail;

    if (
      !customerEmail ||
      !travellers[0]?.firstName ||
      !travellers[0]?.lastName
    ) {
      toast.error("Missing required information for payment");
      return;
    }

    setIsProcessing(true);
    setPaymentStatus("processing");

    try {
      // Get current route without the base for redirectTo
      const currentRoute = location.pathname; // This gives us the route like "/service/spain-visa"

      const paymentData: PaymentInitiateRequest = {
        amount: totalPrice,
        currency: "SAR",
        order_id: orderId,
        description: `${selectedService?.title} - Visa Service for ${travellers[0]?.firstName} ${travellers[0]?.lastName}`,
        customer_email: customerEmail,
        customer_name: travellers[0]?.firstName + " " + travellers[0]?.lastName,
        customer_phone: formData.phoneNumber
          ? `${formData.countryCode}${formData.phoneNumber}`
          : undefined,
        return_url: `${window.location.origin}/payment/return?order_id=${orderId}`,
        callback_url: `${window.location.origin}/api/payment/callback`,
      };

      // Use current route as redirectTo parameter
      // Note: currentRoute is already URL-encoded, so we don't need to encode it again

      // For debugging, let's try the test payment first
      console.log("Trying test payment integration...");
      const testResponse = await testPaymentIntegration();
      console.log("🚀 ~ handlePayment ~ testResponse:", testResponse);

      // If test works, try the actual payment
      const response = await initiatePayment(paymentData, currentRoute);
      console.log("🚀 ~ handlePayment ~ response:", response);
      console.log("🚀 ~ handlePayment ~ response.status:", response.status);
      console.log(
        "🚀 ~ handlePayment ~ response.payment_url:",
        response.payment_url
      );

      // const response = await testPaymentIntegration();

      if (
        (response.status === "success" || response.status === "redirect") &&
        response.payment_url
      ) {
        setPaymentUrl(response.payment_url);
        setPaymentId(response.payment_id || "");
        setPaymentStatus("pending");
        toast.success("Payment link generated successfully");
      } else {
        console.error("Payment initiation failed with response:", response);
        throw new Error(response.error_message || "Failed to initiate payment");
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Payment initiation failed";
      toast.error(errorMessage);
      setPaymentStatus("failed");
      onPaymentFailed(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckPaymentStatus = async () => {
    if (!paymentId || !orderId) {
      toast.error("No payment to check");
      return;
    }

    setCheckingStatus(true);

    try {
      const statusResponse = await checkPaymentStatus(paymentId, orderId);

      if (statusResponse.payment_status === "completed") {
        setPaymentStatus("completed");
        toast.success("Payment completed successfully!");
        onPaymentSuccess({
          payment_id: paymentId,
          order_id: orderId,
          transaction_id: statusResponse.transaction_id,
          amount: totalPrice,
          currency: "SAR",
        });
      } else if (
        statusResponse.payment_status === "failed" ||
        statusResponse.payment_status === "cancelled"
      ) {
        setPaymentStatus("failed");
        toast.error("Payment failed or was cancelled");
        onPaymentFailed(statusResponse.error_message || "Payment failed");
      } else {
        toast.info("Payment is still pending. Please wait...");
      }
    } catch (error) {
      console.error("Payment status check error:", error);
      toast.error("Failed to check payment status");
    } finally {
      setCheckingStatus(false);
    }
  };

  const openPaymentWindow = () => {
    if (paymentUrl) {
      window.open(
        paymentUrl,
        "_blank",
        "width=800,height=600,scrollbars=yes,resizable=yes"
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-visa-dark">
          {language === "ar" ? "إتمام الدفع" : "Complete Payment"}
        </h2>
        <p className="text-gray-600">
          {language === "ar"
            ? "يرجى إتمام عملية الدفع لمعالجة طلب التأشيرة الخاص بك"
            : "Please complete the payment to process your visa application"}
        </p>
      </div>

      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            {language === "ar" ? "ملخص الدفع" : "Payment Summary"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">
              {language === "ar" ? "الخدمة:" : "Service:"}
            </span>
            <span className="font-medium">{selectedService?.title}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">
              {language === "ar" ? "عدد المسافرين:" : "Number of Travelers:"}
            </span>
            <span className="font-medium">{travellers.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">
              {language === "ar" ? "رقم الطلب:" : "Order ID:"}
            </span>
            <span className="font-mono text-sm">{orderId}</span>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>{language === "ar" ? "المجموع:" : "Total:"}</span>
              <span className="text-visa-gold">{totalPrice} SAR</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Status */}
      {paymentStatus && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              {paymentStatus === "processing" && (
                <div className="flex flex-col items-center gap-2">
                  <Loader className="h-8 w-8 animate-spin text-visa-gold" />
                  <p className="text-gray-600">
                    {language === "ar"
                      ? "جاري معالجة الدفع..."
                      : "Processing payment..."}
                  </p>
                </div>
              )}

              {paymentStatus === "pending" && paymentUrl && (
                <div className="space-y-4">
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle className="h-8 w-8 text-yellow-500" />
                    <p className="text-gray-600">
                      {language === "ar"
                        ? "تم إنشاء رابط الدفع"
                        : "Payment link generated"}
                    </p>
                  </div>

                  <Button
                    onClick={openPaymentWindow}
                    className="bg-visa-gold hover:bg-visa-gold/90"
                    size="lg"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {language === "ar"
                      ? "افتح صفحة الدفع"
                      : "Open Payment Page"}
                  </Button>

                  <p className="text-sm text-gray-500">
                    {language === "ar"
                      ? 'بعد إتمام الدفع، انقر على "التحقق من حالة الدفع" أدناه'
                      : 'After completing payment, click "Check Payment Status" below'}
                  </p>

                  <Button
                    onClick={handleCheckPaymentStatus}
                    variant="outline"
                    disabled={checkingStatus}
                  >
                    {checkingStatus ? (
                      <Loader className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    {language === "ar"
                      ? "التحقق من حالة الدفع"
                      : "Check Payment Status"}
                  </Button>
                </div>
              )}

              {paymentStatus === "completed" && (
                <div className="flex flex-col items-center gap-2 text-green-600">
                  <CheckCircle className="h-8 w-8" />
                  <p className="font-medium">
                    {language === "ar"
                      ? "تم الدفع بنجاح!"
                      : "Payment completed successfully!"}
                  </p>
                </div>
              )}

              {paymentStatus === "failed" && (
                <div className="flex flex-col items-center gap-2 text-red-600">
                  <XCircle className="h-8 w-8" />
                  <p className="font-medium">
                    {language === "ar" ? "فشل في الدفع" : "Payment failed"}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Info */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium text-green-800">
                {language === "ar" ? "دفع آمن" : "Secure Payment"}
              </p>
              <p className="text-sm text-green-700">
                {language === "ar"
                  ? "جميع المعاملات محمية بتشفير SSL ومعالجة آمنة"
                  : "All transactions are protected with SSL encryption and secure processing"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevStep}
          disabled={isProcessing || paymentStatus === "completed"}
          className="flex-1"
        >
          {language === "ar" ? "السابق" : "Previous"}
        </Button>

        {!paymentUrl && paymentStatus !== "completed" && (
          <>
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1 bg-visa-gold hover:bg-visa-gold/90"
            >
              {isProcessing ? (
                <Loader className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <CreditCard className="h-4 w-4 mr-2" />
              )}
              {t("payNow")}
            </Button>

            {onPayLater && (
              <Button
                onClick={onPayLater}
                variant="outline"
                disabled={isProcessing}
                className="flex-1 border-visa-gold text-visa-gold hover:bg-visa-gold/10"
              >
                {t("payLater")}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
