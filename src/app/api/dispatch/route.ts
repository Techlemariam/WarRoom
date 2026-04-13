import { dispatchWorkflow } from '@/lib/github';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { owner, repo, workflowId, ref, inputs } = body;

  const result = await dispatchWorkflow(owner, repo, workflowId, ref, inputs);

  if (result.success) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false, error: result.error }, { status: 500 });
}
