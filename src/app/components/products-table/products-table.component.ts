import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: ['./products-table.component.scss']
})
export class ProductsTableComponent {
  displayedColumns: string[] = ['id', 'productName', 'numberSold'];
  products = ['Laptop', 'Smartphone', 'Headphones', 'Smartwatch', 'Keyboard']; // For dropdown filter
  dataSource = new MatTableDataSource([
    { id: 1, productName: 'Laptop', numberSold: 15 },
    { id: 2, productName: 'Smartphone', numberSold: 25 },
    { id: 3, productName: 'Headphones', numberSold: 50 },
    { id: 4, productName: 'Smartwatch', numberSold: 10 },
    { id: 5, productName: 'Keyboard', numberSold: 35 }
  ]);

  applyFilter(filterValue: string) {
    if (filterValue === "all") {
      this.dataSource.filter = '';
    } else {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }
}
