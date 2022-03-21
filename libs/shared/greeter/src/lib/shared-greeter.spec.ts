import { greeting } from './shared-greeter';

describe('greeting', () => {
  it('should work', () => {
    expect(greeting('Demo')).toEqual('Hello, Demo!');
  });
});
