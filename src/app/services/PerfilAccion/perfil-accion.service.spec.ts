import { TestBed } from '@angular/core/testing';

import { PerfilAccionService } from './perfil-accion.service';

describe('PerfilAccionService', () => {
  let service: PerfilAccionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerfilAccionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
