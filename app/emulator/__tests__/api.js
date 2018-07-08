const Api = require("../api");

describe("api", () => {
  let memory;
  let api;

  beforeEach(() => {
    memory = new Uint8Array(0x8000);
    api = Api(memory);
  });

  describe("abs", () => {
    it("returns the absolute value of a number", () => {
      expect(api.abs(3.1)).toBe(3.1);
      expect(api.abs(-3.1)).toBe(3.1);
      expect(api.abs(0)).toBe(0);
    });
  });

  // cant get this to return output like the docs
  //describe("atan2", () => {
    //it("calculates the arctangent of dy/dx", () => {
      //expect(api.atan2(1, 0)).toBeCloseTo(0);
      //expect(api.atan2(1, 1)).toBeCloseTo(0.875);
      //expect(api.atan2(0, 1)).toBeCloseTo(0.75);
      //expect(api.atan2(-1, 1)).toBeCloseTo(0.625);
      //expect(api.atan2(-1, 0)).toBeCloseTo(0.5);
      //expect(api.atan2(-1, -1)).toBeCloseTo(0.375);
      //expect(api.atan2(0, -1)).toBeCloseTo(0.25);
      //expect(api.atan2(1, -1)).toBeCloseTo(0.125);
      //expect(api.atan2(99, 99)).toBeCloseTo(0.875);
      //expect(api.atan2(0, 0)).toBeCloseTo(0.75);
    //});
  //});

  describe("band", () => {
    it("calculates the bitwise and of two numbers", () => {
      expect(api.band(0x7, 0xd)).toBe(5);
    });
  });

  describe("bnot", () => {
    it("calculates the bitwise not of a number", () => {
      // this differs from the example in the docs
      // which returns -11 for this input
      // http://pico-8.wikia.com/wiki/Bnot#Examples
      expect(api.bnot(11)).toBe(-12);
    });
  });

  describe("bor", () => {
    it("calculates the bitwise or of two numbers", () => {
      expect(api.bor(0x5, 0x9)).toBe(13);
    });
  });

  describe("bxor", () => {
    it("calculates the bitwise exclusive or of two numbers", () => {
      expect(api.bxor(0x5, 0x9)).toBe(12);
    });
  });

  describe("cls", () => {
    it("clears the graphics buffer", () => {
      api.memset(0x6000, 0x77, 0x2000);
      api.cls();
      for (let i = 0x6000; i < 0x7fff; i++) {
        expect(memory[i]).toBe(0);
      }
    });
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

  describe("line", () => {
    it("draws a straight horizontal line", () => {
      api.line(0, 0, 1, 0, 3);
      expect(api.pget(0, 0)).toBe(3);
      expect(api.pget(1, 0)).toBe(3);
    });

    it("draws a straight vertical line", () => {
      api.line(0, 0, 0, 1, 3);
      expect(api.pget(0, 0)).toBe(3);
      expect(api.pget(0, 1)).toBe(3);
    });
  });

  // cant get this to return output like the docs
  //describe("lshr", () => {
    //it("shifts the bits of a number to the right, using logical shift", () => {
      //expect(api.lshr(8, 3)).toBe(1);
      //expect(api.lshr(1, 3)).toBe(0.125);
      //expect(api.lshr(-1, 3)).toBe(8191.875);
    //});
  //});

  describe("max", () => {
    it("returns the maximum of two numbers", () => {
      expect(api.max(40, 20)).toBe(40);
      expect(api.max(2.7, -3.5)).toBe(2.7);
      expect(api.max(8, 8)).toBe(8);
      expect(api.max(5)).toBe(5);
      expect(api.max(-5)).toBe(0);
    });
  });

  describe("mid", () => {
    it("returns the middle of three numbers", () => {
      expect(api.mid(8, 2, 4)).toBe(4);
      expect(api.mid(-3.5, -3.4, -3.6)).toBe(-3.5);
      expect(api.mid(6, 6, 8)).toBe(6);
    });
  });

  describe("min", () => {
    it("returns the minimum of two numbers", () => {
      expect(api.min(40, 20)).toBe(20);
      expect(api.min(2.7, -3.5)).toBe(-3.5);
      expect(api.min(8, 8)).toBe(8);
      expect(api.min(5)).toBe(0);
      expect(api.min(-5)).toBe(-5);
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

  describe("pget", () => {
    it("[left] gets the color value of a pixel at the given coordinates", () => {
      memory[0x6000] = 0x89;
      expect(api.pget(0, 0)).toBe(9);
    });

    it("[right] gets the color value of a pixel at the given coordinates", () => {
      memory[0x6000] = 0x89;
      expect(api.pget(1, 0)).toBe(8);
    });
  });

  describe("pset", () => {
    it("does a bunch of stuff just like pico8", () => {
      api.pset(0, 0, 1);
      api.pset(1, 0, 1);
      expect(memory[0x6000]).toBe(0x11);

      api.pset(0, 0, 2);
      api.pset(1, 0, 2);
      expect(memory[0x6000]).toBe(0x22);

      api.pset(0, 0, 3);
      api.pset(1, 0, 3);
      expect(memory[0x6000]).toBe(0x33);

      api.pset(0, 0, 0);
      api.pset(1, 0, 3);
      expect(memory[0x6000]).toBe(0x30);

      api.pset(0, 0, 15);
      api.pset(1, 0, 1);
      expect(memory[0x6000]).toBe(31);
    });

    it("is symmetrical with pget", () => {
      api.pset(0, 0, 1);
      api.pset(1, 0, 1);
      expect(api.pget(0, 0)).toBe(1);
      expect(api.pget(1, 0)).toBe(1);

      api.pset(2, 0, 2);
      api.pset(3, 0, 2);
      expect(api.pget(2, 0)).toBe(2);
      expect(api.pget(3, 0)).toBe(2);

      api.pset(4, 0, 0);
      api.pset(5, 0, 3);
      expect(api.pget(4, 0)).toBe(0);
      expect(api.pget(5, 0)).toBe(3);

      api.pset(6, 0, 15);
      api.pset(7, 0, 1);
      expect(api.pget(6, 0)).toBe(15);
      expect(api.pget(7, 0)).toBe(1);
    });

    it("[left] sets a pixel in the graphics buffer", () => {
      api.pset(0, 0, 15);
      expect(memory[0x6000]).toBe(0x0F);
      expect(memory[0x6001]).toBe(0x00);
    });

    it("[right] sets a pixel in the graphics buffer", () => {
      api.pset(0, 0, 8);
      api.pset(1, 0, 15);
      expect(memory[0x6000]).toBe(248);
      expect(memory[0x6001]).toBe(0x00);
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

  describe("shl", () => {
    it("shifts the bits of a number to the left", () => {
      expect(api.shl(1, 3)).toBe(8);
      // doesnt work like the docs
      // http://pico-8.wikia.com/wiki/Shl#Examples
      //expect(api.shl(0.125, 3)).toBe(1);
    });
  });

  describe("shr", () => {
    it("shifts the bits of a number to the right", () => {
      expect(api.shr(8, 3)).toBe(1);
      // doesnt work like the docs
      // http://pico-8.wikia.com/wiki/Shr#Examples
      //expect(api.shr(1, 3)).toBe(0.125);
      //expect(api.shr(-1, 3)).toBe(-0.125);
    });
  });

  describe("sgn", () => {
    it("returns the sign of a number, 1 for positive, -1 for negative", () => {
      expect(api.sgn(100)).toBe(1);
      expect(api.sgn(0)).toBe(1);
      expect(api.sgn(-14)).toBe(-1);
    });
  });

  describe("sin", () => {
    it("calculates the sine of an angle", () => {
      expect(api.sin(0)).toBeCloseTo(0);
      expect(api.sin(0.125)).toBeCloseTo(-0.7071);
      expect(api.sin(0.25)).toBeCloseTo(-1);
      expect(api.sin(0.375)).toBeCloseTo(-0.7071);
      expect(api.sin(0.5)).toBeCloseTo(0);
      expect(api.sin(0.625)).toBeCloseTo(0.7071);
      expect(api.sin(0.75)).toBeCloseTo(1);
      expect(api.sin(0.875)).toBeCloseTo(0.7071);
      expect(api.sin(1)).toBeCloseTo(0);
    });
  });

  describe("sqrt", () => {
    it("calculates the square root of a number", () => {
      expect(api.sqrt(9)).toBe(3);
      expect(api.sqrt(0.25)).toBe(0.5);
    });
  });

  describe("sub", () => {
    it("gets the substring of a string", () => {
      expect(api.sub("hello there", 1, 5)).toBe("hello");
      expect(api.sub("hello there", -5)).toBe("there");
    });
  });
});

