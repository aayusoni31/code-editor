import React from "react";

// The instructor fetches these dynamically, but hardcoding the most common ones
// is much faster and cleaner for a MERN app!
const LANGUAGES = [
  { id: "javascript", name: "JavaScript" },
  { id: "python", name: "Python" },
  { id: "java", name: "Java" },
  { id: "cpp", name: "C++" },
  { id: "html", name: "HTML" },
  { id: "css", name: "CSS" },
  { id: "json", name: "JSON" },
  { id: "sql", name: "SQL" },
];

export function LanguageSelector({ language, onLanguageChange }) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-zinc-400">Language:</label>
      <select
        value={language}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="bg-zinc-900 text-zinc-100 border border-zinc-700 rounded-md px-3 py-1.5 text-sm outline-none focus:border-blue-500 transition-colors cursor-pointer"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.id} value={lang.id}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}
