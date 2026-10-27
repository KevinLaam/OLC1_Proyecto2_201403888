
const Lexer = require("./src/lexer/Lexer");
const Parser = require("./src/parser/Parser");
const Interpreter = require("./src/interpreter/Interpreter");


const source = `
server ServidorPrincipal {
    cpu = 4;
    memory = 8;
}

service ServicioWeb {
    replicas = 1;
}

database BasePrincipal {
    port = 5432;
}

task PruebaOperaciones {

    // INSTALAR SOFTWARE
    install(ServidorPrincipal, "nginx");
    install(ServidorPrincipal, "docker");

    int instaladosAntes = length(ServidorPrincipal.installed);
    print(instaladosAntes);

    // DESINSTALAR SOFTWARE
    uninstall(ServidorPrincipal, "nginx");

    int instaladosDespues = length(ServidorPrincipal.installed);
    print(instaladosDespues);

    // DESPLEGAR SERVICIO
    deploy(ServicioWeb);

    string estadoServicio = ServicioWeb.status;
    print(estadoServicio);

    // ESCALAR SERVICIO
    scale(ServicioWeb, 3);

    int replicasFinales = ServicioWeb.replicas;
    print(replicasFinales);

    // CONECTAR SERVIDOR CON BASE DE DATOS
    connect(ServidorPrincipal, BasePrincipal);

    int conexionesAntes = length(ServidorPrincipal.connections);
    print(conexionesAntes);

    // DESCONECTAR
    disconnect(ServidorPrincipal, BasePrincipal);

    int conexionesDespues = length(ServidorPrincipal.connections);
    print(conexionesDespues);

}

main {
    run PruebaOperaciones;
}
`;



// Análisis léxico
const lexer = new Lexer(source);
const tokens = lexer.scanTokens();

// Análisis sintáctico
const parser = new Parser(tokens);
const ast = parser.parse();

// Mostrar errores
console.log("===== ERRORES LÉXICOS =====");
console.table(lexer.errors);

console.log("===== ERRORES SINTÁCTICOS =====");
console.table(parser.errors);

// Ejecutar intérprete únicamente si no hay errores
if (lexer.errors.length === 0 && parser.errors.length === 0) {

    console.log("===== INICIO INTÉRPRETE =====");

    const interpreter = new Interpreter(ast);
    interpreter.execute();

    console.log("===== PRUEBAS DE EVALUACIÓN =====");

    console.log(
        "Entero:",
        interpreter.evaluate({
            type: "Literal",
            value: "10",
            valueType: "ENTERO"
        })
    );

    console.log(
        "Decimal:",
        interpreter.evaluate({
            type: "Literal",
            value: "3.5",
            valueType: "DECIMAL"
        })
    );

    console.log(
        "Cadena:",
        interpreter.evaluate({
            type: "Literal",
            value: '"Hola AutoInfra"',
            valueType: "CADENA"
        })
    );

    console.log(
        "Booleano:",
        interpreter.evaluate({
            type: "Literal",
            value: "true",
            valueType: "TRUE"
        })
    );

}
