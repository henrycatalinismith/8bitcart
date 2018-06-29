const poke = require("../poke");

describe("poke", () => {
  it("writes a byte to a memory location", () => {
    const memory = new Uint8Array(0x8000);
    poke(memory)(0x6000, 16);
    expect(memory[0x6000]).toBe(16);
  });
});
