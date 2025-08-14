// app/api/vision-breakdown/route.ts
import { InferenceClient } from "@huggingface/inference";
import { NextRequest, NextResponse } from "next/server";

const hf = new InferenceClient(process.env.HUGGING_FACE_API);

export async function POST(req: NextRequest) {
  const { vision } = await req.json();
  
  if (!vision) {
    return NextResponse.json({ error: "Missing vision input" }, { status: 400 });
  }

  try {
    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct",
      inputs: `Break down this vision into phases and tasks:\n${vision}`,
      parameters: { max_new_tokens: 200 }
    });

    return NextResponse.json({ breakdown: response.generated_text });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "AI generation error" }, { status: 500 });
  }
}
