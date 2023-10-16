import React from "react";
// import horz_data from "../data/horz_chart";
import axios from "axios";

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

const local_base_url = "http://localhost:4000";
const live_base_url = "https://srdp-mobius-apis.onrender.com";

function Navbar({
  setProject,
  setSprint,
  setSprintStart,
  setSprintEnd,
  setStoriesLoading,
}) {
  return (
    <nav className="custom-navbar">
      <div className="dashboard-name">SPRINT REVIEW DASHBOARD</div>
      <div className="project-name">
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
      </div>
    </nav>
  );
}

export default Navbar;
