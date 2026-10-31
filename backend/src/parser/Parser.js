class Parser {

    constructor(tokens) {
        this.tokens = tokens;
        this.position = 0;
        this.errors = [];
    }

    // Verificar si llegamos al final
    isAtEnd() {
        return this.position >= this.tokens.length;
    }

    // Obtener token actual
    currentToken() {
        if (this.isAtEnd()) {
            return null;
        }

        return this.tokens[this.position];
    }

    // Avanzar al siguiente token
    advance() {
        if (!this.isAtEnd()) {
            this.position++;
        }

        return this.currentToken();
    }

    // Verificar el tipo del token actual
    check(type) {
        if (this.isAtEnd()) {
            return false;
        }

        return this.currentToken().type === type;
    }

    match(...types) {

        for (const type of types) {

            if (this.check(type)) {
                this.advance();
                return true;
            }
        }

        return false;
    }

   
    consume(type, message) {

        if (this.check(type)) {

            const token = this.currentToken();
            this.advance();

            return token;
        }

        // Obtener el token actual
        let token = this.currentToken();

        // Si llegamos al final, usar el último token disponible
        if (!token && this.tokens.length > 0) {
            token = this.tokens[this.tokens.length - 1];
        }

        // Registrar el error sintáctico
        this.errors.push({
            type: "SINTACTICO",
            description: message,
            line: token ? token.line : 1,
            column: token ? token.column : 1
        });

        return null;
    }


    parseServer() {

        // Reconocer server
        const serverToken = this.consume(
            "SERVER",
            "Se esperaba la palabra reservada 'server'"
        );

        // Reconocer el nombre del servidor
        const name = this.consume(
            "IDENTIFICADOR",
            "Se esperaba el nombre del servidor"
        );

        // Reconocer {
        const openBrace = this.consume(
            "LLAVEA",
            "Se esperaba '{' después del nombre del servidor"
        );

        if (!serverToken || !name || !openBrace) {
            return null;
        }

         // Lista de propiedades del servidor
        const properties = [];

        // Leer propiedades hasta encontrar }
        while (!this.isAtEnd() && !this.check("LLAVEC")) {

            const previousPosition = this.position;
            const property = this.parseProperty();

            if (property) {
                properties.push(property);
            }

            // Evitar ciclos infinitos ante errores
            if (this.position === previousPosition) {
                this.advance();
            }
        }

        // Reconocer }
        const closeBrace = this.consume(
            "LLAVEC",
            "Se esperaba '}' para cerrar el servidor"
        );

        if (!closeBrace) {
            return null;
        }

        // Construir nodo AST
        return {
            type: "ServerDeclaration",
            name: name.lexeme,
            properties: properties,
            line: serverToken.line,
            column: serverToken.column
        };
    }

    parseService() {

        // Reconocer service
        const serviceToken = this.consume(
            "SERVICE",
            "Se esperaba la palabra reservada 'service'"
        );

        // Reconocer nombre del servicio
        const name = this.consume(
            "IDENTIFICADOR",
            "Se esperaba el nombre del servicio"
        );

        // Reconocer {
        const openBrace = this.consume(
            "LLAVEA",
            "Se esperaba '{' después del nombre del servicio"
        );

        if (!serviceToken || !name || !openBrace) {
            return null;
        }

        // Lista de propiedades del servicio
        const properties = [];

        // Leer propiedades hasta encontrar }
        while (!this.isAtEnd() && !this.check("LLAVEC")) {

            const previousPosition = this.position;
            const property = this.parseProperty();

            if (property) {
                properties.push(property);
            }

            // Evitar ciclos infinitos
            if (this.position === previousPosition) {
                this.advance();
            }
        }

        // Reconocer }
        const closeBrace = this.consume(
            "LLAVEC",
            "Se esperaba '}' para cerrar el servicio"
        );

        if (!closeBrace) {
            return null;
        }

        // Construir nodo AST
        return {
            type: "ServiceDeclaration",
            name: name.lexeme,
            properties: properties,
            line: serviceToken.line,
            column: serviceToken.column
        };
    }

    
    parseDatabase() {

        // Reconocer database
        const databaseToken = this.consume(
            "DATABASE",
            "Se esperaba la palabra reservada 'database'"
        );

        // Reconocer nombre de la base de datos
        const name = this.consume(
            "IDENTIFICADOR",
            "Se esperaba el nombre de la base de datos"
        );

        // Reconocer {
        const openBrace = this.consume(
            "LLAVEA",
            "Se esperaba '{' después del nombre de la base de datos"
        );

        if (!databaseToken || !name || !openBrace) {
            return null;
        }

        // Lista de propiedades
        const properties = [];

        // Leer propiedades hasta encontrar }
        while (!this.isAtEnd() && !this.check("LLAVEC")) {

            const previousPosition = this.position;
            const property = this.parseProperty();

            if (property) {
                properties.push(property);
            }

            // Evitar ciclos infinitos
            if (this.position === previousPosition) {
                this.advance();
            }
        }

        // Reconocer }
        const closeBrace = this.consume(
            "LLAVEC",
            "Se esperaba '}' para cerrar la base de datos"
        );

        if (!closeBrace) {
            return null;
        }

        // Construir nodo AST
        return {
            type: "DatabaseDeclaration",
            name: name.lexeme,
            properties: properties,
            line: databaseToken.line,
            column: databaseToken.column
        };
    }


    
    parseProperty() {

        // Obtener nombre de la propiedad
        const name = this.consume(
            "IDENTIFICADOR",
            "Se esperaba el nombre de la propiedad"
        );

        if (!name) {
            return null;
        }

        // Verificar signo =
        if (!this.consume(
            "IGUAL",
            "Se esperaba '=' en la propiedad"
        )) {
            return null;
        }

        // Analizar el valor como expresión
        const value = this.parseExpression();

        if (!value) {
            return null;
        }

        // Verificar punto y coma
        if (!this.consume(
            "PUNTOCOMA",
            "Se esperaba ';' al final de la propiedad"
        )) {
            return null;
        }

        // Construir nodo AST
        return {
            type: "Property",
            name: name.lexeme,
            value: value,
            line: name.line,
            column: name.column
        };
    }


    
    parse() {

        // Lista de declaraciones del programa
        const declarations = [];

        // Recorrer todos los tokens
        while (!this.isAtEnd()) {

            const previousPosition = this.position;
            let declaration = null;

            if (this.check("SERVER")) {

                declaration = this.parseServer();

            } else if (this.check("SERVICE")) {

                declaration = this.parseService();

            } else if (this.check("DATABASE")) {

                //declaration = this.parseDatabase();
                declaration = this.parseDatabase();

            }else if (this.check("TASK")) {
                declaration = this.parseTask();

            } 
            else if (this.check("FUNCTION")) {
                declaration = this.parseFunction();
                
            }else if (this.check("MAIN")) {
                declaration = this.parseMain();

            }else if (
                this.check("INT") ||
                this.check("FLOAT") ||
                this.check("STRING") ||
                this.check("BOOL")
            ) {

                declaration = this.parseVariableDeclaration();

            } else {

                const token = this.currentToken();

                this.errors.push({
                    type: "SINTACTICO",
                    description: `Declaración no reconocida: ${token.lexeme}`,
                    line: token.line,
                    column: token.column
                });

                this.advance();
            }

            // Agregar declaración al AST
            if (declaration) {
                declarations.push(declaration);
            }

            // Evitar ciclos infinitos
            if (this.position === previousPosition) {
                this.advance();
            }
        }

        // Construir nodo raíz
        return {
            type: "Program",
            declarations: declarations
        };
    }

    
    parseVariableDeclaration() {

        // Obtener tipo de dato
        const dataType = this.currentToken();
        this.advance();

        // Reconocer si el tipo de dato es un arreglo
        let typeName = dataType.lexeme;

        if (this.check("CORA")) {
            this.advance();

            if (!this.consume(
                "CORC",
                "Se esperaba ']' después del tipo de dato"
            )) {
                return null;
            }

            typeName += "[]";
        }

        // Obtener nombre de variable
        const name = this.consume(
            "IDENTIFICADOR",
            "Se esperaba un identificador"
        );

        if (!name) {
            return null;
        }

        // Verificar signo =
        if (!this.consume(
            "IGUAL",
            "Se esperaba '=' en la declaración"
        )) {
            return null;
        }

        // Analizar expresión completa
        const value = this.parseExpression();

        if (!value) {
            return null;
        }

        // Verificar punto y coma
        if (!this.consume(
            "PUNTOCOMA",
            "Se esperaba ';' al final de la declaración"
        )) {
            return null;
        }

        // Construir nodo AST
        return {
            type: "VariableDeclaration",
            dataType: typeName,
            name: name.lexeme,
            value: value,
            line: dataType.line,
            column: dataType.column
        };
    }

    
    parseAssignment(requireSemicolon = true) {

        // Obtener nombre de la variable
        const name = this.consume(
            "IDENTIFICADOR",
            "Se esperaba un identificador"
        );

        if (!name) {
            return null;
        }

        // Verificar signo =
        if (!this.consume(
            "IGUAL",
            "Se esperaba '=' en la asignación"
        )) {
            return null;
        }

        // Reconocer expresión
        const value = this.parseExpression();

        if (!value) {
            return null;
        }

        // Verificar punto y coma
        if (requireSemicolon) {
            if (!this.consume(
                "PUNTOCOMA",
                "Se esperaba ';' después de la asignación"
            )) {
                return null;
            }
        }

        // Construir nodo AST
        return {
            type: "Assignment",
            name: name.lexeme,
            value: value,
            line: name.line,
            column: name.column
        };
    }


    parsePrimary() {

        const token = this.currentToken();

        // Reconocer valores literales
        if (this.match("ENTERO", "DECIMAL", "CADENA", "TRUE", "FALSE")) {
            return {
                type: "Literal",
                value: token.lexeme,
                valueType: token.type,
                line: token.line,
                column: token.column
            };
        }

        // Reconocer identificadores
        if (this.match(
            "IDENTIFICADOR",
            "PRINT",
            "START",
            "STOP",
            "RESTART",
            "INSTALL",
            "UNINSTALL",
            "DEPLOY",
            "SCALE",
            "CONNECT",
            "DISCONNECT",
            "LENGTH",
            "STATUS"
        )) {
            return {
                type: "Identifier",
                name: token.lexeme,
                line: token.line,
                column: token.column
            };
        }

        // Reconocer expresiones entre paréntesis
        if (this.match("PARENTA")) {

            const expression = this.parseExpression();

            const close = this.consume(
                "PARENTC",
                "Se esperaba ')' después de la expresión"
            );

            if (!expression || !close) {
                return null;
            }

            return {
                type: "GroupingExpression",
                expression: expression,
                line: token.line,
                column: token.column
            };
        }

        // Reconocer literales de arreglos
        if (this.check("CORA")) {
            return this.parseArray();
        }

        // Error sintáctico
        this.errors.push({
            type: "SINTACTICO",
            description: "Se esperaba una expresión válida",
            line: token ? token.line : -1,
            column: token ? token.column : -1
        });

        return null;
    }

    
    parseUnary() {

        // Obtener el token actual
        const token = this.currentToken();

        // Verificar si encontramos un operador unario
        if (this.match("NOT", "MENOS")) {

            // Analizar el operando
            const right = this.parseUnary();

            if (!right) {
                return null;
            }

            // Construir nodo AST
            return {
                type: "UnaryExpression",
                operator: token.lexeme,
                right: right,
                line: token.line,
                column: token.column
            };
        }

        // Si no es un operador unario,
        // analizar una expresión primaria
        return this.parseCall();
    }

    
    parseFactor() {

        // Reconocer el primer operando
        let left = this.parseUnary();

        if (!left) {
            return null;
        }

        // Reconocer *, / y %
        while (
            this.check("POR") ||
            this.check("DIVISION") ||
            this.check("MODULO")
        ) {

            // Guardar el operador
            const operator = this.currentToken();
            this.advance();

            // Reconocer el operando derecho
            const right = this.parseUnary();

            if (!right) {
                return null;
            }

            // Construir nodo AST
            left = {
                type: "BinaryExpression",
                operator: operator.lexeme,
                left: left,
                right: right,
                line: operator.line,
                column: operator.column
            };
        }

        return left;
    }

        
    parseTerm() {

        // Reconocer el primer operando
        let left = this.parseFactor();

        if (!left) {
            return null;
        }

        // Reconocer sumas y restas
        while (
            this.check("MAS") ||
            this.check("MENOS")
        ) {

            // Guardar operador
            const operator = this.currentToken();
            this.advance();

            // Reconocer operando derecho
            const right = this.parseFactor();

            if (!right) {
                return null;
            }

            // Construir nodo AST
            left = {
                type: "BinaryExpression",
                operator: operator.lexeme,
                left: left,
                right: right,
                line: operator.line,
                column: operator.column
            };
        }

        return left;
    }

        
    parseComparison() {

        // Reconocer el primer operando
        let left = this.parseTerm();

        if (!left) {
            return null;
        }

        // Reconocer operadores de comparación
        while (
            this.check("MENOR") ||
            this.check("MAYOR") ||
            this.check("MENORIGUAL") ||
            this.check("MAYORIGUAL")
        ) {

            // Guardar operador
            const operator = this.currentToken();
            this.advance();

            // Reconocer operando derecho
            const right = this.parseTerm();

            if (!right) {
                return null;
            }

            // Construir nodo AST
            left = {
                type: "BinaryExpression",
                operator: operator.lexeme,
                left: left,
                right: right,
                line: operator.line,
                column: operator.column
            };
        }

        return left;
    }

    
    parseEquality() {

        // Reconocer el primer operando
        let left = this.parseComparison();

        if (!left) {
            return null;
        }

        // Reconocer == y !=
        while (
            this.check("IGUALIGUAL") ||
            this.check("DIFERENTE")
        ) {

            // Guardar el operador
            const operator = this.currentToken();
            this.advance();

            // Reconocer el operando derecho
            const right = this.parseComparison();

            if (!right) {
                return null;
            }

            // Construir nodo AST
            left = {
                type: "BinaryExpression",
                operator: operator.lexeme,
                left: left,
                right: right,
                line: operator.line,
                column: operator.column
            };
        }

        return left;
    }

    
    parseAnd() {

        // Reconocer el primer operando
        let left = this.parseEquality();

        if (!left) {
            return null;
        }

        // Reconocer el operador lógico &&
        while (this.check("AND")) {

            // Guardar operador
            const operator = this.currentToken();
            this.advance();

            // Reconocer operando derecho
            const right = this.parseEquality();

            if (!right) {
                return null;
            }

            // Construir nodo AST
            left = {
                type: "BinaryExpression",
                operator: operator.lexeme,
                left: left,
                right: right,
                line: operator.line,
                column: operator.column
            };
        }

        return left;
    }

    
    parseOr() {

        // Reconocer el primer operando
        let left = this.parseAnd();

        if (!left) {
            return null;
        }

        // Reconocer operador lógico ||
        while (this.check("OR")) {

            // Guardar operador
            const operator = this.currentToken();
            this.advance();

            // Reconocer operando derecho
            const right = this.parseAnd();

            if (!right) {
                return null;
            }

            // Construir nodo AST
            left = {
                type: "BinaryExpression",
                operator: operator.lexeme,
                left: left,
                right: right,
                line: operator.line,
                column: operator.column
            };
        }

        return left;
    }

    
    parseExpression() {
        return this.parseOr();
    }

    
    parseTask() {

        // Obtener token task
        const token = this.currentToken();
        this.advance();

        // Reconocer nombre de la tarea
        const name = this.consume(
            "IDENTIFICADOR",
            "Se esperaba el nombre de la tarea"
        );

        if (!name) {
            return null;
        }

        // Reconocer bloque de instrucciones
        const body = this.parseBlock();

        if (body === null) {
            return null;
        }

        // Construir nodo AST
        return {
            type: "TaskDeclaration",
            name: name.lexeme,
            body: body,
            line: token.line,
            column: token.column
        };
    }
    
    
    parseIf() {

        // Obtener token if
        const token = this.currentToken();
        this.advance();

        // Verificar paréntesis de apertura
        if (!this.consume(
            "PARENTA",
            "Se esperaba '(' después de if"
        )) {
            return null;
        }

        // Reconocer condición
        const condition = this.parseExpression();

        if (!condition) {
            return null;
        }

        // Verificar paréntesis de cierre
        if (!this.consume(
            "PARENTC",
            "Se esperaba ')' después de la condición"
        )) {
            return null;
        }

        // Reconocer bloque del if
        const thenBranch = this.parseBlock();

        if (thenBranch === null) {
            return null;
        }

        // Reconocer bloque else (opcional)
        let elseBranch = null;

        if (this.match("ELSE")) {

            elseBranch = this.parseBlock();

            if (elseBranch === null) {
                return null;
            }
        }

        // Construir nodo AST
        return {
            type: "IfStatement",
            condition: condition,
            thenBranch: thenBranch,
            elseBranch: elseBranch,
            line: token.line,
            column: token.column
        };
    }

    
    parseWhile() {

        // Obtener token while
        const token = this.currentToken();
        this.advance();

        // Verificar paréntesis de apertura
        if (!this.consume(
            "PARENTA",
            "Se esperaba '(' después de while"
        )) {
            return null;
        }

        // Reconocer condición
        const condition = this.parseExpression();

        if (!condition) {
            return null;
        }

        // Verificar paréntesis de cierre
        if (!this.consume(
            "PARENTC",
            "Se esperaba ')' después de la condición"
        )) {
            return null;
        }

        // Reconocer bloque de instrucciones
        const body = this.parseBlock();

        if (body === null) {
            return null;
        }

        // Construir nodo AST
        return {
            type: "WhileStatement",
            condition: condition,
            body: body,
            line: token.line,
            column: token.column
        };
    }

    
    parseFor() {

        // Obtener token for
        const token = this.currentToken();
        this.advance();

        // Verificar paréntesis de apertura
        if (!this.consume(
            "PARENTA",
            "Se esperaba '(' después de for"
        )) {
            return null;
        }

        // Inicialización
        let initialization = null;

        if (
            this.check("INT") ||
            this.check("FLOAT") ||
            this.check("STRING") ||
            this.check("BOOL")
        ) {
            initialization = this.parseVariableDeclaration();

        } else if (this.check("IDENTIFICADOR")) {
            initialization = this.parseAssignment();

        } else {
            if (!this.consume(
                "PUNTOCOMA",
                "Se esperaba ';' en la inicialización"
            )) {
                return null;
            }
        }

        // Condición
        let condition = null;

        if (!this.check("PUNTOCOMA")) {
            condition = this.parseExpression();

            if (!condition) {
                return null;
            }
        }

        if (!this.consume(
            "PUNTOCOMA",
            "Se esperaba ';' después de la condición"
        )) {
            return null;
        }

        // Actualización
        let update = null;

        if (!this.check("PARENTC")) {
            if (this.check("IDENTIFICADOR")) {
                update = this.parseAssignment(false);
            } else {
                const current = this.currentToken();
                this.errors.push({
                    type: "SINTACTICO",
                    description: "Se esperaba una asignación en la actualización del for",
                    line: current ? current.line : -1,
                    column: current ? current.column : -1
                });
                return null;
            }

            if (!update) {
                return null;
            }
        }

        // Verificar paréntesis de cierre
        if (!this.consume(
            "PARENTC",
            "Se esperaba ')' después del for"
        )) {
            return null;
        }

        // Reconocer bloque
        const body = this.parseBlock();

        if (body === null) {
            return null;
        }

        // Construir AST
        return {
            type: "ForStatement",
            initialization,
            condition,
            update,
            body,
            line: token.line,
            column: token.column
        };
    }

    
    parseBreak() {

        // Obtener token break
        const token = this.currentToken();
        this.advance();

        // Verificar punto y coma
        if (!this.consume(
            "PUNTOCOMA",
            "Se esperaba ';' después de break"
        )) {
            return null;
        }

        // Construir nodo AST
        return {
            type: "BreakStatement",
            line: token.line,
            column: token.column
        };
    }

    
    parseContinue() {

        // Obtener token continue
        const token = this.currentToken();
        this.advance();

        // Verificar punto y coma
        if (!this.consume(
            "PUNTOCOMA",
            "Se esperaba ';' después de continue"
        )) {
            return null;
        }

        // Construir nodo AST
        return {
            type: "ContinueStatement",
            line: token.line,
            column: token.column
        };
    }

    
    parseReturn() {

        // Obtener token return
        const token = this.currentToken();
        this.advance();

        // Reconocer expresión de retorno
        let value = null;

        if (!this.check("PUNTOCOMA")) {
            value = this.parseExpression();

            if (!value) {
                return null;
            }
        }

        // Verificar punto y coma
        if (!this.consume(
            "PUNTOCOMA",
            "Se esperaba ';' después de return"
        )) {
            return null;
        }

        // Construir nodo AST
        return {
            type: "ReturnStatement",
            value: value,
            line: token.line,
            column: token.column
        };
    }

    
    parseRun() {

        // Obtener token run
        const token = this.currentToken();
        this.advance();

        // Reconocer nombre de la tarea
        const name = this.consume(
            "IDENTIFICADOR",
            "Se esperaba el nombre de la tarea después de run"
        );

        if (!name) {
            return null;
        }

        // Verificar punto y coma
        if (!this.consume(
            "PUNTOCOMA",
            "Se esperaba ';' después de run"
        )) {
            return null;
        }

        // Construir nodo AST
        return {
            type: "RunStatement",
            name: name.lexeme,
            line: token.line,
            column: token.column
        };
    }

    
    parseExpressionStatement() {

        const token = this.currentToken();

        // Reconocer expresión
        const expression = this.parseExpression();

        if (!expression) {
            return null;
        }

        // Verificar punto y coma
        if (!this.consume(
            "PUNTOCOMA",
            "Se esperaba ';' después de la expresión"
        )) {
            return null;
        }

        return {
            type: "ExpressionStatement",
            expression: expression,
            line: token.line,
            column: token.column
        };
    }

    
    parseMain() {

        // Obtener token main
        const token = this.currentToken();
        this.advance();

        // Reconocer bloque de instrucciones
        const body = this.parseBlock();

        if (body === null) {
            return null;
        }

        // Construir nodo AST
        return {
            type: "MainDeclaration",
            body: body,
            line: token.line,
            column: token.column
        };
    }



    parseFunction() {

        // Obtener token function
        const token = this.currentToken();
        this.advance();

        // Nombre de la función
        const name = this.consume(
            "IDENTIFICADOR",
            "Se esperaba el nombre de la función"
        );

        if (!name) {
            return null;
        }

        // Paréntesis de apertura
        if (!this.consume(
            "PARENTA",
            "Se esperaba '(' después del nombre de la función"
        )) {
            return null;
        }

        // Lista de parámetros
        const parameters = [];

        if (!this.check("PARENTC")) {

            do {

                // Tipo del parámetro
                const dataType = this.currentToken();

                if (
                    !this.check("INT") &&
                    !this.check("FLOAT") &&
                    !this.check("STRING") &&
                    !this.check("BOOL") &&
                    !this.check("SERVER") &&
                    !this.check("SERVICE") &&
                    !this.check("DATABASE")
                ) {
                    this.errors.push({
                        type: "SINTACTICO",
                        description: "Se esperaba un tipo de dato en el parámetro",
                        line: dataType ? dataType.line : -1,
                        column: dataType ? dataType.column : -1
                    });
                    return null;
                }

                this.advance();

                // Nombre del parámetro
                const paramName = this.consume(
                    "IDENTIFICADOR",
                    "Se esperaba el nombre del parámetro"
                );

                if (!paramName) {
                    return null;
                }

                // Agregar parámetro al AST
                parameters.push({
                    type: "Parameter",
                    dataType: dataType.lexeme,
                    name: paramName.lexeme,
                    line: dataType.line,
                    column: dataType.column
                });

            } while (this.match("COMA"));
        }

        // Paréntesis de cierre
        if (!this.consume(
            "PARENTC",
            "Se esperaba ')' después de los parámetros"
        )) {
            return null;
        }

        // Tipo de retorno
        const returnType = this.currentToken();

        if (
            !this.check("INT") &&
            !this.check("FLOAT") &&
            !this.check("STRING") &&
            !this.check("BOOL") &&
            !this.check("SERVER") &&
            !this.check("SERVICE") &&
            !this.check("DATABASE")
        ) {
            this.errors.push({
                type: "SINTACTICO",
                description: "Se esperaba el tipo de retorno de la función",
                line: returnType ? returnType.line : -1,
                column: returnType ? returnType.column : -1
            });
            return null;
        }

        this.advance();

        // Cuerpo de la función
        const body = this.parseBlock();

        if (body === null) {
            return null;
        }

        // Construir AST
        return {
            type: "FunctionDeclaration",
            name: name.lexeme,
            parameters,
            returnType: returnType.lexeme,
            body,
            line: token.line,
            column: token.column
        };
    }

    
    
    parseCall() {

        // Obtener expresión inicial
        let expression = this.parsePrimary();

        if (!expression) {
            return null;
        }

        // Reconocer llamadas y accesos a índices
        while (
            this.check("PARENTA") ||
            this.check("CORA") ||
            this.check("PUNTO")
        ) {

            // Llamadas a funciones
            if (this.check("PARENTA")) {

                const token = this.currentToken();
                this.advance();

                const args = [];

                if (!this.check("PARENTC")) {

                    do {
                        const argument = this.parseExpression();

                        if (!argument) {
                            return null;
                        }

                        args.push(argument);

                    } while (this.match("COMA"));
                }

                if (!this.consume(
                    "PARENTC",
                    "Se esperaba ')' después de los argumentos"
                )) {
                    return null;
                }

                expression = {
                    type: "CallExpression",
                    callee: expression,
                    arguments: args,
                    line: token.line,
                    column: token.column
                };
            }

            // Acceso a elementos de arreglos
            else if (this.check("CORA")) {

                const token = this.currentToken();
                this.advance();

                const index = this.parseExpression();

                if (!index) {
                    return null;
                }

                if (!this.consume(
                    "CORC",
                    "Se esperaba ']' después del índice"
                )) {
                    return null;
                }

                expression = {
                    type: "IndexExpression",
                    object: expression,
                    index: index,
                    line: token.line,
                    column: token.column
                };
            }
                else if (this.check("PUNTO")) {

                    const token = this.currentToken();
                    this.advance();

                    // Reconocer nombres de propiedades
                    // incluyendo status, que es una palabra reservada
                    if (
                        !this.check("IDENTIFICADOR") &&
                        !this.check("STATUS")
                    ) {
                        this.errors.push({
                            type: "SINTACTICO",
                            description: "Se esperaba el nombre de la propiedad",
                            line: this.currentToken()?.line ?? -1,
                            column: this.currentToken()?.column ?? -1
                        });

                        return null;
                    }

                    const property = this.currentToken();
                    this.advance();

                    expression = {
                        type: "MemberExpression",
                        object: expression,
                        property: property.lexeme,
                        line: token.line,
                        column: token.column
                    };
                }
        }

        return expression;
    }


    
    parseArray() {

        // Obtener token [
        const token = this.currentToken();
        this.advance();

        // Lista de elementos
        const elements = [];

        // Reconocer elementos del arreglo
        if (!this.check("CORC")) {

            do {

                const element = this.parseExpression();

                if (!element) {
                    return null;
                }

                elements.push(element);

            } while (this.match("COMA"));
        }

        // Verificar corchete de cierre
        if (!this.consume(
            "CORC",
            "Se esperaba ']' después del arreglo"
        )) {
            return null;
        }

        // Construir nodo AST
        return {
            type: "ArrayExpression",
            elements: elements,
            line: token.line,
            column: token.column
        };
    }



    parseStatement() {

        // Declaraciones de variables
        if (
            this.check("INT") ||
            this.check("FLOAT") ||
            this.check("STRING") ||
            this.check("BOOL")
        ) {
            return this.parseVariableDeclaration();
        }

        // Asignaciones
            if (this.check("IDENTIFICADOR")) {

            const nextToken = this.tokens[this.position + 1];

            // Asignación normal
            if (nextToken && nextToken.type === "IGUAL") {
                return this.parseAssignment();
            }

            // Posible asignación a índice o propiedad
            const savedPosition = this.position;
            const savedErrors = this.errors.length;

            const target = this.parseCall();

            const isAssignable =
                target &&
                (
                    target.type === "IndexExpression" ||
                    target.type === "MemberExpression"
                );

            const isAssignment =
                isAssignable && this.check("IGUAL");

            // Restaurar posición para procesar la instrucción
            this.position = savedPosition;
            this.errors.length = savedErrors;

            if (isAssignment) {
                return this.parseTargetAssignment();
            }

            // Llamada independiente
            return this.parseExpressionStatement();
        }
        
        // Operaciones nativas como instrucciones independientes
        if (
            this.check("PRINT") ||
            this.check("START") ||
            this.check("STOP") ||
            this.check("RESTART") ||
            this.check("INSTALL") ||
            this.check("UNINSTALL") ||
            this.check("DEPLOY") ||
            this.check("SCALE") ||
            this.check("CONNECT") ||
            this.check("DISCONNECT") ||
            this.check("LENGTH") ||
            this.check("STATUS")
        ) {
            return this.parseExpressionStatement();
        }


        // Condicionales
        if (this.check("IF")) {
            return this.parseIf();
        }

        // Ciclos while
        if (this.check("WHILE")) {
            return this.parseWhile();
        }

        if (this.check("FOR")) {
            return this.parseFor();
        }

        // Instrucción break
        if (this.check("BREAK")) {
            return this.parseBreak();
        }

        // Instrucción continue
        if (this.check("CONTINUE")) {
            return this.parseContinue();
        }

        // Instrucción return
        if (this.check("RETURN")) {
            return this.parseReturn();
        }

        // Instrucción run
        if (this.check("RUN")) {
            return this.parseRun();
        }

         // Instrucción no reconocida
        const token = this.currentToken();

        // Comprobar si ya existe un error sintáctico
        // en la misma posición.
        const errorExistente = token && this.errors.some(error =>
            error.type === "SINTACTICO" &&
            error.line === token.line &&
            error.column === token.column
        );

        // Evitar registrar un error redundante
        if (!errorExistente) {
            this.errors.push({
                type: "SINTACTICO",
                description: "Instrucción no reconocida",
                line: token ? token.line : -1,
                column: token ? token.column : -1
            });
        }

        // Avanzar para evitar quedar atrapados
        // en el mismo token.
        if (!this.isAtEnd()) {
            this.advance();
        }

        return null;
    }

    
    parseBlock() {

        // Verificar llave de apertura
        if (!this.consume(
            "LLAVEA",
            "Se esperaba '{' al iniciar el bloque"
        )) {
            return null;
        }

        const statements = [];

        // Reconocer instrucciones dentro del bloque
        while (!this.check("LLAVEC") && !this.isAtEnd()) {

            const startPosition = this.position;

            // Reconocer una instrucción
            const statement = this.parseStatement();

            if (statement) {
                statements.push(statement);
            }

            // Evitar ciclos infinitos
            if (this.position === startPosition) {
                this.advance();
            }
        }

        // Verificar llave de cierre
        if (!this.consume(
            "LLAVEC",
            "Se esperaba '}' al finalizar el bloque"
        )) {
            return null;
        }

        return statements;
    }

    
    parseTargetAssignment() {

        const token = this.currentToken();

        // Reconocer identificador, índice o propiedad
        const target = this.parseCall();

        if (!target) {
            return null;
        }

        // Verificar que sea un destino válido
        if (
            target.type !== "Identifier" &&
            target.type !== "IndexExpression" &&
            target.type !== "MemberExpression"
        ) {
            this.errors.push({
                type: "SINTACTICO",
                description: "Destino de asignación inválido",
                line: token.line,
                column: token.column
            });

            return null;
        }

        // Reconocer operador =
        if (!this.consume(
            "IGUAL",
            "Se esperaba '=' en la asignación"
        )) {
            return null;
        }

        // Reconocer valor
        const value = this.parseExpression();

        if (!value) {
            return null;
        }

        // Verificar punto y coma
        if (!this.consume(
            "PUNTOCOMA",
            "Se esperaba ';' después de la asignación"
        )) {
            return null;
        }

        return {
            type: "Assignment",
            target: target,
            value: value,
            line: token.line,
            column: token.column
        };
    }



}

module.exports = Parser;