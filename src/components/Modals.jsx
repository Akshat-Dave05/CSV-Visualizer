import React from 'react';
import { X, FileText, Info, Check, Sparkles, ShieldCheck } from 'lucide-react';

export function DocsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            <FileText size={20} className="text-primary" />
            CSV Visualizer Documentation
          </h3>
          <button onClick={onClose} className="btn-ghost icon-btn" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <h4>1. Quick Start Guide</h4>
          <p>
            Upload any standard <code>.CSV</code> file using the drag-and-drop zone or click "Browse Files". You can also test the dashboard immediately by clicking "Try Sample Data".
          </p>

          <h4>2. File Formatting Guidelines</h4>
          <ul>
            <li>Ensure the first row contains descriptive column headers.</li>
            <li>Supported delimiters include commas (<code>,</code>), semicolons (<code>;</code>), and tabs (<code>\t</code>).</li>
            <li>Numerical fields should use standard numbers without currency symbols or trailing letters for best chart auto-detection.</li>
          </ul>

          <h4>3. Chart Customization</h4>
          <p>
            Choose between <strong>Bar</strong>, <strong>Line</strong>, <strong>Area</strong>, <strong>Pie</strong>, and <strong>Scatter</strong> plot visualizations. Select appropriate X and Y axis columns, and choose an aggregation mode (Sum, Average, or Count) when grouping data.
          </p>

          <h4>4. Data Privacy</h4>
          <p>
            All CSV parsing and visualization happens completely offline in your local browser using client-side JavaScript. Your file data is never sent to any external server.
          </p>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-primary btn-sm">Got it!</button>
        </div>
      </div>
      <style>{modalStyles}</style>
    </div>
  );
}

export function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            <Info size={20} className="text-primary" />
            About CSV Visualizer
          </h3>
          <button onClick={onClose} className="btn-ghost icon-btn" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="about-hero">
            <div className="hero-icon">
              <Sparkles size={28} className="text-primary" />
            </div>
            <h4>CSV Visualizer SaaS Edition</h4>
            <p className="text-muted text-xs">Version 1.0.0 • Built with React & Recharts</p>
          </div>

          <p>
            CSV Visualizer is a beginner-friendly, production-grade data analytics dashboard. It empowers users to explore CSV datasets, run real-time table queries, inspect data quality, and generate visually stunning interactive charts.
          </p>

          <div className="features-checklist">
            <div className="check-item"><Check size={14} className="text-success" /> React 18 Modular Architecture</div>
            <div className="check-item"><Check size={14} className="text-success" /> PapaParse Local Browser CSV Parser</div>
            <div className="check-item"><Check size={14} className="text-success" /> Recharts Responsive Visualization Engine</div>
            <div className="check-item"><Check size={14} className="text-success" /> Full Light & Dark Theme Support</div>
            <div className="check-item"><Check size={14} className="text-success" /> Automated Quality & Health Auditing</div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary btn-sm">Close</button>
        </div>
      </div>
      <style>{modalStyles}</style>
    </div>
  );
}

const modalStyles = `
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(4px);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  .modal-content {
    width: 100%;
    max-width: 550px;
    max-height: 85vh;
    overflow-y: auto;
    padding: 1.5rem;
    box-shadow: var(--shadow-lg);
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 1rem;
  }

  .modal-title {
    font-size: 1.1rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .icon-btn {
    padding: 0.25rem;
    border-radius: var(--radius-sm);
  }

  .modal-body {
    font-size: 0.875rem;
    color: var(--text-main);
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    line-height: 1.5;
  }

  .modal-body h4 {
    font-size: 0.95rem;
    font-weight: 700;
    margin-top: 0.5rem;
    color: var(--text-main);
  }

  .modal-body code {
    background-color: var(--bg-secondary);
    padding: 0.1rem 0.35rem;
    border-radius: var(--radius-sm);
    font-size: 0.8rem;
  }

  .modal-body ul {
    padding-left: 1.25rem;
  }

  .about-hero {
    text-align: center;
    margin-bottom: 0.5rem;
  }

  .hero-icon {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-full);
    background-color: var(--primary-light);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 0.5rem auto;
  }

  .features-checklist {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    background-color: var(--bg-secondary);
    padding: 0.85rem;
    border-radius: var(--radius-sm);
  }

  .check-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 1.25rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--border-color);
  }
`;
