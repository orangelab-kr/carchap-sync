import InternalError from './tools/error';
import Kickboard from './controllers/kickboard';
import Wrapper from './tools/wrapper';
import dotenv from 'dotenv';
if (process.env.NODE_ENV === 'development') dotenv.config();

export const handler = Wrapper(async (event, context, cb) => {
  const { lat, lng } = event.queryStringParameters;
  if (!Number(lat) || !Number(lng)) {
    throw new InternalError('좌표를 입력해주세요.');
  }

  const kickboards = await Kickboard.getKickboards(Number(lat), Number(lng));
  cb(null, {
    statusCode: 200,
    body: JSON.stringify(kickboards),
  });
});
