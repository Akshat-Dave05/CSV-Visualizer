import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { SAMPLE_DATASETS } from '../utils/sampleDatasets';

export default function UploadZone({ onFileUpload, onLoadSample, isLoading }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragError, setDragError] = useState('');
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setDragError('');

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.name.endsWith('.csv') || file.type === 'text/csv' || file.type === 'application/vnd.ms-excel') {
        onFileUpload(file);
      } else {
        setDragError('Please drop a valid .CSV file.');
      }
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileUpload(files[0]);
    }
  };

  return (
    <div className="upload-zone-wrapper animate-fade-in">
      {/* Drag & Drop Card */}
      <div 
        className={`upload-card ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          accept=".csv,text/csv,application/vnd.ms-excel" 
          className="hidden-file-input"
        />

        <div className="upload-icon-wrapper">
          <UploadCloud size={36} className="upload-icon" />
        </div>

        <h2 className="upload-title">Upload your CSV file</h2>
        <p className="upload-description">
          Drag and drop your CSV file here, or click to browse from your computer.
        </p>

        <div className="upload-action-row">
          <button 
            type="button"
            className="btn btn-primary btn-lg shadow-sm"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner">⏳</span>
                <span>Parsing CSV...</span>
              </>
            ) : (
              <>
                <FileSpreadsheet size={18} />
                <span>Browse Files</span>
              </>
            )}
          </button>
        </div>

        {dragError && (
          <div className="drag-error-msg">
            <AlertCircle size={15} />
            <span>{dragError}</span>
          </div>
        )}

        <div className="upload-footer-info">
          <span className="info-badge">
            <CheckCircle2 size={13} className="text-success" /> Supported format: .CSV
          </span>
          <span className="info-separator">•</span>
          <span>Max file size: 25 MB</span>
          <span className="info-separator">•</span>
          <span>Local Browser Processing</span>
        </div>
      </div>

      {/* Sample Datasets Bar */}
      <div className="sample-datasets-card">
        <div className="sample-header">
          <div className="sample-title">
            <Sparkles size={18} className="text-primary" />
            <span>Don't have a CSV handy? Try sample datasets:</span>
          </div>
        </div>
        <div className="sample-buttons-grid">
          {SAMPLE_DATASETS.map((ds) => (
            <button
              key={ds.id}
              onClick={() => onLoadSample(ds.id)}
              className="sample-btn"
            >
              <div className="sample-btn-title">{ds.name}</div>
              <div className="sample-btn-desc">{ds.description}</div>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .upload-zone-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 900px;
          margin: 1rem auto 2rem auto;
        }

        .upload-card {
          background-color: var(--bg-card);
          border: 2px dashed var(--border-color);
          border-radius: var(--radius-lg);
          padding: 3rem 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: var(--shadow-sm);
          position: relative;
        }

        .upload-card:hover {
          border-color: var(--primary);
          background-color: var(--bg-card-hover);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .upload-card.drag-over {
          border-color: var(--primary);
          background-color: var(--primary-light);
          transform: scale(1.01);
        }

        .hidden-file-input {
          display: none;
        }

        .upload-icon-wrapper {
          width: 72px;
          height: 72px;
          border-radius: var(--radius-full);
          background-color: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.25rem auto;
          transition: transform 0.2s ease;
        }

        .upload-card:hover .upload-icon-wrapper {
          transform: scale(1.08);
        }

        .upload-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.5rem;
        }

        .upload-description {
          font-size: 0.95rem;
          color: var(--text-muted);
          max-width: 500px;
          margin: 0 auto 1.75rem auto;
        }

        .upload-action-row {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .drag-error-msg {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--error);
          background-color: var(--error-bg);
          border: 1px solid var(--error-border);
          padding: 0.4rem 0.8rem;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          margin-bottom: 1rem;
        }

        .upload-footer-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          font-size: 0.8rem;
          color: var(--text-muted);
          flex-wrap: wrap;
        }

        .info-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-weight: 500;
        }

        .info-separator {
          color: var(--border-color);
        }

        .sample-datasets-card {
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 1.25rem;
        }

        .sample-header {
          margin-bottom: 1rem;
        }

        .sample-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-main);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .sample-buttons-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.85rem;
        }

        .sample-btn {
          background-color: var(--bg-app);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 0.85rem;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .sample-btn:hover {
          border-color: var(--primary);
          background-color: var(--primary-light);
          transform: translateY(-1px);
        }

        .sample-btn-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .sample-btn-desc {
          font-size: 0.75rem;
          color: var(--text-muted);
          line-height: 1.3;
        }

        @media (max-width: 768px) {
          .sample-buttons-grid {
            grid-template-columns: 1fr;
          }
          .upload-card {
            padding: 2rem 1rem;
          }
        }
      `}</style>
    </div>
  );
}
