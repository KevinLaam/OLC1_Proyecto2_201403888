
const Lexer = require("./lexer/Lexer");
const Parser = require("./parser/Parser");
const Interpreter = require("./interpreter/Interpreter");
const util = require("node:util");

class Analizador {

    analyze(source) {

        // 1. Análisis léxico
        const lexer = new Lexer(source);
        const tokens = lexer.scanTokens();

        // 2. Análisis sintáctico
        const parser = new Parser(tokens);
        const ast = parser.parse();

        // 3. Obtener errores
        const lexicalErrors = lexer.errors;
        const syntaxErrors = parser.errors;

        // 4. Detener ejecución si hay errores
        if (
            lexicalErrors.length > 0 ||
            syntaxErrors.length > 0
        ) {
            return {
                success: false,
                tokens,
                lexicalErrors,
                syntaxErrors,
                ast,
                executed: false
            };
        }

        // 5. Ejecutar el intérprete
  
                
        const interpreter = new Interpreter(ast);

        // Ejecutar el programa
        interpreter.execute();

        // Obtener los mensajes capturados
        const output = interpreter.output;

        //obtiene la informacion de la infraestructura
        //const infrastructure = Object.entries(interpreter.resources)
        //.map(([name, properties]) => ({
        //    name,
        //    ...properties
        //}));

        const infrastructure = Array.from(interpreter.resources.entries())
        .map(([name, properties]) => ({
            name,
            ...properties
        }));
        //para reporte de tabla de simbolos
       // Obtener todos los símbolos registrados durante la ejecución
        const symbols = interpreter.symbolTable;



        // 6. Devolver los resultados
        return {
        success: true,
        tokens,
        lexicalErrors,
        syntaxErrors,
        ast,
        executed: true,
        output,
        infrastructure,
        symbols
        };
    }
}

module.exports = Analizador;
