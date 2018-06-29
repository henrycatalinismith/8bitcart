{
  function loc() { return {start: { line: line(), column: column() } } }
  function range() { return [offset(), offset() + text().length]; }
  function listHelper(a,b,c) { return a == null ? [] : [a].concat(b.map(function(b) { return b[c || 2]; })); }
  function opt(name, def) { return name in options ? options[name] : def }

  function expandMultiStatements(list) {
    var out = [];
    for ( var i = 0; i < list.length; ++i ) {
        var value = list[i];
        if (value instanceof Array) out = out.concat(value);
        else out.push(value);
    }
    return out;
  }

  function wrapNode(obj, hasScope) {
    hasScope = !!hasScope 
    obj.loc = loc();
    obj.range = range();
    obj.hasScope = hasScope;
    obj.text = text();
    return obj;
  }

  function eUntermIfEmpty(what, type, end, start) {
    if ( what.length == 0 ) return eUnterminated(type, end, start);
    return true;
  }

  function eUnterminated(type, end, start) {
    var xline = start !== undefined ? start.loc.start.line : (line());
    var xcol = start !== undefined ? start.loc.start.column : (column());

    eMsg("`" + (end || "end") + "` expected (to close " + type + " at " + xline + ":" + xcol + ") at " + line() +  ":" + column() );
    return true;
  }

  function eMsg(why) {
    if ( !opt("loose", false) ) error(why);
    errors.push({msg: why, loc: loc(), range: range()});
    return true;
  }

  var opPrecedence = {
    "^": 10,
    "not": 9,
    "*": 8, "/": 8, "%": 8, "//": 8,
    "+": 7, "-": 7,
    "..": 6,
    "<": 5, ">": 5, ">=": 5, "<=": 5, "==": 5, "~=": 5,
    "and": 4,
    "or": 3
  }

  function precedenceClimber(tokens, lhs, min) {
    while ( true ) { 
        if ( tokens.length == 0 ) return lhs;
        var op = tokens[0];
        var prec = opPrecedence[op];
        if ( prec < min ) return lhs;
        tokens.shift();

        var rhs = tokens.shift();
        while ( true ) {
            var peek = tokens[0];
            if ( peek == null || opPrecedence[peek] <= prec ) break;
            rhs = precedenceClimber(tokens, rhs, opPrecedence[peek]);
        }

        lhs = bhelper.binaryExpression(op, lhs, rhs);
    }

  }

  var errors;

  function init() {
    errors = [];
  }

  var builder = {
    assignmentExpression: function(op, left, right) { return wrapNode({type: "AssignmentExpression", operator: op, left: left, right: right }); },
    binaryExpression: function(op, left, right) { return wrapNode({type: "BinaryExpression", operator: op, left: left, right: right }); },
    blockStatement: function(body) { return wrapNode({ type: "BlockStatement", body: body}); },
    callExpression: function(callee, args) { return wrapNode({ type: "CallExpression", callee: callee, arguments: args}); },
    emptyStatement: function() { return wrapNode({ type: "EmptyStatement" }); },
    functionDeclaration: function(name, args, body, isGenerator, isExpression) {
        return wrapNode({type: "FunctionDeclaration", id: name, params: args, body: body, generator: isGenerator, expression: isExpression });
    },
    memberExpression: function(obj, prop, isComputed) { return wrapNode({ type:"MemberExpression", object: obj, property: prop, computed: isComputed }); },
    variableDeclaration: function(kind, decls) { return { type: "VariableDeclaration", declarations: decls, kind: opt("forceVar", true) ? "var" : kind } },
    functionExpression: function(name, args, body) { return { type: "FunctionExpression", name: name, body: body, params: args } },
    returnStatement: function(arg) { return wrapNode({type: "ReturnStatement", argument: arg}); }
  };

  var i = function(n) { return { type: "Identifier", name: n}; }
  var id = i;
  var tmpVarCtr = 0;

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }



  function finalize(ast) {
    if ( opt("loose", false) ) ast.errors = errors;
    
    if ( opt("useStrict", false) ) {
        ast.body.unshift({
            type: "ExpressionStatement",
            expression: { type: "Literal", value: "use strict" }
        });
    }

    if ( opt("noSharedObjects", true) ) return clone(ast);
    return ast;
  }

  var bhelper = {
    blockStatement: function(body) {
        return builder.blockStatement(expandMultiStatements(body));
    },
    tempName: function() {
        return i("__lua$tmpvar$" + (++tmpVarCtr));
    },
    tempVar: function(exp) {
        return { type: "VariableDeclarator", id: bhelper.tempName(), init: exp };
    },
    assign: function(target, exp) {
        var out = builder.assignmentExpression("=", target, exp);
        if ( target.type == "MemberExpression" && opt("luaOperators", false) ) {
            var prop = target.property;
            if ( !target.computed ) prop = {"type": "Literal", "value": prop.name, loc: prop.loc, range: prop.range };
            
            var helper;
            var nue = bhelper.translateExpressionIfNeeded(target.object);

            if ( target.object.type == "Identifier" ) helper = target.object.name;

            if ( helper === undefined ) {
                nue = bhelper.luaOperator("indexAssign", nue, prop, exp);
            } else {
                nue = bhelper.luaOperator("indexAssign", nue, prop, exp, {type:"Literal", value: helper});
            }

            nue = {type: "ConditionalExpression",test: nue, consequent: exp, alternate: out};

            out = nue;
        }
            
        return {
            type: "ExpressionStatement",
            expression: out
        };
    },
    encloseDecls: function(body /*, decls...*/) {
        var decls = Array.prototype.slice.call(arguments, 1);
        return bhelper.encloseDeclsEx.apply(this, [body, opt("encloseWithFunctions", true) ].concat(decls));
    },
    encloseDeclsEx: function(body, enclose /*, decls...*/) {
        var decls = Array.prototype.slice.call(arguments, 2);
        var vals = [];
        var names = [];
        for ( var k in decls ) {
            var v = decls[k];
            vals.push(v.init);
            names.push(v.id);
        }

        if ( enclose ) {
            return {
                expression: builder.callExpression(
                    builder.functionExpression(null, names, bhelper.blockStatement(body)),
                    vals
                ),
                type: "ExpressionStatement"
            }
        } else {
            if ( decls.length < 1 ) return body;
            return bhelper.blockStatement([ builder.variableDeclaration("let", decls) ].concat(body));
        }
    },
    encloseDeclsUnpack: function(body, names, explist, force) {

        if ( force || opt("encloseWithFunctions", true) ) {
            return {
                expression: builder.callExpression(
                    builder.memberExpression(
                        builder.functionExpression(null, names, builder.blockStatement(body)),
                        i("apply")
                    ),
                    [{type: "Literal", value: null}, bhelper.luaOperatorA("expandReturnValues", explist)]
                ),
                type: "ExpressionStatement"
            }
        } else {
            var decls = [];
            for ( var idx in names ) {
                decls.push({
                    type: "VariableDeclarator",
                    id: names[idx],
                    init: idx.id
                });
            }
            return bhelper.blockStatement([ 
                builder.variableDeclaration("let", decls),
                bhelper.bulkAssign(names, explist)
                ].concat(body));
        }
    },
    bulkAssign: function(names, explist) {
        var temps = [];
        var body = [];
        for ( var i = 0; i < names.length; ++i ) {
            temps[i] = bhelper.tempName();
        }

        // If we are refrencing a previously set value in a bulk assign as a property
        // we want to use the old value to look up the index, so we will pull that from
        // the temp var passed in
        var extra = 0;
        for ( var i = 0; i < names.length; ++i ) {
            var exp = names[i];
            if ( exp.type == "MemberExpression" && exp.property.type == "Identifier" ) {
                for ( var j = 0; j < i; ++j) {
                    if ( names[j].name == exp.property.name ) {
                        var holding = bhelper.tempName();
                        temps.unshift(holding);
                        explist.unshift(exp.property);
                        exp.property = holding;
                        ++extra;
                    }
                }
            }
        }

        for ( var i = 0; i < names.length; ++i ) {
            body[i] = bhelper.assign(names[i], temps[i+extra]);
        }

        if ( names.length > 1 ) {
            return bhelper.encloseDeclsUnpack(body, temps, explist, true);
        } else {
            var value = explist[0];
            if ( value.type == "CallExpression" ) value = bhelper.luaOperator("oneValue", value);
            return bhelper.assign(names[0], value);
        }
        
    },
    luaOperator: function(op /*, args */) {
        var o = builder.callExpression(
            builder.memberExpression(i("__lua"), i(op)), 
            Array.prototype.slice.call(arguments, 1)
        );
        o.internal = true;
        return o;
    },
    luaOperatorA: function(op, args) {
        var o = builder.callExpression(
            builder.memberExpression(i("__lua"), i(op)), 
            args
        );
        o.internal = true;
        return o;
    },
    binaryExpression: function(op, a, b) {
        if ( opt("luaOperators", false) && op != "and" && op != "or" ) {
            var map = {"+": "add", "-": "sub", "*": "mul", "/": "div", "//": "intdiv", "^": "pow", "%":"mod",
                "..": "concat", "==": "eq", "<": "lt", "<=": "lte", ">": "gt", ">=": "gte", "~=": "ne",
                "and": "and", "or": "or"
            };
            
            return bhelper.luaOperator(map[op], a, b);
        } else {

            if ( op == "~=" ) xop = "!=";
            else if ( op == ".." ) op = "+";
            else if ( op == "or" ) op = "||";
            else if ( op == "and" ) op = "&&";
            else if ( op == "//" ) op = "/";

            a = bhelper.luaOperator("oneValue", a);
            b = bhelper.luaOperator("oneValue", b);

            return builder.binaryExpression(op, a, b);
        }
    },
    callExpression: function(callee, args) {
        if ( opt("luaCalls", false) ) {
            var that = {"type": "ThisExpression" };
            if ( callee.type == "MemberExpression" ) that = {"type":"Literal", "value": null};
            var flags = 0;
            if ( callee.selfSuggar ) {
                flags = flags | 1;
            }

            if ( opt('decorateLuaObjects', false) ) {
                flags = flags | 2;
            }

            var flagso = {"type": "Literal", "value": flags};
            var helper = null;
            
            if ( callee.type == "Identifier" ) helper = callee.name;
            else if ( callee.type == "MemberExpression" && !callee.computed ) helper = callee.property.name;

            helper = {"type": "Literal", "value": helper};

            if ( callee.selfSuggar ) {
                if ( callee.object.type == "Identifier" ) {
                    //Dont bother making a function if we are just an identifer.
                    var rcallee = bhelper.translateExpressionIfNeeded(callee)
                    return bhelper.luaOperator.apply(bhelper, ["call", flagso , rcallee, callee.object, helper].concat(args));

                } else {
                    var tmp = bhelper.tempVar(bhelper.translateExpressionIfNeeded(callee.object));
                    
                    var rexpr = builder.memberExpression(tmp.id, callee.property, callee.computed);
                    var rcallee = bhelper.translateExpressionIfNeeded(rexpr);
                    var expr = bhelper.luaOperator.apply(bhelper, ["call", flagso, rcallee, tmp.id, helper].concat(args));
                    return result = bhelper.encloseDeclsEx([
                        builder.returnStatement(
                            expr
                        )
                    ], true, tmp).expression;

                }
            } else {
                var rcallee = bhelper.translateExpressionIfNeeded(callee)
                if ( rcallee.type == "Identifier" && rcallee.name == "assert" ) {
                    args.push({type: "Literal", value: args[0].text || "?"})
                }
                return bhelper.luaOperator.apply(bhelper, ["call", flagso , rcallee, that, helper].concat(args));
            }
        } else {
            return builder.callExpression(callee, args);
        }
    },
    memberExpression: function(obj, prop, isComputed) {
        if ( opt("luaOperators", false) && !isComputed ) {
            var helper;
            if ( obj.type == "Identifier") helper = obj.name;

            if ( helper == undefined ) {
                return bhelper.luaOperator("index", obj, prop);
            } else {
                return bhelper.luaOperator("index", obj, prop, {type:"Literal", value: helper});
            }
        }
        return builder.memberExpression(obj, prop, isComputed);
    },
    translateExpressionIfNeeded: function(exp) {
        if ( !opt("luaOperators", false) ) return exp;
        if ( exp.type == "MemberExpression" ) {
            var prop = exp.property;
            if ( !exp.computed ) prop = {"type": "Literal", value: prop.name };
            var nu = bhelper.memberExpression(bhelper.translateExpressionIfNeeded(exp.object), prop, false);
            nu.origional = exp;
            nu.range = exp.range;
            nu.loc = exp.loc;
            return nu;
        }

        return exp;
    },
    injectRest: function(block, count) {
        block.unshift(builder.variableDeclaration("let", [
                {
                    type: "VariableDeclarator", 
                    id: {type: "Identifier", name:"__lua$rest"}, 
                    init: bhelper.luaOperator("rest", 
                        {type: "Identifier", name:"arguments"},
                        {type: "Literal", value:count}
                    )
                }
             ]));
    },
    valueProvdier: function(statement) {
        return builder.functionExpression(null, [], bhelper.blockStatement([
            builder.returnStatement(statement)
        ]));
    }
  }

}


