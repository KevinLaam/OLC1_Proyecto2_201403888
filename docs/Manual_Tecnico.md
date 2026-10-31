# Manual Técnico – AutoInfra

**Universidad de San Carlos de Guatemala**  
**Facultad de Ingeniería**  
**Organización de Lenguajes y Compiladores 1**  
**Proyecto 2 – AutoInfra**

---

## 1. Introducción

AutoInfra es un lenguaje de programación orientado a la definición y administración de recursos de infraestructura tecnológica, desarrollado como parte del Proyecto 2 del curso de Organización de Lenguajes y Compiladores 1.

El proyecto consiste en la implementación de un analizador léxico, un analizador sintáctico y un intérprete que permiten procesar instrucciones escritas en el lenguaje AutoInfra. A través de estas herramientas, el sistema identifica los componentes del código fuente, verifica su estructura sintáctica, construye un Árbol de Sintaxis Abstracta (AST) y ejecuta las instrucciones reconocidas.

La aplicación cuenta con una interfaz web que permite escribir, abrir, guardar y ejecutar archivos de código fuente. Además, proporciona diferentes reportes para visualizar los tokens reconocidos, los errores encontrados, el árbol AST, la tabla de símbolos y los recursos de infraestructura registrados durante la ejecución.

Este manual técnico describe la estructura interna del proyecto, las tecnologías utilizadas, la organización de sus componentes y el funcionamiento de los principales módulos que conforman el sistema.

## 2. Objetivos

### 2.1. Objetivo general

Desarrollar un intérprete para el lenguaje AutoInfra mediante la implementación de analizadores léxicos y sintácticos, la construcción de un Árbol de Sintaxis Abstracta y la ejecución de instrucciones, integrando estos componentes en una aplicación web que permita analizar y ejecutar programas escritos en dicho lenguaje.

### 2.2. Objetivos específicos

- Implementar un analizador léxico capaz de reconocer palabras reservadas, identificadores, operadores, símbolos y valores literales del lenguaje AutoInfra.
- Desarrollar un analizador sintáctico que valide la estructura de las instrucciones y genere un Árbol de Sintaxis Abstracta (AST).
- Implementar un intérprete que permita ejecutar declaraciones de variables, operaciones, estructuras de control, tareas, funciones y operaciones sobre recursos de infraestructura.
- Incorporar el manejo de funciones con parámetros, valores de retorno, llamadas recursivas y ámbitos de variables.
- Desarrollar una interfaz web para facilitar la escritura, carga, almacenamiento y ejecución de programas.
- Generar reportes de tokens, errores léxicos y sintácticos, AST, tabla de símbolos y recursos de infraestructura.
- Integrar el frontend y el backend mediante una API REST para procesar el código fuente y presentar los resultados del análisis.

## 3. Descripción general del sistema

AutoInfra está compuesto por dos partes principales: un backend encargado del procesamiento del lenguaje y un frontend que proporciona la interfaz de interacción con el usuario.

El backend recibe el código fuente y lo procesa mediante tres componentes principales:

1. **Analizador léxico:** recorre el código fuente e identifica los tokens que conforman el lenguaje.
2. **Analizador sintáctico:** procesa los tokens, reconoce las estructuras gramaticales y construye el AST.
3. **Intérprete:** recorre el AST y ejecuta las instrucciones correspondientes, administrando variables, funciones, tareas y recursos de infraestructura.

El frontend permite que el usuario interactúe con estos componentes mediante un editor de código y diferentes pestañas de resultados.

### 3.1. Funcionalidades principales

El sistema permite:

- Declarar recursos de tipo `server`, `service` y `database`.
- Declarar variables de tipo `int`, `float`, `string` y `bool`.
- Realizar operaciones aritméticas, relacionales y lógicas.
- Ejecutar estructuras condicionales `if` y `else`.
- Ejecutar ciclos `while` y `for`, incluyendo instrucciones `break` y `continue`.
- Declarar y ejecutar tareas mediante `task` y `run`.
- Declarar funciones con parámetros, valores de retorno y llamadas recursivas.
- Declarar y modificar arreglos.
- Ejecutar funciones nativas para consultar y administrar recursos de infraestructura.
- Generar reportes de análisis y ejecución.

### 3.2. Flujo general de funcionamiento

El proceso comienza cuando el usuario escribe o carga un programa en el editor de código y selecciona la opción **Ejecutar**.

El frontend envía el código fuente al backend mediante una solicitud HTTP. El backend realiza el análisis léxico y sintáctico, construye el AST y, cuando corresponde, ejecuta las instrucciones mediante el intérprete.

Finalmente, el backend devuelve los resultados al frontend, donde se muestran en la consola y en las pestañas de reportes.

Este proceso permite mantener separadas la lógica de análisis y ejecución del lenguaje y la presentación visual de los resultados.

## 4. Tecnologías utilizadas y arquitectura del proyecto

### 4.1. Tecnologías utilizadas

Para el desarrollo de AutoInfra se utilizaron diferentes tecnologías y herramientas que permiten implementar el análisis del lenguaje, la ejecución de instrucciones y la presentación de resultados mediante una aplicación web.

Las principales tecnologías utilizadas son las siguientes:

