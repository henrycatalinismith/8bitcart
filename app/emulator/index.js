const lua2js = require("lua2js");
const escodegen = require("escodegen");
const saferEval = require("safer-eval");

const π = Math.PI;

const colors = [
  "#000000",
  "#1D2B53",
  "#7E2553",
  "#008751",
  "#AB5236",
  "#5F574F",
  "#C2C3C7",
  "#FFF1E8",
  "#FF004D",
  "#FFA300",
  "#FFEC27",
  "#00E436",
  "#29ADFF",
  "#83769C",
  "#FF77A8",
  "#FFCCAA",
];

const circ = ctx => (x, y, r, color = undefined) => {
  ctx.strokeStyle = colors[color];
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, π * 2);
  ctx.stroke();
}

const circfill = ctx => (x, y, r, color = undefined) => {
  ctx.fillStyle = colors[color];
  ctx.beginPath();
  ctx.arc(x, y, r, 0, π * 2);
  ctx.fill();
}

const line = ctx => (x0, y0, x1, y1, color = undefined) => {
  ctx.strokeStyle = colors[color];
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
}

const rect = ctx => (x0, y0, x1, y1, color) => {
  ctx.strokeStyle = colors[color];
  ctx.lineWidth = 1;
  ctx.rect(x0, y0, x1-x0, y1-y0);
  ctx.stroke();
}

const rectfill = ctx => (x0, y0, x1, y1, color) => {
  ctx.fillStyle = colors[color];
  ctx.fillRect(x0, y0, x1-x0, y1-y0);
}

export function parse(lua) {
  return lua2js.parse(lua);
}

export function render(memory, canvas) {
  const ctx = canvas.getContext('2d');
  const px = canvas.width / 128;
  for (let addr = 0x6000; addr <= 0x7FFF; addr++) {
    const i = addr - 0x6000;
    const x = (i * 2) % 128;
    const y = Math.floor(i / 64);
    const color = memory[addr]

    ctx.fillStyle = colors[color];
    ctx.fillRect(x * px, y * px, px, px);
  }
}

export default function run(lua, canvas) {
  const ast = lua2js.parse(lua);

  const javascript = escodegen.generate(ast, {
    format: {
      indent: {
        style: "  ",
      }
    }
  }).split("\n");

  javascript.shift();
  javascript.pop();

  const cart = [
    "(function() {",
    javascript.join("\n"),
    "}())",
  ].join("\n");
  console.log(cart);

  const ctx = canvas.getContext("2d");

  const evalContext = {
    __lua: lua2js.stdlib.__lua,
    circ: circ(ctx),
    circfill: circfill(ctx),
    line: line(ctx),
    rect: rect(ctx),
    rectfill: rectfill(ctx),
  };

  saferEval(cart, evalContext)
}
