import React, { useState, useMemo, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import UploadZone from './components/UploadZone';
import EmptyState from './components/EmptyState';
import FileInfo from './components/FileInfo';
import StatsCards from './components/StatsCards';
import DataPreview from './components/DataPreview';
import VisualizationBuilder from './components/VisualizationBuilder';
import ChartContainer from './components/ChartContainer';
import InsightsPanel from './components/InsightsPanel';
import DataQuality from './components/DataQuality';
import Toast from './components/Toast';
import { DocsModal, AboutModal } from './components/Modals';

import { 
  parseCSV, 
  detectColumnTypes, 
  calculateDatasetStats, 
  calculateDataQuality, 
  generateInsights, 
  aggregateChartData 
} from './utils/csvParser';
import { SAMPLE_DATASETS } from './utils/sampleDatasets';

export default function App() {
  // Data State
  const [parsedData, setParsedData] = useState([]);
  const [fields, setFields] = useState([]);
  const [fileDetails, setFileDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Visualization Configuration State
  const [chartConfig, setChartConfig] = useState({
    chartType: 'bar',
    xAxis: '',
    yAxis: '',
    groupBy: '',
    aggType: 'sum'
  });

  // UI State
  const [toast, setToast] = useState(null);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Process parsed dataset & initialize chart defaults
  const handleDatasetLoaded = useCallback((data, fieldsList, fileName, sizeStr) => {
    if (!data || data.length === 0) {
      showToast('Uploaded CSV file contains no data rows.', 'error');
      return;
    }

    setParsedData(data);
    setFields(fieldsList);

    setFileDetails({
      name: fileName,
      rowCount: data.length,
      columnCount: fieldsList.length,
      fileSize: sizeStr,
      uploadTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    const types = detectColumnTypes(data, fieldsList);
    const numericCols = fieldsList.filter(f => types[f] === 'numeric');
    const categoricalCols = fieldsList.filter(f => types[f] !== 'numeric');

    // Auto-select smart X and Y defaults
    const defaultX = categoricalCols.length > 0 ? categoricalCols[0] : fieldsList[0];
    const defaultY = numericCols.length > 0 ? numericCols[0] : (fieldsList[1] || fieldsList[0]);

    setChartConfig({
      chartType: 'bar',
      xAxis: defaultX,
      yAxis: defaultY,
      groupBy: '',
      aggType: 'sum'
    });

    setActiveTab('overview');
    showToast(`Loaded "${fileName}" (${data.length.toLocaleString()} rows).`, 'success');
  }, []);

  // File Upload Handler
  const handleFileUpload = async (file) => {
    if (!file) return;
    setIsLoading(true);

    try {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      const sizeStr = file.size > 1024 * 1024 ? `${sizeMB} MB` : `${Math.round(file.size / 1024)} KB`;

      const result = await parseCSV(file);
      if (result.error) {
        showToast(result.error, 'error');
      } else {
        handleDatasetLoaded(result.data, result.fields, file.name, sizeStr);
      }
    } catch (err) {
      showToast(`Error reading CSV file: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Sample Dataset Load Handler
  const handleLoadSample = (sampleId) => {
    const sample = SAMPLE_DATASETS.find(s => s.id === sampleId) || SAMPLE_DATASETS[0];
    setIsLoading(true);

    setTimeout(async () => {
      try {
        const result = await parseCSV(sample.csv);
        if (result.error) {
          showToast(result.error, 'error');
        } else {
          handleDatasetLoaded(result.data, result.fields, sample.filename, '14 KB');
        }
      } catch (err) {
        showToast(`Failed to load sample dataset: ${err.message}`, 'error');
      } finally {
        setIsLoading(false);
      }
    }, 150);
  };

  // Reset Dataset
  const handleResetData = () => {
    setParsedData([]);
    setFields([]);
    setFileDetails(null);
    setActiveTab('overview');
    showToast('Dataset cleared.', 'info');
  };

  // Export current data view as CSV
  const handleExportCSV = () => {
    if (parsedData.length === 0) return;
    let csvStr = fields.join(',') + '\n';
    parsedData.forEach(row => {
      const rowVals = fields.map(f => {
        const val = row[f];
        if (val === null || val === undefined) return '""';
        if (typeof val === 'string' && val.includes(',')) return `"${val}"`;
        return val;
      });
      csvStr += rowVals.join(',') + '\n';
    });

    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exported_${fileDetails?.name || 'dataset.csv'}`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported dataset CSV file.', 'success');
  };

  // Computed Analysis & Metrics
  const columnTypes = useMemo(() => detectColumnTypes(parsedData, fields), [parsedData, fields]);
  const datasetStats = useMemo(() => calculateDatasetStats(parsedData, fields), [parsedData, fields]);
  const qualityData = useMemo(() => calculateDataQuality(parsedData, fields), [parsedData, fields]);
  const insights = useMemo(() => generateInsights(parsedData, fields), [parsedData, fields]);

  // Aggregated Chart Data (updates reactively)
  const chartData = useMemo(() => {
    if (!parsedData || parsedData.length === 0 || !chartConfig.xAxis || !chartConfig.yAxis) {
      return [];
    }
    return aggregateChartData(
      parsedData, 
      chartConfig.xAxis, 
      chartConfig.yAxis, 
      chartConfig.groupBy, 
      chartConfig.chartType, 
      chartConfig.aggType
    );
  }, [parsedData, chartConfig]);

  const hasData = parsedData.length > 0;

  return (
    <div className="app-container">
      {/* Top Header Navigation */}
      <Header 
        onOpenDocs={() => setIsDocsOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onLoadSample={handleLoadSample}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Layout Area */}
      <div className="main-layout">
        {/* Desktop Left Sidebar */}
        <Sidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          hasData={hasData}
          onReset={handleResetData}
        />

        {/* Dynamic Content Body */}
        <main className="content-area">
          {!hasData ? (
            <>
              {/* Upload Zone & Empty Placeholder */}
              <UploadZone 
                onFileUpload={handleFileUpload}
                onLoadSample={handleLoadSample}
                isLoading={isLoading}
              />
              <EmptyState onLoadSample={handleLoadSample} />
            </>
          ) : (
            <>
              {/* File Summary Header Card */}
              <FileInfo 
                fileDetails={fileDetails}
                onReset={handleResetData}
                onExport={handleExportCSV}
              />

              {/* Summary Statistics Cards */}
              <StatsCards stats={datasetStats} />

              {/* Tab Navigation Content */}
              {activeTab === 'overview' && (
                <>
                  <VisualizationBuilder 
                    fields={fields}
                    columnTypes={columnTypes}
                    config={chartConfig}
                    onConfigChange={setChartConfig}
                  />
                  <ChartContainer 
                    config={chartConfig}
                    chartData={chartData}
                  />
                  <DataPreview 
                    data={parsedData}
                    fields={fields}
                    columnTypes={columnTypes}
                  />
                  <InsightsPanel insights={insights} />
                  <DataQuality stats={datasetStats} qualityData={qualityData} />
                </>
              )}

              {activeTab === 'preview' && (
                <DataPreview 
                  data={parsedData}
                  fields={fields}
                  columnTypes={columnTypes}
                />
              )}

              {activeTab === 'visualization' && (
                <>
                  <VisualizationBuilder 
                    fields={fields}
                    columnTypes={columnTypes}
                    config={chartConfig}
                    onConfigChange={setChartConfig}
                  />
                  <ChartContainer 
                    config={chartConfig}
                    chartData={chartData}
                  />
                </>
              )}

              {activeTab === 'insights' && (
                <InsightsPanel insights={insights} />
              )}

              {activeTab === 'quality' && (
                <DataQuality stats={datasetStats} qualityData={qualityData} />
              )}
            </>
          )}
        </main>
      </div>

      {/* Global Modals & Toasts */}
      <Toast toast={toast} onClose={() => setToast(null)} />
      <DocsModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}
