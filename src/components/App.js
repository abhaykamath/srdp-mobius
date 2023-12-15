import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import Landing from "./Landing";
import Comment from "./Comment";

function App() {
  const [boardId, setBoardId] = useState("");
  const [boardName, setBoardName] = useState("");
  const [view, setView] = useState("landing");

  // const LandingElement = (
  //   <Landing
  //     setBoardName={setBoardName}
  //     setBoardId={setBoardId}
  //     setView={setView}
  //   ></Landing>
  // );

  return (
    <>
      {/* <Router>
        <Routes>
       
          <Route
            path="/board"
            element={
              <Landing
                setBoardName={setBoardName}
                setBoardId={setBoardId}
                setView={setView}
              />
            }
          />
          <Route
            path={`/dashboard/:boardId/:boardName`}
            element={
              <Dashboard
                setView={setView}
              />
            }
          />
        </Routes>
      </Router> */}
      
      <Comment/>
    </>
  );
}

export default App;
