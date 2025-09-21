import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

// Import additional fonts for better support
// Note: For production, you should add proper Arabic fonts
// For now, we'll use built-in fonts with better encoding

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

export const generateInvoicePDF = (invoice: InvoiceData, language: 'en' | 'ar' = 'en') => {
  // Create PDF with better configuration for text rendering
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
    compress: true
  });
  
  const isArabic = language === 'ar';
  
  // Set default font with better support for international characters
  doc.setFont('helvetica', 'normal');
  
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Colors
  const primaryColor = '#1e40af'; // visa-dark
  const goldColor = '#f59e0b'; // visa-gold
  const grayColor = '#6b7280';
  const blackColor = '#000000';

  // Helper function to format date
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not Available';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (e) {
      return dateString;
    }
  };

  // Helper function to safely render text with better encoding
  const renderText = (text: string, x: number, y: number, options: any = {}) => {
    try {
      // Ensure text is properly encoded
      const cleanText = text.toString().replace(/[^\x00-\x7F]/g, ""); // Remove non-ASCII for now
      doc.text(cleanText || text, x, y, options);
    } catch (error) {
      console.warn('Text rendering fallback:', text);
      // Fallback to basic text
      doc.text(text.toString(), x, y, options);
    }
  };

  // Helper function to calculate tax
  const calculateTax = (amount: number) => {
    return (amount * 0.15).toFixed(2);
  };

  const totalWithTax = (amount: number) => {
    return (amount + parseFloat(calculateTax(amount))).toFixed(2);
  };

  // Header with improved text rendering
  doc.setFontSize(28);
  doc.setTextColor(primaryColor);
  doc.setFont('helvetica', 'bold');
  
  const headerText = 'INVOICE'; // Use English for consistent rendering
  const headerX = isArabic ? pageWidth - 20 : 20;
  renderText(headerText, headerX, 30, { align: isArabic ? 'right' : 'left' });

  // Company Info with better formatting
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(blackColor);
  
  const companyInfo = [
    'Vise Services',
    'Email: info@viseservices.com',
    'Phone: +966 11 234 5678',
    'Address: Riyadh, Saudi Arabia'
  ];
  
  companyInfo.forEach((line, index) => {
    const x = isArabic ? pageWidth - 20 : 20;
    const align = isArabic ? 'right' : 'left';
    renderText(line, x, 50 + (index * 6), { align });
  });

  // Invoice Info (opposite side) with better alignment
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(blackColor);
  
  const invoiceInfoLabels = {
    number: 'Invoice Number:',
    issue: 'Issue Date:',
    due: 'Due Date:',
    payment: 'Payment Date:'
  };
  
  const invoiceInfo = [
    `${invoiceInfoLabels.number} ${invoice.invoice_number}`,
    `${invoiceInfoLabels.issue} ${formatDate(invoice.issue_date)}`,
    ...(invoice.due_date ? [`${invoiceInfoLabels.due} ${formatDate(invoice.due_date)}`] : []),
    ...(invoice.payment_date ? [`${invoiceInfoLabels.payment} ${formatDate(invoice.payment_date)}`] : [])
  ];

  invoiceInfo.forEach((line, index) => {
    const x = isArabic ? 20 : pageWidth - 20;
    const align = isArabic ? 'left' : 'right';
    renderText(line, x, 50 + (index * 6), { align });
  });

  // Status Badge with better styling
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  const statusColor = invoice.status === 'Paid' ? '#10b981' : invoice.status === 'Pending' ? '#f59e0b' : '#ef4444';
  doc.setTextColor(statusColor);
  const statusX = isArabic ? 20 : pageWidth - 20;
  const statusAlign = isArabic ? 'left' : 'right';
  renderText(invoice.status.toUpperCase(), statusX, 80, { align: statusAlign });

  // Bill To Section with improved formatting
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor);
  const billToLabel = 'Bill To:'; // Use English for clarity
  renderText(billToLabel, 20, 100);

  // Customer details with improved formatting
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(blackColor);
  
  const customerName = invoice.customer_name || 'Customer Name Not Available';
  const customerEmail = invoice.customer_email || 'Email Not Available';
  const clientId = `Client ID: ${invoice.client_id}`;
  
  const billToInfo = [customerName, customerEmail, clientId];

  billToInfo.forEach((line, index) => {
    renderText(line, 20, 110 + (index * 6));
  });

  // Table Header with improved styling
  const tableTop = 145;
  doc.setFillColor(245, 245, 245);
  doc.rect(20, tableTop, pageWidth - 40, 12, 'F');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(blackColor);
  
  const tableHeaders = {
    description: 'Description',
    qty: 'Qty',
    unitPrice: 'Unit Price',
    total: 'Total'
  };
  
  // Table headers positioned better
  renderText(tableHeaders.description, 25, tableTop + 8);
  renderText(tableHeaders.qty, 100, tableTop + 8, { align: 'center' });
  renderText(tableHeaders.unitPrice, 130, tableTop + 8, { align: 'center' });
  renderText(tableHeaders.total, 160, tableTop + 8, { align: 'center' });

  // Table Row with better formatting
  const rowTop = tableTop + 20;
  doc.setFont('helvetica', 'normal');
  
  const serviceDesc = invoice.service_description || 'Visa Services';
  const unitPrice = `${invoice.amount} ${invoice.currency || 'SAR'}`;
  const totalPrice = `${invoice.amount} ${invoice.currency || 'SAR'}`;
  
  renderText(serviceDesc, 25, rowTop);
  renderText('1', 100, rowTop, { align: 'center' });
  renderText(unitPrice, 130, rowTop, { align: 'center' });
  renderText(totalPrice, 160, rowTop, { align: 'center' });

  // Add table border
  doc.setDrawColor(200, 200, 200);
  doc.rect(20, tableTop, pageWidth - 40, 32);

  // Totals Section with improved alignment and styling
  const totalsTop = rowTop + 25;
  
  // Draw separator line
  doc.setDrawColor(150, 150, 150);
  doc.line(120, totalsTop, pageWidth - 20, totalsTop);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(blackColor);
  
  const totalsLabels = {
    subtotal: 'Subtotal:',
    tax: 'Tax (15%):',
    total: 'Total:'
  };

