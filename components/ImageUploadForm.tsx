"use client";

import React, { FormEvent } from "react";

type ImageResponse = {
  id: string;
  name: string;
  signedUrl: string;
};

export default function ImageUploadForm() {
  const [uploadedImage, setUploadedImage] = React.useState<ImageResponse>({
    id: "",
    signedUrl: "",
    name: "",
  });
  const ref = React.useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = ref.current!;

    const toBase64 = (file: File) => {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();

        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
          resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
          reject(error);
        };
      });
    };

    const base64 = await toBase64(input.files![0] as File);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: JSON.stringify({
        base64,
        name: input.files![0].name,
        type: input.files![0].type,
      }),
    });

    const { signedUrl, name, id } = await res.json();

    setUploadedImage({ signedUrl, name, id });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" ref={ref} />
        <button
          type="submit"
          className="px-2 py-1 rounded-md bg-violet-50 text-violet-500"
        >
          Upload
        </button>

        {uploadedImage.signedUrl.length > 0 && (
          <img src={uploadedImage.signedUrl} />
        )}
      </form>
    </>
  );
}
