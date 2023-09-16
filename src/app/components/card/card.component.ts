import { Component, Input } from '@angular/core';

export interface CardInfo {
  bgImg: string;
  category: string;
  destination: string;
  title: string;
  rate: number;
  votes: number;
  bookedCount: number;
  tags: string[];
  price: number;
  currency: string;
}

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  preserveWhitespaces: true 
})
export class CardComponent {
  @Input() data: CardInfo = {
    bgImg: '../../../assets/1.png',
    category: 'Rail Passes',
    destination: 'Tokyo',
    title: 'JR Pass for Whole Japan',
    rate: 4.5,
    votes: 20654,
    bookedCount: 500452,
    tags: ['Bestseller'],
    price: 201.69,
    currency: 'US$',
  };
}
