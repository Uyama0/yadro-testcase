import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { interval } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';

import { TimestampService } from './utils/getCurrentTimestamp';

interface RateDifference {
  [key: string]: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  rates: any;
  previousRates: any = 0;
  rateDifference: RateDifference = {};
  currentTime!: string;

  constructor(
    private http: HttpClient,
    private timestampService: TimestampService
  ) {
    this.getRates();
    interval(3000).subscribe(() => {
      this.previousRates = { ...this.rates };
      this.getRates();
    });
  }

  getRates() {
    if (this.rates) this.previousRates = { ...this.rates };

    this.http
      .get<any>('https://open.er-api.com/v6/latest/RUB')
      .subscribe((data) => {
        this.rates = data.rates;
        this.calculateRateDifference();
        this.currentTime = this.timestampService.getCurrentTimestamp();
      });
  }

  calculateRateDifference(): void {
    if (!this.previousRates || !this.rates) return;

    const rateKeys = Object.keys(this.rates);
    

    for (const key of rateKeys) {
      const rate = this.rates[key];
      const previousRate = this.previousRates[key];
      const difference = (rate - previousRate || 0).toFixed(2);
      this.rateDifference[key] = parseFloat(difference);
    }
  }
}
