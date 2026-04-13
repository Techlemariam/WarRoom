import { NextResponse } from 'next/server';
import { Octokit } from 'octokit';

const octokit = new Octokit({
  auth: process.env.GITHUB_PAT,
});

export async function GET() {
  const repos = process.env.GITHUB_REPOS?.split(',') || [];

  try {
    const projectStates = await Promise.all(
      repos.map(async (repoStr) => {
        const [owner, repo] = repoStr.split('/');

        const stateFiles = ['active.json', 'current_state.json', 'queue.json', 'usage.json'];
        const state: any = { name: repo, owner };

        await Promise.all(
          stateFiles.map(async (file) => {
            try {
              const { data: contentData } = await octokit.rest.repos.getContent({
                owner,
                repo,
                path: `.agent/${file}`,
              });

              if ('content' in contentData) {
                const content = Buffer.from(contentData.content, 'base64').toString();
                state[file.replace('.json', '')] = JSON.parse(content);
              }
            } catch (e) {
              // File might not exist, skip
            }
          })
        );

        return state;
      })
    );

    return NextResponse.json(projectStates);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
