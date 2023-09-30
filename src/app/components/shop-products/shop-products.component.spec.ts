import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopProductsComponent } from './shop-products.component';

describe('ShopProductsComponent', () => {
  let component: ShopProductsComponent;
  let fixture: ComponentFixture<ShopProductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShopProductsComponent]
    });
    fixture = TestBed.createComponent(ShopProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
