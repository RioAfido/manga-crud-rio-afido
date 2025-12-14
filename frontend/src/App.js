import React from "react";
import SearchManga from "./SearchManga";
import MyList from "./MyList";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <h1>Aplikasi Manga Sederhana — (Rio Afido)</h1>
      <SearchManga />
      <hr className="divider" />
      <MyList />
    </div>
  );
}

export default App;