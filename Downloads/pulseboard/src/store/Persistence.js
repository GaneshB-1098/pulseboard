"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFavorites } from "./favoritesSlice";
import { setCategories, setDarkMode } from "./preferencesSlice";

export default function Persistence({ children }) {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.ids);
  const categories = useSelector((state) => state.preferences.categories);
  const darkMode = useSelector((state) => state.preferences.darkMode);

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedFavorites = JSON.parse(
        localStorage.getItem("pulseboard-favorites") || "[]"
      );
      const savedCategories = JSON.parse(
        localStorage.getItem("pulseboard-categories") || "null"
      );
      const savedDarkMode = localStorage.getItem("pulseboard-dark-mode");

      if (Array.isArray(savedFavorites)) {
        dispatch(setFavorites(savedFavorites));
      }

      if (
        Array.isArray(savedCategories) &&
        savedCategories.every((item) => typeof item === "string")
      ) {
        dispatch(setCategories(savedCategories));
      }

      if (savedDarkMode !== null) {
        dispatch(setDarkMode(savedDarkMode === "true"));
      }
    } catch (error) {
      console.error("Could not load saved preferences:", error);
    }

    setHydrated(true);
  }, [dispatch]);

  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(
      "pulseboard-favorites",
      JSON.stringify(favorites)
    );
  }, [favorites, hydrated]);

  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(
      "pulseboard-categories",
      JSON.stringify(categories)
    );
  }, [categories, hydrated]);

  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem("pulseboard-dark-mode", String(darkMode));
  }, [darkMode, hydrated]);

  return children;
}