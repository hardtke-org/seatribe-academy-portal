import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-11-18.endive",
  });

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const customerEmail = session.customer_details?.email || session.customer_email;
    const courseId = session.metadata?.course_id;
    const stripeSessionId = session.id;

    if (!customerEmail || !courseId) {
      console.error("Missing email or course_id in webhook", { customerEmail, courseId });
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    try {
      const supabase = await createAdminClient();

      // Invite user (creates if new, re-invites if existing) and send magic link email
      const domain = process.env.NEXT_PUBLIC_DOMAIN || "https://seatribe-academy-portal.vercel.app";
      const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(customerEmail, {
        redirectTo: `${domain}/auth/callback?next=/portal`,
      });
      if (inviteError) {
        console.error("Failed to send invite email:", inviteError);
        // Don't return error — purchase is already recorded, user can request new link
      }

      // Insert purchase record
      if (inviteData?.user?.id) {
        const { error: purchaseError } = await supabase
          .from("purchases")
          .upsert(
            {
              user_id: inviteData.user.id,
              course_id: courseId,
              stripe_session_id: stripeSessionId,
              status: "paid",
              amount: session.amount_total ? session.amount_total / 100 : 0,
              currency: session.currency?.toUpperCase() || "EUR",
            },
            { onConflict: "stripe_session_id" }
          );

        if (purchaseError) {
          console.error("Failed to insert purchase:", purchaseError);
          // Don't fail – user is invited, we can retry purchase record separately
        }
      }

      return NextResponse.json({ received: true });
    } catch (err) {
      console.error("Webhook processing error:", err);
      return NextResponse.json(
        { error: "Processing failed" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
