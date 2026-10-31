
class Interpreter {

    constructor(ast) {
        this.ast = ast;
        this.variables = new Map();

        //para reporte 
        this.variableTypes = new Map();
        
        // Pila de ámbitos locales
        this.scopes = [];


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

        // Primera pasada: registrar tareas, recursos,
        // funciones y variables globales
        for (const declaration of this.ast.declarations) {

            if (declaration.type === "TaskDeclaration") {

                this.registerTask(declaration);

            } else if (
                declaration.type === "ServerDeclaration" ||
                declaration.type === "ServiceDeclaration" ||
                declaration.type === "DatabaseDeclaration"
            ) {

                this.registerResource(declaration);

            } else if (declaration.type === "FunctionDeclaration") {

                this.registerFunction(declaration);

            } else if (declaration.type === "VariableDeclaration") {

                // Registrar las variables globales
                this.executeVariableDeclaration(declaration);

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

        // Guardar los ámbitos del llamador
        const previousScopes = this.scopes;

        // Aislar los ámbitos de esta función
        this.scopes = [];

        // Crear el ámbito local de la función
        this.enterScope();

        try {

            const currentScope =
                this.scopes[this.scopes.length - 1];

            // Asignar argumentos a los parámetros
            for (let i = 0; i < funcion.parameters.length; i++) {

                const parameter = funcion.parameters[i];

                currentScope.set(parameter.name, args[i]);
            }

            // Ejecutar las instrucciones
            for (const instruction of funcion.body) {

                const signal = this.executeStatement(instruction);

                if (signal && signal.type === "return") {

                    this.log("Función retornó:", signal.value);

                    return signal.value;
                }
            }

            return null;

        } finally {

            // Cerrar el ámbito de la función
            this.exitScope();

            // Restaurar los ámbitos del llamador
            this.scopes = previousScopes;
        }
    }

    
    
    registerResource(declaration) {

        const properties = {};

        // Identificar el tipo de recurso
        let resourceType = null;

        switch (declaration.type) {

            case "ServerDeclaration":
                resourceType = "server";
                break;

            case "ServiceDeclaration":
                resourceType = "service";
                break;

            case "DatabaseDeclaration":
                resourceType = "database";
                break;

            default:
                this.log(
                    "Error: tipo de recurso no reconocido:",
                    declaration.type
                );
                return;
        }

        // Evaluar las propiedades declaradas
        for (const property of declaration.properties) {

            properties[property.name] = this.evaluate(
                property.value
            );
        }

        // Guardar el tipo como metadato interno
        Object.defineProperty(properties, "__resourceType", {
            value: resourceType,
            writable: false,
            enumerable: false,
            configurable: false
        });

        // Registrar el recurso
        this.resources.set(declaration.name, properties);

        this.log(
            "Tipo interno del recurso:",
            properties.__resourceType
        );

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

        const taskName = statement.name;

        const task = this.tasks.get(taskName);

        if (!task) {
            this.log("No se encontró la tarea:", taskName);
            return;
        }

        this.log("Ejecutando tarea:", taskName);

        // Crear ámbito local de la tarea
        this.enterScope();

        try {

            for (const instruction of task.body) {
                this.executeStatement(instruction);
            }

        } finally {

            // Eliminar el ámbito al terminar la tarea
            this.exitScope();
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

                // Buscar primero en los ámbitos locales
                for (let i = this.scopes.length - 1; i >= 0; i--) {

                    if (this.scopes[i].has(name)) {
                        return this.scopes[i].get(name);
                    }
                }

                // Buscar en variables globales
                if (this.variables.has(name)) {
                    return this.variables.get(name);
                }

                // Buscar en recursos registrados
                if (this.resources.has(name)) {
                    return this.resources.get(name);
                }

                this.log("Identificador no encontrado:", name);

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

                
                if (name === "status") {

                    const resource = args[0];

                    if (args.length !== 1) {
                        this.log("Error: status() esperaba un recurso");
                        return null;
                    }

                    const validTypes = ["server", "service", "database"];

                    if (
                        !resource ||
                        !validTypes.includes(resource.__resourceType)
                    ) {
                        this.log("Error: status() esperaba un recurso válido");
                        return null;
                    }

                    // Devolver el estado actual del recurso
                    return resource.status ?? "stopped";
                }

                
                // Función nativa PRINT
                if (name === "print") {

                    this.log(...args);

                    return null;
                }

                                
                
                if (name === "length") {

                    if (args.length !== 1) {
                        this.log("Error: length() esperaba un argumento");
                        return null;
                    }

                    const value = args[0];

                    if (!Array.isArray(value)) {
                        this.log("Error: length() esperaba un arreglo");
                        return null;
                    }

                    return value.length;
                }


                                
                
                if (name === "start") {

                    // Obtener el recurso recibido
                    const resource = args[0];

                    // Validar que sea un recurso válido
                    if (!this.isResourceType(resource, "server")) {
                        this.log("Error: se esperaba un servidor válido");
                        return false;
                    }

                    // Cambiar el estado del recurso
                    resource.status = "running";

                    this.log(
                        "Recurso iniciado correctamente"
                    );

                    // Indicar que la operación fue exitosa
                    return true;
                }


                
                
                if (name === "stop") {

                    const resource = args[0];

                    // Validar que sea un recurso válido
                    if (
                        resource === null ||
                        resource === undefined ||
                        typeof resource !== "object" ||
                        Array.isArray(resource)
                    ) {
                        this.log(
                            "Error: stop() esperaba un recurso válido"
                        );

                        return false;
                    }

                    // Cambiar el estado del recurso
                    resource.status = "stopped";

                    this.log(
                        "Recurso detenido correctamente"
                    );

                    // Operación exitosa
                    return true;
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
                        return false;
                    }

                    // Simular el reinicio
                    resource.status = "stopped";

                    this.log("Reiniciando recurso...");

                    resource.status = "running";

                    this.log("Recurso reiniciado correctamente");

                    return true;
                }

                
                
                if (name === "install") {

                    const resource = args[0];
                    const software = args[1];

                    // Validar el recurso
                   if (!this.isResourceType(resource, "server")) {
                        this.log("Error: se esperaba un servidor válido");
                        return false;
                    }

                    // Validar el nombre del software
                    if (
                        typeof software !== "string" ||
                        software.trim() === ""
                    ) {
                        this.log("Error: install() esperaba un nombre de software válido");
                        return false;
                    }

                    // Crear la lista de programas instalados
                    if (!Array.isArray(resource.installed)) {
                        resource.installed = [];
                    }

                    // Evitar instalaciones duplicadas
                    if (resource.installed.includes(software)) {
                        this.log("El software ya está instalado:", software);
                        return false;
                    }

                    // Instalar software
                    resource.installed.push(software);

                    this.log("Software instalado correctamente:", software);

                    return true;
                }


                
                if (name === "uninstall") {

                    const resource = args[0];
                    const software = args[1];

                    // Validar el recurso
                    if (!this.isResourceType(resource, "server")) {
                        this.log("Error: se esperaba un servidor válido");
                        return false;
                    }

                    // Validar el nombre del software
                    if (
                        typeof software !== "string" ||
                        software.trim() === ""
                    ) {
                        this.log("Error: uninstall() esperaba un nombre de software válido");
                        return false;
                    }

                    // Verificar si existe una lista de software instalado
                    if (!Array.isArray(resource.installed)) {
                        this.log("Software no encontrado:", software);
                        return false;
                    }

                    // Buscar el software
                    const index = resource.installed.indexOf(software);

                    if (index === -1) {
                        this.log("Software no encontrado:", software);
                        return false;
                    }

                    // Eliminar el software
                    resource.installed.splice(index, 1);

                    this.log("Software desinstalado correctamente:", software);

                    return true;
                }

                
                
                                
                if (name === "deploy") {

                    const server = args[0];
                    const service = args[1];

                    // Validar cantidad de argumentos
                    if (args.length !== 2) {
                        this.log(
                            "Error: deploy() esperaba un servidor y un servicio"
                        );
                        return false;
                    }

                    // Validar que el primer argumento sea un servidor
                    if (
                        !server ||
                        typeof server !== "object" ||
                        server.__resourceType !== "server"
                    ) {
                        this.log(
                            "Error: deploy() esperaba un servidor válido"
                        );
                        return false;
                    }

                    // Validar que el segundo argumento sea un servicio
                    if (
                        !service ||
                        typeof service !== "object" ||
                        service.__resourceType !== "service"
                    ) {
                        this.log(
                            "Error: deploy() esperaba un servicio válido"
                        );
                        return false;
                    }

                    // Simular el despliegue
                    service.status = "deployed";

                    this.log("Servicio desplegado correctamente");

                    return true;
                }

                
                if (name === "scale") {

                    const service = args[0];
                    const replicas = args[1];

                    // Validar cantidad de argumentos
                    if (args.length !== 2) {
                        this.log("Error: scale() esperaba un servicio y una cantidad de réplicas");
                        return false;
                    }

                    // Validar el recurso
                    if (!this.isResourceType(service, "service")) {
                        this.log("Error: scale() esperaba un servicio válido");
                        return false;
                    }

                    // Validar cantidad de réplicas
                    if (
                        !Number.isInteger(replicas) ||
                        replicas < 0
                    ) {
                        this.log("Error: cantidad de réplicas inválida");
                        return false;
                    }

                    // Actualizar el número de réplicas
                    service.replicas = replicas;

                    this.log(
                        "Servicio escalado correctamente a:",
                        replicas
                    );

                    return true;
                }


                
                if (name === "connect") {

                    const server = args[0];
                    const database = args[1];

                    if (args.length !== 2) {
                        this.log("Error: connect() esperaba dos recursos");
                        return false;
                    }

                   if (!this.isResourceType(server, "server")) {
                        this.log("Error: se esperaba un servidor válido");
                        return false;
                    }

                    if (!this.isResourceType(database, "database")) {
                        this.log("Error: se esperaba una base de datos válida");
                        return false;
                    }
                    
                    // Crear el arreglo de conexiones si todavía no existe
                    if (!Array.isArray(server.connections)) {
                        server.connections = [];
                    }

                    // Evitar conexiones duplicadas
                    if (server.connections.includes(database)) {
                        this.log("La conexión ya existe");
                        return false;
                    }

                    // Registrar la conexión
                    server.connections.push(database);

                    this.log("Conexión establecida correctamente");

                    return true;

                }


                                
                if (name === "disconnect") {

                    const server = args[0];
                    const database = args[1];

                    if (args.length !== 2) {
                        this.log("Error: disconnect() esperaba dos recursos");
                        return false;
                    }

                    if (!this.isResourceType(server, "server")) {
                        this.log("Error: se esperaba un servidor válido");
                        return false;
                    }

                    if (!this.isResourceType(database, "database")) {
                        this.log("Error: se esperaba una base de datos válida");
                        return false;
                    }

                    // Verificar que el servidor tenga conexiones registradas
                    if (!Array.isArray(server.connections)) {
                        this.log("La conexión no existe");
                        return false;
                    }
                    const index = server.connections.indexOf(database);

                    if (index === -1) {
                        this.log("La conexión no existe");
                        return false;
                    }

                    server.connections.splice(index, 1);

                    this.log("Conexión eliminada correctamente");

                    return true;
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

    
    isResourceType(resource, expectedType) {
        return (
            resource !== null &&
            typeof resource === "object" &&
            !Array.isArray(resource) &&
            resource.__resourceType === expectedType
        );
    }

    
    
    executeVariableDeclaration(statement) {

        const variableName = statement.name;

        // Evaluar el valor de la variable
        const value = this.evaluate(statement.value);

        if (this.scopes.length > 0) {

            // Guardar en el ámbito local actual
            const currentScope = this.scopes[this.scopes.length - 1];

            currentScope.set(variableName, value);

        } else {

            // Guardar en el ámbito global
            this.variables.set(variableName, value);

            // Guardar el tipo para el reporte
            this.variableTypes.set(
                variableName,
                statement.dataType
            );
        }

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

            this.setVariable(statement.name, value);

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

        // Crear un ámbito local para la rama seleccionada
        this.enterScope();

        try {

            for (const instruction of branch) {

                const signal = this.executeStatement(instruction);

                // Propagar break, continue y return
                if (
                    signal === "break" ||
                    signal === "continue" ||
                    (signal && signal.type === "return")
                ) {
                    return signal;
                }
            }

        } finally {

            // Eliminar el ámbito al salir del bloque
            this.exitScope();
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
                 return this.executeWhile(statement);

                
            case "ForStatement":
                 return this.executeFor(statement);

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

            // Crear ámbito local para esta iteración
            this.enterScope();

            let signal = null;

            try {

                for (const instruction of statement.body) {

                    signal = this.executeStatement(instruction);

                    // Detener la ejecución del cuerpo ante
                    // break, continue o return
                    if (
                        signal === "break" ||
                        signal === "continue" ||
                        (signal && signal.type === "return")
                    ) {
                        break;
                    }
                }

            } finally {

                // Eliminar las variables locales de la iteración
                this.exitScope();
            }

            // Procesar las señales después de cerrar el ámbito
            if (signal === "break") {

                this.log(
                    "Ciclo WHILE interrumpido por BREAK"
                );

                break;
            }

            if (signal === "continue") {

                this.log(
                    "Saltando a la siguiente iteración del WHILE"
                );

                continue;
            }

            // Propagar el retorno de una función
            if (signal && signal.type === "return") {
                return signal;
            }
        }
    }
   
    
    
    executeFor(statement) {

        this.log("===== EJECUTANDO FOR =====");

        // Ámbito general del FOR
        this.enterScope();

        try {

            // Inicialización del contador
            if (statement.initialization) {
                this.executeStatement(statement.initialization);
            }

            // Evaluar condición antes de cada iteración
            while (
                !statement.condition ||
                this.evaluate(statement.condition)
            ) {

                let signal = null;

                // Ámbito local de esta iteración
                this.enterScope();

                try {

                    for (const instruction of statement.body) {

                        signal = this.executeStatement(instruction);

                        if (
                            signal === "break" ||
                            signal === "continue" ||
                            (signal && signal.type === "return")
                        ) {
                            break;
                        }
                    }

                } finally {

                    // Eliminar variables locales de la iteración
                    this.exitScope();
                }

                // BREAK termina el FOR
                if (signal === "break") {

                    this.log("Ciclo FOR interrumpido por BREAK");
                    break;
                }

                // RETURN se propaga a la función
                if (signal && signal.type === "return") {
                    return signal;
                }

                // Actualización del contador
                // También se ejecuta después de CONTINUE
                if (statement.update) {
                    this.executeStatement(statement.update);
                }

                if (signal === "continue") {

                    this.log("Saltando a la siguiente iteración del FOR");
                    continue;
                }
            }

        } finally {

            // Eliminar el ámbito general del FOR
            this.exitScope();
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

    
    // Crear un nuevo ámbito local
    enterScope() {
        this.scopes.push(new Map());
    }

    // Salir del ámbito local actual
    exitScope() {
        this.scopes.pop();
    }

    // Buscar una variable, primero local y luego global
    getVariable(name) {

        for (let i = this.scopes.length - 1; i >= 0; i--) {
            if (this.scopes[i].has(name)) {
                return this.scopes[i].get(name);
            }
        }

        if (this.variables.has(name)) {
            return this.variables.get(name);
        }

        this.log("Identificador no encontrado:", name);
        return null;
    }

    // Actualizar una variable en el ámbito donde existe
    setVariable(name, value) {

        for (let i = this.scopes.length - 1; i >= 0; i--) {
            if (this.scopes[i].has(name)) {
                this.scopes[i].set(name, value);
                return;
            }
        }

        if (this.variables.has(name)) {
            this.variables.set(name, value);
            return;
        }

        this.log("Variable no declarada:", name);
    }





}



module.exports = Interpreter;