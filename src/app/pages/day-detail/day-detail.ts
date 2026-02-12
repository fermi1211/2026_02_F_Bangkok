import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TripService, DayItinerary } from '../../services/trip.service';
import { TransitCard } from '../../components/transit-card/transit-card';

@Component({
  selector: 'app-day-detail',
  imports: [CommonModule, TransitCard],
  templateUrl: './day-detail.html',
  styleUrl: './day-detail.css',
})
export class DayDetail implements OnInit {
  themeId: string = 'sports'; // 新增 themeId 屬性，預設 sports
  dayData?: DayItinerary;
  currentTripId: string = ''; // 1. 新增這個屬性來存 ID

  constructor(
    private route: ActivatedRoute,
    private tripService: TripService,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const dayId = Number(params.get('dayId'));

      this.route.parent?.paramMap.subscribe((parentParams) => {
        const tripId = parentParams.get('tripId');

        if (tripId && dayId) {
          this.currentTripId = tripId;

          // 1. 取得行程資料
          const trip = this.tripService.getTripById(tripId);
          if (trip) {
            // 2. 抓取該行程的主題 ID
            this.themeId = trip.themeId;

            // 3. 確保全域變數 (字體/顏色) 也有被套用 (防止使用者直接輸入網址進入)
            this.tripService.applyTheme(trip.themeId);

            // 4. 抓取該天行程
            this.dayData = trip.days.find((d: any) => d.id === dayId);
          }
        }
      });
    });
  }
}
