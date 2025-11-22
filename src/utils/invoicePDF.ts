import html2pdf from "html2pdf.js";
import { format } from "date-fns";
import { FooterItem } from "@/api/footer";

export interface InvoiceData {
  id: string;
  invoice_number: string;
  client_id: string;
  amount: number;
  currency?: string;
  status: string;
  issue_date: string;
  due_date?: string | null;
  payment_date?: string | null;
  service_description?: string | null;
  customer_name?: string;
  customer_email?: string;
  created_at: string;
  updated_at?: string | null;
}

export const generateInvoicePDF = (
  invoice: InvoiceData,
  language: "en" | "ar" = "en",
  footerData?: FooterItem[]
) => {
  // Helper function to extract company info from footer data
  const getCompanyInfo = (footerData?: FooterItem[]) => {
    if (!footerData || footerData.length === 0) {
      return {
        name: "Vise Services",
        email: "info@viseservices.com",
        phone: "+966 11 234 5678",
        address: "Riyadh, Saudi Arabia",
        vat: "",
        cr: "",
      };
    }

    const footerInfo = footerData[0];
    return {
      name: footerInfo.trade_name || footerInfo.web_name || "Vise Services",
      email: footerInfo.email || "info@viseservices.com",
      phone: footerInfo.phone || "+966 11 234 5678",
      address: "Riyadh, Saudi Arabia",
      vat: footerInfo.vat_num || "",
      cr: footerInfo.cr_num || "",
    };
  };

  const isArabic = language === "ar";
  const companyInfo = getCompanyInfo(footerData);

  // Helper function to format date
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return isArabic ? "غير متوفر" : "Not Available";
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch (e) {
      return dateString;
    }
  };

  // Create HTML content for the invoice
  const htmlContent = `
    <!DOCTYPE html>
    <html dir="${isArabic ? "rtl" : "ltr"}" lang="${language}">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice ${invoice.invoice_number}</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: ${
                  isArabic
                    ? "'Tajawal', Arial, sans-serif"
                    : "'Inter', Arial, sans-serif"
                };
                font-size: 14px;
                line-height: 1.5;
                color: #1f2937;
                direction: ${isArabic ? "rtl" : "ltr"};
                background: #f9fafb;
                padding: 20px;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
            
            .invoice-container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04);
                border: 1px solid #e5e7eb;
            }
            
            .header {
                background: white;
                padding: 40px 40px 30px 40px;
                border-bottom: 1px solid #f3f4f6;
            }
            
            .header h1 {
                font-size: 32px;
                font-weight: 700;
                margin-bottom: 25px;
                color: #1f2937;
                text-align: ${isArabic ? "right" : "left"};
                letter-spacing: ${isArabic ? "0" : "-0.5px"};
            }
            
            .header-info {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                gap: 40px;
                flex-direction: ${isArabic ? "row-reverse" : "row"};
                flex-wrap: wrap;
            }
            
            .company-info,
            .invoice-details {
                flex: 1;
                min-width: 280px;
            }
            
            .company-info h3,
            .invoice-details h3 {
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 16px;
                color: #374151;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                border-bottom: 2px solid #e5e7eb;
                padding-bottom: 8px;
            }
            
            .info-item {
                margin-bottom: 10px;
                font-size: 14px;
                color: #6b7280;
                font-weight: 400;
                line-height: 1.4;
            }
            
            .info-item strong {
                color: #374151;
                font-weight: 500;
            }
            
            .content {
                padding: 40px;
            }
            
            .bill-to {
                margin-bottom: 40px;
                padding: 30px;
                background: #f8fafc;
                border-radius: 8px;
                border: 1px solid #e5e7eb;
                border-${isArabic ? "right" : "left"}: 3px solid #3b82f6;
            }
            
            .bill-to h3 {
                color: #1f2937;
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 20px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .customer-info {
                display: grid;
                gap: 12px;
            }
            
            .customer-info div {
                font-size: 14px;
                line-height: 1.4;
                color: #374151;
            }
            
            .customer-info strong {
                color: #1f2937;
                font-weight: 600;
                margin-right: 8px;
            }
            
            .status-badge {
                display: flex !important;

                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;
                height: fit-content;
            }
            
            .status-paid {
                background: #ecfdf5;
                color: #065f46;
                border: 1px solid #d1fae5;
            }
            
            .status-pending {
                background: #fffbeb;
                color: #92400e;
                border: 1px solid #fde68a;
            }
            
            .status-unpaid {
                background: #fef2f2;
                color: #991b1b;
                border: 1px solid #fecaca;
            }
            
            .services-table {
                width: 100%;
                border-collapse: collapse;
                margin: 30px 0;
                border-radius: 8px;
                overflow: hidden;
                border: 1px solid #e5e7eb;
                background: white;
            }
            
            .services-table th {
                background: #f9fafb;
                color: #374151;
                padding: 20px 16px;
                font-weight: 600;
                text-align: ${isArabic ? "right" : "left"};
                border-bottom: 1px solid #e5e7eb;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .services-table td {
                padding: 20px 16px;
                border-bottom: 1px solid #f3f4f6;
                text-align: ${isArabic ? "right" : "left"};
                vertical-align: middle;
                font-size: 14px;
                color: #374151;
            }
            
            .services-table tbody tr:last-child td {
                border-bottom: none;
            }
            
            .description-cell {
                max-width: 300px;
                word-wrap: break-word;
                font-weight: 500;
                color: #1f2937;
            }
            
            .amount-cell {
                text-align: center !important;
                font-weight: 600;
                color: #1f2937;
                font-size: 14px;
            }
            
            .totals-section {
                margin-top: 40px;
                padding: 0;
                background: transparent;
                border: none;
            }
            
            .total-row {
                display: flex;
                justify-content: space-between;
                padding: 16px 0;
                border-bottom: 1px solid #f3f4f6;
                flex-direction: ${isArabic ? "row-reverse" : "row"};
                font-size: 14px;
                color: #6b7280;
            }
            
            .total-row:last-child {
                border-bottom: 2px solid #e5e7eb;
                border-top: 2px solid #e5e7eb;
                font-weight: 700;
                font-size: 18px;
                color: #1f2937;
                margin-top: 12px;
                padding: 20px 0;
                background: #f9fafb;
                margin-left: -20px;
                margin-right: -20px;
                padding-left: 20px;
                padding-right: 20px;
            }
            
            .total-label {
                font-weight: inherit;
            }
            
            .total-value {
                font-weight: inherit;
                color: inherit;
            }
            
            .footer {
                margin-top: 50px;
                padding: 30px 40px;
                background: #f9fafb;
                color: #6b7280;
                text-align: center;
                font-size: 12px;
                border-top: 1px solid #e5e7eb;
            }
            
            .footer-note {
                margin-bottom: 16px;
                font-style: italic;
                font-size: 13px;
                color: #374151;
                font-weight: 400;
            }
            
            .footer-company {
                margin-bottom: 12px;
                font-weight: 500;
                font-size: 12px;
                color: #6b7280;
            }
            
            .footer-timestamp {
                font-size: 11px;
                color: #9ca3af;
                font-weight: 400;
            }
            
            /* Print optimizations */
            @media print {
                body {
                    margin: 0;
                    padding: 0;
                    background: white;
                }
                
                .invoice-container {
                    border: none;
                    box-shadow: none;
                    max-width: none;
                }
                
                .header {
                    padding: 30px 30px 20px 30px;
                }
                
                .content {
                    padding: 30px;
                }
                
                .footer {
                    padding: 20px 30px;
                }
            }
        </style>
    </head>
    <body>
        <div class="invoice-container">
            <div class="header">
                <h1>${isArabic ? "فاتورة" : "INVOICE"}</h1>
                <div class="header-info">
                    <div class="company-info">
                        <h3>${
                          isArabic ? "معلومات الشركة" : "Company Information"
                        }</h3>
                        <div class="info-item">${companyInfo.name}</div>
                        <div class="info-item">${
                          isArabic ? "البريد الإلكتروني: " : "Email: "
                        }${companyInfo.email}</div>
                        <div class="info-item">${
                          isArabic ? "الهاتف: " : "Phone: "
                        }${companyInfo.phone}/div>
                        <div class="info-item">${
                          isArabic ? "العنوان: " : "Address: "
                        }${companyInfo.address}</div>
                        ${
                          companyInfo.vat
                            ? `<div class="info-item">${
                                isArabic ? "الرقم الضريبي: " : "VAT: "
                              }${companyInfo.vat}</div>`
                            : ""
                        }
                        ${
                          companyInfo.cr
                            ? `<div class="info-item">${
                                isArabic ? "السجل التجاري: " : "CR: "
                              }${companyInfo.cr}</div>`
                            : ""
                        }
                    </div>
                    <div class="invoice-details">
                        <h3>${
                          isArabic ? "تفاصيل الفاتورة" : "Invoice Details"
                        }</h3>
                        <div class="info-item">${
                          isArabic ? "رقم الفاتورة: " : "Invoice Number: "
                        }${invoice.invoice_number}</div>
                        <div class="info-item">${
                          isArabic ? "تاريخ الإصدار: " : "Issue Date: "
                        }${formatDate(invoice.issue_date)}</div>
                        ${
                          invoice.due_date
                            ? `<div class="info-item">${
                                isArabic ? "تاريخ الاستحقاق: " : "Due Date: "
                              }${formatDate(invoice.due_date)}</div>`
                            : ""
                        }
                        ${
                          invoice.payment_date
                            ? `<div class="info-item">${
                                isArabic ? "تاريخ الدفع: " : "Payment Date: "
                              }${formatDate(invoice.payment_date)}</div>`
                            : ""
                        }
                        <div class="info-item">
                            ${isArabic ? "الحالة: " : "Status: "}
                            <span class="status-badge status-${invoice.status.toLowerCase()}">
                                ${
                                  isArabic
                                    ? invoice.status === "Paid"
                                      ? "مدفوع"
                                      : invoice.status === "Pending"
                                      ? "قيد الانتظار"
                                      : "غير مدفوع"
                                    : invoice.status
                                }
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="content">
                <div class="bill-to">
                    <h3>${isArabic ? "إرسال الفاتورة إلى:" : "Bill To:"}</h3>
                    <div class="customer-info">
                        <div><strong>${
                          isArabic ? "الاسم: " : "Name: "
                        }</strong>${
    invoice.customer_name || (isArabic ? "غير متوفر" : "Not Available")
  }</div>
                        <div><strong>${
                          isArabic ? "البريد الإلكتروني: " : "Email: "
                        }</strong>${
    invoice.customer_email || (isArabic ? "غير متوفر" : "Not Available")
  }</div>
                        <div><strong>${
                          isArabic ? "رقم العميل: " : "Client ID: "
                        }</strong>${invoice.client_id}</div>
                    </div>
                </div>
                
                <table class="services-table">
                    <thead>
                        <tr>
                            <th>${isArabic ? "الوصف" : "Description"}</th>
                            <th>${isArabic ? "الكمية" : "Quantity"}</th>
                            <th>${isArabic ? "سعر الوحدة" : "Unit Price"}</th>
                            <th>${isArabic ? "الإجمالي" : "Total"}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="description-cell">${
                              invoice.service_description ||
                              (isArabic ? "خدمات التأشيرة" : "Visa Services")
                            }</td>
                            <td class="amount-cell">1</td>
                            <td class="amount-cell">${invoice.amount} ${
    invoice.currency || "SAR"
  }</td>
                            <td class="amount-cell">${invoice.amount} ${
    invoice.currency || "SAR"
  }</td>
                        </tr>
                    </tbody>
                </table>
                
                <div class="totals-section">
                    <div class="total-row" dir="rtl">
                        <span class="total-label">${
                          isArabic ? "الإجمالي:" : "Total:"
                        }</span>
                        <span class="total-value" dir="ltr">${invoice.amount} ${
    invoice.currency || "SAR"
  }</span>
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <div class="footer-note">
                    ${
                      isArabic
                        ? "نشكرك لاختيارك خدماتنا. نقدر ثقتك بنا."
                        : "Thank you for choosing our services. We appreciate your business."
                    }
                </div>
                <div class="footer-company">
                    ${companyInfo.name} - ${
    isArabic ? "حلول التأشيرة الاحترافية" : "Professional Visa Solutions"
  }
                </div>
                <div class="footer-timestamp">
                    ${isArabic ? "تم الإنشاء في: " : "Generated on: "}${format(
    new Date(),
    "dd/MM/yyyy HH:mm"
  )}
                </div>
            </div>
        </div>
    </body>
    </html>
  `;

  return htmlContent;
};

