// Data Quality Page Logic

// State
const state = {
  freshnessData: null,
  testsData: null,
  loading: true,
  error: null
};

// API (mock - replace with actual API)
const API = {
  async getFreshness() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [
            {
              source_name: 'raw.orders',
              last_updated: '2025-01-27T10:00:00Z',
              status: 'OK',
              warn_threshold: '2 hours',
              error_threshold: '6 hours',
              age_hours: 0.5
            },
            {
              source_name: 'raw.warehouses',
              last_updated: '2025-01-27T09:30:00Z',
              status: 'OK',
              warn_threshold: null,
              error_threshold: null,
              age_hours: 1.0
            },
            {
              source_name: 'raw.inventory_movements',
              last_updated: '2025-01-27T09:00:00Z',
              status: 'WARN',
              warn_threshold: '2 hours',
              error_threshold: '6 hours',
              age_hours: 2.5
            }
          ],
          meta: {
            last_check: new Date().toISOString()
          }
        });
      }, 400);
    });
  },

  async getTests() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [
            {
              model_name: 'fct_orders',
              test_name: 'not_null',
              test_status: 'PASS',
              last_run: '2025-01-27T10:00:00Z',
              error_message: null
            },
            {
              model_name: 'fct_orders',
              test_name: 'unique',
              test_status: 'PASS',
              last_run: '2025-01-27T10:00:00Z',
              error_message: null
            },
            {
              model_name: 'dim_warehouse',
              test_name: 'not_null',
              test_status: 'FAIL',
              last_run: '2025-01-27T10:00:00Z',
              error_message: 'Null values found in warehouse_id column'
            }
          ],
          meta: {
            total_tests: 3,
            passed_tests: 2,
            failed_tests: 1,
            last_run: '2025-01-27T10:00:00Z'
          }
        });
      }, 400);
    });
  }
};

// Utility functions
function formatDateTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatAge(hours) {
  if (hours < 1) {
    return Math.round(hours * 60) + ' minutes';
  }
  return hours.toFixed(1) + ' hours';
}

function getStatusIndicator(status) {
  switch (status) {
    case 'OK':
    case 'PASS':
      return '<span class="status-ok">' + status + '</span>';
    case 'WARN':
      return '<span class="status-warn">' + status + '</span>';
    case 'ERROR':
    case 'FAIL':
      return '<span class="status-error">' + status + '</span>';
    default:
      return status;
  }
}

// Update freshness table
function updateFreshnessTable(data) {
  const tbody = document.getElementById('freshness-table-body');
  tbody.innerHTML = '';

  if (!data || !data.data || data.data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No freshness data available.</td></tr>';
    return;
  }

  data.data.forEach(row => {
    const tr = document.createElement('tr');
    tr.setAttribute('role', 'row');
    
    tr.innerHTML = `
      <td>${row.source_name}</td>
      <td>${formatDateTime(row.last_updated)}</td>
      <td>${getStatusIndicator(row.status)}</td>
      <td>${formatAge(row.age_hours)}</td>
    `;
    
    tbody.appendChild(tr);
  });
}

// Update tests table
function updateTestsTable(data) {
  const tbody = document.getElementById('tests-table-body');
  tbody.innerHTML = '';

  if (!data || !data.data || data.data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No test results available.</td></tr>';
    return;
  }

  data.data.forEach(row => {
    const tr = document.createElement('tr');
    tr.setAttribute('role', 'row');
    
    if (row.test_status === 'FAIL') {
      tr.style.borderLeft = '2px solid var(--text-highlight)';
    }
    
    tr.innerHTML = `
      <td>${row.model_name}</td>
      <td>${row.test_name}</td>
      <td>${getStatusIndicator(row.test_status)}</td>
      <td>${formatDateTime(row.last_run)}</td>
    `;
    
    tbody.appendChild(tr);
  });
}

// Update last run timestamp
function updateLastRun(data) {
  const timestamp = data?.meta?.last_run || '--';
  document.getElementById('last-run-timestamp').textContent = 
    timestamp !== '--' ? formatDateTime(timestamp) : timestamp;
}

// Set loading state
function setLoadingState(loading) {
  state.loading = loading;
}

// Load data
async function loadData() {
  setLoadingState(true);
  state.error = null;

  try {
    const freshnessResponse = await API.getFreshness();
    state.freshnessData = freshnessResponse;
    updateFreshnessTable(freshnessResponse);

    const testsResponse = await API.getTests();
    state.testsData = testsResponse;
    updateTestsTable(testsResponse);
    updateLastRun(testsResponse);

    setLoadingState(false);
  } catch (error) {
    console.error('Error loading data:', error);
    state.error = error.message;
    setLoadingState(false);
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadData();
});
