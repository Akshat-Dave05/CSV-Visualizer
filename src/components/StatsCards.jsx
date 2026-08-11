import React from 'react';
import { 
  Rows, 
  Columns, 
  Hash, 
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

export default function StatsCards({ stats }) {
  if (!stats) return null;

  const cards = [
    {
      id: 'total_rows',
      title: 'Total Rows',
      value: stats.totalRows ? stats.totalRows.toLocaleString() : '0',
      subtitle: 'All dataset rows',
      icon: Rows,
      colorClass: 'text-primary',
      bgClass: 'bg-primary-light'
    },
    {
      id: 'total_columns',
      title: 'Total Columns',
      value: stats.totalColumns || '0',
      subtitle: `${stats.categoricalColumns || 0} text · ${stats.dateColumns || 0} date`,
      icon: Columns,
      colorClass: 'text-blue',
      bgClass: 'bg-blue-light'
    },
    {
      id: 'numeric_columns',
      title: 'Numeric Columns',
      value: stats.numericColumns || '0',
      subtitle: 'Columns with numbers',
      icon: Hash,
      colorClass: 'text-success',
      bgClass: 'bg-success-light'
    },
    {
      id: 'missing_values',
      title: 'Missing Values',
      value: stats.missingValues !== undefined ? stats.missingValues.toLocaleString() : '0',
      subtitle: stats.missingValues > 0 ? 'Across all cells' : '100% Complete',
      icon: stats.missingValues > 0 ? AlertTriangle : CheckCircle2,
      colorClass: stats.missingValues > 0 ? 'text-warning' : 'text-success',
      bgClass: stats.missingValues > 0 ? 'bg-warning-light' : 'bg-success-light'
    }
  ];

  return (
    <div className="grid-4 stats-grid animate-fade-in">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.id} className="stat-card card">
            <div className="stat-card-top">
              <span className="stat-label">{card.title}</span>
              <div className={`stat-icon-wrapper ${card.bgClass}`}>
                <Icon size={18} className={card.colorClass} />
              </div>
            </div>
            <div className="stat-value">{card.value}</div>
            <div className="stat-subtitle">{card.subtitle}</div>
          </div>
        );
      })}

      <style>{`
        .stats-grid {
          margin-bottom: 1.5rem;
        }

        .stat-card {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
        }

        .stat-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .stat-icon-wrapper {
          width: 34px;
          height: 34px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bg-primary-light {
          background-color: var(--primary-light);
        }
        .bg-blue-light {
          background-color: var(--primary-light);
        }
        .bg-success-light {
          background-color: var(--success-bg);
        }
        .bg-warning-light {
          background-color: var(--warning-bg);
        }

        .text-blue {
          color: var(--primary);
        }
        .text-success {
          color: var(--success);
        }
        .text-warning {
          color: var(--warning);
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-main);
          line-height: 1.2;
          margin-bottom: 0.25rem;
        }

        .stat-subtitle {
          font-size: 0.775rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
