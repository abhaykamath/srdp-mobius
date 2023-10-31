import React, { useState } from "react";
import "../styles/StoriesPane.css";
import Loader from "./Loader";

function StoriesPane({ stories, setStoryId, storiesLoading,storyId }) {
  return (
    <section id="left-pane">
      <div className="story-pane-header">STORIES</div>

      {storiesLoading ? (
        <div className="story-loader">
          <Loader />
        </div>
      ) : stories.length === 0 ? (
        <div className="story-pane-message">Stories not added</div>
      ) : (
        <div className="stories-list">
          {stories.map((story, index) => {
            return (
              <div
                key={index}
                className="story-pill"
                style={{
                  backgroundColor:
                  storyId === story.story_id ? "#36b37e" : "white",
                  color: storyId === story.story_id ? "white" : "black",
                  animation: `fadeInAndSlideIn 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) ${
                    0.5 + index * 0.1
                  }s 1 forwards`,
                }}
                onClick={(e) => {
                  setStoryId(story.story_id.toString());
                }}
              >
                <div className="story-name">
                  <div>
                    <i
                      style={{
                        color:
                        storyId === story.story_id
                            ? "white"
                            : "#36b37e",
                      }}
                      className="fa-solid fa-bookmark"
                    ></i>
                  </div>
                  {story.story_name}
                </div>
                <div
                  style={{
                    color: storyId === story.story_id ? "black" : "white",
                    backgroundColor:
                    storyId === story.story_id ? "white" : "#4285f4",
                  }}
                  className="story-status-label"
                >
                  {story.story_status}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default StoriesPane;
