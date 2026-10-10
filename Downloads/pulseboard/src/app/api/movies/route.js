import { NextResponse } from "next/server";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("q")?.trim();
    const pageParam = Number(searchParams.get("page") || 1);
    const page = Number.isFinite(pageParam)
      ? Math.min(Math.max(Math.floor(pageParam), 1), 500)
      : 1;

    const token = process.env.TMDB_ACCESS_TOKEN;

    if (!token) {
      return NextResponse.json(
        { message: "TMDB access token is not configured." },
        { status: 500 }
      );
    }

    const endpoint = query ? "search/movie" : "movie/popular";
    const url = new URL(`${TMDB_BASE_URL}/${endpoint}`);

    url.searchParams.set("language", "en-US");
    url.searchParams.set("page", String(page));

    if (query) {
      url.searchParams.set("query", query);
      url.searchParams.set("include_adult", "false");
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.error("TMDB request failed:", response.status);

      return NextResponse.json(
        {
          message:
            response.status === 401
              ? "TMDB authentication failed. Check your access token."
              : response.status === 429
                ? "Too many movie requests. Please try again shortly."
                : "Unable to fetch movies from TMDB.",
        },
        { status: response.status === 429 ? 429 : 502 }
      );
    }

    const data = await response.json();

    const movies = (data.results || []).map((movie) => ({
      id: movie.id,
      type: "movie",
      title: movie.title || "Untitled movie",
      description: movie.overview || "No description available.",
      image: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null,
      rating: movie.vote_average ?? null,
      releaseDate: movie.release_date || null,
      url: `https://www.themoviedb.org/movie/${movie.id}`,
      category: "Entertainment",
    }));

    return NextResponse.json({
      results: movies,
      page: data.page || page,
      totalPages: data.total_pages || 0,
      totalResults: data.total_results || 0,
    });
  }   catch (error) {
  console.error("TMDB error details:", {
    name: error?.name,
    message: error?.message,
    cause: error?.cause,
  });

  return NextResponse.json(
    { message: "Unable to connect to TMDB. Check the server terminal." },
    { status: 502 }
  );
}

}