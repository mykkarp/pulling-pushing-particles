import { config } from './config.js';

const canvas = document.querySelector('canvas');
const canvasContainer = document.querySelector('.canvas-container');
const ctx = canvas.getContext('2d');

const w = canvas.width = canvasContainer.clientWidth;
const h = canvas.height = canvasContainer.clientHeight;
const mouse = { x: w / 2, y: h / 2, isDown: false };
const dots = [];

class Dot {
  constructor(bigDotRad) {
    this.pos = { x: mouse.x, y: mouse.y };
    this.rad = bigDotRad || random(config.dotMinRadius, config.dotMaxRadius);
    this.fill = config.defFillColor;
    this.stroke = config.defStrokeColor;
    this.vel = { x: 0, y: 0 };
    this.mass = this.rad * config.massFactor;
  }

  draw(mouseX, mouseY) {
    this.pos.x = mouseX ? mouseX : this.pos.x + this.vel.x;
    this.pos.y = mouseY ? mouseY : this.pos.y + this.vel.y;
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

dots.push(new Dot(config.bigDotRad));
loop();

canvas.addEventListener('mousemove', setMousePosition);
canvas.addEventListener('mousedown', () => mouse.isDown = true);
window.addEventListener('mouseup', () => mouse.isDown = false);

function loop() {
  ctx.clearRect(0, 0, w, h);

  if (mouse.isDown) dots.push(new Dot());
  updateDots();

  requestAnimationFrame(loop);
}
function updateDots() {
  for (let i = 1; i < dots.length; i++) {
    const acceleration = { x: 0, y: 0 };
    for (let j = 0; j < dots.length; j++) {
      const [a, b] = [dots[i], dots[j]];

      const delta = { x: b.pos.x - a.pos.x, y: b.pos.y - a.pos.y }
      const distance = Math.sqrt(delta.x ** 2 + delta.y ** 2) || 1;
      let pullingForce = (distance - config.sphereRad) / distance * b.mass;

      if (j === 0) {
        const alpha = config.mouseSize / distance;
        a.fill = `rgba(250, 10, 30, ${alpha})`;
        distance < config.mouseSize ? pullingForce = (distance - config.mouseSize) * b.mass : pullingForce = b.mass;
      }

      acceleration.x += delta.x * pullingForce;
      acceleration.y += delta.y * pullingForce;
    }
    dots[i].vel.x = dots[i].vel.x * config.smooth + acceleration.x * dots[i].mass;
    dots[i].vel.y = dots[i].vel.y * config.smooth + acceleration.y * dots[i].mass;
  }
  dots.forEach((dot, i) => i === 0 ? dot.draw(mouse.x, mouse.y) : dot.draw());
}
function random(min, max) {
  return Math.random() * (max - min) + min;
}
function setMousePosition({ layerX, layerY }) {
  [mouse.x, mouse.y] = [layerX, layerY];
}