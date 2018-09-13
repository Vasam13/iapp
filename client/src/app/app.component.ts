import { URLType } from './@types/types';
import Utils from '@utils';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import RootScope from '@RootScope';
import { RoleCategory, Roles } from '@types';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    const cookie = Utils.getCookie();
    if (!cookie) {
      this.router.navigate(['/login']);
    } else {
      RootScope.userInfo = cookie;
    }
  }
}
