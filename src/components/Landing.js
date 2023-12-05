import React, { useEffect, useRef, useState } from "react";
import "../styles/Landing.css";
import axios from "axios";

// const boards = [
//   { board_name: "MOB board", board_id: "1" },
//   { board_name: "PM board", board_id: "4" },
//   { board_name: "UX Work", board_id: "199" },
//   { board_name: "RR board", board_id: "215" },
//   { board_name: "L3AAS board", board_id: "82" },
//   { board_name: "OCS board", board_id: "91" },
//   { board_name: "MCDS board", board_id: "205" },
//   { board_name: "Marketplace", board_id: "150" },
//   { board_name: "PLED board", board_id: "135" },
//   { board_name: "COE Sprint4", board_id: "202" },
//   { board_name: "IOS board", board_id: "203" },
//   { board_name: "TechWarriors Sprint 6", board_id: "140" },
//   { board_name: "MAYA board", board_id: "79" },
//   { board_name: "HM board", board_id: "80" },
//   { board_name: "CES Development Sprint Board", board_id: "84" },
//   { board_name: "UI dev (JS)", board_id: "6" },
//   { board_name: "UI Development board 3", board_id: "86" },
//   { board_name: "scrum board - NAB", board_id: "90" },
//   { board_name: "Sprint 2", board_id: "68" },
//   { board_name: "Sprint 2", board_id: "61" },
//   { board_name: "GP board", board_id: "78" },
//   { board_name: "PILT board", board_id: "102" },
//   { board_name: "Testing Team Board", board_id: "71" },
//   { board_name: "Green - Lime", board_id: "164" },
//   { board_name: "test pilot", board_id: "107" },
//   { board_name: "Pilot srum test", board_id: "123" },
//   { board_name: "UMP board", board_id: "138" },
//   { board_name: "Designer Tool", board_id: "170" },
//   { board_name: "MAV", board_id: "141" },
//   { board_name: "COE", board_id: "194" },
//   { board_name: "MP-Sprint-3", board_id: "187" },
//   { board_name: "Adwize", board_id: "167" },
//   { board_name: "Platform Ops", board_id: "169" },
//   { board_name: "DS board", board_id: "185" },
//   { board_name: "MP Sprint-4", board_id: "195" },
//   { board_name: "Backend Services Sprint Board", board_id: "186" },
//   { board_name: "MP-Sprint-4", board_id: "191" },
//   { board_name: "CDP board", board_id: "193" },
//   { board_name: "MP", board_id: "196" },
//   { board_name: "Sprint 0", board_id: "74" },
//   { board_name: "MSUDeployments", board_id: "179" },
//   { board_name: "AT board", board_id: "81" },
//   { board_name: "SHAPE-SCRUM", board_id: "133" },
//   { board_name: "VIS board", board_id: "117" },
//   { board_name: "ATSC1 board", board_id: "153" },
//   { board_name: "Green SeaWeed", board_id: "163" },
//   { board_name: "Red Team - Deep Solutions", board_id: "155" },
//   { board_name: "Blue Team - Integrations", board_id: "162" },
//   { board_name: "Olive sprint 3", board_id: "168" },
//   { board_name: "Sprint Board", board_id: "76" },
//   { board_name: "NCS board", board_id: "128" },
//   { board_name: "Pitcher", board_id: "97" },
//   { board_name: "CP", board_id: "98" },
//   { board_name: "Green Olive", board_id: "124" },
//   { board_name: "Jarvis", board_id: "144" },
//   { board_name: "Sprint 1", board_id: "69" },
//   { board_name: "UI development board - sprint 2", board_id: "70" },
//   { board_name: "CES Scrum Board", board_id: "83" },
//   { board_name: "Green Pickle", board_id: "115" },
//   { board_name: "Android TV/App", board_id: "114" },
//   { board_name: "DEV board", board_id: "125" },
//   { board_name: "Design Sprint 2", board_id: "257" },
//   { board_name: "SUP board", board_id: "244" },
//   { board_name: "Moscribe ", board_id: "251" },
//   { board_name: "FE board", board_id: "252" },
//   { board_name: "DAT board", board_id: "253" },
//   { board_name: "MU board", board_id: "258" },
//   { board_name: "Monet Scrum Board", board_id: "259" },
//   { board_name: "PCPF board", board_id: "276" },
//   { board_name: "BU board", board_id: "280" },
//   { board_name: "MIAS board", board_id: "281" },
//   { board_name: "MPE Scrum Board", board_id: "255" },
//   { board_name: "MPI board", board_id: "260" },
//   { board_name: "MBOB board", board_id: "261" },
//   { board_name: "MMONET board", board_id: "262" },
//   { board_name: "MHCY board", board_id: "263" },
//   { board_name: "MVINCI board", board_id: "264" },
//   { board_name: "MSRE board", board_id: "266" },
//   { board_name: "MBS board", board_id: "267" },
//   { board_name: "MIE board", board_id: "282" },
//   { board_name: "M3IN1 board", board_id: "272" },
//   { board_name: "MSUHAAAS board", board_id: "275" },
//   { board_name: "SRD board", board_id: "283" },
//   { board_name: "Kathy's view ", board_id: "265" },
//   { board_name: "VB board", board_id: "268" },
//   { board_name: "MON2 board", board_id: "269" },
//   { board_name: "PQA board", board_id: "271" },
// ];

function Landing({ setBoardId, setView, setBoardName }) {
  const [allboards, setAllboards] = useState([]);
  const searchInputRef = useRef();
  const [searchTerm, setSearchTerm] = useState("");
  const all_boards_AQ =
    "https://ig.aidtaas.com/tf-web/v1.0/64e1fd3d1443eb00018cc231/analytic-queries/65696b3e19b2493ebae3094d/data?size=1000";

  async function getBoardsData() {
    const response = await axios.get(`${all_boards_AQ}`);
    const all_boards_data = response.data.model.entities;
    const scrumBoards = all_boards_data.filter(
      (board) => board.board_type === "scrum"
    );
    if (allboards.length <= 0) setAllboards(scrumBoards);
  }
  // console.log(allboards.length);

  // To filter the Searched boards by Board name
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredBoards = allboards.filter((board) => {
    const lowerCaseName = (board.board_name || "").toLowerCase();
    const lowerCaseId = (board.board_id || "").toString().toLowerCase();

    return (
      lowerCaseName.includes(searchTerm.toLowerCase()) ||
      lowerCaseId.includes(searchTerm.toLowerCase())
    );
  });

  // To make board names show in alphabetical odrer
  // To make board names show in alphabetical order
  filteredBoards.sort((a, b) => {
    const nameA = (a.board_name || "").toLowerCase();
    const nameB = (b.board_name || "").toLowerCase();

    return nameA.localeCompare(nameB);
  });

  // console.log(filteredBoards, "filterd");

  useEffect(() => {
    getBoardsData();

    // Auto-focus on the search input when the component mounts
    searchInputRef.current.focus();
  }, []);

  return (
    <>
      <div className="landing-page-header">JIRA Boards</div>
      <div className="searc_div">
        <input
          className="search_bar"
          type="text"
          placeholder="Search by Board name..."
          value={searchTerm}
          onChange={handleChange}
          ref={searchInputRef}
        />
      </div>
      <div className="boards-header">Boards ({filteredBoards.length})</div>
      <div className="boards-container">
        {filteredBoards.map((board, index) => {
          return (
            <div
              key={index}
              className="board-card"
              onClick={(e) => {
                setBoardId(board.board_id);
                setBoardName(board.board_name);
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
