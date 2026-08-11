import React from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  PieChart as PieIcon, 
  ScatterChart as ScatterIcon, 
  Layers, 
  SlidersHorizontal 
} from 'lucide-react';

export default function VisualizationBuilder({ 
  fields, 
  columnTypes, 
  config, 
  onConfigChange 
}) {
  const chartTypes = [
    { id: 'bar', label: 'Bar Chart', icon: BarChart2 },
    { id: 'line', label: 'Line Chart', icon: TrendingUp },
    { id: 'area', label: 'Area Chart', icon: Layers },
    { id: 'pie', label: 'Pie Chart', icon: PieIcon },
    { id: 'scatter', label: 'Scatter Plot', icon: ScatterIcon }
  ];

  const numericFields = fields.filter(f => columnTypes[f] === 'numeric');
  const categoricalFields = fields.filter(f => columnTypes[f] !== 'numeric');

  return (
    <div className="builder-card card animate-fade-in" id="visualization">
      <div className="card-header">
        <h3 className="card-title">
          <SlidersHorizontal size={17} className="text-primary" />
          Visualization Controls
        </h3>
        <span className="card-subtitle">Select chart type and axes (updates instantly)</span>
      </div>

      <div className="builder-body">
        {/* 1. Chart Type Selector */}
        <div className="form-group">
          <label className="form-label">Chart Type</label>
          <div className="chart-type-grid">
            {chartTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = config.chartType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => onConfigChange({ ...config, chartType: type.id })}
                  className={`chart-type-btn ${isSelected ? 'active' : ''}`}
                >
                  <Icon size={18} className={isSelected ? 'text-primary' : 'text-muted'} />
                  <span>{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Axis Controls Grid */}
        <div className="grid-3 controls-grid">
          {/* X-Axis */}
          <div className="form-group">
            <label className="form-label">
              {config.chartType === 'pie' ? 'Category Column' : 'X-Axis Column'}
            </label>
            <select 
              value={config.xAxis} 
              onChange={(e) => onConfigChange({ ...config, xAxis: e.target.value })}
              className="form-select"
            >
              {fields.map(f => (
                <option key={f} value={f}>
                  {f} ({columnTypes[f] || 'text'})
                </option>
              ))}
            </select>
          </div>

          {/* Y-Axis */}
          <div className="form-group">
            <label className="form-label">
              {config.chartType === 'pie' ? 'Value Column' : 'Y-Axis Column'}
            </label>
            <select 
              value={config.yAxis} 
              onChange={(e) => onConfigChange({ ...config, yAxis: e.target.value })}
              className="form-select"
            >
              {numericFields.length > 0 ? (
                numericFields.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))
              ) : (
                fields.map(f => <option key={f} value={f}>{f}</option>)
              )}
            </select>
          </div>

          {/* Group By (Optional for Bar/Line/Area) */}
          {config.chartType !== 'pie' && config.chartType !== 'scatter' && (
            <div className="form-group">
              <label className="form-label">Group By (Optional)</label>
              <select 
                value={config.groupBy || ''} 
                onChange={(e) => onConfigChange({ ...config, groupBy: e.target.value })}
                className="form-select"
              >
                <option value="">None (Single Series)</option>
                {categoricalFields.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          )}

          {/* Aggregation Mode */}
          {config.chartType !== 'scatter' && (
            <div className="form-group">
              <label className="form-label">Aggregation Mode</label>
              <select 
                value={config.aggType || 'sum'} 
                onChange={(e) => onConfigChange({ ...config, aggType: e.target.value })}
                className="form-select"
              >
                <option value="sum">Sum Total</option>
                <option value="avg">Average</option>
                <option value="count">Count Rows</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .builder-card {
          margin-bottom: 1.25rem;
          min-width: 0;
        }

        .builder-body {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          min-width: 0;
        }

        .chart-type-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 0.5rem;
          width: 100%;
        }

        .chart-type-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.5rem;
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          color: var(--text-main);
          font-size: 0.775rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
          min-width: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .chart-type-btn:hover {
          border-color: var(--border-focus);
          background-color: var(--bg-secondary);
        }

        .chart-type-btn.active {
          border-color: var(--primary);
          background-color: var(--primary-light);
          color: var(--primary);
          font-weight: 600;
        }

        .controls-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 0.85rem;
          width: 100%;
        }
      `}</style>
    </div>
  );
}
