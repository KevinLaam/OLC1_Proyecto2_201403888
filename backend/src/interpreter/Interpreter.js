
class Interpreter {

    constructor(ast) {
        this.ast = ast;
        this.variables = new Map();

        //para reporte 
        this.variableTypes = new Map();

        this.output = [];

         // Almacenar las tareas del programa
        this.tasks = new Map();
        // Almacenar los recursos de infraestructura
        this.resources = new Map();

        this.functions = new Map();

       
    }

    
    execute() {

        if (!this.ast || this.ast.type !== "Program") {
            this.log("No se encontró un programa válido");
            return;
        }

        // Primera pasada: registrar las tareas
        for (const declaration of this.ast.declarations) {

            if (declaration.type === "TaskDeclaration") {
                this.registerTask(declaration);
            } else if (
                declaration.type === "ServerDeclaration" ||
                declaration.type === "ServiceDeclaration" ||
                declaration.type === "DatabaseDeclaration"
            ) {

                this.registerResource(declaration);

            }else if (declaration.type === "FunctionDeclaration") {

                this.registerFunction(declaration);

            }

        }

        // Segunda pasada: buscar y ejecutar main
        for (const declaration of this.ast.declarations) {

            if (declaration.type === "MainDeclaration") {
                this.executeMain(declaration);
            }

        }

    }

        
    registerTask(declaration) {

        // Guardar la tarea utilizando su nombre
        this.tasks.set(
            declaration.name,
            declaration
        );

        this.log(
            "Tarea registrada:",
            declaration.name
        );

    }

        
    registerFunction(declaration) {

        this.functions.set(
            declaration.name,
            declaration
        );

        this.log(
            "Función registrada:",
            declaration.name
        );

    }

    
    executeFunction(name, args) {

        const funcion = this.functions.get(name);

        if (!funcion) {
            this.log("Función no encontrada:", name);
            return null;
        }

        this.log("Ejecutando función:", name);

        // Guardar el entorno actual
        const previousVariables = this.variables;

        // Crear un entorno local para la función
        this.variables = new Map(previousVariables);

        try {

            // Asignar los argumentos a los parámetros
            for (let i = 0; i < funcion.parameters.length; i++) {

                const parameter = funcion.parameters[i];

                this.variables.set(
                    parameter.name,
                    args[i]
                );

            }

            // Ejecutar las instrucciones de la función
            for (const instruction of funcion.body) {

                const signal = this.executeStatement(instruction);

                if (signal && signal.type === "return") {

                    this.log(
                        "Función retornó:",
                        signal.value
                    );

                    return signal.value;
                }

            }

            return null;

        } finally {

            // Restaurar las variables del entorno anterior
            this.variables = previousVariables;

        }

    }

    
    registerResource(declaration) {

        const properties = {};

        // Evaluar las propiedades del recurso
        for (const property of declaration.properties) {

            properties[property.name] = this.evaluate(
                property.value
            );

        }

        // Guardar el recurso
        this.resources.set(declaration.name, properties);

        this.log(
            "Recurso registrado:",
            declaration.name,
            properties
        );

    }

    
    executeMain(declaration) {

        this.log("===== EJECUTANDO MAIN =====");

        for (const statement of declaration.body) {

            if (statement.type === "RunStatement") {

                this.executeRun(statement);

            } else {

                this.log(
                    "Instrucción encontrada:",
                    statement.type
                );

            }

        }

    }

    
    executeRun(statement) {

        // Obtener el nombre de la tarea
        const taskName = statement.name;

        // Buscar la tarea registrada
        const task = this.tasks.get(taskName);

        // Verificar si la tarea existe
        if (!task) {
            this.log(
                "No se encontró la tarea:",
                taskName
            );
            return;
        }

        this.log(
            "Ejecutando tarea:",
            taskName
        );

        // Por ahora mostrar las instrucciones de la tarea
       
        for (const instruction of task.body) {

             this.executeStatement(instruction);

        }


    }

    
    evaluate(expression) {

        if (!expression) {
            return null;
        }

        switch (expression.type) {

            case "Literal":

                switch (expression.valueType) {

                    case "ENTERO":
                        return parseInt(expression.value, 10);

                    case "DECIMAL":
                        return parseFloat(expression.value);

                    case "CADENA":
                        return expression.value.slice(1, -1);

                    case "TRUE":
                        return true;

                    case "FALSE":
                        return false;

                    default:
                        return null;
                }

            
            case "Identifier": {

                const name = expression.name;

                // Buscar primero entre las variables
                if (this.variables.has(name)) {
                    return this.variables.get(name);
                }

                // Buscar entre los recursos registrados
                if (this.resources.has(name)) {
                    return this.resources.get(name);
                }

                this.log(
                    "Identificador no encontrado:",
                    name
                );

                return null;
            }
                        
            
            case "BinaryExpression": {

                // Evaluar ambos operandos
                const left = this.evaluate(expression.left);
                const right = this.evaluate(expression.right);

                // Obtener el operador
                const operator = expression.operator;

                switch (operator) {

                    // Operaciones aritméticas
                    case "+":
                        return left + right;

                    case "-":
                        return left - right;

                    case "*":
                        return left * right;

                    case "/":
                        return left / right;

                    case "%":
                        return left % right;

                    // Operaciones relacionales
                    case ">":
                        return left > right;

                    case "<":
                        return left < right;

                    case ">=":
                        return left >= right;

                    case "<=":
                        return left <= right;

                    // Operaciones de igualdad
                    case "==":
                        return left === right;

                    case "!=":
                        return left !== right;

                    // Operaciones lógicas
                    case "&&":
                        return Boolean(left) && Boolean(right);

                    case "||":
                        return Boolean(left) || Boolean(right);

                    default:
                        this.log(
                            "Operador no reconocido:",
                            operator
                        );
                        return null;
                }
            }

            
            case "UnaryExpression": {

                // Evaluar el operando
                const value = this.evaluate(expression.right);

                // Obtener el operador
                const operator = expression.operator;

                switch (operator) {

                    case "-":
                        return -value;

                    case "!":
                        return !value;

                    default:
                        this.log(
                            "Operador unario no reconocido:",
                            operator
                        );
                        return null;
                }
            }

            case "GroupingExpression": {

                // Evaluar la expresión dentro de los paréntesis
                return this.evaluate(expression.expression);

            }

            
            case "ArrayExpression": {

                const elements = [];

                // Evaluar cada elemento del arreglo
                for (const element of expression.elements) {

                    const value = this.evaluate(element);

                    elements.push(value);
                }

                return elements;
            }

                
            case "IndexExpression": {

                // Evaluar el arreglo
                const array = this.evaluate(expression.object);

                // Evaluar la posición solicitada
                const index = this.evaluate(expression.index);

                // Verificar que sea un arreglo
                if (!Array.isArray(array)) {
                    this.log("Error: se intentó acceder a un valor que no es un arreglo");
                    return null;
                }

                // Verificar que el índice sea válido
                if (
                    !Number.isInteger(index) ||
                    index < 0 ||
                    index >= array.length
                ) {
                    this.log("Error: índice fuera de rango:", index);
                    return null;
                }

                // Devolver el elemento solicitado
                return array[index];
            }

            
            case "MemberExpression": {

                // Obtener el objeto al que pertenece la propiedad
                const object = this.evaluate(expression.object);

                // Verificar que exista un objeto válido
                if (
                    object === null ||
                    object === undefined ||
                    typeof object !== "object"
                ) {
                    this.log(
                        "Error: no se puede acceder a la propiedad:",
                        expression.property
                    );
                    return null;
                }

                // Obtener el valor de la propiedad
                return object[expression.property];
            }

            
            
            case "CallExpression": {

                // Obtener el nombre de la función
                const name = expression.callee.name;

                // Evaluar los argumentos
                const args = expression.arguments.map(
                    arg => this.evaluate(arg)
                );

                // Función nativa PRINT
                if (name === "print") {

                    this.log(...args);

                    return null;
                }

                                
                if (name === "length") {

                    const value = args[0];

                    // Comprobar que se recibió un arreglo
                    if (!Array.isArray(value)) {
                        this.log(
                            "Error: length() esperaba un arreglo"
                        );
                        return null;
                    }

                    // Devolver la cantidad de elementos
                    return value.length;
                }

                                
                if (name === "start") {

                    // Obtener el recurso recibido
                    const resource = args[0];

                    // Verificar que sea un objeto
                    if (
                        resource === null ||
                        resource === undefined ||
                        typeof resource !== "object" ||
                        Array.isArray(resource)
                    ) {
                        this.log(
                            "Error: start() esperaba un recurso válido"
                        );
                        return null;
                    }

                    // Cambiar el estado del recurso
                    resource.status = "running";

                    this.log(
                        "Recurso iniciado correctamente"
                    );

                    return null;
                }

                
                if (name === "stop") {

                    // Obtener el recurso recibido
                    const resource = args[0];

                    // Verificar que sea un recurso válido
                    if (
                        resource === null ||
                        resource === undefined ||
                        typeof resource !== "object" ||
                        Array.isArray(resource)
                    ) {
                        this.log(
                            "Error: stop() esperaba un recurso válido"
                        );
                        return null;
                    }

                    // Cambiar el estado del recurso
                    resource.status = "stopped";

                    this.log(
                        "Recurso detenido correctamente"
                    );

                    return null;
                }

                
                if (name === "restart") {

                    const resource = args[0];

                    // Verificar que sea un recurso válido
                    if (
                        resource === null ||
                        resource === undefined ||
                        typeof resource !== "object" ||
                        Array.isArray(resource)
                    ) {
                        this.log(
                            "Error: restart() esperaba un recurso válido"
                        );
                        return null;
                    }

                    // Simular el reinicio
                    resource.status = "stopped";

                    this.log("Reiniciando recurso...");

                    resource.status = "running";

                    this.log("Recurso reiniciado correctamente");

                    return null;
                }

                
                if (name === "install") {

                    const resource = args[0];
                    const software = args[1];

                    // Verificar que recibimos un recurso válido
                    if (
                        resource === null ||
                        resource === undefined ||
                        typeof resource !== "object" ||
                        Array.isArray(resource)
                    ) {
                        this.log(
                            "Error: install() esperaba un recurso válido"
                        );
                        return null;
                    }

                    // Crear el arreglo si todavía no existe
                    if (!Array.isArray(resource.installed)) {
                        resource.installed = [];
                    }

                    // Agregar el software al recurso
                    resource.installed.push(software);

                    this.log(
                        "Software instalado correctamente:",
                        software
                    );

                    return null;
                }

                if (name === "uninstall") {

                    const resource = args[0];
                    const software = args[1];

                    if (!resource || typeof resource !== "object" || Array.isArray(resource)) {
                        this.log("Error: uninstall() esperaba un recurso válido");
                        return null;
                    }

                    if (!Array.isArray(resource.installed)) {
                        resource.installed = [];
                    }

                    const index = resource.installed.indexOf(software);

                    if (index !== -1) {
                        resource.installed.splice(index, 1);
                        this.log("Software desinstalado correctamente:", software);
                    } else {
                        this.log("Software no encontrado:", software);
                    }

                    return null;
                }    
                
                if (name === "deploy") {

                    const service = args[0];

                    if (!service || typeof service !== "object" || Array.isArray(service)) {
                        this.log("Error: deploy() esperaba un servicio válido");
                        return null;
                    }

                    service.status = "deployed";

                    this.log("Servicio desplegado correctamente");

                    return null;
                }

                if (name === "scale") {

                    const service = args[0];
                    const replicas = args[1];

                    if (!service || typeof service !== "object" || Array.isArray(service)) {
                        this.log("Error: scale() esperaba un servicio válido");
                        return null;
                    }

                    if (!Number.isInteger(replicas) || replicas < 0) {
                        this.log("Error: cantidad de réplicas inválida");
                        return null;
                    }

                    service.replicas = replicas;

                    this.log("Servicio escalado correctamente a:", replicas);

                    return null;
                }

                if (name === "connect") {

                    const server = args[0];
                    const database = args[1];

                    if (
                        !server || typeof server !== "object" || Array.isArray(server) ||
                        !database || typeof database !== "object" || Array.isArray(database)
                    ) {
                        this.log("Error: connect() esperaba recursos válidos");
                        return null;
                    }

                    if (!Array.isArray(server.connections)) {
                        server.connections = [];
                    }

                    if (!server.connections.includes(database)) {
                        server.connections.push(database);
                        this.log("Conexión establecida correctamente");
                    } else {
                        this.log("La conexión ya existe");
                    }

                    return null;
                }

                if (name === "disconnect") {

                    const server = args[0];
                    const database = args[1];

                    if (
                        !server || typeof server !== "object" || Array.isArray(server) ||
                        !database || typeof database !== "object" || Array.isArray(database)
                    ) {
                        this.log("Error: disconnect() esperaba recursos válidos");
                        return null;
                    }

                    if (!Array.isArray(server.connections)) {
                        server.connections = [];
                    }

                    const index = server.connections.indexOf(database);

                    if (index !== -1) {
                        server.connections.splice(index, 1);
                        this.log("Conexión eliminada correctamente");
                    } else {
                        this.log("La conexión no existe");
                    }

                    return null;
                }
                // Funciones definidas por el usuario
                return this.executeFunction(name, args);
            }




            default:
                this.log(
                    "Expresión pendiente:",
                    expression.type
                );
                return null;
        }
    }

    
    executeVariableDeclaration(statement) {

        // Obtener nombre de la variable
        const variableName = statement.name;

        // Evaluar el valor de la variable
        const value = this.evaluate(statement.value);

        // Guardar la variable
        this.variables.set(variableName, value);
        // Guarda el tipo de dato
        this.variableTypes.set(variableName, statement.dataType);

        this.log(
            "Variable almacenada:",
            variableName,
            "=",
            value
        );

    }

   
    executeAssignment(statement) {

        // Evaluar el nuevo valor
        const value = this.evaluate(statement.value);

        // Asignación normal: contador = 5;
        if (statement.name !== undefined) {

            this.variables.set(statement.name, value);

            this.log(
                "Variable actualizada:",
                statement.name,
                "=",
                value
            );

            return;
        }

        // Asignación a un elemento de arreglo
        if (
            statement.target &&
            statement.target.type === "IndexExpression"
        ) {

            // Obtener el arreglo
            const array = this.evaluate(statement.target.object);

            // Obtener el índice
            const index = this.evaluate(statement.target.index);

            // Verificar que sea un arreglo
            if (!Array.isArray(array)) {
                this.log(
                    "Error: el destino no es un arreglo"
                );
                return;
            }

            // Verificar el índice
            if (
                !Number.isInteger(index) ||
                index < 0 ||
                index >= array.length
            ) {
                this.log(
                    "Error: índice fuera de rango:",
                    index
                );
                return;
            }

            // Modificar el elemento
            array[index] = value;

            this.log(
                "Elemento actualizado:",
                index,
                "=",
                value
            );

            return;
        }

        if (
            statement.target &&
            statement.target.type === "MemberExpression"
        ) {

            // Obtener el recurso u objeto
            const object = this.evaluate(statement.target.object);

            // Obtener el nombre de la propiedad
            const propertyName = statement.target.property;

            // Verificar que el objeto exista
            if (
                object === null ||
                object === undefined ||
                typeof object !== "object"
            ) {
                this.log(
                    "Error: no se puede modificar la propiedad:",
                    propertyName
                );
                return;
            }

            // Actualizar la propiedad
            object[propertyName] = value;

            this.log(
                "Propiedad actualizada:",
                propertyName,
                "=",
                value
            );

            return;
        }

        this.log(
            "Tipo de asignación pendiente:",
            statement.target?.type
        );
    }

    
        
