import { URLType } from './@types/types';
import { Utils } from '@utils';
import {
  Component,
  OnInit,
  ViewContainerRef,
  ComponentFactoryResolver
} from '@angular/core';
import { Router, Routes, Route } from '@angular/router';
import RootScope from '@RootScope';
import { RoleCategory, Roles } from '@types';
import { DynamicRoutes } from './@types/dynamic-routes';
import { ComponentUtility } from './@types/components';
// import { CondensedComponent } from './@pages/layouts';
import { SalesComponent } from './@application/sales/sales.component';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    public viewContainerRef: ViewContainerRef
  ) {
    DynamicRoutes.routes.forEach(appRoute => {
      // const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      //   SalesComponent
      // );
      // viewContainerRef.clear();
      // const componentRef = viewContainerRef.createComponent(componentFactory);
      appRoute.component = SalesComponent;
      // ComponentUtility.getInstance(appRoute.component);
      if (appRoute.children.length > 0) {
        appRoute.children.forEach(element => {
          // const componentFactory2 = this.componentFactoryResolver.resolveComponentFactory(
          //   SalesComponent
          // );
          // viewContainerRef.clear();
          // const componentRef2 = viewContainerRef.createComponent(
          //   componentFactory2
          // );
          element.component = SalesComponent;
          ComponentUtility.getInstance(element.component);
        });
      }
      this.router.config.unshift(<Route>appRoute);
    });
  }

  ngOnInit() {
    const cookie = Utils.getCookie();
    if (!cookie) {
      this.router.navigate(['/login']);
    } else {
      RootScope.userInfo = cookie;
    }
  }
}
