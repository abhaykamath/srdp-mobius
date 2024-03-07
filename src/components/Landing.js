import React, { useEffect, useRef, useState } from "react";
import {
  BsTrash,
  BsSuitHeart,
  BsSuitHeartFill,
  BsPieChart,
  BsPieChartFill,
} from "react-icons/bs";
import PieChart from "./PieChart";
import "../styles/Landing.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { color } from "d3";
import Loader from "./Loader";
import data from "./LandingPage/Data";

let sprint_data_map = {};
const live_base_url = "https://srdp-mobius-apis.onrender.com";

function Landing({ setBoardId, setView, setBoardName }) {
  const [allboards, setAllboards] = useState([]);
  const searchInputRef = useRef();
  const [searchTerm, setSearchTerm] = useState("");
  const [showPieChart, setShowPieChart] = useState(false);
  const [boardId_pie, setBoardId_pie] = useState();
  const [landingPieData, setLandingPieData] = useState({});
  const [storydata, setStorydata] = useState();
  const [sprint, setSprint] = useState("");
  const [pieData, setPieData] = useState([]);
  const [isPieChartVisible, setIsPieChartVisible] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [expandedBoard, setExpandedBoard] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const hoverTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const boardWorkflowId = 82;
  const sprintWorkflowId = 70506;

  // const f_data =
  // const workFlowApi = `https://dev-workflowdesigner.gaiansolutions.com/api/wf/64e1fd3d1443eb00018cc231/execute/${boardWorkflowId}?env=TEST`;

  // Boards AQ
  const all_boards_AQ =
    "https://ig.aidtaas.com/pi-bigquery-service/v1.0/big-queries/65e19b89c7d70117c9910ea7/data?size=1000";
  const token =
    "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImZmOGYxNjhmLTNmZjYtNDZlMi1iMTJlLWE2YTdlN2Y2YTY5MCJ9.eyJzdWIiOiJnYWlhbi5jb20iLCJ1c2VyX25hbWUiOiJwb3J0YWxfdGVzdCIsInNjb3BlIjpbInRydXN0IiwicmVhZCIsIndyaXRlIl0sInRlbmFudElkIjoiNjExYmRkMzQyNmE5NDg2MDA1NjkzYjExIiwiaXNzIjoiZ2FpYW4uY29tIiwidXNlck5hbWUiOiJwb3J0YWxfdGVzdCIsImF1dGhvcml0aWVzIjpbIlJPTEVfT01OSV9DT05TVU1FUiIsIlJPTEVfTUFSS0VUUExBQ0VfVVNFUiIsIlJPTEVfT01OSV9VU0VSIl0sImp0aSI6IjgxODE1ZDNmLTY1MTAtNDJkNC05NWZkLTNiZTJmMWYzYjg5ZiIsImVtYWlsIjoicG9ydGFsX3Rlc3RAZ2F0ZXN0YXV0b21hdGlvbi5jb20iLCJjbGllbnRfaWQiOiJnYWlhbiJ9.Mz1gWLt1rujlQWW3SzuwtERk1i6HwG9utVuMUnL-RX4kKtR1jl0eR9MZmNjRZ0znbrr6w8MOj2aAULtpIEYmM9jU_mXGBuqetPIbTuV2d4Hkv6f0qaJZLAIAU3qhgijQI9O4a2yg_rmHnibNhEcZMKEFK5AXw8M_B8XIgnNYlXDkpjEqP6Siv0HJmHA3T1j1XY8PCsluzIwDzIgRr-xqAJcaCnUwGR7XxsF-X0plk8L9qV1Z3bF2EMqqBsednYeqaM3EqwJXk27R5PFU7jn5aOc-_n9DxaGLcuJB5JoqoGW7DeaIKLzMwxvS9vP_bc8vDOxl8xk-zTRAq8goyHV6IQ";

  async function triggerWorkflow() {
    // console.log("Before making API call");
    var body = {
      ownerId: "65d331209d55420001aa7c79",
    };
    try {
      const formData = new FormData();
      const response = await axios.post(
        `https://bob-workflowdesigner.aidtaas.com/api/wf/execute/${boardWorkflowId}?sync=false&env=TEST`,
        {
          ownerId: "65d331209d55420001aa7c79",
        },

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
            accept: "*/*",
          },
        }
      );

      // console.log("API call success", response);
    } catch (error) {
      console.error("API call error", error);
    }
  }

  async function triggerWorkflowSprint(key, value) {
    try {
      const formData = new FormData();
      formData.append(key, value);

      const response = await axios.post(
        `https://dev-workflowdesigner.gaiansolutions.com/api/wf/64e1fd3d1443eb00018cc231/execute/${sprintWorkflowId}?env=TEST`,
        formData,
        {},
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // console.log("API call success", response);
    } catch (error) {
      console.error("API call error", error);
    }
  }

  //  PieData
  function handlePieData(id) {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowLoader(true);
      setBoardId_pie(id);
      // console.log(id);

      if (id) {
        async function getLastSprints() {
          // setSprintsLoading(true);
          const response = await axios.get(
            live_base_url + "/" + id + "/allSprints"
          );
          if (response.data.length > 0) {
            const all_sprints = response.data.filter(
              (sprint) => sprint.state !== "future"
            );
            for (let sprint of all_sprints) {
              sprint_data_map[sprint.id.toString()] = {
                sprint_start: sprint.startDate.substring(0, 10),
                sprint_end: sprint.endDate.substring(0, 10),
              };
            }
            let default_sprint;
            const active_sprint = all_sprints.filter(
              (sprint) => sprint.state === "active"
            );
            if (active_sprint.length === 0) {
              let closed_sprints = all_sprints.filter(
                (sprint) => sprint.state === "closed"
              );
              default_sprint =
                closed_sprints.length > 0
                  ? closed_sprints[closed_sprints.length - 1]
                  : { id: "" };
            } else {
              default_sprint = active_sprint[0];
            }

            setSprint(default_sprint.id ? default_sprint.id : "");
            let pie_chart_data;
            if (default_sprint.id !== "") {
              const response = await axios.get(
                `${live_base_url}/sprint/${default_sprint.id}/subtasks/progress`
              );
              pie_chart_data = response.data.values;
              if (pie_chart_data.length > 0) {
                setPieData(pie_chart_data);
              } else {
                setPieData(["nodata"]);
              }
            } else {
              setPieData([]);
              pie_chart_data = [];
            }
            let piedata = new Map();

            pie_chart_data.forEach((d) => {
              if (piedata.has(d.status_category_name)) {
                piedata.set(
                  d.status_category_name,
                  piedata.get(d.status_category_name) + d.issue_count
                );
                setStorydata(
                  piedata.set(
                    d.status_category_name,
                    piedata.get(d.status_category_name) + d.issue_count
                  )
                );
              } else {
                piedata.set(d.status_category_name, d.issue_count);
                setStorydata(
                  piedata.set(d.status_category_name, d.issue_count)
                );
              }
            });
            if (piedata.size === 0) {
              piedata.set("NO Subtask", "0");
            }
            // console.log(piedata, "piedata");
            setLandingPieData({
              labels: Array.from(piedata.keys()),
              datasets: [
                {
                  label: "Subtask Count",
                  data: Array.from(piedata.values()),
                  backgroundColor: [
                    "#4285F4",
                    "#FBBC05",
                    "#34A853",
                    "#EA4335",
                    "#DA0C81",
                  ],
                },
              ],
            });
          }
        }
        getLastSprints();

        // console.log(landingPieData);
        // console.log(piedata, "piedata");
      }
    }, 1000);
    // event.stopPropagation();
  }

  async function getBoardsData() {
    const response = await axios.get(`${all_boards_AQ}`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    const all_boards_data = response.data.model.entities;
    // const all_boards_data = response_data.map((board) => {
    //   return {
    //     board_id: board["entity.id"],
    //     board_name: board["entity.name"],
    //     board_type: board["entity.type"],
    //   };
    // });
    const scrumBoards = all_boards_data.filter(
      (board) => board.board_type === "scrum" && board.board_name != null
    );
    const uniqueBoardId = new Set();

    // Use filter to remove duplicates based on board_id
    const uniqueBoards = scrumBoards.filter((board) => {
      // If the board_id is not in the Set, add it and include the board in the result
      if (!uniqueBoardId.has(board.board_id)) {
        uniqueBoardId.add(board.board_id);
        return true;
      }
      // If the board_id is already in the Set, exclude the board from the result
      return false;
    });

    if (allboards.length <= 0) {
      setAllboards(uniqueBoards);
    }
    // console.log(uniqueBoards, "Allboards");
  }

  // favourites
  const [favboards, setFavboards] = useState([]);

  // Summmary board
  const [summary_boards, setSummary_boards] = useState({});
  const [delete_boards, setDelete_boards] = useState();

  async function get_summmary_dashboard() {
    // var body = [summary_boards];
    try {
      const response = await axios.get(
        "https://ig.aidtaas.com/tf-entity-ingestion/v1.0/schemas/65e5a9cef1e0ce18934d8de3/instances/list?size=1000",

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
            accept: "*/*",
          },
        }
      );
      setFavboards(response.data.entities);
      console.log("API get", response);
    } catch (error) {
      console.error("API call error", error);
    }
  }
  async function post_summmary_dashboard() {
    var body = [summary_boards];
    try {
      const response = await axios.post(
        `https://ig.aidtaas.com/tf-entity-ingestion/v1.0/schemas/65e5a9cef1e0ce18934d8de3/instances?upsert=true`,
        body,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
            accept: "*/*",
          },
        }
      );
      get_summmary_dashboard();

      console.log("API call success", response);
    } catch (error) {
      console.error("API call error", error);
    }
  }

  async function delete_summmary_dashboard() {
    var body = delete_boards;

    try {
      const response = await axios.delete(
        "https://ig.aidtaas.com/tf-entity-ingestion/v1.0/schemas/65e5a9cef1e0ce18934d8de3/instances",
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
            Accept: "*/*",
          },
          data: body,
        }
      );
      get_summmary_dashboard();
      console.log("API call success", response);
    } catch (error) {
      console.error("API call error", error);
    }
  }

  const handleFavClick = (event, board, id, name, type) => {
    setSummary_boards({
      board_id: board.board_id,
      board_name: board.board_name,
      board_type: board.board_type,
    });

    event.stopPropagation();
  };
  // console.log(summary_boards, "summary_boards");

  // To filter the Searched boards by Board name
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClearClick = () => {
    setSearchTerm("");
    searchInputRef.current.focus();
  };

  const handleDeleteClick = (event, board, id, name) => {
    // Prevent the event from propagating to the board header
    event.stopPropagation();
    // console.log("DELETE CALLED");
    setDelete_boards((prev) => ({ board_id: board.board_id }));
  };

  useEffect(() => {
    post_summmary_dashboard();
  }, [summary_boards]);

  useEffect(() => {
    console.log("delete id : ", delete_boards);
    delete_summmary_dashboard();
    // get_summmary_dashboard();
  }, [delete_boards]);

  function handleCick(id, name, event, board) {
    // console.log("handleCick called with:", id, name);

    setBoardId(id);
    // console.log(id, "=> board_id");
    setBoardName(name);
    setView("dashboard");
    navigate(`/dashboard/${id}/${name}`);

    // console.log("Before making API call");

    const dynamicKey = "board_id";
    const dynamicValue = id;

    triggerWorkflowSprint(dynamicKey, dynamicValue);
  }

  // const filteredBoards = allboards.filter((board) => {
  const filteredBoards = data.filter((board) => {
    const lowerCaseName = (board.board_name || "").toLowerCase();
    const lowerCaseId = (board.board_id || "").toString().toLowerCase();

    return (
      lowerCaseName.includes(searchTerm.toLowerCase()) ||
      lowerCaseId.includes(searchTerm.toLowerCase())
    );
  });

  // To make board names show in alphabetical odrer
  filteredBoards.sort((a, b) => {
    const nameA = (a.board_name || "").toLowerCase();
    const nameB = (b.board_name || "").toLowerCase();

    return nameA.localeCompare(nameB);
  });

  // console.log(filteredBoards, "filterd");

  useEffect(() => {
    triggerWorkflow();
    getBoardsData();
    get_summmary_dashboard();

    // Auto-focus on the search input when the component mounts
    searchInputRef.current.focus();
  }, []);

  useEffect(() => {}, [landingPieData]);

  return (
    <>
      <div className="main-container">
        <div className="head-container">
          <div className="landing-page-header">JIRA Boards</div>
          <Link to={"/daily-status"}>
            <button className="btn btn-primary">Daily Status</button>
          </Link>
          <div className="search_div">
            <input
              className="search_bar"
              type="text"
              placeholder="Search by Board name..."
              value={searchTerm}
              onChange={handleChange}
              ref={searchInputRef}
            />
            <button className="btn btn-success" onClick={handleClearClick}>
              Clear
            </button>
          </div>
        </div>

        <div className="boards-header">
          All Boards ({filteredBoards.length})
        </div>

        <div className="boards-container">
          {favboards.map((board, index) => {
            const isBoardFavorited = favboards.some(
              (favBoard) => favBoard.board_id === board.board_id
            );

            return (
              <div>
                <div
                  key={index}
                  className={`board-card ${
                    expandedBoard === board.board_id ? "expanded" : ""
                  }`}
                  onClick={(e) => {
                    handleCick(board.board_id, board.board_name, "dashboard");
                  }}
                >
                  <span
                    className="fav-icon-chart"
                    style={{ zIndex: 1000 }}
                    onMouseEnter={() => {
                      setIsPieChartVisible(true);
                      handlePieData(board.board_id);
                      setExpandedBoard(board.board_id);
                    }}
                    onMouseLeave={() => {
                      setShowLoader(false);
                      setIsPieChartVisible(false);
                      setExpandedBoard(null);
                      setLandingPieData({});
                      clearTimeout(hoverTimeoutRef.current);
                    }}
                  >
                    <BsPieChart />
                    <div>
                      {boardId_pie === board.board_id && isPieChartVisible ? (
                        <div className="piechart">
                          {landingPieData.datasets &&
                          landingPieData.datasets.length > 0 ? (
                            <PieChart chartData={landingPieData} />
                          ) : (
                            <div>{showLoader && <Loader />}</div>
                          )}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </span>
                  <span
                    className="fav-icon"
                    onClick={(e) =>
                      handleFavClick(
                        e,
                        board,
                        board.board_id,
                        board.board_name,
                        board.board_type
                      )
                    }
                  >
                    {isBoardFavorited ? (
                      <BsSuitHeartFill style={{ color: "#034694" }} />
                    ) : (
                      <BsSuitHeart style={{ color: "#034694" }} />
                    )}
                  </span>
                  {board.board_name}
                </div>
              </div>
            );
          })}
        </div>

        <div className="fav-header">
          Summary Dashboards ({favboards.length})
        </div>
        <div className="fav-container">
          {favboards.map((board, index) => {
            return (
              <div
                key={index}
                className="board-card"
                onClick={(e) => {
                  handleCick(board.board_id, board.board_name, "dashboard");
                }}
              >
                <span className="fav-icon">
                  <BsTrash
                    style={{ color: "red" }}
                    onClick={(e) =>
                      handleDeleteClick(
                        e,
                        board,
                        board.board_id,
                        board.board_name
                      )
                    }
                  />
                </span>
                <div>{board.board_name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Landing;