| Tecnología | Descripción | Utilización en el proyecto |
|---|---|---|
| JavaScript | Lenguaje de programación utilizado para implementar la lógica del sistema. | Desarrollo del analizador léxico, analizador sintáctico, intérprete y funcionalidades del frontend. |
| Node.js | Entorno de ejecución de JavaScript del lado del servidor. | Ejecución del backend y procesamiento del código fuente. |
| Express.js | Framework para desarrollar aplicaciones y servicios web con Node.js. | Implementación de la API REST que comunica el frontend con el backend. |
| React | Biblioteca de JavaScript para construir interfaces de usuario. | Desarrollo del editor de código y visualización de reportes. |
| Vite | Herramienta de desarrollo y construcción de aplicaciones web. | Configuración y ejecución del frontend. |
| React Flow | Biblioteca para representar nodos y conexiones de manera gráfica. | Visualización del Árbol de Sintaxis Abstracta (AST). |
| Dagre | Biblioteca para organizar automáticamente grafos. | Distribución de los nodos del AST en la representación gráfica. |
| HTML y CSS | Tecnologías utilizadas para estructurar y diseñar interfaces web. | Organización visual del editor, botones, pestañas y tablas de resultados. |
| Visual Studio Code | Editor de código fuente. | Desarrollo y mantenimiento de los archivos del proyecto. |
| Git y GitHub | Herramientas de control de versiones y alojamiento de repositorios. | Administración de cambios y almacenamiento del código fuente. |

El analizador léxico y el analizador sintáctico fueron desarrollados manualmente en JavaScript, sin utilizar generadores automáticos de analizadores.

### 4.2. Arquitectura general del sistema

AutoInfra utiliza una arquitectura cliente-servidor, en la cual el frontend y el backend se encuentran separados y se comunican mediante solicitudes HTTP.

El sistema está organizado en tres componentes principales:

**Frontend:** proporciona la interfaz gráfica mediante la cual el usuario puede escribir código AutoInfra, abrir y guardar archivos, ejecutar programas y consultar los reportes generados.

**Backend:** recibe las solicitudes del frontend, coordina el análisis del código fuente y devuelve los resultados del procesamiento.

**Motor de análisis e interpretación:** contiene el analizador léxico, el analizador sintáctico y el intérprete. Estos componentes trabajan de forma secuencial para transformar el código fuente en instrucciones ejecutables.

La separación de estos componentes permite mantener organizada la lógica del sistema y facilita la identificación de errores durante el desarrollo.

### 4.3. Estructura de carpetas del proyecto

El proyecto está organizado en dos directorios principales, `backend` y `frontend`, además de carpetas destinadas a la documentación y los archivos de ejemplo.

La estructura general es la siguiente:

```text
OLC1_Proyecto2_201403888/
│
├── backend/
│   ├── node_modules/
│   ├── src/
│   │   ├── lexer/
│   │   │   └── Lexer.js
│   │   ├── parser/
│   │   │   └── Parser.js
│   │   ├── interpreter/
│   │   │   └── Interpreter.js
│   │   └── Analizador.js
│   │
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   ├── testAnalizador.js
│   ├── testInterprete.js
│   ├── testParser.js
│   └── textLexer.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ASTGraph.jsx
│   │   ├── App.jsx
│   │   └── App.css
│   ├── package.json
│   └── vite.config.js
│
├── docs/
│   └── MANUAL_TECNICO.md
│
├── examples/
│
├── .gitignore
├── GRAMATICA.md
└── README.md
```

La carpeta `node_modules` contiene las dependencias instaladas mediante npm y no es necesario incluirla en el repositorio.

### 4.4. Organización del backend

El backend contiene los módulos responsables del procesamiento del lenguaje AutoInfra.

**Lexer.js**

Implementa el analizador léxico. Su función consiste en recorrer el código fuente, identificar los elementos del lenguaje y generar una lista de tokens. También registra los errores léxicos encontrados durante el análisis.

**Parser.js**

Implementa el analizador sintáctico. Recibe los tokens generados por el lexer y verifica que las instrucciones cumplan con las reglas gramaticales del lenguaje. Como resultado, construye un Árbol de Sintaxis Abstracta (AST) y registra los errores sintácticos.

**Interpreter.js**

Implementa el intérprete de AutoInfra. Recorre el AST y ejecuta las instrucciones reconocidas, incluyendo declaraciones de variables, operaciones, estructuras de control, tareas, funciones y operaciones sobre recursos de infraestructura.

También administra los ámbitos de variables y recopila información utilizada para generar la tabla de símbolos.

**Analizador.js**

Coordina el proceso de análisis del código fuente. Integra el lexer, parser e intérprete y organiza los resultados que posteriormente serán enviados al frontend.

**server.js**

Contiene la configuración del servidor Express y el endpoint utilizado para recibir las solicitudes de análisis.

**Archivos de prueba**

Los archivos `testAnalizador.js`, `testInterprete.js`, `testParser.js` y `textLexer.js` se utilizan para realizar pruebas individuales de los componentes del backend.

### 4.5. Organización del frontend

El frontend fue desarrollado utilizando React y Vite.

Su función principal es proporcionar una interfaz web para interactuar con el lenguaje AutoInfra.

Los archivos principales son:

**App.jsx**

Contiene la estructura principal de la aplicación. Administra el editor de código, los botones de interacción, la ejecución de programas y las pestañas utilizadas para mostrar los resultados.

Entre sus funcionalidades se encuentran:

- Abrir archivos de código fuente.
- Guardar archivos y utilizar la opción Guardar como.
- Limpiar el contenido del editor.
- Ejecutar el código AutoInfra.
- Visualizar la salida de consola.
- Consultar tokens, errores, AST, símbolos y recursos de infraestructura.

**App.css**

