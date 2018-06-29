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
  }

  start() {
    this.running = true;
    requestAnimationFrame(this.render);
  }

  update(memory) {
    this.memory = memory;
  }

  render() {
    for (let addr = 0x6000; addr <= 0x7FFF; addr++) {
      const i = addr - 0x6000;
      const x = (i * 2) % 128;
      const y = Math.floor(i / 64);
      const color = this.memory[addr]

      this.ctx.fillStyle = colors[color];
      this.ctx.fillRect(x * this.px, y * this.px, this.px, this.px);
    }

    if (this.running) {
      requestAnimationFrame(this.render);
    }
  }

  stop() {
    this.running = false;
  }
}
