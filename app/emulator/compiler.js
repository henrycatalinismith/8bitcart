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
  lines.unshift(["(async function() {"]);
  lines.push(["}());"]);

  const code = lines
    .join("\n")
    .replace(/ flip\(\);/g, ' await flip();')
    .replace(/\(function/g, 'await (async function');

  console.log(code);

  return code;
}
