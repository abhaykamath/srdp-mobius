import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import StoriesPane from "./StoriesPane";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import StoryAC from "./Cards/StoryAC";
import EffortEstimate from "./Cards/EffortEstimate";
import PeerReviewInfo from "./Cards/PeerReviewInfo";
import OnTimePredictability from "./Cards/OnTimePredictability";
import TimeLogInfo from "./Cards/TimeLogInfo";
import Members from "./Members";
import "../styles/RightPane.css";

const live_base_url = "https://srdp-mobius-apis.onrender.com";
// const live_base_url = "http://localhost:4000";

function Dashboard({ boardName, boardId, setView }) {
  const [project, setProject] = useState("10235");
  const [stories, setStories] = useState([]);
  const [storiesLoading, setStoriesLoading] = useState(false);
  const [sprint, setSprint] = useState("");
  const [sprintMembers, setSprintMembers] = useState([]);
  const [sprintStart, setSprintStart] = useState("");
  const [sprintEnd, setSprintEnd] = useState("");
  const [hChartData, setHChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [storyId, setStoryId] = useState("");
  const [storyAC, setStoryAC] = useState("Nil");
  const [totalStoryPoints, setTotalStoryPoints] = useState(0);
  const [storyPoints, setStoryPoints] = useState(0);
  const [apiCount, setApiCount] = useState(0);
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

  const [horizontalBarChartData, setHorizontalBarChartData] = useState({});

  const [storyPieData, setStoryPieData] = useState({});

  async function getStories() {
    if (sprint !== "") {
      setStoriesLoading(true);
      const response = await axios.get(
        `${live_base_url}/sprint/${sprint}/stories`
      );

      const sprint_stories = response.data.issues;

      // sorting by todo, inprogress, done
      const storyOrder = ["To Do", "In Progress", "Done"];
      const sprint_Stories_Sorted = (a, b) => {
        return (
          storyOrder.indexOf(a.story_status) -
          storyOrder.indexOf(b.story_status)
        );
      };

      const stories_for_sprint = sprint_stories.sort(sprint_Stories_Sorted);

      setStories(stories_for_sprint);
      setStoriesLoading(false);
      setApiCount((prev) => prev + 1);
    }
  }

  async function getSprintMembers() {
    if (sprint !== "") {
      const response = await axios.get(
        `${live_base_url}/sprint/${sprint}/members`
      );
      const sprint_members = response.data.members;
      setSprintMembers(sprint_members);
      setApiCount((prev) => prev + 1);
    }
  }

  async function getHorzChartData() {
    if (sprint !== "") {
      const response = await axios.get(
        `${live_base_url}/sprint/${sprint}/progress`
      );
      const h_chart_data = response.data.sprint_progress;

      // sorting by todo, inprogress, done
      const storyOrder = ["To Do", "In Progress", "In Dev", "Dev In Progress", "Development", "Code Review", "Done"];
      const sprint_Stories_Sorted = (a, b) => {
        return (
          storyOrder.indexOf(a.story_status) -
          storyOrder.indexOf(b.story_status)
        );
      };

      const h_chart_data_sorted = h_chart_data.sort(sprint_Stories_Sorted);

      updateTotalStoryPoints(h_chart_data_sorted);
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
      setApiCount((prev) => prev + 1);
    }
  }

  async function getPieChartData() {
    if (sprint !== "") {
      const response = await axios.get(
        `${live_base_url}/sprint/${sprint}/subtasks/progress`
      );
      const pie_chart_data = response.data.values;
      setPieData(pie_chart_data);
      setApiCount((prev) => prev + 1);
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

  function updateTotalStoryPoints(sprint_progress_data) {
    if (sprint !== "") {
      let points = 0;
      for (let sprint of sprint_progress_data) {
        points += sprint.story_points;
      }
      setTotalStoryPoints(points);
    }
  }

  if (apiCount == 4) {
    setStoryId(stories[0].story_id);
    setApiCount(0);
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
    // console.log(pieData.filter((d) => d.story_id.includes(storyId)));
  }, [storyId]);
  return (
    <>
      <Navbar
        setProject={setProject}
        sprint={sprint}
        setSprint={setSprint}
        setSprintStart={setSprintStart}
        setSprintEnd={setSprintEnd}
        setStoriesLoading={setStoriesLoading}
        setView={setView}
        boardId={boardId}
        boardName={boardName}
        totalStoryPoints={totalStoryPoints}
      />
      <main>
        <StoriesPane
          stories={stories}
          setStoryId={setStoryId}
          storiesLoading={storiesLoading}
          storyId={storyId}
        />
        <section id="right-pane">
          <div className="horizontal-chart-container grid-item grid-item-1">
            <div className="header">Sprint progress</div>
            <div className="horizontal-chart-canvas-container">
              {hChartData.length !== 0 ? (
                <BarChart chartData={horizontalBarChartData} />
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="pie-chart-container grid-item grid-item-2">
            <div className="header">Subtasks status</div>
            <div className="horizontal-chart-canvas-container">
              {pieData.length !== 0 ? (
                <PieChart chartData={storyPieData} />
              ) : (
                "NO Subtask"
              )}
            </div>
          </div>
          <StoryAC storyAC={storyAC} />
          <EffortEstimate storyPoints={storyPoints} />
          <PeerReviewInfo storyReviewers={storyReviewers} />
          <OnTimePredictability
            otp={otp}
            sprintStart={sprintStart}
            sprintEnd={sprintEnd}
          />
          <TimeLogInfo timeLogData={timeLogData} />
          <div className="sprint-members-container grid-item grid-item-8">
            <div className="header">Members</div>
            <Members sprintMembers={sprintMembers} />
          </div>
        </section>
      </main>
    </>
  );
}

export default Dashboard;
