-- Crear DATABASE
create DATABASE always_music;

-- Conectar a base de datos
\c always_music;

-- Crear tabla
CREATE TABLE estudiantes (
    nombre VARCHAR(255) NOT NULL,
    rut VARCHAR (20) PRIMARY KEY,
    curso VARCHAR(255) NOT NULL,
    nivel INT
);



