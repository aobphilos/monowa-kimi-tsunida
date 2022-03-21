import { sharedGreeter } from './shared-greeter';

describe('sharedGreeter', () => {
  it('should work', () => {
    expect(sharedGreeter()).toEqual('shared-greeter');
  });
});
