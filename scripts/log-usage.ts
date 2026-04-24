import { logTokenBurn, estimateTokens, SESSION_OVERHEAD } from '../src/lib/token-burn';

const args = process.argv.slice(2);
const project = args[0] || 'Unknown Project';
const charCount = parseInt(args[1], 10) || 0;
const type = (args[2] as 'prose' | 'code' | 'json') || 'code';
const user = args[3] || process.env.ANTIGRAVITY_USER || 'anonymous';

async function run() {
  const estimated = estimateTokens(charCount, type) + SESSION_OVERHEAD;
  
  await logTokenBurn({
    project,
    estimatedTokens: estimated,
    source: 'antigravity',
    user,
    sessionId: process.env.ANTIGRAVITY_SESSION_ID || 'manual-log'
  });
  
  console.log(`Logged ${estimated} tokens for ${project} (User: ${user})`);
}

run().catch(console.error);
