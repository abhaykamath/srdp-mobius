import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [project, setProject] = useState("10235");
  const [stories, setStories] = useState([]);
  const [sprint, setSprint] = useState("");

  function getStories() {
    axios
      .get(
        "https://ingress-gateway.gaiansolutions.com/tf-web/v1.0/618b6fdef5dacc0001a6b1b0/analytic-queries/6522b611791ca22bcee4471b/data?size=1000"
      )
      .then((res) => {
        let entities = res.data.model.entities;
        setStories(entities);
      });
  }

  useEffect(() => {
    getStories();
  }, []);

  return (
    <>
      <nav className="custom-navbar">
        <div className="dashboard-name">Sprint Review Dashboard</div>
        <div className="project-name">
          Monet 2.0 <span>( Project )</span>
        </div>
      </nav>
      <main>
        {/* <div className="sprint-name">Sprint : {sprint}</div> */}
        <section id="left-pane">
          <div
            style={{
              backgroundColor: "#36b37e",
              width: "fit-content",
              padding: "0.25rem 0.5rem",
              borderRadius: "0.5rem",
            }}
          >
            STORIES
          </div>
          {stories
            .filter((story) => {
              return story.project_id === project;
            })
            .map((story, index) => {
              return (
                <div key={index} className="story-pill">
                  <div className="story-name">
                    <div>
                      <i className="fa-solid fa-bookmark"></i>
                    </div>
                    {story.story_name}
                  </div>
                  <div className="story-status-label">{story.story_status}</div>
                </div>
              );
            })}
        </section>
        <section id="right-pane"></section>
      </main>
    </>
  );
}

export default App;
