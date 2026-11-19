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

      // Check if user already exists
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existingUser = existingUsers?.users?.find(
        (u) => u.email === customerEmail
      );

      let userId: string;

      if (existingUser) {
        userId = existingUser.id;
      } else {
        // Create new user with a random password (they'll set their own via magic link)
        const { data: newUser, error: createError } =
          await supabase.auth.admin.createUser({
            email: customerEmail,
            email_confirm: true,
            user_metadata: {
              source: "stripe_purchase",
            },
          });

        if (createError || !newUser.user) {
          console.error("Failed to create user:", createError);
          return NextResponse.json(
            { error: "Failed to create user" },
            { status: 500 }
          );
        }
        userId = newUser.user.id;
      }

      // Insert purchase record
      const { error: purchaseError } = await supabase
        .from("purchases")
        .upsert(
          {
            user_id: userId,
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
        // Don't fail – user is created, we can retry purchase record separately
      }

      // Send magic link / invite email so user can log in
      const domain =
        process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";

      const { error: magicLinkError } = await supabase.auth.admin.generateLink({
        type: "magiclink",
        email: customerEmail,
        options: {
          redirectTo: `${domain}/auth/callback?next=/portal`,
        },
      });

      if (magicLinkError) {
        console.error("Failed to send magic link:", magicLinkError);
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
