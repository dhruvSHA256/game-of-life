const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const resolution = 10;
canvas.width = 800;
canvas.height = 800;

const COLS = canvas.width / resolution;
const ROWS = canvas.height / resolution;

function buildGrid() {
    return new Array(COLS).fill(null)
        .map(() => new Array(ROWS).fill(null)
            .map(() => Math.floor(Math.random() * 2)));
}

function render(grid) {
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            const cell = grid[col][row];
            ctx.beginPath();
            ctx.rect(col * resolution, row * resolution, resolution, resolution);
            ctx.fillStyle = cell ? 'black' : 'white';
            ctx.fill();
        }
    }
}

function getNeighbour(grid, row, col) {
    let neighbours = 0;
    const rows = grid.length;
    const cols = grid[0].length;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i == 0 && j == 0) continue;
            neighbours += grid[(row + i + rows) % rows][(col + j + cols) % cols];
        }
    }
    return neighbours;
}

function applyRule(cell, neighbours) {
    // dead due to over/underpopulation;
    if (neighbours < 2 || neighbours > 3) {
        return 0;
    }
    // reproduction
    if (cell === 0 && neighbours === 3) {
        return 1;
    }
    return cell;
}

function nextGen(grid) {
    const nextGen = grid.map(arr => [...arr]);
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            const cell = grid[row][col];
            const neighbours = getNeighbour(grid, row, col);
            nextGen[row][col] = applyRule(cell, neighbours);
        }
    }
    return nextGen;
}

function update() {
    grid = nextGen(grid);
    render(grid);
    requestAnimationFrame(update);
}

let grid = buildGrid();
requestAnimationFrame(function() { update(); });
