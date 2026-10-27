
import { useState } from "react";
import "./App.css";

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

  //primera prueba de salida en interfaz grafica
  //const handleExecute = () => {
    //setOutput(["Editor funcionando correctamente"]);
  //};
  
  //fetch para conectar frontend con backend
  const handleExecute = async () => {
    setOutput(["Analizando código AutoInfra..."]);

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


  return (
    <div className="app-container">
      <header className="app-header">
        <h1>AutoInfra</h1>
        <p>Analizador e intérprete de infraestructura</p>
      </header>

      <main className="workspace">
        <section className="editor-panel">
          <h2>Editor de código</h2>

          <textarea
            className="code-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
          />

          <button onClick={handleExecute}>
            Ejecutar
          </button>
        </section>

        <section className="output-panel">
          <h2>Consola</h2>

          <div className="console">
            {output.map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
