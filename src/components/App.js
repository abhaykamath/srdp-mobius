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
import Navbar from "./Navbar";
import StoriesPane from "./StoriesPane";
import Members from "./Members";

function App() {
  const [project, setProject] = useState("10235");
  const [stories, setStories] = useState([]);
  const [sprint, setSprint] = useState("");
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
      .filter((d) => d.story_id.includes(""))
      .map((d) => d.status_category),
    datasets: [
      {
        label: "Subtask Count",
        data: pieData
          .filter((d) => d.project_id.includes(project))
          .filter((d) => d.story_id.includes(""))
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
      <Navbar
        setProject={setProject}
        setHorizontalBarChartData={setHorizontalBarChartData}
      />
      <main>
        <StoriesPane
          stories={stories}
          project={project}
          setStoryPieData={setStoryPieData}
          pieData={pieData}
        />
        <section id="right-pane">
          <div className="horizontal-chart-container">
            <div
              style={{
                boxSizing: "border-box",
                display: "flex",
                paddingBottom: "0.5rem",
                justifyContent: "space-between",
              }}
            >
              <div>Progress of stories</div>
              <div>Project Memebers</div>
            </div>
            <div className="horizontal-chart-canvas-container">
              <BarChart chartData={horizontalBarChartData} />
              <Members project={project} />
            </div>
          </div>
          <div className="cards-grid">
            <div className="other-cards">
              <div className="story-ac-card">
                <div>Story AC Hygiene</div>
                <table>
                  <tr>
                    <td>AC Added ?</td>
                    <td>NO</td>
                  </tr>
                </table>
              </div>
              <div className="story-ac-card">
                <div>Effort Estimate</div>
                <table>
                  <tr>
                    <td>Story points</td>
                    <td>NO</td>
                  </tr>
                </table>
              </div>
              <div className="story-ac-card">
                <div>On-Time Predictability</div>
                <table>
                  <tr>
                    <td>Total Subtasks</td>
                    <td>NO</td>
                  </tr>
                  <tr>
                    <td>Completed Subtasks</td>
                    <td>NO</td>
                  </tr>
                  <tr>
                    <td>Sprint Start</td>
                    <td>NO</td>
                  </tr>
                  <tr>
                    <td>Sprint End</td>
                    <td>NO</td>
                  </tr>
                </table>
              </div>
              <div className="story-ac-card">
                <div>Time log info</div>
                <table>
                  <tr>
                    <td>Original Estimate</td>
                    <td>NO</td>
                  </tr>
                  <tr>
                    <td>Remaining Estimate</td>
                    <td>NO</td>
                  </tr>
                  <tr>
                    <td>Time spent</td>
                    <td>NO</td>
                  </tr>
                </table>
              </div>
            </div>
            <div className="pie-chart-container">
              <div>Subtasks status</div>
              <PieChart chartData={storyPieData} />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
