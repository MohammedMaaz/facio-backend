const dotenv = require('dotenv');
const path = require('path');
// eslint-disable-next-line security/detect-child-process
const { execSync } = require('child_process');

const res = dotenv.config({ path: path.join(__dirname, '../.env') });

const command = Object.entries(res.parsed).reduce((acc, curr) => `${acc} ${curr[0]}="${curr[1]}"`, 'heroku config:set');

execSync(command, { stdio: 'inherit' });
