import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, Loader, Home, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/Header";
import { validatePaymentCallback, checkPaymentStatus } from "@/api/payment";
import { toast } from "sonner";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [paymentData, setPaymentData] = useState<any>(null);
  
  useEffect(() => {
    const processPaymentCallback = async () => {
      try {
        // Get all URL parameters
        const params = Object.fromEntries(searchParams.entries());
        console.log("Payment callback parameters:", params);
        console.log("All URL params:", window.location.href);
        
        // EdfaPay might send: action, result, status, order_id, trans_id, amount, currency, etc.
        const orderId = params.order_id || params.order || params.orderid;
        const transId = params.trans_id || params.payment_id || params.transaction_id;
        const result = params.result;
        const status = params.status;
        const action = params.action;
        
        console.log("Extracted params:", { orderId, transId, result, status, action });
        
        // Check if we have payment data from EdfaPay callback
        if (orderId || transId || result || status) {
          // Validate using the callback data
          const callbackData = validatePaymentCallback(params);
          console.log("Validated callback data:", callbackData);
          
          // Try to get status from API if we have IDs
          if (transId && orderId) {
            try {
              const statusResult = await checkPaymentStatus(transId, orderId);
              console.log("Status API result:", statusResult);
              
              if (statusResult.payment_status === 'completed' || 
                  statusResult.status === 'success' ||
                  result === 'SUCCESS' ||
                  status === 'SETTLED') {
                setPaymentStatus('success');
                setPaymentData(statusResult);
                toast.success(t('paymentSuccessful') || 'Payment completed successfully!');
              } else {
                setPaymentStatus('failed');
                setPaymentData(statusResult);
                toast.error(statusResult.error_message || t('paymentFailed') || 'Payment failed');
              }
              return;
            } catch (error) {
              console.error("Error checking payment status:", error);
            }
          }
          
          // Fallback to callback validation
          if (callbackData.payment_status === 'completed' || 
              result === 'SUCCESS' || 
              status === 'SETTLED' ||
              status === 'success') {
            setPaymentStatus('success');
            setPaymentData({
              ...callbackData,
              order_id: orderId,
              payment_id: transId,
              amount: params.amount || callbackData.amount,
              currency: params.currency || callbackData.currency,
              transaction_id: transId,
            });
            toast.success(t('paymentSuccessful') || 'Payment completed successfully!');
          } else {
            setPaymentStatus('failed');
            setPaymentData({
              ...callbackData,
              order_id: orderId,
              payment_id: transId,
              error_message: params.decline_reason || params.error_message || callbackData.error_message,
            });
            toast.error(callbackData.error_message || t('paymentFailed') || 'Payment failed');
          }
        } else {
          // No payment parameters found - check localStorage for pending payment
          console.warn("No payment parameters found in URL, checking localStorage");
          
          const pendingPaymentStr = localStorage.getItem("pendingPayment");
          if (pendingPaymentStr) {
            try {
              const pendingPayment = JSON.parse(pendingPaymentStr);
              console.log("Found pending payment in localStorage:", pendingPayment);
              
              // Try to check status with stored data
              if (pendingPayment.payment_id && pendingPayment.order_id) {
                const statusResult = await checkPaymentStatus(
                  pendingPayment.payment_id, 
                  pendingPayment.order_id
                );
                
                if (statusResult.payment_status === 'completed' || statusResult.status === 'success') {
                  setPaymentStatus('success');
                  setPaymentData(statusResult);
                  localStorage.removeItem("pendingPayment");
                  toast.success(t('paymentSuccessful') || 'Payment completed successfully!');
                } else {
                  // Payment might still be processing
                  setPaymentStatus('success');
                  setPaymentData({
                    ...pendingPayment,
                    payment_status: 'pending',
                  });
                  toast.success(t('paymentSuccessful') || 'Payment completed successfully!');
                }
              } else {
                // Just show success based on localStorage
                setPaymentStatus('success');
                setPaymentData(pendingPayment);
                localStorage.removeItem("pendingPayment");
                toast.success(t('paymentSuccessful') || 'Payment completed successfully!');
              }
            } catch (error) {
              console.error("Error parsing pending payment:", error);
              setPaymentStatus('failed');
              toast.error('No payment information found');
            }
          } else {
            setPaymentStatus('failed');
            toast.error('No payment information found');
          }
        }
      } catch (error) {
        console.error("Error processing payment callback:", error);
        setPaymentStatus('failed');
        toast.error('Error processing payment status');
      }
    };

    processPaymentCallback();
  }, [searchParams, t]);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoDashboard = () => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      navigate('/client-dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir={language === "ar" ? "rtl" : "ltr"}>
      <Header />
      
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-6">
            {paymentStatus === 'loading' && (
              <>
                <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {language === 'ar' ? 'جاري معالجة الدفع...' : 'Processing Payment...'}
                </CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  {language === 'ar' ? 'يرجى الانتظار بينما نتحقق من حالة الدفع' : 'Please wait while we verify your payment status'}
                </CardDescription>
              </>
            )}
            
            {paymentStatus === 'success' && (
              <>
                <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-green-700">
                  {language === 'ar' ? 'تم الدفع بنجاح!' : 'Payment Successful!'}
                </CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  {language === 'ar' ? 'تمت معالجة دفعتك بنجاح' : 'Your payment has been processed successfully'}
                </CardDescription>
              </>
            )}
            
            {paymentStatus === 'failed' && (
              <>
                <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-red-700">
                  {language === 'ar' ? 'فشل في الدفع' : 'Payment Failed'}
                </CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  {language === 'ar' ? 'حدث خطأ أثناء معالجة دفعتك' : 'There was an error processing your payment'}
                </CardDescription>
              </>
            )}
          </CardHeader>
          
          {paymentData && paymentStatus !== 'loading' && (
            <CardContent className="space-y-4">
              <div className={`grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                {paymentData.order_id && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {language === 'ar' ? 'رقم الطلب:' : 'Order ID:'}
                    </p>
                    <p className="text-sm text-gray-900 font-mono">{paymentData.order_id}</p>
                  </div>
                )}
                
                {paymentData.payment_id && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {language === 'ar' ? 'رقم الدفع:' : 'Payment ID:'}
                    </p>
                    <p className="text-sm text-gray-900 font-mono">{paymentData.payment_id}</p>
                  </div>
                )}
                
                {paymentData.amount && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {language === 'ar' ? 'المبلغ:' : 'Amount:'}
                    </p>
                    <p className="text-sm text-gray-900 font-semibold">
                      {paymentData.amount} {paymentData.currency || 'SAR'}
                    </p>
                  </div>
                )}
                
                {paymentData.transaction_id && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {language === 'ar' ? 'رقم المعاملة:' : 'Transaction ID:'}
                    </p>
                    <p className="text-sm text-gray-900 font-mono">{paymentData.transaction_id}</p>
                  </div>
                )}
              </div>
              
              {paymentData.error_message && (
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-800">
                    <span className="font-medium">
                      {language === 'ar' ? 'خطأ:' : 'Error:'} 
                    </span>
                    {' '}{paymentData.error_message}
                  </p>
                </div>
              )}
              
              <div className={`flex gap-4 pt-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <Button onClick={handleGoHome} variant="outline" className="flex-1">
                  <Home className={`w-4 h-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                  {language === 'ar' ? 'العودة للرئيسية' : 'Go Home'}
                </Button>
                
                <Button onClick={handleGoDashboard} className="flex-1">
                  <Receipt className={`w-4 h-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                  {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
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