Contiene los estilos visuales utilizados en la aplicación, incluyendo colores, distribución de paneles, botones, tablas y presentación del editor.

**ASTGraph.jsx**

Contiene la implementación de la representación gráfica del AST mediante React Flow y Dagre.

Este componente recibe el árbol generado por el backend y lo transforma en nodos y conexiones para facilitar su visualización.

### 4.6. Comunicación entre frontend y backend

La comunicación entre el frontend y el backend se realiza mediante una API REST implementada con Express.

El endpoint principal es:

```http
POST http://localhost:3000/api/analyze
```

El frontend envía una solicitud HTTP de tipo POST que contiene el código fuente escrito por el usuario.

Ejemplo del cuerpo de la solicitud:

```json
{
  "source": "int numero = 10;"
}
```

El backend recibe el contenido, ejecuta los analizadores y devuelve una respuesta en formato JSON.

Entre los campos de la respuesta se encuentran:

| Campo | Descripción |
|---|---|
| `success` | Indica el resultado general del procesamiento. |
| `tokens` | Lista de tokens reconocidos por el analizador léxico. |
| `lexicalErrors` | Errores léxicos encontrados. |
| `syntaxErrors` | Errores sintácticos encontrados. |
| `ast` | Árbol de Sintaxis Abstracta generado por el parser. |
| `executed` | Indica si se realizó la ejecución del programa. |
| `output` | Mensajes y resultados generados por el intérprete. |
| `symbols` | Información utilizada para construir la tabla de símbolos. |
| `infrastructure` | Recursos de infraestructura registrados y sus propiedades. |

El frontend procesa la respuesta recibida y presenta la información en las pestañas correspondientes.

### 4.7. Flujo de procesamiento del código fuente

El procesamiento de un programa AutoInfra sigue una secuencia de etapas.

1. El usuario escribe o abre un archivo desde el editor.
2. El frontend envía el código fuente al backend mediante una solicitud HTTP.
3. El analizador léxico recorre el código y genera los tokens.
4. El analizador sintáctico procesa los tokens y construye el AST.
5. El intérprete ejecuta las instrucciones del programa cuando el análisis permite continuar.
6. El backend recopila los resultados de ejecución y los reportes.
7. El frontend recibe la respuesta y muestra la información al usuario.

El flujo general puede representarse de la siguiente manera:

```text
       USUARIO
          |
          v
   FRONTEND (React)
          |
          | HTTP POST
          v
   BACKEND (Express)
          |
          v
    ANALIZADOR LÉXICO
          |
          v
         TOKENS
          |
          v
  ANALIZADOR SINTÁCTICO
          |
          v
          AST
          |
          v
      INTÉRPRETE
          |
          v
 RESULTADOS Y REPORTES
          |
          v
   FRONTEND (React)
          |
          v
        USUARIO
```

Esta arquitectura permite que el análisis del lenguaje se realice en el backend, mientras que el frontend se encarga de presentar los resultados de manera organizada.

## 5. Analizador léxico

### 5.1. Descripción general

El analizador léxico es el primer componente encargado de procesar el código fuente escrito en el lenguaje AutoInfra. Su función principal consiste en recorrer el texto ingresado por el usuario e identificar los elementos que forman parte del lenguaje, conocidos como tokens.

Este componente fue desarrollado manualmente utilizando JavaScript y se encuentra implementado en el archivo `backend/src/lexer/Lexer.js`.

Durante el análisis, el lexer reconoce palabras reservadas, identificadores, valores numéricos, cadenas de texto, operadores y símbolos especiales. Además, registra los errores léxicos que puedan encontrarse en el código fuente.

El resultado de este proceso es una lista de tokens que posteriormente es utilizada por el analizador sintáctico para construir el Árbol de Sintaxis Abstracta (AST).

### 5.2. Funcionamiento del analizador léxico

El lexer realiza un recorrido secuencial del código fuente, analizando cada carácter para determinar a qué elemento del lenguaje pertenece.

El proceso general se desarrolla de la siguiente manera:

1. Recibe el código fuente proporcionado por el usuario.
2. Recorre los caracteres de la entrada.
3. Identifica palabras reservadas, identificadores, literales, operadores y símbolos.
4. Ignora los espacios en blanco y comentarios cuando corresponde.
5. Genera los tokens reconocidos, incluyendo su ubicación.
6. Registra los errores léxicos encontrados.
7. Entrega los tokens al analizador sintáctico.

Para identificar la ubicación de los elementos, el analizador mantiene información de la línea y columna durante el recorrido del código.

### 5.3. Estructura de los tokens

Cada token contiene información que permite identificar el elemento reconocido y su posición dentro del código fuente.

Los atributos principales son:

| Atributo | Descripción |
|---|---|
| `type` | Tipo de token reconocido. |
| `lexeme` | Texto original que representa el token. |
| `line` | Línea donde se encuentra el token. |
| `column` | Columna donde inicia el token. |

Por ejemplo, para la instrucción:

```javascript
int numero = 10;
```

El analizador identifica los siguientes elementos:

| Tipo | Lexema |
|---|---|
| `INT` | `int` |
| `IDENTIFICADOR` | `numero` |
| `IGUAL` | `=` |
| `ENTERO` | `10` |
| `PUNTOCOMA` | `;` |

Esta información permite que el parser reconozca posteriormente una declaración de variable.

### 5.4. Palabras reservadas

AutoInfra utiliza palabras reservadas para identificar declaraciones, estructuras de control, tipos de datos y operaciones de infraestructura.

