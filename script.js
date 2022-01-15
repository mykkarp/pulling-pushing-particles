import { config } from './config.js';

const canvas = document.querySelector('canvas');
const canvasContainer = document.querySelector('.canvas-container');
const ctx = canvas.getContext('2d');

const w = canvas.width = canvasContainer.clientWidth;
const h = canvas.height = canvasContainer.clientHeight;
const mouse = { x: w / 2, y: h / 2, isDown: false };
const dots = [];

class Dot {
  constructor() {
    this.pos = { x: mouse.x, y: mouse.y };
    this.rad = random(config.dotMinRadius, config.dotMaxRadius);
    this.fill = config.defFillColor;
    this.stroke = config.defStrokeColor;
    this.vel = { x: 0, y: 0 };
    this.mass = this.rad * config.massFactor;
  }

  draw() {
    const { x, y } = this.pos;
    ctx.fillStyle = this.fill;
    ctx.strokeStyle = this.stroke;
    ctx.beginPath();
    ctx.arc(x, y, this.rad, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.stroke()
  }
}

loop();

canvas.addEventListener('mousemove', setMousePosition);
canvas.addEventListener('mousedown', () => mouse.isDown = true);
window.addEventListener('mouseup', () => mouse.isDown = false);

function loop() {
  ctx.clearRect(0, 0, w, h);

  if (mouse.isDown) dots.push(new Dot());
  dots.forEach(dot => dot.draw());

  requestAnimationFrame(loop);
}
function random(min, max) {
  return Math.random() * (max - min) + min;
}
function setMousePosition({ layerX, layerY }) {
  [mouse.x, mouse.y] = [layerX, layerY];
}