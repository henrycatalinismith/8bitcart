const π = Math.PI;

module.exports = memory => ({
  //atan2(dx, dy) {
  //},

  cos(angle) {
    return Math.cos((angle * 360) * (π / 180))
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

  sin(angle) {
    return Math.sin((-angle * 360) * (π / 180))
  },
});
