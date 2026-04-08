import { getWorkflows } from "@/lib/github";
import { NextResponse } from "next/server";

export async function GET() {
  const repos = process.env.GITHUB_REPOS?.split(",") || [];
  
  try {
    const allWorkflows = await Promise.all(
      repos.map(async (repoStr) => {
        const [owner, repo] = repoStr.split("/");
        return await getWorkflows(owner, repo);
      })
    );
    
    return NextResponse.json(allWorkflows.flat());
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
