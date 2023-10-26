import React from "react";
import "../styles/Landing.css";

const boards = [
  { board_name: "MONET2.0", board_id: "269" },
  { board_name: "VINCI BOB", board_id: "268" },
  { board_name: "MSUHAaaS", board_id: "275" },
];

function Landing({ setBoardId, setView }) {
  return (
    <>
      <div className="landing-page-header">Sprint Review Dashboards</div>
      <div className="boards-header">Boards</div>
      <div className="boards-container">
        {boards.map((board, index) => {
          return (
            <div
              key={index}
              className="board-card"
              onClick={(e) => {
                setBoardId(board.board_id);
                setView("dashboard");
              }}
            >
              {board.board_name}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Landing;