Entre las principales se encuentran:

| Categoría | Palabras reservadas |
|---|---|
| Recursos | `server`, `service`, `database` |
| Declaraciones | `task`, `function`, `main`, `run` |
| Tipos de datos | `int`, `float`, `string`, `bool` |
| Condicionales | `if`, `else` |
| Ciclos | `while`, `for` |
| Control de flujo | `break`, `continue`, `return` |
| Valores booleanos | `true`, `false` |
| Funciones nativas | `print`, `length`, `status`, `start`, `stop`, `restart`, `install`, `uninstall`, `deploy`, `scale`, `connect`, `disconnect` |

Estas palabras tienen un significado específico dentro de la gramática y se diferencian de los identificadores definidos por el usuario.


### 5.5. Identificadores y valores literales

El analizador léxico reconoce identificadores que permiten nombrar variables, tareas, funciones y recursos de infraestructura.

Por ejemplo:

```javascript
int contador = 5;

server ServidorPrincipal {
    cpu = 4;
}
```

En este ejemplo, `contador` y `ServidorPrincipal` son identificadores.

También se reconocen diferentes tipos de valores literales:

| Token | Descripción | Ejemplo |
|---|---|---|
| `ENTERO` | Número entero. | `10` |
| `DECIMAL` | Número decimal. | `3.5` |
| `CADENA` | Secuencia de caracteres entre comillas dobles. | `"Hola AutoInfra"` |
| `TRUE` | Valor booleano verdadero. | `true` |
| `FALSE` | Valor booleano falso. | `false` |

Los literales se utilizan en declaraciones de variables, propiedades de recursos, expresiones y llamadas a funciones.

### 5.6. Operadores reconocidos

El lenguaje AutoInfra permite realizar operaciones aritméticas, relacionales y lógicas.

**Operadores aritméticos**

| Operador | Función |
|---|---|
| `+` | Suma |
| `-` | Resta |
| `*` | Multiplicación |
| `/` | División |
| `%` | Módulo |

**Operadores relacionales y de igualdad**

| Operador | Función |
|---|---|
| `>` | Mayor que |
| `<` | Menor que |
| `>=` | Mayor o igual que |
| `<=` | Menor o igual que |
| `==` | Igualdad |
| `!=` | Desigualdad |

**Operadores lógicos**

| Operador | Función |
|---|---|
| `&&` | AND lógico |
| `||` | OR lógico |
| `!` | Negación lógica |

El operador `=` se utiliza para asignar valores a variables, propiedades y elementos de arreglos.

La precedencia de los operadores se establece en el analizador sintáctico, no en el analizador léxico.

### 5.7. Símbolos especiales

El lexer reconoce los símbolos utilizados para delimitar instrucciones, bloques, expresiones y arreglos.

| Símbolo | Utilización |
|---|---|
| `{` `}` | Delimitación de bloques. |
| `(` `)` | Agrupación de expresiones y parámetros. |
| `[` `]` | Declaración y acceso a arreglos. |
| `;` | Finalización de instrucciones. |
| `,` | Separación de argumentos y elementos. |
| `.` | Acceso a propiedades. |

Estos símbolos permiten que el parser identifique la estructura de las instrucciones del lenguaje.

### 5.8. Manejo de cadenas de texto

El analizador léxico reconoce cadenas delimitadas por comillas dobles.

Por ejemplo:

```javascript
string mensaje = "Servidor activo";
```

También contempla secuencias de escape utilizadas para representar caracteres especiales dentro de una cadena.

| Secuencia | Significado |
|---|---|
| `\"` | Comilla doble dentro de una cadena. |
| `\\` | Barra invertida. |
| `\n` | Salto de línea. |
| `\t` | Tabulación. |

Cuando se encuentra una secuencia de escape no válida, el lexer registra un error léxico.

Por ejemplo:

```javascript
string ruta = "Servidor\q";
```

El analizador registra un error indicando que la secuencia `\q` no es válida.

### 5.9. Manejo de comentarios

El analizador léxico contempla comentarios que permiten agregar información al código fuente sin que esta forme parte de las instrucciones ejecutables.

**Comentarios de una línea**

```javascript
// Declaración de una variable
int numero = 10;
```

**Comentarios de múltiples líneas**

```javascript
/*
    Configuración inicial
    del servidor principal
*/
```

El lexer omite el contenido de los comentarios durante la generación de tokens, manteniendo el seguimiento de líneas y columnas.

### 5.10. Manejo de errores léxicos

El analizador léxico identifica caracteres y secuencias que no pertenecen al lenguaje AutoInfra.

Cuando se encuentra un elemento no reconocido, se genera un registro de error con información sobre el problema y su ubicación.

| Atributo | Descripción |
|---|---|
| `type` | Categoría del error, identificada como `LEXICO`. |
| `description` | Descripción del problema encontrado. |
| `line` | Línea donde ocurrió el error. |
| `column` | Columna donde ocurrió el error. |

Entre los errores que puede identificar el lexer se encuentran:

- Caracteres no reconocidos.
- Cadenas de texto sin cerrar.
- Secuencias de escape no válidas.

Por ejemplo:

```javascript
task PruebaErrores {
    @
}
```

El carácter `@` no pertenece a los símbolos reconocidos del lenguaje, por lo que se genera un error léxico.

Un ejemplo del mensaje producido es:

```text
LEXICO: Carácter no reconocido: '@' (Línea 2, Columna 5)
```

