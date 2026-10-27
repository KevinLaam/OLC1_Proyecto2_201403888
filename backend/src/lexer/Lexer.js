const Token = require("./Token");

class Lexer {

    constructor(source) {
        this.source = source;

        this.position = 0;
        this.line = 1;
        this.column = 1;

        this.tokens = [];
        this.errors = [];

        this.keywords = {
        "server": "SERVER",
        "service": "SERVICE",
        "database": "DATABASE",
        "int": "INT",
        "float": "FLOAT",
        "string": "STRING",
        "bool": "BOOL",
        "if":"IF",
        "else":"ELSE",
        "while": "WHILE",
        "for": "FOR",
        "break": "BREAK",
        "continue": "CONTINUE",
        "return": "RETURN",
        "function": "FUNCTION",
        "task": "TASK",
        "main": "MAIN",
        "run": "RUN",
        "true": "TRUE",
        "false": "FALSE",
        "print": "PRINT",
        "start": "START",
        "stop": "STOP",
        "restart": "RESTART",
        "install": "INSTALL",
        "uninstall": "UNINSTALL",
        "deploy": "DEPLOY",
        "scale": "SCALE",
        "connect": "CONNECT",
        "disconnect": "DISCONNECT",
        "length": "LENGTH",
        "status": "STATUS"

    };
    }

     isAtEnd() {
        return this.position >= this.source.length;
    }

    currentChar() {
        return this.source[this.position];
    }
    //para dos simbolos juntos
    peek() {
        if (this.position + 1 >= this.source.length) {
            return "\0";
        }

        return this.source[this.position + 1];
    }

    advance() {
        const char = this.source[this.position];

        this.position++;

        if (char === "\n") {
            this.line++;
            this.column = 1;
        } else {
            this.column++;
        }

        return char;
    }

    isLetter(char) {
    return /[a-zA-Z_]/.test(char);
    }

    isDigit(char) {
    return /[0-9]/.test(char);
}

    identifier() {

        const start = this.position;
        const startColumn = this.column;
        const startLine = this.line;

        while (
            !this.isAtEnd() &&
            (this.isLetter(this.currentChar()) ||
            this.isDigit(this.currentChar()))
        ) {
            this.advance();
        }

        const lexeme = this.source.substring(start, this.position);

        const type = this.keywords[lexeme] || "IDENTIFICADOR";

        const token = new Token(type, lexeme, startLine, startColumn);

        this.tokens.push(token);
        //console.log(
          //  `Palabra: ${lexeme} - Linea: ${startLine} - Columna: ${startColumn}`
        //);
    }

    symbol() {
        const char = this.currentChar();
        const startLine = this.line;
        const startColumn = this.column;

        const symbols = {
            "{": "LLAVEA",
            "}": "LLAVEC",
            "(": "PARENTA",
            ")": "PARENTC",
            "[": "CORA",
            "]": "CORC",
            ";": "PUNTOCOMA",
            ",": "COMA",
            "=": "IGUAL",
            ".": "PUNTO"
        };

        const type = symbols[char];

        if (type) {
            this.tokens.push(
                new Token(type, char, startLine, startColumn)
            );

            this.advance();
            return true;
        }

        return false;
    }

    operator() {
        const startLine = this.line;
        const startColumn = this.column;

        const char = this.currentChar();
        const next = this.peek();

        const doubleOperators = {
            "==": "IGUALIGUAL",
            "!=": "DIFERENTE",
            "<=": "MENORIGUAL",
            ">=": "MAYORIGUAL",
            "&&": "AND",
            "||": "OR"
        };

        const singleOperators = {
            "+": "MAS",
            "-": "MENOS",
            "*": "POR",
            "/": "DIVISION",
            "%": "MODULO",
            "<": "MENOR",
            ">": "MAYOR",
            "!": "NOT"
        };

        const double = char + next;

        if (doubleOperators[double]) {
            this.tokens.push(
                new Token(doubleOperators[double], double, startLine, startColumn)
            );

            this.advance();
            this.advance();
            return true;
        }

        if (singleOperators[char]) {
            this.tokens.push(
                new Token(singleOperators[char], char, startLine, startColumn)
            );

            this.advance();
            return true;
        }

        return false;
    }

