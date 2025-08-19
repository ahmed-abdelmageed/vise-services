
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 200,
    });
  }

  try {
    // Get the request body
    const body = await req.json();
    const { 
      applicationId, 
      email, 
      firstName, 
      lastName, 
      country, 
      travelDate, 
      totalPrice, 
      serviceType, 
      visaCity, 
      passportInfo, 
      numberOfTravellers, 
      travellerDetails, 
      mothersName,
      phone,
      applicationFiles,
      referenceId // New field to capture the reference ID
    } = body;

    console.log(`Sending confirmation email for application ${applicationId} to ${email}`);

    // Validate required fields
    if (!applicationId || !email || !firstName || !country) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: applicationId, email, firstName, country",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Format travel date
    const formattedDate = new Date(travelDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Initialize Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not set");
      return new Response(
        JSON.stringify({
          error: "Email service configuration error",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    const resend = new Resend(resendApiKey);

    // Create traveller info HTML
    let travellersHTML = '';
    if (travellerDetails && Array.isArray(travellerDetails) && travellerDetails.length > 0) {
      travellersHTML = `
        <h3 style="color: #333; margin-top: 25px; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 8px;">Traveller Details</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px;">
      `;
      
      travellerDetails.forEach((traveller, index) => {
        travellersHTML += `
          <div style="background-color: #f7f9fc; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border-left: 3px solid #6a82fb;">
            <p style="margin: 0 0 8px 0; font-weight: bold; font-size: 16px; color: #333;">Traveller ${index + 1}</p>
            <p style="margin: 5px 0; color: #555;"><strong>Name:</strong> ${traveller.fullName || 'N/A'}</p>
            ${traveller.saudiIdIqama ? `<p style="margin: 5px 0; color: #555;"><strong>Saudi ID/Iqama:</strong> ${traveller.saudiIdIqama}</p>` : ''}
          </div>
        `;
      });
      
      travellersHTML += `</div>`;
    }

    // Create account credentials HTML section
    const accountHTML = `
      <h3 style="color: #333; margin-top: 25px; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 8px;">Account Information</h3>
      <div style="background-color: #f7f9fc; padding: 15px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <p style="margin: 5px 0; color: #555;"><strong>Email:</strong> ${email || 'N/A'}</p>
        <p style="margin: 5px 0; color: #555;"><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p style="margin: 8px 0 5px; font-style: italic; color: #777;">You can use this email to log in to your account and track your application status.</p>
      </div>
    `;

    // Create uploaded files HTML section if available
    let filesHTML = '';
    if (applicationFiles && Object.keys(applicationFiles).length > 0) {
      filesHTML = `
        <h3 style="color: #333; margin-top: 25px; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 8px;">Uploaded Documents</h3>
        <div style="background-color: #f7f9fc; padding: 15px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
      `;
      
      if (applicationFiles.passports && applicationFiles.passports.length > 0) {
        filesHTML += `<p style="margin: 5px 0; color: #555;"><strong>Passports:</strong> ${applicationFiles.passports.length} file(s) uploaded</p>`;
      }
      
      if (applicationFiles.photos && applicationFiles.photos.length > 0) {
        filesHTML += `<p style="margin: 5px 0; color: #555;"><strong>Photos:</strong> ${applicationFiles.photos.length} file(s) uploaded</p>`;
      }
      
      filesHTML += `</div>`;
    }

    // Create email HTML with more comprehensive data and beautiful design
    // Get the reference ID for display - either from the request or query it
    const displayRefId = referenceId || 'GVS-XXXXX'; // Fallback if not provided
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Visa Application Confirmation</title>
          <style>
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 650px;
              margin: 0 auto;
              background-color: #f9f9f9;
            }
            .wrapper {
              background-color: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 15px rgba(0,0,0,0.08);
              margin: 20px;
            }
            .header {
              background: linear-gradient(135deg, #daa520 0%, #f5d782 100%);
              padding: 30px 20px;
              text-align: center;
            }
            .content {
              padding: 30px;
            }
            .footer {
              background-color: #f5f5f5;
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #666;
              border-top: 1px solid #eaeaea;
            }
            h1 {
              color: #ffffff;
              margin: 0;
              font-size: 28px;
              font-weight: 600;
              text-shadow: 0 1px 2px rgba(0,0,0,0.1);
            }
            h2 {
              color: #daa520;
              margin-top: 0;
              font-size: 22px;
              border-bottom: 1px solid #f0f0f0;
              padding-bottom: 10px;
            }
            .details {
              margin: 25px 0;
              padding: 20px;
              background-color: #f9f9f9;
              border-radius: 8px;
              border-left: 4px solid #daa520;
            }
            .details p {
              margin: 10px 0;
            }
            .details strong {
              color: #555;
              display: inline-block;
              min-width: 150px;
            }
            .btn {
              display: inline-block;
              background-color: #daa520;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 4px;
              margin-top: 15px;
              font-weight: 500;
              transition: background-color 0.3s ease;
            }
            .btn:hover {
              background-color: #c99517;
            }
            .highlight {
              background-color: #fff9e6;
              padding: 5px 10px;
              border-radius: 3px;
              display: inline-block;
            }
            .reference {
              font-family: 'Courier New', monospace;
              font-size: 18px;
              font-weight: bold;
              color: #daa520;
              background-color: #fff9e6;
              padding: 8px 15px;
              border-radius: 4px;
              border: 1px dashed #daa520;
              display: inline-block;
              letter-spacing: 1px;
            }
            .status-bar {
              background-color: #f5f5f5;
              padding: 15px;
              border-radius: 8px;
              display: flex;
              margin: 25px 0;
            }
            .status-step {
              flex: 1;
              text-align: center;
              position: relative;
            }
            .status-step::after {
              content: '';
              position: absolute;
              top: 50%;
              right: 0;
              width: 100%;
              height: 2px;
              background-color: #ddd;
              z-index: 0;
            }
            .status-step:last-child::after {
              display: none;
            }
            .status-dot {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background-color: #daa520;
              display: inline-block;
              position: relative;
              z-index: 1;
              margin-bottom: 8px;
            }
            .status-label {
              font-size: 12px;
              font-weight: 500;
              color: #666;
            }
            .total-price {
              font-size: 24px;
              font-weight: bold;
              color: #daa520;
              margin-top: 5px;
            }
            @media only screen and (max-width: 600px) {
              .wrapper {
                margin: 10px;
              }
              .content {
                padding: 20px;
              }
              .details strong {
                min-width: auto;
                margin-right: 5px;
              }
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="header">
              <h1>${country} Visa Application Confirmation</h1>
            </div>
            <div class="content">
              <h2>Application Received</h2>
              <p>Dear ${firstName} ${lastName || ""},</p>
              <p>Thank you for submitting your visa application for <strong>${country}</strong>. We have received your request and are processing it.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <p style="font-size: 15px; color: #555; margin-bottom: 10px;">Your Application Reference Number:</p>
                <div class="reference">${displayRefId}</div>
                <p style="font-style: italic; color: #777; font-size: 13px; margin-top: 10px;">Please keep this reference number for all future communications</p>
              </div>
              
              <div class="status-bar">
                <div class="status-step">
                  <div class="status-dot"></div>
                  <div class="status-label">Submitted</div>
                </div>
                <div class="status-step">
                  <div class="status-dot" style="background-color: #ddd;"></div>
                  <div class="status-label">Processing</div>
                </div>
                <div class="status-step">
                  <div class="status-dot" style="background-color: #ddd;"></div>
                  <div class="status-label">Approved</div>
                </div>
                <div class="status-step">
                  <div class="status-dot" style="background-color: #ddd;"></div>
                  <div class="status-label">Ready</div>
                </div>
              </div>
              
              <div class="details">
                <p><strong>Service Type:</strong> ${serviceType}</p>
                <p><strong>Travel Date:</strong> ${formattedDate}</p>
                <p><strong>Number of Travellers:</strong> ${numberOfTravellers || 1}</p>
                ${visaCity ? `<p><strong>Visa City:</strong> ${visaCity}</p>` : ''}
                ${mothersName ? `<p><strong>Mother's Name:</strong> ${mothersName}</p>` : ''}
                <p><strong>Total Amount:</strong> <span class="total-price">${totalPrice} ﷼</span></p>
              </div>
              
              ${accountHTML}
              
              ${travellersHTML}
              
              ${filesHTML}
              
              <p>Our team will review your application and documents. You will receive updates about your application status via email.</p>
              
              <p>If you have any questions or need assistance, please contact our support team at <a href="mailto:visa@gvsksa.com" style="color: #daa520;">visa@gvsksa.com</a> or by calling <strong>+966535199242</strong>.</p>
              
              <p>Thank you for choosing our services.</p>
              
              <p>Best regards,<br>Visa Service Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply directly to this email.</p>
              <p>&copy; ${new Date().getFullYear()} Visa Services. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      // Get the verified sender email from environment variables or use a default
      const verifiedSenderEmail = Deno.env.get("VERIFIED_SENDER_EMAIL") || "visa@gvsksa.com";
      
      // IMPORTANT: Removed the testing mode check that was preventing emails from going to customers
      // Always send to the customer email
      const recipientEmail = email;
      
      console.log(`Sending email to: ${recipientEmail} from: ${verifiedSenderEmail}`);
      
      // Send the email with better error handling
      const emailResult = await resend.emails.send({
        from: `Visa Services <${verifiedSenderEmail}>`,
        to: [recipientEmail],
        subject: `Your ${country} Visa Application Confirmation (${displayRefId})`,
        html: htmlContent,
      });

      console.log("Email send result:", emailResult);

      if ('error' in emailResult) {
        console.error("Email send error:", emailResult.error);
        
        // If the error is related to sending to unverified recipients, we update the application
        // but return a special message to the frontend
        if (emailResult.error && 
            (emailResult.error.message?.includes("verify a domain") || 
             emailResult.error.statusCode === 403)) {
          console.log("Email domain not verified. This is expected in development.");
          
          // Create Supabase client to update the application record
          const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
          const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
          const supabase = createClient(supabaseUrl, supabaseKey);

          // Update the application to mark email as pending
          const { error: updateError } = await supabase
            .from("visa_applications")
            .update({ email_sent: true, email_status: "pending_verification" })
            .eq("id", applicationId);

          if (updateError) {
            console.error("Error updating application:", updateError);
          }
          
          return new Response(
            JSON.stringify({
              success: true,
              message: "Application submitted successfully. Email will be sent after domain verification.",
              emailStatus: "pending_verification",
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 200,
            }
          );
        }
        
        throw new Error(`Failed to send email: ${JSON.stringify(emailResult.error)}`);
      }

      // Create Supabase client to update the application record
      const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
      const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Update the application to mark email as sent
      const { error: updateError } = await supabase
        .from("visa_applications")
        .update({ email_sent: true, email_status: "sent" })
        .eq("id", applicationId);

      if (updateError) {
        console.error("Error updating application:", updateError);
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Confirmation email sent successfully",
          data: emailResult,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return new Response(
        JSON.stringify({
          error: emailError.message || "Failed to send email",
          errorDetails: emailError,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({
        error: `Unexpected error: ${error.message}`,
        errorDetails: error,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
