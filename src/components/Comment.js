import React, { Component, useEffect, useRef, useState } from "react";
import StoryAC from "./Cards/StoryAC";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./comments.css";
import Loader from "./Loader";
import DataTable from "react-data-table-component";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";
import { useReactToPrint } from "react-to-print";

const Comment = () => {
  const [comments, setComments] = useState([]);
  const [commentsData, setCommentsData] = useState([]);
  const pdfRef = useRef();

  const [commentsLoading, setCommentsLoading] = useState(true);

  const live_base_url = "https://srdp-mobius-apis.onrender.com";

  const fetchData = async () => {
    try {
      const response = await axios.get(`${live_base_url}/comments`);
      setComments(response.data);
      setCommentsLoading(false);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  console.log(comments);
  // const columns = [
  //   {
  //     name: "Project",
  //     selector: (row) => <div>{row.fields.project.name}</div>,
  //   },
  //   {
  //     name: "Epic",
  //     selector: (row) => (
  //       <div>
  //         <a
  //           href={`https://gaiansolutions.atlassian.net/browse/${row.fields.parent.key}}`}
  //           target="_blank"
  //         >
  //           {row.fields.parent.fields.summary}
  //         </a>
  //       </div>
  //     ),
  //   },
  //   {
  //     name: "Task",
  //     selector: (row) => (
  //       <div>
  //         <img
  //           src={row.fields.issuetype.iconUrl}
  //           alt={row.fields.issuetype.name}
  //           title={row.fields.issuetype.name}
  //         />
  //         &nbsp;
  //         <a
  //           href={`https://gaiansolutions.atlassian.net/browse/${row.key}`}
  //           target="_blank"
  //         >
  //           {row.fields.summary}
  //         </a>
  //       </div>
  //     ),
  //   },
  //   {
  //     name: "Assignee",
  //     selector: (row) => (
  //       <div>{row.fields.assignee && row.fields.assignee.displayName}</div>
  //     ),
  //   },
  //   {
  //     name: "Last Update Time",
  //     selector: (row) => <div>{getDate(row.fields.updated)}</div>,
  //   },
  //   {
  //     name: "Current Status	ject",
  //     selector: (row) => (
  //       <div className={"task-status-" + row.fields.status.statusCategory.key}>
  //         {row.fields.status.statusCategory.name}
  //       </div>
  //     ),
  //   },
  //   {
  //     name: "Comments",
  //     selector: (row) => <div>{getCommentsView(row)}</div>,
  //   },
  // ];

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
        <div key={index}>
          <Markdown remarkPlugins={[remarkGfm]}>{b}</Markdown>
        </div>
      );
    });
  };

  const getEpicView = (issue) => {
    const parent = issue.fields.parent;
    console.log(parent, "parent");
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
    const fields = issue.fields || {};
    const ticketType = fields.issuetype.name;
    console.log("ticketType", ticketType);
    return (
      <tr key={issue.key} className="data-row">
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

  // const downloadPDF = () => {
  //   const input = pdfRef.current;

  //   const pdfOptions = {
  //     margin: 10,
  //     filename: "downloaded-page.pdf",
  //     image: { type: "jpeg", quality: 0.98 },
  //     html2canvas: { scale: 2 },
  //     jsPDF: { unit: "mm", format: "a4", orientation: "landscape" }, // Set orientation to landscape
  //   };

  //   html2pdf(input, pdfOptions);
  // };

  const download_PDF = useReactToPrint({
    content: () => pdfRef.current,
    documentTitle: "Daily-status-update",
    // onAfterPrint:() => alert("Saved as PDF")
  })

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <>
      <div>
        <div className="buttons">
          <Link to={"/"}>
            <button className="btn btn-danger">Go Back</button>
          </Link>
          <button className="btn btn-success" onClick={refreshPage}>
            Refresh
          </button>
         
          <button className="btn btn-primary" onClick={download_PDF}>
          Download
          </button>
           {/* <button className="btn btn-primary" onClick={downloadPDF}>
            Download
          </button> */}
        </div>

        <div className=" story-status grid-comments" ref={pdfRef}>
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
              {commentsLoading ? (
                <div className="story-loader">
                  <Loader />
                </div>
              ) : (
                rows
              )}
            </tbody>
          </table>
          {/* <DataTable
          columns={columns}
          data={comments}
          fixedHeader
          actions={<button className="btn btn-sm btn-info">Download</button>}
          progressPending={commentsLoading}
          progressComponent={
            <div className="story-loader">
              <Loader />
            </div>
          }
        /> */}
        </div>
      </div>
    </>
  );
};

export default Comment;
