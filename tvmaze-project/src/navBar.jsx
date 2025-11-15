import { useState } from "react";
import React from "react";
import "./index.css";

export default function NavBar({ onSearch, onToggleList }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setQuery("");
    }
  };

  return (
    <nav className="nav-bar">
      <div className="nav-BarContainer">
        <h1 className="nav-barTitle">Tv Maze Finder</h1>
        <form onSubmit={handleSubmit} className="nav-BarForm">
          <input type="text" placeholder="Buscar serie" value={query} onChange={(e) => setQuery(e.target.value)} className="nav-BarInput" />
          <button type="submit" className="nav-BarButton"> Buscar</button>
          <button type="button" onClick={onToggleList} className="nav-FavButton"> ❤️ </button>
        </form>
      </div>
    </nav>
  );
}
