import React, { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import Landing from "./Landing";

function App() {
  const [boardId, setBoardId] = useState("269");
  const [boardName, setBoardName] = useState("");
  const [view, setView] = useState("landing");
  return (
    <>
      {view === "landing" ? (
        <Landing
          setBoardName={setBoardName}
          setBoardId={setBoardId}
          setView={setView}
        />
      ) : (
        <Dashboard boardName={boardName} boardId={boardId} setView={setView} />
      )}
    </>
  );
}

export default App;
