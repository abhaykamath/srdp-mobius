import React from "react";
import members_list from "../data/members";
import "../styles/Members.css";

function Members({ project }) {
  return (
    <div className="members-container">
      {members_list
        .filter((memeber) => memeber.project_id === project)
        .map((member, index) => {
          return (
            <div className="member" key={index}>
              {member.sprint_member_full_name}
            </div>
          );
        })}
    </div>
  );
}

export default Members;
