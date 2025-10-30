// Warehouse Detail Page Logic

// Get warehouse ID from URL
const urlParams = new URLSearchParams(window.location.search);
const warehouseId = urlParams.get('id');

if (!warehouseId) {
  window.location.href = './index.html';
}

// State
const state = {
  warehouseId: warehouseId,
  warehouseData: null,
  ordersData: null,
  loading: true,
  error: null
};

// API (mock - replace with actual API)
const API = {
  async getWarehouse(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const warehouses = {
          'WH1': { warehouse_id: 'WH1', city: 'Atlanta', capacity_units: 100000 },
          'WH2': { warehouse_id: 'WH2', city: 'Chicago', capacity_units: 150000 },
          'WH3': { warehouse_id: 'WH3', city: 'Dallas', capacity_units: 120000 }
        };
        resolve({
          data: warehouses[id] || null,
          meta: { last_updated: new Date().toISOString() }
        });
      }, 300);
    });
  },

  async getKPIDaily(params) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [{
            day: '2025-01-27',
            warehouse_id: params.warehouse_id,
            avg_fulfillment_hours: 24.5,
            on_time_rate: 0.875,
            units: 1234
          }],
          meta: {
            total_rows: 1,
            date_range: { start: params.start || '2025-01-01', end: params.end || '2025-01-27' },
            warehouses_included: [params.warehouse_id],
            last_updated: new Date().toISOString()
          }
        });
      }, 500);
    });
  },

  async getOrders(params) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [
            { order_id: '1001', fulfillment_hours: 25, on_time_flag: 1, qty: 3, order_ts: '2025-01-27T10:05:00Z' },
            { order_id: '1002', fulfillment_hours: 43, on_time_flag: 0, qty: 5, order_ts: '2025-01-26T14:30:00Z' },
            { order_id: '1003', fulfillment_hours: 22, on_time_flag: 1, qty: 2, order_ts: '2025-01-26T08:15:00Z' }
          ],
          meta: {
            total_rows: 3,
            warehouse_id: params.warehouse_id,
            date_range: { start: params.start || '2025-01-01', end: params.end || '2025-01-27' },
            last_updated: new Date().toISOString()
          }
        });
      }, 400);
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
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// Update warehouse header
function updateWarehouseHeader(data) {
  if (!data) {
    document.getElementById('warehouse-header').innerHTML = '<div class="error-message">Warehouse not found.</div>';
    return;
  }

  document.getElementById('warehouse-id').textContent = data.warehouse_id;
  document.getElementById('warehouse-city').textContent = data.city;
  document.getElementById('warehouse-capacity').textContent = data.capacity_units.toLocaleString();
}

// Update KPI cards
function updateKPICards(data) {
  if (!data || !data.data || data.data.length === 0) {
    document.getElementById('kpi-avg-hours').textContent = '--';
    document.getElementById('kpi-on-time').textContent = '--';
    document.getElementById('kpi-units').textContent = '--';
    return;
  }

  const row = data.data[0];
  document.getElementById('kpi-avg-hours').textContent = formatNumber(row.avg_fulfillment_hours);
  document.getElementById('kpi-on-time').textContent = formatPercent(row.on_time_rate);
  document.getElementById('kpi-units').textContent = formatNumber(row.units);
}

// Update orders table
function updateOrdersTable(data) {
  const tbody = document.getElementById('orders-table-body');
  tbody.innerHTML = '';

  if (!data || !data.data || data.data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No orders found for this warehouse.</td></tr>';
    return;
  }

  data.data.forEach(order => {
    const tr = document.createElement('tr');
    tr.setAttribute('role', 'row');
    
    const onTimeDisplay = order.on_time_flag === 1 ? 
      '<span class="status-ok">Yes</span>' : 
      '<span class="status-error">No</span>';
    
    tr.innerHTML = `
      <td>${order.order_id}</td>
      <td>${formatNumber(order.fulfillment_hours)}h</td>
      <td>${onTimeDisplay}</td>
      <td>${formatNumber(order.qty)}</td>
      <td>${formatDateTime(order.order_ts)}</td>
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
    // Load warehouse info
    const warehouseResponse = await API.getWarehouse(warehouseId);
    state.warehouseData = warehouseResponse.data;
    
    if (!state.warehouseData) {
      document.getElementById('warehouse-header').innerHTML = '<div class="error-message">Warehouse not found.</div>';
      setLoadingState(false);
      return;
    }
    
    updateWarehouseHeader(state.warehouseData);

    // Load KPI data
    const kpiResponse = await API.getKPIDaily({ warehouse_id: warehouseId });
    state.kpiData = kpiResponse;
    updateKPICards(kpiResponse);

    // Load orders
    const ordersResponse = await API.getOrders({ warehouse_id: warehouseId });
    state.ordersData = ordersResponse;
    updateOrdersTable(ordersResponse);

    setLoadingState(false);
  } catch (error) {
    console.error('Error loading data:', error);
    setErrorState('Failed to load data');
    setLoadingState(false);
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadData();
});
