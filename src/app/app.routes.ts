import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Home } from './pages/home/home';
import { DayDetail } from './pages/day-detail/day-detail';
import { Gear } from './pages/gear/gear';
import { Notes } from './pages/notes/notes';

export const routes: Routes = [
  { path: '', component: Landing },
  {
    path: 'trip/:tripId',
    children: [
      { path: '', component: Home },
      { path: 'day/:dayId', component: DayDetail }, // 動態路由！
      { path: 'gear', component: Gear },
      { path: 'notes', component: Notes },
      { path: '**', redirectTo: '' }, // 找不到頁面導回首頁
    ],
  },
  { path: '**', redirectTo: '' },
];
