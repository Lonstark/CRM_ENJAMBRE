import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAreaDialogComponent } from './create-area-dialog.component';

describe('CreateAreaDialogComponent', () => {
  let component: CreateAreaDialogComponent;
  let fixture: ComponentFixture<CreateAreaDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateAreaDialogComponent]
    });
    fixture = TestBed.createComponent(CreateAreaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
