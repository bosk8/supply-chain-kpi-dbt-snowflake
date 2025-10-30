// Bosk8 Supply Chain KPI Dashboard - Main Application Logic

// State management
const state = {
  kpiData: null,
  warehouses: [],
  filters: {
    startDate: null,
    endDate: null,
    warehouseIds: []
  },
  loading: true,
  error: null
};

// API endpoints (mock - replace with actual API)
const API = {
  async getKPIDaily(params = {}) {
    // Mock implementation - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [
            { day: '2025-01-27', warehouse_id: 'WH1', avg_fulfillment_hours: 24.5, on_time_rate: 0.875, units: 1234 },
            { day: '2025-01-27', warehouse_id: 'WH2', avg_fulfillment_hours: 22.3, on_time_rate: 0.912, units: 987 },
            { day: '2025-01-27', warehouse_id: 'WH3', avg_fulfillment_hours: 26.1, on_time_rate: 0.845, units: 567 }
          ],
          meta: {
            total_rows: 3,
            date_range: { start: params.start || '2025-01-01', end: params.end || '2025-01-27' },
            warehouses_included: params.warehouse_ids || ['WH1', 'WH2', 'WH3'],
            last_updated: new Date().toISOString()
          }
        });
      }, 500);
    });
  },
  
  async getWarehouses() {
    // Mock implementation - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [
            { warehouse_id: 'WH1', city: 'Atlanta', capacity_units: 100000 },
            { warehouse_id: 'WH2', city: 'Chicago', capacity_units: 150000 },
            { warehouse_id: 'WH3', city: 'Dallas', capacity_units: 120000 }
          ],
          meta: {
            total_warehouses: 3,
            last_updated: new Date().toISOString()
          }
        });
      }, 300);
    });
  }
};

// Utility functions
function formatNumber(num) {
  if (typeof num === 'string') return num;
  return Number.isInteger(num) ? num.toLocaleString() : num.toFixed(1);
}

function formatPercent(rate) {
  return (rate * 100).toFixed(1) + '%';
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0];
}

function getDefaultStartDate() {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return formatDate(date);
}

function getDefaultEndDate() {
  return formatDate(new Date());
}

// Update KPI cards
function updateKPICards(data) {
  if (!data || !data.data || data.data.length === 0) {
    document.getElementById('kpi-avg-hours').textContent = '--';
    document.getElementById('kpi-on-time').textContent = '--';
    document.getElementById('kpi-units').textContent = '--';
    return;
  }

  const avgHours = data.data.reduce((sum, row) => sum + row.avg_fulfillment_hours, 0) / data.data.length;
  const avgRate = data.data.reduce((sum, row) => sum + row.on_time_rate, 0) / data.data.length;
  const totalUnits = data.data.reduce((sum, row) => sum + row.units, 0);

  document.getElementById('kpi-avg-hours').textContent = formatNumber(avgHours);
  document.getElementById('kpi-on-time').textContent = formatPercent(avgRate);
  document.getElementById('kpi-units').textContent = formatNumber(totalUnits);
}

// Update warehouse table
function updateWarehouseTable(data) {
  const tbody = document.getElementById('warehouse-table-body');
  tbody.innerHTML = '';

  if (!data || !data.data || data.data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No warehouse data available for selected filters.</td></tr>';
    return;
  }

  // Group by warehouse
  const warehouseMap = {};
  data.data.forEach(row => {
    if (!warehouseMap[row.warehouse_id]) {
      warehouseMap[row.warehouse_id] = {
        warehouse_id: row.warehouse_id,
        avg_fulfillment_hours: row.avg_fulfillment_hours,
        on_time_rate: row.on_time_rate,
        units: row.units
      };
    } else {
      warehouseMap[row.warehouse_id].avg_fulfillment_hours = 
        (warehouseMap[row.warehouse_id].avg_fulfillment_hours + row.avg_fulfillment_hours) / 2;
      warehouseMap[row.warehouse_id].on_time_rate = 
        (warehouseMap[row.warehouse_id].on_time_rate + row.on_time_rate) / 2;
      warehouseMap[row.warehouse_id].units += row.units;
    }
  });

  Object.values(warehouseMap).forEach(warehouse => {
    const tr = document.createElement('tr');
    tr.setAttribute('role', 'row');
    tr.setAttribute('tabindex', '0');
    tr.setAttribute('onclick', `window.location.href='./warehouse.html?id=${warehouse.warehouse_id}'`);
    tr.setAttribute('onkeydown', `if(event.key==='Enter'||event.key===' ') window.location.href='./warehouse.html?id=${warehouse.warehouse_id}'`);
    
    tr.innerHTML = `
      <td>${warehouse.warehouse_id}</td>
      <td>${formatNumber(warehouse.avg_fulfillment_hours)}</td>
      <td>${formatPercent(warehouse.on_time_rate)}</td>
      <td>${formatNumber(warehouse.units)}</td>
    `;
    
    tbody.appendChild(tr);
  });
}

// Set loading state
function setLoadingState(loading) {
  state.loading = loading;
  const kpiElements = ['kpi-avg-hours', 'kpi-on-time', 'kpi-units'];
  
  kpiElements.forEach(id => {
    const el = document.getElementById(id);
    if (loading) {
      el.classList.add('kpi-loading');
      el.textContent = '--';
    } else {
      el.classList.remove('kpi-loading');
    }
  });
}

