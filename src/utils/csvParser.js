import Papa from 'papaparse';

/**
 * Parses CSV string or File object using PapaParse
 * Returns Promise resolving to { data, fields, meta, error }
 */
export function parseCSV(fileOrContent) {
  return new Promise((resolve, reject) => {
    Papa.parse(fileOrContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true, // Automatically parse numbers and booleans
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        if (!results.data || results.data.length === 0) {
          resolve({
            data: [],
            fields: [],
            meta: results.meta,
            error: 'CSV file is empty or contains no readable data rows.'
          });
          return;
        }

        const fields = results.meta.fields || Object.keys(results.data[0] || {});
        
        // Clean data: trim string values
        const cleanedData = results.data.map(row => {
          const newRow = {};
          fields.forEach(field => {
            let val = row[field];
            if (typeof val === 'string') {
              val = val.trim();
            }
            newRow[field] = val;
          });
          return newRow;
        });

        resolve({
          data: cleanedData,
          fields,
          meta: results.meta,
          error: null
        });
      },
      error: (err) => {
        resolve({
          data: [],
          fields: [],
          meta: null,
          error: err.message || 'Failed to parse CSV file.'
        });
      }
    });
  });
}

/**
 * Detect column data types (numeric, date, categorical)
 */
export function detectColumnTypes(data, fields) {
  const types = {};

  fields.forEach(field => {
    let numericCount = 0;
    let dateCount = 0;
    let stringCount = 0;
    let nonNullCount = 0;

    data.forEach(row => {
      const val = row[field];
      if (val !== null && val !== undefined && val !== '') {
        nonNullCount++;
        if (typeof val === 'number' && !isNaN(val)) {
          numericCount++;
        } else if (typeof val === 'string') {
          // Check if string can be converted to valid number
          const parsedNum = Number(val);
          if (!isNaN(parsedNum) && val.trim() !== '') {
            numericCount++;
          } else {
            // Check if string looks like ISO date or date format
            const parsedDate = Date.parse(val);
            if (!isNaN(parsedDate) && val.length > 5 && (val.includes('-') || val.includes('/'))) {
              dateCount++;
            } else {
              stringCount++;
            }
          }
        }
      }
    });

    if (nonNullCount === 0) {
      types[field] = 'categorical';
    } else if (numericCount / nonNullCount > 0.7) {
      types[field] = 'numeric';
    } else if (dateCount / nonNullCount > 0.7) {
      types[field] = 'date';
    } else {
      types[field] = 'categorical';
    }
  });

  return types;
}

/**
 * Calculate dataset overall stats
 */
export function calculateDatasetStats(data, fields) {
  if (!data || data.length === 0) {
    return {
      totalRows: 0,
      totalColumns: 0,
      numericColumns: 0,
      categoricalColumns: 0,
      dateColumns: 0,
      missingValues: 0,
      duplicateRows: 0
    };
  }

  const columnTypes = detectColumnTypes(data, fields);
  let numericCols = 0;
  let categoricalCols = 0;
  let dateCols = 0;
  let missingValues = 0;

  fields.forEach(field => {
    if (columnTypes[field] === 'numeric') numericCols++;
    else if (columnTypes[field] === 'date') dateCols++;
    else categoricalCols++;
  });

  // Calculate missing values
  data.forEach(row => {
    fields.forEach(field => {
      const val = row[field];
      if (val === null || val === undefined || val === '' || (typeof val === 'number' && isNaN(val))) {
        missingValues++;
      }
    });
  });

  // Calculate duplicate rows
  const seen = new Set();
  let duplicateRows = 0;
  data.forEach(row => {
    const rowStr = JSON.stringify(row);
    if (seen.has(rowStr)) {
      duplicateRows++;
    } else {
      seen.add(rowStr);
    }
  });

  return {
    totalRows: data.length,
    totalColumns: fields.length,
    numericColumns: numericCols,
    categoricalColumns: categoricalCols,
    dateColumns: dateCols,
    missingValues,
    duplicateRows,
    columnTypes
  };
}

/**
 * Detailed column health analysis
 */
