
"use client";

import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Search,
  Heart,
  Sun,
  Moon,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import {
  toggleDarkMode,
  toggleCategory,
} from "@/store/preferencesSlice";
import { toggleFavorite } from "@/store/favoritesSlice";

import {
  useGetNewsQuery,
  useGetMoviesQuery,
} from "@/store/api/contentApi";
import SortableCard from "./components/SortableCard";

const categories = [
  "All",
  "Technology",
  "Business",
  "Sports",
  "Entertainment",
];

function useDebouncedValue(value, delay = 350) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}


function categoryForNews(item) {
  const text = `${item.title} ${item.description}`.toLowerCase();

  if (
    text.includes("sport") ||
    text.includes("cricket") ||
    text.includes("football")
  ) {
    return "Sports";
  }

  if (
    text.includes("business") ||
    text.includes("market") ||
    text.includes("finance")
  ) {
    return "Business";
  }

  if (
    text.includes("movie") ||
    text.includes("film") ||
    text.includes("entertainment")
  ) {
    return "Entertainment";
  }

  return "Technology";
}

export default function Home() {
  const dispatch = useDispatch();

  const favorites = useSelector((state) => state.favorites.ids);
  const dark = useSelector((state) => state.preferences.darkMode);

  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [activePage, setActivePage] = useState("Overview");
  const [clientReady, setClientReady] = useState(false);
  const [orderedIds, setOrderedIds] = useState([]);
  const preferredCategories = useSelector(
  (state) => state.preferences.categories
);
  const debouncedSearch = useDebouncedValue(search);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  useEffect(() => {
    setClientReady(true);
  }, []);

 const newsCategory =
  category === "All"
    ? preferredCategories.find((item) => item !== "Entertainment")?.toLowerCase() || "technology"
    : category.toLowerCase();
    
  const newsQuery = useGetNewsQuery(
    clientReady
      ? {
          category: newsCategory,
          q: debouncedSearch,
        }
      : skipToken
  );

  const movieQuery = useGetMoviesQuery(
    clientReady
      ? {
          q: debouncedSearch,
          page: 1,
        }
      : skipToken
  );

  const newsArticles = (newsQuery.data?.articles || []).map(
    (article, index) => ({
      id: `news:${article.url || article.title || index}`,
      type: "news",
      category: newsCategory,
      title: article.title || "Untitled article",
      description:
        article.description || "Open the article to learn more.",
      image: article.urlToImage || null,
      source: article.source?.name || "News source",
      url: article.url,
      date: article.publishedAt,
    })
  );

  const movies = (movieQuery.data?.results || []).map((movie) => ({
    id: `movie:${movie.id}`,
    type: "movie",
    category: "Entertainment",
    title: movie.title || "Untitled movie",
    description: movie.description || "No description available.",
    image: movie.image || null,
    rating: movie.rating,
    url: movie.url,
    source: "TMDB",
  }));

  const content = [...newsArticles, ...movies];
  
const filteredContent = content.filter((item) => {
  const matchesSearch =
    !debouncedSearch ||
    `${item.title} ${item.description}`
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase());

  const itemInterest =
    item.type === "movie" ? "Entertainment" : categoryForNews(item);

  const matchesCategory =
    category === "All"
      ? preferredCategories.includes(itemInterest)
      : category === "Entertainment"
        ? item.type === "movie"
        : item.type === "news" &&
          itemInterest === category;

  const matchesFavorites =
    activePage !== "Favorites" || favorites.includes(item.id);

  return matchesSearch && matchesCategory && matchesFavorites;
});

  // Apply the user's drag-and-drop order to the visible cards.
  const displayedContent = [...filteredContent].sort((a, b) => {
    const indexA = orderedIds.indexOf(a.id);
    const indexB = orderedIds.indexOf(b.id);

    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const currentIds = displayedContent.map((item) => item.id);
    const oldIndex = currentIds.indexOf(active.id);
    const newIndex = currentIds.indexOf(over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    setOrderedIds(arrayMove(currentIds, oldIndex, newIndex));
  }

  const isLoading =
    !clientReady ||
    newsQuery.isLoading ||
    movieQuery.isLoading;

  const hasError = newsQuery.isError && movieQuery.isError;

  return (
    <main className={dark ? "dashboard dark" : "dashboard light"}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">P</div>
          <span>
            pulseboard<span className="brand-dot">.</span>
          </span>
        </div>

        <p className="nav-heading">WORKSPACE</p>

        {["Overview", "Trending", "Favorites", "Settings"].map((item) => (
          <button
            key={item}
            className={`nav-item ${
              activePage === item ? "active" : ""
            }`}
            onClick={() => setActivePage(item)}
          >
            {item === "Favorites" && <Heart size={18} />}
            {item === "Overview" && "▦"}
            {item === "Trending" && "↗"}
            {item === "Settings" && "⚙"}
            <span>{item}</span>
          </button>
        ))}
      </aside>

      <section className="main-panel">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace / <strong>{activePage}</strong>
          </div>

          <div className="topbar-actions">
            <label className="search-box">
              <Search size={18} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search news and movies..."
                aria-label="Search news and movies"
              />
            </label>

            <button
              className="icon-button"
              onClick={() => dispatch(toggleDarkMode())}
              aria-label="Toggle theme"
            >
              {dark ? <Sun size={19} /> : <Moon size={19} />}
            </button>
          </div>
        </header>

        <div className="content">
          <p className="eyebrow">YOUR PERSONALIZED CONTENT HUB</p>

          <h1>
            {activePage === "Favorites"
              ? "Your favorites"
              : activePage === "Trending"
                ? "Trending now"
                : activePage === "Settings"
                  ? "Your preferences"
                  : "Your world, curated."}
          </h1>

          <p className="page-description">
            Discover the latest news and popular movies in one place.
          </p>

          <div className="stats-row">
            <div className="stat-card">
              <div>
                <span>News articles</span>
                <strong>{newsArticles.length}</strong>
              </div>
            </div>

            <div className="stat-card">
              <div>
                <span>Movies</span>
                <strong>{movies.length}</strong>
              </div>
            </div>

            <div className="stat-card">
              <div>
                <span>Favorites</span>
                <strong>{favorites.length}</strong>
              </div>
            </div>
          </div>

          <div className="section-heading">
            <div>
              <h2>Discover content</h2>
              <p>News and movie recommendations from live APIs</p>
            </div>

            <button
              className="icon-button"
              onClick={() => {
                newsQuery.refetch();
                movieQuery.refetch();
              }}
              aria-label="Refresh content"
              title="Refresh content"
              disabled={!clientReady}
            >
              <RefreshCw size={17} />
            </button>
          </div>

          <div className="category-list feed-categories">
            {categories.map((item) => (
              <button
                key={item}
                className={`category-chip ${
                  category === item ? "selected" : ""
                }`}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        {activePage === "Settings" && (
  <section className="preferences-panel">
    <h2>Your interests</h2>
    <p>Select topics you'd like to follow.</p>

    {["Technology", "Business", "Sports", "Entertainment"].map(
      (item) => (
        <label key={item} className="preference-option">
          <input
            type="checkbox"
            checked={preferredCategories.includes(item)}
            onChange={() => dispatch(toggleCategory(item))}
          />
          {item}
        </label>
      )
    )}
  </section>
)}
          {isLoading && (
            <div className="empty-state" role="status">
              Loading your content...
            </div>
          )}

          {hasError && !isLoading && (
            <div className="empty-state" role="alert">
              <h3>We couldn't load your content</h3>
              <p>Check your API configuration and try again.</p>
              <button
                className="primary-button"
                onClick={() => {
                  newsQuery.refetch();
                  movieQuery.refetch();
                }}
              >
                Retry
              </button>
            </div>
          )}

          {!isLoading &&
            !hasError &&
            displayedContent.length === 0 && (
              <div className="empty-state">
                <h3>No content found</h3>
                <p>Try another search or category.</p>
                <button
                  className="primary-button"
                  onClick={() => {
                    setSearch("");
                    setCategory("All");

                    if (activePage === "Favorites") {
                      setActivePage("Overview");
                    }
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}

          {!isLoading && !hasError && displayedContent.length > 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={displayedContent.map((item) => item.id)}
                strategy={rectSortingStrategy}
              >
                <div className="content-grid">
                  {displayedContent.map((item) => {
                    const isFavorite = favorites.includes(item.id);

                    return (
                      <SortableCard key={item.id} id={item.id}>
                        <article className="content-card">
                          <div className="card-image-wrap">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt=""
                                className="card-image"
                                loading="lazy"
                              />
                            ) : (
                              <div className="image-placeholder">
                                {item.type === "movie" ? "MOVIE" : "NEWS"}
                              </div>
                            )}

                            <span className="content-type">
                              {item.type === "movie" ? "Movie" : "News"}
                            </span>

                            <button
                              className={`favorite-button ${
                                isFavorite ? "favorited" : ""
                              }`}
                              onClick={() =>
                                dispatch(toggleFavorite(item.id))
                              }
                              aria-label={
                                isFavorite
                                  ? "Remove from favorites"
                                  : "Add to favorites"
                              }
                            >
                              <Heart
                                size={18}
                                fill={
                                  isFavorite ? "currentColor" : "none"
                                }
                              />
                            </button>
                          </div>

                          <div className="card-body">
                            <div className="card-meta">
                              <span>{item.source}</span>
                              {item.rating != null && (
                                <span>
                                  ★ {Number(item.rating).toFixed(1)}
                                </span>
                              )}
                            </div>

                            <h3>{item.title}</h3>
                            <p>{item.description}</p>

                            {item.url ? (
                              <a
                                className="read-more"
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Read more <ExternalLink size={15} />
                              </a>
                            ) : (
                              <span className="read-more">
                                No external link
                              </span>
                            )}
                          </div>
                        </article>
                      </SortableCard>
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>
          )}

          <p className="page-description">
            Movie data provided by TMDB. News availability depends on your
            API provider and plan.
          </p>
        </div>
      </section>
    </main>
  );
}
