// PTY wrapper for drizzle-kit push to bypass isTTY check
const { spawn } = require('child_process');
const os = require('os');

const cmd = os.platform() === 'win32' ? 'cmd.exe' : 'script';
const args = os.platform() === 'win32' 
  ? ['/c', 'npx drizzle-kit push --force']
  : ['-q', '-c', 'npx drizzle-kit push --force', '/dev/null'];

const child = spawn(cmd, args, {
  cwd: '/mnt/c/Users/REGINALDO/Desktop/AI-KIDS-OFICIAL',
  stdio: 'inherit',
});

// Auto-answer after schema pull (~14s) - select "No, don't truncate"
setTimeout(() => {
  if (child.stdin && !child.stdin.destroyed) {
    child.stdin.write('\n');
  }
}, 16000);

child.on('close', code => {
  console.log(`\nExit code: ${code}`);
  process.exit(code || 0);
});