export function calculateDataQuality(data, fields) {
  const columnTypes = detectColumnTypes(data, fields);

  return fields.map(field => {
    let nullCount = 0;
    const values = [];
    const uniqueValues = new Set();

    data.forEach(row => {
      const val = row[field];
      if (val === null || val === undefined || val === '' || (typeof val === 'number' && isNaN(val))) {
        nullCount++;
      } else {
        values.push(val);
        uniqueValues.add(val);
      }
    });

    const type = columnTypes[field];
    let min = null;
    let max = null;
    let avg = null;

    if (type === 'numeric' && values.length > 0) {
      const numVals = values.map(v => Number(v)).filter(v => !isNaN(v));
      if (numVals.length > 0) {
        min = Math.min(...numVals);
        max = Math.max(...numVals);
        avg = numVals.reduce((acc, curr) => acc + curr, 0) / numVals.length;
      }
    }

    const missingPercentage = data.length > 0 ? ((nullCount / data.length) * 100).toFixed(1) : 0;
    
    let status = 'good';
    if (nullCount > 0) {
      status = Number(missingPercentage) > 20 ? 'issue' : 'warning';
    }

    return {
      field,
      type,
      total: data.length,
      nullCount,
      missingPercentage,
      uniqueCount: uniqueValues.size,
      min: min !== null ? (Number.isInteger(min) ? min : min.toFixed(2)) : 'N/A',
      max: max !== null ? (Number.isInteger(max) ? max : max.toFixed(2)) : 'N/A',
      avg: avg !== null ? avg.toFixed(2) : 'N/A',
      status
    };
  });
}

/**
 * Generate automated insights from data
 */
export function generateInsights(data, fields) {
  if (!data || data.length === 0) return [];

  const insights = [];
  const columnTypes = detectColumnTypes(data, fields);
  const numericFields = fields.filter(f => columnTypes[f] === 'numeric');
  const categoricalFields = fields.filter(f => columnTypes[f] !== 'numeric');

  // 1. Highest Numeric Value Insight
  if (numericFields.length > 0) {
    const primaryNumField = numericFields[0];
    let maxVal = -Infinity;
    let maxRow = null;

    data.forEach(row => {
      const val = Number(row[primaryNumField]);
      if (!isNaN(val) && val > maxVal) {
        maxVal = val;
        maxRow = row;
      }
    });

    if (maxRow) {
      const labelField = categoricalFields.length > 0 ? categoricalFields[0] : fields[0];
      const labelVal = maxRow[labelField] || 'Item';
      insights.push({
        id: 'highest_value',
        type: 'highlight',
        title: `Highest ${primaryNumField}`,
        description: `"${labelVal}" registered the highest ${primaryNumField} of ${maxVal.toLocaleString()}.`,
        metric: maxVal.toLocaleString(),
        badge: 'Top Performer'
      });
    }

    // 2. Average Metric Insight
    let sum = 0;
    let count = 0;
    data.forEach(row => {
      const val = Number(row[primaryNumField]);
      if (!isNaN(val)) {
        sum += val;
        count++;
      }
    });
    if (count > 0) {
      const avg = sum / count;
      insights.push({
        id: 'average_metric',
        type: 'info',
        title: `Average ${primaryNumField}`,
        description: `Average ${primaryNumField} across all ${data.length} records is ${avg.toLocaleString(undefined, { maximumFractionDigits: 2 })}.`,
        metric: avg.toLocaleString(undefined, { maximumFractionDigits: 2 }),
        badge: 'Benchmark'
      });
    }
  }

  // 3. Category Distribution Insight
  if (categoricalFields.length > 0 && numericFields.length > 0) {
    const catField = categoricalFields[0];
    const numField = numericFields[0];
    const categoryTotals = {};

    let totalSum = 0;
    data.forEach(row => {
      const cat = String(row[catField] || 'Unspecified');
      const val = Number(row[numField]) || 0;
      categoryTotals[cat] = (categoryTotals[cat] || 0) + val;
      totalSum += val;
    });

    let topCat = null;
    let topCatVal = 0;
    Object.entries(categoryTotals).forEach(([cat, val]) => {
      if (val > topCatVal) {
        topCatVal = val;
        topCat = cat;
      }
    });

    if (topCat && totalSum > 0) {
      const pct = ((topCatVal / totalSum) * 100).toFixed(1);
      insights.push({
        id: 'top_category',
        type: 'trend',
        title: `Dominant Category (${catField})`,
        description: `"${topCat}" leads with ${pct}% of total ${numField} (${topCatVal.toLocaleString()}).`,
        metric: `${pct}% Share`,
        badge: 'Category Leader'
      });
    }
  }

  // 4. Data Quality Completeness Insight
  const stats = calculateDatasetStats(data, fields);
  const totalCells = data.length * fields.length;
  const completeness = totalCells > 0 ? (((totalCells - stats.missingValues) / totalCells) * 100).toFixed(1) : 100;
  
  insights.push({
    id: 'data_quality',
    type: stats.missingValues > 0 ? 'warning' : 'success',
    title: 'Data Quality Status',
    description: stats.missingValues === 0
      ? `Dataset is 100% complete with 0 missing cells across ${fields.length} columns.`
      : `Dataset contains ${stats.missingValues} missing values (${completeness}% data completeness ratio).`,
    metric: `${completeness}% Complete`,
    badge: stats.missingValues === 0 ? '100% Clean' : 'Needs Review'
  });

  return insights;
}

