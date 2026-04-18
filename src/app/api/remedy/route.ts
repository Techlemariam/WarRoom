import { NextResponse } from 'next/server';
import { executeAction, RemediationAction } from '@/lib/autonom';

export async function POST(request: Request) {
  try {
    const action: RemediationAction = await request.json();
    
    if (!action || !action.type || !action.target) {
      return NextResponse.json({ error: 'Invalid action payload' }, { status: 400 });
    }

    console.log(`[Remedy] Received execution request for: ${action.id} (${action.type})`);
    
    // In the future, we could add RBAC checks here
    
    const result = await executeAction(action);
    
    if (result.success) {
      return NextResponse.json({ success: true, message: result.message });
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error('[Remedy API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
