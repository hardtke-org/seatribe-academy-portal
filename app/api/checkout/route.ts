import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getCourseById } from "@/lib/courses";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseId } = body as { courseId: string };

    const course = getCourseById(courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-11-18.endive",
    });

    const domain =
      process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: course.currency.toLowerCase(),
            product_data: {
              name: course.title,
              description: course.subtitle,
            },
            unit_amount: course.price * 100, // in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: undefined, // collect during checkout
      billing_address_collection: "auto",
      customer_creation: "always",
      success_url: `${domain}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domain}/kurs/${course.id}`,
      metadata: {
        course_id: course.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
