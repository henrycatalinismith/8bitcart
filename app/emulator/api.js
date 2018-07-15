// Maps pixel coordinates to memory addresses
//
// | Coordinates     | Address |
// |-----------------|---------|
// | pixel[0][0]     | 0x6000  |
// | pixel[127][127] | 0x7fff  |
// |-----------------|---------|
const pixel = (function(width, height) {
  const _pixel = [];
  for (let x = 0; x < width; x++) {
    _pixel.push([]);
    for (let y = 0; y < height; y++) {
      _pixel[x].push(0x6000 + (y * 64) + Math.floor(x / 2));
    }
  }
  return _pixel;
}(128, 128));

const π = Math.PI;

const pset = (memory, x, y, c) => {
  if (x < 0 || y < 0 || x > 127 || y > 127) {
    return;
  }
  memory[pixel[x][y]] = x % 2 === 0
    ? ((memory[pixel[x][y]] >> 4) << 4) | c
    : (c << 4) | (memory[pixel[x][y]] & 0x0f);
};

module.exports = memory => {
  const api = {
    abs(num) {
      return Math.abs(num);
    },

    //atan2(dx, dy) {
    //},

    band(first, second) {
      return first & second;
    },

    bnot(num) {
      return ~num;
    },

    bor(first, second) {
      return first | second;
    },

    bxor(first, second) {
      return first ^ second;
    },

    cos(angle) {
      return Math.cos((angle * 360) * (π / 180))
    },

    cls() {
      memory.fill(0, 0x6000, 0x7fff);
    },

    flip: async () => {
      return new Promise(r => setTimeout(r, 16));
    },

    line: (x0, y0, x1, y1, c) => {
      let x = x0;
      let y = y0;

      const dx = Math.abs(x1 - x0);
      const dy = Math.abs(y1 - y0);

      const sx = (x0 < x1) ? 1 : -1;
      const sy = (y0 < y1) ? 1 : -1;

      let err = dx - dy;

      while (true) {
        pset(memory, x, y, c);

        if (x === x1 && y === y1) {
          break;
        }

        const e2 = 2 * err;

        if (e2 >- dy) {
          err -= dy;
          x += sx;
        }

        if (e2 < dx) {
          err += dx;
          y += sy;
        }
      }
    },

    //lshr(num, bits) {
    //},

    max(first, second = 0) {
      return Math.max(first, second);
    },

    mid(first, second, third) {
      const arr = [first, second, third];
      arr.sort();
      return arr[1];
    },

    min(first, second = 0) {
      return Math.min(first, second);
    },

    memset(destaddr, val, len) {
      memory.fill(val, destaddr, destaddr + len);
    },

    peek(address) {
      return memory[address];
    },

    poke(address, value) {
      memory[address] = value;
    },

    pget(x, y) {
      return x % 2 === 0
        ? memory[pixel[x][y]] & 0x0f
        : memory[pixel[x][y]] >> 4;
    },

    pset(x, y, c) {
      pset(memory, x, y, c);
    },

    rnd(max) {
      return Math.random() * max;
    },

    sgn(number) {
      return number < 0 ? -1 : 1;
    },

    shl(num, bits) {
      return num << bits;
    },

    shr(num, bits) {
      return num >> bits;
    },

    sin(angle) {
      return Math.sin((-angle * 360) * (π / 180))
    },

    sqrt(num) {
      return Math.sqrt(num);
    },

    sub(str, start, end) {
      if (end === undefined) {
        if (start < 0) {
          return str.substring(str.length + start, str.length);
        } else {
          return str.substring(start - 1);
        }
      } else {
        return str.substring(start - 1, end - start + 1);
      }
    },
  };

  Object.keys(api).forEach(name => {
    api[name] = api[name].bind(api);
  });

  return api;
};
