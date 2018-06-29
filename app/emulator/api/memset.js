module.exports = memory => (destaddr, val, len) => {
  memory.fill(val, destaddr, destaddr + len);
};

