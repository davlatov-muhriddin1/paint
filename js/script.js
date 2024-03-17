// global variables
const canvas = document.querySelector("canvas"),
  toolBtns = document.querySelectorAll(".tool"),
  fillColor = document.querySelector("#fill-color"),
  sizeSlider = document.querySelector("#size-slider"),
  colorBtns = document.querySelectorAll(".colors .option"),
  colorPicker = document.querySelector("#color-picker"),
  clearCanvas = document.querySelector(".clear-canvas"),
  saveImg = document.querySelector(".save-img");

// variable
let ctx = canvas.getContext("2d"),
  isDrawing = false,
  brushWidth = 5,
  selectedTool = "brush",
  selectedColor = "#000",
  prevMouseX,
  prevMouseY,
  snapShot;

// set canvas background

const setCanvasBackground = () => {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor;
};

// set canvas width and heaight
window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
});

// start drawing
const startDraw = (e) => {
  isDrawing = true;
  prevMouseX = e.offsetX;
  prevMouseY = e.offsetY;
  ctx.beginPath();
  ctx.lineWidth = brushWidth;

  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;

  snapShot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

// draw rectengle
const drawRectengle = (e) => {
  if (!fillColor.checked) {
    ctx.strokeRect(
      e.offsetX,
      e.offsetY,
      prevMouseX - e.offsetX,
      prevMouseY - e.offsetY
    );
  } else {
    ctx.fillRect(
      e.offsetX,
      e.offsetY,
      prevMouseX - e.offsetX,
      prevMouseY - e.offsetY
    );
  }
};

// draw circle
const drawCircle = (e) => {
  ctx.beginPath();
  const radius = Math.sqrt(
    Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2)
  );
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

// draw triangle
const drawTriangle = (e) => {
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);
  ctx.lineTo(e.offsetX, e.offsetY);

  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
  ctx.closePath();
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

// drawing
const drawing = (e) => {
  if (!isDrawing) return;
  ctx.putImageData(snapShot, 0, 0);

  if (selectedTool === "brush" || selectedTool === "eraser") {
  }

  switch (selectedTool) {
    case "brush":
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      break;
    case "rectangle":
      drawRectengle(e);
      break;
    case "circle":
      drawCircle(e);
      break;
    case "triangle":
      drawTriangle(e);
      break;
    case "eraser":
      ctx.strokeStyle = "#fff";
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      break;
    default:
      break;
  }
};

// tool btn and set to variables selected tool
toolBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
  });
});

// change brush width
sizeSlider.addEventListener("change", () => (brushWidth = sizeSlider.value));

// set color to shapes
colorBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    document.querySelector(".options .selected").classList.remove("selected");
    btn.classList.add("selected");

    const bgColor = window
      .getComputedStyle(btn)
      .getPropertyValue("background-color");
    selectedColor = bgColor;
  });
});

// set color from color picker
colorPicker.addEventListener("change", () => {
  colorPicker.parentElement.style.background = colorPicker.value;
  colorPicker.parentElement.click();
});

// clear canvas btn
clearCanvas.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCanvasBackground();
});

// save img

saveImg.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `simple-paint${Date.now()}.jpg`;
  link.href = canvas.toDataURL();
  link.click();
});

// stop draw
const stopDraw = () => {
  isDrawing = false;
};

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", stopDraw);
