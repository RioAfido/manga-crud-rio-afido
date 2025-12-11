import React, { useState } from "react";
import { jikan, php } from "./api";

export default function SearchManga() {
    const [q, setQ] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    async function search() {
        if (!q.trim()) {
        alert("Silakan masukkan kata kunci pencarian.");
        return;
        }

        setLoading(true);
        setResults([]);
        try {
        const resp = await jikan.get("/manga", { params: { q, limit: 12 } });
        setResults(resp.data?.data || []);
        } catch (err) {
        console.error("Error mencari Jikan:", err);
        alert("Terjadi kesalahan saat mencari. Coba lagi.");
        } finally {
        setLoading(false);
        }
    }

    async function tambah(item) {
        try {
        const payload = {
            manga_id: item.mal_id,
            title: item.title,
            image_url: item.images?.jpg?.image_url || null,
            status: "plan_to_read"
        };

        const resp = await php.post("/api.php?action=create", payload);

        const pesan = resp.data?.pesan || "Berhasil ditambahkan";
        const dataBaru = resp.data?.data || payload;

        alert(pesan + ": " + (dataBaru.title || payload.title));

        window.dispatchEvent(new CustomEvent("mangaAdded", { detail: dataBaru }));

        } catch (err) {
        console.error("Error menambah:", err);
        const msg = err.response?.data?.error || err.response?.data?.pesan || "Gagal menambah data";
        alert(msg);
        }
    }

    function onKeyDown(e) {
        if (e.key === "Enter") search();
    }

    return (
        <div>
        <h2>Cari Manga</h2>

        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Contoh: One Piece"
            style={{ flex: 1, padding: 8 }}
            />
            <button onClick={search} disabled={loading} style={{ padding: "8px 12px" }}>
            {loading ? "Mencari..." : "Cari"}
            </button>
        </div>

        <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 12
        }}>
            {results.map(m => (
            <div key={m.mal_id} style={{ border: "1px solid #ddd", padding: 8, borderRadius: 6 }}>
                <img
                src={m.images?.jpg?.image_url}
                alt={m.title}
                style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 4 }}
                />
                <div style={{ marginTop: 8 }}>
                <strong style={{ fontSize: 13 }}>{m.title}</strong>
                <div style={{ marginTop: 6 }}>
                    <button onClick={() => tambah(m)}>Tambah</button>
                </div>
                </div>
            </div>
            ))}
        </div>
        </div>
    );
    }