import React from 'react';
import { 
  FileSpreadsheet, 
  CheckCircle2, 
  RefreshCw, 
  Download, 
  Clock 
} from 'lucide-react';

export default function FileInfo({ fileDetails, onReset, onExport }) {
  if (!fileDetails) return null;

  return (
    <div className="file-info-card card animate-fade-in">
      <div className="file-info-main">
        <div className="file-icon-box">
          <FileSpreadsheet size={28} className="text-primary" />
        </div>

        <div className="file-details">
          <div className="file-header-row">
            <h3 className="file-name">{fileDetails.name}</h3>
            <span className="badge badge-success">
              <CheckCircle2 size={13} /> Uploaded & Parsed
            </span>
          </div>

          <div className="file-meta-row">
            <div className="meta-item">
              <span className="meta-value">{fileDetails.rowCount.toLocaleString()}</span>
              <span className="meta-label">Rows</span>
            </div>
            <span className="meta-sep">•</span>
            <div className="meta-item">
              <span className="meta-value">{fileDetails.columnCount}</span>
              <span className="meta-label">Columns</span>
            </div>
            <span className="meta-sep">•</span>
            <div className="meta-item">
              <span className="meta-value">{fileDetails.fileSize}</span>
              <span className="meta-label">File Size</span>
            </div>
            <span className="meta-sep">•</span>
            <div className="meta-item">
              <Clock size={12} className="text-muted" />
              <span className="meta-label">{fileDetails.uploadTime || 'Just now'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="file-actions">
        <button 
          onClick={onExport} 
          className="btn btn-secondary btn-sm"
          title="Export current view as CSV"
        >
          <Download size={14} />
          <span>Export CSV</span>
        </button>

        <button 
          onClick={onReset} 
          className="btn btn-outline btn-sm"
          title="Replace or upload a new file"
        >
          <RefreshCw size={14} />
          <span>Replace File</span>
        </button>
      </div>

      <style>{`
        .file-info-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          margin-bottom: 1.25rem;
          gap: 1rem;
          flex-wrap: wrap;
          min-width: 0;
          width: 100%;
        }

        .file-info-main {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          min-width: 0;
          flex: 1;
        }

        .file-icon-box {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          background-color: var(--primary-light);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .file-details {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          min-width: 0;
        }

        .file-header-row {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-wrap: wrap;
          min-width: 0;
        }

        .file-name {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-main);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        .file-meta-row {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.825rem;
          color: var(--text-muted);
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          white-space: nowrap;
        }

        .meta-value {
          font-weight: 600;
          color: var(--text-main);
        }

        .meta-label {
          color: var(--text-muted);
        }

        .meta-sep {
          color: var(--border-color);
        }

        .file-actions {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-shrink: 0;
        }

        @media (max-width: 640px) {
          .file-info-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .file-actions {
            width: 100%;
          }
          .file-actions .btn {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
}
