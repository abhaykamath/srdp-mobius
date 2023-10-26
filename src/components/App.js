import React, { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import Landing from "./Landing";

function App() {
  const [boardId, setBoardId] = useState("269");
  const [view, setView] = useState("landing");
  return (
    <>
      {view === "landing" ? (
        <Landing setBoardId={setBoardId} setView={setView} />
      ) : (
        <Dashboard boardId={boardId} setView={setView} />
      )}
    </>
  );
}

export default App;
