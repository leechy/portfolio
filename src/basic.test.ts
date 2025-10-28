import { describe, expect, it } from 'vitest';

describe('Portfolio Application', () => {
  it('should pass basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should have working environment', () => {
    expect(process.env).toBeDefined();
  });

  it('should handle string operations', () => {
    const testString = 'Hello, World!';
    expect(testString.toLowerCase()).toBe('hello, world!');
    expect(testString.length).toBe(13);
  });
});

describe('Basic JavaScript functionality', () => {
  it('should handle arrays correctly', () => {
    const testArray = [1, 2, 3, 4, 5];
    expect(testArray.length).toBe(5);
    expect(testArray.includes(3)).toBe(true);
    expect(testArray.filter(n => n > 3)).toEqual([4, 5]);
  });

  it('should handle objects correctly', () => {
    const testObj = { name: 'Test', value: 42 };
    expect(testObj.name).toBe('Test');
    expect(testObj.value).toBe(42);
    expect(Object.keys(testObj)).toEqual(['name', 'value']);
  });
});
