import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  MdWarning,
  MdCheckCircle,
  MdError,
  MdInfo,
  MdLocationOn,
  MdOpenInNew,
  MdFilterList,
} from "react-icons/md";
import { TbPlant2 } from "react-icons/tb";
import FilterBar from "../components/shared/FilterBar";
import SearchBar from "../components/shared/SearchBar";
import StatusBadge from "../components/ui/StatusBadge";
import { alerts as initialAlerts, crops, locations } from "../data/mockData";
import "./Alerts.css";

type Alert = (typeof initialAlerts)[0];

function SeverityIcon({ severity }: { severity: string }) {
  if (severity === "critical")
    return <MdError size={16} className="sev-icon critical" />;
  if (severity === "warning")
    return <MdWarning size={16} className="sev-icon warning" />;
  return <MdInfo size={16} className="sev-icon info" />;
}

export default function Alerts() {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [cropFilter, setCropFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [resolvedFilter, setResolvedFilter] = useState("");
  const [selected, setSelected] = useState<Alert | null>(null);
  const [alertList, setAlertList] = useState(initialAlerts);

  const cropOptions = crops.map((c) => ({ label: c, value: c }));
  const locationOptions = locations.map((l) => ({ label: l, value: l }));
  const severityOptions = [
    { label: "Critical", value: "critical" },
    { label: "Warning", value: "warning" },
    { label: "Info", value: "info" },
  ];
  const resolvedOptions = [
    { label: "Unresolved", value: "false" },
    { label: "Resolved", value: "true" },
  ];

  // Lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  const filtered = useMemo(() => {
    return alertList.filter((a) => {
      const q = search.toLowerCase();
      return (
        (a.farmerName.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q) ||
          a.type.toLowerCase().includes(q) ||
          a.crop.toLowerCase().includes(q)) &&
        (severityFilter ? a.severity === severityFilter : true) &&
        (cropFilter ? a.crop === cropFilter : true) &&
        (locationFilter ? a.location === locationFilter : true) &&
        (resolvedFilter ? String(a.resolved) === resolvedFilter : true)
      );
    });
  }, [
    search,
    severityFilter,
    cropFilter,
    locationFilter,
    resolvedFilter,
    alertList,
  ]);

  const criticalCount = alertList.filter(
    (a) => a.severity === "critical" && !a.resolved,
  ).length;
  const warningCount = alertList.filter(
    (a) => a.severity === "warning" && !a.resolved,
  ).length;
  const resolvedCount = alertList.filter((a) => a.resolved).length;
  const unresolvedCount = alertList.filter((a) => !a.resolved).length;

  function toggleResolve(id: string) {
    setAlertList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: !a.resolved } : a)),
    );
    setSelected((prev) =>
      prev?.id === id ? { ...prev, resolved: !prev.resolved } : prev,
    );
  }

  function openModal(e: React.MouseEvent, alert: Alert) {
    e.stopPropagation();
    setSelected(alert);
  }

  function closeModal() {
    setSelected(null);
  }

  return (
    <div className="alerts-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Alerts</h2>
          <p className="page-subtitle">
            {unresolvedCount} unresolved · {resolvedCount} resolved
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="alerts-summary">
        <div className="alert-summary-card critical">
          <MdError size={22} />
          <div>
            <p className="asc-val">{criticalCount}</p>
            <p className="asc-label">Critical</p>
          </div>
        </div>
        <div className="alert-summary-card warning">
          <MdWarning size={22} />
          <div>
            <p className="asc-val">{warningCount}</p>
            <p className="asc-label">Warnings</p>
          </div>
        </div>
        <div className="alert-summary-card resolved">
          <MdCheckCircle size={22} />
          <div>
            <p className="asc-val">{resolvedCount}</p>
            <p className="asc-label">Resolved</p>
          </div>
        </div>
        <div className="alert-summary-card total">
          <MdFilterList size={22} />
          <div>
            <p className="asc-val">{alertList.length}</p>
            <p className="asc-label">Total</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="alerts-toolbar">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search farmer, location, type..."
        />
        <FilterBar
          filters={[
            {
              key: "severity",
              label: "Severity",
              options: severityOptions,
              value: severityFilter,
              onChange: setSeverityFilter,
            },
            {
              key: "crop",
              label: "Crop",
              options: cropOptions,
              value: cropFilter,
              onChange: setCropFilter,
            },
            {
              key: "location",
              label: "Location",
              options: locationOptions,
              value: locationFilter,
              onChange: setLocationFilter,
            },
            {
              key: "resolved",
              label: "Status",
              options: resolvedOptions,
              value: resolvedFilter,
              onChange: setResolvedFilter,
            },
          ]}
        />
      </div>

      {/* Alerts Table */}
      <div className="alerts-table-wrap">
        <table className="alerts-table">
          <thead>
            <tr>
              <th>Severity</th>
              <th>Farmer</th>
              <th>Location</th>
              <th>Crop</th>
              <th>Alert Type</th>
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="alerts-empty">
                  <MdCheckCircle size={36} />
                  <p>No alerts match your filters</p>
                </td>
              </tr>
            ) : (
              filtered.map((a) => (
                <tr
                  key={a.id}
                  className={`alerts-row ${a.resolved ? "resolved" : ""}`}
                  onClick={(e) => openModal(e, a)}
                >
                  <td>
                    <div className="severity-cell">
                      <SeverityIcon severity={a.severity} />
                      <span className={`severity-label ${a.severity}`}>
                        {a.severity.charAt(0).toUpperCase() +
                          a.severity.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="farmer-name-cell">
                      <div className="farmer-avatar">
                        {a.farmerName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="farmer-name">{a.farmerName}</p>
                        <p className="farmer-id">{a.farmerId}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="cell-with-icon">
                      <MdLocationOn size={14} className="cell-icon" />
                      {a.location}
                    </div>
                  </td>
                  <td>
                    <div className="cell-with-icon">
                      <TbPlant2 size={14} className="cell-icon" />
                      {a.crop}
                    </div>
                  </td>
                  <td className="alert-type-cell">{a.type}</td>
                  <td className="alert-time-cell">{a.time}</td>
                  <td>
                    <StatusBadge
                      status={a.resolved ? "resolved" : (a.severity as any)}
                    />
                  </td>
                  <td>
                    <div className="alerts-actions">
                      <button
                        className="view-btn"
                        onClick={(e) => openModal(e, a)}
                      >
                        <MdOpenInNew size={14} />
                        View
                      </button>
                      <button
                        className={`resolve-btn ${a.resolved ? "unresolve" : "resolve"}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleResolve(a.id);
                        }}
                      >
                        {a.resolved ? "Unresolve" : "Resolve"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Alert Detail Modal — portaled to document.body */}
      {selected &&
        createPortal(
          <div className="alert-modal-overlay" onClick={closeModal}>
            <div className="alert-modal" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className={`alert-modal-header ${selected.severity}`}>
                <div className="alert-modal-header-left">
                  <SeverityIcon severity={selected.severity} />
                  <div>
                    <h3 className="alert-modal-title">{selected.type}</h3>
                    <p className="alert-modal-time">{selected.time}</p>
                  </div>
                </div>
                <button className="alert-modal-close" onClick={closeModal}>
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="alert-modal-body">
                <div className="fd-info-list">
                  <div className="fd-info-row">
                    <span className="fd-info-label">
                      <MdLocationOn size={15} /> Farmer
                    </span>
                    <span className="fd-info-val">{selected.farmerName}</span>
                  </div>
                  <div className="fd-info-row">
                    <span className="fd-info-label">
                      <MdLocationOn size={15} /> Location
                    </span>
                    <span className="fd-info-val">{selected.location}</span>
                  </div>
                  <div className="fd-info-row">
                    <span className="fd-info-label">
                      <TbPlant2 size={15} /> Crop
                    </span>
                    <span className="fd-info-val">{selected.crop}</span>
                  </div>
                  <div className="fd-info-row">
                    <span className="fd-info-label">
                      <MdWarning size={15} /> Severity
                    </span>
                    <span className={`severity-label ${selected.severity}`}>
                      {selected.severity.charAt(0).toUpperCase() +
                        selected.severity.slice(1)}
                    </span>
                  </div>
                  <div className="fd-info-row">
                    <span className="fd-info-label">
                      <MdCheckCircle size={15} /> Status
                    </span>
                    <StatusBadge
                      status={
                        selected.resolved
                          ? "resolved"
                          : (selected.severity as any)
                      }
                    />
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="alert-modal-actions">
                  <button
                    className={`fd-btn ${selected.resolved ? "secondary" : "primary"}`}
                    onClick={() => toggleResolve(selected.id)}
                  >
                    {selected.resolved
                      ? "Mark as Unresolved"
                      : "Mark as Resolved"}
                  </button>
                  <button className="fd-btn secondary" onClick={closeModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
