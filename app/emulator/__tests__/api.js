const Api = require("../api");

describe("api", () => {
  let memory;
  let api;

  beforeEach(() => {
    memory = new Uint8Array(0x8000);
    api = Api(memory);
  });

  describe("memset", () => {
    it("writes a byte value to every address in a region of memory", () => {
      api.memset(0x6000, 0x77, 0x2000);
      for (let i = 0x6000; i <= 0x7fff; i++) {
        expect(memory[i]).toBe(0x77);
      }
    });
  });

  describe("peek", () => {
    it("reads a byte from a memory location", () => {
      memory[0x6000] = 16;
      expect(api.peek(0x6000)).toBe(16);
    });
  });

  describe("poke", () => {
    it("writes a byte to a memory location", () => {
      api.poke(0x6000, 16);
      expect(memory[0x6000]).toBe(16);
    });
  });
});

