import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, Loader, Home, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/Header";
import { checkPaymentStatus, PaymentStatusResponse } from "@/api/payment";
import {
  updateInvoiceStatusToPaidByOrderId,
  getInvoiceByOrderId,
} from "@/api/invoices";
import { toast } from "sonner";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [paymentStatus, setPaymentStatus] = useState<
    "loading" | "Pending" | "Paid"
  >("loading");
  const [paymentData, setPaymentData] = useState<PaymentStatusResponse | null>(
    null
  );
  const [invoiceData, setInvoiceData] = useState<any>(null);
  console.log("🚀 ~ PaymentSuccess ~ invoiceData:", invoiceData);
  const pendingPayment = localStorage.getItem("pendingPayment") || "";
  console.log("🚀 ~ PaymentSuccess ~ pendingPayment:", pendingPayment);

  const order_id = searchParams.get("order_id") || "";
  console.log("🚀 ~ PaymentSuccess ~ order_id:", order_id);

  // Function to update invoice status when payment is successful
  const updateInvoiceStatus = async (orderId: string, paymentInfo: any) => {
    try {
      await updateInvoiceStatusToPaidByOrderId(orderId, {
        payment_id: paymentInfo.payment_id || paymentInfo.trans_id,
        transaction_id: paymentInfo.transaction_id || paymentInfo.trans_id,
      });
    } catch (error) {
      console.error("Failed to update invoice status:", error);
      // Don't show error to user as payment was successful
    }
  };

  useEffect(() => {
    // const processPaymentCallback = async () => {
    //   try {
    //     // Get all URL parameters
    //     const params = Object.fromEntries(searchParams.entries());
    //     console.log("Payment callback parameters:", params);
    //     console.log("All URL params:", window.location.href);
    //     // EdfaPay might send: action, result, status, order_id, trans_id, amount, currency, etc.
    //     const orderId = params.order_id || params.order || params.orderid;
    //     const transId =
    //       params.trans_id || params.payment_id || params.transaction_id;
    //     const result = params.result;
    //     const status = params.status;
    //     const action = params.action;
    //     console.log("Extracted params:", {
    //       orderId,
    //       transId,
    //       result,
    //       status,
    //       action,
    //     });
    //     // Check if we have payment data from EdfaPay callback
    //     if (orderId || transId || result || status) {
    //       // Validate using the callback data
    //       const callbackData = validatePaymentCallback(params);
    //       console.log("Validated callback data:", callbackData);
    //       // Try to get status from API if we have IDs
    //       if (transId && orderId) {
    //         try {
    //           const statusResult = await checkPaymentStatus(transId, orderId);
    //           console.log("Status API result:", statusResult);
    //           // Check for 406 or PGRST116 error (no invoice found)
    //           // Defensive: check for error properties on statusResult (API error shape)
    //           const statusResultAny = statusResult as any;
    //           if (
    //             statusResultAny?.code === "PGRST116" ||
    //             statusResultAny?.message ===
    //               "Cannot coerce the result to a single JSON object" ||
    //             statusResultAny?.details === "The result contains 0 rows"
    //           ) {
    //             setPaymentStatus("failed");
    //             setPaymentData({
    //               ...statusResult,
    //               order_id: orderId,
    //               payment_id: transId,
    //               error_message: t("paymentFailed") || "Payment failed",
    //             });
    //             toast.error(t("paymentFailed") || "Payment failed");
    //             return;
    //           }
    //           if (
    //             statusResult.payment_status === "completed" ||
    //             statusResult.status === "success" ||
    //             result === "SUCCESS" ||
    //             status === "SETTLED"
    //           ) {
    //             setPaymentStatus("success");
    //             setPaymentData(statusResult);
    //             // Update invoice status to paid
    //             if (orderId) {
    //               await updateInvoiceStatus(orderId, {
    //                 payment_id: transId,
    //                 transaction_id: transId,
    //                 ...statusResult,
    //               });
    //             }
    //             toast.success(
    //               t("paymentSuccessful") || "Payment completed successfully!"
    //             );
    //           } else {
    //             setPaymentStatus("failed");
    //             setPaymentData(statusResult);
    //             toast.error(
    //               statusResult.error_message ||
    //                 t("paymentFailed") ||
    //                 "Payment failed"
    //             );
    //           }
    //           return;
    //         } catch (error) {
    //           setPaymentStatus("failed");
    //           setPaymentData({
    //             order_id: orderId,
    //             payment_id: transId,
    //             error_message: t("paymentFailed") || "Payment failed",
    //           });
    //           toast.error(t("paymentFailed") || "Payment failed");
    //           return;
    //         }
    //       }
    //       // Fallback to callback validation
    //       if (
    //         callbackData.payment_status === "completed" ||
    //         result === "SUCCESS" ||
    //         status === "SETTLED" ||
    //         status === "success"
    //       ) {
    //         setPaymentStatus("success");
    //         setPaymentData({
    //           ...callbackData,
    //           order_id: orderId,
    //           payment_id: transId,
    //           amount: params.amount || callbackData.amount,
    //           currency: params.currency || callbackData.currency,
    //           transaction_id: transId,
    //         });
    //         // Update invoice status to paid
    //         if (orderId) {
    //           await updateInvoiceStatus(orderId, {
    //             payment_id: transId,
    //             transaction_id: transId,
    //             ...callbackData,
    //           });
    //         }
    //         toast.success(
    //           t("paymentSuccessful") || "Payment completed successfully!"
    //         );
    //       } else {
    //         // إذا لم تكن الحالة ناجحة
    //         setPaymentStatus("failed");
    //         setPaymentData({
    //           ...callbackData,
    //           order_id: orderId,
    //           payment_id: transId,
    //           error_message:
    //             params.decline_reason ||
    //             params.error_message ||
    //             callbackData.error_message ||
    //             t("paymentFailed") ||
    //             "Payment failed",
    //         });
    //         toast.error(
    //           callbackData.error_message ||
    //             t("paymentFailed") ||
    //             "Payment failed"
    //         );
    //       }
    //     } else {
    //       // No payment parameters found - check localStorage for pending payment
    //       console.warn(
    //         "No payment parameters found in URL, checking localStorage"
    //       );
    //       const pendingPaymentStr = localStorage.getItem("pendingPayment");
    //       if (pendingPaymentStr) {
    //         try {
    //           const pendingPayment = JSON.parse(pendingPaymentStr);
    //           console.log(
    //             "Found pending payment in localStorage:",
    //             pendingPayment
    //           );
    //           // Try to check status with stored data
    //           if (pendingPayment.payment_id && pendingPayment.order_id) {
    //             const statusResult = await checkPaymentStatus(
    //               pendingPayment.payment_id,
    //               pendingPayment.order_id
    //             );
    //             if (
    //               statusResult.payment_status === "completed" ||
    //               statusResult.status === "success"
    //             ) {
    //               setPaymentStatus("success");
    //               setPaymentData(statusResult);
    //               localStorage.removeItem("pendingPayment");
    //               // Update invoice status to paid
    //               if (pendingPayment.order_id) {
    //                 await updateInvoiceStatus(pendingPayment.order_id, {
    //                   payment_id: pendingPayment.payment_id,
    //                   ...statusResult,
    //                 });
    //               }
    //               toast.success(
    //                 t("paymentSuccessful") || "Payment completed successfully!"
    //               );
    //             } else {
    //               // Payment might still be processing
    //               setPaymentStatus("success");
    //               setPaymentData({
    //                 ...pendingPayment,
    //                 payment_status: "pending",
    //               });
    //               // Update invoice status to paid even if status is pending
    //               if (pendingPayment.order_id) {
    //                 await updateInvoiceStatus(pendingPayment.order_id, {
    //                   payment_id: pendingPayment.payment_id,
    //                   ...pendingPayment,
    //                 });
    //               }
    //               toast.success(
    //                 t("paymentSuccessful") || "Payment completed successfully!"
    //               );
    //             }
    //           } else {
    //             // Just show success based on localStorage
    //             setPaymentStatus("success");
    //             setPaymentData(pendingPayment);
    //             localStorage.removeItem("pendingPayment");
    //             // Update invoice status to paid
    //             if (pendingPayment.order_id) {
    //               await updateInvoiceStatus(pendingPayment.order_id, {
    //                 payment_id: pendingPayment.payment_id,
    //                 ...pendingPayment,
    //               });
    //             }
    //             toast.success(
    //               t("paymentSuccessful") || "Payment completed successfully!"
    //             );
    //           }
    //         } catch (error) {
    //           console.error("Error parsing pending payment:", error);
    //           setPaymentStatus("failed");
    //           toast.error("No payment information found");
    //         }
    //       } else {
    //         setPaymentStatus("failed");
    //         toast.error("No payment information found");
    //       }
    //     }
    //   } catch (error) {
    //     console.error("Error processing payment callback:", error);
    //     setPaymentStatus("failed");
    //     toast.error("Error processing payment status");
    //   }
    // };
    // processPaymentCallback();
    getInvoiceByOrderId(order_id).then((data) => {
      setInvoiceData(data);
      setPaymentStatus((data?.status as "Pending" | "Paid") || "loading");
      checkPaymentStatus(data.trans_id, order_id).then((th) => {
        console.log("Status Result:", th);
        setPaymentData(th);
      });
    });
  }, [searchParams, t, order_id]);

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoDashboard = () => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      navigate("/client-dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <Header />

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-6">
            {paymentStatus === "loading" && (
              <>
                <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {language === "ar"
                    ? "جاري معالجة الدفع..."
                    : "Processing Payment..."}
                </CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  {language === "ar"
                    ? "يرجى الانتظار بينما نتحقق من حالة الدفع"
                    : "Please wait while we verify your payment status"}
                </CardDescription>
              </>
            )}

            {paymentStatus === "Paid" && (
              <>
                <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-green-700">
                  {language === "ar"
                    ? "تم الدفع بنجاح!"
                    : "Payment Successful!"}
                </CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  {language === "ar"
                    ? "تمت معالجة دفعتك بنجاح"
                    : "Your payment has been processed successfully"}
                </CardDescription>
              </>
            )}

            {paymentStatus === "Pending" && (
              <>
                <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-red-700">
                  {language === "ar" ? "فشل في الدفع" : "Payment Failed"}
                </CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  {language === "ar"
                    ? "حدث خطأ أثناء معالجة دفعتك"
                    : "There was an error processing your payment"}
                </CardDescription>
              </>
            )}
          </CardHeader>

          {invoiceData && paymentStatus === "Paid" && (
            <CardContent className="space-y-4">
              <div
                className={`grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg ${
                  language === "ar" ? "text-right" : "text-left"
                }`}
              >
                {paymentData?.responseBody?.order?.number && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {language === "ar" ? "رقم الطلب:" : "Order ID:"}
                    </p>
                    <p className="text-sm text-gray-900 font-mono" dir="ltr">
                      {paymentData?.responseBody?.order?.number}
                    </p>
                  </div>
                )}

                {paymentData?.responseBody?.payment_id && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {language === "ar" ? "رقم الدفع:" : "Payment ID:"}
                    </p>
                    <p className="text-sm text-gray-900 font-mono">
                      {paymentData?.responseBody?.payment_id}
                    </p>
                  </div>
                )}

                {paymentData?.responseBody?.order?.amount && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {language === "ar" ? "المبلغ:" : "Amount:"}
                    </p>
                    <p className="text-sm text-gray-900 font-semibold">
                      {paymentData?.responseBody?.order?.amount}{" "}
                      {paymentData?.responseBody?.order?.currency || "SAR"}
                    </p>
                  </div>
                )}
              </div>

              {/* {paymentData.error_message && (
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-800">
                    <span className="font-medium">
                      {language === "ar" ? "خطأ:" : "Error:"}
                    </span>{" "}
                    {paymentData.error_message}
                  </p>
                </div>
              )} */}

              <div
                className={`flex gap-4 pt-4 ${
                  language === "ar" ? "flex-row-reverse" : ""
                }`}
              >
                <Button
                  onClick={handleGoHome}
                  variant="outline"
                  className="flex-1"
                >
                  <Home
                    className={`w-4 h-4 ${language === "ar" ? "ml-2" : "mr-2"}`}
                  />
                  {language === "ar" ? "العودة للرئيسية" : "Go Home"}
                </Button>

                <Button onClick={handleGoDashboard} className="flex-1">
                  <Receipt
                    className={`w-4 h-4 ${language === "ar" ? "ml-2" : "mr-2"}`}
                  />
                  {language === "ar" ? "لوحة التحكم" : "Dashboard"}
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
