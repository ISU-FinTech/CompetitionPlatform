mod routes;
mod database;
mod auth;
mod models;
mod utils;
mod services;

use crate::routes::auth::{register, login};

use actix_cors::Cors;
use actix_web::{web, App, HttpServer, HttpResponse};
use actix_web::http::header;
use routes::competitions::{create_competition, get_competition, get_competitions, join_competition};
use routes::data::{get_hash, receive_and_process_udp_data};
use tokio::task;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Test");
    task::spawn(async {
        receive_and_process_udp_data().await;
    });

    HttpServer::new(|| {
        App::new()
            .wrap(
                Cors::default()
                    .allow_any_origin() 
                    .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"]) 
                    .allowed_headers(vec![header::AUTHORIZATION, header::CONTENT_TYPE]) 
                    .supports_credentials() 
                    .max_age(3600), 
            )
            .route("/", web::get().to(|| async { HttpResponse::Ok().body("CORS enabled!") })) 
            .service(register) 
            .service(login)
            .service(create_competition)
            .service(get_competitions)
            .service(join_competition)
            .service(get_competition)
            .service(get_hash)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