//   // Subtotal
//   renderText(totalsLabels.subtotal, 120, totalsTop + 12);
//   renderText(`${invoice.amount.toFixed(2)} ${invoice.currency || 'SAR'}`, pageWidth - 20, totalsTop + 12, { align: 'right' });

//   // Tax
//   renderText(totalsLabels.tax, 120, totalsTop + 24);
//   renderText(`${calculateTax(invoice.amount)} ${invoice.currency || 'SAR'}`, pageWidth - 20, totalsTop + 24, { align: 'right' });

  // Total (highlighted)
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor);
  renderText(totalsLabels.total, 120, totalsTop + 40);
  renderText(`${invoice.amount} ${invoice.currency || 'SAR'}`, pageWidth - 20, totalsTop + 40, { align: 'right' });

  // Footer with improved formatting
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(grayColor);
  
  const footerText = 'Thank you for choosing our services. We appreciate your business.';
  
  // Center the footer text
  renderText(footerText, pageWidth / 2, pageHeight - 40, { align: 'center' });

  // Add separator line above footer
  doc.setDrawColor(200, 200, 200);
  doc.line(20, pageHeight - 50, pageWidth - 20, pageHeight - 50);

  // Generated timestamp with better formatting
  doc.setFontSize(9);
  doc.setTextColor(grayColor);
  const timestamp = `Generated on: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`;
  renderText(timestamp, pageWidth / 2, pageHeight - 25, { align: 'center' });

  // Add company footer info
  doc.setFontSize(8);
  const companyFooter = 'Visa Services - Professional Visa Solutions';
  renderText(companyFooter, pageWidth / 2, pageHeight - 15, { align: 'center' });

  return doc;
};

export const downloadInvoicePDF = (invoice: InvoiceData, language: 'en' | 'ar' = 'en') => {
  try {
    console.log('Generating PDF for invoice:', invoice.invoice_number);
    const doc = generateInvoicePDF(invoice, language);
    const filename = `invoice-${invoice.invoice_number}.pdf`;
    console.log('Downloading PDF as:', filename);
    doc.save(filename);
    console.log('PDF download initiated successfully');
  } catch (error) {
    console.error('Error generating/downloading PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

export const previewInvoicePDF = (invoice: InvoiceData, language: 'en' | 'ar' = 'en') => {
  try {
    console.log('Generating PDF preview for invoice:', invoice.invoice_number);
    const doc = generateInvoicePDF(invoice, language);
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const previewWindow = window.open(pdfUrl, '_blank');
    
    if (!previewWindow) {
      throw new Error('Popup blocked. Please allow popups for this site.');
    }
    
    console.log('PDF preview opened successfully');
    
    // Clean up the object URL after some time
    setTimeout(() => {
      URL.revokeObjectURL(pdfUrl);
    }, 10000);
    
  } catch (error) {
    console.error('Error generating PDF preview:', error);
    throw new Error('Failed to preview PDF. Please try again.');
  }
};
