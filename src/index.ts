import { OPCODE, Wrapper } from './tools';

import { Kickboard } from './controllers';
import dotenv from 'dotenv';
import os from 'os';

if (process.env.NODE_ENV === 'dev') dotenv.config();

const hostname = os.hostname();
export const handler = Wrapper(async (event, context, cb) => {
  const { queryStringParameters } = event;
  if (
    !queryStringParameters ||
    !Number(queryStringParameters.lat) ||
    !Number(queryStringParameters.lng)
  ) {
    return cb(null, {
      statusCode: 200,
      body: JSON.stringify({
        opcode: OPCODE.SUCCESS,
        mode: process.env.NODE_ENV,
        cluster: hostname,
      }),
    });
  }

  const kickboards = await Kickboard.getKickboards(
    Number(queryStringParameters.lat),
    Number(queryStringParameters.lng)
  );

  cb(null, {
    statusCode: 200,
    body: JSON.stringify(kickboards),
  });
});
