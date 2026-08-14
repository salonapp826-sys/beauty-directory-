import { Order, User } from '../types';

/**
 * Generates and triggers a download of a formatted CSV/Excel spreadsheet
 * containing all order purchase invoices for salon bookkeeping (Tally, QuickBooks, Excel).
 */
export function exportOrdersToCSV(orders: Order[], user: User | null, fileNamePrefix = 'Nexora_Salon_Purchase_Invoices') {
  if (!orders || orders.length === 0) {
    alert('No orders available to export.');
    return;
  }

  const headers = [
    'Invoice Number',
    'Order ID',
    'Date',
    'Status',
    'Distributor Name',
    'Billed Salon Branch',
    'Recipient Name',
    'Phone',
    'GSTIN',
    'Items Summary',
    'Total Items Qty',
    'Subtotal (INR)',
    'GST 18% ITC (INR)',
    'Discount (INR)',
    'Total Amount (INR)',
    'Logistics Partner',
    'Tracking Number',
  ];

  const rows = orders.map((order) => {
    const itemsSummary = order.items
      .map((item) => `${item.product.name} (x${item.quantity})`)
      .join('; ');
    
    const totalQty = order.items.reduce((acc, item) => acc + item.quantity, 0);
    const branchName = order.shippingAddress?.branchName || user?.salonName || 'Main Branch';
    const recipientName = order.shippingAddress?.recipientName || user?.name || 'Verified Buyer';
    const phone = order.shippingAddress?.phone || user?.phone || '';
    const gstin = order.shippingAddress?.gstin || user?.gstNumber || 'N/A';

    return [
      order.invoiceNumber,
      order.id,
      order.date,
      order.status,
      order.distributorName,
      branchName,
      recipientName,
      phone,
      gstin,
      itemsSummary,
      totalQty,
      order.subtotal,
      order.gstAmount,
      order.discount || 0,
      order.total,
      order.courierPartner || 'Blue Dart Express',
      order.trackingNumber || 'N/A',
    ];
  });

  // Helper to escape CSV strings safely
  const escapeCSV = (val: string | number) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...rows.map((row) => row.map(escapeCSV).join(',')),
  ].join('\n');

  // Trigger browser file download
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const timestamp = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileNamePrefix}_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Opens a print-formatted Bookkeeping Ledger PDF view for all or filtered orders.
 */
export function exportOrdersToPDF(orders: Order[], user: User | null) {
  if (!orders || orders.length === 0) {
    alert('No orders available to export.');
    return;
  }

  const salonName = user?.salonName || 'Aura Luxe Salon & Spa Network';
  const userGstin = user?.gstNumber || '27AABCU9603R1ZM';
  const totalSpent = orders.reduce((acc, o) => acc + o.total, 0);
  const totalGstItc = orders.reduce((acc, o) => acc + o.gstAmount, 0);

  const windowUrl = 'about:blank';
  const uniqueName = 'Nexora_Purchase_Ledger_' + Date.now();
  const printWindow = window.open(windowUrl, uniqueName, 'width=900,height=800');

  if (!printWindow) {
    alert('Please allow popups to open the PDF Bookkeeping Ledger.');
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Purchase Ledger & Invoices - ${salonName}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 12px; color: #1c1b1b; padding: 30px; margin: 0; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #8e004b; padding-bottom: 15px; margin-bottom: 20px; }
          .logo { font-size: 24px; font-weight: 900; color: #8e004b; letter-spacing: -0.5px; }
          .sub { font-size: 11px; color: #594047; }
          .summary-card { background: #FAF8F8; border: 1px solid #E8E8E8; padding: 12px 18px; border-radius: 8px; margin-bottom: 20px; display: flex; justify-content: space-between; }
          .stat { display: inline-block; margin-right: 25px; }
          .stat-label { font-size: 10px; color: #594047; font-weight: bold; text-transform: uppercase; }
          .stat-val { font-size: 16px; font-weight: bold; color: #1c1b1b; margin-top: 2px; }
          .stat-val.gst { color: #0150d6; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th { background: #8e004b; color: white; text-align: left; padding: 8px 10px; font-size: 11px; text-transform: uppercase; }
          td { padding: 8px 10px; border-bottom: 1px solid #E8E8E8; font-size: 11px; }
          tr:nth-child(even) { background: #FCF9F8; }
          .amount { font-family: monospace; font-weight: bold; text-align: right; }
          .footer { margin-top: 30px; border-top: 1px solid #E8E8E8; padding-top: 12px; font-size: 10px; color: #594047; text-align: center; }
          .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; background: #e0f2fe; color: #0369a1; }
          .badge.delivered { background: #dcfce7; color: #15803d; }
          @media print {
            .no-print { display: none; }
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div className="no-print" style="margin-bottom: 15px; text-align: right;">
          <button onclick="window.print()" style="background: #8e004b; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer;">
            🖨️ Print / Save as PDF
          </button>
        </div>

        <div class="header">
          <div>
            <div class="logo">NEXORA</div>
            <div class="sub">Official Wholesale Beauty & Salon Procurement Network</div>
            <div class="sub">Statement Date: ${new Date().toLocaleDateString('en-GB')}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 14px; font-weight: bold;">PURCHASE INVOICE LEDGER</div>
            <div class="sub">Salon: <strong>${salonName}</strong></div>
            <div class="sub">GSTIN: <strong>${userGstin}</strong></div>
          </div>
        </div>

        <div class="summary-card">
          <div class="stat">
            <div class="stat-label">Total Invoices</div>
            <div class="stat-val">${orders.length} Consignments</div>
          </div>
          <div class="stat">
            <div class="stat-label">Total Wholesale Expenditure</div>
            <div class="stat-val">₹${totalSpent.toLocaleString('en-IN')}</div>
          </div>
          <div class="stat">
            <div class="stat-label">Claimable GST Input Tax Credit (ITC)</div>
            <div class="stat-val gst">₹${totalGstItc.toLocaleString('en-IN')}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Invoice No / Order ID</th>
              <th>Distributor</th>
              <th>Status</th>
              <th style="text-align: right;">Subtotal</th>
              <th style="text-align: right;">GST 18%</th>
              <th style="text-align: right;">Total (INR)</th>
            </tr>
          </thead>
          <tbody>
            ${orders
              .map(
                (o) => `
              <tr>
                <td>${o.date}</td>
                <td>
                  <strong>${o.invoiceNumber}</strong><br/>
                  <span style="color:#594047; font-size:10px;">ID: ${o.id}</span>
                </td>
                <td>${o.distributorName}</td>
                <td>
                  <span class="badge ${o.status === 'Delivered' ? 'delivered' : ''}">${o.status}</span>
                </td>
                <td class="amount">₹${o.subtotal.toLocaleString('en-IN')}</td>
                <td class="amount">₹${o.gstAmount.toLocaleString('en-IN')}</td>
                <td class="amount" style="color:#8e004b;">₹${o.total.toLocaleString('en-IN')}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <div class="footer">
          Computer-generated purchase ledger report for GST reconciliation (GSTR-2B) and accounting records. Nexora Wholesale Network.
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 400);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
