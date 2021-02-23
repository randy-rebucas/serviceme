import { AfterViewInit, Component, OnInit } from '@angular/core';
import { IonRouterOutlet, ModalController, NavParams } from '@ionic/angular';
import { from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { SubSink } from 'subsink';
import { SettingsService } from '../../settings/settings.service';
import { FormComponent } from '../form/form.component';
import { Offers } from '../offers';
import { OffersService } from '../offers.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  public offer$: Observable<any>;
  public title: string;
  public defaultCurrency: string;
  private subs = new SubSink();

  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    private authService: AuthService,
    private settingsService: SettingsService,
    private offersService: OffersService,
  ) { }

  ngOnInit() {
    this.title = this.navParams.data.title;

    from(this.authService.getCurrentUser()).pipe(
      switchMap((user) => {
        return this.settingsService.getOne(user.uid);
      })
    ).subscribe((settings) => {
      this.defaultCurrency = settings.currency;
    });

    this.offer$ = from(this.authService.getCurrentUser()).pipe(
      switchMap((user) => {
        return this.offersService.getOne(user.uid, this.navParams.data.offerData.id);
      })
    );

    this.offer$.subscribe((r) => {
      console.log(r);
    });
  }

  onEdit(offer: Offers) {
    this.onDismiss(true);
    this.subs.sink = from(this.modalController.create({
      component: FormComponent,
      componentProps: {
        title: 'Update Offer',
        offerData: offer,
        state: false
      }
    })).subscribe((modalEl) => {
      modalEl.present();
    });
  }

  onDismiss(state: boolean) {
    this.modalController.dismiss({
      dismissed: state
    });
  }
}
