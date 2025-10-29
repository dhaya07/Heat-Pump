let configData = {};

window.onload = async function() {
  await loadConfig();
  renderTables();
};

async function loadConfig() {
  const res = await axios.get('/api/config');
  configData = res.data;
}

function renderTables() {
  renderTrafficTable();
  renderRoutineTable();
}

/* ========== TRAFFIC LIGHT TABLE ========== */
function renderTrafficTable() {
  const container = document.getElementById('trafficTable');
  let html = `<table class="table table-bordered table-striped align-middle">
    <thead><tr><th>Road</th><th>Green (s)</th><th>Amber (s)</th><th>Red (s)</th></tr></thead><tbody>`;

  configData.traffic_lights.forEach((t, i) => {
    html += `<tr>
      <td><input type="text" class="form-control" value="${t.road}" onchange="updateTraffic(${i}, 'road', this.value)"></td>
      <td><input type="number" class="form-control" value="${t.green}" onchange="updateTraffic(${i}, 'green', this.value)"></td>
      <td><input type="number" class="form-control" value="${t.amber}" onchange="updateTraffic(${i}, 'amber', this.value)"></td>
      <td><input type="number" class="form-control" value="${t.red}" onchange="updateTraffic(${i}, 'red', this.value)"></td>
    </tr>`;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
}

function addTrafficRow() {
  const newRoad = `R${configData.traffic_lights.length + 1}`;
  configData.traffic_lights.push({ road: newRoad, green: 25, amber: 5, red: 120 });
  renderTrafficTable();
}

function deleteTrafficRow() {
  if (configData.traffic_lights.length > 0) {
    configData.traffic_lights.pop();
    renderTrafficTable();
  } else {
    alert("No more rows to delete!");
  }
}

function updateTraffic(index, field, value) {
  configData.traffic_lights[index][field] = field === 'road' ? value : parseInt(value);
}

/* ========== ROUTINE TABLE ========== */
function renderRoutineTable() {
  const container = document.getElementById('routineTable');
  let html = `<table class="table table-bordered table-striped align-middle">
    <thead><tr><th>Start Time</th><th>End Time</th><th>Mode</th></tr></thead><tbody>`;

  configData.routines.forEach((r, i) => {
    html += `<tr>
      <td><input type="time" class="form-control" value="${r.start}" onchange="updateRoutine(${i}, 'start', this.value)"></td>
      <td><input type="time" class="form-control" value="${r.end}" onchange="updateRoutine(${i}, 'end', this.value)"></td>
      <td>
        <select class="form-select" onchange="updateRoutine(${i}, 'mode', this.value)">
          <option ${r.mode === 'BLINK' ? 'selected' : ''}>BLINK</option>
          <option ${r.mode === 'NORMAL' ? 'selected' : ''}>NORMAL</option>
          <option ${r.mode === 'PEAK' ? 'selected' : ''}>PEAK</option>
        </select>
      </td>
    </tr>`;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
}

function addRoutineRow() {
  configData.routines.push({ start: "00:00", end: "00:00", mode: "NORMAL" });
  renderRoutineTable();
}

function deleteRoutineRow() {
  if (configData.routines.length > 0) {
    configData.routines.pop();
    renderRoutineTable();
  } else {
    alert("No more slots to delete!");
  }
}

function updateRoutine(index, field, value) {
  configData.routines[index][field] = value;
}

/* ========== SAVE FUNCTION ========== */
async function saveAll() {
  await axios.post('/api/config', configData);
  alert('✅ Configuration saved successfully!');
}
