import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "technology";
  const query = searchParams.get("q");
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { message: "News API key is missing" },
      { status: 500 }
    );
  }

  const allowedCategories = [
    "technology",
    "business",
    "sports",
    "entertainment",
  ];

  const safeCategory = allowedCategories.includes(category.toLowerCase())
    ? category.toLowerCase()
    : "technology";

  const url = new URL("https://newsapi.org/v2/everything");
  url.searchParams.set(
    "q",
    query || safeCategory
  );
  url.searchParams.set("language", "en");
  url.searchParams.set("pageSize", "12");
  url.searchParams.set("sortBy", "publishedAt");

  try {
    const response = await fetch(url, {
      headers: { "X-Api-Key": apiKey },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "News provider returned an error" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "Unable to connect to the news service" },
      { status: 502 }
    );
  }
}