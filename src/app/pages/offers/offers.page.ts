import { Component, OnDestroy, OnInit } from '@angular/core';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AuthService } from 'src/app/auth/auth.service';
import { OffersService } from './offers.service';
import { Offers } from './offers';
import { ModalController } from '@ionic/angular';
import { FormComponent } from './form/form.component';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  // observables
  public offers$: Observable<Offers[]>;
  private subs = new SubSink();
  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private offersService: OffersService
  ) { }

  ngOnInit() {
    // get banks subcollections
    this.offers$ = this.authService.getUserState().pipe(
      switchMap((user) =>
        this.offersService.getAll(user.uid)
      )
    );
  }

  onCreate() {
    this.subs.sink = from(this.modalController.create({
      component: FormComponent,
      componentProps: {
        title: 'Create Offer'
      }
    })).subscribe((modalEl) => {
      modalEl.onDidDismiss().then(() => {
        // ionItemSliding.closeOpened();
      });
      modalEl.present();
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
