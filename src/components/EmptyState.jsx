import React from 'react';
import { BarChart3, Table, Layers } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="empty-state-card card animate-fade-in">
      <div className="empty-illustration">
        <div className="icon-circle main">
          <BarChart3 size={32} />
        </div>
        <div className="icon-circle sub left">
          <Table size={18} />
        </div>
        <div className="icon-circle sub right">
          <Layers size={18} />
        </div>
      </div>

      <h3 className="empty-title">Your data dashboard will appear here</h3>
      <p className="empty-subtitle">
        Upload a CSV file above or try sample data to generate automated data statistics, interactive tables, charts, and data quality insights.
      </p>

      <div className="empty-features">
        <div className="feature-item">
          <span className="dot" />
          <span>Interactive Bar, Line, Area, Pie & Scatter Charts</span>
        </div>
        <div className="feature-item">
          <span className="dot" />
          <span>Searchable & Sortable Data Table Preview</span>
        </div>
        <div className="feature-item">
          <span className="dot" />
          <span>Automated Data Quality & Missing Value Audit</span>
        </div>
      </div>

      <style>{`
        .empty-state-card {
          text-align: center;
          padding: 3rem 2rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .empty-illustration {
          position: relative;
          width: 100px;
          height: 100px;
          margin: 0 auto 1.5rem auto;
        }

        .icon-circle {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-full);
          position: absolute;
        }

        .icon-circle.main {
          width: 70px;
          height: 70px;
          top: 15px;
          left: 15px;
          background-color: var(--primary-light);
          color: var(--primary);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.15);
        }

        .icon-circle.sub {
          width: 36px;
          height: 36px;
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          color: var(--text-muted);
          box-shadow: var(--shadow-sm);
        }

        .icon-circle.sub.left {
          top: 0;
          left: 0;
        }

        .icon-circle.sub.right {
          bottom: 0;
          right: 0;
        }

        .empty-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.5rem;
        }

        .empty-subtitle {
          font-size: 0.9rem;
          color: var(--text-muted);
          max-width: 520px;
          margin: 0 auto 1.5rem auto;
          line-height: 1.5;
        }

        .empty-features {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: var(--radius-full);
          background-color: var(--primary);
        }
      `}</style>
    </div>
  );
}
