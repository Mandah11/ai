import { InferenceClient, objectDetection } from "@huggingface/inference";
import { NextRequest, NextResponse } from "next/server";

const HF_TOKEN = process.env.NEW_PUBLIC_HF_TOKEN || process.env.HF_TOKEN;
const inference = new InferenceClient(HF_TOKEN || "");

type DetectionResult = {
  label: string;
  score: number;
};

export const POST = async (request: NextRequest) => {
  console.log(HF_TOKEN, "HF_TOKEN2");
  try {
    const formdata = await request.formData();
    const image = formdata.get("image") as File;
    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const results = (await inference.objectDetection({
      model: "facebook/detr-resnet-50",
      data: image,
    })) as DetectionResult[];

    const objects = results
      .filter((obj) => obj.score > 0.7)
      .map((obj) => ({ label: obj.label, score: obj.score }));

    return NextResponse.json({ objects });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
};
