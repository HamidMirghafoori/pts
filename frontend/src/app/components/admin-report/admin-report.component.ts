import { ChangeDetectorRef, Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Chart, ChartConfiguration, ChartData, registerables } from 'chart.js';
import { take } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { BuyService, RevenueType } from 'src/app/services/buy.service';

Chart.register(...registerables);
Chart.overrides.doughnut.cutout = '48';

interface ProductReportType {
  productId: string;
  title: string;
  count: number;
}

interface SalesReportType {
  date: string;
  gross: number;
}

interface ProductSalesProduct {
  id: string;
  title: string;
  count: number;
}
interface ProductSalesReport {
  date: string;
  product: ProductSalesProduct[];
}
interface ReportType {
  products: ProductReportType[];
  sales: SalesReportType[];
  productSales: ProductSalesReport[];
}
@Component({
  selector: 'app-admin-report',
  templateUrl: './admin-report.component.html',
  styleUrls: ['./admin-report.component.scss'],
})
export class AdminReportComponent {
  filteredData!: MatTableDataSource<RevenueType>;
  revenueData: RevenueType[] = [];
  colors = ['red', 'blue', 'darkOrange', 'green', 'darkSlateBlue', 'brown'];
  colorsAlpha = ['#ff000033', '#0000ff33', '#ff8c0033', '#00ff0033', '#483d8b33', '#FFEBCD33'];
  public displayedColumns: string[] = [
    'customerEmail',
    'itemName',
    'shopEmail',
    'price',
  ];

  selectedShopId!: string;
  selectedItemId!: string;
  showShopFilter: boolean = true;

  response: ReportType = {
    products: [
      {
        productId: '654806d034ab6fa73deab36a',
        title: 'Saiful Muluk sh3',
        count: 12,
      },
      { productId: '6548076134ab6fa73deab379', title: 'Tohoka sh3', count: 16 },
      { productId: '6548070134ab6fa73deab36f', title: 'Pattaya sh3', count: 8 },
    ],
    sales: [
      { date: 'Jan', gross: 2750 },
      { date: 'Feb', gross: 2150 },
      { date: 'Mar', gross: 1200 },
      { date: 'May', gross: 3700 },
      { date: 'Apr', gross: 2200 },
      { date: 'Jun', gross: 2450 },
      { date: 'Jul', gross: 2000 },
    ],
    productSales: [
      {
        date: 'Jan',
        product: [
          {
            id: '654806d034ab6fa73deab36a',
            title: 'Saiful Muluk sh3',
            count: 2,
          },
        ],
      },
      {
        date: 'Feb',
        product: [
          {
            id: '654806d034ab6fa73deab36a',
            title: 'Saiful Muluk sh3',
            count: 6,
          },
          { id: '6548076134ab6fa73deab379', title: 'Tohoka sh3', count: 8 },
        ],
      },
      {
        date: 'Mar',
        product: [
          {
            id: '654806d034ab6fa73deab36a',
            title: 'Saiful Muluk sh3',
            count: 1,
          },
          { id: '6548076134ab6fa73deab379', title: 'Tohoka sh3', count: 2 },
          { id: '6548070134ab6fa73deab36f', title: 'Pattaya sh3', count: 10 },
        ],
      },
      {
        date: 'May',
        product: [
          { id: '6548070134ab6fa73deab36f', title: 'Pattaya sh3', count: 8 },
        ],
      },
      {
        date: 'Apr',
        product: [
          {
            id: '654806d034ab6fa73deab36a',
            title: 'Saiful Muluk sh3',
            count: 2,
          },
          { id: '6548070134ab6fa73deab36f', title: 'Pattaya sh3', count: 3 },
        ],
      },
      {
        date: 'Jun',
        product: [
          {
            id: '654806d034ab6fa73deab36a',
            title: 'Saiful Muluk sh3',
            count: 3,
          },
          { id: '6548076134ab6fa73deab379', title: 'Tohoka sh3', count: 6 },
        ],
      },
      {
        date: 'Jul',
        product: [
          {
            id: '654806d034ab6fa73deab36a',
            title: 'Saiful Muluk sh3',
            count: 5,
          },
          { id: '6548076134ab6fa73deab379', title: 'Tohoka sh3', count: 3 },
          { id: '6548070134ab6fa73deab36f', title: 'Pattaya sh3', count: 4 },
        ],
      },
    ],
  };
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

