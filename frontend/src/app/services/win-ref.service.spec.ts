import { TestBed } from '@angular/core/testing';

import { WindowRef } from './win-ref.service';

describe('WindowRef', () => {
  let service: WindowRef;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WindowRef);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