Los errores identificados se muestran en la pestaña **Errores** de la interfaz web, junto con su descripción, línea y columna.

### 5.11. Integración con el analizador sintáctico

Una vez finalizado el recorrido del código fuente, el lexer proporciona la lista de tokens reconocidos y los errores encontrados.

La lista de tokens es utilizada por el parser para identificar declaraciones, expresiones, estructuras de control y demás construcciones del lenguaje.

La relación entre ambos componentes puede representarse de la siguiente manera:

```text
       CÓDIGO FUENTE
             |
             v
      ANALIZADOR LÉXICO
             |
        +----+----+
        |         |
        v         v
      TOKENS    ERRORES
        |
        v
 ANALIZADOR SINTÁCTICO
        |
        v
        AST
```

Esta separación permite que cada componente tenga una responsabilidad específica dentro del procesamiento del lenguaje.

El lexer se encarga de reconocer los elementos individuales del código, mientras que el parser determina si dichos elementos forman instrucciones válidas de acuerdo con la gramática de AutoInfra.

---

## 6. Analizador sintáctico

### 6.1. Descripción general

El analizador sintáctico es el componente encargado de verificar que la secuencia de tokens generada por el analizador léxico cumpla con las reglas gramaticales del lenguaje AutoInfra.

Este componente se encuentra implementado en el archivo `backend/src/parser/Parser.js` y fue desarrollado manualmente en JavaScript mediante la técnica de análisis descendente recursivo.

Su función principal consiste en reconocer las declaraciones, instrucciones y expresiones del lenguaje, construyendo un Árbol de Sintaxis Abstracta (AST) que posteriormente será utilizado por el intérprete.

### 6.2. Funcionamiento del parser

El parser recibe una lista de tokens y mantiene una posición que indica el token que se está analizando.

A partir de esta información, identifica las diferentes construcciones del lenguaje mediante métodos especializados.

El proceso general consiste en:

1. Recibir los tokens generados por el lexer.
2. Identificar las declaraciones del programa.
3. Reconocer las instrucciones que forman parte de cada declaración.
4. Analizar las expresiones según la precedencia de operadores.
5. Construir los nodos correspondientes del AST.
6. Registrar los errores sintácticos encontrados.

El resultado principal es un nodo de tipo `Program`, que contiene las declaraciones reconocidas.

### 6.3. Métodos principales

Entre los métodos utilizados por el analizador sintáctico se encuentran:

| Método | Función |
|---|---|
| `parse()` | Analiza el programa completo. |
| `parseServer()` | Reconoce declaraciones de servidores. |
| `parseService()` | Reconoce declaraciones de servicios. |
| `parseDatabase()` | Reconoce declaraciones de bases de datos. |
| `parseProperty()` | Analiza propiedades de recursos. |
| `parseVariableDeclaration()` | Reconoce declaraciones de variables. |
| `parseTask()` | Analiza declaraciones de tareas. |
| `parseFunction()` | Reconoce declaraciones de funciones. |
| `parseMain()` | Analiza el bloque principal. |
| `parseStatement()` | Identifica las instrucciones del lenguaje. |
| `parseIf()` | Reconoce estructuras condicionales. |
| `parseWhile()` | Reconoce ciclos `while`. |
| `parseFor()` | Reconoce ciclos `for`. |
| `parseReturn()` | Analiza instrucciones de retorno. |
| `parseRun()` | Reconoce la ejecución de tareas. |
| `parseArray()` | Analiza literales de arreglos. |
| `parsePrimary()` | Reconoce expresiones primarias. |

El parser también cuenta con métodos auxiliares para consultar, consumir y avanzar entre tokens.

### 6.4. Análisis descendente recursivo

El analizador utiliza el enfoque descendente recursivo, en el cual cada método representa una construcción gramatical del lenguaje.

Por ejemplo, cuando se encuentra la palabra reservada `task`, el parser utiliza el método correspondiente para reconocer el nombre de la tarea y las instrucciones que forman parte de su cuerpo.

Cada método puede llamar a otros métodos para analizar estructuras internas.

Este enfoque facilita la organización del código, ya que las declaraciones, instrucciones y expresiones se procesan mediante procedimientos independientes.

### 6.5. Precedencia de operadores

El parser implementa diferentes niveles de precedencia para garantizar que las expresiones se agrupen correctamente.

La precedencia utilizada, de menor a mayor, es la siguiente:

| Prioridad | Operadores |
|---|---|
| 1 | `||` |
| 2 | `&&` |
| 3 | `==`, `!=` |
| 4 | `>`, `<`, `>=`, `<=` |
| 5 | `+`, `-` |
| 6 | `*`, `/`, `%` |
| 7 | `!`, `-` unario |
| 8 | Llamadas a funciones, acceso a índices y propiedades |

Por ejemplo:

```javascript
int resultado = 5 + 3 * 2;
```

El parser reconoce que la multiplicación tiene mayor precedencia que la suma.

Por lo tanto, la expresión se interpreta como:

```text
5 + (3 * 2)
```

El resultado de su ejecución es `11`.

Los operadores binarios de un mismo nivel se agrupan de izquierda a derecha, de acuerdo con las producciones implementadas.

### 6.6. Manejo de errores sintácticos

El analizador sintáctico registra errores cuando encuentra una secuencia de tokens que no corresponde con las reglas gramaticales del lenguaje.

Entre los errores que puede identificar se encuentran:

