import { NextResponse } from "next/server";

const fallbackQuotes = [
  {
    text: "The mind is like a parachute — it works best when open.",
    author: "Ghani Khan",
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    text: "Imagination is more important than knowledge.",
    author: "Albert Einstein",
  },
  {
    text: "The best way to predict the future is to invent it.",
    author: "Alan Kay",
  },
  {
    text: "Code is like humor. When you have to explain it, it's bad.",
    author: "Cory House",
  },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  {
    text: "First, solve the problem. Then, write the code.",
    author: "John Johnson",
  },
  {
    text: "The art of programming is the art of organizing complexity.",
    author: "Edsger Dijkstra",
  },
];

export async function GET() {
  try {
    const res = await fetch("https://zenquotes.io/api/random", {
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error("API failed");

    const data = await res.json();
    if (Array.isArray(data) && data.length > 0 && data[0].q && data[0].a) {
      return NextResponse.json({ text: data[0].q, author: data[0].a });
    }

    throw new Error("Invalid response format");
  } catch {
    const quote =
      fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    return NextResponse.json(quote);
  }
}
