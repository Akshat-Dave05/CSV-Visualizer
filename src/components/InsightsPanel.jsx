import React from 'react';
import { 
  Sparkles, 
  Award, 
  TrendingUp, 
  Calculator, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export default function InsightsPanel({ insights }) {
  if (!insights || insights.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'highlight': return Award;
      case 'trend': return TrendingUp;
      case 'info': return Calculator;
      case 'warning': return AlertTriangle;
      default: return CheckCircle2;
    }
  };

  const getBadgeClass = (type) => {
    switch (type) {
      case 'highlight': return 'badge-primary';
      case 'trend': return 'badge-primary';
      case 'warning': return 'badge-warning';
      default: return 'badge-success';
    }
  };

  return (
    <div className="insights-section animate-fade-in" id="insights">
      <div className="card-header border-0 mb-3">
        <h3 className="card-title">
          <Sparkles size={20} className="text-primary" />
          Automated Data Insights
        </h3>
        <span className="card-subtitle">Key metrics & patterns computed from your dataset</span>
      </div>

      <div className="grid-4 insights-grid">
        {insights.map((item) => {
          const Icon = getIcon(item.type);
          const badgeClass = getBadgeClass(item.type);

          return (
            <div key={item.id} className="insight-card card">
              <div className="insight-card-top">
                <div className="insight-icon-circle">
                  <Icon size={18} className="text-primary" />
                </div>
                <span className={`badge ${badgeClass}`}>{item.badge}</span>
              </div>

              <div className="insight-title">{item.title}</div>
              <div className="insight-metric">{item.metric}</div>
              <p className="insight-description">{item.description}</p>
            </div>
          );
        })}
      </div>

      <style>{`
        .insights-section {
          margin-bottom: 1.5rem;
        }

        .border-0 {
          border: none !important;
        }

        .mb-3 {
          margin-bottom: 1rem;
        }

        .insights-grid {
          gap: 1.25rem;
        }

        .insight-card {
          display: flex;
          flex-direction: column;
          padding: 1.25rem;
        }

        .insight-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .insight-icon-circle {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          background-color: var(--primary-light);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .insight-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
          margin-bottom: 0.25rem;
        }

        .insight-metric {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.5rem;
        }

        .insight-description {
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
}
