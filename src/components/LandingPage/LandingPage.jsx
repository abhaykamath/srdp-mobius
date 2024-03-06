import React, { useEffect, useRef, useState } from "react";
import {
    BsTrash,
    BsSuitHeart,
    BsSuitHeartFill,
    BsPieChart,
    BsPieChartFill,
} from "react-icons/bs";
import data from './Data'
import PieChart from "../PieChart";
import css from './LandingPage.module.scss'
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { color } from "d3";
import Loader from "../Loader";
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

let sprint_data_map = {};
const live_base_url = "https://srdp-mobius-apis.onrender.com";

function LandingPage({ setBoardId, setView, setBoardName }) {
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

    const filteredBoards = allboards.filter((board) => {
    // const filteredBoards = data.filter((board) => {
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

    useEffect(() => { }, [landingPieData]);


    return (
        <>
            <div className={css.mainContainer}>
                <div className={css.headContainer}>
                    <h1>
                        JIRA Boards
                    </h1>
                    <div className={css.searchDiv}>
                        <button className={css.btnPrimary} onClick={() => navigate("/daily-status")}>Daily Status</button>
                        <input
                            className={css.searchBar}
                            type="text"
                            placeholder="Search by Board name..."
                            value={searchTerm}
                            onChange={handleChange}
                            ref={searchInputRef}
                        />
                        <button className={css.btnSuccess} onClick={handleClearClick}>
                            Clear
                        </button>
                    </div>
                    <div className={css.boardsHeader}>
                        All Boards ({filteredBoards.length})
                    </div>
                </div>

                <div className={css.boardsContainer}>
                    {filteredBoards.map((board, index) => {
                        const isBoardFavorited = favboards.some(
                            (favBoard) => favBoard.board_id === board.board_id
                        );

                        return (

                            <div
                                key={index}
                                className={`${css.boardCard} ${expandedBoard === board.board_id ? css.expanded : ''}`}
                                onClick={(e) => {
                                    handleCick(board.board_id, board.board_name, "dashboard");
                                }}
                            >
                                <div>
                                    <span
                                        className={css.favIconChart}
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
                                                <div className={css.piechart}>
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
                                        className={css.favIcon}
                                        onClick={(e) => handleFavClick(e, board)}
                                    >
                                        {isBoardFavorited ? (
                                            <BsSuitHeartFill style={{ color: "#A367B1" }} />
                                        ) : (
                                            <BsSuitHeart style={{ color: "#A367B1" }} />
                                        )}
                                    </span>
                                </div>
                                <p>{board.board_name}</p>
                            </div>
                        );
                    })}
                </div>

                <div className={css.favHeader}>Summary Dashboards ({favboards.length})</div>
                <div className={css.favContainer}>
                    {favboards.map((board, index) => {
                        return (
                            <div
                                key={index}
                                className={css.favCard}
                                onClick={(e) => {
                                    handleCick(board.board_id, board.board_name, "dashboard");
                                }}
                            >
                                <span
                                    className={css.favIcon}
                                    onClick={(e) => handleDeleteClick(e, board)}
                                >
                                    <BsTrash style={{ color: "#392467" }} />
                                </span>
                                <p>{board.board_name}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

        </>
    );
}

export default LandingPage;
