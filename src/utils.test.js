import { isValidTimeOrder, santizePhoneNum } from 'utils';

// We don't even use this anymore
describe.skip('isValidTimeOrder', () => {
  test('isValidTimeOrder #1', () => {
    expect(isValidTimeOrder('10:00 AM', '10:01 AM')).toBe(true);
  });

  test('isValidTimeOrder #2', () => {
    expect(isValidTimeOrder('10:01 AM', '10:00 AM')).toBe(false);
  });

  test('isValidTimeOrder #3', () => {
    expect(isValidTimeOrder('12:00 PM', '11:59 AM')).toBe(false);
  });

  test('isValidTimeOrder #4', () => {
    expect(isValidTimeOrder('11:59 AM', '12:00 PM')).toBe(true);
  });

  test('isValidTimeOrder #5', () => {
    expect(isValidTimeOrder('11:59 AM', null)).toBe(true);
  });

  test('isValidTimeOrder #6', () => {
    expect(isValidTimeOrder('11:59 AM', '11:59 AM')).toBe(true);
  });
});

describe('santizePhoneNum', () => {
  it('should remove any non-numerical characters from the string', () => {
    var phone = '(540)-538 4270';
    expect(santizePhoneNum(phone)).toBe('5405384270');

    phone = '540 538 4270';
    expect(santizePhoneNum(phone)).toBe('5405384270');
  });
});
