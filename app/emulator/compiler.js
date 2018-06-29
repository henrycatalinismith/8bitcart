const escodegen = require("escodegen");

const options = {
  format: {
    indent: {
      style: "  ",
    }
  }
};

export default function compile(ast) {
  const lines = escodegen.generate(ast, options).split("\n");

  lines.shift();
  lines.pop();

  const code = [
    "(function() {",
    lines.join("\n"),
    "}())",
  ].join("\n");

  return code;
}
