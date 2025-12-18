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
  pathname?: string;
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
  statusCode: number;
  responseBody: {
    date: string;
    status: string;
    brand: string;
    reason: string;
    order: {
      number: string;
      amount: string;
      currency: string;
      description: string;
    };
    customer: {
      name: string;
      email: string;
    };
    payment_id: string;
  };
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
 * Formula: sha1(md5(strtoupper(order_id.order_amount.order_currency.order_description.password)))
 */
const generateHash = (data: Record<string, any>): string => {
  // EdfaPay hash format: order_id + order_amount + order_currency + order_description + password
  const to_md5 = `${data.order_id}${data.order_amount}${data.order_currency}${data.order_description}${PAYMENT_CONFIG.password}`;

  console.log("Hash input string:", to_md5);

  // Step 1: Convert to uppercase first, then generate MD5
  const md5Hash = CryptoJS.MD5(to_md5.toUpperCase()).toString();
  console.log("MD5 hash:", md5Hash);

  // Step 2: Generate SHA1 of the MD5 hash
  const sha1Hash = CryptoJS.SHA1(md5Hash).toString();
  console.log("Final hash (SHA1 of MD5):", sha1Hash);

  return sha1Hash;
};

/**
 * Generate unique order ID
 */
export const generateOrderId = (applicationId?: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(12).substring(2, 8);
  // const prefix = applicationId ? `APP${applicationId}` : "ORDER";
  return `${timestamp}_${random}`.toUpperCase();
};

/**
 * Initiate payment with EdfaPay
 */
