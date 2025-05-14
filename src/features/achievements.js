export const achievements = [
  {
    id: 'first-click',
    name: 'First Compile',
    description: 'Click the compile button once.',
    condition: (stats) => stats.totalClicks >= 1
  },
  {
    id: 'ten-thousand-loc',
    name: '10K Lines!',
    description: 'Write 10,000 total lines of code.',
    condition: (stats) => stats.totalLinesOfCode >= 10000
  },
  {
    id: 'clickmaster',
    name: 'Clickmaster',
    description: 'Click 1,000 times.',
    condition: (stats) => stats.totalClicks >= 1000
  },
  {
    id: 'power-upgrade',
    name: 'The power of upgrades',
    description: 'Own all the available upgrades',
    condition: (stats) => stats.purchasedUpgrades === 3
  },
  {
    id: 'aint-working',
    name: "You ain't working anymore",
    description: 'Own 100 generators',
    condition: (stats) => stats.purchasedGenerators >= 100
  },
];