- Ausencia de puntos y coma.
- Paréntesis sin cerrar.
- Llaves de cierre faltantes.
- Expresiones incompletas.
- Instrucciones no reconocidas.

Cada error contiene una descripción y, cuando la información está disponible, la línea y columna donde se detectó.

Los errores se almacenan en una lista que posteriormente se presenta en la pestaña de errores de la interfaz web.

### 6.7. Relación con la gramática formal

Las reglas utilizadas por el parser se encuentran documentadas en el archivo `GRAMATICA.md`, ubicado en la raíz del proyecto.

Este archivo presenta las producciones principales del lenguaje mediante la notación EBNF.

La gramática describe la estructura de las declaraciones, instrucciones, expresiones y demás construcciones reconocidas por AutoInfra.

---

## 7. Árbol de Sintaxis Abstracta (AST)

### 7.1. Descripción general

El Árbol de Sintaxis Abstracta, conocido como AST, es una representación estructurada del código fuente que permite organizar las instrucciones reconocidas por el analizador sintáctico.

Cada nodo del árbol representa un elemento del lenguaje, como una declaración de variable, una operación aritmética, una función o una estructura de control.

El AST es generado por el parser y posteriormente utilizado por el intérprete para ejecutar las instrucciones del programa.

### 7.2. Estructura general del AST

El nodo principal del árbol es de tipo `Program`.

Este nodo contiene una colección de declaraciones que representan las instrucciones principales del programa.

Entre los tipos de nodos utilizados se encuentran:

| Nodo | Descripción |
|---|---|
| `Program` | Representa el programa completo. |
| `ServerDeclaration` | Declaración de un servidor. |
| `ServiceDeclaration` | Declaración de un servicio. |
| `DatabaseDeclaration` | Declaración de una base de datos. |
| `VariableDeclaration` | Declaración de una variable. |
| `TaskDeclaration` | Declaración de una tarea. |
| `FunctionDeclaration` | Declaración de una función. |
| `MainDeclaration` | Bloque principal del programa. |
| `Assignment` | Asignación de un valor. |
| `IfStatement` | Estructura condicional. |
| `WhileStatement` | Ciclo `while`. |
| `ForStatement` | Ciclo `for`. |
| `BinaryExpression` | Expresión con un operador binario. |
| `Literal` | Valor literal. |
| `Identifier` | Referencia a un identificador. |
| `CallExpression` | Llamada a una función. |

### 7.3. Ejemplo de construcción del AST

Para la instrucción:

```javascript
int resultado = 5 + 3 * 2;
```

El parser genera una estructura equivalente a:

```json
{
  "type": "VariableDeclaration",
  "dataType": "int",
  "name": "resultado",
  "value": {
    "type": "BinaryExpression",
    "operator": "+",
    "left": {
      "type": "Literal",
      "value": "5"
    },
    "right": {
      "type": "BinaryExpression",
      "operator": "*",
      "left": {
        "type": "Literal",
        "value": "3"
      },
      "right": {
        "type": "Literal",
        "value": "2"
      }
    }
  }
}
```

Esta representación permite observar que la multiplicación se encuentra agrupada dentro de la suma, respetando la precedencia de operadores.

El ejemplo muestra una versión simplificada del AST; los nodos reales también pueden contener información adicional, como tipo de literal, línea y columna.

### 7.4. Representación gráfica del AST

La aplicación permite visualizar el AST mediante una representación gráfica implementada en el frontend.

Esta funcionalidad se encuentra desarrollada en el archivo `frontend/src/components/ASTGraph.jsx`.

Para construir la representación gráfica se utilizan las bibliotecas React Flow y Dagre.

React Flow permite mostrar los nodos y sus conexiones, mientras que Dagre se utiliza para calcular su distribución.

El componente recibe el AST generado por el backend y lo transforma en elementos gráficos.

La interfaz también permite consultar el árbol en formato JSON para observar directamente su estructura interna.

### 7.5. Importancia del AST

El AST constituye una parte fundamental del proyecto porque permite separar el reconocimiento sintáctico de la ejecución.

Gracias a esta estructura, el intérprete puede recorrer las instrucciones sin tener que analizar nuevamente el código fuente original.

También facilita la representación de expresiones anidadas, estructuras de control, funciones y declaraciones de recursos.


## 8. Intérprete de AutoInfra

### 8.1. Descripción general

El intérprete es el componente encargado de ejecutar las instrucciones representadas en el Árbol de Sintaxis Abstracta (AST).

Se encuentra implementado en el archivo `backend/src/interpreter/Interpreter.js`.

Su funcionamiento consiste en recorrer las declaraciones del programa, registrar los elementos necesarios para la ejecución y procesar las instrucciones según su tipo.

### 8.2. Proceso de ejecución

El método `execute()` coordina la ejecución general del programa.

Durante este proceso se registran las tareas, funciones y recursos de infraestructura.

También se procesan las declaraciones de variables globales y se localiza el bloque `main`, desde el cual se ejecutan las tareas indicadas mediante la instrucción `run`.

La ejecución de las instrucciones se realiza mediante métodos especializados que permiten identificar el tipo de sentencia y aplicar la operación correspondiente.

### 8.3. Administración de variables

El intérprete utiliza estructuras de tipo `Map` para almacenar variables y sus valores.

Las declaraciones se procesan mediante el método `executeVariableDeclaration()`.

Las asignaciones se procesan mediante `executeAssignment()`, que permite modificar variables y elementos de arreglos, además de propiedades de objetos cuando corresponde.

El intérprete también registra información de las variables para construir posteriormente la tabla de símbolos.

