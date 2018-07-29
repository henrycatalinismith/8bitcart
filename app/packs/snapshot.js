const parse = require("../emulator/parser").default;
const compile = require("../emulator/compiler").default;
const run = require("../emulator/runner").default;

const ast = parse(lua);
const code = compile(ast);
const memory = new Uint8Array(0x8000);

const pixels = [];
for (let x = 0; x < 128; x++) {
  pixels[x] = [];
  for (let y = 0; y < 128; y++) {
    pixels[x][y] = 0;
  }
}

const tick = () => {
  const screen = memory.slice(0x6000);
  for (let addr = 0; addr <= 8191; addr++) {
    const x = addr % 64 * 2;
    const y = Math.floor(addr / 64);

    const left = screen[addr] & 0x0f;
    const right = screen[addr] >> 4;

    pixels[x][y] = left;
    pixels[(x+1)][y] = right;
  }

  update(pixels);
};

tick();
//const interval = setInterval(tick, 16);
run(code, memory).then(() => {
  tick();
});

