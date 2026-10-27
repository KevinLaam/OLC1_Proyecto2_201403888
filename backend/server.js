
const express = require("express");
const cors = require("cors");

const Analyzer = require("./src/Analizador");

const app = express();
const PORT = 3000;

// Configuración
app.use(cors());
app.use(express.json());

// Ruta para analizar código AutoInfra
app.post("/api/analyze", (req, res) => {

    try {

        const { source } = req.body || {};

        // Validar que se haya enviado código
        if (typeof source !== "string" || source.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Debe proporcionar código fuente AutoInfra"
            });
        }

        // Crear un analizador por petición
        const analyzer = new Analyzer();

        // Analizar y ejecutar el código
        const result = analyzer.analyze(source);

        // Devolver los resultados
        return res.status(200).json(result);

    } catch (error) {

        console.error("Error al analizar:", error);

        return res.status(500).json({
            success: false,
            message: "Ocurrió un error interno al analizar el código"
        });

    }

});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor AutoInfra ejecutándose en http://localhost:${PORT}`);
});