start = &{ init(); return true; } ("#" [^\n]* "\n")? ws? t:BlockStatement ws? { return finalize(t); }

ws = ([ \r\t\n] / "--[" balstringinsde "]"  / ("--" ( [^\n]* "\n" / .* ) )) +
scws = (ws? ";" ws?)+ / ws 

BlockStatement =
    r:ReturnStatement
    {
        return builder.blockStatement([r]) 
    } /
    list:StatatementList ret:(scws+ ReturnStatement)? 
    {
        list = expandMultiStatements(list);
        return builder.blockStatement(ret === null ? list : list.concat([ret[1]])); 
    } 

StatatementList = 
    a:Statement? b:(scws+ Statement )* (ws? ";" ws?)*
    {  
        if ( a === null ) return [];
        if ( b === null ) return a;
        return listHelper(a,b,1);
    } 

ReservedWord = "if" / "then" / "elseif" / "else" / "do" / "end" / "return" / "local" / "nil" / "true" / "false"
    "function" / "not" / "break" / "for" / "until" / "function" / binop / unop

Name = !(ReservedWord (ws / !.)) a:$([a-zA-Z_][a-zA-Z0-9_]*) { return a; }

Number = $([0-9]+("." [0-9]+)?)

stringchar =
    "\\" c:[abfrntv'"\\] { return {
        "n": "\n",
        "b": "\b",
        "f": "\f",
        "r": "\r",
        "t": "\t",
        "v": "\v",
        '"': '"',
        "'": "'",
        "\\": "\\"
    }[c] } / 
    "\\\n" { return "\n" } /
    "\\\z" ws { return "" } /
    //"\\x" a:$[0-9a-f] b:$[0-9a-f] { return String.fromCharCode(parseInt('0x' + a + b)); } /
    "\\" a:$[0-9] b:$[0-9]? c:$[0-9]? { return String.fromCharCode(parseInt('' + a + b + c)); } /
    "\\" { error('Invalid Escape Sequence') } / 
    $[^'"'] 

