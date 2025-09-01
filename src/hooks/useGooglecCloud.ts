import { Storage } from "@google-cloud/storage";
import fs from 'fs/promises';

const credentials = JSON.parse(process.env.GCS_SERVICE_ACCOUNT);

const storage = new Storage({
  projectId: credentials.project_id, // Agregar manualmente el project_id
  credentials,
});

const bucketName = process.env.GCS_BUCKET_NAME;
const bucket = storage.bucket(bucketName);

export const useGooglecCloud = () => {
  const uploadPDF = async (pdfBase64, ubication, fileName) => {
    try {
      const buffer = Buffer.from(pdfBase64, "base64");
      const destination = `pdf/${ubication}/${fileName}.pdf`;
      const file = bucket.file(destination);

      // Elimina el archivo si ya existe (opcional)
      const [exists] = await file.exists();
      if (exists) {
        await file.delete();
      }

      // Guarda el nuevo archivo (lo sobrescribe de todas formas si no haces delete)
      await file.save(buffer, {
        metadata: { contentType: "application/pdf" },
      });

      await file.getSignedUrl({
        action: "read",
        expires: "03-01-2500",
      });

      const publicUrl = `https://storage.googleapis.com/${bucketName}/${destination}`;
      return publicUrl;
    } catch (error) {
      console.error("Error al subir PDF:", error);
      throw error;
    }
  };
  const uploadImage = async (folder, image, ubication, fileName) => {
    try {
      const buffer = await fs.readFile(image.filepath);
      const destination = `${folder}/${ubication}/${fileName}.png`;
      const file = bucket.file(destination);

      // Elimina el archivo si ya existe (opcional)
      const [exists] = await file.exists();
      if (exists) {
        await file.delete();
      }

      // Guarda el nuevo archivo (lo sobrescribe de todas formas si no haces delete)
      await file.save(buffer, {
        metadata: { contentType: "image/png" },
        resumable: false, // recomendable para archivos pequeños
        public: true      // lo hace accesible públicamente
      });

      await file.getSignedUrl({
        action: "read",
        expires: "03-01-2500",
      });

      const publicUrl = `https://storage.googleapis.com/${bucketName}/${destination}`;
      return publicUrl;
    } catch (error) {
      console.error("Error al subir PDF:", error);
      throw error;
    }
  };
  return { uploadPDF, uploadImage };
};
