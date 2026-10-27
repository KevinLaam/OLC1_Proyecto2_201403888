
const Lexer = require("./src/lexer/Lexer");
const Parser = require("./src/parser/Parser");



const source = `
task PruebaErrores {

    int numero = 10;

    int resultado = ;

    int siguiente = 20;

}
`;;



const lexer = new Lexer(source);
const tokens = lexer.scanTokens();

const parser = new Parser(tokens);
const ast = parser.parse();

console.log("===== AST FUNCTION =====");
console.log(JSON.stringify(ast, null, 2));

console.log("===== ERRORES LÉXICOS =====");
console.table(lexer.errors);

console.log("===== ERRORES SINTÁCTICOS =====");
console.table(parser.errors);

console.log("===== TOKENS SIN CONSUMIR =====");
console.table(tokens.slice(parser.position));