singlequote = ['] { return wrapNode({}); }
doublequote = ["] { return wrapNode({}); }

String =
    s:doublequote r:(stringchar/"'") * e:(doublequote/) &{ return eUntermIfEmpty(e,"string","\"",s); } { return r.join(''); } /
    s:singlequote r:(stringchar/'"') * e:(singlequote/) &{ return eUntermIfEmpty(e,"string","'",s); } { return r.join(''); } / 
    "[" s: balstringinsde "]" { return s; }

balstringinsde =
    "=" a:balstringinsde "=" { return a; } /
    "[" [\n]? a:$(!("]" "="* "]") .)* "]" { return a;}


Statement = 
    s: ( 
    Debugger / BreakStatement /
    NumericFor /
    ForEach /
    RepeatUntil /
    WhileStatement /
    IfStatement /
    ExpressionStatement / 
    DoEndGrouped /
    LocalAssingment /
    FunctionDeclaration /
    LocalFunction /
    DoEndGrouped /
    !(ws? ReservedWord) e:$Expression &{ return eMsg("Found an expression but expected a statement: " + e)} { return builder.emptyStatement(); } /
    !(ws? ReservedWord) e:$Identifier &{ return eMsg("`=` expected")} { return builder.emptyStatement(); } /
    !(ws? ReservedWord) e:$[^\n\t\r ] [^\n]* ([\n]/!.) &{ return eMsg("Parser error near `" + e + "`"); } { return builder.emptyStatement(); }
    ) 

Debugger = 
    "debugger"
    { return {type: "ExpressionStatement", expression: {type: "Identifier", name:"debugger; "} } }

DoEndGrouped = 
    start:do ws? b:BlockStatement ws? end:("end"/) & { return eUntermIfEmpty(end, "do", "end", start); }
    { return b }

if = "if" { return wrapNode({}); }
do = "do" { return wrapNode({}); }
for = "for" { return wrapNode({}); }
function = "function" { return wrapNode({}); }

NumericFor =
    start:for ws a:Identifier ws? "=" ws? b:Expression ws? "," ws? c:Expression d:( ws? "," ws? Expression )? ws? "do" ws? body:BlockStatement ws? end:("end"/) &{ return eUntermIfEmpty(end, "for", "end", start); } 
    {
        var amount = d == null ? {type: "Literal", value: 1 } : d[3];
        

        var start = bhelper.tempVar(b);
        var updateBy = bhelper.tempVar(amount);
        var testValue = bhelper.tempVar(c);
        var idx = bhelper.tempVar();

        var update = builder.assignmentExpression("=", idx.id, bhelper.binaryExpression("+", idx.id, updateBy.id));

        var texp;
        if ( false ) {
            texp = bhelper.binaryExpression("<=", idx.id, testValue.id)
        } else {
            texp = bhelper.luaOperator("forcomp", updateBy.id, idx.id, testValue.id);
        }


        body.body.unshift(builder.variableDeclaration("let",[
            {
                    type: "VariableDeclarator",
                    id: a,
                    init: idx.id
            }
        ]));

        var out = {
            type: "ForStatement",
            init: builder.variableDeclaration("let", [
                {
                    type: "VariableDeclarator",
                    id: idx.id,
                    init: start.id,
                }
            ]),
            body: body,
            update: update,
            test: texp,
            loc: loc(),
            range: range()
        };

        return bhelper.encloseDecls([out], start, updateBy, testValue);
    }

ForEach =
    start:for ws a:namelist ws "in" ws b:explist ws "do" ws? c:BlockStatement ws? end:("end"/) & { return eUntermIfEmpty(end, "for", "end", start); } 
    {
        var statements = [];
        var nil = {type: "Literal", value: null };
        var uf = {type: "Identifier", name: 'undefined' };


        var iterator = bhelper.tempName();
        var context = bhelper.tempName();
        var curent = bhelper.tempName();

        var v1 = a[0];

        var varlist = [];
        for ( var idx in a ) {
            varlist.push({type: "VariableDeclarator", id: a[idx] });
        }

        var call = builder.callExpression(iterator,[context, curent]);
        var assign;
        //if ( a.length > 1 ) {
            assign = bhelper.bulkAssign(a, [call])
        //} else {
        //    assign = bhelper.assign(v1, call);
        //}

        var nullish = function(v) {
            return builder.binaryExpression("||", builder.binaryExpression("===", v1, nil), builder.binaryExpression("===", v1, uf))
        }

        statements.push(builder.variableDeclaration("let", varlist));
        statements.push({
            type: "WhileStatement",
            test: {type: "Literal", value: true},
            body: bhelper.blockStatement([
            assign,
            { type: "IfStatement", test: nullish(v1), consequent: {type: "BreakStatement" } },
            bhelper.assign(curent, v1),
            c.body

            ])
        });

        return bhelper.encloseDeclsUnpack(statements, [iterator, context, curent], b);
    }


LocalAssingment =
    "local" ws left:namelist ws? "=" ws? right:explist
    { 
        var result = builder.variableDeclaration("let", []);

        if ( !opt('decorateLuaObjects', false) || ( left.length < 2 && right.length < 2 )) { 
            for ( var i = 0; i < left.length; ++i ) {
                result.declarations.push(            {
                    type: "VariableDeclarator",
                    id: left[i],
                    init: right[i],
                });
            }

            return result;
        } else {
            var assign = bhelper.bulkAssign(left, right)
            for ( var i = 0; i < left.length; ++i ) {
                result.declarations.push({
                    type: "VariableDeclarator",
                    id: left[i]
                });
            }
         
            return [result, assign];   
        }
    
    }/
    "local" ws left:namelist
    {
        var result = builder.variableDeclaration("let", []);
        for ( var i = 0; i < left.length; ++i ) {
            result.declarations.push({
                type: "VariableDeclarator",
                id: left[i]
            });
        }
        return result;  
    }

AssignmentExpression =
    left:varlist ws? "=" ws? right:explist
    { 
        // if ( left.length < 2 ) return bhelper.assign(left[0], right[0]).expression;
        return bhelper.bulkAssign(left, right).expression;
    }

BreakStatement = 
    "break"
    { return {
        "type": "BreakStatement",
        loc: loc(),
        range: range()
    } }

ExpressionStatement =
    e:(AssignmentExpression/CallExpression)
    { return {
        type: "ExpressionStatement",
        expression: e,
        loc: loc(),
        range: range()
    } }


elseif = "elseif" ws test:Expression ws "then" ws then:BlockStatement { return wrapNode({test: test, then:then}); }

IfStatement =
    start:if ws test:Expression ws 
    ("then" / &{ return eUnterminated("if","then"); } ) ws then:BlockStatement 
    elzeifs:( ws? elseif )* 

    elze:( ws? "else" ws BlockStatement )? ws? end:("end"/) &{ return eUntermIfEmpty(end, "if", "end", start); }
    

    {
        var result = { type: "IfStatement", test: test, consequent: then, loc: loc(), range: range()}
        var last = result;

        for ( var idx in elzeifs ) {
            var elif = elzeifs[idx][1];
            var nue = { type: "IfStatement", test: elif.test, consequent: elif.then, loc: elif.loc, range: elif.range }
            last.alternate = nue;
            last = nue;
        }

        if ( elze !== null ) last.alternate = elze[3];
        return result;
    }

ReturnStatement = 
    "return" ws argument:explist
    { 
        var arg;


        if ( argument == null ) { }
        else if ( argument.length == 1 ) arg = argument[0];
        else if ( argument.length > 1 ) {
            if ( opt('decorateLuaObjects', false) ) arg = bhelper.luaOperatorA("makeMultiReturn", argument);
            else  arg = {
                type: "ArrayExpression",
                elements: argument
            };            
        }
        return {
            type: "ReturnStatement",
            argument: arg,
            loc: loc(),
            range: range()
        }
    } /
    "return"
    {
        return {
            type: "ReturnStatement",
            loc: loc(),
        }     
    }

WhileStatement =
    "while" ws test:Expression ws "do" ws body:BlockStatement ws ( "end" / & { return eUnterminated("if"); } ) 
    { return {
        type: "WhileStatement",
        test: test,
        body: body,
        loc: loc(),
        range: range()

    } }


RepeatUntil =
    "repeat" ws body:BlockStatement ws? ( "until" / & { return eUnterminated("repeat", "until"); } )  ws  test:( Expression / &{return eMsg("repeat until needs terminations criteria"); })
    { return {
        type: "DoWhileStatement",
        test: { 
            type: "UnaryExpression",
            operator: "!",
            argument: test,
            prefix: true,
            loc: test.loc,
            range: test.range
        },
        body: body,
        loc: loc(),
        range: range()
    } }


That = "that" { return { "type": "ThisExpression" }; }

SimpleExpression = (
     Literal / ResetExpression / FunctionExpression / CallExpression / That / Identifier /
    ObjectExpression / UnaryExpression / ParenExpr )

Expression = AssignmentExpression / BinSimpleExpression

BinSimpleExpression = 
    a:(MemberExpression/SimpleExpression) b:( ws? op:binop ws? (MemberExpression/SimpleExpression) )*
    {
        a = bhelper.translateExpressionIfNeeded(a);
        if ( b === null ) return a;
        var tokens = [];
        for ( var idx in b ) {
            var v = b[idx];
            tokens.push(v[1]);
            tokens.push(bhelper.translateExpressionIfNeeded(v[3]));
        }

        return precedenceClimber(tokens, a, 1);
    }



unop = $("-" / "not" / "#")
binop = $("+" / "-" / "==" / ">=" / "<=" / "~=" / ">" / "<" / ".." / "and" / "or" / "*" / "//" / "/" / "%" / "^" )


prefixexp =
    funcname / '(' ws? e:Expression ws? ')' { return e; }

CallExpression = 
    !("function" ws? "(") who:prefixexp a:(ws? (":" Identifier )? callsuffix)+
    {
        var left = who
        for ( var idx = 0; idx < a.length; ++idx ) {
            var v = a[idx];
            if ( v[1] != null ) {
                left = builder.memberExpression(left, v[1][1], false);
                left.selfSuggar = true;
            }
            left = bhelper.callExpression(left,v[2]);
        }
        return left;
    } 

callsuffix =
    a:args { return a; } /
    b:ObjectExpression { return [b]; } /
    c:String { return [{type: "Literal", value: c, loc: loc(), range: range()}]; }

ParenExpr = "(" ws? a:Expression ws? ")" {

    // Wraping a call in ()'s reduces it to a singel value
    if ( a.type == "CallExpression" ) {
        return bhelper.luaOperator("oneValue", a);
    } else if ( a.type == "Identifier" && a.name == "__lua$rest" ) {
        return bhelper.luaOperator("oneValue", a);
    }
    return a;
}

ResetExpression = 
    "..." {
        return wrapNode({type: "Identifier", name: "__lua$rest"});
    }




funcname =
    a:(That/Identifier) b:( funcnamesuffix )*
    {
        var selfSuggar = false;
        if ( b.length == 0 ) return a;
        var left = a;
        for ( var i in b ) {
            left = builder.memberExpression(left, b[i].exp, b[i].computed);
            if ( b[i].suggar ) left.selfSuggar = true;
        }

        return left;
    }

funcnamesuffix = 
    ws? p:[.:] ws? e:Identifier 
    {
        return {exp: e, suggar: p == ':', computed: false }
    } /
    ws? "[" ws? e:Expression ws? "]"
    {
        return {exp: e, suggar: false, computed: true }
    }

explist = 
    a:Expression b:(ws? "," ws? e:(Expression / &{ return eMsg("Malformed argument list."); } ))*
    {
         return listHelper(a,b,3); 
    }

varlist = 
a:var b:(ws? "," ws? e:var)*
{
     return listHelper(a,b,3); 
} 

namelist = 
    a:Identifier b:(ws? "," ws? e:Identifier)*
    {
         return listHelper(a,b,3); 
    } 

args =
    "(" ws? a:explist ws? (")" / &{return eUnterminated(")", "argument list"); })
    {
         return a; 
    } /
    "(" ws? (")" / &{return eUnterminated(")", "argument list"); })
    {
        return []
    }

var = MemberExpression / Identifier

MemberExpression = 
    a:(CallExpression/SimpleExpression) b:indexer c:indexer*
    { 
        var left = builder.memberExpression(a, b[0], b[1]);
        for ( var idx in c ) {
            left = builder.memberExpression(left, c[idx][0], c[idx][1]);
        }
        return left;
    } 
    

indexer =
    "[" ws? b:Expression ws? "]" { return [b, true]; } /
    "." b:SimpleExpression { return [b,false]; }



ObjectExpression =
    "{" ws? f:field? s:(ws? ("," / ";") ws? field)* ws? "}" 
    { 
        var result = {
            type: "ObjectExpression",
            properties: [],
            loc: loc(),
            range: range()
        };

        var props = listHelper(f,s,3);
        var numeric = 0;
        var longProps = [];
        for ( var idx in props ) {
            var p = props[idx];

            if ( p.key === undefined ) p.key = {type: "Literal", value: ++numeric, arrayLike: true};
            p.kind = "init";
            result.properties.push(p);
        }


        if ( opt('decorateLuaObjects', false) ) {
            var last;
            var args = [];
            var pp = [];
            var last = true;
            for ( var idx in result.properties ) {
                var p = result.properties[idx];
                if ( p.key.arrayLike ) {
                    args.push(p.value);
                    last = true;
                } else {
                    longProps.push({
                        type: "ArrayExpression",
                        elements: [p.key, p.value]
                    });
                    pp.push(p);
                    last = false;
                }
            }
            result.properties = pp;

            result = {type: "ArrayExpression", elements: longProps };
            if (pp.length < 1 ) result = {type:"Literal", value: null};

            return bhelper.luaOperator.apply(bhelper, ["makeTable", result, {type: "Literal", value:last}].concat(args)); 
        }
        else return result;
    }

field =
                                          /* Otherwise we think it might be a multi assignment */
    n:(Literal/Identifier) ws? "=" ws? v:(BinSimpleExpression) 
    {
        if ( n.type == "Identifier" ) n = {type: "Literal", value: n.name};
        return { key: n, value: v };
    }/
    v:BinSimpleExpression ws?
    {
        return { value: v };
    }/
    ws? "[" ws? k:Expression ws? "]" ws? "=" ws? v:BinSimpleExpression
    {
        return { key: k, value: v }; 
    }


FunctionDeclaration =
    start:function ws? name:funcname ws? f:funcbody ws? end:("end"/) & { return eUntermIfEmpty(end, "function", "end", start); }
    {



        if ( name.type != "MemberExpression" && opt("allowRegularFunctions", false) ) {
            //TODO: this would need to be decorated
            return builder.functionDeclaration(name, f.params, f.body);
        }

        //TODO: Translate member expression into call
        var params = f.params.slice(0);
        if ( name.selfSuggar ) params = [{type: "Identifier", name: "self"}].concat(f.params);

        if ( f.rest ) {
            bhelper.injectRest(f.body.body, params.length);
        }

        var out = builder.functionExpression(null, params, f.body)
        if ( opt('decorateLuaObjects', false) ) {
            out = bhelper.luaOperator("makeFunction", out);
        }

        return bhelper.assign(name, out);
    }

LocalFunction =
    "local" ws start:function ws? name:funcname ws? f:funcbody ws? end:("end"/) & { return eUntermIfEmpty(end, "function", "end", start); }
    {

        if ( f.rest ) {
            bhelper.injectRest(f.body.body, f.params.length);
        }

        if ( opt("allowRegularFunctions", false) )
            return builder.functionDeclaration(name, f.params, f.body);

        var func = builder.functionExpression(name, f.params, f.body);
        if ( opt('decorateLuaObjects', false) ) {
            func = bhelper.luaOperator("makeFunction", func);
        }

        var decl = {type: "VariableDeclarator", id: name, init: func};
        var out = builder.variableDeclaration("let", [ decl ]);

        return out;
    } 

FunctionExpression = 
    f:funcdef 
    {
        var result = {
            type: "FunctionExpression",
            body: f.body,
            params: f.params,
            loc:loc(),
            range:range()
        }

        if ( f.rest ) {
            bhelper.injectRest(f.body.body, f.params.length)
        }

        if ( opt('decorateLuaObjects', false) ) {
            return bhelper.luaOperator("makeFunction", result);
        } else {
            return result;
        }

    }

funcdef = 
    start:function ws? b:funcbody ws? end:("end"/) & { return eUntermIfEmpty(end, "function", "end", start); } { return b; }

funcbody = 
    "(" ws? p:paramlist ws? rest:("," ws? "..." ws?)? ")" ws? body:BlockStatement
    {
        return { params: p, body: body, rest: rest != null }
    } /
    "(" ws? "..." ws? ")" ws? body:BlockStatement
    {
        return { params: [], body: body, rest: true }
    }

paramlist = 
    a:Identifier ws? b:("," ws? Identifier)*
    {
        return listHelper(a,b); 
    } /
    ws? { 
        return [] 
    }


UnaryExpression =
    o:unop ws? e:(MemberExpression/SimpleExpression/Expression)
    { 
        var ops = {"not": "!", "-": "-", "#": "#" }
        if ( o == "#" ) {
            e = bhelper.translateExpressionIfNeeded(e);
            return bhelper.luaOperator("count", e);
        }
        return { 
            type: "UnaryExpression",
            operator: ops[o],
            argument: bhelper.translateExpressionIfNeeded(e),
            prefix: true,
            loc: loc(),
            range: range()
        }
    }

Identifier =
    name:Name
    { return {
        type: "Identifier",
        name: name,
        loc: loc(),
        range: range()
    } }

Literal = 
    a: ("nil" / "false" / "true") 
    {
        var values = {"nil": null, "false": false, "true": true} 
        return { type: "Literal", value: values[a], loc: loc(), range: range() }

    } / 
    b: Number [eE] c:$(("-" / "+")? [0-9]+)
    {
        return { type: "Literal", value: parseFloat(b) * Math.pow(10, parseInt(c)), loc: loc(), range: range()  }

    } /
    b: "0" [Xx] b:$([0-9a-fA-F]+)
    {
        return { type: "Literal", value: parseInt(b, 16), loc: loc(), range: range()  }

    } /
    b: Number
    {
        return { type: "Literal", value: parseFloat(b), loc: loc(), range: range()  }

    } /
    s: String
    {
        return { type: "Literal", value: s, loc: loc(), range: range()  }

    }