  pieChart: any;
  barChart: any;
  lineChart: any;

  private buildPieData(): ChartData {
    let pieData: ChartData = {} as ChartData;
    const data: ProductReportType[] = [...this.response.products];
    pieData.labels = data.map((item) => item.title);
    pieData.datasets = [
      {
        label: 'Item Sales',
        data: [10, 11, 20, 7, 34, 4],
        backgroundColor: this.colors,
        borderWidth: 3,
        borderRadius: 8,
      },
    ];
    pieData.datasets[0].data = data.map((item) => item.count);
    return pieData;
  }

  private buildBarData(): ChartData {
    let barData: ChartData = {} as ChartData;
    const data: SalesReportType[] = [...this.response.sales];
    barData.labels = data.map((item) => item.date);
    barData.datasets = [
      {
        label: 'Monthly Sales',
        data: [10, 11, 20, 7, 34, 4],
        backgroundColor: this.colors,
        borderWidth: 3,
        borderRadius: 8,
      },
    ];
    barData.datasets[0].data = data.map((item) => item.gross);
    return barData;
  }

  private buildLineData(): ChartData {
    let barData: ChartData = { labels: [], datasets: [] } as ChartData;
    const data: ProductSalesReport[] = [...this.response.productSales];
    barData.labels = data.map((item) => item.date) as string[];
    const productsList = new Map<string, string>();
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].product.length; j++) {
        productsList.set(data[i].product[j].id, data[i].product[j].title);
      }
    }
    interface DatasetType {
      [key: string]: { label: string; data: number[] };
    }
    let datasets: DatasetType = {};
    productsList.forEach((k, v) => {
      datasets = { ...datasets, [v]: { label: k, data: [] } };
    });
    for (let i = 0; i < data.length; i++) {
      productsList.forEach((k, v) => {
        datasets[v].data.push(0);
      });
      for (let j = 0; j < data[i].product.length; j++) {
        if (data[i].product[j]) {
          const l = datasets[data[i].product[j].id].data.length;
          datasets[data[i].product[j].id].data[l - 1] =
            data[i].product[j].count;
        }
      }
    }

    Object.keys(datasets).forEach((key, index) => {
      barData['datasets'].push({
        ...datasets[key],
        fill: true,
        tension: 0.1,
        borderWidth: 1,
        borderColor: this.colors[index % 6],
        backgroundColor: this.colorsAlpha[index % 6],
      });
    });
    
    return barData;
  }

  generateBarChart() {
    const canvas1 = document.getElementById('chart1') as HTMLCanvasElement;
    const canvas2 = document.getElementById('chart2') as HTMLCanvasElement;
    const canvas3 = document.getElementById('chart3') as HTMLCanvasElement;
    const ctx1 = canvas1.getContext('2d');
    const ctx2 = canvas2.getContext('2d');
    const ctx3 = canvas3.getContext('2d');

    this.buildLineData();

    if (!ctx1 || !ctx2 || !ctx3) {
      console.error('Unable to retrieve 2D rendering context for the canvas.');
      return;
    }

    const pieConfig: ChartConfiguration = {
      type: 'doughnut',
      data: this.buildPieData(),
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

    const barConfig: ChartConfiguration = {
      type: 'bar',
      data: this.buildBarData(),
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

    const lineConfig: ChartConfiguration = {
      type: 'line',
      data: this.buildLineData(),
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
              boxWidth: 64,
            },
          },
        },
      },
    };

    // Create the bar chart
    this.pieChart = new Chart(ctx1, pieConfig);
    this.barChart = new Chart(ctx2, barConfig);
    this.lineChart = new Chart(ctx3, lineConfig);
  }
}
