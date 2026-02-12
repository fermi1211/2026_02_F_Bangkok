import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TripService } from '../../services/trip.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  public tripService = inject(TripService); // 改成 public 讓 HTML 可以讀取
  private route = inject(ActivatedRoute);

  days: any[] = [];
  tripName: string = '';

  ngOnInit() {
    this.route.parent?.paramMap.subscribe(params => {
      const tripId = params.get('tripId');
      
      if (tripId) {
        this.tripService.currentTripId.set(tripId);

        const trip = this.tripService.getTripById(tripId);
        if (trip) {
          this.days = trip.days;
          this.tripName = trip.name;
          this.tripService.applyTheme(trip.themeId);
        }
      }
    });
  }
}
