/* eslint-disable @typescript-eslint/no-var-requires */
const esbuild = require('esbuild');

const LAMBDAS = [
  { name: 'fetchTickets', routeType: 'ticket' },
  { name: 'scrapeTickets', routeType: 'ticket' },
  { name: 'scrapeEventUrls', routeType: 'ticket' },
  { name: 'addHomeGames', routeType: 'game' },
  { name: 'addTicketAppUrl', routeType: 'game' },
  { name: 'refreshTickets', routeType: 'game' },
  { name: 'fetchGames', routeType: 'game' },
];

const buildLambda = async ({ name, routeType }) => {
  await esbuild.build({
    entryPoints: [`lambdas/${routeType}/${name}.ts`],
    bundle: true,
    platform: 'node',
    target: 'node22',
    external: ['aws-sdk'],
    outdir: `dist/${name}`,
  });
  console.log(`Built ${name}`);
};

const buildAll = async () => {
  await Promise.all(LAMBDAS.map(lambda => buildLambda(lambda)));
};

buildAll().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
