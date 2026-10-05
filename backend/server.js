const express = require("express");

const app = express();

const PORT = 8080;

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "AutoInfra Backend funcionando"
    });
});

app.listen(PORT, () => {
    console.log(`AutoInfra Backend ejecutándose en http://localhost:${PORT}`);
});