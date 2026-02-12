import { Component, HostListener, OnInit, ViewChild, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { SideMenu } from './components/side-menu/side-menu';
import { TripService } from './services/trip.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, Header, Footer, SideMenu],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  @ViewChild('menu') menu!: SideMenu;
  tripService = inject(TripService);
  router = inject(Router);

  touchStartX = 0;
  touchEndX = 0;

  showMainHeader = true;

  ngOnInit() {
    // 預設套用第一個行程的主題
    this.tripService.applyTheme('sports');

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // 如果網址是 '/' (首頁)，就隱藏 Header，否則顯示
        this.showMainHeader = event.url !== '/' && event.url !== '/#';
      });
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(e: TouchEvent) {
    this.touchStartX = e.changedTouches[0].screenX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(e: TouchEvent) {
    this.touchEndX = e.changedTouches[0].screenX;
    this.handleSwipe();
  }

  handleSwipe() {
    const distance = this.touchEndX - this.touchStartX;
    const minSwipe = 60;

    // 取得當前 URL 數字 (例如 /day/1 -> 1)
    const url = this.router.url;

    if (Math.abs(distance) > minSwipe) {
      if (url.includes('/day/')) {
        const currentDay = Number(url.split('/').pop());

        // 左滑 -> 下一天
        if (distance < 0 && currentDay < 10) {
          this.router.navigate(['/day', currentDay + 1]);
        }
        // 右滑 -> 上一天 (如果是 Day 1 就回首頁)
        else if (distance > 0) {
          if (currentDay > 1) {
            this.router.navigate(['/day', currentDay - 1]);
          } else {
            this.router.navigate(['/']);
          }
        }
      } else if (url === '/') {
        // 首頁左滑 -> Day 1
        if (distance < 0) this.router.navigate(['/day', 1]);
      }
    }
  }
}
