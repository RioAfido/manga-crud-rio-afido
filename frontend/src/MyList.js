import React, { useEffect, useState } from "react";
import { php } from "./api";

export default function MyList() {
    const [items, setItems] = useState([]);
    const [editing, setEditing] = useState(null); 

    async function load() {
        try {
        const resp = await php.get("/api.php?action=get");
        setItems(resp.data || []);
        } catch (err) {
        console.error("Error load MyList:", err);
        }
    }

    useEffect(() => {
        load();

        function onMangaAdded(e) {
        load();
        }

        window.addEventListener("mangaAdded", onMangaAdded);

        return () => {
        window.removeEventListener("mangaAdded", onMangaAdded);
        };
    }, []); 

    async function hapus(id) {
        if (!window.confirm("Yakin ingin menghapus data ini?")) return;
        try {
        await php.delete(`/api.php?action=delete&id=${id}`);
        load();
        } catch (err) {
        console.error("Error hapus:", err);
        alert("Gagal menghapus data");
        }
    }

    async function simpanPerubahan() {
        if (!editing) return;
        try {
        await php.put(`/api.php?action=update&id=${editing.id}`, editing);
        setEditing(null);
        load();
        } catch (err) {
        console.error("Error simpanPerubahan:", err);
        alert("Gagal menyimpan perubahan");
        }
    }

    return (
        <div>
        <h2>Daftar Manga Saya</h2>

        <div style={{ display: "grid", gap: 10 }}>
            {items.map(i => (
            <div key={i.id} style={{ display: "flex", gap: 12, padding: 8, border: "1px solid #eee", borderRadius: 6 }}>
                <img src={i.image_url || ""} alt={i.title} style={{ width: 90, height: 120, objectFit: "cover", borderRadius: 4 }} />
                <div style={{ flex: 1 }}>
                <strong>{i.title}</strong>
                <div style={{ fontSize: 13, color: "#666" }}>Status: {i.status} — Rating: {i.rating || "-"}</div>
                <p style={{ marginTop: 6 }}>{i.notes}</p>
                <div style={{ marginTop: 8 }}>
                    <button onClick={() => setEditing(i)}>Ubah</button>
                    <button onClick={() => hapus(i.id)} style={{ marginLeft: 8 }}>Hapus</button>
                </div>
                </div>
            </div>
            ))}
        </div>

        {/* Form edit sederhana */}
        {editing && (
            <div style={{ marginTop: 12, padding: 12, border: "1px solid #ddd", borderRadius: 6 }}>
            <h3>Ubah: {editing.title}</h3>

            <div style={{ marginBottom: 8 }}>
                <label>
                Status:
                <select value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value })} style={{ marginLeft: 8 }}>
                    <option value="plan_to_read">Rencana dibaca</option>
                    <option value="reading">Sedang dibaca</option>
                    <option value="completed">Selesai</option>
                    <option value="dropped">Dibatalkan</option>
                </select>
                </label>
            </div>

            <div style={{ marginBottom: 8 }}>
                <label>
                Rating:
                <input
                    type="number"
                    min="1"
                    max="10"
                    value={editing.rating ?? ""}
                    onChange={e => setEditing({ ...editing, rating: e.target.value ? parseInt(e.target.value) : null })}
                    style={{ marginLeft: 8, width: 80 }}
                />
                </label>
            </div>

            <div style={{ marginBottom: 8 }}>
                <label>
                Catatan:
                <br />
                <textarea value={editing.notes ?? ""} onChange={e => setEditing({ ...editing, notes: e.target.value })} style={{ width: "100%", minHeight: 80 }} />
                </label>
            </div>

            <div>
                <button onClick={simpanPerubahan}>Simpan</button>
                <button onClick={() => setEditing(null)} style={{ marginLeft: 8 }}>Batal</button>
            </div>
            </div>
        )}
        </div>
    );
}
