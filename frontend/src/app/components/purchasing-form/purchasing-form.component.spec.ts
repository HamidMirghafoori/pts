import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasingFormComponent } from './purchasing-form.component';

describe('PurchasingFormComponent', () => {
  let component: PurchasingFormComponent;
  let fixture: ComponentFixture<PurchasingFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurchasingFormComponent]
    });
    fixture = TestBed.createComponent(PurchasingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
