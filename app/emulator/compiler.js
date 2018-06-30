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
    "(async function() {",
    //"const c = async function() {",
    lines.join("\n"),
    //"};",
    //"await c();",
    "}())",
  ].join("\n").replace(/ flip\(\);/g, ' await flip();console.log("flipped!!", peek(0x5f40));').replace(/\(function/g, 'await (async function');
  console.log(code);

  return code;
}
