const Api = require("../api");

describe("api", () => {
  let memory;
  let api;

  beforeEach(() => {
    memory = new Uint8Array(0x8000);
    api = Api(memory);
  });

  describe("cos", () => {
    it("calculates the cosine of an angle", () => {
      expect(api.cos(0)).toBeCloseTo(1);
      expect(api.cos(0.125)).toBeCloseTo(0.7071);
      expect(api.cos(0.25)).toBeCloseTo(0);
      expect(api.cos(0.375)).toBeCloseTo(-0.7071);
      expect(api.cos(0.5)).toBeCloseTo(-1);
      expect(api.cos(0.625)).toBeCloseTo(-0.7071);
      expect(api.cos(0.75)).toBeCloseTo(0);
      expect(api.cos(0.875)).toBeCloseTo(0.7071);
      expect(api.cos(1)).toBeCloseTo(1);
    });
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

  describe("rnd", () => {
    it("generates a random number between 0 and the given maximum", () => {
      const backup = Math.random;
      Math.random = () => 0.5;
      expect(api.rnd(10)).toBe(5);
      Math.random = backup;
    });
  });
});

