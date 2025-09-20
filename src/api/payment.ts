import { toast } from "sonner";
import CryptoJS from "crypto-js";

export interface PaymentInitiateRequest {
  amount: number;
  currency: string;
  order_id: string;
  description: string;
  customer_email: string;
  customer_name: string;
  customer_phone?: string;
  return_url: string;
  callback_url: string;
  payer_ip?: string;
  payer_first_name?: string;
  payer_last_name?: string;
  payer_address?: string;
  payer_country?: string;
  payer_city?: string;
  payer_zip?: string;
}

export interface PaymentInitiateResponse {
  status: string;
  payment_url?: string;
  payment_id?: string;
  error_message?: string;
  order_id: string;
}

export interface PaymentStatusResponse {
  status: string;
  payment_id: string;
  order_id: string;
  amount: number;
  currency: string;
  payment_status: "pending" | "completed" | "failed" | "cancelled";
  transaction_id?: string;
  error_message?: string;
}

const PAYMENT_CONFIG = {
  merchantKey: "ccb9ad36-8e4a-492c-81e3-5569a2d66049",
  password: "1c5dbc06-fd45-4df1-87e9-dfb5c59fcf4e",
  apiUrl: "https://api.edfapay.com/payment/initiate",
  statusUrl: "https://api.edfapay.com/payment/status",
};

/**
 * Get client IP address
 */
const getClientIP = async (): Promise<string> => {
  try {
    // Try to get IP from ipify service
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip || "127.0.0.1";
  } catch (error) {
    console.warn("Could not fetch client IP, using fallback:", error);
    return "127.0.0.1"; // Fallback IP
  }
};

/**
 * Generate hash for payment request according to EdfaPay specifications
 */
const generateHash = (data: Record<string, any>): string => {
  // EdfaPay hash format: order_id + order_amount + order_currency + order_description + password
  const to_md5 = `${data.order_id}${data.order_amount}${data.order_currency}${data.order_description}${PAYMENT_CONFIG.password}`;

  console.log("Hash input string:", to_md5);

  // Step 1: Convert to uppercase and generate MD5
  const md5Hash = CryptoJS.MD5(to_md5.toUpperCase()).toString();
  console.log("MD5 hash:", md5Hash);

  // Step 2: Generate SHA1 of the MD5 hash
  const sha1Hash = CryptoJS.SHA1(md5Hash);

  // Step 3: Convert to hex string
  const result = CryptoJS.enc.Hex.stringify(sha1Hash);
  console.log("Final hash (SHA1 of MD5):", result);

  return result;
};

/**
 * Generate unique order ID
 */
export const generateOrderId = (applicationId?: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const prefix = applicationId ? `APP${applicationId}` : "ORDER";
  return `${prefix}_${timestamp}_${random}`.toUpperCase();
};

/**
 * Initiate payment with EdfaPay
 */