    executeIf(statement) {

        const condition = this.evaluate(statement.condition);

        this.log("Condición IF:", condition);

        const branch = condition
            ? statement.thenBranch
            : statement.elseBranch;

        if (!branch) {
            return;
        }

        for (const instruction of branch) {

             const signal = this.executeStatement(instruction);

            //if (signal === "break") {
              //  return "break";
            //}
           if (
                signal === "break" ||
                signal === "continue" ||
                (signal && signal.type === "return")
            ) {
                return signal;
            }

        }

    }


    
    executeStatement(statement) {

        switch (statement.type) {

            case "VariableDeclaration":
                this.executeVariableDeclaration(statement);
                break;

            case "Assignment":
                this.executeAssignment(statement);
                break;

            case "IfStatement":
                return this.executeIf(statement);


            case "WhileStatement":
                this.executeWhile(statement);
                break;

                
            case "ForStatement":
                this.executeFor(statement);
                break;

            case "BreakStatement":
                return "break";

            case "ContinueStatement":
                return "continue";

            
            case "ReturnStatement":

                return {
                    type: "return",
                    value: statement.value
                        ? this.evaluate(statement.value)
                        : null
                };

            
            case "ExpressionStatement":

                this.evaluate(statement.expression);

                break;
                
                            

            default:
                this.log(
                    "Instrucción pendiente:",
                    statement.type
                );
                break;
        }

    }

    
    
    
    executeWhile(statement) {

        this.log("===== EJECUTANDO WHILE =====");

        while (this.evaluate(statement.condition)) {

            for (const instruction of statement.body) {

                const signal = this.executeStatement(instruction);

                if (signal === "break") {

                    this.log(
                        "Ciclo WHILE interrumpido por BREAK"
                    );

                    return;
                }

                if (signal === "continue") {

                    this.log(
                        "Saltando a la siguiente iteración del WHILE"
                    );

                    break;
                }

            }

        }

    }



    
    
