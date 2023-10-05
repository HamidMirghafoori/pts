import { ChangeDetectorRef, Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BuyService, RevenueType } from 'src/app/services/buy.service';

@Component({
  selector: 'app-admin-report',
  templateUrl: './admin-report.component.html',
  styleUrls: ['./admin-report.component.scss']
})
export class AdminReportComponent {
  filteredData!: MatTableDataSource<RevenueType>;
  revenueData: RevenueType[] = [];
  public displayedColumns: string[] = [
    'customerEmail',
    'itemName',
    'shopEmail',
    'price',
  ];

  selectedShopId!: string;
  selectedItemId!: string;

  constructor(private buyService: BuyService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.buyService.getRevenueData().subscribe((data) => {
      this.revenueData = data;
      this.filteredData = new MatTableDataSource<RevenueType>(this.revenueData);
    });
  }

  uniqueShopIds(): string[] {
    if (!this.filteredData?.data) return [];
    return ['', ...new Set(this.filteredData.data.map((item) => item.shopId))];
  }

  uniqueItemIds(): string[] {
    if (!this.filteredData?.data) return [];
    return ['', ...new Set(this.filteredData.data.map((item) => item.itemId))];
  }

  filterTable(): void {
    this.filteredData.data = this.revenueData.filter((item) => {
      const isShopSelected = this.selectedShopId ? item.shopId === this.selectedShopId : true;
      const isItemSelected = this.selectedItemId ? item.itemId === this.selectedItemId : true;
      return isShopSelected && isItemSelected;
    });
    this.cdr.detectChanges();
  }

}
