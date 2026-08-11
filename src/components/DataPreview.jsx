import React, { useState, useMemo } from 'react';
import { 
  Table as TableIcon, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Filter
} from 'lucide-react';

export default function DataPreview({ data, fields, columnTypes }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColumnFilter, setSelectedColumnFilter] = useState('ALL');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter logic
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];

    let result = data;

    // Search query filter across all fields or selected column
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(row => {
        if (selectedColumnFilter !== 'ALL') {
          const val = row[selectedColumnFilter];
          return val !== null && val !== undefined && String(val).toLowerCase().includes(q);
        }
        return fields.some(field => {
          const val = row[field];
          return val !== null && val !== undefined && String(val).toLowerCase().includes(q);
        });
      });
    }

    // Sort logic
    if (sortColumn) {
      result = [...result].sort((a, b) => {
        let valA = a[sortColumn];
        let valB = b[sortColumn];

        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDirection === 'asc' ? valA - valB : valB - valA;
        }

        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        return sortDirection === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
      });
    }

    return result;
  }, [data, fields, searchQuery, selectedColumnFilter, sortColumn, sortDirection]);

  // Reset pagination when filter/search changes
  const totalRows = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const startIdx = (validCurrentPage - 1) * pageSize;
    return filteredData.slice(startIdx, startIdx + pageSize);
  }, [filteredData, validCurrentPage, pageSize]);

  const handleSort = (field) => {
    if (sortColumn === field) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else setSortColumn(null); // Clear sort
    } else {
      setSortColumn(field);
      setSortDirection('asc');
    }
  };

  const startRow = totalRows > 0 ? (validCurrentPage - 1) * pageSize + 1 : 0;
  const endRow = Math.min(validCurrentPage * pageSize, totalRows);

  return (
    <div className="data-preview-card card animate-fade-in" id="preview">
      {/* Card Header & Controls */}
      <div className="card-header preview-header">
        <div className="preview-title-box">
          <h3 className="card-title">
            <TableIcon size={18} className="text-primary" />
            Data Preview
          </h3>
          <span className="card-subtitle">
            Explore, search, and inspect tabular dataset rows
          </span>
        </div>

        <div className="preview-toolbar">
          {/* Column Filter Dropdown */}
          <div className="filter-select-wrapper">
            <Filter size={14} className="input-icon" />
            <select 
              value={selectedColumnFilter} 
              onChange={(e) => { setSelectedColumnFilter(e.target.value); setCurrentPage(1); }}
              className="form-select select-sm"
            >
              <option value="ALL">All Columns</option>
              {fields.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="search-input-wrapper">
            <Search size={14} className="input-icon" />
            <input 
              type="text" 
              placeholder="Search data..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="form-input input-sm search-input"
            />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="table-responsive-container">
        <table className="data-table">
          <thead>
            <tr>
              <th className="th-index">#</th>
              {fields.map((field) => {
                const type = columnTypes ? columnTypes[field] : 'categorical';
                const isNumeric = type === 'numeric';
                const isSorted = sortColumn === field;
                return (
                  <th 
                    key={field} 
                    onClick={() => handleSort(field)}
                    className={`th-sortable ${isNumeric ? 'text-right' : ''} ${isSorted ? 'sorted' : ''}`}
                    title={`Click to sort by ${field}`}
                  >
                    <div className={`th-content ${isNumeric ? 'justify-end' : ''}`}>
                      <span>{field}</span>
                      <span className="type-badge">{type}</span>
                      <span className="sort-icon">
                        {isSorted ? (
                          sortDirection === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                        ) : (
                          <ArrowUpDown size={12} className="text-light-opacity" />
                        )}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => {
                const rowIndex = (validCurrentPage - 1) * pageSize + idx + 1;
                return (
                  <tr key={idx} className="table-row">
                    <td className="td-index">{rowIndex}</td>
                    {fields.map((field) => {
                      const val = row[field];
                      const type = columnTypes ? columnTypes[field] : 'categorical';
                      const isNumeric = type === 'numeric';

                      return (
                        <td 
                          key={field} 
                          className={`td-cell ${isNumeric ? 'text-right numeric-font' : ''}`}
                        >
                          {val === null || val === undefined || val === '' ? (
                            <span className="null-placeholder">N/A</span>
                          ) : (
                            <span title={String(val)} className="cell-text">
                              {typeof val === 'number' ? val.toLocaleString() : String(val)}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={fields.length + 1} className="no-results-td">
                  No matching data rows found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="pagination-bar">
        <div className="pagination-info">
          Showing <strong>{startRow}–{endRow}</strong> of <strong>{totalRows.toLocaleString()}</strong> rows
        </div>

        <div className="pagination-controls">
          <div className="page-size-selector">
            <span className="text-muted text-xs">Rows per page:</span>
            <select 
              value={pageSize} 
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="form-select select-xs"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="page-buttons">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={validCurrentPage === 1}
              className="btn btn-secondary btn-xs"
              aria-label="Previous page"
            >
              <ChevronLeft size={14} />
              <span>Previous</span>
            </button>

            <span className="page-indicator">
              Page <strong>{validCurrentPage}</strong> of {totalPages}
            </span>

            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={validCurrentPage === totalPages}
              className="btn btn-secondary btn-xs"
              aria-label="Next page"
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .data-preview-card {
          margin-bottom: 1.5rem;
        }

        .preview-header {
          flex-wrap: wrap;
          gap: 1rem;
        }

        .preview-toolbar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .filter-select-wrapper, .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 0.65rem;
          color: var(--text-muted);
          pointer-events: none;
        }

        .select-sm {
          padding-left: 2rem;
          font-size: 0.8rem;
          height: 34px;
        }

        .search-input {
          padding-left: 2rem;
          width: 200px;
          font-size: 0.8rem;
          height: 34px;
        }

        .table-responsive-container {
          overflow-x: auto;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          max-height: 420px;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
          text-align: left;
        }

        .data-table thead {
          position: sticky;
          top: 0;
          background-color: var(--bg-secondary);
          z-index: 10;
        }

        .data-table th {
          padding: 0.75rem 1rem;
          font-weight: 600;
          color: var(--text-main);
          border-bottom: 1px solid var(--border-color);
          white-space: nowrap;
          user-select: none;
        }

        .th-sortable {
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .th-sortable:hover {
          background-color: var(--bg-tertiary);
        }

        .th-sortable.sorted {
          color: var(--primary);
        }

        .th-content {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .justify-end {
          justify-content: flex-end;
        }

        .type-badge {
          font-size: 0.65rem;
          font-weight: 500;
          background-color: var(--bg-card);
          color: var(--text-muted);
          padding: 0.1rem 0.35rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          text-transform: lowercase;
        }

        .text-light-opacity {
          opacity: 0.4;
        }

        .th-index, .td-index {
          width: 50px;
          text-align: center;
          color: var(--text-light);
          font-size: 0.75rem;
        }

        .table-row {
          border-bottom: 1px solid var(--border-color);
          transition: background-color 0.15s ease;
        }

        .table-row:nth-child(even) {
          background-color: var(--bg-app);
        }

        .table-row:hover {
          background-color: var(--primary-light) !important;
        }

        .td-cell {
          padding: 0.65rem 1rem;
          color: var(--text-main);
          max-width: 220px;
        }

        .cell-text {
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .text-right {
          text-align: right;
        }

        .numeric-font {
          font-variant-numeric: tabular-nums;
        }

        .null-placeholder {
          color: var(--text-light);
          font-style: italic;
          font-size: 0.75rem;
        }

        .no-results-td {
          text-align: center;
          padding: 2.5rem;
          color: var(--text-muted);
        }

        .pagination-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1rem;
          margin-top: 0.5rem;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .pagination-info {
          font-size: 0.825rem;
          color: var(--text-muted);
        }

        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .page-size-selector {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .select-xs {
          width: 60px;
          height: 28px;
          padding: 0.2rem 0.4rem;
          font-size: 0.75rem;
        }

        .page-buttons {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .btn-xs {
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          height: 28px;
        }

        .page-indicator {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .text-xs {
          font-size: 0.75rem;
        }
      `}</style>
    </div>
  );
}
