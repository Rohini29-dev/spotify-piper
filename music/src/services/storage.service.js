import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function uploadFile(file, folder = "songs") {
    const uploadDir = path.join(process.cwd(), "uploads", folder);

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const extension = path.extname(file.originalname);

    const fileName = `${uuidv4()}${extension}`;

    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, file.buffer);

    return {
        url: `/uploads/${folder}/${fileName}`,
        key: fileName
    };
}