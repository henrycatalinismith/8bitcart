const peek = require("../peek");

describe("peek", () => {
  it("reads a byte from a memory location", () => {
    const memory = new Uint8Array(0x8000);
    memory[0x6000] = 16;
    expect(peek(memory)(0x6000)).toBe(16);
  });
});
