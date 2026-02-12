import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TripService } from '../../services/trip.service';

@Component({
  selector: 'app-landing',
  imports: [CommonModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  tripService = inject(TripService);
  router = inject(Router);
  trips = this.tripService.getTrips();

  getBgStyle(bgUrl: string) {
    return `url('${bgUrl}')`;
  }

  goToTrip(tripId: string) {
    // 1. 設定當前行程
    this.tripService.currentTripId.set(tripId);

    // 2. 套用主題
    const trip = this.tripService.getTripById(tripId);
    if (trip) this.tripService.applyTheme(trip.themeId);

    // 3. 跳轉頁面
    this.router.navigate(['/trip', tripId]);
  }
}
