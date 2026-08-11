import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  Download, 
  Maximize2, 
  Minimize2, 
  BarChart2, 
  TrendingUp, 
  PieChart as PieIcon, 
  ScatterChart as ScatterIcon,
  Layers
} from 'lucide-react';

const COLORS = [
  '#2563eb', '#10b981', '#f59e0b', '#ef4444', 
  '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'
];

export default function ChartContainer({ config, chartData }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="card chart-card text-center p-5">
        <p className="text-muted">No valid numeric data available for selected axes.</p>
      </div>
    );
  }

  // Extract keys if grouped
  const sampleItem = chartData[0] || {};
  const dataKeys = Object.keys(sampleItem).filter(k => k !== 'name' && k !== 'index' && k !== 'value');

  // Chart Title
  const getChartTitle = () => {
    if (config.chartType === 'pie') {
      return `${config.yAxis} distribution by ${config.xAxis}`;
    }
    if (config.chartType === 'scatter') {
      return `${config.yAxis} vs ${config.xAxis} Scatter Correlation`;
    }
    return `${config.yAxis} by ${config.xAxis}${config.groupBy ? ` (Grouped by ${config.groupBy})` : ''}`;
  };

  const getChartIcon = () => {
    switch (config.chartType) {
      case 'line': return TrendingUp;
      case 'area': return Layers;
      case 'pie': return PieIcon;
      case 'scatter': return ScatterIcon;
      default: return BarChart2;
    }
  };

  const ChartIcon = getChartIcon();

  // Color tokens
  const textColor = '#64748b';
  const gridColor = '#e2e8f0';

  // Custom SVG Tooltip Card
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-title">{label}</p>
          {payload.map((entry, idx) => (
            <p key={idx} className="tooltip-item" style={{ color: entry.color || COLORS[0] }}>
              <span className="tooltip-name">{entry.name}:</span>
              <span className="tooltip-val">{Number(entry.value).toLocaleString()}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Download Chart Summary CSV
  const handleExportSummary = () => {
    let csvStr = 'Name,Value\n';
    chartData.forEach(row => {
      csvStr += `"${row.name}",${row.value || 0}\n`;
    });
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chart_summary_${config.chartType}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderChartContent = (height = 360) => {
    return (
      <ResponsiveContainer width="100%" height={height}>
        {config.chartType === 'line' ? (
          <LineChart data={chartData} margin={{ top: 15, right: 25, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" stroke={textColor} fontSize={12} tickLine={false} />
            <YAxis stroke={textColor} fontSize={12} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: 8 }} />
            {dataKeys.length > 0 ? (
              dataKeys.map((key, idx) => (
                <Line 
                  key={key} 
                  type="monotone" 
                  dataKey={key} 
                  stroke={COLORS[idx % COLORS.length]} 
                  strokeWidth={2.2} 
                  dot={{ r: 3.5 }}
                  activeDot={{ r: 6 }}
                />
              ))
            ) : (
              <Line 
                type="monotone" 
                dataKey="value" 
                name={config.yAxis} 
                stroke={COLORS[0]} 
                strokeWidth={2.2} 
                dot={{ r: 3.5 }}
                activeDot={{ r: 6 }}
              />
            )}
          </LineChart>
        ) : config.chartType === 'area' ? (
          <AreaChart data={chartData} margin={{ top: 15, right: 25, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" stroke={textColor} fontSize={12} tickLine={false} />
            <YAxis stroke={textColor} fontSize={12} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: 8 }} />
            {dataKeys.length > 0 ? (
              dataKeys.map((key, idx) => (
                <Area 
                  key={key} 
                  type="monotone" 
                  dataKey={key} 
                  stroke={COLORS[idx % COLORS.length]} 
                  fill={COLORS[idx % COLORS.length]} 
                  fillOpacity={0.15}
                />
              ))
            ) : (
              <Area 
                type="monotone" 
                dataKey="value" 
                name={config.yAxis} 
                stroke={COLORS[0]} 
                fill={COLORS[0]} 
                fillOpacity={0.15}
              />
            )}
          </AreaChart>
        ) : config.chartType === 'pie' ? (
          <PieChart margin={{ top: 15, right: 25, left: 10, bottom: 20 }}>
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: 8 }} />
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={115}
              innerRadius={45}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        ) : config.chartType === 'scatter' ? (
          <ScatterChart margin={{ top: 15, right: 25, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey={config.xAxis} stroke={textColor} fontSize={12} name={config.xAxis} />
            <YAxis dataKey={config.yAxis} stroke={textColor} fontSize={12} name={config.yAxis} />
            <Tooltip content={<CustomTooltip />} />
            <Scatter name="Data Points" data={chartData} fill={COLORS[0]} />
          </ScatterChart>
        ) : (
          <BarChart data={chartData} margin={{ top: 15, right: 25, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" stroke={textColor} fontSize={12} tickLine={false} />
            <YAxis stroke={textColor} fontSize={12} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: 8 }} />
            {dataKeys.length > 0 ? (
              dataKeys.map((key, idx) => (
                <Bar 
                  key={key} 
                  dataKey={key} 
                  fill={COLORS[idx % COLORS.length]} 
                  radius={[4, 4, 0, 0]} 
                />
              ))
            ) : (
              <Bar 
                dataKey="value" 
                name={config.yAxis} 
                fill={COLORS[0]} 
                radius={[4, 4, 0, 0]} 
              />
            )}
          </BarChart>
        )}
      </ResponsiveContainer>
    );
  };

  return (
    <>
      <div className={`card chart-display-card animate-fade-in ${isFullscreen ? 'fullscreen-mode' : ''}`}>
        <div className="card-header">
          <div className="chart-title-group">
            <ChartIcon size={18} className="text-primary" />
            <div>
              <h3 className="card-title">{getChartTitle()}</h3>
              <span className="badge badge-primary mt-1">
                {config.chartType.toUpperCase()} • {chartData.length} Data Points
              </span>
            </div>
          </div>

          <div className="chart-actions">
            <button 
              onClick={handleExportSummary} 
              className="btn btn-secondary btn-sm"
              title="Download summary CSV"
            >
              <Download size={13} />
              <span>Export CSV</span>
            </button>

            <button 
              onClick={() => setIsFullscreen(!isFullscreen)} 
              className="btn btn-secondary btn-sm"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </button>
          </div>
        </div>

        <div className="chart-canvas-wrapper">
          {renderChartContent(isFullscreen ? 580 : 360)}
        </div>
      </div>

      <style>{`
        .chart-display-card {
          margin-bottom: 1.25rem;
          min-width: 0;
          width: 100%;
        }

        .chart-title-group {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          min-width: 0;
        }

        .mt-1 {
          margin-top: 0.15rem;
        }

        .chart-actions {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-shrink: 0;
        }

        .chart-canvas-wrapper {
          padding-top: 0.5rem;
          width: 100%;
          min-width: 0;
          overflow: hidden;
        }

        .custom-tooltip {
          padding: 0.6rem 0.75rem;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          box-shadow: var(--shadow-md);
          font-size: 0.8rem;
          background-color: #ffffff;
          color: #0f172a;
        }

        .tooltip-title {
          font-weight: 700;
          margin-bottom: 0.25rem;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 0.2rem;
        }

        .tooltip-item {
          display: flex;
          justify-content: space-between;
          gap: 0.85rem;
          font-size: 0.775rem;
        }

        .tooltip-name {
          font-weight: 500;
        }

        .tooltip-val {
          font-weight: 700;
        }

        .fullscreen-mode {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1000;
          border-radius: 0;
          overflow: auto;
          background-color: var(--bg-card);
          padding: 2rem;
        }
      `}</style>
    </>
  );
}
