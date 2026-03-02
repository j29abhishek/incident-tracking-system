import React from "react";

const IncidentTable = ({ incidents = [] }) => {
  if (!incidents.length) {
    return <p className="empty-state">No incidents found</p>;
  }

  return (
    <div className="incident-table-wrapper">
      <table className="incident-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Reported By</th>
            <th>Service</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {incidents.map((incident) => (
            <tr key={incident._id}>
              <td className="title-cell">{incident.title}</td>

              <td>{incident.reportedBy?.name || "—"}</td>

              <td>{incident.service?.name || "—"}</td>

              <td>
                <span className={`status ${incident.status}`}>
                  {incident.status.replace("_", " ")}
                </span>
              </td>

              <td>
                <span className={`priority ${incident.priority}`}>
                  {incident.priority}
                </span>
              </td>

              <td>
                {new Date(incident.createdAt).toLocaleDateString()}
              </td>

              <td>
                <button className="view-btn">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IncidentTable;