export const initiatePayment = async (
  paymentData: PaymentInitiateRequest
): Promise<PaymentInitiateResponse> => {
  try {
    console.log("Initiating payment with data:", paymentData);

    // Get client IP if not provided
    const payerIP = paymentData.payer_ip || (await getClientIP());

    // Split customer name into first and last name
    const nameParts = paymentData.customer_name.split(" ");
    const firstName = nameParts[0] || "Customer";
    const lastName = nameParts.slice(1).join(" ") || "Name";

    // Create FormData for the request
    const formData = new FormData();
    formData.append("action", "SALE");
    formData.append("edfa_merchant_id", PAYMENT_CONFIG.merchantKey);
    formData.append("order_id", paymentData.order_id);
    formData.append("order_amount", paymentData.amount.toString());
    formData.append("order_currency", paymentData.currency);
    formData.append("order_description", paymentData.description);
    formData.append("req_token", "N");
    formData.append(
      "payer_first_name",
      paymentData.payer_first_name || firstName
    );
    formData.append("payer_last_name", paymentData.payer_last_name || lastName);
    formData.append(
      "payer_address",
      paymentData.payer_address || paymentData.customer_email
    );
    formData.append("payer_country", paymentData.payer_country || "SA");
    formData.append("payer_city", paymentData.payer_city || "Riyadh");
    formData.append("payer_zip", paymentData.payer_zip || "12221");
    formData.append("payer_email", paymentData.customer_email);
    formData.append(
      "payer_phone",
      paymentData.customer_phone || "966565555555"
    );
    formData.append("payer_ip", payerIP);
    
    // Ensure term_url_3ds is a valid URL
    // let termUrl = paymentData.return_url;
    let termUrl = "google.com";
    console.log('Original return_url:', termUrl);
    
    // if (!termUrl.startsWith('http://') && !termUrl.startsWith('https://')) {
    //   // If no protocol, assume https and add current domain
    //   if (typeof window !== 'undefined') {
    //     termUrl = `${window.location.origin}${termUrl.startsWith('/') ? '' : '/'}${termUrl}`;
    //   } else {
    //     termUrl = `https://yourdomain.com${termUrl.startsWith('/') ? '' : '/'}${termUrl}`;
    //   }
    //   console.log('Fixed return_url:', termUrl);
    // }
    
    // Validate URL format
    try {
      new URL(termUrl);
      console.log('URL validation passed for:', termUrl);
    } catch (error) {
      console.error('Invalid URL format:', termUrl, error);
      // Fallback to a simple success page
      termUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/payment/success` 
        : 'https://yourdomain.com/payment/success';
      console.log('Using fallback URL:', termUrl);
    }
    
    console.log('Final term_url_3ds:', termUrl);
    
    formData.append("term_url_3ds", termUrl);
    formData.append("auth", "N");
    formData.append("recurring_init", "N");

    // Generate hash for the request
    const hashData = {
      order_id: paymentData.order_id,
      order_amount: paymentData.amount,
      order_currency: paymentData.currency,
      order_description: paymentData.description,
    };
    const hash = generateHash(hashData);
    formData.append("hash", hash);

    console.log("FormData being sent:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    const response = await fetch(PAYMENT_CONFIG.apiUrl, {
      method: "POST",
      body: formData,
    });

    const responseText = await response.text();
    console.log("Raw response:", responseText);

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      throw new Error(`Invalid JSON response: ${responseText}`);
    }

    console.log("Parsed payment initiation response:", result);

    if (!response.ok) {
      throw new Error(
        `Payment API error: ${response.status} ${response.statusText} - ${
          result.error_message || responseText
        }`
      );
    }

    if (result.redirect_url) {
      const paymentUrl = result.payment_url || result.redirect_url;

      // Open payment URL in a new window
      if (typeof window !== "undefined") {
        const paymentWindow = window.open(
          paymentUrl,
          "EdfaPayment",
          "width=800,height=600,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no"
        );

        if (!paymentWindow) {
          console.warn("Payment window was blocked by popup blocker");
        }
      }

      return {
        status: "success",
        payment_url: paymentUrl,
        payment_id: result.payment_id,
        order_id: paymentData.order_id,
      };
    } else {
      return {
        status: "error",
        error_message:
          result.error_message ||
          result.errors?.[0]?.error_message ||
          "Payment initiation failed",
        order_id: paymentData.order_id,
      };
    }
  } catch (error) {
    console.error("Payment initiation error:", error);
    return {
      status: "error",
      error_message:
        error instanceof Error ? error.message : "Unknown error occurred",
      order_id: paymentData.order_id,
    };
  }
};

/**
 * Check payment status
 */
export const checkPaymentStatus = async (
  paymentId: string,
  orderId: string
): Promise<PaymentStatusResponse> => {
  try {
    const formData = new FormData();
    formData.append("edfa_merchant_id", PAYMENT_CONFIG.merchantKey);
    formData.append("payment_id", paymentId);
    formData.append("order_id", orderId);

    const response = await fetch(PAYMENT_CONFIG.statusUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(
        `Payment status API error: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    console.log("Payment status response:", result);

    return {
      status: result.status || "error",
      payment_id: paymentId,
      order_id: orderId,
      amount: result.amount || 0,
      currency: result.currency || "SAR",
      payment_status: result.payment_status || "failed",
      transaction_id: result.transaction_id,
      error_message: result.error_message,
    };
  } catch (error) {
    console.error("Payment status check error:", error);
    return {
      status: "error",
      payment_id: paymentId,
      order_id: orderId,
      amount: 0,
      currency: "SAR",
      payment_status: "failed",
      error_message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Validate payment response from callback
 */
export const validatePaymentCallback = (
  callbackData: any
): PaymentStatusResponse => {
  return {
    status: callbackData.status || "error",
    payment_id: callbackData.payment_id || "",
    order_id: callbackData.order_id || "",
    amount: parseFloat(callbackData.amount) || 0,
    currency: callbackData.currency || "SAR",
    payment_status: callbackData.payment_status || "failed",
    transaction_id: callbackData.transaction_id,
    error_message: callbackData.error_message,
  };
};
