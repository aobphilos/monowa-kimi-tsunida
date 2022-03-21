import { getMessage } from './services-messages';

describe('getMessage', () => {
  it('should work', () => {
    expect(getMessage()).toEqual('Hello from message service');
  });
});
