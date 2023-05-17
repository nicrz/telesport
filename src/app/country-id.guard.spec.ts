import { TestBed } from '@angular/core/testing';

import { CountryIdGuard } from './country-id.guard';

describe('CountryIdGuard', () => {
  let guard: CountryIdGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CountryIdGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
