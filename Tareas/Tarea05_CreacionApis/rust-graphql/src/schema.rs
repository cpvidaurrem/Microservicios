use async_graphql::{Context, Object};
use std::sync::Mutex;

use crate::models::{Alumno, AlumnoInput};

pub struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn alumnos(&self, ctx: &Context<'_>) -> Vec<Alumno> {
        let data = ctx.data::<Mutex<Vec<Alumno>>>().unwrap();
        data.lock().unwrap().clone()
    }

    async fn alumno(&self, ctx: &Context<'_>, nombres: String) -> Option<Alumno> {
        let data = ctx.data::<Mutex<Vec<Alumno>>>().unwrap();
        let list = data.lock().unwrap();
        list.iter().find(|a| a.nombres == nombres).cloned()
    }
}

pub struct MutationRoot;

#[Object]
impl MutationRoot {
    async fn add_alumno(&self, ctx: &Context<'_>, input: AlumnoInput) -> Alumno {
        let alumno = Alumno {
            nombres: input.nombres,
            apellidos: input.apellidos,
            sexo: input.sexo,
            casado: input.casado,
            fecha_nacimiento: input.fecha_nacimiento,
            materias: input.materias,
        };

        let mut data = ctx.data::<Mutex<Vec<Alumno>>>().unwrap().lock().unwrap();
        data.push(alumno.clone());
        alumno
    }

    async fn edit_alumno(
        &self, 
        ctx: &Context<'_>, 
        index: usize, 
        input: AlumnoInput
    ) -> Option<Alumno> {
        let mut data = ctx.data::<Mutex<Vec<Alumno>>>().unwrap().lock().unwrap();
        if let Some(alumno) = data.get_mut(index) {
            alumno.nombres = input.nombres;
            alumno.apellidos = input.apellidos;
            alumno.sexo = input.sexo;
            alumno.casado = input.casado;
            alumno.fecha_nacimiento = input.fecha_nacimiento;
            alumno.materias = input.materias;
            return Some(alumno.clone());
        }
        None
    }

    async fn delete_alumno(
        &self, 
        ctx: &Context<'_>, 
        index: usize
    ) -> bool {
        let mut data = ctx.data::<Mutex<Vec<Alumno>>>().unwrap().lock().unwrap();
        if index < data.len() {
            data.remove(index);
            return true;
        }
        false
    }
}

