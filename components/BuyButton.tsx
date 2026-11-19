"use client";

interface BuyButtonProps {
  courseId: string;
  label?: string;
  className?: string;
}

export default function BuyButton({
  courseId,
  label = "Jetzt kaufen",
  className,
}: BuyButtonProps) {
  async function handleBuy() {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Fehler beim Erstellen der Zahlung. Bitte versuche es erneut.");
    }
  }

  return (
    <button
      onClick={handleBuy}
      className={
        className ||
        "px-6 py-3 bg-[#417970] text-white font-semibold rounded hover:bg-[#355f57] transition-colors"
      }
    >
      {label}
    </button>
  );
}
