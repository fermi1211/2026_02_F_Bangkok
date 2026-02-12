import { Injectable, signal, computed } from '@angular/core';
import e from 'express';

// 1. 定義主題介面
export interface Theme {
  id: string;
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  fontHead: string; // 標題字體
  fontBody: string; // 內文字體
  backgroundImage: string; // 背景圖紋
}

// 2. 定義行程介面
export interface Trip {
  id: string; // 例如 'wbc2026'
  name: string; // 例如 '2026 WBC 經典賽'
  themeId: string; // 例如 'sports' (對應下方的 THEMES)
  startDate: string; // 用來計算倒數
  days: any[]; // 這裡放原本的 DayItinerary[]

  headerTitle: string; // 例如: "WBC 2026..."
  headerSubtitle: string; // 例如: "TOKYO / MIAMI..."
  headerBg: string; // 背景圖片網址
  countdownLabel: string; // 例如: "GAME START IN"
}

export interface TransitInfo {
  type: 'FLIGHT' | 'TRAIN' | 'BUS' | 'CAR' | 'ARL' | 'MRT'; // 交通工具類型
  route: string;
  timeRange: string;
  duration: string;
  startStation: string;
  endStation: string;
  startDescription?: string;
  startDetail?: string;
  startLocationLink?: string;
  endDescription?: string;
  endDetail?: string;
  endLocationLink?: string;
  price?: string;
  color?: string; // e.g. 'var(--secondary-color)'
  bgColor?: string; // 可選的背景色，預設為白色或透明
  additionalInfo?: string; // 其他補充資訊，例如航班號碼、車次等
  additionalDetail?: string; // 補充資訊的文字顏色，預設為主色或次色
}

export interface Activity {
  time: string;
  title: string;
  desc?: string;
  locationLink?: string;
  transit?: TransitInfo; // 如果這是一個交通行程，就會有這個欄位
}

export interface DayItinerary {
  id: number;
  date: string;
  title: string;
  isGameDay: boolean; // 用來標記比賽日變色
  activities: Activity[];
}

// 3. 預設主題庫 (CSS 樣板)
export const THEMES: Record<string, Theme> = {
  // 5. 曼谷農曆新年 (唐人街霓虹夜色 - 紅、金、霓虹)
  'bkk-cny': {
    id: 'bkk-cny',
    primary: '#B75647', // 泰式奶茶紅 (Thai Tea) - 溫暖不刺眼
    secondary: '#D4AF37', // 香檳金 (Champagne Gold) - 質感金
    accent: '#00695C', // 翡翠綠 (Emerald) - 用來點綴，中和暖色
    bg: '#FFF8E1', // 煉乳奶油色 (Condensed Milk) - 乾淨的淺底
    fontHead: "'Kanit', sans-serif", // 泰國現代圓角字體
    fontBody: "'Quicksand', sans-serif", // 非常圓潤的內文字
    backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")', // 幾何圖騰
  },
};

