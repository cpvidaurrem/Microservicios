mod models;
mod schema;

use actix_web::{web, App, HttpServer, HttpResponse, get};
use async_graphql::Schema;
use async_graphql::http::{playground_source, GraphQLPlaygroundConfig};
use async_graphql_actix_web::{GraphQLRequest, GraphQLResponse};
use schema::{QueryRoot, MutationRoot};
use std::sync::Mutex;
use models::Alumno;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let schema = Schema::build(QueryRoot, MutationRoot, async_graphql::EmptySubscription)
        .data(Mutex::new(Vec::<Alumno>::new()))
        .finish();

    println!("🚀 Servidor GraphQL corriendo en:");
    println!("   ▶ Playground: http://localhost:8000/");
    println!("   ▶ Endpoint  : http://localhost:8000/graphql");

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(schema.clone()))
            .service(web::resource("/graphql").route(web::post().to(graphql_handler)))
            .service(graphql_playground)
    })
    .bind(("127.0.0.1", 8000))?
    .run()
    .await
}

async fn graphql_handler(
    schema: web::Data<Schema<QueryRoot, MutationRoot, async_graphql::EmptySubscription>>,
    req: GraphQLRequest,
) -> GraphQLResponse {
    schema.execute(req.into_inner()).await.into()
}

#[get("/")]
async fn graphql_playground() -> HttpResponse {
    HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(playground_source(GraphQLPlaygroundConfig::new("/graphql")))
}
