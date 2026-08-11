import React from 'react';
import { 
  LayoutDashboard, 
  Table, 
  BarChart2, 
  Sparkles, 
  ShieldCheck, 
  UploadCloud,
  FileSpreadsheet
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  hasData, 
  onReset 
}) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'preview', label: 'Data Preview', icon: Table },
    { id: 'visualization', label: 'Visualizations', icon: BarChart2 },
    { id: 'insights', label: 'Insights', icon: Sparkles },
    { id: 'quality', label: 'Data Quality', icon: ShieldCheck }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <div className="sidebar-section-title">NAVIGATION</div>
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`sidebar-link ${isActive ? 'active' : ''} ${!hasData && item.id !== 'overview' ? 'disabled' : ''}`}
                disabled={!hasData && item.id !== 'overview'}
              >
                <Icon size={18} className="sidebar-icon" />
                <span>{item.label}</span>
                {isActive && <div className="active-indicator" />}
              </button>
            );
          })}
        </nav>

        {hasData && (
          <div className="sidebar-footer">
            <div className="sidebar-card">
              <div className="sidebar-card-title">
                <FileSpreadsheet size={16} className="text-primary" />
                <span>Active Dataset</span>
              </div>
              <p className="sidebar-card-text">Explore data preview, build charts, or review quality metrics.</p>
              <button onClick={onReset} className="btn btn-outline btn-sm full-width mt-2">
                <UploadCloud size={14} />
                <span>Upload New CSV</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .sidebar {
          width: var(--sidebar-width);
          background-color: var(--bg-sidebar);
          border-right: 1px solid var(--border-color);
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          transition: background-color 0.25s ease, border-color 0.25s ease;
        }

        .sidebar-content {
          padding: 1.25rem 1rem;
          display: flex;
          flex-direction: column;
          height: 100%;
          position: sticky;
          top: var(--header-height);
        }

        .sidebar-section-title {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--text-light);
          letter-spacing: 0.08em;
          margin-bottom: 0.75rem;
          padding-left: 0.5rem;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 0.85rem;
          color: var(--text-muted);
          font-size: 0.875rem;
          font-weight: 500;
          background: transparent;
          border: none;
          border-radius: var(--radius-md);
          cursor: pointer;
          position: relative;
          transition: all 0.15s ease;
          text-align: left;
        }

        .sidebar-link:hover:not(.disabled) {
          color: var(--text-main);
          background-color: var(--bg-secondary);
        }

        .sidebar-link.active {
          color: var(--primary);
          background-color: var(--primary-light);
          font-weight: 600;
        }

        .sidebar-link.disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .sidebar-icon {
          flex-shrink: 0;
        }

        .active-indicator {
          position: absolute;
          right: 0;
          top: 20%;
          bottom: 20%;
          width: 3px;
          background-color: var(--primary);
          border-radius: var(--radius-full);
        }

        .sidebar-footer {
          margin-top: auto;
          padding-top: 1.5rem;
        }

        .sidebar-card {
          background-color: var(--bg-app);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 0.85rem;
        }

        .sidebar-card-title {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-main);
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-bottom: 0.35rem;
        }

        .sidebar-card-text {
          font-size: 0.75rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        .mt-2 {
          margin-top: 0.75rem;
        }

        @media (max-width: 1024px) {
          .sidebar {
            display: none;
          }
        }
      `}</style>
    </aside>
  );
}
