
// When true, moving the mouse draws on the canvas
let isDrawing = true;
let x = 0;
let y = 0;

let drawing = undefined
let photo = undefined


const init = () => {

const  grid = document.getElementById('grid');
const context = grid.getContext('2d');

grid.addEventListener('mousemove', e => {

  if (isDrawing === true) {

    drawLine(context, x, y, e.offsetX, e.offsetY);
    x = e.offsetX;
    y = e.offsetY;
  }
});

window.addEventListener('click', e => {


if (isDrawing === true){
    isDrawing = false
} else {
    isDrawing = true
    x = e.offsetX;
    y = e.offsetY;
}
})

function drawLine(context, x1, y1, x2, y2) {
  var grid = document.getElementById("grid");
  if(isDrawing === true) {
  context.beginPath();
  context.strokeStyle = 'black';
  context.lineWidth = 1;
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
  drawing = context.getImageData(0, 0, grid.width, grid.height);
  }
}

function myCanvas() {
  var c = document.getElementById("canvas");
  var ctx = c.getContext("2d");
  var img = document.getElementById("hand");
  ctx.drawImage(img, 0, 0);
  photo = ctx.getImageData(0, 0, c.width, c.height);
}
myCanvas()


}

function myCanvas() {
  var c = document.getElementById("canvas");
  var ctx = c.getContext("2d");
  var img = document.getElementById("hand");
  ctx.drawImage(img, 0, 0);
  photo = ctx.getImageData(0, 0, c.width, c.height);
}

function finish() {
  console.log(photo, drawing)
}



window.addEventListener("DOMContentLoaded", init);



// const width = 500;
// const squares = [];
// let off = false;
// const activate = (e) => {
//   e.target.setAttribute("style", "background-color: black;");
//   // e.target.removeEventListener('mouseover', activate)
//   // e.target.classList.add('active')
// };

// const toggleLine = (e) => {
//   const squares = document.querySelectorAll(".grid-item");
//   if (off === false) {
//     off = true;
//     return squares.forEach((square) =>
//       square.removeEventListener("mouseover", activate)
//     );
//   } else {
//     off = false;
//     return squares.forEach((square) =>
//         square.addEventListener("mouseover", activate)
//     )

//   }
// };


// const init = () => {
//   for (let i = 0; i < width * width; i++) {
//     const grid = document.querySelector(".grid");
//     const square = document.createElement("div");
//     grid.append(square);
//     square.classList.add("grid-item");
//     square.addEventListener("mouseover", activate);
//     square.dataset.index = i;
//     squares.push(square);
//   }
// };

// document.addEventListener("click", toggleLine);
