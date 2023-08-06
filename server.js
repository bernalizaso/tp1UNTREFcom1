// Cargar las variables de entorno del archivo .env
require("dotenv").config();

// Importar el módulo Express
const express = require("express");
const app = express();

// Importar las funciones del gestor de frutas
const { leerFrutas, guardarFrutas } = require("./src/frutasManager");

// Configurar el número de puerto para el servidor
const PORT = process.env.PORT || 3008;

// Crear un arreglo vacío para almacenar los datos de las frutas
let BD = [];

// Configurar el middleware para analizar el cuerpo de las solicitudes como JSON
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Middleware para leer los datos de las frutas antes de cada solicitud
app.use((req, res, next) => {
  BD = leerFrutas(); // Leer los datos de las frutas desde el archivo
  next(); // Pasar al siguiente middleware o ruta
});

// Ruta principal que devuelve los datos de las frutas
app.get("/frutas/:id", (req, res) => {
  const frutaId = parseInt(req.params.id);
  const fruta = BD.find((fruta) => fruta.id === frutaId);

  if (!fruta) {
    res.status(404).send("Fruta no encontrada"); // Si no se encuentra la fruta, enviar un error 404
  } else {
    res.send(fruta); // Si se encuentra la fruta, enviarla como respuesta
  }
});
// Ruta para agregar una nueva fruta al arreglo y guardar los cambios
app.post("/frutas/", (req, res) => {
  const nuevaFruta = req.body;
  BD.push(nuevaFruta); // Agregar la nueva fruta al arreglo
  BD.sort()
  guardarFrutas(BD); // Guardar los cambios en el archivo
  res.status(201).send("Fruta agregada!"); // Enviar una respuesta exitosa
});
app.put("/frutas/:id", (req, res) => {
  const frutaId = parseInt(req.params.id);
  const frutaIndex = BD.findIndex((fruta) => fruta.id === frutaId);

  if (frutaIndex === -1) {
    res.status(404).send("Fruta no encontrada"); // Si no se encuentra la fruta, enviar un error 404
  } else {
    const nuevaFruta = req.body;
    BD[frutaIndex] = { ...BD[frutaIndex], ...nuevaFruta }; // Combinar los datos actuales con los nuevos datos
    guardarFrutas(BD); // Guardar los cambios en el archivo
    res.status(200).send("Fruta modificada!"); // Enviar una respuesta exitosa
  }
});


app.delete("/frutas/:id", (req, res) => {
  const frutaId = parseInt(req.params.id);
  const frutaIndex = BD.findIndex((fruta) => fruta.id === frutaId);

  if (frutaIndex === -1) {
    res.status(404).send("Fruta no encontrada"); // Si no se encuentra la fruta, enviar un error 404
  } else {
    BD.splice(frutaIndex, 1); // Eliminar la fruta del arreglo BD
    guardarFrutas(BD); // Guardar los cambios en el archivo
    res.status(200).send("Fruta eliminada!"); // Enviar una respuesta exitosa
  }
});


// Ruta para manejar las solicitudes a rutas no existentes
app.get("*", (req, res) => {
  res.status(404).send("Lo sentimos, la página que buscas no existe.");
});

// Iniciar el servidor y escuchar en el puerto especificado
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
