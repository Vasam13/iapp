import { Routes } from '@angular/router';
// Layouts
import { CondensedComponent } from './@pages/layouts';
import { BlankComponent } from './@pages/layouts';

// Shared Routes
import { LoginComponent } from './@shared/login/login.component';
import { ManageUsersComponent } from './@shared/manage-users/manage-users.component';
import { ManageRolesComponent } from './@shared/manage-roles/manage-roles.component';

// Application Routes
import { SalesComponent } from './@application/sales/sales.component';
import { NewSaleComponent } from './@application/new-sale/new-sale.component';
import { SaleDetailsComponent } from './@application/sale-details/sale-details.component';
import { ClientsComponent } from './@application/clients/clients.component';
import { NewClientComponent } from './@application/new-client/new-client.component';
import { PreferencesComponent } from './@shared/preferences/preferences.component';
import { UnAuthorizedComponent } from './@shared/un-authorized/un-authorized.component';
import { ProjectsComponent } from './@application/projects/projects.component';
import { NewProjectComponent } from './@application/new-project/new-project.component';
import { ContractDrawingsComponent } from './@application/contract-drawings/contract-drawings.component';
import { RfiComponent } from './@application/rfi/rfi.component';
import { CnnComponent } from './@application/cnn/cnn.component';
import { BfaComponent } from './@application/bfa/bfa.component';
import { TasksComponent } from './@application/tasks/tasks.component';
import { EmailActionsComponent } from './@shared/email-actions/email-actions.component';

export const AppRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'sales'
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      }
    ]
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'restricted',
        component: UnAuthorizedComponent
      }
    ]
  },
  {
    path: 'settings',
    component: CondensedComponent,
    children: [
      {
        path: 'preferences',
        component: PreferencesComponent
      }
    ]
  },
  {
    path: 'settings',
    component: CondensedComponent,
    children: [
      {
        path: 'manage-users',
        component: ManageUsersComponent
      }
    ]
  },
  {
    path: 'settings',
    component: CondensedComponent,
    children: [
      {
        path: 'manage-roles',
        component: ManageRolesComponent
      }
    ]
  },
  {
    path: 'settings',
    component: CondensedComponent,
    children: [
      {
        path: 'email-actions',
        component: EmailActionsComponent
      }
    ]
  },
  {
    path: 'sales',
    component: CondensedComponent,
    children: [
      {
        path: '',
        component: SalesComponent
      }
    ]
  },
  {
    path: 'sales',
    component: CondensedComponent,
    children: [
      {
        path: 'new',
        component: NewSaleComponent
      }
    ]
  },
  {
    path: 'sales',
    component: CondensedComponent,
    children: [
      {
        path: ':id',
        component: SaleDetailsComponent
      }
    ]
  },
  {
    path: 'clients',
    component: CondensedComponent,
    children: [
      {
        path: '',
        component: ClientsComponent
      }
    ]
  },
  {
    path: 'clients',
    component: CondensedComponent,
    children: [
      {
        path: ':id',
        component: NewClientComponent
      }
    ]
  },
  {
    path: 'projects',
    component: CondensedComponent,
    children: [
      {
        path: '',
        component: ProjectsComponent
      }
    ]
  },
  {
    path: 'projects',
    component: CondensedComponent,
    children: [
      {
        path: 'details/:id',
        component: NewProjectComponent
      }
    ]
  },
  {
    path: 'projects',
    component: CondensedComponent,
    children: [
      {
        path: 'contract-drawings',
        component: ContractDrawingsComponent
      }
    ]
  },
  {
    path: 'projects',
    component: CondensedComponent,
    children: [
      {
        path: 'rfi',
        component: RfiComponent
      }
    ]
  },
  {
    path: 'projects',
    component: CondensedComponent,
    children: [
      {
        path: 'cnn',
        component: CnnComponent
      }
    ]
  },
  {
    path: 'projects',
    component: CondensedComponent,
    children: [
      {
        path: 'bfa',
        component: BfaComponent
      }
    ]
  },
  {
    path: 'projects',
    component: CondensedComponent,
    children: [
      {
        path: 'tasks',
        component: TasksComponent
      }
    ]
  }
];
