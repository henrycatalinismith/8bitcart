module.exports = memory => ({
  memset(destaddr, val, len) {
    memory.fill(val, destaddr, destaddr + len);
  },

  peek(address) {
    return memory[address];
  },

  poke(address, value) {
    memory[address] = value;
  },
});
