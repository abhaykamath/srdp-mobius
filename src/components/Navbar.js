import React from "react";
import horz_data from "../data/horz_chart";

function Navbar({ setProject, setHorizontalBarChartData }) {
  return (
    <nav className="custom-navbar">
      <div className="dashboard-name">SPRINT REVIEW DASHBOARD</div>
      <div className="project-name">
        <div>Projects</div>
        <div className="form-check">
          <input
            class="form-check-input"
            type="radio"
            name="flexRadioDefault"
            id="flexRadioDefault1"
            value="10235"
            onClick={(e) => {
              setProject(e.target.value);
              setHorizontalBarChartData({
                labels: horz_data
                  .filter((d) => d.project_id.includes(e.target.value))
                  .map((d) => d.story_name.substring(0, 25) + "..."),
                datasets: [
                  {
                    label: "Progress Percentage",
                    data: horz_data
                      .filter((d) => d.project_id.includes(e.target.value))
                      .map((d) => d.progress_percentage),
                    backgroundColor: [
                      "#4285F4",
                      "#34A853",
                      "#FBBC05",
                      "#EA4335",
                    ],
                  },
                ],
              });
            }}
          />
          <label className="form-check-label" for="flexRadioDefault1">
            Monet 2.0
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="flexRadioDefault"
            id="flexRadioDefault2"
            value="10234"
            onClick={(e) => {
              setProject(e.target.value);
              setHorizontalBarChartData({
                labels: horz_data
                  .filter((d) => d.project_id.includes(e.target.value))
                  .map((d) => d.story_name.substring(0, 25) + "..."),
                datasets: [
                  {
                    label: "Progress Percentage",
                    data: horz_data
                      .filter((d) => d.project_id.includes(e.target.value))
                      .map((d) => d.progress_percentage),
                    backgroundColor: [
                      "#4285F4",
                      "#34A853",
                      "#FBBC05",
                      "#EA4335",
                    ],
                  },
                ],
              });
            }}
          />
          <label className="form-check-label" for="flexRadioDefault2">
            Vinci-Bob
          </label>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