    executeFor(statement) {

        this.log("===== EJECUTANDO FOR =====");

        // Ejecutar la inicialización
        if (statement.initialization) {
            this.executeStatement(statement.initialization);
        }

        // Evaluar la condición antes de cada iteración
        while (
            !statement.condition ||
            this.evaluate(statement.condition)
        ) {

            let shouldBreak = false;
            let shouldContinue = false;

            // Ejecutar las instrucciones del ciclo
            for (const instruction of statement.body) {

                const signal = this.executeStatement(instruction);

                if (signal === "break") {
                    shouldBreak = true;
                    break;
                }

                if (signal === "continue") {
                    shouldContinue = true;
                    break;
                }

            }

            // BREAK termina completamente el ciclo
            if (shouldBreak) {
                this.log("Ciclo FOR interrumpido por BREAK");
                break;
            }

            // Actualizar la variable de control
            if (statement.update) {
                this.executeStatement(statement.update);
            }

            // CONTINUE ya saltó el resto del cuerpo.
            // La siguiente iteración evaluará la condición.
            if (shouldContinue) {
                this.log("Saltando a la siguiente iteración del FOR");
                continue;
            }

        }

    }



 
    log(...args) {

        const util = require("node:util");

        // Convertir los argumentos en un mensaje
        const message = util.format(...args);

        // Guardar el mensaje en la salida del intérprete
        this.output.push(message);

        // Mostrarlo también en la terminal
        console.log(...args);

    }




}



module.exports = Interpreter;