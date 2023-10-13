import React, { useEffect, useState } from "react";
import "../styles/RightPane.css";
import axios from "axios";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
// import stories_data from "../data/stories";
import pie_data from "../data/pie_data";
import horz_data from "../data/horz_chart";
import points_data from "../data/points";
import onTimePredictability from "../data/on_time_pred";
import time_log from "../data/time_log_data";
import reviewers from "../data/story_reviewers";
import Navbar from "./Navbar";
import StoriesPane from "./StoriesPane";
import Members from "./Members";

function App() {
  const [project, setProject] = useState("10235");
  const [stories, setStories] = useState([]);
  const [sprint, setSprint] = useState("");
  const [pieData, setPieData] = useState([]);
  const [storyId, setStoryId] = useState("");
  const [storyAC, setStoryAC] = useState("Nil");

  const [horizontalBarChartData, setHorizontalBarChartData] = useState({
    labels: horz_data
      .filter((d) => d.project_id.includes(project))
      .map((d) => d.story_name.substring(0, 25) + "..."),
    datasets: [
      {
        label: "Progress Percentage",
        data: horz_data
          .filter((d) => d.project_id.includes(project))
          .map((d) => {
            if (d.number_of_sub_tasks !== 0) {
              return parseInt(
                (d.completed_sub_tasks / d.number_of_sub_tasks) * 100
              );
            } else {
              return 0;
            }
          }),
        backgroundColor: [
          "#4285F4",
          "#34A853",
          "#FBBC05",
          "#EA4335",
          "#DA0C81",
        ],
      },
    ],
  });

  const [storyPieData, setStoryPieData] = useState({
    labels: pie_data
      .filter((d) => d.project_id.includes(project))
      .filter((d) => d.story_id.includes(""))
      .map((d) => d.status_category),
    datasets: [
      {
        label: "Subtask Count",
        data: pie_data
          .filter((d) => d.project_id.includes(project))
          .filter((d) => d.story_id.includes(""))
          .map((d) => d.issue_count),
        backgroundColor: [
          "#4285F4",
          "#34A853",
          "#FBBC05",
          "#EA4335",
          "#DA0C81",
        ],
      },
    ],
  });

  async function getStories() {
    if (sprint !== "") {
      const response = await axios.get(
        `http://localhost:4000/sprint/${sprint}/stories`
      );
      const sprint_stories = response.data.issues;
      setStories(sprint_stories);
    }
  }

  async function getHorzChartData() {
    if (sprint !== "") {
      const response = await axios.get(
        `http://localhost:4000/sprint/${sprint}/progress`
      );
      const h_chart_data = response.data.sprint_progress;
      setHorizontalBarChartData({
        labels: h_chart_data.map((d) => d.story_name.substring(0, 25) + "..."),
        datasets: [
          {
            label: "Progress Percentage",
            data: h_chart_data.map((d) => {
              if (d.number_of_sub_tasks !== 0) {
                return parseInt(
                  (d.completed_sub_tasks / d.number_of_sub_tasks) * 100
                );
              } else {
                return 0;
              }
            }),
            backgroundColor: [
              "#4285F4",
              "#34A853",
              "#FBBC05",
              "#EA4335",
              "#DA0C81",
            ],
          },
        ],
      });
    }
  }

  async function getPieChartData() {
    if (sprint !== "") {
      const response = await axios.get(
        `http://localhost:4000/sprint/${sprint}/subtasks/progress`
      );
      const pie_chart_data = response.data.values;
      setPieData(pie_chart_data);
    }
  }

  function updateStoryAC() {
    if (sprint !== "") {
      const AC = stories.filter((s) => s.story_id === storyId)[0]
        .story_ac_hygiene;
      setStoryAC(AC);
    }
  }

  useEffect(() => {
    getStories();
    getHorzChartData();
    getPieChartData();
  }, [sprint]);

  useEffect(() => {
    setStoryPieData({
      labels: pieData
        .filter((d) => d.story_id.includes(storyId))
        .map((d) => d.status_category_name),
      datasets: [
        {
          label: "Subtask Count",
          data: pieData
            .filter((d) => d.story_id.includes(storyId))
            .map((d) => d.issue_count),
          backgroundColor: [
            "#4285F4",
            "#34A853",
            "#FBBC05",
            "#EA4335",
            "#DA0C81",
          ],
        },
      ],
    });
    updateStoryAC();
  }, [storyId]);

  return (
    <>
      <Navbar setProject={setProject} setSprint={setSprint} />
      <main>
        <StoriesPane
          stories={stories}
          project={project}
          setStoryId={setStoryId}
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
                    <td>{storyAC}</td>
                  </tr>
                </table>
              </div>
              {/* <div className="story-ac-card">
                <div>Effort Estimate</div>
                <table>
                  <tr>
                    <td>Story points</td>
                    <td>
                      {
                        points_data.filter((s) =>
                          s.story_id.includes(storyId)
                        )[0].story_total_points
                      }
                    </td>
                  </tr>
                </table>
              </div> */}
              {/* <div className="story-ac-card">
                <div>On-Time Predictability</div>
                <table>
                  <tr>
                    <td>Total Subtasks</td>
                    <td>
                      {
                        onTimePredictability.filter((o) =>
                          o.story_id.includes(storyId)
                        )[0].number_of_sub_tasks
                      }
                    </td>
                  </tr>
                  <tr>
                    <td>Completed Subtasks</td>
                    <td>
                      {
                        onTimePredictability.filter((o) =>
                          o.story_id.includes(storyId)
                        )[0].completed_sub_tasks
                      }
                    </td>
                  </tr>
                  <tr>
                    <td>Sprint Start</td>
                    <td>
                      {onTimePredictability
                        .filter((o) => o.story_id.includes(storyId))[0]
                        .sprint_start_date.substring(0, 10)}
                    </td>
                  </tr>
                  <tr>
                    <td>Sprint End</td>
                    <td>
                      {onTimePredictability
                        .filter((o) => o.story_id.includes(storyId))[0]
                        .sprint_end_date.substring(0, 10)}
                    </td>
                  </tr>
                </table>
              </div> */}
              {/* <div className="story-ac-card">
                <div>Time log info</div>
                <table>
                  <tr>
                    <td>Original Estimate</td>
                    <td>
                      {
                        time_log.filter((t) => t.story_id.includes(storyId))[0]
                          .original_estimate
                      }
                    </td>
                  </tr>
                  <tr>
                    <td>Remaining Estimate</td>
                    <td>
                      {
                        time_log.filter((t) => t.story_id.includes(storyId))[0]
                          .remaining_estimate
                      }
                    </td>
                  </tr>
                  <tr>
                    <td>Time spent</td>
                    <td>
                      {
                        time_log.filter((t) => t.story_id.includes(storyId))[0]
                          .time_spent
                      }
                    </td>
                  </tr>
                </table>
              </div> */}
              {/* <div className="story-ac-card">
                <div>Peer review info</div>
                <table>
                  <tr>
                    <td>Reviewers</td>
                    <td>
                      {
                        reviewers.filter((t) => t.story_id.includes(storyId))[0]
                          .story_reviewers
                      }
                    </td>
                  </tr>
                </table>
              </div> */}
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
