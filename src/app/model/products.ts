import { cardsImg } from './images';

export type Categories = ''| 'Rail Passes' | 'Theme Park' | 'Airport trains & buses' | 'Attraction Passes';
export type Tags = ''| 'Bestseller' | 'Easy Refund';
export type Currencies = 'US$';
export type Offers = ''| 'Exclusive Combo' | 'Best Price Guarantee' | '9th Birthday' | 'Save 22%' | 'PTS Exclusive';

export interface Product {
  title: string;
  category: Categories;
  destination: string;
  price: number;
  tags: Tags[];
  offers: Offers[];
  bgImg: string;
  currency: Currencies;
  rate: number;
  votes: number;
  bookedCount: number;
}

export const products: Product[] = [
  {
    bgImg: cardsImg[0],
    category: 'Rail Passes',
    destination: 'Tokyo',
    title: 'JR Pass for Whole Japan',
    rate: 4.5,
    votes: 20645,
    bookedCount: 500425,
    tags: ['Bestseller'],
    price: 201.69,
    currency: 'US$',
    offers: [],
  },
  {
    bgImg: cardsImg[1],
    category: 'Theme Park',
    destination: 'Tokyo',
    title: 'Tokyo Disney Resort Park Ticket',
    rate: 4.9,
    votes: 29881,
    bookedCount: 1010775,
    tags: ['Bestseller', 'Easy Refund'],
    price: 56.85,
    currency: 'US$',
    offers: [],
  },
  {
    bgImg: cardsImg[2],
    category: 'Theme Park',
    destination: 'Singapore',
    title: 'Universal Studios Singapore Ticket',
    rate: 4.8,
    votes: 88953,
    bookedCount: 2526336,
    tags: ['Bestseller'],
    price: 57.99,
    currency: 'US$',
    offers: ['Exclusive Combo']
  },
  {
    bgImg: cardsImg[3],
    category: 'Airport trains & buses',
    destination: 'Tokyo',
    title: 'Skyliner Narita Airport Express With Tokyo Subway Ticket',
    rate: 4.8,
    votes: 10253,
    bookedCount: 100776,
    tags: ['Bestseller'],
    price: 19.55,
    currency: 'US$',
    offers: ['Best Price Guarantee']
  },
  {
    bgImg: cardsImg[4],
    category: 'Rail Passes',
    destination: 'Tokyo',
    title: 'JR East Tohoku Area Pass',
    rate: 4.9,
    votes: 6670,
    bookedCount: 80112,
    tags: ['Bestseller'],
    price: 135.29,
    currency: 'US$',
    offers: ['9th Birthday', 'Save 22%']
  },
  {
    bgImg: cardsImg[5],
    category: 'Attraction Passes',
    destination: 'Singapore',
    title: 'PTS Pass Singapore',
    rate: 4.7,
    votes: 7444,
    bookedCount: 200478,
    tags: ['Bestseller', 'Easy Refund'],
    price: 62.85,
    currency: 'US$',
    offers: ['PTS Exclusive']
  },
  {
    bgImg: cardsImg[6],
    category: 'Theme Park',
    destination: 'Tokyo',
    title: 'Warner Bros. Studio Tour Tokyo - The Making of Harry Potter Ticket',
    rate: 4.8,
    votes: 557,
    bookedCount: 80500,
    tags: ['Bestseller'],
    price: 42.65,
    currency: 'US$',
    offers: ['Best Price Guarantee']
  },
];
