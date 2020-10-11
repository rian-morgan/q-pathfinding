class Grid {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.weighNodes = {};
    this.wallNodes = [];
    this.startNode = null;
    this.endNode = null;
  }

  drawGrid() {
    //create the grid container + set grid properties
    const container = document.createElement('div');
    if (container.childNodes.length > 0) container.innerHTML = '';
    container.style.setProperty('--grid-rows', this.rows);
    container.style.setProperty('--grid-cols', this.cols);

    //create the grid cells + set properties
    for (r = 0; r < rows; r++) {
      for (c = 0; c < cols; c++) {
        const cell = document.createElement('div');
        const id = `${r}_${c}`;
        cell.setAttribute('id', id);
        cell.onclick = e => setPoints(e, cell);
      }
    }
  }
}