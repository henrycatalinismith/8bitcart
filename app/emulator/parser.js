const escodegen = require("escodegen");
const lua2js = require("lua2js");
const pegjs = require("pegjs");

const grammar = require("./grammar.pegjs");
const parser = pegjs.buildParser(grammar);

export default parser.parse;
