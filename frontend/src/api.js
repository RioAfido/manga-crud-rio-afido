import axios from "axios";

export const php = axios.create({
    baseURL: "http://localhost/manga-crud-api"
});

export const jikan = axios.create({
    baseURL: "https://api.jikan.moe/v4"
});