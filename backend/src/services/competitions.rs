use crate::auth::utils::get_db_conn;
use crate::models::competitions::{CompetitionId, CompetitionInfo, JoinInfo, UserId};
use rand::Rng;
use sqlx::{MySql, Pool};
use std::error::Error;
use std::sync::Arc;

pub async fn get_competitions(user_id: UserId) -> Result<Vec<CompetitionInfo>, Box<dyn Error>> {
    let pool: Arc<Pool<MySql>> = get_db_conn().await?;

    let stmt = format!(
        "SELECT 
            c.id,
            c.name,
            c.description,
            c.competition_code,
            c.initial_value,
            c.start_date,
            c.end_date,
            CASE 
                WHEN comp.user_id IS NOT NULL THEN true
                ELSE false
            END AS joined
        FROM 
            competitions c
        LEFT JOIN 
            competitors comp
        ON 
            c.id = comp.competition_id AND comp.user_id = ?"
    );

    let mut conn: sqlx::pool::PoolConnection<MySql> = pool.acquire().await?;

    let competitions: Vec<CompetitionInfo> = sqlx::query_as::<_, CompetitionInfo>(&stmt)
        .bind(&user_id.user_id)
        .fetch_all(&mut *conn)
        .await?;

    Ok(competitions)
}

pub async fn create_competition(data: CompetitionInfo) -> Result<CompetitionInfo, Box<dyn Error>> {
    let competition_code: i32 = rand::thread_rng().gen_range(1000..9999);

    let pool: Arc<Pool<MySql>> = get_db_conn().await?;

    let insert_stmt: &str = "INSERT INTO competitions (name, description, competition_code, initial_value, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)";

    let mut conn: sqlx::pool::PoolConnection<MySql> = pool.acquire().await?;

    let id: u64 = sqlx::query(insert_stmt)
        .bind(&data.name)
        .bind(&data.description)
        .bind(competition_code)
        .bind(data.initial_value)
        .bind(&data.start_date)
        .bind(&data.end_date)
        .execute(&mut *conn)
        .await?
        .last_insert_id();

    Ok(CompetitionInfo {
        id: Some(id),
        name: data.name.to_owned(),
        description: data.description.to_owned(),
        competition_code: Some(competition_code),
        initial_value: data.initial_value.to_owned(),
        start_date: data.start_date.to_owned(),
        end_date: data.end_date.to_owned(),
        joined: Some(false),
    })
}

pub async fn join_competition(data: JoinInfo) -> Result<JoinInfo, Box<dyn Error>> {
    let pool: Arc<Pool<MySql>> = get_db_conn().await?;

    let insert_stmt: &str =
        "INSERT INTO competitors (user_id, competition_id, is_active) VALUES (?, ?, ?)";

    let mut conn: sqlx::pool::PoolConnection<MySql> = pool.acquire().await?;

    sqlx::query(insert_stmt)
        .bind(&data.user_id)
        .bind(&data.competition_id)
        .bind(&data.is_active)
        .execute(&mut *conn)
        .await?;

    Ok(JoinInfo {
        user_id: data.user_id,
        competition_id: data.competition_id,
        is_active: data.is_active,
    })
}

pub async fn get_competition(data: CompetitionId) -> Result<CompetitionInfo, Box<dyn Error>> {
    let pool: Arc<Pool<MySql>> = get_db_conn().await?;

    let stmt = "
    SELECT 
        c.id,
        c.name,
        c.description,
        c.competition_code,
        c.initial_value,
        c.start_date,
        c.end_date,
        true AS joined 
    FROM Competitions c
    WHERE c.id = ?";

    let mut conn = pool.acquire().await?;

    let competition: CompetitionInfo = sqlx::query_as::<_, CompetitionInfo>(stmt)
        .bind(data.competition_id)
        .fetch_one(&mut *conn)
        .await?;

    Ok(competition)
}