### 8.4. Manejo de ámbitos

AutoInfra utiliza ámbitos para organizar el acceso a las variables durante la ejecución.

El intérprete administra variables globales y ámbitos locales mediante estructuras independientes.

Los ámbitos locales se utilizan principalmente durante la ejecución de tareas y funciones.

Esto permite que una variable local pueda tener el mismo nombre que una variable global sin modificar necesariamente su valor.

Por ejemplo:

```javascript
int numero = 10;

task Ejemplo {
    int numero = 20;
    print(numero);
}

main {
    run Ejemplo;
}
```

En este caso, la variable local `numero` puede utilizarse dentro de la tarea sin reemplazar la variable global.

### 8.5. Ejecución de tareas

Las tareas se declaran mediante la palabra reservada `task`.

El intérprete almacena las tareas reconocidas y permite ejecutarlas desde el bloque principal utilizando la instrucción `run`.

Durante la ejecución de una tarea se crea un ámbito local, se procesan sus instrucciones y posteriormente se cierra dicho ámbito.

### 8.6. Ejecución de funciones

El intérprete permite declarar y ejecutar funciones con parámetros y valores de retorno.

Las funciones se registran durante el procesamiento del programa y pueden ser llamadas desde expresiones.

Al ejecutar una función, el intérprete crea un ámbito local para almacenar los parámetros y las variables declaradas durante su ejecución.

Las instrucciones se procesan hasta encontrar un retorno o finalizar el cuerpo de la función.

### 8.7. Recursividad

El intérprete permite que una función se invoque a sí misma, utilizando ámbitos locales independientes para cada llamada.

Esta característica fue comprobada mediante la implementación de una función factorial.

Por ejemplo:

```javascript
function Factorial(int n) int {
    if (n <= 1) {
        return 1;
    }

    int resultado = n * Factorial(n - 1);
    return resultado;
}
```

Al ejecutar `Factorial(5)`, el intérprete realiza las llamadas recursivas y devuelve el resultado `120`.

### 8.8. Estructuras de control

El intérprete permite ejecutar estructuras condicionales y repetitivas.

**Condicionales**

El método `executeIf()` evalúa una condición y ejecuta las instrucciones de la rama correspondiente.

**Ciclo while**

El método `executeWhile()` repite un conjunto de instrucciones mientras la condición sea verdadera.

**Ciclo for**

El método `executeFor()` administra la inicialización, evaluación de la condición y actualización de la variable de control.

También se contemplan las instrucciones `break` y `continue`, utilizadas para modificar el flujo de ejecución de los ciclos.

### 8.9. Manejo de arreglos

El intérprete permite almacenar colecciones de valores mediante arreglos.

Entre las operaciones implementadas se encuentran:

- Declaración e inicialización de arreglos.
- Acceso a elementos mediante índices.
- Modificación de elementos.
- Consulta de longitud mediante `length()`.

Los índices permiten identificar posiciones específicas dentro de una colección.

### 8.10. Funciones nativas

AutoInfra incorpora funciones nativas que permiten realizar operaciones sobre los recursos de infraestructura.

| Función | Descripción |
|---|---|
| `print()` | Muestra información en la consola. |
| `length()` | Obtiene la longitud de una colección o valor compatible. |
| `status()` | Consulta el estado de un recurso. |
| `start()` | Inicia un recurso. |
| `stop()` | Detiene un recurso. |
| `restart()` | Reinicia un recurso. |
| `install()` | Registra la instalación de software sobre un servidor. |
| `uninstall()` | Registra la desinstalación de software. |
| `deploy()` | Realiza una operación de despliegue de servicio. |
| `scale()` | Modifica la cantidad de réplicas de un servicio. |
| `connect()` | Establece una conexión entre recursos. |
| `disconnect()` | Elimina una conexión entre recursos. |

Estas operaciones modifican o consultan la representación interna de los recursos administrados por el intérprete.

No requieren que se realicen cambios sobre servidores físicos o servicios externos.

### 8.11. Registro de resultados

Durante la ejecución, el intérprete almacena mensajes que permiten observar el comportamiento del programa.

Estos mensajes incluyen registros de variables, ejecución de tareas, llamadas a funciones, resultados de operaciones y modificaciones de infraestructura.

La información recopilada es enviada al frontend para su visualización en la consola.

---

## 9. Generación de reportes

### 9.1. Descripción general

AutoInfra proporciona diferentes reportes que permiten consultar los resultados del análisis y la ejecución del código fuente.

Los reportes se generan a partir de la información obtenida por el lexer, parser e intérprete.

### 9.2. Reporte de tokens

El reporte de tokens muestra los elementos reconocidos durante el análisis léxico.

Cada registro contiene información sobre el tipo de token, lexema y ubicación dentro del código fuente.

Este reporte permite verificar el reconocimiento de palabras reservadas, identificadores, operadores y símbolos.

### 9.3. Reporte de errores

El reporte de errores presenta los problemas encontrados durante el análisis del código.

Los errores se clasifican principalmente en:

- Errores léxicos.
- Errores sintácticos.

Cada registro muestra el tipo, descripción, línea y columna del problema detectado.

Esta información facilita la identificación y corrección de errores en el código fuente.

### 9.4. Reporte del AST

El reporte del AST permite consultar la estructura del programa reconocida por el parser.

La aplicación ofrece dos formas de visualización:

- Representación gráfica mediante nodos y conexiones.
- Representación estructurada en formato JSON.

