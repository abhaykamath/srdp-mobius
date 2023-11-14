import React from "react";

function EffortEstimate({ storyPoints }) {
  return (
    <div className="story-ac-card grid-item grid-item-4">
      <div className="header">Effort Estimate</div>
      <table>
        <tr>
          <td>Story points</td>
          <td>{storyPoints !== 0 ? storyPoints : "Points not added"}</td>
        </tr>
      </table>
    </div>
  );
}

export default EffortEstimate;
