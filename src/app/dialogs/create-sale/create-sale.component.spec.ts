import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSaleComponent } from './create-sale.component';

describe('CreateSaleComponent', () => {
  let component: CreateSaleComponent;
  let fixture: ComponentFixture<CreateSaleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateSaleComponent]
    });
    fixture = TestBed.createComponent(CreateSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
