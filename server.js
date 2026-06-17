const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

// Aquí guardaremos las respuestas
let respuestas = [];

if (fs.existsSync("respuestas.json")) {

    const datos = fs.readFileSync(
        "respuestas.json",
        "utf8"
    );

    respuestas = JSON.parse(datos);
}

app.get("/", (req, res) => {
    res.send("Servidor funcionando");
});

// Recibir encuesta desde ESP32
app.post("/encuesta", (req, res) => {

    const nuevaRespuesta = {
        pregunta: req.body.pregunta,
        respuesta: req.body.respuesta,
        fecha: new Date()
    };

    respuestas.push(nuevaRespuesta);

    fs.writeFileSync(
    "respuestas.json",
    JSON.stringify(
        respuestas,
        null,
        2
    )
);

    console.log("Nueva respuesta:");
    console.log(nuevaRespuesta);

    res.json({
        mensaje: "Respuesta recibida"
    });
});

// Obtener todas las respuestas
app.get("/respuestas", (req, res) => {
    res.json(respuestas);
});

app.listen(3000, () => {
    console.log("Servidor iniciado");
    console.log("http://localhost:3000");
});