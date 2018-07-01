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

const pxa = (x, y) => {
  const addr = ((x >> 1) + y * 64)+1;
  const and = x & 1;
  const add = and ? 1 : 0;
  return ((x >> 1) + y * 64)+add;
}

const pxc = (x, y, memory) => {
  const addr = pxa(x, y);
  const and = x & 1;
  const add = and ? 1 : 0;
  const px = memory[addr];
  if (and) {
    return px & 0xF;
  } else {
    return px;
  }
}

export default class Screen {
  constructor(canvas) {
    this.canvas = canvas;
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.memory = new Uint8Array(0x8000);
    this.running = false;
    this.ctx = this.canvas.getContext('2d');
    this.px = this.canvas.width / 128;
    this.render = this.render.bind(this);
    this.canvas.addEventListener("resize", () => {
      this.px = this.canvas.width / 128;
      this.render();
    });
  }

  start() {
    this.running = true;
    requestAnimationFrame(this.render);
  }

  update(memory) {
    this.memory = memory;
  }

  render() {
    for (let x = 0; x < 128; x++) {
      for (let y = 0; y < 128; y++) {
        const color = pxc(x, y, this.memory);
        //const color = this.memory[addr]
        this.ctx.fillStyle = colors[color];
        this.ctx.fillRect(x * this.px, y * this.px, this.px, this.px);
      }
    }

    /*
    for (let addr = 0x6000; addr <= 0x7FFF; addr++) {
      const i = addr - 0x6000;
      const x = (i * 2) % 128;
      const y = Math.floor(i / 64);
      const color = this.memory[addr]
      this.ctx.fillStyle = colors[color];
      this.ctx.fillRect(x * this.px, y * this.px, this.px, this.px);
    }
    */

    if (this.running) {
      requestAnimationFrame(this.render);
    }
  }

  stop() {
    this.running = false;
  }
}
