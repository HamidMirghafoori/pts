import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, map, startWith } from 'rxjs';
import { ProductType, ShopService } from 'src/app/services/shop.service';

@Component({
  selector: 'app-shop-products',
  templateUrl: './shop-products.component.html',
  styleUrls: ['./shop-products.component.scss'],
})
export class ShopProductsComponent implements OnInit {
  products: ProductType[] = [];
  panelOpen = false;
  productForm!: FormGroup;
  announcer = inject(LiveAnnouncer);
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: string[] = [];
  tagCtrl = new FormControl('');
  filteredTags!: Observable<string[]>;
  allTags: string[] = ['Bestseller', 'Easy Refund'];
  offers: string[] = [];
  offerCtrl = new FormControl('');
  filteredOffers!: Observable<string[]>;
  allOffers: string[] = [
    'Exclusive Combo',
    'Best Price Guarantee',
    '9th Birthday',
    'Save 22%',
    'PTS Exclusive',
  ];

  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;
  @ViewChild('offerInput') offerInput!: ElementRef<HTMLInputElement>;

  constructor(private shopService: ShopService, private fb: FormBuilder) {
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) =>
        tag ? this._filterTags(tag) : this.allTags.slice()
      )
    );
    this.filteredOffers = this.offerCtrl.valueChanges.pipe(
      startWith(null),
      map((offer: string | null) =>
        offer ? this._filterOffers(offer) : this.allOffers.slice()
      )
    );
  }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      destination: ['', Validators.required],
      price: ['', Validators.required],
      tags: this.tagCtrl,
      offers: [['']],
      image: [-1],
    });
  
    this.shopService.getAllProducts().subscribe((products) => {
      this.products = products;
    });
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.tags.push(value);
    }
    event.chipInput!.clear();

    this.tagCtrl.setValue(null);
  }

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);

      this.announcer.announce(`Removed ${tag}`);
    }
  }

  selectedTag(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }
  addOffer(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.offers.push(value);
    }
    event.chipInput!.clear();

    this.offerCtrl.setValue(null);
  }

  removeOffer(offer: string): void {
    const index = this.offers.indexOf(offer);

    if (index >= 0) {
      this.offers.splice(index, 1);

      this.announcer.announce(`Removed ${offer}`);
    }
  }

  selectedOffer(event: MatAutocompleteSelectedEvent): void {
    this.offers.push(event.option.viewValue);
    this.offerInput.nativeElement.value = '';
    this.offerCtrl.setValue(null);
  }
 
  private _filterTags(value: string): string[] {
    const filterValue = value.toLowerCase();
    
    return this.allTags.filter((tag) =>
    tag.toLowerCase().includes(filterValue)
    );
  }
  private _filterOffers(value: string): string[] {
    const filterValue = value.toLowerCase();
    
    return this.allOffers.filter((offer) =>
    offer.toLowerCase().includes(filterValue)
    );
  }

  // export interface Product {
  //   title: string;
  //   category: Categories;
  //   destination: string;
  //   price: number;
  //   tags: Tags[];
  //   offers: Offers[];
  //   bgImg: string;
  //   currency: Currencies;
  //   rate: number;
  //   votes: number;
  //   bookedCount: number;
  // }
  onSubmit() {
    const form = this.productForm.value;
    console.log(form, this.tagCtrl);
    
  }
}
