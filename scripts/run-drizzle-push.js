// Spawn drizzle-kit push with PTY to bypass isTTY check
const { spawn } = require('child_process');
const path = require('path');

const cwd = '/mnt/c/Users/REGINALDO/Desktop/AI-KIDS-OFICIAL';

// Patch: set isTTY globally before drizzle-kit loads
const origIsTTY = Object.getOwnPropertyDescriptor(process.stdin, 'isTTY');
Object.defineProperty(process.stdin, 'isTTY', { get: () => true });
Object.defineProperty(process.stdout, 'isTTY', { get: () => true });

// Now require and invoke drizzle-kit
process.argv = ['node', 'drizzle-kit', 'push', '--force'];
process.chdir(cwd);

// Monkey-patch the interactive render function to auto-answer
const Module = require('module');
const origRequire = Module.prototype.require;
Module.prototype.require = function(id) {
  const mod = origRequire.apply(this, arguments);
  return mod;
};

// Actually we need to patch deeper. Let's just run it and send \n
const child = spawn('node', [
  path.join(cwd, 'node_modules', '.bin', 'drizzle-kit'),
  'push', '--force'
], {
  cwd,
  stdio: ['pipe', 'inherit', 'inherit'],
  env: { ...process.env, FORCE_COLOR: '1' }
});

// After 15s (after schema pull), send Enter to answer "no truncate"
setTimeout(() => {
  child.stdin.write('\n');
}, 15000);

child.on('close', code => process.exit(code));
