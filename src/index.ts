import os from 'os';
import { Kickboard, MongoDB, OPCODE, Wrapper } from '.';

export * from './controllers';
export * from './models';
export * from './tools';

const hostname = os.hostname();
export const handler = Wrapper(async (event, context, cb) => {
  await MongoDB.init();

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
