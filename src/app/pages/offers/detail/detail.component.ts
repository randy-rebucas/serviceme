import { AfterViewInit, Component, OnInit } from '@angular/core';
import { IonRouterOutlet, ModalController, NavParams } from '@ionic/angular';
import { from, Observable, of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { SubSink } from 'subsink';
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
  private subs = new SubSink();

  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    private authService: AuthService,
    private offersService: OffersService,
  ) { }

  ngOnInit() {
    this.title = this.navParams.data.title;
    this.offer$ = of(this.navParams.data.offerData);
  }

  onEdit(offer: Offers) {
    this.subs.sink = from(this.modalController.create({
      component: FormComponent,
      componentProps: {
        title: 'Create Offer',
        offerData: offer,
        state: false
      }
    })).subscribe((modalEl) => {
      modalEl.present();
      this.onDismiss(true);
    });
  }

  onDismiss(state: boolean) {
    this.modalController.dismiss({
      dismissed: state
    });
  }
}
