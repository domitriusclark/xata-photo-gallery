import ImageUploadForm from "@/components/ImageUploadForm";
import { getXataClient, ImagesRecord } from "@/lib/xata.codegen";

type Image = {
  signedUrl: string;
  name: string;
};

export default async function Home() {
  const xata = getXataClient();
  const res = await xata.db.images
    .select(["attachment", "attachment.name", "attachment.signedUrl"])
    .getAll();

  let images: Image[] = [];

  res.map((image) => {
    // @ts-expect-error
    const { signedUrl, name } = image.attachment?.transform({
      height: 75,
    });

    images.push({ signedUrl, name });
  });

  return (
    <main className="flex flex-col items-center justify-around min-h-screen p-24">
      <ImageUploadForm />

      <div className="flex flex-wrap justify-center gap-3">
        {images.map((image) => (
          <img key={image.signedUrl} src={image.signedUrl} alt={image.name} />
        ))}
      </div>
    </main>
  );
}

export const dynamic = "force-dynamic";
