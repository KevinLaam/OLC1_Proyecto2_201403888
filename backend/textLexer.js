const Lexer = require("./src/lexer/Lexer");

const source = `
print("Hola AutoInfra");
start(miServidor);
stop(miServidor);
restart(miServidor);
install(miServidor);
uninstall(miServidor);
deploy(miServicio);
scale(miServicio, 3);
connect(miServidor, miBase);
disconnect(miServidor, miBase);
length(numeros);
status(miServidor);
`;

const lexer = new Lexer(source);

const tokens = lexer.scanTokens();

//lexer.scanTokens();

console.log("===== TOKENS =====");
console.table(tokens);

console.log("===== ERRORES LÉXICOS =====");
console.table(lexer.errors);