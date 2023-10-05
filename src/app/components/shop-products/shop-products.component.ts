import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cardsImg } from 'src/app/model/images';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ProductService, ProductType } from 'src/app/services/products.service';

@Component({
  selector: 'app-shop-products',
  templateUrl: './shop-products.component.html',
  styleUrls: ['./shop-products.component.scss'],
})
export class ShopProductsComponent implements OnInit {
  @ViewChild('productPanel') productPanel!: MatExpansionPanel;

  products: ProductType[] = [];
  panelOpen = false;
  productForm!: FormGroup;
  allTags: string[] = ['Bestseller', 'Easy Refund'];
  editMode: boolean = false;
  selectedProduct!: ProductType;

  allOffers: string[] = [
    'Exclusive Combo',
    'Best Price Guarantee',
    '9th Birthday',
    'Save 22%',
    'PTS Exclusive',
  ];

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      destination: ['', Validators.required],
      price: ['', Validators.required],
      tags: [''],
      offers: [''],
      bgImg: [''],
    });

    this.productService.getAllUserProducts().subscribe((products) => {
      const transformed = products.map((product, index) => ({
        ...product,
        bgImg: cardsImg[index % 7],
        offers: Array.isArray(product.offers)
          ? product.offers
          : [product.offers],
        tags: Array.isArray(product.tags) ? product.tags : [product.tags],
      }));

      this.products = transformed;
    });
  }

  onSubmit() {
    let shopEmail: string = '';
    this.authService.authenticatedUser$.subscribe((user) => {
      shopEmail = user ? user.email : '';
    });

    const form = this.productForm.value;
    if (this.editMode) {
      const id = this.selectedProduct.productId;
      const data: ProductType = {
        ...this.selectedProduct,
        category: this.productForm.get('category')?.value,
        destination: this.productForm.get('destination')?.value,
        offers: [this.productForm.get('offers')?.value],
        price: this.productForm.get('price')?.value,
        tags: [this.productForm.get('tags')?.value],
        title: this.productForm.get('title')?.value,
        shopEmail,
      };
      this.editMode = false;
      this.productService.updateProduct(id, data).then(() => {
        this.snackBar.open('Product updated successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.productPanel.close();
      });
      return;
    }
    this.productService.addProduct({ ...form, shopEmail }).then(() => {
      this.productPanel.close();
    });
  }

  public onEdit = (index: number) => {
    this.selectedProduct = this.products[index];
    this.productForm.patchValue(this.selectedProduct);
    this.editMode = true;
    this.productPanel.open();
  };

  public onDelete = (index: number) => {
    this.selectedProduct = this.products[index];
    const id = this.selectedProduct.productId;
    this.productService.deleteProduct(id).then(() => {
      this.snackBar.open('Product deleted successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    });
  };
}
