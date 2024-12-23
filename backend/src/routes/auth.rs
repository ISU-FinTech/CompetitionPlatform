use actix_web::{post, web, HttpResponse, Responder};
use serde_json::json;

use crate::models::user::{RegisterData, LoginData};
use crate::auth;

#[post("/register")]
async fn register(data: web::Json<RegisterData>) -> impl Responder {
    println!("Received registration data: {:?}", data);

    match auth::register::register(data.into_inner()).await {
        Ok(user_info) => {
            HttpResponse::Ok().json({
                json!({
                    "user": {
                        "id": user_info.id,
                        "email": user_info.email,
                        "username": user_info.username,
                        "role": user_info.role,
                    }
                })
            })
        },
        Err(e) => {
            eprintln!("Error registering user: {:?}", e);
            HttpResponse::InternalServerError().body("Failed to register user.")
        }
    }
}

#[post("/login")]
async fn login(data: web::Json<LoginData>) -> impl Responder {
    println!("Received login data: {:?}", data);

    match auth::login::login(data.into_inner()).await {
        Ok(user_info) => {
            HttpResponse::Ok().json({
                json!({
                    "user": {
                        "id": user_info.id,
                        "email": user_info.email,
                        "username": user_info.username,
                        "role": user_info.role,
                    }
                })
            })
        },
        Err(e) => {
            eprintln!("Error logging in user: {:?}", e);
            HttpResponse::InternalServerError().body("Failed to login user.")
        }
    }
}
