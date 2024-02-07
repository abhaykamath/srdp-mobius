import axios from "axios";
import React, { useEffect, useState } from "react";
import "./alert.css";

const live_base_url = "https://srdp-mobius-apis.onrender.com";

const Alerts = ({ stories }) => {
  const [doneStories, setDoneStories] = useState();
  const [doneLenUpdated, setDoneLenUpdated] = useState();
  const [popup, setPopup] = useState(false);
  const [popupData, setPopupData] = useState();

  const done_story = stories.filter((story) => story.story_status == "Done");
  let sprint_id = stories && stories[0] && stories[0].sprint_id;
  async function getStoriesAlert() {
    if (sprint_id !== "") {
      const response = await axios.get(
        `${live_base_url}/sprint/${sprint_id}/stories`
      );
      //   console.log(response.data, "response");
      const sprint_stories = response.data.issues;
      const doneStory = sprint_stories
        .sort((a, b) => new Date(a.updated) - new Date(b.updated))
        .filter((story) => story.story_status == "Done");
      console.log(doneStory, "doneStory");

      if (
        doneStory.length > done_story.length 
        &&
        doneStory[doneStory.length - 1] &&
        new Date(
          doneStory[doneStory.length - 1].updated
        ).toLocaleDateString() === new Date().toLocaleDateString()
      ) {
        setPopupData(doneStory[doneStory.length - 1]);
        setPopup(true);

        console.log(popup, "1", doneStory.length);
      } else {
        setPopup(false);
      }

      console.log(doneStory, "sprint_stories");
      console.log();
    }
  }
  useEffect(() => {
    const intervalId = setInterval(() => {
      getStoriesAlert();
    }, 4000);

    return () => clearInterval(intervalId);
  }, [done_story.length, sprint_id]);

  //   console.log(stories);
  //   console.log(doneStories);
  //   console.log(done_story.length.length, ">", done_story.length);

  const reloadAndClosePopup = () => {
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
              <span>completed Story:</span>
              <p> {popupData.story_name}</p>
              <p>
                <span>With Stry points : </span>
                {popupData.story_points}
              </p>
            </div>
            <button
              type="button"
              class="btn btn-danger clos-button"
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
