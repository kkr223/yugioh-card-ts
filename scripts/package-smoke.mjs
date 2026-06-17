import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(import.meta.dirname, '..');
const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'yugioh-card-ts-'));
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const commandOptions = process.platform === 'win32' ? { shell: true } : {};

try {
  const packOutput = execFileSync(
    npmCommand,
    ['pack', path.join(root, 'dist'), '--pack-destination', temporaryDirectory],
    { ...commandOptions, cwd: root, encoding: 'utf8' },
  ).trim();
  const archiveName = packOutput.split(/\r?\n/).at(-1);
  if (!archiveName) {
    throw new Error('npm pack did not return an archive name');
  }

  fs.writeFileSync(
    path.join(temporaryDirectory, 'package.json'),
    JSON.stringify({ private: true, type: 'module' }),
  );
  execFileSync(
    npmCommand,
    [
      'install',
      path.join(temporaryDirectory, archiveName),
      'leafer@2.0.4',
      'leafer-unified@1.0.3',
      '@leafer/node@2.0.4',
      '--ignore-scripts',
      '--no-package-lock',
      '--legacy-peer-deps',
    ],
    { ...commandOptions, cwd: temporaryDirectory, stdio: 'inherit' },
  );

  const packageEntry = path.join(
    temporaryDirectory,
    'node_modules',
    'yugioh-card-ts',
    'index.js',
  );
  const library = await import(pathToFileURL(packageEntry).href);
  const document = library.createYugiohCardDocument({
    title: { text: 'package smoke test' },
  });
  if (document.kind !== 'yugioh-card' || document.title.text !== 'package smoke test') {
    throw new Error('Installed package returned an invalid document');
  }
  if (typeof library.YugiohCard !== 'function') {
    throw new Error('Installed package does not export YugiohCard');
  }
  console.log('Installed package smoke test passed');
} finally {
  fs.rmSync(temporaryDirectory, { recursive: true, force: true });
}
