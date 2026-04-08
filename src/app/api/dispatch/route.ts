import { dispatchWorkflow } from "@/lib/github";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { owner, repo, command } = body;

  if (!owner || !repo || !command) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const result = await dispatchWorkflow(owner, repo, command);

  if (result.success) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ success: false, error: result.error }, { status: 500 });
  }
}
