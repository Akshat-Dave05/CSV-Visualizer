import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Layers 
} from 'lucide-react';

export default function DataQuality({ stats, qualityData }) {
  if (!stats || !qualityData) return null;

  const renderStatusBadge = (status, textGood = 'Good', textWarn = 'Needs Attention', textIssue = 'Issue Detected') => {
    if (status === 'good') {
      return (
        <span className="badge badge-success">
          <CheckCircle2 size={12} /> {textGood}
        </span>
      );
    }
    if (status === 'warning') {
      return (
        <span className="badge badge-warning">
          <AlertTriangle size={12} /> {textWarn}
        </span>
      );
    }
    return (
      <span className="badge badge-error">
        <XCircle size={12} /> {textIssue}
      </span>
    );
  };

  return (
    <div className="data-quality-card card animate-fade-in" id="quality">
      <div className="card-header">
        <h3 className="card-title">
          <ShieldCheck size={18} className="text-primary" />
          Data Quality & Health Audit
        </h3>
        <span className="card-subtitle">Comprehensive column integrity and null check summary</span>
      </div>

      {/* Quality Summary Badges Row */}
      <div className="grid-4 quality-summary-grid">
        <div className="quality-stat-box">
          <span className="q-label">Missing Values</span>
          <div className="q-val">{stats.missingValues.toLocaleString()}</div>
          {renderStatusBadge(stats.missingValues === 0 ? 'good' : stats.missingValues > 50 ? 'issue' : 'warning')}
        </div>

        <div className="quality-stat-box">
          <span className="q-label">Duplicate Rows</span>
          <div className="q-val">{stats.duplicateRows.toLocaleString()}</div>
          {renderStatusBadge(stats.duplicateRows === 0 ? 'good' : 'warning', 'No Duplicates', `${stats.duplicateRows} Duplicates`)}
        </div>

        <div className="quality-stat-box">
          <span className="q-label">Numeric Columns</span>
          <div className="q-val">{stats.numericColumns}</div>
          {renderStatusBadge('good', `${stats.numericColumns} Valid`)}
        </div>

        <div className="quality-stat-box">
          <span className="q-label">Categorical & Date</span>
          <div className="q-val">{stats.categoricalColumns + stats.dateColumns}</div>
          {renderStatusBadge('good', 'Categorized')}
        </div>
      </div>

      {/* Column Detail Table */}
      <div className="quality-table-wrapper">
        <h4 className="table-subtitle">
          <Layers size={14} /> Column Details Breakdown
        </h4>
        <table className="quality-table">
          <thead>
            <tr>
              <th>Column Name</th>
              <th>Detected Type</th>
              <th>Null Count</th>
              <th>Missing %</th>
              <th>Unique Values</th>
              <th>Min / Max / Avg</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {qualityData.map((col) => (
              <tr key={col.field}>
                <td className="font-semibold">{col.field}</td>
                <td>
                  <span className="type-badge-sm">{col.type}</span>
                </td>
                <td>{col.nullCount}</td>
                <td>{col.missingPercentage}%</td>
                <td>{col.uniqueCount.toLocaleString()}</td>
                <td className="text-muted text-xs">
                  {col.type === 'numeric' ? `${col.min} / ${col.max} (avg ${col.avg})` : 'N/A'}
                </td>
                <td>{renderStatusBadge(col.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .data-quality-card {
          margin-bottom: 1.5rem;
        }

        .quality-summary-grid {
          margin-bottom: 1.5rem;
          gap: 1rem;
        }

        .quality-stat-box {
          background-color: var(--bg-app);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .q-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .q-val {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .quality-table-wrapper {
          overflow-x: auto;
        }

        .table-subtitle {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-main);
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .quality-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.825rem;
          text-align: left;
        }

        .quality-table th {
          padding: 0.6rem 0.85rem;
          background-color: var(--bg-secondary);
          color: var(--text-main);
          font-weight: 600;
          border-bottom: 1px solid var(--border-color);
        }

        .quality-table td {
          padding: 0.6rem 0.85rem;
          border-bottom: 1px solid var(--border-color);
          color: var(--text-main);
        }

        .font-semibold {
          font-weight: 600;
        }

        .type-badge-sm {
          font-size: 0.7rem;
          font-weight: 500;
          background-color: var(--bg-secondary);
          color: var(--text-muted);
          padding: 0.1rem 0.4rem;
          border-radius: var(--radius-sm);
          text-transform: uppercase;
        }
      `}</style>
    </div>
  );
}
