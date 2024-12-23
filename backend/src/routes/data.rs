use actix_web::{get, HttpResponse, Responder};
use reqwest::Client;

#[get("/gethash")]
async fn get_hash() -> impl Responder {
    let url: &str = "http://localhost:3000/gethash";
    let client = Client::new();

    match client.get(url).send().await {
        Ok(response) => {
            if response.status().is_success() {
                match response.text().await {
                    Ok(body) => HttpResponse::Ok().body(body),
                    Err(err) => {
                        eprintln!("Failed to read response body: {:?}", err);
                        HttpResponse::InternalServerError().body("Failed to read response body.")
                    }
                }
            } else {
                eprintln!("Request failed with status: {}", response.status());
                HttpResponse::InternalServerError()
                    .body(format!("Request failed with status: {}", response.status()))
            }
        }
        Err(err) => {
            eprintln!("Error sending request: {:?}", err);
            HttpResponse::InternalServerError().body("Failed to fetch data from the server.")
        }
    }
}

