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
import { fetchApplicationByInvoiceClientId } from "@/api/invoices";
import { useApplicationByInvoice } from "@/hooks/useApplicationByInvoice";
import { useUserEmail } from "@/hooks/useUserQuery";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";

interface PaymentStepProps {
  totalPrice: number;
  formData: any;
  travellers: any[];
  selectedService: any;
  applicationId?: string;
  orderId?: string | null;
  invoice?: any; // Optional invoice data with client_id
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
  orderId: propOrderId,
  invoice,
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
  const [showTermsModal, setShowTermsModal] = useState(false);
  
  // Fetch application data when invoice with client_id is provided
  const { 
    data: applicationData, 
    isLoading: isLoadingApplication,
    error: applicationError 
  } = useApplicationByInvoice(invoice?.client_id || "", !!invoice?.client_id);

  useEffect(() => {
    // Use prop order ID if available, otherwise generate new one
    const newOrderId = propOrderId || generateOrderId(applicationId);
    setOrderId(newOrderId);
  }, [applicationId, propOrderId]);

  // Log application data and errors
  useEffect(() => {
    if (applicationData) {
      console.log("🚀 ~ PaymentStep ~ Fetched application data:", applicationData);
    }
    if (applicationError) {
      console.error("Error fetching application data:", applicationError);
      toast.error("Failed to load application details");
    }
  }, [applicationData, applicationError]);

