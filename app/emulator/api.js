const π = Math.PI;

module.exports = memory => ({
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

  rnd(max) {
    return Math.random() * max;
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
