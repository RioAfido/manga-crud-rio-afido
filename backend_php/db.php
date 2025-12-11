<?php
$host = "127.0.0.1";
$user = "root";         
$pass = "";             
$db   = "manga_db";     

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "error" => "Koneksi ke database gagal",
        "pesan" => $conn->connect_error
    ]);
    exit;
}

$conn->set_charset("utf8mb4");
?>