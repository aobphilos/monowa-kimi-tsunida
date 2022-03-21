import { getMessage } from '@monowa/messages';

export const handler = async (event: any, context: any) => {
  const data = getMessage();
  return {
    statusCode: 200,
    body: JSON.stringify({ data }),
  };
};
