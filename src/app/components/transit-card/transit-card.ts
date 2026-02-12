import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransitInfo } from '../../services/trip.service';

@Component({
  selector: 'app-transit-card',
  imports: [CommonModule],
  templateUrl: './transit-card.html',
  styleUrl: './transit-card.css',
})
export class TransitCard {
  @Input() data!: TransitInfo;
  isOpen = false;

  toggle() {
    this.isOpen = !this.isOpen;
  }
}