@Injectable({
  providedIn: 'root',
})
export class TripService {
  // 這裡存放 10 天的所有資料，以後改行程只要改這裡！
  private trips: Trip[] = [
    {
      id: '2026-02-Bangkok',
      name: '2026 過年曼谷',
      themeId: 'bkk-cny',
      startDate: '2026-02-15T13:25:00',
      headerTitle: '2026 過年曼谷',
      headerSubtitle: '2026/02/15 - 2026/02/19',
      headerBg: 'assets/images/2026-02-Bangkok.jpg',
      countdownLabel: '距離出發還有',
      days: [
        {
          id: 1,
          date: '2/15 (日)',
          title: 'Flight to Bangkok',
          isGameDay: true,
          activities: [
            { time: '09:00', title: '台中出發' },
            {
              time: '09:00',
              title: '',
              desc: '',
              transit: {
                type: 'CAR',
                route: 'HOME ➔ TPE',
                timeRange: '09:00 - 11:00',
                duration: '2 HR',
                startStation: 'HOME',
                endStation: '抵達桃園國際機場第二航廈 (T2)',
                startDescription: '出發前往機場',
                startDetail: '建議提前2小時抵達，預留停車和安檢時間',
                endDescription: '星宇航空櫃檯報到',
                endDetail: '請記得攜帶護照與登機證',
                price: 'ETC',
                bgColor: '#e8f5e9',
                color: '#27ae60',
              },
            },
            {
              time: '11:00',
              title: '桃園機場第二航廈 (T2)',
              locationLink: 'https://maps.app.goo.gl/zFzGsL9KXJRAuaiY8#',
            },
            { time: '13:25', title: '航班起飛' },
            {
              time: '13:25',
              title: '',
              desc: '',
              transit: {
                type: 'FLIGHT',
                route: 'TPE ➔ BKK',
                timeRange: '13:25 - 16:30',
                duration: '4 HR 5 MIN',
                startStation: '桃園機場 TPE',
                endStation: '曼谷素萬那普機場 BKK',
                startDescription: '星宇航空 JX745',
                detail: '星宇航空 JX745',
                price: '已開票',
                color: '#9e8252',
                bgColor: '#f9f5eb',
                additionalInfo: '行李額度',
                additionalDetail: '托運 23kg x 2件 / 手提 7kg', 
              },
            },
            { time: '16:30', title: '素萬那普國際機場 (BKK)', desc: '領行李、換錢', locationLink: 'https://maps.app.goo.gl/rNbTznrYLnuyEDev7' },
            {
              time: '18:00',
              title: '',
              desc: '',
              transit: {
                type: 'ARL',
                route: 'Suvarnabhumi ➔ Makkasan',
                timeRange: '18:00 - 18:30',
                duration: '30 MIN',
                startStation: 'Suvarnabhumi Airport (A1)',
                endStation: 'Makkasan Station (A6)',
                startDescription: '位於機場 B1 層，跟著 "Train to City" 指標走',
                startLocationLink: 'https://maps.app.goo.gl/QXK7re3CRbsgwKfdA',
                endDescription: '抵達 Makkasan 站，轉乘地鐵或計程車前往市區',
                endLocationLink: 'https://maps.app.goo.gl/3TVL8NC6kVMAzjW98',
                endDetail: '建議搭乘計程車前往飯店，約 10 分鐘車程',
                detail: 'ARL 機場快綫',
                price: '฿180',
                color: '#a01e28',
                bgColor: '#f9e1e0',
                additionalInfo: 'ARL 機場快綫',
                additionalDetail: '成人 ฿45 x 4人 = ฿180', 
              },
            },
            {
              time: '18:45',
              title: '',
              desc: '',
              transit: {
                type: 'MRT',
                route: 'Phetchaburi ➔ Sukhumvit',
                timeRange: '18:45 - 19:00',
                duration: '15 MIN',
                startStation: 'Phetchaburi Station (BL21)',
                endStation: 'Sukhumvit Station (BL22)',
                startLocationLink: 'https://maps.app.goo.gl/jKPqxqXVFzG2VJbm7',
                endLocationLink: 'https://maps.app.goo.gl/L8BbCjdaETmwGhybA',
                detail: 'MRT 捷運藍線',
                price: '฿68',
                color: '#1565c0',
                bgColor: '#e3f2fd',
                additionalInfo: 'MRT 捷運藍線',
                additionalDetail: '成人 ฿17 x 4人 = ฿68', 
              },
            },
          ],
        },
        {
          id: 2,
          date: '2/16 (一)',
          title: '',
          isGameDay: false,
          activities: [{ time: '18:00', title: 'PLAY BALL !', desc: '全力應援！Team Taiwan！' }],
        },
        {
          id: 3,
          date: '2/17 (二)',
          title: '',
          isGameDay: false,
          activities: [{ time: '18:00', title: 'PLAY BALL !', desc: '全力應援！Team Taiwan！' }],
        },
        {
          id: 4,
          date: '2/18 (三)',
          title: '',
          isGameDay: false,
          activities: [{ time: '18:00', title: 'PLAY BALL !', desc: '全力應援！Team Taiwan！' }],
        },
        {
          id: 5,
          date: '2/19 (四)',
          title: 'Back to Taiwan',
          isGameDay: false,
          activities: [{ time: '18:00', title: 'PLAY BALL !', desc: '全力應援！Team Taiwan！' }],
        },
      ],
    },
  ];

  currentTripId = signal<string>('2026-02-Bangkok');
  currentTrip = computed(() => this.trips.find((t) => t.id === this.currentTripId()));

  getTrips() {
    return this.trips;
  }

  getTripById(id: string) {
    return this.trips.find((t) => t.id === id);
  }

  getDay(tripId: string, dayId: number) {
    const trip = this.getTripById(tripId);
    if (!trip) return undefined;
    return trip.days.find((d) => d.id === dayId);
  }

  // ★★★ 核心功能：切換 CSS 變數 ★★★
  applyTheme(themeId: string) {
    const theme = THEMES[themeId] || THEMES['bkk-cny'];
    const root = document.documentElement.style;

    root.setProperty('--primary-color', theme.primary);
    root.setProperty('--secondary-color', theme.secondary);
    root.setProperty('--accent-color', theme.accent);
    root.setProperty('--bg-color', theme.bg);

    // 設定字體 (需確保 index.html 有引入 Google Fonts)
    document.body.style.fontFamily = theme.fontBody;
    // 設定背景
    document.body.style.backgroundImage = theme.backgroundImage;
    // 設定標題字體 (這比較特別，我們用全域變數存起來給 Component 用)
    root.setProperty('--header-font', theme.fontHead);
  }
}