export const initiatePayment = async (
  paymentData: PaymentInitiateRequest,
  redirectTo = "/payment/success"
): Promise<PaymentInitiateResponse> => {
  try {
    console.log("Initiating payment with data:", paymentData);

    // Validate required fields
    if (
      !paymentData.order_id ||
      !paymentData.amount ||
      !paymentData.currency ||
      !paymentData.description ||
      !paymentData.customer_email ||
      !paymentData.customer_name
    ) {
      throw new Error("Missing required payment fields");
    }

    // Get client IP if not provided
    const payerIP = paymentData.payer_ip || (await getClientIP());

    // Split customer name into first and last name
    const nameParts = paymentData.customer_name.split(" ");
    const firstName = nameParts[0] || "Customer";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Create FormData for the request
    const formData = new FormData();
    formData.append("action", "SALE");
    formData.append("edfa_merchant_id", PAYMENT_CONFIG.merchantKey);
    formData.append("order_id", paymentData.order_id);
    formData.append("order_amount", paymentData.amount.toFixed(2));
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
    formData.append("payer_phone", paymentData.customer_phone || "");
    formData.append("payer_ip", payerIP);

    // Set term_url_3ds properly - this is where users return after 3DS authentication
    let termUrl = `https://gvisaksa.com/#/payment/success`;

    // For development, you can use local URL
    // if (
    //   typeof window !== "undefined" &&
    //   window.location.hostname === "localhost"
    // ) {
    //   termUrl = `${window.location.origin}/#/payment/success`;
    // }

    console.log("Payment success redirect URL:", termUrl);

    // Validate URL format
    try {
      new URL(termUrl);
      console.log("URL validation passed for:", termUrl);
    } catch (error) {
      console.error("Invalid URL format:", termUrl, error);
      // Fallback to production URL with hash routing
      termUrl = `https://gvisaksa.com/#/payment/success`;
      console.log("Using fallback URL:", termUrl);
    }

    console.log("Final term_url_3ds:", termUrl);

    formData.append("term_url_3ds", termUrl);
    formData.append("auth", "N");
    formData.append("recurring_init", "N");
    formData.append("redirect_method", "GET");
    formData.append("redirect_params", "");

    // Generate hash for the request
    const hashData = {
      order_id: paymentData.order_id,
      order_amount: paymentData.amount.toFixed(2),
      order_currency: paymentData.currency,
      order_description: paymentData.description,
    };
    const hash = generateHash(hashData);
    formData.append("hash", hash);

    console.log("FormData being sent:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    console.log("Making request to:", PAYMENT_CONFIG.apiUrl);

    const response = await fetch(PAYMENT_CONFIG.apiUrl, {
      method: "POST",
      body: formData,
    });

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    const responseText = await response.text();
    console.log("Raw response:", responseText);

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Response that failed to parse:", responseText);
      throw new Error(
        `Invalid JSON response from EdfaPay: ${responseText.substring(
          0,
          200
        )}...`
      );
    }

    console.log("Parsed payment initiation response:", result);
    console.log("Response structure keys:", Object.keys(result));
    console.log("Response result field:", result.result);
    console.log("Response status field:", result.status);

    if (!response.ok) {
      console.error("HTTP Error Response:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: responseText,
      });

      // Check for specific error types
      if (response.status === 401) {
        throw new Error(
          "Authentication failed - please check merchant credentials"
        );
      } else if (response.status === 403) {
        throw new Error("Access forbidden - merchant may not be authorized");
      } else if (response.status === 404) {
        throw new Error("API endpoint not found - please check the API URL");
      } else if (response.status >= 500) {
        throw new Error("EdfaPay server error - please try again later");
      }

      throw new Error(
        `Payment API error: ${response.status} ${response.statusText} - ${
          result.error_message || result.message || responseText
        }`
      );
    }

    // Check for successful response (flexible field checking)
    const hasRedirectUrl = result.redirect_url || result.payment_url;
    const isSuccess =
      result.result === "SUCCESS" || result.status === "SUCCESS";
    const isRedirect =
      result.result === "REDIRECT" || result.status === "REDIRECT";

    if (isSuccess && hasRedirectUrl) {
      const paymentUrl = result.redirect_url || result.payment_url;

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
        payment_id: result.trans_id || result.payment_id || result.id,
        order_id: paymentData.order_id,
      };
    } else if (isRedirect && hasRedirectUrl) {
      // Handle 3DS redirect
      const redirectUrl = result.redirect_url || result.payment_url;

      if (typeof window !== "undefined") {
        const paymentWindow = window.open(
          redirectUrl,
          "EdfaPayment3DS",
          "width=800,height=600,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no"
        );

        if (!paymentWindow) {
          console.warn("3DS redirect window was blocked by popup blocker");
        }
      }

      return {
        status: "redirect",
        payment_url: redirectUrl,
        payment_id: result.trans_id || result.payment_id || result.id,
        order_id: paymentData.order_id,
      };
    } else if (hasRedirectUrl) {
      // If we have a redirect URL but unclear status, treat as success
      const paymentUrl = result.redirect_url || result.payment_url;

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
        payment_id: result.trans_id || result.payment_id || result.id,
        order_id: paymentData.order_id,
      };
    } else {
      // Enhanced error reporting
      const errorMsg =
        result.error_message ||
        result.message ||
        result.errors?.[0]?.error_message ||
        result.errors?.[0]?.message ||
        `Payment failed - Result: ${result.result || "undefined"}, Status: ${
          result.status || "undefined"
        }`;

      console.error("Payment failed with response:", result);

      return {
        status: "error",
        error_message: errorMsg,
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
  console.log("🚀 ~ checkPaymentStatus ~ orderId:", orderId);
  console.log("🚀 ~ checkPaymentStatus ~ paymentId:", paymentId);
  try {
    // Generate hash for status request: payment_id + order_id + password
    const hashInput = `${paymentId}${orderId}${PAYMENT_CONFIG.password}`;
    const md5Hash = CryptoJS.MD5(hashInput.toUpperCase()).toString();
    const hash = CryptoJS.SHA1(md5Hash).toString();

    console.log("Status request hash input:", hashInput);
    console.log("Status request hash:", hash);

    // Create JSON payload as shown in the example
    const requestBody = {
      order_id: orderId,
      merchant_id: PAYMENT_CONFIG.merchantKey,
      gway_Payment_id: paymentId, // Note: lowercase 'd' as in the example
      hash: hash,
    };

    console.log("Status request body:", JSON.stringify(requestBody, null, 2));

    const response = await fetch(PAYMENT_CONFIG.statusUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("Status response status:", response.status);
    console.log(
      "Status response headers:",
      Object.fromEntries(response.headers.entries())
    );

    const responseText = await response.text();
    console.log("Status raw response:", responseText);

    if (!response.ok) {
      throw new Error(
        `Payment status API error: ${response.status} ${response.statusText} - ${responseText}`
      );
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Response that failed to parse:", responseText);
      throw new Error(`Invalid JSON response: ${responseText}`);
    }

    console.log("Payment status response:", result);

    return result;
  } catch (error) {
    console.error("Payment status check error:", error);
    return error;
  }
};

/**
 * Validate payment response from callback
 * According to EdfaPay docs, callback hash should be validated
 */
// export const validatePaymentCallback = (
//   callbackData: any
// ): PaymentStatusResponse => {
//   // For successful transactions, validate hash if present
//   if (callbackData.hash && callbackData.action === "SALE") {
//     // Hash validation logic depends on the payment method
//     // For card payments: action + result + status + order_id + trans_id + trans_date + amount + currency + password
//     // Note: Implement this based on your specific callback validation needs
//     console.log("Validating callback hash:", callbackData.hash);
//   }

//   return {
//     status:
//       callbackData.result === "SUCCESS"
//         ? "success"
//         : callbackData.result?.toLowerCase() || "error",
//     payment_id: callbackData.trans_id || callbackData.payment_id || "",
//     order_id: callbackData.order_id || "",
//     amount: parseFloat(callbackData.amount) || 0,
//     currency: callbackData.currency || "SAR",
//     payment_status:
//       callbackData.status === "SETTLED"
//         ? "completed"
//         : callbackData.status === "PENDING"
//         ? "pending"
//         : callbackData.status === "DECLINED"
//         ? "failed"
//         : "failed",
//     transaction_id: callbackData.trans_id,
//     error_message: callbackData.decline_reason || callbackData.error_message,
//   };
// };

/**
 * Test payment integration with EdfaPay
 * Use this function to test the integration with the provided test card
 */
export const testPaymentIntegration =
  async (): Promise<PaymentInitiateResponse> => {
    const testPaymentData: PaymentInitiateRequest = {
      amount: 1.0, // Test amount
      currency: "SAR",
      order_id: generateOrderId("TEST"),
      description: "Test Payment Integration",
      customer_email: "test@example.com",
      customer_name: "Test Customer",
      customer_phone: "966565555555",
      return_url: "https://gvisaksa.com/#/payment/success",
      callback_url: "https://gvisaksa.com/api/payment/callback",
      payer_first_name: "Test",
      payer_last_name: "Customer",
      payer_address: "Test Address",
      payer_country: "SA",
      payer_city: "Riyadh",
      payer_zip: "12221",
    };

    console.log("Testing payment integration with data:", testPaymentData);
    return await initiatePayment(testPaymentData);
  };
