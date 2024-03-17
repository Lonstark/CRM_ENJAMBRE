import { TestBed } from '@angular/core/testing';

import { PerfilSubMenuAccionService } from './perfil-sub-menu-accion.service';

describe('PerfilSubMenuAccionService', () => {
  let service: PerfilSubMenuAccionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerfilSubMenuAccionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
