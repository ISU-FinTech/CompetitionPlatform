use crate:: models::user::{RegisterData, UserInfo};
use crate::auth::utils::{get_db_conn, hash_password};
use sqlx::{MySql, Pool};
use std::sync::Arc;

pub async fn register(data: RegisterData) -> Result<UserInfo, sqlx::Error> {
    let hashed_password: String = hash_password(&data.password).await?;

    let pool: Arc<Pool<MySql>> = get_db_conn().await?;

    let insert_stmt = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";

    let mut conn: sqlx::pool::PoolConnection<MySql> = pool.acquire().await?;

    let id: u64 = sqlx::query(insert_stmt)
        .bind(&data.username)
        .bind(&data.email)
        .bind(&hashed_password)
        .bind(&data.role)
        .execute(&mut *conn)
        .await?
        .last_insert_id();

    println!("User registered successfully!");

    let id_i32: i32 = id as i32;

    Ok(UserInfo {
        id: id_i32,
        username: data.username,
        email: data.email,
        role: data.role,
    })
}




