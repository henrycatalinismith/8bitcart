const memset = require("../memset");

describe("memset", () => {
  it("writes a byte value to every address in a region of memory", () => {
    const memory = new Uint8Array(0x8000);
    memset(memory)(0x6000, 0x77, 0x2000);
    for (let i = 0x6000; i <= 0x7fff; i++) {
      expect(memory[i]).toBe(0x77);
    }
  });
});

