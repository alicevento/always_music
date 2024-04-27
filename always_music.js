const { Pool } = require("pg");
// importo del modulo handleErrors la funcion que maneja los errores
const errors = require('./handleErrors.js');

// Configuración de la base de datos usando string de conexion
const pool = new Pool({
  user: "alice",
  host: "localhost",
  database: "always_music",
  password: "Camila",
  port: 5433, // Puerto que arroja el PG
  // connectionString:
  //     'postgresql://alice:Camila@localhost:5433/always_music'
});


//Crear funcion para registrar estudiantes
const nuevoEstudiante = async (nombre, rut, curso, nivel) => {
  try {
    const res = await pool.query(
      `INSERT INTO estudiantes values ($1, $2, $3, $4 ) RETURNING *`,
      [nombre, rut, curso, nivel]
    );
    console.log(`Estudiante ${nombre} agregado con éxito`);
    console.log("Estudiante agregado: ", res.rows[0]);
  } catch (error) {
    const { status, message } = errors(error.code || error);
    console.log(`Hubo un error: ${message}`);
  }
};

// Crear una función asíncrona para obtener por consola el registro de un estudiante por medio de su rut
const consultaRut = async (rut) => {
  try {
    const res = await pool.query(`SELECT * FROM estudiantes WHERE rut = $1`, [
      rut,
    ]);
    if (res.rowCount == 0) {
      console.log("No se encontró ningún estudiante con ese rut");
    } else {
      console.log("Estudiante consultado: ", res.rows[0]);
    }
  } catch (error) {
    const { status, message } = errors(error.code || error);
    console.log(`Hubo un error: ${message}`);
  }
};

//Crear funcion para consultar estudiantes registrados
const consultaEstudiante = async () => {
  try {
    const estudiantes = await pool.query("SELECT * FROM estudiantes1");
    console.log(estudiantes.rows);
  } catch (error) {
    const { status, message } = errors(error.code || error);
    console.log(`Hubo un error: ${message}`);
  }
};

// Crear una función asíncrona para actualizar los datos de un estudiante en la base de datos.
const actualizarEstud = async (nombre, rut, curso, nivel) => {
  try {
    const res = await pool.query(
      `UPDATE estudiantes SET rut = $1, curso = $2, nivel = $3 WHERE nombre = $4 RETURNING *`,
      [rut, curso, nivel, nombre]
    );
    console.log(`Estudiante ${nombre} modificado con éxito`);
    console.log("Estudiante modificado: ", res.rows[0]);
  } catch (error) {
    const { status, message } = errors(error.code || error);
    console.log(`Hubo un error: ${message}`);
  }
};

//   nuevoEstudiante("Juan", "4444444-4", "1", 2);
//   consultaRut("2222222-3");
//   consultaEstudiante();
//   actualizarEstud("Juan", "3333333-2", "1", 2);

// Crear una función asíncrona para eliminar el registro de un estudiante de la base de datos.
const eliminarEstud = async (rut) => {
  try {
    const res = await pool.query(
      `DELETE FROM estudiantes WHERE rut = $1 RETURNING *`,
      [rut]
    );
    console.log(`Estudiante eliminado con éxito`);
    console.log("Estudiante eliminado: ", res.rows[0]);
  } catch (error) {
    const { status, message } = errors(error.code || error);
    console.log(`Hubo un error: ${message}`);
  }
};

// eliminarEstud("4444444-4");

const argumentos = process.argv.slice(2);
const funcion = argumentos[0];

switch (funcion) {
  case "nuevo":
    nuevoEstudiante(argumentos[1], argumentos[2], argumentos[3], argumentos[4]);
    break;
  case "rut":
    consultaRut(argumentos[1]);
    break;
  case "consulta":
    consultaEstudiante();
    break;
  case "editar":
    actualizarEstud(argumentos[1], argumentos[2], argumentos[3], argumentos[4]);
    break;
  case "eliminar":
    eliminarEstud(argumentos[1]);
    break;
  default:
    console.log("Función no encontrada");
}

// Instrucciones de uso:
// Ingresar nuevo estudiante: node always_music nuevo Andres 876543-3 2 3
// Consultar estudiante por rut: node always_music rut 876543-3
// Consultar todos los estudiantes: node always_music consulta
// Editar estudiante: node always_music editar Andres 3456789-0 2 3
// Eliminar estudiante: node always_music eliminar 83456789-0
