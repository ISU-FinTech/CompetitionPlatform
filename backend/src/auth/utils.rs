use sqlx::MySqlPool;
use std::sync::Arc;
use std::env;
use dotenvy::dotenv;
use argon2::{self, Config};
use std::io::Error;

pub async fn get_db_conn() -> Result<Arc<MySqlPool>, std::io::Error> {
    dotenv().ok();
    let database_url: String = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    let pool = match MySqlPool::connect(&database_url).await {
        Ok(pool) => {
            println!("✅ Successfully connected to the database!");
            Arc::new(pool)
        }
        Err(e) => {
            eprintln!("❌ Failed to connect to the database: {:?}", e);
            return Err(std::io::Error::new(std::io::ErrorKind::Other, "Database connection failed"));
        }
    };

    Ok(pool)
}

pub async fn hash_password(password: &str) -> Result<String, Error> {
    let salt: &[u8; 10] = b"akjbdjfakj";
    let config: Config<'_> = Config::default();
    let hash: String = argon2::hash_encoded(password.as_bytes(), salt, &config).unwrap();
    Ok(hash.to_string())
}

pub async fn verify_password(password: &str, hash: &str) -> bool {
    argon2::verify_encoded(&hash, password.as_bytes()).unwrap()
}

pub async fn generate_token(user_id: i32) -> String {
    format!("dummy_token_{}", user_id)
}





