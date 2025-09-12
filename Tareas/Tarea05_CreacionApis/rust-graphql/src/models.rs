use async_graphql::{SimpleObject, InputObject};

#[derive(SimpleObject, Clone)]
pub struct Alumno {
    pub nombres: String,
    pub apellidos: String,
    pub sexo: String,
    pub casado: bool,
    pub fecha_nacimiento: String, 
    pub materias: Vec<String>,
}

# [derive(InputObject)]
pub struct AlumnoInput {
    pub nombres: String,
    pub apellidos: String,
    pub sexo: String,
    pub casado: bool,
    pub fecha_nacimiento: String,
    pub materias: Vec<String>,
}
