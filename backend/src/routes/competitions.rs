use actix_web::{post, web, HttpResponse, Responder};
use serde_json::json;

use crate::models::competitions::{CompetitionId, CompetitionInfo, JoinInfo, UserId};
use crate::services;

#[post("/getcompetitions")]
async fn get_competitions(user_id: web::Json<UserId>) -> impl Responder {
    match services::competitions::get_competitions(user_id.into_inner()).await {
        Ok(competitions) => {
            let competition_list = competitions.into_iter().map(|competition| {
                json!({
                    "id": competition.id,
                    "name": competition.name,
                    "description": competition.description,
                    "code": competition.competition_code,
                    "initial_value": competition.initial_value,
                    "start_date": competition.start_date,
                    "end_date": competition.end_date,
                    "joined": competition.joined,
                })
            }).collect::<Vec<_>>();

            HttpResponse::Ok().json({
                json!({
                    "competitions": competition_list
                })
            })
        },
        Err(e) => {
            eprintln!("Error fetching competitions: {:?}", e);
            HttpResponse::InternalServerError().body("Failed to fetch competitions.")
        }
    }
}


#[post("/createcompetition")]
async fn create_competition(data: web::Json<CompetitionInfo>) -> impl Responder {
    println!("Received competition data: {:?}", data);

    match services::competitions::create_competition(data.into_inner()).await {
        Ok(competition_info) => {
            HttpResponse::Ok().json({
                json!({
                    "competition": {
                        "id": competition_info.id,
                        "name": competition_info.name,
                        "description": competition_info.description,
                        "code": competition_info.competition_code,
                        "initial_value": competition_info.initial_value,
                        "start_date": competition_info.start_date,
                        "end_date": competition_info.end_date
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

#[post("/joincompetition")]
async fn join_competition(data: web::Json<JoinInfo>) -> impl Responder {
    println!("Recieved join info: {:?}", data);

    match services::competitions::join_competition(data.into_inner()).await {
        Ok(info) => {
            HttpResponse::Ok().json({
                json!({
                    "joined": {
                        "user_id": info.user_id,
                        "competition_id": info.competition_id,
                        "is_active": info.is_active
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

#[post("/getcompetition")]
async fn get_competition(data: web::Json<CompetitionId>) -> impl Responder {
    println!("Recieved: {:?}", data);

    match services::competitions::get_competition(data.into_inner()).await {
        Ok(competition_info) => {
            HttpResponse::Ok().json({
                json!({
                    "competition": {
                        "id": competition_info.id,
                        "name": competition_info.name,
                        "description": competition_info.description,
                        "code": competition_info.competition_code,
                        "initial_value": competition_info.initial_value,
                        "start_date": competition_info.start_date,
                        "end_date": competition_info.end_date
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
