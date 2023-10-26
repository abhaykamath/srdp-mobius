import React, { useEffect, useState } from "react";
// import horz_data from "../data/horz_chart";
import axios from "axios";
import Loader from "./Loader";

// Project board map
const project_board_map = {
  10235: 269,
  10234: 268,
  10241: 275,
};

const projects = [
  ["Monet 2.0", "10235"],
  ["Vinci-Bob", "10234"],
  ["SUHAaaS", "10241"],
];

let sprint_data_map = {};

const local_base_url = "http://localhost:4000";
// const live_base_url = "https://srdp-mobius-apis.onrender.com";
const live_base_url = "http://localhost:4000";

function Navbar({
  setProject,
  setSprint,
  setSprintStart,
  setSprintEnd,
  setStoriesLoading,
}) {
  const [options, setOptions] = useState([]);
  const [sprintsLoading, setSprintsLoading] = useState(false);

  async function getSprints() {
    setSprintsLoading(true);
    const response = await axios.get(
      live_base_url + "/" + "269" + "/allSprints"
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
    console.log(sprint_data_map);
    const active_sprint_id = all_sprints.filter(
      (sprint) => sprint.state === "active"
    )[0].id;
    setSprint(active_sprint_id.toString());
    setSprintStart(sprint_data_map[active_sprint_id.toString()].sprint_start);
    setSprintEnd(sprint_data_map[active_sprint_id.toString()].sprint_end);
    setOptions(all_sprints);
    setSprintsLoading(false);
  }

  useEffect(() => {
    getSprints();
  }, []);

  return (
    <nav className="custom-navbar">
      <div className="dashboard-name">MONET 2.0 - SPRINT REVIEW DASHBOARD</div>
      {/* <div className="project-name">
        <div>Projects</div>
        {projects.map((p) => {
          return (
            <div className="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
                value={p[1]}
                onClick={async (e) => {
                  setProject(e.target.value);
                  const board_id = project_board_map[e.target.value];
                  setStoriesLoading(true);
                  const response = await axios.get(
                    live_base_url + "/" + board_id + "/activeSprint"
                  );
                  const active_sprint = response.data.active_sprint;
                  setSprintStart(active_sprint.startDate);
                  setSprintEnd(active_sprint.endDate);
                  if (active_sprint !== null) {
                    setSprint(active_sprint.id.toString());
                  }
                }}
              />
              <label className="form-check-label" for="flexRadioDefault1">
                {p[0]}
              </label>
            </div>
          );
        })}
      </div> */}
      <div className="sprint-select-container">
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
                  selected={opt.state === "active"}
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
    </nav>
  );
}

export default Navbar;
