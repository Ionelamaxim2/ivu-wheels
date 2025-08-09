import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface PaymentData {
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  selectedShipping: string;
  paymentMethod: string;
  billingAddress: string;
  cartItems: any[];
  total: number;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  shippingMethod: string;
  paymentMethod: string;
  billingAddress: string;
  items: any[];
  subtotal: number;
  shipping: number;
  total: number;
  status: "processing" | "shipped" | "delivered" | "cancelled";
}

const ordersFilePath = path.join(process.cwd(), "data", "orders.json");

function initOrdersDb() {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(ordersFilePath)) {
    fs.writeFileSync(ordersFilePath, JSON.stringify([], null, 2));
  }
}

function generateOrderNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `IVU${timestamp.slice(-6)}${random}`;
}

function calculateShipping(method: string): number {
  switch (method) {
    case "ground":
      return 0;
    case "express":
      return 15;
    case "overnight":
      return 30;
    default:
      return 0;
  }
}

export async function POST(request: NextRequest) {
  try {
    initOrdersDb();

    const paymentData: PaymentData = await request.json();

    // Validare date
    if (!paymentData.email || !paymentData.address || !paymentData.city) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!paymentData.cartItems || paymentData.cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const paymentSuccess = Math.random() > 0.1;

    if (!paymentSuccess) {
      return NextResponse.json(
        { error: "Payment failed. Please try again." },
        { status: 400 }
      );
    }

    const orderNumber = generateOrderNumber();
    const shipping = calculateShipping(paymentData.selectedShipping);
    const subtotal = paymentData.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order: Order = {
      id: `order_${Date.now()}`,
      orderNumber,
      date: new Date().toISOString(),
      email: paymentData.email,
      address: paymentData.address,
      city: paymentData.city,
      postalCode: paymentData.postalCode || "",
      country: paymentData.country || "Romania",
      shippingMethod: paymentData.selectedShipping,
      paymentMethod: paymentData.paymentMethod,
      billingAddress: paymentData.billingAddress,
      items: paymentData.cartItems,
      subtotal,
      shipping,
      total: subtotal + shipping,
      status: "processing",
    };

    const orders = JSON.parse(fs.readFileSync(ordersFilePath, "utf8"));
    orders.push(order);
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));

    return NextResponse.json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        total: order.total,
        date: order.date,
        items: order.items,
      },
    });
  } catch (error) {
    console.error("Payment processing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
