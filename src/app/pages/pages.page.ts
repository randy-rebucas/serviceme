import { Component, OnDestroy, OnInit } from '@angular/core';
import { from, Observable } from 'rxjs';
import firebase from 'firebase/app';
import { SubSink } from 'subsink';
import { AuthService } from '../auth/auth.service';
import { AlertController, IonMenuToggle, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-pages',
  templateUrl: './pages.page.html',
  styleUrls: ['./pages.page.scss'],
})
export class PagesPage implements OnInit, OnDestroy {

  public pages = [
    {
      title: 'Settings',
      url: '/pages/settings',
      icon: 'settings',
      param: 'settings'
    },
    {
      title: 'History',
      url: '/pages/history',
      icon: 'reader',
      param: 'history'
    },
    {
      title: 'Terms of use',
      url: '/pages/terms-of-use',
      icon: 'information',
      param: 'terms-of-use'
    },
    {
      title: 'Privacy Policy',
      url: '/pages/privacy-policy',
      icon: 'help',
      param: 'privacy-policy'
    },
    {
      title: 'Logout',
      url: null,
      icon: 'power'
    }
  ];

  public user$: Observable<firebase.User>;
  public subs = new SubSink();
  constructor(
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.user$ = from(this.authService.getCurrentUser());
  }

  onClick(url: any) {
    if (url != null) {
      this.router.navigateByUrl(url);
    } else {
      this.logoutPrompt();
    }
  }

  logoutPrompt() {
    this.subs.sink = from(this.alertController.create({
      header: 'Confirmation Logout',
      message: 'Are you sure to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        }, {
          text: 'Yes',
          handler: () => {
            this.authService.signOut().then(() => {
              this.router.navigate(['/auth']);
            });
          }
        }
      ]
    })).subscribe((alertEl) => {
      alertEl.present();
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
