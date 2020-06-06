var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var scoreLabel = document.getElementById('score');
var three = document.getElementById('three');
var five = document.getElementById('five');
var seven = document.getElementById('seven');
var score = 0;
var size = 5;
var width = canvas.width / size - 6;
var cells = [];
var fontSize;
var loss = false;
startGame();

three.onclick = function () {
  size = 5
  width = canvas.width / size - 6;
  canvasClean();
  startGame();
}
five.onclick = function () {
  size = 7
  width = canvas.width / size - 6;
  canvasClean();
  startGame();
}
seven.onclick = function () {
  size = 9
  width = canvas.width / size - 6;
  canvasClean();
  startGame();
}

function cell(row, coll, val) {
  this.value = val;
  this.x = coll * width + 5 * (coll + 1);
  this.y = row * width + 5 * (row + 1);
}

function get_shuffled_array(l) {
  let arr = []
  for (let i = 0; i < l; i++) {
    arr.push(i)
  }
  console.log(arr)
  for (let i = 0; i < l; i++) {
    let rndm = Math.floor(Math.random() * l);
    let temp = arr[rndm]
    arr[rndm] = arr[i]
    arr[i] = temp
  }

  return arr;

}

function createCells() {
  var i, j, k = 0;
  let arr = get_shuffled_array((size - 2) * (size - 2))
  console.log(arr)
  for (i = 1; i < size - 1; i++) {
    cells[i] = [];
    for (j = 1; j < size - 1; j++) {
      cells[i][j] = new cell(i, j, arr[k]);
      k++;
    }
  }
  for (i = 1; i < size - 1; i++) {
    let temp = cells[i].slice(1, size - 1)
    let sum = temp.reduce(function (a, b) {
      return +a + +b.value;
    }, 0);
    cells[i][0] = new cell(i, 0, sum);
    drawCell(cells[i][0], i, size - 1);

    cells[i][size - 1] = new cell(i, size - 1, sum);
    drawCell(cells[i][size - 1], i, size - 1);
  }

  let xcross = 0;
  let ycross = 0;

  for (i = 1; i < size - 1; i++) {
    sum = 0;
    for (j = 1; j < size - 1; j++) {
      sum = sum + cells[j][i].value;
      if (i == j) {
        xcross = xcross + cells[j][i].value;
        ycross = ycross + cells[j][size - 1 - i].value

      }
    }

    if (!cells[0]) {
      cells[0] = []
    }
    cells[0][i] = new cell(0, i, sum)
    drawCell(cells[0][i], i, size - 1);
    if (!cells[size - 1]) {
      cells[size - 1] = []
    }
    cells[size - 1][i] = new cell(size - 1, i, sum)
    drawCell(cells[size - 1][i], i, size - 1);
  }
  cells[0][0] = new cell(0, 0, xcross)
  drawCell(cells[0][0], 0, 0);

  cells[size - 1][size - 1] = new cell(size - 1, size - 1, xcross)
  drawCell(cells[size - 1][size - 1], size - 1, size - 1);

  cells[0][size - 1] = new cell(0, size - 1, ycross)
  drawCell(cells[0][size - 1], 0, size - 1);

  cells[size - 1][0] = new cell(size - 1, 0, ycross)
  drawCell(cells[size - 1][0], size - 1, 0);

  scoreLabel.innerHTML = '' + xcross;


}

function drawCell(cell, i = 0, j = 0) {
  ctx.beginPath();
  ctx.rect(cell.x, cell.y, width, width);

  switch (cell.value) {
    case 0: ctx.fillStyle = '#d1cac2'; break;
    default: ctx.fillStyle = '#ebe8e4';
  }
  if (j == size - 1 || (j == 0 || i == 0)) {
    ctx.fillStyle = '#f5c6b8';
  }
  ctx.fill();
  if (cell.value) {
    fontSize = width / 2;
    ctx.font = fontSize + 'px Arial';
    ctx.fillStyle = '#827e78';
    ctx.textAlign = 'center';
    ctx.fillText(cell.value, cell.x + width / 2, cell.y + width / 2 + width / 7);

  }
}

function canvasClean() {
  ctx.clearRect(0, 0, 500, 500);
}

