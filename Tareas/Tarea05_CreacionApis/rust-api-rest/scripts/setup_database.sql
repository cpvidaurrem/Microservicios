-- Ejecutar en phpMyAdmin o cliente MySQL
CREATE DATABASE IF NOT EXISTS alumnos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE alumnos_db;

-- Crear tabla de alumnos
CREATE TABLE IF NOT EXISTS alumnos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    edad INT NOT NULL CHECK (edad >= 16 AND edad <= 65),
    carrera VARCHAR(100) NOT NULL,
    semestre INT NOT NULL CHECK (semestre >= 1 AND semestre <= 10),
    promedio DOUBLE DEFAULT 0.00 CHECK (promedio >= 0.00 AND promedio <= 10.00),  
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_carrera (carrera),
    INDEX idx_activo (activo),
    INDEX idx_fecha_registro (fecha_registro)
);

-- Insertar datos de prueba
INSERT INTO alumnos (nombre, apellido, email, edad, carrera, semestre, promedio) VALUES
('Andrés', 'Mendoza', 'andres.mendoza@email.com', 25, 'Ingeniería en Sistemas', 9, 8.3),
('Valeria', 'Castro', 'valeria.castro@email.com', 18, 'Ingeniería Industrial', 1, 9.1),
('Diego', 'Fernández', 'diego.fernandez@email.com', 27, 'Ingeniería Civil', 10, 7.9),
('Carolina', 'Morales', 'carolina.morales@email.com', 21, 'Ingeniería Mecánica', 5, 8.6),
('Javier', 'Rojas', 'javier.rojas@email.com', 23, 'Ingeniería en Sistemas', 7, 7.4),
('Natalia', 'Ortiz', 'natalia.ortiz@email.com', 19, 'Ingeniería Industrial', 2, 9.4),
('Ricardo', 'Vargas', 'ricardo.vargas@email.com', 28, 'Ingeniería Civil', 8, 6.9),
('Fernanda', 'Silva', 'fernanda.silva@email.com', 20, 'Ingeniería Mecánica', 3, 8.8),
('Hugo', 'Gutiérrez', 'hugo.gutierrez@email.com', 26, 'Ingeniería en Sistemas', 9, 7.7),
('Patricia', 'Reyes', 'patricia.reyes@email.com', 22, 'Ingeniería Industrial', 6, 9.0),
('Mauricio', 'Flores', 'mauricio.flores@email.com', 24, 'Ingeniería Civil', 7, 8.2),
('Isabel', 'Jiménez', 'isabel.jimenez@email.com', 19, 'Ingeniería Mecánica', 2, 9.3),
('Oscar', 'Herrera', 'oscar.herrera@email.com', 21, 'Ingeniería en Sistemas', 5, 7.8),
('Camila', 'Aguilar', 'camila.aguilar@email.com', 23, 'Ingeniería Industrial', 8, 8.5),
('Felipe', 'Navarro', 'felipe.navarro@email.com', 20, 'Ingeniería Civil', 4, 7.6),
('Gabriela', 'Mejía', 'gabriela.mejia@email.com', 22, 'Ingeniería Mecánica', 6, 9.2),
('Raúl', 'Paredes', 'raul.paredes@email.com', 25, 'Ingeniería en Sistemas', 10, 8.0),
('Daniela', 'Cruz', 'daniela.cruz@email.com', 18, 'Ingeniería Industrial', 1, 9.5),
('Martín', 'Suárez', 'martin.suarez@email.com', 27, 'Ingeniería Civil', 9, 7.1),
('Lucía', 'Peralta', 'lucia.peralta@email.com', 21, 'Ingeniería Mecánica', 5, 8.9);

SELECT 'Base de datos configurada correctamente' AS mensaje;