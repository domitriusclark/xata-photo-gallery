import { NextResponse } from "next/server";
import { getXataClient } from "@/lib/xata.codegen";

export const POST = async (req: Request) => {
  const xata = getXataClient();

  const { name, type, base64 } = await req.json();

  const decoded = Buffer.from(
    base64.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  const image = await xata.db.images.create({
    attachment: {
      name: name,
      mediaType: type,
      base64Content: decoded.toString("base64"),
    },
  });

  const uploaded = await xata.db.images
    .select(["attachment", "attachment.signedUrl"])
    .filter({
      id: image.id,
    })
    .getFirst();

  // @ts-expect-error
  const { signedUrl } = uploaded?.attachment?.transform({
    height: 100,
    quality: 70,
  });

  return NextResponse.json({
    signedUrl,
    id: image.id,
    name: image.attachment?.name,
  });
};
