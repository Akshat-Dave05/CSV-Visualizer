import React from 'react';
import { 
  BarChart3, 
  FileText, 
  Info, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';

export default function Header({ 
  onOpenDocs, 
  onOpenAbout, 
  onLoadSample, 
  mobileMenuOpen, 
  setMobileMenuOpen 
}) {
  return (
    <header className="header-bar">
      <div className="header-container">
        {/* Brand / Logo */}
        <div className="header-brand">
          <div className="logo-icon">
            <BarChart3 size={20} className="text-primary" />
          </div>
          <div className="brand-text">
            <div className="brand-title">
              CSV Visualizer
            </div>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="header-nav">
          <button 
            onClick={() => onLoadSample('sales_2026')} 
            className="btn btn-outline btn-sm shadow-sm"
            title="Load sample dataset instantly"
          >
            <Sparkles size={14} />
            <span>Try Sample Data</span>
          </button>

          <button 
            onClick={onOpenDocs} 
            className="header-link"
            title="Read application documentation"
          >
            <FileText size={15} />
            <span>Documentation</span>
          </button>

          <button 
            onClick={onOpenAbout} 
            className="header-link"
            title="About CSV Visualizer"
          >
            <Info size={15} />
            <span>About</span>
          </button>

          {/* GitHub Repository Link */}
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="github-link"
            title="View on GitHub"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
              <path d="M9 18c-4.51 2-5-2-7-2"></path>
            </svg>
          </a>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button 
          className="mobile-menu-btn" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-drawer animate-fade-in">
          <button onClick={() => { onLoadSample('sales_2026'); setMobileMenuOpen(false); }} className="mobile-drawer-item">
            <Sparkles size={15} />
            <span>Try Sample Data</span>
          </button>
          <button onClick={() => { onOpenDocs(); setMobileMenuOpen(false); }} className="mobile-drawer-item">
            <FileText size={15} />
            <span>Documentation</span>
          </button>
          <button onClick={() => { onOpenAbout(); setMobileMenuOpen(false); }} className="mobile-drawer-item">
            <Info size={15} />
            <span>About</span>
          </button>
        </div>
      )}

      <style>{`
        .header-bar {
          background-color: var(--bg-card);
          border-bottom: 1px solid var(--border-color);
          position: sticky;
          top: 0;
          z-index: 100;
          width: 100%;
        }

        .header-container {
          max-width: 1600px;
          width: 100%;
          margin: 0 auto;
          padding: 0.65rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-width: 0;
        }

        .header-brand {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          flex-shrink: 0;
        }

        .logo-icon {
          width: 34px;
          height: 34px;
          border-radius: var(--radius-sm);
          background-color: var(--primary-light);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          flex-shrink: 0;
        }

        .brand-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-main);
          letter-spacing: -0.01em;
          white-space: nowrap;
        }

        .header-nav {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          flex-shrink: 0;
        }

        .header-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 0.825rem;
          font-weight: 500;
          cursor: pointer;
          padding: 0.35rem 0.6rem;
          border-radius: var(--radius-sm);
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .header-link:hover {
          color: var(--primary);
          background-color: var(--bg-secondary);
        }

        .github-link {
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.35rem;
          border-radius: var(--radius-sm);
          transition: color 0.15s ease;
        }

        .github-link:hover {
          color: var(--text-main);
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: var(--text-main);
          cursor: pointer;
        }

        .mobile-drawer {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          background-color: var(--bg-card);
          border-top: 1px solid var(--border-color);
        }

        .mobile-drawer-item {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.55rem 0.75rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          color: var(--text-main);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .header-nav {
            display: none;
          }
          .mobile-menu-btn {
            display: flex;
          }
        }
      `}</style>
    </header>
  );
}
