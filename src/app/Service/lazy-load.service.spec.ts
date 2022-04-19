import { TestBed } from '@angular/core/testing';

import { LazyLoadScriptService } from './lazy-load.service';

describe('LazyLoadService', () => {
  let service: LazyLoadScriptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LazyLoadScriptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