document.onkeydown = function (event) {
  if (!loss) {
    if (event.keyCode === 38 || event.keyCode === 87) {
      moveUp();
    } else if (event.keyCode === 39 || event.keyCode === 68) {
      moveRight();
    } else if (event.keyCode === 40 || event.keyCode === 83) {
      moveDown();
    } else if (event.keyCode === 37 || event.keyCode === 65) {
      moveLeft();
    }
  }
}

function startGame() {
  createCells();
  drawAllCells();
  pasteNewCell();
  pasteNewCell();
}

function finishGame() {
  canvas.style.opacity = '0.5';
  loss = true;
}

function drawAllCells() {
  var i, j;
  for (i = 1; i < size - 1; i++) {
    for (j = 1; j < size - 1; j++) {
      drawCell(cells[i][j], i, j);
    }
  }
}

function pasteNewCell() {
  drawAllCells();

  for (let i = 1; i < size - 1; i++) {
    let temp = cells[i].slice(1, size - 1)
    let sum = temp.reduce(function (a, b) {
      return +a + +b.value;
    }, 0);

    cells[i][size - 1].value = sum
    drawCell(cells[i][size - 1], i, size - 1);

    cells[i][0].value = sum;
    drawCell(cells[i][0], i, size - 1);
  }
  let xcross = 0;
  let ycross = 0;


  for (i = 1; i < size - 1; i++) {
    sum = 0;
    for (j = 1; j < size - 1; j++) {
      sum = sum + cells[j][i].value;
      if (i == j) {
        xcross = xcross + cells[j][i].value;
        ycross = ycross + cells[j][size - 1 - i].value

      }
    }

    if (!cells[0]) {
      cells[0] = []
    }
    cells[0][i].value = sum
    drawCell(cells[0][i], i, size - 1);
    if (!cells[size - 1]) {
      cells[size - 1] = []
    }
    cells[size - 1][i].value = sum
    drawCell(cells[size - 1][i], i, size - 1);

    cells[0][0] = new cell(0, 0, xcross)
    drawCell(cells[0][0], 0, 0);

    cells[size - 1][size - 1].value = xcross;
    drawCell(cells[size - 1][size - 1], size - 1, size - 1);
    cells[0][size - 1].value = ycross
    drawCell(cells[0][size - 1], 0, size - 1);

    cells[size - 1][0].value = ycross
    drawCell(cells[size - 1][0], size - 1, 0);
  }

}

function moveRight() {
  var i, j;
  var coll;
  for (i = 1; i < size - 1; i++) {
    for (j = size - 3; j >= 1; j--) {
      if (cells[i][j].value) {
        coll = j;
        if (!cells[i][coll + 1].value) {
          cells[i][coll + 1].value = cells[i][coll].value;
          cells[i][coll].value = 0;
          coll++;
          break;
        }
      }
    }
  }
  pasteNewCell();
}

function moveLeft() {
  var i, j;
  var coll;
  for (i = 1; i < size - 1; i++) {
    for (j = 2; j < size - 1; j++) {
      if (cells[i][j].value) {
        coll = j;
        if (!cells[i][coll - 1].value) {
          cells[i][coll - 1].value = cells[i][coll].value;
          cells[i][coll].value = 0;
          coll--;
          break;
        }
      }
    }
  }
  pasteNewCell();
}

function moveUp() {
  var i, j, row;

  for (j = 1; j < size - 1; j++) {
    for (i = 2; i < size - 1; i++) {
      if (cells[i][j].value) {
        row = i;
        if (!cells[row - 1][j].value) {
          cells[row - 1][j].value = cells[row][j].value;
          cells[row][j].value = 0;
          row--;
          break;
        }
      }
    }
  }
  pasteNewCell();
}

function moveDown() {
  var i, j, row;
  for (j = 1; j < size - 1; j++) {
    for (i = size - 3; i >= 1; i--) {
      if (cells[i][j].value) {
        row = i;
        if (!cells[row + 1][j].value) {
          cells[row + 1][j].value = cells[row][j].value;
          cells[row][j].value = 0;
          row++;
          break;
        }
      }
    }
  }
  pasteNewCell();
}
