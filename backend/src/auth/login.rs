use sqlx::{Pool, MySql, Row};
use std::sync::Arc;
use crate::auth::utils::{get_db_conn, verify_password, generate_token};
use crate::models::user::{LoginData, UserInfo};

pub async fn login(data: LoginData) -> Result<UserInfo, sqlx::Error> {
    let pool: Arc<Pool<MySql>> = get_db_conn().await?;

    let select_stmt: &str = "SELECT id, email, username, role, password FROM users WHERE email = ? OR username = ?";

    let mut conn: sqlx::pool::PoolConnection<MySql> = pool.acquire().await?;

    let row: Result<sqlx::mysql::MySqlRow, sqlx::Error> = sqlx::query(select_stmt)
        .bind(&data.name)
        .bind(&data.name)
        .fetch_one(&mut *conn)
        .await;

    let row: sqlx::mysql::MySqlRow = match row {
        Ok(row) => row,
        Err(_) => {
            eprintln!("User not found for: {}", &data.name);
            return Err(sqlx::Error::RowNotFound);
        }
    };

    let hashed_password: String = row.get("password");
    let id: i32 = row.get("id");
    let email: String = row.get("email");
    let username: String = row.get("username");
    let role: String = row.get("role");

    let is_password_valid: bool = verify_password(&data.password, &hashed_password).await;

    if !is_password_valid {
        eprintln!("Invalid password for user: {}", &data.name);
        return Err(sqlx::Error::RowNotFound);
    }

    //let token: String = generate_token(user_id).await;

    println!("User logged in successfully: {}", &data.name);

    Ok(UserInfo { email, username, role, id })
}
