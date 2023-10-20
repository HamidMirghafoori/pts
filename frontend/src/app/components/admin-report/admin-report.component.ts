import { ChangeDetectorRef, Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { BuyService, RevenueType } from 'src/app/services/buy.service';

@Component({
  selector: 'app-admin-report',
  templateUrl: './admin-report.component.html',
  styleUrls: ['./admin-report.component.scss'],
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
  showShopFilter:boolean = true;

  constructor(
    private buyService: BuyService,
    private cdr: ChangeDetectorRef,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.authService.authenticatedUser$.pipe(take(1)).subscribe((user) => {
      if (user) {
        console.log(user);
        
        if (user.role === 'business') {
          this.showShopFilter = false;
          this.buyService.getRevenueDataById(user.uid).subscribe(data=>{
            this.revenueData = data;
            this.filteredData = new MatTableDataSource<RevenueType>(
              this.revenueData
            );
          })
        } else {
          this.showShopFilter = true;
          this.buyService.getRevenueData().subscribe((data) => {
            this.revenueData = data;
            this.filteredData = new MatTableDataSource<RevenueType>(
              this.revenueData
            );
          });
        }
      }
    });
  }

  uniqueShopIds(): string[] {
    if (!this.filteredData?.data) return [];
    return ['', ...new Set(this.filteredData.data.map((item) => item.shopEmail))];
  }

  uniqueItemIds(): string[] {
    if (!this.filteredData?.data) return [];
    return ['', ...new Set(this.filteredData.data.map((item) => item.itemName))];
  }

  filterTable(): void {
    this.filteredData.data = this.revenueData.filter((item) => {
      const isShopSelected = this.selectedShopId
        ? item.shopEmail === this.selectedShopId
        : true;
      const isItemSelected = this.selectedItemId
        ? item.itemName === this.selectedItemId
        : true;
      return isShopSelected && isItemSelected;
    });
    this.cdr.detectChanges();
  }
}
