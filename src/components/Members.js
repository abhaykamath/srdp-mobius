import React, { useState, useEffect } from "react";
import css from "../styles/Members.module.scss";

function Members({ sprintMembers, filterStoriesByMember }) {
  const [selectedMember, setSelectedMember] = useState(null);

  const handleMemberClick = (memberName) => {
    filterStoriesByMember(memberName);
    setSelectedMember(memberName);
  };

  console.log("Rendering Members component");

  return (
    <div className={css.members_container}>
      {sprintMembers.map((member, index) => (
        <div
          key={index}
          className={`${css.member} ${member.sprint_member_full_name === selectedMember ? css.selected : ''}`}
          onClick={() => handleMemberClick(member.sprint_member_full_name)}
        >
          {member.sprint_member_full_name}
        </div>
      ))}
    </div>
  );
}

export default Members;
