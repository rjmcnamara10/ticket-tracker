import axios from 'axios';
import fs from 'fs';

// const axios = require('axios');
// const fs = require('fs');

async function getHomeSchedule(
  url: string,
  arenaName: string,
  arenaCity: string,
  arenaState: string,
) {
  const schedule = [];
  const { data } = await axios.get(url);
  const games = data.data.gscd.g;
  for (const game of games) {
    if (game.an === arenaName && game.ac === arenaCity && game.as === arenaState) {
      const gameInfo = {
        date: game.gdte,
        time: game.stt,
        homeTeamCity: game.h.tc,
        homeTeamName: game.h.tn,
        awayTeamCity: game.v.tc,
        awayTeamName: game.v.tn,
      };
      schedule.push(gameInfo);
    }
  }

  return schedule;
}

async function test() {
  const schedule = await getHomeSchedule(
    'https://cdn.celtics.com/evergreen/dotcom/schedule/v2024/2024_celtics_schedule.json',
    'TD Garden',
    'Boston',
    'MA',
  );
  fs.writeFileSync('home_schedule.json', JSON.stringify(schedule, null, 2));
}
test();
