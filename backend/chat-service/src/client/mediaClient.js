import FormData from "form-data";
import httpClient from './axios.js';

export const uploadFile = async (file) => {
    if (!file) {
        return '';
    }

    const formData = new FormData();

    formData.append("file", file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
        knownLength: file.size
    });

    const response = await httpClient.post("/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

    return response;
}

export const uploadFiles = async (files) => {
    if (!files || files.length === 0) {
        return [];
    }

    const formData = new FormData();

    for (const file of files) {
        formData.append("file", file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype,
            knownLength: file.size,
        });
    }

    const response = await httpClient.post("/upload/more", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return response;
};

export const deleteFile = async (url) => {
    const response = await httpClient.delete("/upload",  { params: { url } }, {
        headers: {
            "Content-Type": "application/json"
        }
    });

    return response;
};
