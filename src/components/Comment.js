import React, { useEffect, useState } from "react";
import StoryAC from "./Cards/StoryAC";
import axios from 'axios';
import moment from 'moment';
import { Link } from "react-router-dom";

const Comment = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://srdp-mobius-apis.onrender.com/comments');
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once after initial render

  const getDate = (date) => moment(date).format('MMM Do YYYY, h:mm:ss A');

  const getCommentsView = (issue) => {
    let index = 0;
    return issue.statusUpdates.map(c => {
        return (
            <div>{(++index) + '. ' + c.body}</div>
        );
    });
  };

  const rows = comments.map(issue => {
    const fields = issue.fields || {};
    const epic = "";
    const ticketType = fields.issuetype.name;
    return (
      <tr key={issue.key}>
        <td>{fields.project.name}</td>
        <td>{epic}</td>
        <td><img src={fields.issuetype.iconUrl} alt={`${ticketType} icon`} />{ticketType}</td>
        <td><a href={`https://gaiansolutions.atlassian.net/browse/${issue.key}`} target='_blank'>{issue.key}</a></td>
        <td>{fields.assignee && fields.assignee.displayName}</td>
        <td>{getDate(fields.updated)}</td>
        <td>{fields.status.statusCategory.name}</td>
        <td>{getCommentsView(issue)}</td>
      </tr>
    );
  });

  return (
    <>
      <div className="story-ac-card grid-item grid-item-6">
      <Link to={"/"}>
          <button
            className="btn btn-danger"
            
          >
            Go Back
          </button>
        </Link>
        <div className="header">Daily Status Updated</div>
        <table>
          <thead>
            <tr>
              <th>Project</th>
              <th>Epic</th>
              <th>Ticket Type</th>
              <th>Ticket</th>
              <th>Assignee</th>
              <th>Last Update Time</th>
              <th>Current Status</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Comment;
