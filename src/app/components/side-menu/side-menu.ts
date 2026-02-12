import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterLink } from '@angular/router'; // 引入 NavigationEnd
import { TripService, THEMES } from '../../services/trip.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-side-menu',
  imports: [CommonModule, RouterLink],
  templateUrl: './side-menu.html',
  styleUrl: './side-menu.css',
})
export class SideMenu {
  @Output() closeMenu = new EventEmitter<void>();
  isOpen = false;

  // 注入 Service 與 Router
  tripService = inject(TripService);
  private router = inject(Router);
  trips = this.tripService.getTrips();

  ngOnInit() {
    // ★★★ 關鍵邏輯：監聽路由變化，自動更新 active 狀態 ★★★
    // 這樣就算重新整理網頁，選單也會亮在正確的位置
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.syncActiveTripFromUrl(event.urlAfterRedirects);
      });

    // 初始化時也要跑一次 (針對重新整理的情況)
    this.syncActiveTripFromUrl(this.router.url);
  }

  // ★★★ 新增：回首頁邏輯 ★★★
  goHome() {
    this.router.navigate(['/']); // 回到根目錄
    this.tripService.currentTripId.set(''); // 清空選中狀態 (可選)
    this.close();
  }

  // 從網址解析出 tripId (例如 /trip/wbc2026/day/1 -> wbc2026)
  private syncActiveTripFromUrl(url: string) {
    if (url.includes('/trip/')) {
      const parts = url.split('/');
      const tripIndex = parts.indexOf('trip');
      if (tripIndex !== -1 && parts[tripIndex + 1]) {
        const tripIdFromUrl = parts[tripIndex + 1];

        // 更新 Service 裡的 Signal
        // 這樣 HTML 裡的 [class.active] 就會自動偵測到變化
        this.tripService.currentTripId.set(tripIdFromUrl);

        // 順便確保主題正確 (防止重新整理後主題跑掉)
        const trip = this.tripService.getTripById(tripIdFromUrl);
        if (trip) {
          this.tripService.applyTheme(trip.themeId);
        }
      }
    }
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }
  close() {
    this.isOpen = false;
    this.closeMenu.emit();
  }

  selectTrip(tripId: string) {
    // 設定 Signal
    this.tripService.currentTripId.set(tripId);

    // 取得資料並套用主題
    const trip = this.tripService.getTripById(tripId);
    if (trip) {
      this.tripService.applyTheme(trip.themeId);
    }

    // 跳轉頁面
    this.router.navigate(['/trip', tripId]);
    this.close();
  }

  getThemeColor(themeId: string) {
    const theme = THEMES[themeId];
    // 如果找不到主題，預設給個灰色
    return theme ? theme.primary : '#ccc';
  }
}
