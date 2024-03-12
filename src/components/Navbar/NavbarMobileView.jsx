import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader";
import css from "./NavbarMobileView.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { SrdpContext } from "../../Context/SrdpContext";
import Select from "react-select";

let sprint_data_map = {};

const live_base_url = "https://srdp-mobius-apis.onrender.com";
// const live_base_url = "http://localhost:4000";

const NavbarMobileView = ({ sprint,
    setSprint,
    setSprintStart,
    setSprintEnd,
    setView,
    boardId,
    boardName,
    stories,
    member, }) => {
    const [options, setOptions] = useState([]);
    const [sprintsLoading, setSprintsLoading] = useState(false);
    const { expandNav,setExpandNav } = useContext(SrdpContext)
    const navigate = useNavigate()
//    const customSelectStyles = {
//     control: (baseStyles, state) => ({
//       ...baseStyles,
//       boxShadow: "none",
//       height: "5vh",
//       ":hover": {
//         borderColor: "rgb(159, 132, 253,1) !important",
        
//       },
//       cursor: "pointer",
//     }),
//     option: (provided, state) => ({
//       ...provided,
//       backgroundColor: state.isSelected
//         ? "#9F84FD"
//         : state.isFocused
//         ? "rgb(159, 132, 253,0.3)"
//         : "",
//       ":active": {
//         backgroundColor: "rgb(159, 132, 253,0.7)",
//         color: "#ffffff",
//       },
//     }),
//   };

    if (member !== "All Members") {
        stories = stories.filter((story) => story.assignee == member);
    }
    const calculateStoryPoints = (story_status) => {
        const filteredTasks = stories.filter(
            (story) => story.story_status === story_status
        );
        const totalStoryPoints = filteredTasks.reduce(
            (sum, story) => sum + story.story_points,
            0
        );
        return totalStoryPoints;
    };

    const totalStoryPoints = stories.reduce(
        (sum, story) => sum + story.story_points,
        0
    );

    // if()
    const todoStoryPoints = calculateStoryPoints("To Do");
    const inProgressStoryPoints = calculateStoryPoints("In Progress");
    const doneStoryPoints = calculateStoryPoints("Done");

    const toDo_percentage = parseInt((todoStoryPoints / totalStoryPoints) * 100);
    const in_progress_percentage = parseInt(
        (inProgressStoryPoints / totalStoryPoints) * 100
    );
    const done_percentage = parseInt((doneStoryPoints / totalStoryPoints) * 100);

    async function getSprints() {
        setSprintsLoading(true);
        const response = await axios.get(
            live_base_url + "/" + boardId + "/allSprints"
        );
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
            default_sprint = closed_sprints[closed_sprints.length - 1];
        } else {
            default_sprint = active_sprint[0];
        }
        setSprint(default_sprint.id.toString());
        setSprintStart(sprint_data_map[default_sprint.id.toString()].sprint_start);
        setSprintEnd(sprint_data_map[default_sprint.id.toString()].sprint_end);
        setOptions(all_sprints);
        setSprintsLoading(false);
    }

    useEffect(() => {
        getSprints();
    }, []);
    return (
        <nav className={`${expandNav ? css.expandedNav : css.closedNav} ${css.navContainer}`}>
            <div className={css.backplate1}></div>
            <div className={css.backplate2}></div>
            <div className={css.backplate3}></div>
            <div className={css.mainPlate}>
                <div className={css.navItems}>
                    <h1>Sprints</h1>
                    <div>
                        {sprintsLoading ? (
                            <Loader />
                        ) : (
                            <select
                                name="sprints"
                                id="sprints"
                                onChange={(e) => {
                                    setSprint(e.target.value.toString());
                                    setSprintStart(sprint_data_map[e.target.value.toString()].sprint_start);
                                    setSprintEnd(sprint_data_map[e.target.value.toString()].sprint_end);
                                }}
                            >
                                {options.map((opt, index) => {
                                    return (
                                        <option
                                            key={index}
                                            selected={opt.id.toString() === sprint}
                                            value={opt.id}
                                        >
                                            <div>{opt.state.toUpperCase()}</div>
                                            {" - "}
                                            <div>{opt.name}</div>
                                        </option>
                                    );
                                })}
                                </select>
                                // <Select
                                //     className={css.select}
                                //     name="sprints"
                                //     id="sprints"
                                //     onChange={(selectedOption) => {
                                //         setSprint(selectedOption.value.toString());
                                //         setSprintStart(sprint_data_map[selectedOption.value.toString()].sprint_start);
                                //         setSprintEnd(sprint_data_map[selectedOption.value.toString()].sprint_end);
                                //     }}
                                //     value={options.find(opt => opt.id.toString() === sprint)}
                                //     options={options.map(opt => ({
                                //         value: opt.id.toString(), // Ensure value is a string
                                //         label: `${opt.state.toUpperCase()} - ${opt.name}` // Use string interpolation for label
                                //     }))}
                                // />

                        )}
                    </div>
                    <div className={css.totalStoryPoints}>
                        Total Storypoints : {totalStoryPoints}
                    </div>
                    <div className={css.toDo}>
                        To Do : {todoStoryPoints} ({toDo_percentage}%)
                    </div>
                    <div className={css.inProgress}>
                        In Progress : {inProgressStoryPoints} ({in_progress_percentage}%)
                    </div>
                    <div className={css.done}>
                        Done : {doneStoryPoints} ({done_percentage}%)
                    </div>
                </div>
                <div className={css.buttonsCont}>
                    <button className={`${css.btn} ${css.btnPrimary}`}
                        onClick={() => {
                            navigate("/daily-status");
                            setExpandNav(!expandNav)
                        }}
                    >Daily Status</button>
                    <button
                        className={`${css.btn} ${css.btnDanger}`}
                        onClick={() => {
                            setView("landing");
                            navigate('/');
                            setExpandNav(!expandNav)

                        }}
                    >
                        go back
                    </button>
                </div>
            </div>
        </nav>

    )
}

export default NavbarMobileView