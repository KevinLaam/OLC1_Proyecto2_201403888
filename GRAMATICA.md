# Gramática de AutoInfra — EBNF

```ebnf
Programa = { Declaracion } ;

Declaracion = DeclaracionServer
            | DeclaracionService
            | DeclaracionDatabase
            | DeclaracionTask
            | DeclaracionFuncion
            | DeclaracionMain
            | DeclaracionVariable ;

DeclaracionServer   = "server" IDENTIFICADOR "{" { Propiedad } "}" ;
DeclaracionService  = "service" IDENTIFICADOR "{" { Propiedad } "}" ;
DeclaracionDatabase = "database" IDENTIFICADOR "{" { Propiedad } "}" ;

Propiedad = IDENTIFICADOR "=" Expresion ";" ;

DeclaracionVariable = TipoVariable [ "[" "]" ] IDENTIFICADOR "=" Expresion ";" ;

TipoVariable = "int" | "float" | "string" | "bool" ;

Asignacion = IDENTIFICADOR "=" Expresion ";" ;

AsignacionDestino = DestinoAsignable "=" Expresion ";" ;

DestinoAsignable = IDENTIFICADOR { AccesoIndice | AccesoPropiedad } ;
AccesoIndice     = "[" Expresion "]" ;
AccesoPropiedad  = "." NombrePropiedad ;
NombrePropiedad  = IDENTIFICADOR | "status" ;

Arreglo        = "[" [ ListaElementos ] "]" ;
ListaElementos = Expresion { "," Expresion } ;

DeclaracionTask = "task" IDENTIFICADOR Bloque ;
DeclaracionMain = "main" Bloque ;
InstruccionRun  = "run" IDENTIFICADOR ";" ;

DeclaracionFuncion = "function" IDENTIFICADOR
                     "(" [ ListaParametros ] ")"
                     TipoFuncion Bloque ;

ListaParametros = Parametro { "," Parametro } ;
Parametro       = TipoFuncion IDENTIFICADOR ;

TipoFuncion = "int" | "float" | "string" | "bool"
            | "server" | "service" | "database" ;

InstruccionReturn = "return" [ Expresion ] ";" ;

Bloque = "{" { Instruccion } "}" ;

Instruccion = DeclaracionVariable
            | Asignacion
            | AsignacionDestino
            | InstruccionExpresion
            | Condicional
            | CicloWhile
            | CicloFor
            | InstruccionBreak
            | InstruccionContinue
            | InstruccionReturn
            | InstruccionRun ;

InstruccionExpresion = Expresion ";" ;

Condicional = "if" "(" Expresion ")" Bloque [ "else" Bloque ] ;

CicloWhile = "while" "(" Expresion ")" Bloque ;

CicloFor = "for" "(" InicializacionFor
           [ Expresion ] ";"
           [ ActualizacionFor ] ")" Bloque ;

InicializacionFor = DeclaracionVariable | Asignacion | ";" ;
ActualizacionFor  = IDENTIFICADOR "=" Expresion ;

InstruccionBreak    = "break" ";" ;
InstruccionContinue = "continue" ";" ;

Expresion = ExpresionOr ;

ExpresionOr = ExpresionAnd { "||" ExpresionAnd } ;

ExpresionAnd = ExpresionIgualdad { "&&" ExpresionIgualdad } ;

ExpresionIgualdad = ExpresionComparacion
                    { ( "==" | "!=" ) ExpresionComparacion } ;

ExpresionComparacion = ExpresionTermino
                       { ( "<" | ">" | "<=" | ">=" ) ExpresionTermino } ;

ExpresionTermino = ExpresionFactor
                   { ( "+" | "-" ) ExpresionFactor } ;

ExpresionFactor = ExpresionUnaria
                  { ( "*" | "/" | "%" ) ExpresionUnaria } ;

ExpresionUnaria = ( "!" | "-" ) ExpresionUnaria
                | ExpresionPostfija ;

ExpresionPostfija = ExpresionPrimaria
                    { Llamada | AccesoIndice | AccesoPropiedad } ;

Llamada        = "(" [ ListaArgumentos ] ")" ;
ListaArgumentos = Expresion { "," Expresion } ;

ExpresionPrimaria = ENTERO
                  | DECIMAL
                  | CADENA
                  | "true"
                  | "false"
                  | IDENTIFICADOR
                  | FuncionNativa
                  | "(" Expresion ")"
                  | Arreglo ;

FuncionNativa = "print"
              | "start"
              | "stop"
              | "restart"
              | "install"
              | "uninstall"
              | "deploy"
              | "scale"
              | "connect"
              | "disconnect"
              | "length"
              | "status" ;
```
