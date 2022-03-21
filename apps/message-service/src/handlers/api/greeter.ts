import { greeting } from '@monowa/greeter';

export const handler = async (event: any, context: any) => {
  const { name = 'Bob' } = event.queryStringParameters || { name: 'Bob' };
  const data = greeting(name);
  return {
    statusCode: 200,
    body: JSON.stringify({ data }),
  };
};
