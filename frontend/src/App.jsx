
import { useRef, useState } from "react";
import "./App.css";
import ASTGraph from "./components/ASTGraph";

function App() {
  const [code, setCode] = useState(`server ServidorPrincipal {
    cpu = 4;
    memory = 8;
}

task PrepararServidor {
    start(ServidorPrincipal);
    print("Servidor iniciado");
}

main {
    run PrepararServidor;
}`);

  const [output, setOutput] = useState([]);

  const [analysisResult, setAnalysisResult] = useState(null);
    //para menu de reportes 
  const [activeTab, setActiveTab] = useState("console");

  const fileInputRef = useRef(null);

  const [fileName, setFileName] = useState("programa_autoinfra.infra");

  //primera prueba de salida en interfaz grafica
  //const handleExecute = () => {
    //setOutput(["Editor funcionando correctamente"]);
  //};
  
  //fetch para conectar frontend con backend
  const handleExecute = async () => {
    setOutput(["Analizando código AutoInfra..."]);
    setAnalysisResult(null);

    try {
      const response = await fetch("http://localhost:3000/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          source: code
        })
      });

      const data = await response.json();
      setAnalysisResult(data);

      if (!response.ok) {
        setOutput([
          data.message || "Error al procesar la solicitud"
        ]);
        return;
      }

      if (data.success) {
        setOutput(data.output || []);
      } else {
        const errors = [
          ...(data.lexicalErrors || []),
          ...(data.syntaxErrors || [])
        ];

        setOutput(
          errors.map(
            (error) =>
              `${error.type}: ${error.description} (Línea ${error.line}, Columna ${error.column})`
          )
        );
      }

    } catch (error) {
      setOutput([
        "No se pudo conectar con el backend de AutoInfra.",
        error.message
      ]);
    }
  };

  
  const handleOpenFile = (event) => {
  const file = event.target.files[0];

  if (!file) return;

  if (!file.name.toLowerCase().endsWith(".infra")) {
    alert("Solo se permiten archivos .infra");
    event.target.value = "";
    return;
  }
  setFileName(file.name);
  const reader = new FileReader();

  reader.onload = (e) => {
    setCode(e.target.result);
  };

  reader.readAsText(file);

  event.target.value = "";
};

    
  const handleSaveFile = () => {
    // Crear un archivo con el contenido del editor
    const blob = new Blob([code], {
      type: "text/plain;charset=utf-8"
    });

    // Crear una URL temporal para descargarlo
    const url = URL.createObjectURL(blob);

    // Crear un enlace de descarga
    const link = document.createElement("a");
    link.href = url;
    //link.download = "programa_autoinfra.infra";
    link.download = fileName;
    // Descargar el archivo
    document.body.appendChild(link);
    link.click();

    // Limpiar los recursos temporales
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  
  const handleSaveAsFile = () => {
    // Solicitar el nombre del archivo
    let fileName = window.prompt(
      "Ingrese el nombre del archivo:",
      "nuevo_programa"
    );

    // Si el usuario cancela
    if (fileName === null) {
      return;
    }

    fileName = fileName.trim();

    // Validar que no esté vacío
    if (fileName === "") {
      alert("Debe ingresar un nombre para el archivo.");
      return;
    }

    // Evitar caracteres inválidos en nombres de archivo
    if (/[<>:"/\\|?*\x00-\x1F]/.test(fileName)) {
      alert("El nombre contiene caracteres no permitidos.");
      return;
    }

    // Agregar extensión .infra si no la tiene
    if (!fileName.toLowerCase().endsWith(".infra")) {
      fileName += ".infra";
    }

    setFileName(fileName);
    // Crear el archivo con el contenido del editor
    const blob = new Blob([code], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };



  const handleClearEditor = () => {
    setCode("");
    setOutput([]);
    setAnalysisResult(null);
    setActiveTab("console");
    setFileName("programa_autoinfra.infra");
  };


  //para el conteo de las lineas
  const lineCount = code.split("\n").length;
  const lineNumbersRef = useRef(null);
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>AutoInfra</h1>
        <p>Analizador e intérprete de infraestructura</p>
      </header>

      <main className="workspace">
        <section className="editor-panel">
          <h2>Editor de código</h2>

          <div className="editor-container">
  <div
    className="line-numbers"
    ref={lineNumbersRef}
    aria-hidden="true"
  >
    {Array.from({ length: lineCount }, (_, index) => (
      <div key={index}>{index + 1}</div>
    ))}
  </div>

  <textarea
    className="code-editor"
    value={code}
    onChange={(e) => setCode(e.target.value)}
    onScroll={(e) => {
      if (lineNumbersRef.current) {
        lineNumbersRef.current.scrollTop =
          e.currentTarget.scrollTop;
      }
    }}
    spellCheck={false}
  />
</div>


          <input
            type="file"
            ref={fileInputRef}
            //accept=".txt,.ai"
            accept=".infra"
            onChange={handleOpenFile}
            style={{ display: "none" }}
          />

        

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              Abrir archivo
            </button>

            <button type="button" onClick={handleSaveFile}>
              Guardar archivo 
            </button>

            <button type="button" onClick={handleSaveAsFile}>
              Guardar como
            </button>
            
            <button type="button" onClick={handleClearEditor}>
              Limpiar
            </button>

            <button onClick={handleExecute}>
              Ejecutar
            </button>
        </section>

     

        <section className="output-panel">

                  
          <div className="report-tabs">
            {[
              { id: "console", label: "Consola" },
              { id: "tokens", label: "Tokens" },
              { id: "errors", label: "Errores" },
              { id: "ast", label: "AST" },
              { id: "symbols", label: "Símbolos" },
              { id: "infrastructure", label: "Infraestructura" }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={activeTab === tab.id ? "tab-button active" : "tab-button"}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
              
          {activeTab === "console" && (
            <div className="console">
              {output.map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
          )}

            {analysisResult && (
          <div>
            <h3>Resumen del análisis</h3>

            <p>Tokens: {analysisResult.tokens?.length || 0}</p>

            <p>
              Errores léxicos: {analysisResult.lexicalErrors?.length || 0}
            </p>

            <p>
              Errores sintácticos: {analysisResult.syntaxErrors?.length || 0}
            </p>

            <p>
              Símbolos: {analysisResult.symbols?.length || 0}
            </p>

            <p>
              Recursos: {analysisResult.infrastructure?.length || 0}
            </p>
          </div>
        )}

        
        {analysisResult && activeTab === "tokens" && (
          <div className="tokens-section">
            <h3>Tabla de tokens</h3>

            <div className="table-container">
              <table className="tokens-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Tipo</th>
                    <th>Lexema</th>
                    <th>Línea</th>
                    <th>Columna</th>
                  </tr>
                </thead>

                <tbody>
                  {(analysisResult.tokens || []).map((token, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{token.type}</td>
                      <td>{token.lexeme}</td>
                      <td>{token.line}</td>
                      <td>{token.column}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        
        {analysisResult && activeTab === "errors" && (
          <div className="errors-section">
            <h3>Reporte de errores</h3>

            {[
              ...(analysisResult.lexicalErrors || []),
              ...(analysisResult.syntaxErrors || [])
            ].length === 0 ? (
              <p className="no-errors">
                No se encontraron errores léxicos ni sintácticos.
              </p>
            ) : (
              <div className="table-container">
                <table className="tokens-table">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Tipo</th>
                      <th>Descripción</th>
                      <th>Línea</th>
                      <th>Columna</th>
                    </tr>
                  </thead>

                  <tbody>
                    {[
                      ...(analysisResult.lexicalErrors || []),
                      ...(analysisResult.syntaxErrors || [])
                    ].map((error, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{error.type}</td>
                        <td>{error.description}</td>
                        <td>{error.line}</td>
                        <td>{error.column}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

                
        {analysisResult?.ast && activeTab === "ast" && (
          <div className="ast-section">
            <h3>Árbol de Sintaxis Abstracta (AST)</h3>

            <h4>Representación gráfica</h4>
           
            <ASTGraph ast={analysisResult.ast} />

            <h4>Representación JSON</h4>

            <div className="ast-container">
              <pre>
                {JSON.stringify(analysisResult.ast, null, 2)}
              </pre>
            </div>
          </div>
        )}

        
       {analysisResult && activeTab === "symbols" && (
          <div className="symbols-section">
            <h3>Tabla de símbolos</h3>

            {(analysisResult.symbols || []).length === 0 ? (
              <p className="empty-report">
                No se encontraron variables registradas.
              </p>
            ) : (
              <div className="table-container">
                <table className="tokens-table">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Nombre</th>
                      <th>Tipo</th>
                      <th>Valor</th>
                      <th>Ámbito</th>
                    </tr>
                  </thead>

                  <tbody>
                    {analysisResult.symbols.map((symbol, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{symbol.name}</td>
                        <td>{symbol.dataType}</td>
                        <td>
                          {typeof symbol.value === "object"
                            ? JSON.stringify(symbol.value)
                            : String(symbol.value)}
                        </td>
                        <td>{symbol.scope || "Global"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}


       {analysisResult && activeTab === "infrastructure" && (
          <div className="infrastructure-section">
            <h3>Reporte de infraestructura</h3>

            {(analysisResult.infrastructure || []).length === 0 ? (
              <p className="empty-report">
                No se encontraron recursos de infraestructura.
              </p>
            ) : (
              <div className="table-container">
                <table className="tokens-table">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Nombre</th>
                      <th>Propiedades y estado</th>
                    </tr>
                  </thead>

                  <tbody>
                    {analysisResult.infrastructure.map((resource, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{resource.name}</td>
                        <td>
                          {Object.entries(resource)
                            .filter(([key]) => key !== "name")
                            .map(([key, value]) => (
                              <div key={key}>
                                <strong>{key}:</strong>{" "}
                                {typeof value === "object"
                                  ? JSON.stringify(value)
                                  : String(value)}
                              </div>
                            ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        </section>
      </main>
    </div>
  );
}

export default App;
