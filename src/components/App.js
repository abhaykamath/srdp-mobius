import React, { useEffect, useState } from "react";
import "../styles/RightPane.css";
import axios from "axios";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import pie_data from "../data/pie_data";
import horz_data from "../data/horz_chart";
import Navbar from "./Navbar";
import StoriesPane from "./StoriesPane";
import Members from "./Members";

const local_base_url = "http://localhost:4000";
const live_base_url = "https://srdp-mobius-apis.onrender.com";

function App() {
  const [project, setProject] = useState("10235");
  const [stories, setStories] = useState([]);
  const [sprint, setSprint] = useState("");
  const [sprintMembers, setSprintMembers] = useState([]);
  const [sprintStart, setSprintStart] = useState("");
  const [sprintEnd, setSprintEnd] = useState("");
  const [hChartData, setHChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [storyId, setStoryId] = useState("");
  const [storyAC, setStoryAC] = useState("Nil");
  const [storyPoints, setStoryPoints] = useState(0);
  const [otp, setOtp] = useState({
    number_of_sub_tasks: 0,
    completed_sub_tasks: 0,
  });
  const [timeLogData, setTimeLogData] = useState({
    remaining_estimate: 0,
    original_estimate: 0,
    time_spent: 0,
  });
  const [storyReviewers, setStoryReviewers] = useState("Nil");

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
        `${live_base_url}/sprint/${sprint}/stories`
      );
      const sprint_stories = response.data.issues;
      setStories(sprint_stories);
    }
  }

  async function getSprintMembers() {
    if (sprint !== "") {
      const response = await axios.get(
        `${live_base_url}/sprint/${sprint}/members`
      );
      const sprint_members = response.data.members;
      setSprintMembers(sprint_members);
    }
  }

  async function getHorzChartData() {
    if (sprint !== "") {
      const response = await axios.get(
        `${live_base_url}/sprint/${sprint}/progress`
      );
      const h_chart_data = response.data.sprint_progress;
      setHChartData(h_chart_data);
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
        `${live_base_url}/sprint/${sprint}/subtasks/progress`
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

  function updateStoryPoints() {
    if (sprint !== "") {
      const points = hChartData.filter((s) => s.story_id === storyId)[0]
        .story_points;
      setStoryPoints(points);
    }
  }

  function updateOtp() {
    if (sprint !== "") {
      const { number_of_sub_tasks, completed_sub_tasks } = hChartData.filter(
        (s) => s.story_id === storyId
      )[0];
      setOtp({ number_of_sub_tasks, completed_sub_tasks });
    }
  }

  function updateTimeLogData() {
    if (sprint !== "") {
      const { remaining_estimate, original_estimate, time_spent } =
        stories.filter((s) => s.story_id === storyId)[0];
      setTimeLogData({
        original_estimate,
        remaining_estimate,
        time_spent,
      });
    }
  }

  function updateStoryReviewers() {
    if (sprint !== "") {
      const reviewers = stories.filter((s) => s.story_id === storyId)[0]
        .story_reviewers;
      setStoryReviewers(reviewers);
    }
  }

  useEffect(() => {
    getStories();
    getHorzChartData();
    getPieChartData();
    getSprintMembers();
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
    updateStoryPoints();
    updateOtp();
    updateTimeLogData();
    updateStoryReviewers();
  }, [storyId]);

  return (
    <>
      <Navbar
        setProject={setProject}
        setSprint={setSprint}
        setSprintStart={setSprintStart}
        setSprintEnd={setSprintEnd}
      />
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
              <Members sprintMembers={sprintMembers} />
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
              <div className="story-ac-card">
                <div>Effort Estimate</div>
                <table>
                  <tr>
                    <td>Story points</td>
                    <td>
                      {storyPoints !== 0 ? storyPoints : "Points not added"}
                    </td>
                  </tr>
                </table>
              </div>
              <div className="story-ac-card">
                <div>On-Time Predictability</div>
                <table>
                  <tr>
                    <td>Total Subtasks</td>
                    <td>{otp.number_of_sub_tasks}</td>
                  </tr>
                  <tr>
                    <td>Completed Subtasks</td>
                    <td>{otp.completed_sub_tasks}</td>
                  </tr>
                  <tr>
                    <td>Sprint Start</td>
                    <td>{sprintStart.substring(0, 10)}</td>
                  </tr>
                  <tr>
                    <td>Sprint End</td>
                    <td>{sprintEnd.substring(0, 10)}</td>
                  </tr>
                </table>
              </div>
              <div className="story-ac-card">
                <div>Time log info</div>
                <table>
                  <tr>
                    <td>Original Estimate</td>
                    <td>{timeLogData.original_estimate}</td>
                  </tr>
                  <tr>
                    <td>Remaining Estimate</td>
                    <td>{timeLogData.remaining_estimate}</td>
                  </tr>
                  <tr>
                    <td>Time spent</td>
                    <td>{timeLogData.time_spent}</td>
                  </tr>
                </table>
              </div>
              <div className="story-ac-card">
                <div>Peer review info</div>
                <table>
                  <tr>
                    <td>Reviewers</td>
                    <td>{storyReviewers}</td>
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
