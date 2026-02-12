import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TripService } from '../../services/trip.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit, OnDestroy {
  @Output() toggleMenu = new EventEmitter<void>();

  public tripService = inject(TripService);
  private cdr = inject(ChangeDetectorRef);

  targetDate: number = 0;
  timeLeft = { days: '00', hours: '00', mins: '00', secs: '00' };
  private intervalId: any;
  backgroundStyle: string = '';

  constructor() {
    effect(() => {
      const trip = this.tripService.currentTrip();
      if (trip) {
        this.backgroundStyle = `linear-gradient(to bottom right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url('${trip.headerBg}')`;
        this.targetDate = new Date(trip.startDate).getTime();
        this.updateTimer();
      }
    });
  }

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.updateTimer();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  updateTimer() {
    if (!this.targetDate) return;

    const now = new Date().getTime();
    const distance = this.targetDate - now;

    if (distance < 0) {
      this.timeLeft = { days: '00', hours: '00', mins: '00', secs: '00' };
      this.cdr.markForCheck();
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.timeLeft = {
      days: days.toString().padStart(2, '0'),
      hours: hours.toString().padStart(2, '0'),
      mins: minutes.toString().padStart(2, '0'),
      secs: seconds.toString().padStart(2, '0'),
    };
    this.cdr.markForCheck();
  }
}
