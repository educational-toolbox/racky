"use client";

import { UploadCloudIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { s3 } from "~/hooks/use-s3";

export default function MediaExamplePage() {
  const [imageKey, setImageKey] = useState<string | null>(null);
  const { data, isLoading } = s3.useDownloadImage(
    { fileKey: imageKey! },
    {
      enabled: imageKey != null,
    }
  );
  const uploader = s3.useUploadImage();
  return (
    <>
      {isLoading ? (
        "Loading..."
      ) : data != null ? (
        <Image width={1920} height={1080} src={data} alt="Uploaded icon" />
      ) : null}
      <Button onClick={() => uploader.upload().then((key) => setImageKey(key))}>
        <UploadCloudIcon />
        Upload image
      </Button>
    </>
  );
}
