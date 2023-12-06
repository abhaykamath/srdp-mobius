import React, { useState } from "react";
import "../styles/StoriesPane.css";
import Loader from "./Loader";

function StoriesPane({
  stories,
  setStoryId,
  storiesLoading,
  storyId,
  storyPoints,
  // storyAC,
  storyPointsData,
}) {
  console.log(stories, "stories......");
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
              const last_updated = story.updated;
              console.log(typeof last_updated, "last_updated");
              const dateObject = new Date(last_updated);
              const year = dateObject.getFullYear();
              const month = dateObject.getMonth() + 1;
              const day = dateObject.getDate();
              const hours = dateObject.getHours();
              const minutes = dateObject.getMinutes();
              const seconds = dateObject.getSeconds();
              const formattedDate = `${day < 10 ? "0" + day : day}-${
                month < 10 ? "0" + month : month
              }-${year}`;

              const formattedTime = `${hours % 12 || 12}:${
                minutes < 10 ? "0" + minutes : minutes
              }:${seconds < 10 ? "0" + seconds : seconds} ${
                hours >= 12 ? "PM" : "AM"
              }`;

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
                  <div className="story-details">
                    <div className="story-name">
                      <div>
                        <i
                          style={{
                            color:
                              storyId === story.story_id ? "white" : "#36b37e",
                          }}
                          className="fa-solid fa-bookmark"
                        ></i>
                      </div>
                      {story.story_name}
                    </div>
                    <div className="story-hygiene">
                      Hygiene :{" "}
                      <span
                        style={{
                          color:
                            story.story_ac_hygiene === "YES" ? "green" : "red",
                        }}
                      >
                        {story.story_ac_hygiene}
                      </span>
                    </div>
                    <div className="Updated-date">
                      <div>Due-Date : {story.duedate}</div>
                    </div>
                    <div className="Updated-date">
                      <div>Updated : {formattedDate}</div>
                    </div>
                    <div className="assigned-to">
                      Assigned To : {story.assigne}
                    </div>
                  </div>
                  <div className="status-storypoints">
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
                    <div className="story-points-in-story-pane">
                      SP : {story.story_points}
                    </div>
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
