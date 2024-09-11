import { useState } from "react";
import { api } from "~/lib/api/client";

export const s3 = {
  useUploadImage: () => {
    const [key, setKey] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const apiUtils = api.useUtils();
    const uploadMutation = api.media.uploadImage.useMutation();
    return {
      uploadedImageKey: key,
      isImageUploading: isUploading,
      /**
       * Uploads an image to S3.
       * @param file The file to upload. If not provided, a file picker will be shown.
       * @returns The key of the uploaded image.
       */
      async upload(file?: File): Promise<string | null> {
        const uploadFile = async (fileToUpload: File) => {
          setKey(null);
          setIsUploading(true);
          const uploadMeta = await uploadMutation.mutateAsync({
            fileId: fileToUpload.name,
          });
          const uploadRes = await fetch(uploadMeta.url, {
            method: "PUT",
            body: fileToUpload,
            headers: {
              "Content-Type": fileToUpload.type,
            },
          });
          if (uploadRes.status !== 200) {
            console.error("Failed to upload image");
            setIsUploading(false);
            return null;
          }
          await apiUtils.media.getImage.invalidate({
            fileKey: uploadMeta.key,
          });
          setKey(uploadMeta.key);
          setIsUploading(false);
          return uploadMeta.key;
        };
        if (file != null) {
          return uploadFile(file);
        }
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.click();
        return new Promise((res) => {
          input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file == null) return;
            const result = await uploadFile(file);
            res(result);
          };
        });
      },
    };
  },
  useDownloadImage: api.media.getImage.useQuery,
};
