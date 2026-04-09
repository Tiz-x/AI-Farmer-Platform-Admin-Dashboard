import { MdPeople, MdLandscape, MdBarChart, MdWarning } from "react-icons/md";

import StatCard from "../components/shared/StatCard";
import StatusBadge from "../components/ui/StatusBadge";
import { stats, farmers, cropDistribution, alerts } from "../data/mockData";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard">
      {/* Stat Cards */}
      <div className="dashboard-stats">
        <StatCard
          icon={<MdPeople size={20} color="#6ab04c" />}
          label="Total Farmers"
          value={stats.totalFarmers.toLocaleString()}
          sub={`+${stats.newFarmersThisMonth} this month`}
          subType="up"
        />
        <StatCard
          icon={<MdLandscape size={20} color="#6ab04c" />}
          label="Active Fields"
          value={stats.activeFields.toLocaleString()}
          sub={`${stats.operationalPercent}% operational`}
          subType="up"
        />
        <StatCard
          icon={<MdBarChart size={20} color="#6ab04c" />}
          label="Total Area (ha)"
          value={(stats.totalAreaHa / 1000).toFixed(0) + "K"}
          sub="across 12 states"
          subType="neutral"
        />
        <StatCard
          icon={
            <MdWarning
              size={20}
              color={stats.criticalAlerts > 0 ? "#c0392b" : "#6ab04c"}
            />
          }
          label="Alerts Today"
          value={stats.alertsToday}
          sub={`${stats.criticalAlerts} critical`}
          subType="down"
        />
      </div>

      {/* Middle Row */}
      <div className="dashboard-mid">
        {/* Farmer Activity Table */}
        <div className="dash-card">
          <p className="dash-card-title">Farmer activity — top fields</p>

          {/* Desktop table */}
          <div className="dash-table-wrap dash-table-desktop">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Farmer</th>
                  <th>State</th>
                  <th>Crop</th>
                  <th>NDVI</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {farmers.slice(0, 6).map((f) => (
                  <tr key={f.id}>
                    <td>{f.name}</td>
                    <td>{f.location}</td>
                    <td>{f.crop}</td>
                    <td>{f.ndvi}</td>
                    <td>
                      <StatusBadge status={f.status as any} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="dash-farmer-list">
            {farmers.slice(0, 6).map((f) => (
              <div key={f.id} className="dash-farmer-row">
                <div className="dash-farmer-avatar">
                  {f.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="dash-farmer-info">
                  <span className="dash-farmer-name">{f.name}</span>
                  <span className="dash-farmer-meta">
                    {f.location} · {f.crop}
                  </span>
                </div>
                <div className="dash-farmer-right">
                  <span className="dash-farmer-ndvi">{f.ndvi}</span>
                  <StatusBadge status={f.status as any} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="dashboard-right">
          {/* Crop Distribution */}
          <div className="dash-card">
            <p className="dash-card-title">Crop distribution</p>
            <div className="crop-bars">
              {cropDistribution.map((c) => (
                <div key={c.crop} className="crop-bar-row">
                  <span className="crop-bar-label">{c.crop}</span>
                  <div className="crop-bar-bg">
                    <div
                      className="crop-bar-fill"
                      style={{
                        width: `${c.percent * 2.5}%`,
                        background: c.color,
                      }}
                    />
                  </div>
                  <span className="crop-bar-val">{c.percent}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts Feed */}
          <div className="dash-card">
            <p className="dash-card-title">Recent alerts</p>
            <div className="alerts-feed">
              {alerts.slice(0, 4).map((a) => (
                <div key={a.id} className="alert-item">
                  <span className={`alert-dot ${a.severity}`} />
                  <div className="alert-body">
                    <p className="alert-text">
                      {a.location} — {a.type}
                    </p>
                    <p className="alert-time">
                      {a.time} · {a.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
