/**
 * Escape a single CSV cell value.
 * - Wraps in double quotes if it contains commas, quotes, or newlines
 * - Doubles internal quotes (CSV standard)
 */
const escapeCell = (value) => {
  if (value === null || value === undefined) return '';

  const str = String(value);

  // Wrap if it contains characters that would break the CSV
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
};

/**
 * Format a date for CSV — ISO date (YYYY-MM-DD) is universal and sorts correctly
 * in Excel/Sheets without ambiguity.
 */
const formatDate = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
};

/**
 * Convert an array of application objects to a CSV string.
 * Column order is fixed so exports are consistent.
 */
export const applicationsToCSV = (applications) => {
  const headers = [
    'Company',
    'Role',
    'Status',
    'Date Applied',
    'Job Type',
    'Location',
    'Salary Min',
    'Salary Max',
    'Contact Person',
    'Contact Email',
    'Job Link',
    'Next Step',
    'Next Step Date',
    'Notes',
    'Created At',
  ];

  const rows = applications.map((app) => [
    escapeCell(app.company),
    escapeCell(app.role),
    escapeCell(app.status),
    escapeCell(formatDate(app.dateApplied)),
    escapeCell(app.jobType),
    escapeCell(app.location),
    escapeCell(app.salaryMin),
    escapeCell(app.salaryMax),
    escapeCell(app.contactPerson),
    escapeCell(app.contactEmail),
    escapeCell(app.jobLink),
    escapeCell(app.nextStep),
    escapeCell(formatDate(app.nextStepDate)),
    escapeCell(app.notes),
    escapeCell(formatDate(app.createdAt)),
  ]);

  // Join with commas inside rows, newlines between rows
  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
};

/**
 * Trigger a browser download of a CSV file.
 * Works by creating an in-memory Blob, generating a temporary URL,
 * clicking a hidden anchor tag, then cleaning up.
 */
export const downloadCSV = (filename, csvContent) => {
  // \uFEFF is the Byte Order Mark — makes Excel read UTF-8 correctly
  // Without it, accented characters and emojis can render as garbage in Excel
  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Free the memory — important; Blobs persist until released
  URL.revokeObjectURL(url);
};

/**
 * Convenience: build a timestamped filename like "trackr-export-2026-05-29.csv"
 */
export const buildCSVFilename = () => {
  const date = new Date().toISOString().split('T')[0];
  return `trackr-export-${date}.csv`;
};