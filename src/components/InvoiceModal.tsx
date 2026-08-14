import { useState } from 'react';
import { Order, User } from '../types';
import { exportOrdersToCSV, exportOrdersToPDF } from '../utils/exportUtils';

interface InvoiceModalProps {
  order: Order | null;
  user: User | null;
  onClose: () => void;
  onTrackOrder?: (order: Order) => void;
}

export function InvoiceModal({ order, user, onClose, onTrackOrder }: InvoiceModalProps) {
  const [isPrintFriendly, setIsPrintFriendly] = useState(false);

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:static print:block"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border relative overflow-hidden animate-fade-in print:p-0 print:border-none print:shadow-none print:max-w-none print:w-full ${
          isPrintFriendly
            ? 'border-stone-800 font-sans text-stone-900 bg-white'
            : 'border-[#E8E8E8]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Actions bar (hidden in print) */}
        <div className="flex flex-wrap justify-between items-center gap-2 pb-4 mb-4 border-b border-[#E8E8E8] print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              <span>Order Confirmed & GST Logged</span>
            </span>

            {/* Print-Friendly Toggle Button */}
            <button
              id="invoice-print-friendly-toggle-btn"
              onClick={() => setIsPrintFriendly(!isPrintFriendly)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-2xs ${
                isPrintFriendly
                  ? 'bg-[#8e004b] hover:bg-[#b90064] text-white'
                  : 'bg-stone-800 hover:bg-stone-900 text-white'
              }`}
              title="Toggle simplified high-contrast view for printing & bookkeeping"
            >
              <span className="material-symbols-outlined text-sm">
                {isPrintFriendly ? 'visibility' : 'receipt_long'}
              </span>
              <span>{isPrintFriendly ? 'Standard View' : 'Print-Friendly View'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onTrackOrder && !isPrintFriendly && (
              <button
                onClick={() => {
                  onClose();
                  onTrackOrder(order);
                }}
                className="bg-[#8e004b] hover:bg-[#b90064] text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors shadow-2xs"
              >
                <span className="material-symbols-outlined text-sm">local_shipping</span>
                <span>Track Shipment</span>
              </button>
            )}
            <button
              id="invoice-export-csv-btn"
              onClick={() => exportOrdersToCSV([order], user, `Invoice_${order.invoiceNumber}`)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors shadow-2xs"
              title="Download itemized invoice CSV for bookkeeping"
            >
              <span className="material-symbols-outlined text-sm">table_view</span>
              <span>CSV</span>
            </button>
            <button
              id="invoice-export-pdf-btn"
              onClick={() => exportOrdersToPDF([order], user)}
              className="bg-[#0150d6] hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors shadow-2xs"
              title="Generate PDF ledger or print invoice"
            >
              <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
              <span>PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="bg-[#F0EDEC] hover:bg-[#ece7e7] text-[#1c1b1b] text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="text-[#594047] hover:text-[#1c1b1b] p-1"
              aria-label="Close invoice"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Print-Friendly Info Notice Banner (Hidden in print output) */}
        {isPrintFriendly && (
          <div className="mb-5 p-3 bg-stone-100 border border-stone-300 rounded-xl flex items-center justify-between text-xs text-stone-800 print:hidden">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-stone-700 text-lg">print_connect</span>
              <div>
                <p className="font-bold">Print-Friendly & Bookkeeping Mode Active</p>
                <p className="text-[11px] text-stone-600">
                  Background colors and non-essential UI elements stripped for high-contrast scanning, physical printing, and accounting records.
                </p>
              </div>
            </div>
            <button
              onClick={handlePrint}
              className="bg-stone-900 hover:bg-black text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 shrink-0 ml-3"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              <span>Print Now</span>
            </button>
          </div>
        )}

        {/* PRINT-FRIENDLY VIEW LAYOUT */}
        {isPrintFriendly ? (
          <div className="space-y-5 text-xs text-stone-900 font-sans">
            {/* Minimal High-Contrast Header */}
            <div className="border-b-2 border-stone-900 pb-4 flex justify-between items-start">
              <div>
                <h1 className="text-xl font-black tracking-tight text-stone-900 uppercase">
                  NEXORA WHOLESALE NETWORK
                </h1>
                <p className="text-[11px] font-medium text-stone-700">Official B2B Beauty & Salon Procurement</p>
                <p className="text-[11px] font-mono font-semibold text-stone-800 mt-0.5">
                  Supplier GSTIN: 27AAECN7890Q1ZB
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-extrabold uppercase tracking-widest text-stone-900 border-b-2 border-stone-900 pb-0.5 inline-block">
                  TAX INVOICE & BOOKKEEPING LEDGER
                </p>
                <p className="text-xs font-mono font-bold mt-1">Inv #: {order.invoiceNumber}</p>
                <p className="text-[11px]">Invoice Date: {order.date}</p>
                <p className="text-[11px] font-semibold text-stone-700">Status: {order.status}</p>
              </div>
            </div>

            {/* Address & GST Details Grid */}
            <div className="grid grid-cols-3 gap-3 border border-stone-800 p-3 bg-white text-[11px]">
              <div className="border-r border-stone-300 pr-2">
                <p className="font-extrabold uppercase text-stone-900 text-[10px] mb-1">BILLED TO (BUYER):</p>
                <p className="font-bold text-stone-900">
                  {order.shippingAddress?.branchName || user?.salonName || 'Salon Procurement Branch'}
                </p>
                <p className="text-stone-700">
                  Attn: {order.shippingAddress?.recipientName || user?.name || 'Authorized Buyer'}
                </p>
                <p className="font-mono font-bold text-stone-900 mt-1">
                  GSTIN: {order.shippingAddress?.gstin || user?.gstNumber || 'UNREGISTERED / COMPOSITION'}
                </p>
              </div>

              <div className="border-r border-stone-300 pr-2">
                <p className="font-extrabold uppercase text-stone-900 text-[10px] mb-1">DISPATCH LOCATION:</p>
                {order.shippingAddress ? (
                  <>
                    <p className="font-semibold text-stone-900">{order.shippingAddress.branchName}</p>
                    <p className="text-stone-700 text-[10px]">
                      {order.shippingAddress.addressLine1},{' '}
                      {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                    </p>
                    <p className="text-stone-700 text-[10px]">Phone: {order.shippingAddress.phone}</p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-stone-900">{user?.salonName || 'Main Salon'}</p>
                    <p className="text-stone-700 text-[10px]">{user?.city || 'Mumbai, Maharashtra'}</p>
                  </>
                )}
              </div>

              <div>
                <p className="font-extrabold uppercase text-stone-900 text-[10px] mb-1">FULFILLMENT SUPPLIER:</p>
                <p className="font-bold text-stone-900">{order.distributorName}</p>
                <p className="text-stone-700 text-[10px]">Courier: {order.courierPartner || 'Blue Dart'}</p>
                <p className="text-stone-700 font-mono text-[10px]">AWB: {order.trackingNumber || 'N/A'}</p>
              </div>
            </div>

            {/* High-Contrast Itemized Table */}
            <table className="w-full text-left border-collapse border border-stone-800 text-[11px]">
              <thead className="bg-stone-100 text-stone-900 font-bold border-b-2 border-stone-800">
                <tr>
                  <th className="p-2 border-r border-stone-400">#</th>
                  <th className="p-2 border-r border-stone-400">Item Description</th>
                  <th className="p-2 border-r border-stone-400 text-center">Brand / Category</th>
                  <th className="p-2 border-r border-stone-400 text-center">Qty</th>
                  <th className="p-2 border-r border-stone-400 text-right">Unit Rate (₹)</th>
                  <th className="p-2 text-right">Total Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-300">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-2 border-r border-stone-300 font-mono text-center text-stone-600">
                      {idx + 1}
                    </td>
                    <td className="p-2 border-r border-stone-300">
                      <p className="font-bold text-stone-900">{item.product.name}</p>
                    </td>
                    <td className="p-2 border-r border-stone-300 text-center text-stone-700 text-[10px]">
                      {item.product.brand} ({item.product.category})
                    </td>
                    <td className="p-2 border-r border-stone-300 text-center font-bold text-stone-900">
                      {item.quantity}
                    </td>
                    <td className="p-2 border-r border-stone-300 text-right font-mono text-stone-800">
                      ₹{item.selectedTierPrice.toLocaleString('en-IN')}
                    </td>
                    <td className="p-2 text-right font-mono font-bold text-stone-900">
                      ₹{(item.selectedTierPrice * item.quantity).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals & GST Summary Box */}
            <div className="flex justify-between items-start gap-4 pt-2">
              <div className="flex-1 border border-stone-400 p-3 rounded-none text-[10px] space-y-1 bg-stone-50">
                <p className="font-bold text-stone-900 uppercase">GST INPUT TAX CREDIT (ITC) CERTIFICATION:</p>
                <p className="text-stone-700">
                  This invoice is filed under Section 31 of the CGST Act. The recipient salon is eligible to claim input tax credit (ITC) of <strong>₹{order.gstAmount.toLocaleString('en-IN')}</strong> in GSTR-3B filings.
                </p>
                <div className="mt-3 pt-3 border-t border-stone-300 flex justify-between text-stone-800 font-mono">
                  <span>Salon Manager / Accountant Sign: ___________________</span>
                  <span>Date: ____________</span>
                </div>
              </div>

              <div className="w-64 border-2 border-stone-900 p-3 bg-white text-[11px] space-y-1.5">
                <div className="flex justify-between text-stone-700">
                  <span>Subtotal:</span>
                  <span className="font-mono">₹{order.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-stone-700">
                  <span>Integrated GST (18%):</span>
                  <span className="font-mono">+₹{order.gstAmount.toLocaleString('en-IN')}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-stone-800 font-semibold">
                    <span>Discount:</span>
                    <span className="font-mono">-₹{order.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-black text-stone-900 pt-2 border-t-2 border-stone-900">
                  <span>GRAND TOTAL:</span>
                  <span className="font-mono">₹{order.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Legal Footer */}
            <p className="text-[9px] text-stone-500 text-center border-t border-stone-300 pt-2">
              This document is a print-optimized computer-generated invoice for salon bookkeeping records. Nexora B2B Procurement.
            </p>
          </div>
        ) : (
          /* STANDARD VIEW LAYOUT */
          <div className="space-y-6 text-xs text-[#1c1b1b]">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-black text-[#8e004b] tracking-tight">NEXORA</h1>
                <p className="text-[11px] text-[#594047]">Official B2B Luxury Beauty Network</p>
                <p className="text-[11px] text-[#594047]">GSTIN: 27AAECN7890Q1ZB</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold uppercase tracking-wider text-[#1c1b1b]">TAX INVOICE</span>
                <p className="text-[11px] font-mono text-[#594047]">{order.invoiceNumber}</p>
                <p className="text-[11px] text-[#594047]">Date: {order.date}</p>
                <span className="inline-block mt-1 text-[10px] font-bold bg-[#FDE7F3] text-[#8e004b] px-2 py-0.5 rounded">
                  Status: {order.status}
                </span>
              </div>
            </div>

            {/* Billing & Shipping */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#F0EDEC] p-3.5 rounded-xl border border-[#E8E8E8]">
              <div>
                <p className="font-bold text-[#1c1b1b] mb-0.5">Billed To:</p>
                <p className="font-semibold text-[#8e004b]">
                  {order.shippingAddress?.branchName || user?.salonName || 'Direct Salon Consignment'}
                </p>
                <p className="text-[#594047]">
                  {order.shippingAddress?.recipientName || user?.name || 'Verified Salon Buyer'}
                </p>
                <p className="font-mono text-[10px] text-[#0150d6] font-semibold mt-1">
                  GSTIN: {order.shippingAddress?.gstin || user?.gstNumber || 'UNREGISTERED / COMPOSITION'}
                </p>
              </div>
              <div>
                <p className="font-bold text-[#1c1b1b] mb-0.5">Shipped / Dispatched To:</p>
                {order.shippingAddress ? (
                  <>
                    <p className="font-semibold text-[#1c1b1b]">{order.shippingAddress.branchName}</p>
                    <p className="text-[#594047]">
                      Attn: {order.shippingAddress.recipientName} ({order.shippingAddress.phone})
                    </p>
                    <p className="text-[#594047] text-[10px]">
                      {order.shippingAddress.addressLine1}
                      {order.shippingAddress.landmark ? ` (${order.shippingAddress.landmark})` : ''},{' '}
                      {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-[#1c1b1b]">{user?.salonName || 'Main Salon Branch'}</p>
                    <p className="text-[#594047]">{user?.city || 'Mumbai, Maharashtra'}</p>
                    <p className="text-[#594047] text-[10px]">Direct Salon Express Delivery</p>
                  </>
                )}
              </div>
              <div>
                <p className="font-bold text-[#1c1b1b] mb-0.5">Fulfillment Distributor:</p>
                <p className="font-semibold text-[#1c1b1b]">{order.distributorName}</p>
                <p className="text-[#594047]">Express Dispatch Facility</p>
                <p className="text-[#594047]">Pan-India Verified Logistics</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="border border-[#E8E8E8] rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-[#f7f2f2] text-[11px] font-bold text-[#594047] border-b border-[#E8E8E8]">
                  <tr>
                    <th className="p-2.5">Item Description</th>
                    <th className="p-2.5 text-center">Qty</th>
                    <th className="p-2.5 text-right">Unit Rate</th>
                    <th className="p-2.5 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E8E8] text-[11px]">
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5">
                        <p className="font-semibold text-[#1c1b1b]">{item.product.name}</p>
                        <p className="text-[10px] text-[#594047]">{item.product.brand} • {item.product.category}</p>
                      </td>
                      <td className="p-2.5 text-center font-bold">{item.quantity}</td>
                      <td className="p-2.5 text-right font-mono">₹{item.selectedTierPrice.toLocaleString('en-IN')}</td>
                      <td className="p-2.5 text-right font-bold font-mono">
                        ₹{(item.selectedTierPrice * item.quantity).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Calculation */}
            <div className="flex justify-end">
              <div className="w-64 space-y-1.5 text-[11px]">
                <div className="flex justify-between text-[#594047]">
                  <span>Wholesale Subtotal:</span>
                  <span className="font-mono">₹{order.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#594047]">
                  <span>Integrated GST (18%):</span>
                  <span className="font-mono">+₹{order.gstAmount.toLocaleString('en-IN')}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-700 font-semibold">
                    <span>Nexora Salon Discount:</span>
                    <span className="font-mono">-₹{order.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-[#8e004b] pt-2 border-t border-[#E8E8E8]">
                  <span>Total Amount:</span>
                  <span className="font-mono">₹{order.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="bg-[#FDE7F3]/40 p-3 rounded-xl border border-[#ffd9e2] text-[10px] text-[#594047] text-center">
              This is a computer-generated tax invoice valid under the GST Act. Salon is entitled to input tax credit (ITC) on all verified wholesale purchases.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

