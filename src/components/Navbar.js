import React, { useEffect, useState } from "react";
// import horz_data from "../data/horz_chart";
import axios from "axios";
import Loader from "./Loader";

let sprint_data_map = {};

const live_base_url = "https://srdp-mobius-apis.onrender.com";
// const live_base_url = "http://localhost:4000";

function Navbar({
  sprint,
  setSprint,
  setSprintStart,
  setSprintEnd,
  setView,
  boardId,
  boardName,
}) {
  const [options, setOptions] = useState([]);
  const [sprintsLoading, setSprintsLoading] = useState(false);

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
    <nav className="custom-navbar">
      <div className="dashboard-name">
        {boardName} - SPRINT REVIEW DASHBOARD
      </div>
      <div className="sprint-select-container">
        <div id="selector">
          <div>Sprints</div>
          {sprintsLoading ? (
            <Loader />
          ) : (
            <select
              name="sprints"
              id="sprints"
              onChange={(e) => {
                setSprint(e.target.value.toString());
                setSprintStart(
                  sprint_data_map[e.target.value.toString()].sprint_start
                );
                setSprintEnd(
                  sprint_data_map[e.target.value.toString()].sprint_end
                );
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
          )}
        </div>
        <button
          className="btn btn-danger"
          onClick={() => {
            setView("landing");
          }}
        >
          go back
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
