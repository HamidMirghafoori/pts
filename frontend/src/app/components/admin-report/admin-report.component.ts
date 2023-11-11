import { ChangeDetectorRef, Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Chart, ChartConfiguration, ChartData, registerables } from 'chart.js';
import { take } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { BuyService, RevenueType } from 'src/app/services/buy.service';

Chart.register(...registerables);
Chart.overrides.doughnut.cutout = '48'
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
  showShopFilter: boolean = true;

  constructor(
    private buyService: BuyService,
    private cdr: ChangeDetectorRef,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.authService.authenticatedUser$.pipe(take(1)).subscribe((user) => {
      if (user) {
        if (user.role === 'business') {
          this.showShopFilter = false;
          // this.buyService.getRevenueDataById(user.uid).subscribe(data=>{
          //   this.revenueData = data;
          //   this.filteredData = new MatTableDataSource<RevenueType>(
          //     this.revenueData
          //   );
          // })
        } else {
          this.showShopFilter = true;
          // this.buyService.getRevenueData().subscribe((data) => {
          //   this.revenueData = data;
          //   this.filteredData = new MatTableDataSource<RevenueType>(
          //     this.revenueData
          //   );
          // });
        }
      }
    });
    this.generateBarChart();
  }

  // uniqueShopIds(): string[] {
  //   if (!this.filteredData?.data) return [];
  //   return [
  //     '',
  //     ...new Set(this.filteredData.data.map((item) => item.shopEmail)),
  //   ];
  // }

  // uniqueItemIds(): string[] {
  //   if (!this.filteredData?.data) return [];
  //   return [
  //     '',
  //     ...new Set(this.filteredData.data.map((item) => item.itemName)),
  //   ];
  // }

  // filterTable(): void {
  //   this.filteredData.data = this.revenueData.filter((item) => {
  //     const isShopSelected = this.selectedShopId
  //       ? item.shopEmail === this.selectedShopId
  //       : true;
  //     const isItemSelected = this.selectedItemId
  //       ? item.itemName === this.selectedItemId
  //       : true;
  //     return isShopSelected && isItemSelected;
  //   });
  //   this.cdr.detectChanges();
  // }

  chart1: any;
  chart2: any;
  chart3: any;

  generateBarChart() {
    const canvas1 = document.getElementById('chart1') as HTMLCanvasElement;
    const canvas2 = document.getElementById('chart2') as HTMLCanvasElement;
    const canvas3 = document.getElementById('chart3') as HTMLCanvasElement;
    const ctx1 = canvas1.getContext('2d');
    const ctx2 = canvas2.getContext('2d');
    const ctx3 = canvas3.getContext('2d');

    if (!ctx1 || !ctx2 || !ctx3) {
      console.error('Unable to retrieve 2D rendering context for the canvas.');
      return;
    }

    const data1: ChartData = {
      labels: ['Item 1', 'item 2', 'Item 3', 'new', 'ok', 'no'],
      datasets: [
        {
          label: 'Item Sales',
          data: [10, 11, 20, 7, 34, 4],
          backgroundColor: [
            'red',
            'blue',
            'darkOrange',
            'green',
            'darkSlateBlue',
            'brown',
          ],
          borderWidth: 3,
          borderRadius: 8,
        
        },
      ],
    };

    const data2: ChartData = {
      labels: ['Jan', 'Feb', 'Mar', 'May', 'Apr', 'Jun', 'Jul'],
      datasets: [
        {
          label: 'Monthly Sales',
          data: [800, 1250, 1110, 1300, 1290, 1600, 1485],
          fill: false,
          borderColor: 'blue',
          tension: 0.1,
        },
      ],
    };

    const data3: ChartData = {
      labels: ['Jan', 'Feb', 'Mar', 'May', 'Apr', 'Jun', 'Jul'],
      datasets: [
        {
          label: 'Saiful Muluk sh3',
          data: [2, 6, 1, 0, 2, 3, 5],
          fill: false,
          borderColor: 'blue',
          tension: 0.1,
          borderWidth: 1
        },
        {
          label: 'Tohoka sh3',
          data: [0, 6, 2, 0, 0, 6, 3],
          fill: false,
          borderColor: 'red',
          tension: 0.1,
          borderWidth: 1
        },
        {
          label: 'Pattaya sh3',
          data: [0, 0, 10, 8, 3, 0, 4],
          fill: false,
          borderColor: 'green',
          tension: 0.1,
          borderWidth: 1
        },
      ],
    };

    const config1: ChartConfiguration = {
      type: 'doughnut',
      data: data1,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            display: true,
            labels: {
              color: 'black',
              font: {
                size: 12,
              },
              boxHeight: 8,
              boxWidth: 24,
            },
          },
        },
      },
    };

    const config2: ChartConfiguration = {
      type: 'line',
      data: data2,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            display: true,
            labels: {
              color: 'green',
              font: {
                size: 24,
              },
              boxHeight: 0,
              boxWidth: 0,
            },
          },
        },
      },
    };

    const config3: ChartConfiguration = {
      type: 'line',
      data: data3,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            display: true,
            labels: {
              color: 'green',
              font: {
                size: 12,
              },
              boxHeight: 8,
              boxWidth: 64
            },
          },
        },
      },
    };

    // Create the bar chart
    this.chart1 = new Chart(ctx1, config1 as any);
    this.chart2 = new Chart(ctx2, config2 as any);
    this.chart3 = new Chart(ctx3, config3 as any);
  }
}
