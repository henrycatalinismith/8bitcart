module.exports = memory => (address, value) => {
  memory[address] = value;
};