Ambas representaciones permiten analizar las relaciones entre las declaraciones y expresiones del programa.

### 9.5. Tabla de símbolos

La tabla de símbolos contiene información sobre las variables y parámetros registrados durante la ejecución.

Los principales atributos mostrados son:

| Campo | Descripción |
|---|---|
| Nombre | Identificador del símbolo. |
| Tipo | Tipo de dato declarado. |
| Valor | Valor registrado o actualizado. |
| Ámbito | Contexto en el que se encuentra el símbolo. |

Los ámbitos permiten distinguir variables globales, variables locales de tareas y variables pertenecientes a funciones.

Durante las llamadas recursivas pueden registrarse diferentes instancias de un mismo parámetro o variable local.

### 9.6. Reporte de infraestructura

El reporte de infraestructura muestra los recursos declarados durante la ejecución del programa.

Entre los recursos admitidos se encuentran servidores, servicios y bases de datos.

El reporte presenta el nombre de cada recurso y sus propiedades.

También puede reflejar modificaciones realizadas por las funciones nativas, como cambios de estado, conexiones y cantidad de réplicas.

### 9.7. Resumen del análisis

La interfaz incluye un resumen con información general del procesamiento.

Entre los datos mostrados se encuentran:

- Cantidad de tokens reconocidos.
- Cantidad de errores léxicos.
- Cantidad de errores sintácticos.
- Cantidad de símbolos registrados.
- Cantidad de recursos de infraestructura.

Este resumen permite obtener una visión general del resultado del análisis.

---

## 10. Instalación y ejecución del proyecto

### 10.1. Requisitos previos

Para ejecutar AutoInfra en un entorno local es necesario contar con:

- Node.js instalado.
- npm, incluido normalmente con Node.js.
- Un navegador web moderno.
- Un editor de código, como Visual Studio Code.
- El código fuente completo del proyecto.

### 10.2. Instalación del backend

Primero se debe abrir una terminal en la carpeta `backend` del proyecto.

```bash
cd backend
```

Después se instalan las dependencias:

```bash
npm install
```

Una vez finalizada la instalación, se inicia el servidor:

```bash
node server.js
```

En la configuración utilizada durante el desarrollo, el backend se ejecuta en:

```text
http://localhost:3000
```

### 10.3. Instalación del frontend

Se debe abrir una segunda terminal y acceder a la carpeta `frontend`.

```bash
cd frontend
```

Instalar las dependencias:

```bash
npm install
```

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

En la configuración utilizada durante el desarrollo, la aplicación puede abrirse desde:

```text
http://localhost:5173
```

Si Vite utiliza otro puerto disponible, debe utilizarse la dirección indicada en la terminal.

### 10.4. Ejecución de un programa

Una vez iniciados el frontend y el backend, el usuario puede acceder a la aplicación desde el navegador.

Para ejecutar un programa:

1. Escribir el código AutoInfra en el editor o abrir un archivo existente.
2. Seleccionar el botón **Ejecutar**.
3. Esperar a que el backend procese el código.
4. Consultar los resultados en la pestaña **Consola**.
5. Revisar los reportes disponibles.

Un ejemplo básico de programa es:

```javascript
server ServidorPrincipal {
    cpu = 4;
    memory = 8;
    disk = 100;
}

task IniciarServidor {
    start(ServidorPrincipal);
    print(status(ServidorPrincipal));
}

main {
    run IniciarServidor;
}
```

Este programa declara un servidor, registra una tarea y ejecuta instrucciones para iniciar el recurso y consultar su estado.

### 10.5. Ejecución de pruebas

El backend contiene archivos utilizados para probar individualmente los componentes del lenguaje.

Estas pruebas permiten verificar el reconocimiento de tokens, el análisis sintáctico y la ejecución de instrucciones.

También es posible utilizar el editor web para realizar pruebas integrales que incluyan declaraciones, funciones, ciclos, arreglos y operaciones de infraestructura.

Durante el desarrollo se realizaron pruebas de precedencia de operadores, recursividad, manejo de ámbitos, tabla de símbolos y errores léxicos y sintácticos.

### 10.6. Consideraciones técnicas

Para el funcionamiento correcto de la aplicación se recomienda:

- Mantener ejecutándose el backend mientras se utiliza el frontend.
- Verificar que las dependencias estén instaladas.
- Comprobar que los puertos configurados estén disponibles.
- Revisar los mensajes de la terminal cuando ocurra un problema.
- Mantener organizados los archivos del proyecto.
- Evitar incluir la carpeta `node_modules` en el repositorio Git.

---

## 11. Conclusiones técnicas

El desarrollo de AutoInfra permitió integrar los principales componentes utilizados en la construcción de un intérprete de lenguajes de programación.

La implementación manual del analizador léxico y sintáctico permitió reconocer los elementos del lenguaje y organizar sus instrucciones mediante un Árbol de Sintaxis Abstracta.

El intérprete permitió ejecutar declaraciones de variables, operaciones, estructuras de control, funciones, tareas y operaciones sobre recursos de infraestructura.

La administración de ámbitos y la tabla de símbolos facilitaron el manejo de variables globales y locales, incluyendo parámetros de funciones y llamadas recursivas.

La integración de React y Node.js permitió construir una aplicación web que reúne el editor de código, la ejecución de programas y la generación de reportes.

Finalmente, las pruebas realizadas permitieron comprobar el funcionamiento conjunto de los componentes principales del sistema y verificar el procesamiento de programas escritos en AutoInfra.



