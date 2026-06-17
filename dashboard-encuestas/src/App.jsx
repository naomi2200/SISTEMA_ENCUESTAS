import { useEffect, useState } from "react";
import axios from "axios";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function App() {

  const [respuestas, setRespuestas] = useState([]);

  useEffect(() => {

  cargarRespuestas();

  const intervalo = setInterval(() => {

    cargarRespuestas();

  }, 2000);

  return () => clearInterval(intervalo);

}, []);

  const cargarRespuestas = async () => {

    try {

      const response = await axios.get(
        "http://localhost:3000/respuestas"
      );

      setRespuestas(response.data);

    } catch (error) {

      console.error(error);

    }
  };

  const total = respuestas.length;

  const buenos = respuestas.filter(
    r => r.respuesta === "BUENO"
  ).length;

  const regulares = respuestas.filter(
    r => r.respuesta === "REGULAR"
  ).length;

  const malos = respuestas.filter(
    r => r.respuesta === "MALO"
  ).length;
  const datosGrafico = [
  {
    nombre: "Bueno",
    cantidad: buenos
  },
  {
    nombre: "Regular",
    cantidad: regulares
  },
  {
    nombre: "Malo",
    cantidad: malos
  }
];

 return (
  <div
    style={{
      minHeight: "100vh",
      backgroundColor: "#f4f6f9",
      padding: "30px",
      fontFamily: "Arial"
    }}
  >
    <h1
      style={{
        textAlign: "center",
        fontSize: "48px",
        marginBottom: "10px"
      }}
    >
      🍽️ COMEDOR TECSUP
    </h1>

    <h2
      style={{
        textAlign: "center",
        color: "#555"
      }}
    >
      Sistema Inteligente de Encuestas
    </h2>

    <div
      style={{
        display: "flex",
        gap: "20px",
        justifyContent: "center",
        marginTop: "40px",
        flexWrap: "wrap"
      }}
    >
      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "15px",
          width: "220px",
          textAlign: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
        }}
      >
        <h3>😊 Bueno</h3>
        <h1>{buenos}</h1>
      </div>

      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "15px",
          width: "220px",
          textAlign: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
        }}
      >
        <h3>😐 Regular</h3>
        <h1>{regulares}</h1>
      </div>

      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "15px",
          width: "220px",
          textAlign: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
        }}
      >
        <h3>😞 Malo</h3>
        <h1>{malos}</h1>
      </div>
    </div>

    <div
      style={{
        background: "white",
        marginTop: "30px",
        padding: "20px",
        borderRadius: "15px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
      }}
    >
      <h2>Total Encuestas: {total}</h2>

      <div
        style={{
          width: "100%",
          height: "300px"
        }}
      >
        <ResponsiveContainer>
          <BarChart data={datosGrafico}>
            <XAxis dataKey="nombre" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cantidad" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    <div
      style={{
        background: "white",
        marginTop: "30px",
        padding: "20px",
        borderRadius: "15px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
      }}
    >
      <h2>📋 Últimas Respuestas</h2>

      {respuestas
        .slice()
        .reverse()
        .map((item, index) => (
          <p key={index}>
            <strong>{item.pregunta}</strong> - {item.respuesta}
          </p>
        ))}
    </div>
  </div>
);
}
export default App;