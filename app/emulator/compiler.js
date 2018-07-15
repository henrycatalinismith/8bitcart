const escodegen = require("escodegen");
const esprima = require("esprima");
const esprimaWalk = require("esprima-walk");
const { keys, clone } = require("underscore");

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

  const code = lines.join("\n");
    //.replace(/ flip\(\);/g, ' await flip();')
    //.replace(/\(function/g, 'await (async function')


  const ast2 = esprima.parse(code);

  //console.log(code, ast2);

  const syncFunctionCalls = [];
  esprimaWalk.walkAddParent(ast2, node => {
    if (node.type !== 'CallExpression') return;
    if (node.parent.type === 'AwaitExpression') return;
    //console.log(JSON.stringify(node.value));
    //console.log(node.parent.type);
    //console.log(node.callee);

    if (node.callee && node.callee.object && node.callee.object.name === "__lua") {
      return;
    }

    syncFunctionCalls.push(node);
  });

  syncFunctionCalls.forEach(node => {
    const oldNode = clone(node);
    node.type = 'AwaitExpression';
    node.argument = oldNode;

    keys(node).forEach(key => {
      if (key !== 'type' && key !== 'argument') {
        delete node[key];
      }
    });
  });

  const code2 = escodegen
    .generate(ast2)
    .substring(6)
    .replace(/ = function/g, ' = async function')
    .replace(/await function/g, 'await async function');

  console.log(code2);

  return code2;
}
