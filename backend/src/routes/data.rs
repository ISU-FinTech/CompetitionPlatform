use std::net::{SocketAddr, IpAddr, Ipv4Addr};

use actix_web::{get, HttpResponse, Responder};
use reqwest::Client;
use tokio::{sync::broadcast, net::UdpSocket};

#[get("/gethash")]
async fn get_hash() -> impl Responder {
    let url: &str = "http://localhost:3000/gethash";
    let client: Client = Client::new();

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

pub async fn receive_and_process_udp_data() {
    let multicast_ip: &str = "239.0.0.1";
    let port: u16 = 6000;

    let addr: SocketAddr = format!("{}:{}", multicast_ip, port).parse().unwrap();
    let socket: UdpSocket = UdpSocket::bind("0.0.0.0:0").await.unwrap();

    if let SocketAddr::V4(v4_addr) = addr {
        socket.join_multicast_v4(*v4_addr.ip(), "0.0.0.0".parse().unwrap()).unwrap();
    } else {
        eprintln!("Invalid address: expected IPv4 address.");
        return;
    }

    println!("Starting loop");

    let mut buf: Vec<u8> = vec![0u8; 1024]; 

    // Not reading anything

    loop {
        match socket.recv_from(&mut buf).await {
            Ok((len, _src)) => {
                let received_data = std::str::from_utf8(&buf[..len]).unwrap_or_default().to_string();
                println!("Received data: {}", received_data);
            }
            Err(err) => {
                eprintln!("Error receiving UDP message: {:?}", err);
            }
        }
    }
}


// Recieve data from multicast, process using hash and then use websocket to send to frontend



