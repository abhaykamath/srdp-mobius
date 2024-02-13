import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
import Alerts from "./Alerts";

const live_base_url = "https://srdp-mobius-apis.onrender.com";
// const live_base_url = "http://localhost:4000";

function Dashboard({ setView }) {
  const { boardId, boardName } = useParams();
  // console.log("..............", boardId, boardName, useParams());
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
  const [storyPointsData, setStoryPointsData] = useState();
  const [storydata, setStorydata] = useState();
  const [storyDone, setStoryDone] = useState([]);
  let statusDone;

  async function getStories() {
    if (sprint !== "") {
      setStoriesLoading(true);
      const response = await axios.get(
        `${live_base_url}/sprint/${sprint}/stories`
      );
      // console.log(response.data, "response");
      const sprint_stories = response.data.issues;

      // sorting by todo, inprogress, done
      function sort_in_order(a, b) {
        const storyOrder = { "To Do": 1, Done: 3 };

        return (
          (storyOrder[a.story_status] || 2) - (storyOrder[b.story_status] || 2)
        );
      }

      const sortedStories = sprint_stories.sort(sort_in_order);

      const storyOrder = ["To Do", "In Progress", "Done"];
      const sprint_Stories_Sorted = (a, b) => {
        return (
          storyOrder.indexOf(a.story_status) -
          storyOrder.indexOf(b.story_status)
        );
      };

      // Get story_ac_hygiene for all stories
      let yes = 0;
      let no = 0;
      sprint_stories.forEach((d) => {
        if (d.story_ac_hygiene == "NO") no++;
        if (d.story_ac_hygiene == "YES") yes++;
      });

      // console.log(sprint_stories, "sprint_stories");
      setStoryAC(`YES : ${yes}, NO : ${no}`);

      const stories_for_sprint = sprint_stories.sort(sprint_Stories_Sorted);
      console.log(sortedStories);
      setStories(sortedStories);
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
      // console.log(h_chart_data);

      // Sorting by todo, inprogress, done
      function sort_in_order(a, b) {
        const storyOrder = { "To Do": 1, Done: 3 };

        return (
          (storyOrder[a.story_status] || 2) - (storyOrder[b.story_status] || 2)
        );
      }

      let h_chart_data_sorted = h_chart_data.sort(sort_in_order);

      let [total_subtasks, completedtasks] = [0, 0];
      h_chart_data_sorted.forEach((d) => {
        total_subtasks += d.number_of_sub_tasks;
        completedtasks += d.completed_sub_tasks;
      });

      setOtp({
        number_of_sub_tasks: total_subtasks,
        completed_sub_tasks: completedtasks,
      });

      let story_ac_hygine = stories.story_ac_hygine;
      let length = stories.length;
      // console.log(h_chart_data_sorted.length, "length");

      // console.log(h_chart_data_sorted, "h_chart_data_sorted");
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
      console.log(pieData, "pieData...............");
      setApiCount((prev) => prev + 1);
    }
  }

  function updateStoryAC() {
    // console.log(stories, "dfvdfv");
    if (sprint !== "" && storyId !== "") {
      const AC = stories.filter((s) => s.story_id === storyId)[0]
        .story_ac_hygiene;
      //setStoryAC(AC);
    }
  }

  function updateStoryPoints() {
    if (sprint !== "" && storyId !== "") {
      const points = hChartData.filter((s) => s.story_id === storyId)[0]
        .story_points;
      setStoryPoints(points);
    }
  }

  function updateOtp() {
    if (sprint !== "" && storyId !== "") {
      const { number_of_sub_tasks, completed_sub_tasks } = hChartData.filter(
        (s) => s.story_id === storyId
      )[0];
      setOtp({ number_of_sub_tasks, completed_sub_tasks });
    }
  }

  function updateTimeLogData() {
    if (sprint !== "" && storyId !== "") {
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
    if (sprint !== "" && storyId !== "") {
      const reviewers = stories.filter((s) => s.story_id === storyId)[0]
        .story_reviewers;
      setStoryReviewers(reviewers);
    }
  }

  function updateTotalStoryPoints(sprint_progress_data) {
    if (sprint !== "" && storyId !== "") {
      let points = 0;
      setStoryPointsData(sprint_progress_data);
      for (let sprint of sprint_progress_data) {
        points += sprint.story_points;
      }
      // console.log(storyPointsData, "storyPointsData");

      // setStoryPoints(points);
      setTotalStoryPoints(points);
    }
  }

  if (apiCount == 4) {
    let piedata = new Map();

    pieData.forEach((d) => {
      // console.log(d, "piedata");
      if (piedata.has(d.status_category_name)) {
        piedata.set(
          d.status_category_name,
          piedata.get(d.status_category_name) + d.issue_count
        );
        setStorydata(
          piedata.set(
            d.status_category_name,
            piedata.get(d.status_category_name) + d.issue_count
          )
        );
      } else {
        piedata.set(d.status_category_name, d.issue_count);
        setStorydata(piedata.set(d.status_category_name, d.issue_count));
      }
    });
    // console.log(
    //   pieData.filter((d) => d.status_category_name),
    //   "pieData"
    // );

    // console.log(piedata, "piedata");

    setStoryPieData({
      labels: Array.from(piedata.keys()),
      datasets: [
        {
          label: "Subtask Count",
          data: Array.from(piedata.values()),
          backgroundColor: [
            "#4285F4",
            "#FBBC05",
            "#34A853",
            "#EA4335",
            "#DA0C81",
          ],
        },
      ],
    });
    setApiCount(0);
  }
  // console.log(storydata, "storydata");
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
        sprint={sprint}
        setSprint={setSprint}
        setSprintStart={setSprintStart}
        setSprintEnd={setSprintEnd}
        setStoriesLoading={setStoriesLoading}
        setView={setView}
        boardId={boardId}
        boardName={boardName}
        totalStoryPoints={totalStoryPoints}
        stories={stories}
      />
      <main>
        <StoriesPane
          stories={stories}
          setStoryId={setStoryId}
          storiesLoading={storiesLoading}
          storyId={storyId}
          storyAC={storyAC}
          storyPoints={storyPoints}
          storyPointsData={storyPointsData}
        />
        <Alerts />

        <section className="right-pane-1">
          <div className="horizontal-chart-container h_chart_div">
            <div className="header">Sprint progress</div>
            <div className="horizontal-chart-canvas-container">
              {hChartData.length !== 0 ? (
                <BarChart chartData={horizontalBarChartData} />
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="story-sprint-details-div">
            <div className="pie-chart-container pie-chart-div">
              <div className="header">Subtasks status</div>
              <div className="horizontal-chart-canvas-container">
                {pieData.length !== 0 ? (
                  <PieChart chartData={storyPieData} />
                ) : (
                  "NO Subtask"
                )}
              </div>
            </div>

            <div className="sprint-members-container sprint-members-div">
              <div className="header">
                Members ({sprintMembers.length !== 0 ? sprintMembers.length : 0}
                ){" "}
              </div>
              <Members sprintMembers={sprintMembers} />
            </div>
          </div>

          <div className="hygine-ontime-timelog-div">
            <div className="hygine-ontime-div">
              <StoryAC storyAC={storyAC} />
              <OnTimePredictability
                otp={otp}
                sprintStart={sprintStart}
                sprintEnd={sprintEnd}
              />
            </div>
            <div className="time-log-div">
              <TimeLogInfo timeLogData={timeLogData} />

              <PeerReviewInfo storyReviewers={storyReviewers} />
            </div>
          </div>
        </section>

        {/* <section id="right-pane">
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
          <EffortEstimate
            storyPoints={storyPoints}
            totalStoryPoints={totalStoryPoints}
          />
          <PeerReviewInfo storyReviewers={storyReviewers} />
          <OnTimePredictability
            otp={otp}
            sprintStart={sprintStart}
            sprintEnd={sprintEnd}
          />
          <TimeLogInfo timeLogData={timeLogData} />
          <div className="sprint-members-container grid-item grid-item-8">
            <div className="header">
              Members ({sprintMembers.length !== 0 ? sprintMembers.length : 0}){" "}
            </div>
            <Members sprintMembers={sprintMembers} />
          </div>
        </section> */}
      </main>
    </>
  );
}

export default Dashboard;
