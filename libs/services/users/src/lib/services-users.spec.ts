import { getUsers } from './services-users';

describe('getUsers', () => {
  it('should work', () => {
    expect(getUsers()).toEqual('Hello from users service');
  });
});
