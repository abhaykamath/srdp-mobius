import React, { useState } from "react";
import "../styles/StoriesPane.css";

function StoriesPane({
  stories,
  project,
  pieData,
  setStoryPieData,
  setStoryId,
}) {
  const [selectedStory, setSelectedStory] = useState("");
  return (
    <section id="left-pane">
      <div className="story-pane-header">STORIES</div>
      {stories
        .filter((story) => {
          return story.project_id === project;
        })
        .map((story, index) => {
          return (
            <div
              key={index}
              className="story-pill"
              style={{
                backgroundColor:
                  selectedStory === story.story_id ? "#36b37e" : "white",
                color: selectedStory === story.story_id ? "white" : "black",
              }}
              onClick={(e) => {
                setSelectedStory(story.story_id);
                setStoryId(story.story_id);
                setStoryPieData({
                  labels: pieData
                    .filter((d) => d.project_id.includes(project))
                    .filter((d) => d.story_id.includes(story.story_id))
                    .map((d) => d.status_category),
                  datasets: [
                    {
                      label: "Subtask Count",
                      data: pieData
                        .filter((d) => d.project_id.includes(project))
                        .filter((d) => d.story_id.includes(story.story_id))
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
              }}
            >
              <div className="story-name">
                <div>
                  <i
                    style={{
                      color:
                        selectedStory === story.story_id ? "white" : "#36b37e",
                    }}
                    className="fa-solid fa-bookmark"
                  ></i>
                </div>
                {story.story_name}
              </div>
              <div
                style={{
                  color: selectedStory === story.story_id ? "black" : "white",
                  backgroundColor:
                    selectedStory === story.story_id ? "white" : "#4285f4",
                }}
                className="story-status-label"
              >
                {story.story_status}
              </div>
            </div>
          );
        })}
    </section>
  );
}

export default StoriesPane;