export const downloadInvoicePDF = async (
  invoice: InvoiceData,
  language: "en" | "ar" = "en",
  footerData?: FooterItem[]
) => {
  try {
    console.log("Generating PDF for invoice:", invoice.invoice_number);

    // Helper function to extract company info from footer data
    const getCompanyInfo = (footerData?: FooterItem[]) => {
      if (!footerData || footerData.length === 0) {
        return {
          name: "Vise Services",
          email: "info@viseservices.com",
          phone: "+966 11 234 5678",
          address: "Riyadh, Saudi Arabia",
          vat: "",
          cr: "",
        };
      }

      const footerInfo = footerData[0];
      return {
        name: footerInfo.trade_name || footerInfo.web_name || "Vise Services",
        email: footerInfo.email || "info@viseservices.com",
        phone: footerInfo.phone || "+966 11 234 5678",
        address: "Riyadh, Saudi Arabia",
        vat: footerInfo.vat_num || "",
        cr: footerInfo.cr_num || "",
      };
    };

    // Create the HTML content without the html/body tags for direct injection
    const isArabic = language === "ar";
    const companyInfo = getCompanyInfo(footerData);

    // Helper function to format date
    const formatDate = (dateString: string | null | undefined) => {
      if (!dateString) return isArabic ? "غير متوفر" : "Not Available";
      try {
        return format(new Date(dateString), "dd/MM/yyyy");
      } catch (e) {
        return dateString;
      }
    };

    // Create a temporary div with the invoice content
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = `
      <div class="invoice-container" style="
        font-family: ${
          isArabic ? "Tajawal, Arial, sans-serif" : "Inter, Arial, sans-serif"
        };
        direction: ${isArabic ? "rtl" : "ltr"};
        width: 800px;
        margin: 0 auto;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04);
      ">
        <div style="
          background: white;
          padding: 40px 40px 30px 40px;
          border-bottom: 1px solid #f3f4f6;
        ">
          <h1 style="
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 25px;
            color: #1f2937;
            text-align: ${isArabic ? "right" : "left"};
            letter-spacing: ${isArabic ? "0" : "-0.5px"};
          ">${isArabic ? "فاتورة" : "INVOICE"}</h1>
          
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 40px;
            flex-direction: ${isArabic ? "row-reverse" : "row"};
            flex-wrap: wrap;
          ">
            <div style="flex: 1; min-width: 280px;" dir="${
              isArabic ? "rtl" : "ltr"
            }">
              <h3 style="
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 16px;
                color: #374151;
                border-bottom: 2px solid #e5e7eb;
                padding-bottom: 8px;
                letter-spacing: 0px;
              ">${isArabic ? "معلومات الشركة" : "Company Information"}</h3>
              <div style="margin-bottom: 10px; font-size: 14px; color: #6b7280; font-weight: 400; line-height: 1.4;"><strong style="color: #374151; font-weight: 500;">${
                companyInfo.name
              }</strong></div>
              <div style="margin-bottom: 10px; font-size: 14px; color: #6b7280; font-weight: 400; line-height: 1.4;">${
                isArabic ? "البريد الإلكتروني: " : "Email: "
              }${companyInfo.email}</div>
              <div style="margin-bottom: 10px; font-size: 14px; color: #6b7280; font-weight: 400; line-height: 1.4;">${
                isArabic ? "الهاتف: " : "Phone: "
              }${companyInfo.phone}</div>
              <div style="margin-bottom: 10px; font-size: 14px; color: #6b7280; font-weight: 400; line-height: 1.4;">${
                isArabic ? "العنوان: " : "Address: "
              }${companyInfo.address}</div>
              ${
                companyInfo.vat
                  ? `<div style="margin-bottom: 10px; font-size: 14px; color: #6b7280; font-weight: 400; line-height: 1.4;">${
                      isArabic ? "الرقم الضريبي: " : "VAT: "
                    }${companyInfo.vat}</div>`
                  : ""
              }
              ${
                companyInfo.cr
                  ? `<div style="margin-bottom: 10px; font-size: 14px; color: #6b7280; font-weight: 400; line-height: 1.4;">${
                      isArabic ? "السجل التجاري: " : "CR: "
                    }${companyInfo.cr}</div>`
                  : ""
              }
            </div>
            
            <div style="flex: 1; min-width: 280px;">
              <h3 style="
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 16px;
                color: #374151;
                text-transform: uppercase;
                letter-spacing: 0px;
                border-bottom: 2px solid #e5e7eb;
                padding-bottom: 8px;
              ">${isArabic ? "تفاصيل الفاتورة" : "Invoice Details"}</h3>
              <div style="margin-bottom: 10px; font-size: 14px; color: #6b7280; font-weight: 400; line-height: 1.4;">${
                isArabic ? "رقم الفاتورة: " : "Invoice Number: "
              }<strong style="color: #374151; font-weight: 500;">${
      invoice.invoice_number
    }</strong></div>
              <div style="margin-bottom: 10px; font-size: 14px; color: #6b7280; font-weight: 400; line-height: 1.4;">${
                isArabic ? "تاريخ الإصدار: " : "Issue Date: "
              }${formatDate(invoice.issue_date)}</div>
              ${
                invoice.due_date
                  ? `<div style="margin-bottom: 10px; font-size: 14px; color: #6b7280; font-weight: 400; line-height: 1.4;">${
                      isArabic ? "تاريخ الاستحقاق: " : "Due Date: "
                    }${formatDate(invoice.due_date)}</div>`
                  : ""
              }
              ${
                invoice.payment_date
                  ? `<div style="margin-bottom: 10px; font-size: 14px; color: #6b7280; font-weight: 400; line-height: 1.4;">${
                      isArabic ? "تاريخ الدفع: " : "Payment Date: "
                    }${formatDate(invoice.payment_date)}</div>`
                  : ""
              }
              <div style="margin-bottom: 10px; font-size: 14px; color: #6b7280; font-weight: 400; line-height: 1.4;">
                ${isArabic ? "الحالة: " : "Status: "}
                <span style="
                  display: inline-block;
                  padding: 16px !important;
                  padding-top: 0px !important;
                  padding-bottom: 16px !important;
                  margin-top: 16px;
                  border-radius: 20px;
                  text-align: center;
                  font-size: 11px;
                  font-weight: 600;
                  text-transform: uppercase;
                  letter-spacing: 0px;
                  background: ${
                    invoice.status === "Paid"
                      ? "#ecfdf5"
                      : invoice.status === "Pending"
                      ? "#fffbeb"
                      : "#fef2f2"
                  };
                  color: ${
                    invoice.status === "Paid"
                      ? "#065f46"
                      : invoice.status === "Pending"
                      ? "#92400e"
                      : "#991b1b"
                  };
                  border: 1px solid ${
                    invoice.status === "Paid"
                      ? "#d1fae5"
                      : invoice.status === "Pending"
                      ? "#fde68a"
                      : "#fecaca"
                  };
                ">
                  ${
                    isArabic
                      ? invoice.status === "Paid"
                        ? "مدفوع"
                        : invoice.status === "Pending"
                        ? "قيد الانتظار"
                        : "غير مدفوع"
                      : invoice.status
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div style="padding: 40px;">
          <div style="
            margin-bottom: 40px;
            padding: 30px;
            background: #f8fafc;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            border-${isArabic ? "right" : "left"}: 3px solid #3b82f6;
          ">
            <h3 style="
              color: #1f2937;
              font-size: 16px;
              font-weight: 600;
              margin-bottom: 20px;
              text-transform: uppercase;
              letter-spacing: 0px;
            ">${isArabic ? "إرسال الفاتورة إلى:" : "Bill To:"}</h3>
            
            <div style="display: grid; gap: 12px;">
              <div style="font-size: 14px; line-height: 1.4; color: #374151;">
                <strong style="color: #1f2937; font-weight: 600; margin-right: 8px;">${
                  isArabic ? "الاسم: " : "Name: "
                }</strong>${
      invoice.customer_name || (isArabic ? "غير متوفر" : "Not Available")
    }
              </div>
              <div style="font-size: 14px; line-height: 1.4; color: #374151;">
                <strong style="color: #1f2937; font-weight: 600; margin-right: 8px;">${
                  isArabic ? "البريد الإلكتروني: " : "Email: "
                }</strong>${
      invoice.customer_email || (isArabic ? "غير متوفر" : "Not Available")
    }
              </div>
              <div style="font-size: 14px; line-height: 1.4; color: #374151;">
                <strong style="color: #1f2937; font-weight: 600; margin-right: 8px;">${
                  isArabic ? "رقم العميل: " : "Client ID: "
                }</strong>${invoice.client_id}
              </div>
            </div>
          </div>
          
          <table style="
            width: 100% !important;
            border-collapse: collapse;
            margin: 30px 0;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #e5e7eb;
            background: white;
          ">
            <thead>
              <tr>
                <th style="
                  background: #f9fafb;
                  color: #374151;
                  padding: 20px 16px;
                  font-weight: 600;
                  text-align: ${isArabic ? "right" : "left"};
                  border-bottom: 1px solid #e5e7eb;
                  font-size: 12px;
                  text-transform: uppercase;
                  width: 40%;
                  letter-spacing: 0px;
                ">${isArabic ? "الوصف" : "Description"}</th>
                <th style="
                  background: #f9fafb;
                  color: #374151;
                  padding: 20px 16px;
                  font-weight: 600;
                  text-align: center;
                  border-bottom: 1px solid #e5e7eb;
                  font-size: 12px;
                  text-transform: uppercase;
                  letter-spacing: 0px;
                  width: 10%;
                ">${isArabic ? "الكمية" : "Quantity"}</th>
                <th style="
                  background: #f9fafb;
                  color: #374151;
                  padding: 20px 16px;
                  font-weight: 600;
                  text-align: center;
                  border-bottom: 1px solid #e5e7eb;
                  font-size: 12px;
                  text-transform: uppercase;
                  letter-spacing: 0px;
                  width: 10%;
                ">${isArabic ? "سعر الوحدة" : "Unit Price"}</th>
                <th style="
                  background: #f9fafb;
                  color: #374151;
                  padding: 20px 16px;
                  font-weight: 600;
                  text-align: center;
                  border-bottom: 1px solid #e5e7eb;
                  font-size: 12px;
                  text-transform: uppercase;
                  letter-spacing: 0px;
                  width: 10%;
                ">${isArabic ? "الإجمالي" : "Total"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="
                  padding: 20px 16px;
                  text-align: ${isArabic ? "right" : "left"};
                  vertical-align: middle;
                  font-size: 14px;
                  color: #374151;
                  max-width: 300px;
                  word-wrap: break-word;
                  font-weight: 500;
                  color: #1f2937;
                "
                dir="ltr">${
                  invoice.service_description ||
                  (isArabic ? "خدمات التأشيرة" : "Visa Services")
                }</td>
                <td style="
                  padding: 20px 16px;
                  text-align: center;
                  vertical-align: middle;
                  font-size: 14px;
                  color: #374151;
                  font-weight: 600;
                  color: #1f2937;
                "
                dir="ltr">1</td>
                <td style="
                  padding: 20px 16px;
                  text-align: center;
                  vertical-align: middle;
                  font-size: 14px;
                  color: #374151;
                  font-weight: 600;
                  color: #1f2937;
                "
                dir="ltr">${invoice.amount} ${invoice.currency || "SAR"}</td>
                <td style="
                  padding: 20px 16px;
                  text-align: center;
                  vertical-align: middle;
                  font-size: 14px;
                  color: #374151;
                  font-weight: 600;
                  color: #1f2937;
                "
                dir="ltr">${invoice.amount} ${invoice.currency || "SAR"}</td>
              </tr>
            </tbody>
          </table>
          
          <div style="margin-top: 40px; padding: 0; background: transparent; border: none;">
            <div style="
              display: flex;
              justify-content: space-between;
              padding: 20px 0;
              border-bottom: 2px solid #e5e7eb;
              border-top: 2px solid #e5e7eb;
              font-weight: 700;
              font-size: 18px;
              color: #1f2937;
              margin-top: 12px;
              background: #f9fafb;
              margin-left: -20px;
              margin-right: -20px;
              padding-left: 20px;
              padding-right: 20px;
              flex-direction: row;
            ">
              <span>${isArabic ? "الإجمالي:" : "Total:"}</span>
              <span dir="ltr">${invoice.amount} ${
      invoice.currency || "SAR"
    }</span>
            </div>
          </div>
        </div>
        
        <div style="
          margin-top: 50px;
          padding: 30px 40px;
          background: #f9fafb;
          color: #6b7280;
          text-align: center;
          font-size: 12px;
          border-top: 1px solid #e5e7eb;
        ">
          <div style="
            margin-bottom: 16px;
            font-style: italic;
            font-size: 13px;
            color: #374151;
            font-weight: 400;
          ">${
            isArabic
              ? "نشكرك لاختيارك خدماتنا. نقدر ثقتك بنا."
              : "Thank you for choosing our services. We appreciate your business."
          }</div>
          
          <div style="
            margin-bottom: 12px;
            font-weight: 500;
            font-size: 12px;
            color: #6b7280;
          ">${companyInfo.name} - ${
      isArabic ? "حلول التأشيرة الاحترافية" : "Professional Visa Solutions"
    }</div>
          
          <div style="
            font-size: 11px;
            color: #9ca3af;
            font-weight: 400;
          ">${isArabic ? "تم الإنشاء في: " : "Generated on: "}${format(
      new Date(),
      "dd/MM/yyyy HH:mm"
    )}</div>
        </div>
      </div>
    `;

    tempDiv.style.position = "absolute";
    tempDiv.style.top = "0";
    tempDiv.style.left = "0";
    tempDiv.style.width = "800px";
    tempDiv.style.zIndex = "-1000";
    tempDiv.style.backgroundColor = "white";
    tempDiv.style.padding = "20px";

    document.body.appendChild(tempDiv);

    // Wait for any potential font loading
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const filename = `invoice-${invoice.invoice_number}.pdf`;

    // Configure html2pdf options
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5] as [number, number, number, number],
      filename: filename,
      image: { type: "jpeg" as const, quality: 0.95 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        allowTaint: true,
        logging: true,
        width: 800,
        height: 1000,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait" as const,
      },
    };

    console.log("Downloading PDF as:", filename);

    // Generate and download the PDF
    await html2pdf().set(opt).from(tempDiv).save();

    // Clean up
    document.body.removeChild(tempDiv);

    console.log("PDF download initiated successfully");
  } catch (error) {
    console.error("Error generating/downloading PDF:", error);
    // Clean up on error
    const tempElements = document.querySelectorAll('[style*="z-index: -1000"]');
    tempElements.forEach((el) => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
    throw new Error("Failed to generate PDF. Please try again.");
  }
};

export const previewInvoicePDF = async (
  invoice: InvoiceData,
  language: "en" | "ar" = "en",
  footerData?: FooterItem[]
) => {
  try {
    console.log("Generating PDF preview for invoice:", invoice.invoice_number);

    // Just create a simple HTML preview window
    const htmlContent = generateInvoicePDF(invoice, language, footerData);

    // Create a new window for preview
    const previewWindow = window.open(
      "",
      "_blank",
      "width=900,height=700,scrollbars=yes"
    );
    if (!previewWindow) {
      throw new Error("Popup blocked. Please allow popups for this site.");
    }

    // Write the HTML content to the new window
    previewWindow.document.write(htmlContent);
    previewWindow.document.close();

    console.log("Invoice preview opened successfully");
  } catch (error) {
    console.error("Error generating invoice preview:", error);
    throw new Error("Failed to preview invoice. Please try again.");
  }
};
