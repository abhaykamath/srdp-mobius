import React from "react";
import members_list from "../data/members";
import "../styles/Members.css";

function Members({ sprintMembers }) {
  return (
    <div className="members-container">
      {sprintMembers.length !== 0
        ? sprintMembers.map((member, index) => {
            return (
              <div className="member" key={index}>
                {member.sprint_member_full_name}
              </div>
            );
          })
        : ""}
    </div>
  );
}

export default Members;
