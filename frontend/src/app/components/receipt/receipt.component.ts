import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ReceiptComponent implements OnInit {
  @Input() price: number = 0;
  @Input() email: string = '';
  @Input() address: string = '';
  @Input() title: string = '';

  constructor(    private router: Router  ){}
  dataSource: any[] = [];
  totalPrice = 0

  ngOnInit(): void {
    console.log(this.price, this.email);
    this.dataSource = [
      {
        item: 1,
        email: this.email,
        pax: 1,
        date: this.date,
        price: this.price,
        total: this.price,
      },
    ];
    this.totalPrice = this.dataSource[0].total;
  }
  date = new Date().toLocaleDateString();

  displayedColumns: string[] = [
    'item',
    'email',
    'pax',
    'date',
    'price',
    'total',
  ];


  public onCloseButton() {
    this.router.navigate(['']);
  }
}
