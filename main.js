const setAsyncTimeout = (cb, timeout = 0) => new Promise((resolve) => {
  setTimeout(() => {
    cb();
    resolve();
  }, timeout);
});

function makeRows(rows, cols) { // ws.send('.g.ssp') if (window.grid ==
undefined) window.grid = {}; window.grid.itr = 0; window.grid.nRows = rows;
window.grid.nCols = cols; window.grid.weights = {}; window.grid.mouseDown =
false; window.grid.walls = []; const container =
document.getElementById('container'); if (container.childNodes.length > 0)
container.innerHTML = ''; container.style.setProperty('--grid-rows', rows);
container.style.setProperty('--grid-cols', cols); for (r = 0; r < rows; r++) {
for (c = 0; c < cols; c++) { const cell = document.createElement('div'); const
id = `${r}_${c}`; cell.setAttribute('id', id); // cell.innerText = (id);
cell.onclick = function (e) { setPoints(e, cell); };
container.appendChild(cell).className = 'grid-item'; window.onkeydown =
function () { grid.keypress = event.key; // console.log(grid.keypress) };
window.onkeyup = function () { grid.keypress = null; }; } } }

function setPoints(e, node) {
  console.log(e);
  if (e.shiftKey) {
    if (!node.classList.contains('endNode')) { // end node
      if (undefined != window.grid.endNode) document.getElementById(grid.endNode).classList.remove('endNode');
      window.grid.endNode = node.id;
      node.classList.remove('startNode');
      node.classList.add('endNode');
    } else {
      window.grid.endNode = null;
      node.classList.remove('endNode');
    }
  } else if (e.altKey) { // weight node
    if (!node.classList.contains('weightNode')) {
      node.classList.add('weightNode');
      setWeight(node.id, 5);
    } else {
      node.classList.remove('weightNode');
      setWeight(node.id, 1);
    }
  } else if (grid.keypress == 'w') { // wall node
    if (!node.classList.contains('wallNode')) {
      node.classList.add('wallNode');
      setWall(node.id);
    } else {
      node.classList.remove('wallNode');
      setWall(node.id);
    }
  } else if (!node.classList.contains('startNode')) { // start node
    if (undefined != window.grid.startNode) { document.getElementById(grid.startNode).classList.remove('startNode'); }
    window.grid.startNode = node.id;
    node.classList.remove('endNode');
    node.classList.add('startNode');
  } else {
    window.grid.startNode = null;
    node.classList.remove('startNode');
  }
}

function updateRows(rows, cols) {
  for (i = 0; i < rows; i++) {
    for (j = 0; j < cols; j++) {
      const c = j + i * cols;
      document.getElementById(c).innerHTML = data[itr][i][j];
    }
  }
  window.grid.itr++;
}

// Create grid of nodes and connections
function makeGrid(rows, cols) {
  const grid = {};

  function isWall(id) {
    return (window.grid.walls.indexOf(id) > -1);
  }

  for (i = 0; i < rows; i++) {
    for (j = 0; j < cols; j++) {
      // let r = i
      // let c = j
      const node = `${i}_${j}`;
      const cons = {};
      const ud = [i - 1, i + 1];
      const lr = [j - 1, j + 1];
      for (l in ud) {
        const con = `${ud[l]}_${j}`;
        // if cell is within grid boundaries and is not a wall
        if ((ud[l] >= 0) && (ud[l] < rows) && (!isWall(con))) {
          const w = window.grid.weights[con];
          Object.assign(cons, { [con]: (w != undefined) ? w : 1 });
        }
      }
      Object.assign(grid, { [node]: cons });
      for (m in lr) {
        const con = `${i}_${lr[m]}`;
        if ((lr[m] >= 0) && (lr[m] < cols) && (!isWall(con))) {
          const w = window.grid.weights[con];
          Object.assign(cons, { [con]: (w != undefined) ? w : 1 });
        }
      }
      Object.assign(grid, { [node]: cons });
    }
  }
  return grid;
}

function setWeight(id, w) {
  if (grid.weights == undefined) window.grid.weights = {};
  Object.assign(grid.weights, { [id]: w });
}

function setWall(id) {
  if (grid.walls == undefined) { grid.walls = []; }
  // Object.assign(grid.walls, {[id]:w})
  (grid.walls.indexOf(id) == -1) ? grid.walls.push(id) : grid.walls.splice(grid.walls.indexOf(id), 1);
}

function pathFind(rows, cols) {
  const grid = makeGrid(rows, cols);
  console.log(grid);
  const start = window.grid.startNode;
  const end = window.grid.endNode;
  const args = {
    algo: 'dijkstra', grid, start, end,
  };
  const req = JSON.stringify(['pathFind', args]);
  console.log(req);
  ws.send(req);
}

function iterateHistory(interval) {
  clearPaths();
  const hist = grid.data.history.map((e) => e[0]); // map only squares and shortest path
  const histMax = grid.data.history.map((e) => e[1]);
  const histShort = grid.data.history.map((e) => e[2]);
  const { path } = grid.data;

  function setVals(arr) {
    const keys = Object.keys(arr);
    const vals = Object.values(arr);
    const low = colorValues('rgba(255, 99, 99, 1)'); // primary colour
    const high = colorValues('rgba(255, 189, 105, 1)'); // secondary colour
    const heatMap = makeHeatMap(high, low, histMax[i] + 1);
    for (j = 0; j < keys.length; j++) {
      const el = document.getElementById(keys[j]);
      el.innerText = vals[j];
      if ((el.id != grid.endNode) && (el.id != grid.startNode)) {
        /* if (vals[j] < histMax[i]) { // if node distance is less than current max distance
                    el.style.background = arrToRgba(heatMap[vals[j]])
                } else {
                    el.style.background = arrToRgba(heatMap[histMax[i]])
                } */
        el.style.background = arrToRgba(heatMap[vals[j]]);
      }
    }
  }
  let i = 0;
  function loop() {
    setTimeout(() => {
      setVals(hist[i]);
      i++;
      if (i < hist.length) { loop(); }
    }, interval);
  }
  // loop();

  async function loop2(hist) {
    // let i = 0;
    for (i = 0; i < hist.length; i++) {
      // await fetch(uri);
      await setVals(hist[i]);
      await timeout(5);
    }
    showPath(grid.data.path);
  }
  loop2(hist);
}

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function showPath(path) {
  path.forEach((e) => {
    // console.log(document.getElementById(e))
    const el = document.getElementById(e);
    if ((!el.classList.contains('startNode')) && (!el.classList.contains('endNode'))) el.style.background = 'rgba(84, 56, 100, 1)';
  });
}

function clearPaths() { // clear path values in cells
  for (r = 0; r < grid.nRows; r++) {
    for (c = 0; c < grid.nCols; c++) {
      const id = `${r}_${c}`;
      document.getElementById(id).innerText = null;
      document.getElementById(id).style.background = null;
    }
  }
}

function resetGrid() {
  // makeGrid(grid.nRows, grid.nCols)
  grid.startNode = null;
  grid.endNode = null;
  grid.weights = {};
  grid.walls = [];
  makeRows(grid.nRows, grid.nCols);
}

const debounce = (func, wait) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
const dbf = debounce(() => alert('hello'), 2000);
