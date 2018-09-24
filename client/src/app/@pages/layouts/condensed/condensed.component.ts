import { Utils } from '@utils';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RootLayout } from '../root/root.component';
import { State } from '@types';

@Component({
  selector: 'condensed-layout',
  templateUrl: './condensed.component.html',
  styleUrls: ['./condensed.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CondensedComponent extends RootLayout implements OnInit {
  displayName: string;
  dpPic: string;
  menuLinks = [];
  currYear: number;

  ngOnInit() {
    this.displayName = Utils.getDisplayName();
    const userInfo = Utils.getUserInfo();
    this.currYear = Utils.getCurrYear();
    this.dpPic = userInfo.avatarUrl || 'assets/img/profiles/avatar.jpg';
    Utils.getMenuStates(this.router).forEach((state: State) => {
      this.menuLinks.push(state.menu);
    });
    const authorizedState = Utils.getAuthorizedState(this.router);
    const routerState = Utils.getStateData(this.router);
    if (
      !authorizedState.state ||
      !routerState ||
      routerState !== authorizedState.state
    ) {
      this.router.navigate([authorizedState.url]);
    }
  }

  _logOut() {
    this.logOut();
  }

  gotoPreferences() {
    this.router.navigate(['/settings/preferences']);
  }
  goHome() {
    this.router.navigate(['/']);
  }
}
