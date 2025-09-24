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
        
        if (params.payment_id && params.order_id) {
          // Validate the payment with the payment gateway
          const statusResult = await checkPaymentStatus(params.payment_id, params.order_id);
          
          if (statusResult.payment_status === 'completed') {
            setPaymentStatus('success');
            setPaymentData(statusResult);
            toast.success(t('paymentSuccessful') || 'Payment completed successfully!');
          } else {
            setPaymentStatus('failed');
            setPaymentData(statusResult);
            toast.error(statusResult.error_message || t('paymentFailed') || 'Payment failed');
          }
        } else {
          // Check for other success indicators
          const callbackData = validatePaymentCallback(params);
          
          if (callbackData.payment_status === 'completed' || params.status === 'success') {
            setPaymentStatus('success');
            setPaymentData(callbackData);
            toast.success(t('paymentSuccessful') || 'Payment completed successfully!');
          } else {
            setPaymentStatus('failed');
            setPaymentData(callbackData);
            toast.error(callbackData.error_message || t('paymentFailed') || 'Payment failed');
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