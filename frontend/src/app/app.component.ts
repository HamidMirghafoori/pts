import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy{
  title = 'PTS';

  // sse: EventSource;
  // private apiUrl = 'http://localhost:8001/api/sse'

  constructor() {
    // this.sse = new EventSource(this.apiUrl);

    
    // this.sse.addEventListener('productAdded', (event) => {
    //   const data = JSON.parse(event.data);
    //   if (data.type === 'productAdded') {
    //     // Handle productAdded event
    //     // Update the corresponding observable or trigger an action
    //     console.log('Product added:', data.data);
    //   }
    // });
    // this.sse.onopen = (event) => {
    //   console.warn("EventSource onopen:", event);
    // };
    // this.sse.onmessage = (event) => {
    //   console.log(event.data);
    // };
    // this.sse.onerror = (error) => {
    //   console.error("EventSource failed:", error);
    // };
  }

  ngOnDestroy() {
    // this.sse.close();
  }
}
