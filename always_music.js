const { Pool } = require("pg");
// importo del modulo handleErrors la funcion que maneja los errores
const handleErrors = require("./handleErrors.js");

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



const argumentos = process.argv.slice(2);
const comando = argumentos[0];
const rut = argumentos[1];
const nombre = argumentos[2];
const curso = argumentos[3];
const nivel = argumentos[4];

//Crear funcion para registrar estudiantes
const nuevoEstudiante = async ({rut, nombre, curso, nivel}) => {
  // console.log(rut, nombre, curso, nivel);
  if (!rut || !nombre || !curso || !nivel) {
    const message =
      "No se proporcionaron todos los datos necesarios para registrar al estudiante";
    console.log(`Hubo un error: ${message}`);
    return { status: 400, message };
  }

  try {
    const res = await pool.query(
      `INSERT INTO estudiantes (rut, nombre, curso, nivel) VALUES ($1, $2, $3, $4) RETURNING *`,
      [rut, nombre, curso, nivel]
    );
    console.log(`Estudiante ${nombre} agregado con éxito`);
    console.log("Estudiante agregado: ", res.rows[0]);
  } catch (error) {
    const { status, message } = handleErrors(error.code || error);
    console.log(`Hubo un error: ${message}`);
    return { status, message };
  }};
  
// Crear una función asíncrona para obtener por consola el registro de un estudiante por medio de su rut
const consultaRut = async ({rut}) => {
  if (!rut) {
    const message = "No se proporcionó el rut del estudiante para consultar";
    console.log(`Hubo un error: ${message}`);
    return { status: 400, message };
  }

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
    const { status, message } = handleErrors(error.code || error);
    console.log(`Hubo un error: ${message}`);
    return { status, message };
  }
};

//Crear funcion para consultar tabla
const consultaEstudiante = async () => {
  try {
    const estudiantes = await pool.query("SELECT * FROM estudiantes");
    console.log(estudiantes.rows);
  } catch (error) {
    const { status, message } = handleErrors(error.code || error);
    console.log(`Hubo un error: ${message}`);
    return { status, message };
  }
};

// Crear una función asíncrona para actualizar los datos de un estudiante en la base de datos.
const actualizarEstudiante = async ({rut, nombre, curso, nivel}) => {
  try {
    const res = await pool.query(
      `UPDATE estudiantes SET nombre = $2, curso = $3, nivel = $4 WHERE rut = $1 RETURNING *`,
      [rut, nombre, curso, nivel]
    );
    if (res.rows.length === 0) {
      console.log(`No se encontró ningún estudiante con el rut ${rut}`);
    } else {
      console.log(`Estudiante con rut: ${rut} actualizado con éxito`);
      console.log("Estudiante actualizado:", res.rows[0]);
    }
  } catch (error) {
    const { status, message } = handleErrors(error.code || error);
    console.log(`Hubo un error: ${message}`);
    return { status, message };
  }
};

//   nuevoEstudiante("Juan", "4444444-4", "1", 2);
//   consultaRut("2222222-3");
//   consultaEstudiante();
//   actualizarEstud("Juan", "3333333-2", "1", 2);

// Crear una función asíncrona para eliminar el registro de un estudiante de la base de datos.
const eliminarEstudiante = async ({rut}) => {
  try {
    const res = await pool.query(
      `DELETE FROM estudiantes WHERE rut = $1 RETURNING *`,
      [rut]
    );
    if (res.rows.length === 0) {
      console.log(`No se encontró ningún estudiante con el rut ${rut}`);
    } else {
      console.log(`Estudiante con rut ${rut} eliminado con éxito`);
      console.log("Estudiante eliminado:", res.rows[0]);
    }
  } catch (error) {
    const { status, message } = handleErrors(error.code || error);
    console.log(`Hubo un error: ${message}`);
    return { status, message };
  }
};

// eliminarEstud("4444444-4");


switch (comando) {
  case "nuevo":
    nuevoEstudiante({rut, nombre, curso, nivel});
    break;
  case "rut":
    consultaRut({rut});
    break;
  case "consulta":
    consultaEstudiante();
    break;
  case "editar":
    actualizarEstudiante({rut, nombre, curso, nivel});
    break;
  case "eliminar":
    eliminarEstudiante({rut});
    break;
  default:
    console.log("Función no encontrada");
}

// Instrucciones de uso:
// Ingresar nuevo estudiante: node always_music nuevo 123456-7 Julian 2 3
// Consultar estudiante por rut: node always_music rut 876543-3
// Consultar todos los estudiantes: node always_music consulta
// Editar estudiante: node always_music editar Andres 3456789-0 2 3
// Eliminar estudiante: node always_music eliminar 83456789-0