// Set error state
function setErrorState(error) {
  state.error = error;
  const kpiElements = ['kpi-avg-hours', 'kpi-on-time', 'kpi-units'];
  
  kpiElements.forEach(id => {
    const el = document.getElementById(id);
    el.classList.remove('kpi-loading');
    el.classList.add('kpi-error');
    el.textContent = error || 'Error';
  });
}

// Load data
async function loadData() {
  setLoadingState(true);
  state.error = null;

  try {
    const params = {
      start: state.filters.startDate || getDefaultStartDate(),
      end: state.filters.endDate || getDefaultEndDate(),
      warehouse_ids: state.filters.warehouseIds.length > 0 ? state.filters.warehouseIds : undefined
    };

    const kpiData = await API.getKPIDaily(params);
    state.kpiData = kpiData;
    
    updateKPICards(kpiData);
    updateWarehouseTable(kpiData);
    setLoadingState(false);
  } catch (error) {
    console.error('Error loading data:', error);
    setErrorState('Failed to load data');
  }
}

// Load warehouses
async function loadWarehouses() {
  try {
    const response = await API.getWarehouses();
    state.warehouses = response.data;
    renderWarehouseCheckboxes();
  } catch (error) {
    console.error('Error loading warehouses:', error);
  }
}

// Render warehouse checkboxes
function renderWarehouseCheckboxes() {
  const container = document.getElementById('warehouse-checkboxes');
  container.innerHTML = '';

  const allCheckbox = document.createElement('label');
  allCheckbox.className = 'checkbox-label';
  allCheckbox.innerHTML = `
    <input type="checkbox" class="checkbox" id="warehouse-all" checked />
    <span>All</span>
  `;
  allCheckbox.querySelector('input').addEventListener('change', (e) => {
    const checked = e.target.checked;
    container.querySelectorAll('input:not(#warehouse-all)').forEach(cb => {
      cb.checked = checked;
    });
    updateSelectedWarehouses();
  });
  container.appendChild(allCheckbox);

  state.warehouses.forEach(warehouse => {
    const label = document.createElement('label');
    label.className = 'checkbox-label';
    label.innerHTML = `
      <input type="checkbox" class="checkbox" value="${warehouse.warehouse_id}" checked />
      <span>${warehouse.warehouse_id} - ${warehouse.city}</span>
    `;
    label.querySelector('input').addEventListener('change', () => {
      updateSelectedWarehouses();
    });
    container.appendChild(label);
  });

  updateSelectedWarehouses();
}

// Update selected warehouses
function updateSelectedWarehouses() {
  const allCheckbox = document.getElementById('warehouse-all');
  const checkboxes = document.querySelectorAll('#warehouse-checkboxes input:not(#warehouse-all)');
  const selected = Array.from(checkboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  if (selected.length === checkboxes.length) {
    allCheckbox.checked = true;
  } else {
    allCheckbox.checked = false;
  }

  state.filters.warehouseIds = selected;
}

// Filter panel management
function openFilterPanel() {
  const panel = document.getElementById('filter-panel');
  panel.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeFilterPanel() {
  const panel = document.getElementById('filter-panel');
  panel.classList.remove('active');
  document.body.style.overflow = '';
}

// Apply filters
function applyFilters() {
  const startDate = document.getElementById('date-start').value;
  const endDate = document.getElementById('date-end').value;

  const errorEl = document.getElementById('date-error');
  
  if (startDate && endDate && startDate > endDate) {
    errorEl.textContent = 'Start date must be before end date.';
    errorEl.style.display = 'block';
    document.getElementById('date-end').setAttribute('aria-invalid', 'true');
    return;
  }

  errorEl.style.display = 'none';
  document.getElementById('date-end').setAttribute('aria-invalid', 'false');

  state.filters.startDate = startDate || null;
  state.filters.endDate = endDate || null;

  closeFilterPanel();
  loadData();
}

// Reset filters
function resetFilters() {
  document.getElementById('date-start').value = getDefaultStartDate();
  document.getElementById('date-end').value = getDefaultEndDate();
  document.getElementById('date-error').style.display = 'none';
  
  document.getElementById('warehouse-all').checked = true;
  document.querySelectorAll('#warehouse-checkboxes input:not(#warehouse-all)').forEach(cb => {
    cb.checked = true;
  });
  
  updateSelectedWarehouses();
  state.filters.startDate = null;
  state.filters.endDate = null;
  state.filters.warehouseIds = [];
  
  closeFilterPanel();
  loadData();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Set default dates
  document.getElementById('date-start').value = getDefaultStartDate();
  document.getElementById('date-end').value = getDefaultEndDate();

  // Event listeners
  document.getElementById('filter-btn').addEventListener('click', openFilterPanel);
  document.getElementById('close-filters').addEventListener('click', closeFilterPanel);
  document.getElementById('apply-filters').addEventListener('click', applyFilters);
  document.getElementById('reset-filters').addEventListener('click', resetFilters);

  // Close filter panel on backdrop click
  document.getElementById('filter-panel').addEventListener('click', (e) => {
    if (e.target.id === 'filter-panel') {
      closeFilterPanel();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeFilterPanel();
    }
  });

  // Load initial data
  loadWarehouses().then(() => loadData());
});
