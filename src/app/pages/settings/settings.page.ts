import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { OffersService } from '../offers/offers.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  public availablityList = [
    { val: 'Monday' },
    { val: 'Tuesday' },
    { val: 'Wednesday' },
    { val: 'Thursday' },
    { val: 'Friday' },
    { val: 'Saturday' },
    { val: 'Sunday' }
  ];

  public availablities$: Observable<any[]>;
  public availablities: any[];

  constructor(
    private offersService: OffersService
  ) { }

  ngOnInit() {
    this.availablities$ = this.offersService.getAvailabilities();
    this.availablities$.subscribe((availablities) => {
      console.log(availablities);
      this.availablities = availablities;
    });
  }

  onPickAvailability(event: CustomEvent, availability: any) {
    if (event.detail.checked) {
      this.availablities.push(availability);
      this.offersService.setAvailabilities(this.availablities);
    } else {
      const updatedAvailablities = this.availablities.filter(item => item.val !== availability.val);
      this.offersService.setAvailabilities(updatedAvailablities);
    }
  }
}