    comentarioSimple() {

        // Consumir las dos barras //
        this.advance();
        this.advance();

        // Avanzar hasta encontrar un salto de línea
        while (
            !this.isAtEnd() &&
            this.currentChar() !== "\n"
        ) {
            this.advance();
        }
    }

    comentarioMulti() {

        const startLine = this.line;
        const startColumn = this.column;

        // Consumir /*
        this.advance();
        this.advance();

        // Recorrer hasta encontrar */
        while (!this.isAtEnd()) {

            if (
                this.currentChar() === "*" &&
                this.peek() === "/"
            ) {
                // Consumir */
                this.advance();
                this.advance();
                return;
            }

            this.advance();
        }
        // Si llegamos al final sin encontrar */
        this.errors.push({
            type: "LEXICO",
            description: "Comentario multilínea sin cerrar",
            line: startLine,
            column: startColumn
        });
    }

    number() {
        const start = this.position;
        const startLine = this.line;
        const startColumn = this.column;

        // Leer la parte entera
        while (!this.isAtEnd() && this.isDigit(this.currentChar())) {
            this.advance();
        }

        let type = "ENTERO";

        // Comprobar si tiene parte decimal
        if (
            !this.isAtEnd() &&
            this.currentChar() === "." &&
            this.position + 1 < this.source.length &&
            this.isDigit(this.source[this.position + 1])
        ) {
            type = "DECIMAL";

            this.advance(); // Consumir el punto

            while (!this.isAtEnd() && this.isDigit(this.currentChar())) {
                this.advance();
            }
        }

        const lexeme = this.source.substring(start, this.position);

        this.tokens.push(
            new Token(type, lexeme, startLine, startColumn)
        );
    }
    
    string() {
        const start = this.position;
        const startLine = this.line;
        const startColumn = this.column;

        // Consumir comilla inicial
        this.advance();

        // Leer hasta encontrar la comilla final
        while (
            !this.isAtEnd() &&
            this.currentChar() !== '"' &&
            this.currentChar() !== "\n"
        ) {

            // Detectar secuencias de escape
            if (this.currentChar() === "\\") {

                const escapeLine = this.line;
                const escapeColumn = this.column;
                const next = this.peek();

                if (
                    next === '"' ||
                    next === "\\" ||
                    next === "n" ||
                    next === "t"
                ) {
                    this.advance();
                    this.advance();
                    continue;
                }

                // Escape no reconocido
                if (next !== "\0" && next !== "\n") {
                    this.errors.push({
                        type: "LEXICO",
                        description: `Secuencia de escape no válida: \\${next}`,
                        line: escapeLine,
                        column: escapeColumn
                    });

                    // Consumir la barra y el carácter inválido
                    this.advance();
                    this.advance();
                    continue;
                }
            }

            this.advance();
            
        }

        // Si encontramos la comilla de cierre
        if (!this.isAtEnd() && this.currentChar() === '"') {
            this.advance();

            const lexeme = this.source.substring(
                start,
                this.position
            );

            this.tokens.push(
                new Token("CADENA", lexeme, startLine, startColumn)
            );
        }  else {
            // Cadena sin cerrar
            this.errors.push({
                type: "LEXICO",
                description: "Cadena sin cerrar",
                line: startLine,
                column: startColumn
            });
        }
    }

    lexicalError(char) {
        this.errors.push({
            type: "LEXICO",
            description: `Carácter no reconocido: '${char}'`,
            line: this.line,
            column: this.column
        });

        this.advance();
    }



    scanTokens() {

        while (!this.isAtEnd()) {

            const char = this.currentChar();

            if (this.isLetter(char)) {
                this.identifier();
            } else if (this.isDigit(char)) {
                this.number();    
            } else if (char === '"') {
                this.string();
            } else if (char === "/" && this.peek() === "/") {
                this.comentarioSimple(); 
            }else if (char === "/" && this.peek() === "*") {
                this.comentarioMulti();
          
            } else if (this.operator()) {
            continue;
              
            } else if (this.symbol()) {
                continue;    
            } else  if (/\s/.test(char)) {
                this.advance();
            } else {
                this.lexicalError(char);
            }
        }

        return this.tokens;
    }


}

module.exports = Lexer;