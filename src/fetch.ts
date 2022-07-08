import fetch from 'node-fetch';
import * as fs from 'fs';
import iso from 'iso-3166-1';

const PNG_DEST = `dist/png`;
const codes = iso.all().map(({ alpha2 }) => alpha2);

async function run(): Promise<void> {
  fs.mkdirSync(PNG_DEST, { recursive: true });

  await Promise.all(
    codes.map(async alpha2 =>
      (await fetch(`https://flagcdn.com/h240/${alpha2.toLowerCase()}.png`)).body.pipe(fs.createWriteStream(`${PNG_DEST}/${alpha2}.png`))
    )
  );
}

void run();
