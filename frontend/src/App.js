import React from "react";
import SearchManga from "./SearchManga";
import MyList from "./MyList";

function App() {
  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: 12 }}>
      <h1>Aplikasi Manga Sederhana — (Rio Afido)</h1>
      <SearchManga />
      <hr style={{ margin: "20px 0" }} />
      <MyList />
    </div>
  );
}

export default App;