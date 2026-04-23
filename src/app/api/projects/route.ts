import { octokit } from '@/lib/github';
import { NextResponse } from 'next/server';

export async function GET() {
  const reposRaw = process.env.GITHUB_REPOS || '';
  const repos = reposRaw.split(',').map((r) => r.trim());

  try {
    const projectStates = await Promise.all(
      repos.map(async (repoFull) => {
        const [owner, repo] = repoFull.split('/');
        const stateFiles = ['active.json', 'current_state.json', 'queue.json', 'usage.json'];
        const state: Record<string, unknown> = { name: repo, owner };

        await Promise.all(
          stateFiles.map(async (file) => {
            try {
              const { data } = await octokit.rest.repos.getContent({
                owner,
                repo,
                path: file,
              });

              if ('content' in data && typeof data.content === 'string') {
                const content = Buffer.from(data.content, 'base64').toString();
                state[file.replace('.json', '')] = JSON.parse(content);
              }
            } catch (_e) {
              // File might not exist, skip
            }
          })
        );
        return state;
      })
    );

    return NextResponse.json(projectStates);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
