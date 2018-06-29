const escodegen = require("escodegen");
const lua2js = require("lua2js");
const pegjs = require("pegjs");

const grammar = require("./grammar.pegjs");
const helpers = require("./helpers.raw.js");
const parser = pegjs.buildParser(helpers + grammar);

export default parser.parse;
