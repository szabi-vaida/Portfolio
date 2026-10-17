import { parseArgs } from 'node:util';
import { buildSite } from './commands/build.ts';
import { deploySite } from './commands/deploy.ts';
import { exportSite } from './commands/export.ts';
import { newSite } from './commands/new.ts';
import { devSite, previewSite } from './commands/serve.ts';
import { checkSite } from './astro.ts';
import { resolveSiteDir, templateNames } from './paths.ts';

const usage = () => `Usage:
  forge new <site> --template <${templateNames().join('|')}>
  forge check <site|path>        check site.yaml without building
  forge dev <site|path>          live preview while you edit
  forge build <site|path>        build into <site>/dist
  forge preview <site|path>      serve the last build on port 4400
  forge export <site> [--out <folder>]
  forge deploy <site> [--prod] [--site-id <id>]
`;

function fail(message: string): never {
  console.error(`${message}\n\n${usage()}`);
  process.exit(2);
}

async function main(): Promise<number> {
  const [command, ...rest] = process.argv.slice(2);
  const { values, positionals } = parseArgs({
    args: rest,
    allowPositionals: true,
    options: {
      template: { type: 'string', short: 't' },
      out: { type: 'string' },
      port: { type: 'string' },
      prod: { type: 'boolean' },
      'site-id': { type: 'string' },
    },
  });
  const one = () => {
    if (positionals.length !== 1) fail(`${command} needs one site name or folder.`);
    return positionals[0];
  };
  const port = values.port ? Number(values.port) : undefined;

  switch (command) {
    case 'new':
      if (!values.template) fail('new needs --template.');
      return newSite(one(), values.template);
    case 'check': {
      const dir = resolveSiteDir(one());
      if (!checkSite(dir)) return 1;
      console.log(`site.yaml is valid (${dir}).`);
      return 0;
    }
    case 'dev':
      return devSite(one(), port);
    case 'build':
      return buildSite(one());
    case 'preview':
      return previewSite(one(), port);
    case 'export':
      return exportSite(one(), values.out);
    case 'deploy':
      return deploySite(one(), values.prod === true, values['site-id']);
    case undefined:
      return fail('Which command?');
    default:
      return fail(`There is no "${command}" command.`);
  }
}

const code = await main();
// dev and preview keep running; every other command ends here.
if (code !== -1) process.exit(code);
