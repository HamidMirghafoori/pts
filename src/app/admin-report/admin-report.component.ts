import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-report',
  templateUrl: './admin-report.component.html',
  styleUrls: ['./admin-report.component.scss']
})
export class AdminReportComponent {
  products = ['uer1', 'user2', 'user3', 'user4', 'user5']; // For dropdown filter

}
