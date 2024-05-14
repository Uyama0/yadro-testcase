import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { interval } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { TimestampService } from './utils/getCurrentTimestamp';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  rates: any;
  previousRates: any;
  data: any;

  constructor(private http: HttpClient, private timestampService: TimestampService) {
    this.getRates();
    interval(60000).subscribe(() => {
      this.previousRates = { ...this.rates };
      console.log(this.previousRates);
      this.getRates();
    });
  }

  getRates() {
    if (this.rates) this.previousRates = { ...this.rates };
    console.log(this.previousRates);

    this.http
      .get<any>('https://open.er-api.com/v6/latest/RUB')
      .subscribe((data) => {
        console.log(data);

        this.rates = data.rates;
        this.data = data;
      });
  }

  getCurrentTimestamp(): string {
    return this.timestampService.getCurrentTimestamp()
  }
}
