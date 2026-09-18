import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  createdAt: string | Date;
  paymentMethod: string;
  itemTotal: number;
  taxes: number;
  deliveryFee: number;
  grandTotal: number;
  restaurant?: {
    name?: string;
    address?: {
      street?: string;
    };
  };
  items: OrderItem[];
}

export const downloadInvoice = (order: Order) => {
  const doc = new jsPDF();
  const orderDate = new Date(order.createdAt);
  
  // Header
  doc.setFontSize(22);
  doc.setTextColor(255, 122, 48); // Cravon Orange
  doc.text("Cravon Food Delivery", 14, 20);
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text("Tax Invoice / Bill of Supply", 14, 28);
  
  // Order Details
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Order ID: #${order._id}`, 14, 40);
  doc.text(`Date: ${orderDate.toLocaleDateString("en-IN")} ${orderDate.toLocaleTimeString("en-IN")}`, 14, 46);
  doc.text(`Payment Method: ${order.paymentMethod.toUpperCase()}`, 14, 52);
  
  // Restaurant Details
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Restaurant Details", 130, 40);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`${order.restaurant?.name || "Restaurant"}`, 130, 46);
  if (order.restaurant?.address?.street) {
     doc.text(`${order.restaurant.address.street}`, 130, 52);
  }
  
  // Table
  const tableData = order.items.map((item: OrderItem, index: number) => [
    index + 1,
    item.name,
    item.quantity,
    `Rs. ${item.price}`,
    `Rs. ${item.price * item.quantity}`
  ]);
  
  autoTable(doc, {
    startY: 65,
    head: [['#', 'Item Name', 'Qty', 'Unit Price', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [255, 122, 48] },
    margin: { top: 10 }
  });
  
  const finalY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY || 65;
  
  // Summary
  doc.setFontSize(10);
  doc.text("Item Total:", 130, finalY + 10);
  doc.text(`Rs. ${order.itemTotal}`, 170, finalY + 10);
  
  doc.text("Taxes (5%):", 130, finalY + 16);
  doc.text(`Rs. ${order.taxes}`, 170, finalY + 16);
  
  doc.text("Delivery Fee:", 130, finalY + 22);
  doc.text(`Rs. ${order.deliveryFee}`, 170, finalY + 22);
  
  doc.setFont("helvetica", "bold");
  doc.text("Grand Total:", 130, finalY + 30);
  doc.text(`Rs. ${order.grandTotal}`, 170, finalY + 30);
  
  // Footer
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(150, 150, 150);
  doc.text("Thank you for ordering with Cravon!", 14, 280);
  
  doc.save(`Invoice_Cravon_${order._id.substring(order._id.length - 6)}.pdf`);
};
