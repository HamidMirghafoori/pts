import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  AuthenticationService,
  UserType,
} from 'src/app/services/authentication.service';
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
  selectedProduct: ProductType | undefined;
  selectedFile: File | null = null;
  user: UserType | null = null;

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
      productDescription: [''],
      tags: [''],
      offers: [''],
      bgImg: ['', Validators.required],
    });
    this.authService.authenticatedUser$.subscribe((user) => {
      this.user = user;

      this.productService.getAllShopProducts(this.user).subscribe({
        next: (products) => {
          this.products = products;
        },
        error: (error) => {
          this.snackBar.open(error.error.message, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar'],
          });
        },
      });
    });
  }

  onImageSelected(event: any) {
    this.selectedFile = event.target.files[0];

    if (!this.selectedFile) {
      this.snackBar.open('An image should be selected', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['error-snackbar'],
      });
      this.productForm.get('bgImg')?.setValue('');
    } else {
      this.productForm.get('bgImg')?.setValue(this.selectedFile.name);
    }
  }

  onSubmit() {
    const shopEmail: string = this.user ? this.user.email : '';
    const ownerId: string = this.user ? this.user._id : '';
    const token: string = this.user?.token || '';

    if (shopEmail === '') {
      this.snackBar.open('Something went wrong login again', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['error-snackbar'],
      });

      return;
    }

    const formData = new FormData();
    formData.append('title', this.productForm.get('title')?.value);
    formData.append('category', this.productForm.get('category')?.value);
    formData.append('destination', this.productForm.get('destination')?.value);
    formData.append('price', this.productForm.get('price')?.value);
    formData.append(
      'productDescription',
      this.productForm.get('productDescription')?.value
    );
    formData.append('tags', this.productForm.get('tags')?.value);
    formData.append('offers', this.productForm.get('offers')?.value);
    formData.append('bgImg', this.productForm.get('bgImg')?.value);
    formData.append('file', this.selectedFile!, this.selectedFile!.name);
    formData.append('shopEmail', shopEmail);
    formData.append('token', token);
    formData.append('ownerId', ownerId);

    if (this.editMode) {
      formData.append(
        'productId',
        this.selectedProduct?._id ? this.selectedProduct._id : ''
      );
    }
    const msg = this.editMode
      ? 'Product updated successfully'
      : 'Product created successfully';
    this.productService.addProduct(formData).then((res) => {
      this.snackBar.open(msg, 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      if (this.editMode) {
        this.products = this.products.map((product) => {
          if (product._id === res._id) {
            return res;
          }
          return product;
        });
        this.selectedProduct = res;
        this.editMode = false;
      } else {
        this.products.push(res);
      }
    });
    this.productPanel.close();
  }

  public onEdit = (index: number) => {
    this.selectedProduct = this.products[index];
    this.productForm.patchValue(this.selectedProduct);
    this.productForm.get('bgImg')?.setValue('');
    this.selectedFile = null;
    this.editMode = true;
    this.productPanel.open();
  };

  public onDelete = (index: number) => {
    this.selectedProduct = this.products[index];
    const productId = this.selectedProduct._id;
    console.log(productId, this.user?._id);

    this.productService
      .deleteProduct({
        ownerId: this.user?._id,
        productId,
        token: this.user?.token,
      })
      .then(() => {
        this.snackBar.open('Product deleted successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.products = this.products.filter((product) => {
          product._id !== productId;
        });
        this.selectedFile = null;
        this.selectedProduct = undefined;
      })
      .catch(() => {
        this.snackBar.open('Product delete failed', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
      });
  };
}
