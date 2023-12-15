import React, { useEffect, useState } from "react";
import StoryAC from "./Cards/StoryAC";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./comments.css";
import Loader from "./Loader";

const Comment = () => {
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

  const live_base_url = "https://srdp-mobius-apis.onrender.com";

  const fetchData = async () => {
    try {
      const response = await axios.get(`${live_base_url}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const getDate = (date) => moment(date).format("MMM Do YYYY, h:mm:ss A");

  const getCommentsView = (issue) => {
    let index = 0;
    const hasMore = issue.statusUpdates.length > 1;
    return issue.statusUpdates.map((c) => {
      const b = hasMore ? ++index + ". " + c.body : c.body;
      return (
        <div>
          <Markdown remarkPlugins={[remarkGfm]}>{b}</Markdown>
        </div>
      );
    });
  };

  const getEpicView = (issue) => {
    const parent = issue.fields.parent;
    if (parent && parent.fields && parent.fields.summary) {
      return (
        <a
          href={`https://gaiansolutions.atlassian.net/browse/${parent.key}`}
          target="_blank"
        >
          {parent.fields.summary}
        </a>
      );
    }
  };

  const rows = comments.map((issue) => {
    setCommentsLoading(true);
    const fields = issue.fields || {};
    const ticketType = fields.issuetype.name;
    return (
      <tr key={issue.key}>
        <td>{fields.project.name}</td>
        <td>{getEpicView(issue)}</td>
        <td>
          <img
            src={fields.issuetype.iconUrl}
            alt={ticketType}
            title={ticketType}
          />
          &nbsp;
          <a
            href={`https://gaiansolutions.atlassian.net/browse/${issue.key}`}
            target="_blank"
          >
            {issue.fields.summary}
          </a>
        </td>
        <td>{fields.assignee && fields.assignee.displayName}</td>
        <td>{getDate(fields.updated)}</td>
        <td>
          <div className={"task-status-" + fields.status.statusCategory.key}>
            {fields.status.statusCategory.name}
          </div>
        </td>
        <td>{getCommentsView(issue)}</td>
      </tr>
    );
  });

  return (
    <>
        <Link to={"/"}>
          <button className="btn btn-danger">Go Back</button>
        </Link>
      <div className=" story-status grid-comments ">
        <div className="header">
          Daily Status Updated: <b>{comments.length} Tasks</b>
        </div>
        <table>
          <thead></thead>
          <tbody>
            <tr key="table-header" className="table-head">
              <td>Project</td>
              <td>Epic</td>
              <td>Task</td>
              <td>Assignee</td>
              <td>Last Update Time</td>
              <td>Current Status</td>
              <td>Comments</td>
            </tr>
            {rows}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Comment;
