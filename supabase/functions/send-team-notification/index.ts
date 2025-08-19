
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
      referenceId,
      formData,
      uploadedFiles
    } = body;

    console.log(`Sending team notification email for application ${applicationId} with reference ID ${referenceId}`);

    // Validate required fields
    if (!applicationId || !referenceId) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: applicationId and referenceId",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

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

    // Create Supabase client to fetch application details
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the application details from the database to ensure we have all data
    const { data: applicationData, error: fetchError } = await supabase
      .from("visa_applications")
      .select("*")
      .eq("id", applicationId)
      .single();

    if (fetchError) {
      console.error("Error fetching application details:", fetchError);
      return new Response(
        JSON.stringify({
          error: "Failed to fetch application details",
          details: fetchError,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // Format form data for email
    const firstName = formData.travellers?.[0]?.fullName?.split(' ')?.[0] || applicationData.first_name || 'Client';
    const lastName = formData.travellers?.[0]?.fullName?.split(' ')?.slice(1)?.join(' ') || applicationData.last_name || '';
    const clientName = `${firstName} ${lastName}`.trim();
    const clientEmail = formData.email || applicationData.email;

    // Format travel date
    const travelDate = formData.travelDate ? new Date(formData.travelDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }) : 'Not specified';

    // Generate form data HTML for email
    let formDataHTML = `
      <h3 style="color: #333; margin-top: 25px; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 8px;">Client Details</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; width: 30%;"><strong>Name</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${clientName}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${clientEmail}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${formData.countryCode}${formData.phoneNumber || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Country</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${formData.country || applicationData.country || 'Not specified'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Travel Date</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${travelDate}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Number of Travellers</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${formData.numberOfTravellers || applicationData.adults || 1}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Service Type</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${formData.serviceType || applicationData.service_type || 'Standard'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Total Price</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${formData.totalPrice || applicationData.total_price || 0} SAR</td>
        </tr>
      </table>
    `;

    // Add travellers details if available
    if (formData.travellers && formData.travellers.length > 0) {
      formDataHTML += `
        <h3 style="color: #333; margin-top: 25px; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 8px;">Traveller Details</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr>
              <th style="padding: 8px; border: 1px solid #ddd; background-color: #f2f2f2; text-align: left;">Full Name</th>
              <th style="padding: 8px; border: 1px solid #ddd; background-color: #f2f2f2; text-align: left;">Saudi ID/Iqama</th>
            </tr>
          </thead>
          <tbody>
      `;

      formData.travellers.forEach((traveller: any) => {
        formDataHTML += `
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">${traveller.fullName || 'Not provided'}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${traveller.saudiIdIqama || 'Not provided'}</td>
          </tr>
        `;
      });

      formDataHTML += `
          </tbody>
        </table>
      `;
    }

    // Add uploaded files information if available
    let filesHTML = '';
    if (uploadedFiles) {
      const hasPassports = uploadedFiles.passports && uploadedFiles.passports.length > 0;
      const hasPhotos = uploadedFiles.photos && uploadedFiles.photos.length > 0;

      if (hasPassports || hasPhotos) {
        filesHTML = `
          <h3 style="color: #333; margin-top: 25px; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 8px;">Uploaded Documents</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr>
                <th style="padding: 8px; border: 1px solid #ddd; background-color: #f2f2f2; text-align: left;">Document Type</th>
                <th style="padding: 8px; border: 1px solid #ddd; background-color: #f2f2f2; text-align: left;">File Name</th>
                <th style="padding: 8px; border: 1px solid #ddd; background-color: #f2f2f2; text-align: left;">Size</th>
              </tr>
            </thead>
            <tbody>
        `;

        if (hasPassports) {
          uploadedFiles.passports.forEach((file: any, index: number) => {
            if (file) {
              filesHTML += `
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd;">Passport (Traveller ${index + 1})</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${file.name || 'Unknown'}</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown'}</td>
                </tr>
              `;
            }
          });
        }

        if (hasPhotos) {
          uploadedFiles.photos.forEach((file: any, index: number) => {
            if (file) {
              filesHTML += `
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd;">Photo (Traveller ${index + 1})</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${file.name || 'Unknown'}</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown'}</td>
                </tr>
              `;
            }
          });
        }

        filesHTML += `
            </tbody>
          </table>
          <p style="font-style: italic; color: #666; margin-top: 10px; margin-bottom: 20px;">
            Note: The uploaded files are attached to this email.
          </p>
        `;
      }
    }

    // Create email HTML
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Visa Application Submission</title>
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
              background: linear-gradient(135deg, #36558F 0%, #536B8E 100%);
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
              color: #36558F;
              margin-top: 0;
              font-size: 22px;
              border-bottom: 1px solid #f0f0f0;
              padding-bottom: 10px;
            }
            .reference {
              font-family: 'Courier New', monospace;
              font-size: 18px;
              font-weight: bold;
              color: #36558F;
              background-color: #f0f4f8;
              padding: 8px 15px;
              border-radius: 4px;
              border: 1px dashed #36558F;
              display: inline-block;
              letter-spacing: 1px;
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              padding: 8px;
              border: 1px solid #ddd;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="header">
              <h1>New Visa Application Received</h1>
            </div>
            <div class="content">
              <h2>Application Details</h2>
              <p style="margin-bottom: 5px;"><strong>Reference ID:</strong></p>
              <div class="reference">${referenceId}</div>
              <p>A new visa application has been submitted. Please review the details below:</p>
              
              ${formDataHTML}
              
              ${filesHTML}
              
              <p>This application requires your review and action. You can access the application details through the admin dashboard.</p>
              
              <p style="margin-top: 30px;">Best regards,<br>Visa Application System</p>
            </div>
            <div class="footer">
              <p>This is an automated message from your visa application system.</p>
              <p>&copy; ${new Date().getFullYear()} Visa Services. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      // Get the team email address from environment variable
      const teamEmail = Deno.env.get("TEAM_EMAIL") || "visa@gvsksa.com";
      // Use the verified sender email or fall back to default
      const verifiedSenderEmail = Deno.env.get("VERIFIED_SENDER_EMAIL") || "visa@gvsksa.com";
      
      console.log(`Sending team notification email to: ${teamEmail} from: ${verifiedSenderEmail}`);
      
      // Prepare attachments if files were uploaded
      const attachments = [];
      
      // Process passport files
      if (uploadedFiles?.passports?.length > 0) {
        for (let i = 0; i < uploadedFiles.passports.length; i++) {
          const file = uploadedFiles.passports[i];
          if (!file || !file.dataUrl) continue;
          
          try {
            // Extract base64 content from data URL
            const matches = file.dataUrl.match(/^data:(.+);base64,(.+)$/);
            if (matches && matches.length === 3) {
              const contentType = matches[1];
              const base64Content = matches[2];
              
              attachments.push({
                filename: `passport_traveler_${i+1}_${file.name}`,
                content: base64Content,
                encoding: 'base64',
                contentType: contentType
              });
              
              console.log(`Passport file for traveler ${i+1} prepared for attachment`);
            }
          } catch (attachErr) {
            console.error(`Error processing passport attachment for traveler ${i+1}:`, attachErr);
          }
        }
      }
      
      // Process photo files
      if (uploadedFiles?.photos?.length > 0) {
        for (let i = 0; i < uploadedFiles.photos.length; i++) {
          const file = uploadedFiles.photos[i];
          if (!file || !file.dataUrl) continue;
          
          try {
            // Extract base64 content from data URL
            const matches = file.dataUrl.match(/^data:(.+);base64,(.+)$/);
            if (matches && matches.length === 3) {
              const contentType = matches[1];
              const base64Content = matches[2];
              
              attachments.push({
                filename: `photo_traveler_${i+1}_${file.name}`,
                content: base64Content,
                encoding: 'base64',
                contentType: contentType
              });
              
              console.log(`Photo file for traveler ${i+1} prepared for attachment`);
            }
          } catch (attachErr) {
            console.error(`Error processing photo attachment for traveler ${i+1}:`, attachErr);
          }
        }
      }
      
      console.log(`Total attachments prepared: ${attachments.length}`);
      
      // Send the team notification email with attachments
      const emailResult = await resend.emails.send({
        from: `Visa Services <${verifiedSenderEmail}>`,
        to: [teamEmail],
        subject: `New Visa Application - Reference: ${referenceId}`,
        html: htmlContent,
        attachments: attachments.length > 0 ? attachments : undefined,
      });

      console.log("Team notification email result:", emailResult);

      if ('error' in emailResult) {
        console.error("Email send error:", emailResult.error);
        throw new Error(`Failed to send team notification email: ${JSON.stringify(emailResult.error)}`);
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Team notification email sent successfully",
          data: emailResult,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } catch (emailError) {
      console.error("Error sending team notification email:", emailError);
      return new Response(
        JSON.stringify({
          error: emailError.message || "Failed to send team notification email",
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
