import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gear',
  imports: [CommonModule, FormsModule],
  templateUrl: './gear.html',
  styleUrl: './gear.css',
})
export class Gear implements OnInit {
  items = [
    { id: 'passport', label: '護照', checked: false },
    { id: 'ticket', label: 'WBC 門票', checked: false },
    { id: 'flag', label: '國旗', checked: false },
    { id: 'money', label: '日幣/信用卡', checked: false },
    { id: 'power', label: '行動電源', checked: false },
    { id: 'meds', label: '常備藥', checked: false },
  ];

  ngOnInit() {
    const saved = localStorage.getItem('wbc_gear');
    if (saved) {
      const state = JSON.parse(saved);
      this.items.forEach((i) => {
        if (state[i.id] !== undefined) i.checked = state[i.id];
      });
    }
  }

  saveState() {
    const state = this.items.reduce((acc: any, item) => {
      acc[item.id] = item.checked;
      return acc;
    }, {});
    localStorage.setItem('wbc_gear', JSON.stringify(state));
  }

  resetAll() {
    if (confirm('重置?')) {
      this.items.forEach((i) => (i.checked = false));
      this.saveState();
    }
  }
}
