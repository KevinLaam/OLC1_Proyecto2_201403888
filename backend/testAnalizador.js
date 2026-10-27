
const Analizador = require("./src/Analizador");

const source = `
server ServidorPrincipal {
    cpu = 4;
    memory = 8;
}

task PruebaIntegracion {

    int numero = 10;

    int resultado = numero + 5;

    print("Probando integracion del backend");

    print(resultado);

}

main {
    run PruebaIntegracion;
}
`;

const analyzer = new Analizador();

const result = analyzer.analyze(source);

console.log("\n===== RESULTADO DEL ANALIZADOR =====");

console.log("Análisis exitoso:", result.success);

console.log("Cantidad de tokens:", result.tokens.length);

console.log("Errores léxicos:", result.lexicalErrors.length);

console.log("Errores sintácticos:", result.syntaxErrors.length);

console.log("Programa ejecutado:", result.executed);

console.log("\n===== SALIDA CAPTURADA =====");

console.table(result.output);