import { Injectable, Type } from '@angular/core';
import { AppRoute } from '@types';

@Injectable()
export class DynamicRoutes {
  public static routes: AppRoute[] = [
    {
      path: 'sales',
      component: 'CondensedComponent',
      children: [
        {
          path: '',
          component: 'SalesComponent',
          data: {
            state: 'sales',
            isHome: 'Y',
            roleCodes: ['salesmanager', 'salesperson']
          }
        }
      ]
    }
  ];
}
