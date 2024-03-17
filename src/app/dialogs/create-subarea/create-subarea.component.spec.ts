import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSubareaComponent } from './create-subarea.component';

describe('CreateSubareaComponent', () => {
  let component: CreateSubareaComponent;
  let fixture: ComponentFixture<CreateSubareaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateSubareaComponent]
    });
    fixture = TestBed.createComponent(CreateSubareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
