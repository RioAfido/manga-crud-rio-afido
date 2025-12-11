<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { 
    http_response_code(200); 
    exit; 
}

include "db.php";

$action = $_GET['action'] ?? null;
$input = json_decode(file_get_contents('php://input'), true);

function esc($conn, $v) { 
    return $v === null ? null : $conn->real_escape_string($v); 
}

/* GET — Ambil seluruh data manga */
if ($action === 'get') {
    $res = $conn->query("SELECT * FROM manga_list ORDER BY id DESC");
    $rows = [];
    while ($r = $res->fetch_assoc()) $rows[] = $r;

    echo json_encode($rows);
    exit;
}

/* CREATE — Tambah data */
if ($action === 'create' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $manga_id = esc($conn, $input['manga_id'] ?? null);
    $title    = esc($conn, $input['title'] ?? '');
    $image    = esc($conn, $input['image_url'] ?? null);
    $status   = esc($conn, $input['status'] ?? 'plan_to_read');

    if (trim($title) === '') { 
        http_response_code(400);
        echo json_encode(["error" => "Judul manga harus diisi"]);
        exit;
    }

    $sql = "INSERT INTO manga_list (manga_id, title, image_url, status) VALUES (" .
        ($manga_id === null ? "NULL" : "'$manga_id'") . ", '$title', " .
        ($image === null ? "NULL" : "'$image'") . ", '$status')";

    if ($conn->query($sql)) {
        $id = $conn->insert_id;
        $row = $conn->query("SELECT * FROM manga_list WHERE id = $id")->fetch_assoc();

        http_response_code(201);
        echo json_encode([
            "pesan" => "Manga berhasil ditambahkan",
            "data"  => $row
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "error" => "Gagal menambahkan data",
            "pesan" => $conn->error
        ]);
    }
    exit;
}

/* UPDATE — Edit data */
if ($action === 'update' && $_SERVER['REQUEST_METHOD'] === 'PUT') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(["error" => "ID tidak valid"]);
        exit;
    }

    $set = [];
    if (array_key_exists('title', $input))    $set[] = "title = '" . esc($conn, $input['title']) . "'";
    if (array_key_exists('image_url', $input)) $set[] = "image_url = '" . esc($conn, $input['image_url']) . "'";
    if (array_key_exists('status', $input))    $set[] = "status = '" . esc($conn, $input['status']) . "'";
    if (array_key_exists('rating', $input))    $set[] = "rating = " . (is_numeric($input['rating']) ? (int)$input['rating'] : "NULL");
    if (array_key_exists('notes', $input))     $set[] = "notes = '" . esc($conn, $input['notes']) . "'";

    if (empty($set)) {
        http_response_code(400);
        echo json_encode(["error" => "Tidak ada data yang diubah"]);
        exit;
    }

    $sql = "UPDATE manga_list SET " . implode(', ', $set) . " WHERE id = $id";

    if ($conn->query($sql)) {
        $row = $conn->query("SELECT * FROM manga_list WHERE id = $id")->fetch_assoc();
        echo json_encode([
            "pesan" => "Data berhasil diperbarui",
            "data"  => $row
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "error" => "Gagal memperbarui data",
            "pesan" => $conn->error
        ]);
    }
    exit;
}

/*  DELETE — Hapus data */
if ($action === 'delete' && $_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(["error" => "ID tidak valid"]);
        exit;
    }

    if ($conn->query("DELETE FROM manga_list WHERE id = $id")) {
        echo json_encode(["pesan" => "Data berhasil dihapus"]);
    } else {
        http_response_code(500);
        echo json_encode([
            "error" => "Gagal menghapus data",
            "pesan" => $conn->error
        ]);
    }
    exit;
}

http_response_code(400);
echo json_encode(["error" => "Aksi tidak dikenali"]);