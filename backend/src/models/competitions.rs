use serde::Deserialize;
use sqlx::FromRow;

#[derive(Deserialize, Debug, FromRow)]
pub struct CompetitionInfo {
    pub id: Option<u64>,
    pub name: String,
    pub description: String,
    pub competition_code: Option<i32>,
    pub initial_value: i64,
    pub start_date: String,
    pub end_date: String,
    pub joined: Option<bool>
}

#[derive(Deserialize, Debug, FromRow)]
pub struct JoinInfo {
    pub user_id: u16,
    pub competition_id: u64,
    pub is_active: bool,
}

#[derive(Deserialize, Debug)]
pub struct UserId {
    pub user_id: u32,
}

#[derive(Deserialize, Debug, FromRow)]
pub struct CompetitionId {
    pub competition_id: u64
}
