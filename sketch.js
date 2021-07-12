var cols, rows;
var cell_width = 20;
var grid = []; 
var current;
var stack = [];
var player;
var sp;

function Player() {
  this.x = 0;
  this.y = 0;

  //This makes the player stay still in the top left when the game is started

  this.dir = function(x, y) {
    this.x += x;
    this.y += y;
  }

  this.update = function() {
      
  }

  this.show = function() {
      fill(255);
      rect(this.x * cell_width, this.y * cell_width, cell_width, cell_width);
  }
  
}

function setup() {
  createCanvas(600, 600);
  player = new Player();
  cols = floor(width/cell_width);
  rows = floor(height/cell_width);
  frameRate(10000);
//This is the setup of the grid with cols and rows

  for (var j = 0; j < rows; j++) {
    for (var i = 0; i < cols; i++) {
      var cell = new Cell(i,j);
      grid.push(cell);
    }
  }

  current = grid[0];

  sp = createVector(random(width), random(height));

  function pickLocation() {
    var cols = floor(width/cell_width);
    var rows = floor(height/cell_width);

  sp = createVector(floor(random(cols)), floor(random(rows)));
  sp.mult(cell_width);
  }
}
//This is grid refferences with i and j 

function draw() {
  background(1);
  player.update();
  player.show();
  for (var i = 0; i < grid.length; i++) {
  grid[i].show(); }
    if (keyCode === UP_ARROW) {
      player.dir(0, -1);
    } else if (keyCode === DOWN_ARROW) {
      player.dir(0, 1);
    } else if (keyCode === RIGHT_ARROW) {
      player.dir(1, 0);
    } else if (keyCode === LEFT_ARROW) {
      player.dir(-1, 0);
    }
    //This is the key inputs that allows the player to move

  fill(255, 0, 100);
  rect(sp.x, sp.y, cell_width, cell_width)
  //This is the colour of the Speed Power-up

  current.visited = true;
  current.highlight();
  //STEP 1
  var next = current.checkNeighbors();
  if (next) {
    next.visited = true;
    //STEP 2
    stack.push(current);
    //STEP 3
    removeWalls(current, next);
    //STEP 4
    current = next;
  } else if (stack.length > 0) {
    current = stack.pop();
    
  }
    
}

//This reads every cell and determins whether it has been visited or not

function index(i, j) {
  if(i < 0 || j < 0 || i > cols-1 || j > rows-1) {
    return -1;
  }
  return i + j * cols;
}

function Cell(i, j) {
  this.i = i;
  this.j = j;
  this.walls = [true, true, true, true];
  this.visited = false;

  this.checkNeighbors = function() {
    var neighbors = [];

    var top    = grid[index(i, j-1)];
    var right  = grid[index(i+1, j)];
    var bottom = grid[index(i, j+1)];
    var left   = grid[index(i-1, j)];

    if (top && !top.visited) {
      neighbors.push(top);
    }
    if (right && !right.visited) {
      neighbors.push(right);
    }
    if (bottom && !bottom.visited) {
      neighbors.push(bottom);
    }
    if (left && !left.visited) {
      neighbors.push(left);
    }

    if (neighbors.length > 0) {
      var r = floor(random(0, neighbors.length));
      return neighbors[r];
    } else {
      return undefined;
    }
//This is how the DFS algorithm moves through the maze removing walls when needed

  }
  this.highlight = function() {
    var x = this.i*cell_width;
    var y = this.j*cell_width;
    noStroke();
    fill(255, 0, 0, 0)
    rect(x, y, cell_width, cell_width);
  }

  this.show = function() {
    var x = this.i*cell_width;
    var y = this.j*cell_width;
    stroke(10000);
    if(this.walls[0]) {
      line(x,y,x+cell_width,y);
    }
    if(this.walls[1]) {
      line(x+cell_width,y,x+cell_width,y+cell_width);
    }
    if(this.walls[2]) {
      line(x+cell_width,y+cell_width,x,y+cell_width);
    }
    if(this.walls[3]) {
      line(x,y+cell_width,x,y);
    }
    if (this.visited) {
      noStroke();
      fill(0, 150, 10000, 50);
      rect(x, y, cell_width, cell_width);
    }
  }

}

//This shows that when a wall has been visited whether it should keep the wall or delete it


function removeWalls(a, b) {

  var x = a.i - b.i;
  if (x === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }

//This part of my new code deals with the x-axis and removing walls horizontaly.

  var y = a.j - b.j;
  if (y === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}

//This part of my code deals with the y-axis removing walls vertically.

