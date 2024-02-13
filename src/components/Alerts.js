import axios from "axios";
import React, { useEffect, useState } from "react";
import "./alert.css";

// const live_base_url = "http://localhost:4000";
const live_base_url = "https://srdp-mobius-apis.onrender.com";

const Alerts = () => {
  const [popup, setPopup] = useState(false);
  const [popupData, setPopupData] = useState(null);

  // const done_story = stories.filter((story) => story.story_status == "Done");
  async function getStoriesAlert() {
    const response = await axios.get(`${live_base_url}/alerts`);
    const sprint_stories = response.data;
    const currentDate = new Date();
    const threshold = 6 * 1000;

    for (let count = 0; count < sprint_stories.length; count++) {
      if (
        sprint_stories[count] !== null &&
        currentDate - new Date(sprint_stories[count].updated) <= threshold
      ) {
        setPopupData(sprint_stories[count]);
        setPopup(true);
        break;
      }
    }
    // if (
    //   doneStory.length > done_story.length
    //   &&
    //   doneStory[doneStory.length - 1] &&
    //   new Date(
    //     doneStory[doneStory.length - 1].updated
    //   ).toLocaleDateString() === new Date().toLocaleDateString()
    // ) {
    //   setPopupData(doneStory[doneStory.length - 1]);
    //   setPopup(true);

    //   console.log(popup, "1", doneStory.length);
    // } else {
    //   setPopup(false);
    // }
  }

  useEffect(() => {
    if (!popup && popupData == null) {
      const intervalId = setInterval(() => {
        getStoriesAlert();
      }, 4000);
      return () => clearInterval(intervalId);
    }
  }, [popup]);

  const reloadAndClosePopup = () => {
    setPopupData(null);
    window.location.reload();
    setPopup(false);
  };
  return (
    <div>
      {popup && (
        <div className="overlay">
          <div className="popup">
            <div>
              <h3>{popupData.assignee}</h3>
              <span>Completed Story:</span>
              <p style={{ fontWeight: "bold" }}> {popupData.story_name}</p>
              <p>
                <span>With Story points : </span>
                <span style={{ fontWeight: "bold" }}>
                  {" "}
                  {popupData.story_points}
                </span>
              </p>
            </div>
            <button
              type="button"
              class="btn btn-danger close-button"
              onClick={reloadAndClosePopup}
            >
              X
            </button>
            {/* <button onClick={reloadAndClosePopup}>Close</button> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;

