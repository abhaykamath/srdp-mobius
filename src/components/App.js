import React, { useEffect, useState } from "react";
import "../styles/RightPane.css";
import axios from "axios";
import {
  get_sprint_stories_2,
  get_status_category_data_for_stories_4,
} from "../aqs/aq_urls";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import stories_data from "../data/stories";
import pie_data from "../data/pie_data";
import horz_data from "../data/horz_chart";

function App() {
  const [project, setProject] = useState("10235");
  const [stories, setStories] = useState([]);
  const [sprint, setSprint] = useState("");
  const [storyToView, setStoryToView] = useState("");
  const [pieData, setPieData] = useState([]);

  const [horizontalBarChartData, setHorizontalBarChartData] = useState({
    labels: horz_data
      .filter((d) => d.project_id.includes(project))
      .map((d) => d.story_name.substring(0, 25) + "..."),
    datasets: [
      {
        label: "Progress Percentage",
        data: horz_data
          .filter((d) => d.project_id.includes(project))
          .map((d) => d.progress_percentage),
        backgroundColor: ["#4285F4", "#34A853", "#FBBC05", "#EA4335"],
      },
    ],
  });

  const [storyPieData, setStoryPieData] = useState({
    labels: pieData
      .filter((d) => d.project_id.includes(project))
      .filter((d) => d.story_id.includes(storyToView))
      .map((d) => d.status_category),
    datasets: [
      {
        label: "Progress Percentage",
        data: pieData
          .filter((d) => d.project_id.includes(project))
          .filter((d) => d.story_id.includes(storyToView))
          .map((d) => d.issue_count),
        backgroundColor: ["#4285F4", "#34A853", "#FBBC05", "#EA4335"],
      },
    ],
  });

  function getStories() {
    // axios.get(get_sprint_stories_2).then((res) => {
    //   let entities = res.data.model.entities;
    //   setStories(entities);
    // });
    setStories(stories_data);
  }

  function getStatusCategoryData() {
    // axios.get(get_status_category_data_for_stories_4).then((res) => {
    //   let entities = res.data.model.entities;
    //   setPieData(entities);
    // });
    // This is for for pie chart
    setPieData(pie_data);
  }

  useEffect(() => {
    getStories();
    getStatusCategoryData();
  }, []);

  return (
    <>
      <nav className="custom-navbar">
        <div className="dashboard-name">SPRINT REVIEW DASHBOARD</div>
        <div className="project-name">
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
      <main>
        {/* <div className="sprint-name">Sprint : {sprint}</div> */}
        <section id="left-pane">
          <div
            style={{
              backgroundColor: "#36b37e",
              width: "fit-content",
              padding: "0.25rem 0.5rem",
              borderRadius: "0.5rem",
            }}
          >
            STORIES
          </div>
          {stories
            .filter((story) => {
              return story.project_id === project;
            })
            .map((story, index) => {
              return (
                <div
                  key={index}
                  className="story-pill"
                  onClick={(e) => {
                    setStoryToView(story.story_id);
                    setStoryPieData({
                      labels: pieData
                        .filter((d) => d.project_id.includes(project))
                        .filter((d) => d.story_id.includes(story.story_id))
                        .map((d) => d.status_category),
                      datasets: [
                        {
                          label: "Progress Percentage",
                          data: pieData
                            .filter((d) => d.project_id.includes(project))
                            .filter((d) => d.story_id.includes(story.story_id))
                            .map((d) => d.issue_count),
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
                >
                  <div className="story-name">
                    <div>
                      <i className="fa-solid fa-bookmark"></i>
                    </div>
                    {story.story_name}
                  </div>
                  <div className="story-status-label">{story.story_status}</div>
                </div>
              );
            })}
        </section>
        <section id="right-pane">
          <div className="horizontal-chart-container">
            <div>Progress of stories</div>
            <div className="horizontal-chart-canvas-container">
              <BarChart chartData={horizontalBarChartData} />
            </div>
          </div>

          <div className="cards-grid">
            <div className="pie-chart-container">
              <div>Sub-task Progress</div>
              <PieChart chartData={storyPieData} />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
