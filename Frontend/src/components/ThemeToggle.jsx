import React from "react";
import { useTheme } from "../context/useTheme.js";

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`
        group
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-xl
        border
        border-black/10
        bg-white/60
        text-base
        shadow-sm
        backdrop-blur-md
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:scale-105
        hover:bg-white
        hover:shadow-lg

        dark:border-white/10
        dark:bg-white/5
        dark:hover:bg-white/10
        ${className}
      `}
    >
      <span className="transition-transform duration-300 group-hover:rotate-12">
        {theme === "dark" ? "☀️" : "🌙"}
      </span>
    </button>
  );
};

export default ThemeToggle;
