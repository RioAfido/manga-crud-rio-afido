import React, { useEffect, useState } from "react";
import { php } from "./api";

export default function MyList() {
    const [items, setItems] = useState([]);
    const [editing, setEditing] = useState(null);

    async function load() {
        const resp = await php.get("/api.php?action=get");
        setItems(resp.data || []);
    }

    useEffect(() => {
        load();
        window.addEventListener("mangaAdded", load);
        return () => window.removeEventListener("mangaAdded", load);
    }, []);

    async function hapus(id) {
        if (!window.confirm("Yakin ingin menghapus data ini?")) return;
        await php.delete(`/api.php?action=delete&id=${id}`);
        load();
    }

    async function simpan() {
        await php.put(`/api.php?action=update&id=${editing.id}`, editing);
        setEditing(null);
        load();
    }

    return (
        <div>
        <h2>Daftar Manga Saya</h2>

        <div className="list-wrapper">
            {items.map((i) => (
            <div key={i.id} className="list-item">
                <img src={i.image_url || ""} alt={i.title} />
                <div className="list-content">
                <strong>{i.title}</strong>
                <div className="list-meta">
                    Status: {i.status} | Rating: {i.rating || "-"}
                </div>
                <p>{i.notes}</p>

                <div className="list-btn">
                    <button onClick={() => setEditing(i)}>Ubah</button>
                    <button onClick={() => hapus(i.id)}>Hapus</button>
                </div>
                </div>
            </div>
            ))}
        </div>

        {editing && (
            <div className="edit-form">
            <h3>Edit Manga</h3>

            <select
                value={editing.status}
                onChange={(e) =>
                setEditing({ ...editing, status: e.target.value })
                }
            >
                <option value="plan_to_read">Rencana dibaca</option>
                <option value="reading">Sedang dibaca</option>
                <option value="completed">Selesai</option>
                <option value="dropped">Tidak Lanjut</option>
            </select>

            <input
                type="number"
                min="1"
                max="10"
                value={editing.rating || ""}
                onChange={(e) =>
                setEditing({
                    ...editing,
                    rating: e.target.value ? parseInt(e.target.value) : null
                })
                }
            />

            <textarea
                value={editing.notes || ""}
                onChange={(e) =>
                setEditing({ ...editing, notes: e.target.value })
                }
            />

            <div className="edit-actions">
                <button onClick={simpan}>Simpan</button>
                <button onClick={() => setEditing(null)}>Batal</button>
                </div>
            </div>
        )}
        </div>
    );
}