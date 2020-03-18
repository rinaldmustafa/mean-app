import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private authListeneserSubs: Subscription;
  isUserAuth = false;
  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.isUserAuth = this.auth.getIsAuth();
    this.authListeneserSubs = this.auth.getAuthStateListener()
      .subscribe(isAuthenticated => {
        this.isUserAuth = isAuthenticated;
      });
  }

  ngOnDestroy() {
    this.authListeneserSubs.unsubscribe();
  }

  onLogOut() {
    this.auth.logOut();
  }
}
