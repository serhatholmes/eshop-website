import { v2 as cloudinary } from "cloudinary";

const url = process.env.CLOUDINARY_URL;

if (!url) {
  console.warn("CLOUDINARY_URL is not set. Image uploads will fail.");
}

cloudinary.config({
  secure: true,
});

export { cloudinary };
