import { getUsers } from '@monowa/users';

export const handler = async (event: any, context: any) => {
  const data = getUsers();
  return {
    statusCode: 200,
    body: JSON.stringify({ data }),
  };
};
