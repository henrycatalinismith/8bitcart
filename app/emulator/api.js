const π = Math.PI;

const pxa = (x, y) => {
  const addr = 0x6000 + ((x >> 1) + y * 64)+1;
  const and = x & 1;
  const add = and ? 1 : 0;
  return 0x6000 + ((x >> 1) + y * 64)+add;
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

module.exports = memory => ({
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
    return pxc(x, y, memory);
  },

  pset(x, y, c) {
    const addr = pxa(x, y);
    memory[addr] = c;
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
});