  const handlePayment = async () => {
    console.log("🚀 ~ handlePayment ~ formData:", formData);
    console.log("🚀 ~ handlePayment ~ invoice:", invoice);
    console.log("🚀 ~ handlePayment ~ applicationData:", applicationData);

    // Get email from application data, form data, or current user (in that priority)
    const customerEmail = applicationData?.email || formData.email || userEmail;
    
    // Get customer name from application data or travellers
    const customerName = applicationData 
      ? `${applicationData.first_name} ${applicationData.last_name}`
      : travellers[0]?.firstName && travellers[0]?.lastName 
        ? `${travellers[0].firstName} ${travellers[0].lastName}`
        : "";

    if (!customerEmail || !customerName) {
      toast.error("Missing required information for payment");
      return;
    }

    setIsProcessing(true);
    setPaymentStatus("processing");

    try {
      // إذا كان هناك خطأ في جلب بيانات التطبيق أو الفاتورة (مثلاً 406)
      if (applicationError) {
        let errorMsg = "Failed to load application or invoice details";
        if (applicationError.message && applicationError.message.includes("406")) {
          errorMsg = "فشل في الدفع: لم يتم العثور على بيانات الفاتورة أو الطلب (406)";
        }
        toast.error(errorMsg);
        setPaymentStatus("failed");
        onPaymentFailed(errorMsg);
        setIsProcessing(false);
        return;
      }

      // Get current route without the base for redirectTo
      const currentRoute = location.pathname;

      // Use application data to enhance payment information when available
      const paymentData: PaymentInitiateRequest = {
        amount: totalPrice,
        currency: "SAR",
        order_id: orderId,
        description: applicationData 
          ? `${applicationData.service_type} - ${applicationData.country} Visa` 
          : `${selectedService?.title} - Visa`,
        customer_email: customerEmail,
        customer_name: customerName,
        customer_phone: applicationData?.phone || (formData.phoneNumber
          ? `${formData.countryCode}${formData.phoneNumber}`
          : undefined),
        return_url: `${window.location.origin}/payment/return?order_id=${orderId}`,
        callback_url: `${window.location.origin}/api/payment/callback`,
      };

      console.log("🚀 ~ PaymentStep ~ Payment data with application info:", paymentData);

      // If test works, try the actual payment
      const response = await initiatePayment(paymentData, currentRoute);
      console.log("🚀 ~ handlePayment ~ response:", response);
      console.log("🚀 ~ handlePayment ~ response.status:", response.status);
      console.log("🚀 ~ handlePayment ~ response.payment_url:", response.payment_url);

      // إذا لم تكن حالة الدفع ناجحة أو لم يرجع رابط دفع، اعتبرها فشل
      if (!response || response.status !== "success" && response.status !== "redirect" || !response.payment_url) {
        const failMsg = response?.error_message || "Payment initiation failed";
        toast.error(failMsg);
        setPaymentStatus("failed");
        onPaymentFailed(failMsg);
        setIsProcessing(false);
        return;
      }

      // Store payment info in localStorage for the success page
      const paymentInfo = {
        order_id: orderId,
        payment_id: response.payment_id || "",
        amount: totalPrice,
        currency: "SAR",
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem("pendingPayment", JSON.stringify(paymentInfo));
      console.log("Stored payment info:", paymentInfo);
      
      setPaymentUrl(response.payment_url);
      setPaymentId(response.payment_id || "");
      setPaymentStatus("pending");
      toast.success("Payment link generated successfully");
      // فتح نافذة الدفع مباشرة
      window.open(
        response.payment_url,
        "_blank",
        "width=800,height=600,scrollbars=yes,resizable=yes"
      );
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
      console.log("🚀 ~ handleCheckPaymentStatus ~ statusResponse:", statusResponse)

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
            {isLoadingApplication && (
              <Loader className="h-4 w-4 animate-spin text-visa-gold" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">
              {language === "ar" ? "الخدمة:" : "Service:"}
            </span>
            <span className="font-medium">
              {applicationData 
                ? `${applicationData.service_type} - ${applicationData.country}`
                : selectedService?.title
              }
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">
              {language === "ar" ? "العميل:" : "Customer:"}
            </span>
            <span className="font-medium">
              {applicationData 
                ? `${applicationData.first_name} ${applicationData.last_name}`
                : travellers.length > 0 
                  ? `${travellers[0]?.firstName} ${travellers[0]?.lastName}`
                  : "N/A"
              }
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">
              {language === "ar" ? "عدد المسافرين:" : "Number of Travelers:"}
            </span>
            <span className="font-medium">
              {applicationData?.adults || travellers.length}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">
              {language === "ar" ? "رقم الطلب:" : "Order ID:"}
            </span>
            <span className="font-mono text-sm">{orderId}</span>
          </div>
          {applicationData && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                {language === "ar" ? "رقم المرجع:" : "Reference ID:"}
              </span>
              <span className="font-mono text-sm">{applicationData.reference_id}</span>
            </div>
          )}
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

      {/* Terms and Conditions */}
      <div className="text-right">
        <button
          onClick={() => setShowTermsModal(true)}
          className="text-visa-gold hover:text-visa-dark underline text-sm"
        >
          {language === "ar" 
            ? "اقرأ الشروط والأحكام"
            : "Read Terms and Conditions"}
        </button>
      </div>

      {/* Terms Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-visa-dark">
                {language === "ar" ? "الشروط والأحكام" : "Terms and Conditions"}
              </h3>
              <button
                onClick={() => setShowTermsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-right" dir="rtl">
              <div className="space-y-3 text-sm leading-relaxed">
                <p>1. يكون العميل مسؤولاً مسؤولية كاملة عن صحة ودقة المعلومات المقدمة من قبله والمتضمنة في طلب استخراج التأشيرة، ويتحمّل العميل كافة الآثار المالية والقانونية التي قد تحدث نتيجة لذلك.</p>
                
                <p>2. تلتزم Global Visa Services بتقديم طلب استخراج التأشيرة بأسرع وقت ممكن، وأي تأخير في إصدار التأشيرة من السفارة أو مركز التأشيرات الموحّد لأي سبب كان بعد رفع الطلب لا يقع ضمن مسؤولية Global Visa Services.</p>
                
                <p>3. في حال رفض إصدار التأشيرة من السفارة أو مركز التأشيرات الموحّد لأيّ سبب كان، لا تلتزم Global Visa Services بأي تعويض للعميل عن أي أضرار قد تنشأ عن ذلك.</p>
                
                <p>4. رسوم الخدمة التي تتقاضاها Global Visa Services غير مستردّة بعد تأكيد حجز الموعد.</p>
                
                <p>5. في حال عدم حضور العميل للموعد المحدد لدى السفارة أو مركز التأشيرات الموحّد، لا يحق له استرداد أيّ من المبالغ المدفوعة.</p>
                
                <p>6. في حال فقدان مستندات/وثائق العميل نتيجة خطأ أو تقصير من طرف ثالث (السفارة، مركز التأشيرات الموحّد، شركات التوصيل) لا تتحمل Global Visa Services أي مسؤولية تجاه العميل.</p>
                
                <p>7. في حال التقدم بطلب الحصول على تأشيرة الدخول إلى الولايات المتحدة، فإن Global Visa Services لا تتحمل أي مسؤولية في حال حدوث أي تأخير في تفعيل رقم الـ (CGI).</p>
                
                <p>8. في حال التقدم بطلب الحصول على تأشيرة الدخول لأي من الدول الأوروبية الموقعة على اتفاقية (شنغن)، فإنه يتعيّن على العميل دفع رسوم حجز موعد جديد متى قام بتغيير موقع المركز المحدد أو السفارة المحددة من قبله لتقديم الخدمة (البصمة).</p>
                
                <p>9. في حال رغبة العميل في إعادة جدولة الموعد بعد تأكيده، فإن الشركة تحتفظ بحقها في فرض رسوم حجز جديدة، ويُشترط توفر موعد جديد متاح.</p>
                
                <p>10. يكون العميل مسؤولاً عن الحضور لموعد السفارة أو مركز التأشيرات الموحد في الموعد والتاريخ المحددين مع إحضار المتطلبات اللازمة.</p>
                
                <p>11. عند إجراء أي تعديلات على البيانات المقدمة من قبل العميل بعد انشاء الطلب، فإن الأمر قد يتطلب دفع رسوم إضافية.</p>
                
                <p>12. لا تتحمل Global Visa Services أي مسؤولية تجاه العميل بعد إصدار التأشيرة.</p>
                
                <p>13. لا تكون Global Visa Services مسؤولة عن تعويض العميل عن أي مبالغ إضافية قد يدفعها العميل للسفارة أو مركز التأشيرات الموحّد أو شركات الشحن بعد تقديم طلب اصدار التأشيرة.</p>
                
                <p>14. عند تقديم التأشيرة (لغير السعوديين)، يكون مبلغ التأشيرة والخدمة والتأمين الطبي والموعد والترجمة غير مسترد وذلك لتعدد المتطلبات للسفارة والحاجة للعمل على ترجمة المستندات بعد رفع الطلب.</p>
                
                <p>15. قبول طلب التأشيرة من عدمه وكذلك الوقت المحدد لإصدار التأشيرة هو قرار خاص بالسفارة، وGlobal Visa Services لا تضمن قبول الطلب أو المدة المتوقعة لذلك.</p>
                
                <p>16. لا تتحمل Global Visa Services أي تبعات أو أضرار قد تلحق بالعميل جراء إلغاء الموعد أو تأجيله من السفارة.</p>
                
                <p>17. يُنصح تجنباً لأي خسائر مالية قد يتكبدها العميل بعدم إجراء حجوزات طيران أو فنادق مدفوعة حتى تصدر التأشيرة، ويستثنى من ذلك بعض السفارات التي يتطلب قبول طلب التأشيرة لديها وجود حجوزات مؤكدة مثل ألمانيا أو أي سفارة أخرى، ولا تكون Global Visa Services مسؤولة عن تعويض العميل في حال قيامه بإلغاء الحجوزات.</p>
                
                <p>18. في حال طلب العميل إجراء حجوزات مبدئية "غير مؤكدة" من قبل Global Visa Services وذلك عند تقدمه بطلب تأشيرة من أي من السفارات التي تتطلب وجود حجوزات مؤكدة لقبول الطلب، فإنه يكون مسؤولاً مسؤولية منفردةً في حال رفض الطلب.</p>
                
                <p>19. تتم عملية استرداد المدفوعات خلال 5 أيام عمل، وسيتم رد المبالغ بنفس طريقة الدفع التي استخدمها العميل لإجراء الطلب.</p>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t p-4">
              <Button
                onClick={() => setShowTermsModal(false)}
                className="w-full bg-visa-gold hover:bg-visa-gold/90"
              >
                {language === "ar" ? "إغلاق" : "Close"}
              </Button>
            </div>
          </div>
        </div>
      )}

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
