import { Octokit } from 'octokit';

const octokit = new Octokit({
  auth: process.env.GITHUB_PAT,
});

export async function getWorkflows(owner: string, repo: string) {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: '.agent/workflows',
    });

    if (!Array.isArray(data)) return [];

    const workflows = await Promise.all(
      data
        .filter((file) => file.name.endsWith('.md') && !file.name.startsWith('_'))
        .map(async (file) => {
          const { data: contentData } = await octokit.rest.repos.getContent({
            owner,
            repo,
            path: file.path,
          });

          if ('content' in contentData) {
            const content = Buffer.from(contentData.content, 'base64').toString();
            const frontmatter = parseFrontmatter(content);
            return {
              name: file.name,
              path: file.path,
              ...frontmatter,
              repo,
            };
          }
          return null;
        })
    );

    return workflows.filter(Boolean);
  } catch (error) {
    console.error(`Error fetching workflows for ${repo}:`, error);
    return [];
  }
}

export async function dispatchWorkflow(owner: string, repo: string, workflowCommand: string) {
  try {
    await octokit.rest.repos.createDispatchEvent({
      owner,
      repo,
      event_type: 'remote-trigger',
      client_payload: {
        workflow: workflowCommand,
        timestamp: new Date().toISOString(),
      },
    });
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error dispatching workflow for ${repo}:`, error);
    return { success: false, error: errorMessage };
  }
}

function parseFrontmatter(content: string) {
  const match = content.match(/^---([\s\S]*?)---/);
  if (!match) return { description: 'No description' };

  const fm = match[1];
  const result: Record<string, string> = {};
  for (const line of fm.split('\n')) {
    const [key, ...value] = line.split(':');
    if (key && value.length) {
      result[key.trim()] = value
        .join(':')
        .trim()
        .replace(/^["']|["']$/g, '');
    }
  }
  return result;
}
