use serde::Deserialize;

#[derive(Deserialize, Debug)]
pub struct RegisterData {
    pub username: String,
    pub email: String,
    pub password: String,
    pub role: String,
}

#[derive(Deserialize, Debug)]
pub struct LoginData {
    pub name: String,
    pub password: String,
}

#[derive(Deserialize, Debug)]
pub struct UserInfo {
    pub id: i32,
    pub username: String,
    pub email: String,
    pub role: String,
}