/**
 * Prepares aggregated chart data for Recharts
 */
export function aggregateChartData(data, xField, yField, groupByField, chartType, aggType = 'sum') {
  if (!data || data.length === 0 || !xField || !yField) return [];

  // Scatter plot requires raw numeric points
  if (chartType === 'scatter') {
    return data
      .filter(row => row[xField] !== null && row[yField] !== null)
      .map((row, idx) => ({
        index: idx + 1,
        [xField]: Number(row[xField]) || 0,
        [yField]: Number(row[yField]) || 0,
        name: groupByField ? String(row[groupByField]) : `Item ${idx + 1}`
      }));
  }

  // Grouped aggregation logic for Bar, Line, Area, Pie
  const groups = {};
  const groupKeySet = new Set();

  data.forEach(row => {
    let xVal = row[xField];
    if (xVal === null || xVal === undefined || xVal === '') {
      xVal = '(Blank)';
    } else {
      xVal = String(xVal);
    }

    const yVal = Number(row[yField]) || 0;
    const groupVal = groupByField && row[groupByField] ? String(row[groupByField]) : null;

    if (!groups[xVal]) {
      groups[xVal] = {
        name: xVal,
        _count: 0,
        _totalY: 0
      };
    }

    groups[xVal]._count += 1;
    groups[xVal]._totalY += yVal;

    if (groupVal) {
      groupKeySet.add(groupVal);
      if (!groups[xVal][groupVal]) {
        groups[xVal][groupVal] = 0;
      }
      groups[xVal][groupVal] += yVal;
    } else {
      groups[xVal]['value'] = (groups[xVal]['value'] || 0) + yVal;
    }
  });

  // Calculate final aggregated values based on aggType
  const chartData = Object.values(groups).map(item => {
    const res = { name: item.name };
    if (groupByField && groupKeySet.size > 0) {
      groupKeySet.forEach(gKey => {
        const val = item[gKey] || 0;
        res[gKey] = aggType === 'avg' && item._count > 0 ? Number((val / item._count).toFixed(2)) : val;
      });
    } else {
      if (aggType === 'avg' && item._count > 0) {
        res.value = Number((item._totalY / item._count).toFixed(2));
      } else if (aggType === 'count') {
        res.value = item._count;
      } else {
        res.value = item._totalY;
      }
    }
    return res;
  });

  // Limit pie chart categories if too many
  if (chartType === 'pie' && chartData.length > 10) {
    chartData.sort((a, b) => (b.value || 0) - (a.value || 0));
    const top9 = chartData.slice(0, 9);
    const otherSum = chartData.slice(9).reduce((acc, curr) => acc + (curr.value || 0), 0);
    top9.push({ name: 'Others', value: otherSum });
    return top9;
  }

  return chartData;
}
