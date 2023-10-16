import React from "react";

function StoryAC({ storyAC }) {
  return (
    <div className="story-ac-card grid-item grid-item-3">
      <div className="header">Story AC Hygiene</div>
      <table>
        <tr>
          <td>AC Added ?</td>
          <td>{storyAC}</td>
        </tr>
      </table>
    </div>
  );
}

export default StoryAC;
