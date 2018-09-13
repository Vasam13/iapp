import { Roles, RoleCategory, URLType } from '@types';
import RootScope from '@RootScope';
import Utils from '@utils';
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { RootLayout } from '../root/root.component';

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

  manageRoles = {
    label: 'Manage Roles',
    routerLink: '/settings/manage-roles',
    iconType: 'icon',
    iconName: 'organization'
  };
  manageUsers = {
    label: 'Manage Users',
    routerLink: '/settings/manage-users',
    iconType: 'icon',
    iconName: 'people'
  };

  emailActions = {
    label: 'Email Actions',
    routerLink: '/settings/email-actions',
    iconType: 'icon',
    iconName: 'envelope'
  };

  sales = {
    label: 'Sales',
    details: 'View sales data',
    routerLink: '/sales',
    iconType: 'icon',
    iconName: 'chart',
    thumbNailClass: 'bg-primary'
  };

  clients = {
    label: 'Clients',
    details: 'Manage clients',
    routerLink: '/clients',
    iconType: 'icon',
    iconName: 'people',
    thumbNailClass: 'bg-primary'
  };

  projects = {
    label: 'Projects',
    details: 'View Projects data',
    routerLink: '/projects',
    iconType: 'icon',
    iconName: 'grid',
    thumbNailClass: 'bg-primary'
  };

  contractDrawings = {
    label: 'Drawings',
    routerLink: '/projects/contract-drawings',
    iconType: 'icon',
    iconName: 'vector'
  };

  rfi = {
    label: 'RFI',
    routerLink: '/projects/rfi',
    iconType: 'icon',
    iconName: 'envelope'
  };
  cnn = {
    label: 'CNN',
    routerLink: '/projects/cnn',
    iconType: 'icon',
    iconName: 'people'
  };
  bfa = {
    label: 'BFA',
    routerLink: '/projects/bfa',
    iconType: 'icon',
    iconName: 'layers'
  };

  tasks = {
    label: 'Taks',
    routerLink: '/projects/tasks',
    iconType: 'icon',
    iconName: 'list'
  };

  ngOnInit() {
    this.displayName = Utils.getDisplayName();
    const userInfo = Utils.getUserInfo();
    this.currYear = Utils.getCurrYear();
    this.dpPic = userInfo.avatarUrl || 'assets/img/profiles/avatar.jpg';
    let hasAnyRole = false;

    const hasSales = Utils.hasRoleCategory(RoleCategory.SALES);
    const hasProjects = Utils.hasRoleCategory(RoleCategory.PROJECTS);
    const isAdmin = Utils.hasRole(Roles.ADMINISTRATOR);
    if (!(hasSales || hasProjects || isAdmin)) {
      this.router.navigate(['/restricted']);
      return;
    } else if (
      isAdmin &&
      !Utils.urlIsOf(this.router, [URLType.ADMINISTRATOR])
    ) {
      this.router.navigate(['/settings/manage-users']);
      return;
    } else if (
      hasSales &&
      !hasProjects &&
      !Utils.urlIsOf(this.router, [URLType.SALES, URLType.CLIENTS])
    ) {
      this.router.navigate(['/sales']);
      return;
    } else if (
      hasProjects &&
      !hasSales &&
      !Utils.urlIsOf(this.router, [URLType.PROJECTS])
    ) {
      this.router.navigate(['/projects']);
      return;
    }

    if (
      Utils.hasAnyRole([Roles.SALES_MANAGER, Roles.SALES_PERSON]) &&
      hasSales
    ) {
      hasAnyRole = true;
      this.menuLinks.push(this.sales);
      this.menuLinks.push(this.clients);
    }
    if (
      Utils.hasAnyRole([Roles.ESTIMATOR, Roles.ESTIMATION_MANAGER]) &&
      hasSales
    ) {
      this.menuLinks.push(this.sales);
      hasAnyRole = true;
    }
    if (
      Utils.hasAnyRole([Roles.PROJECT_MANAGER, , Roles.TEAM_LEAD]) &&
      hasProjects
    ) {
      this.menuLinks.push(this.projects);
      this.menuLinks.push(this.contractDrawings);
      this.menuLinks.push(this.rfi);
      this.menuLinks.push(this.cnn);
      this.menuLinks.push(this.bfa);
      this.menuLinks.push(this.tasks);
      hasAnyRole = true;
    }
    if (Utils.hasAnyRole([Roles.ADMINISTRATOR])) {
      hasAnyRole = true;
      this.menuLinks.push(this.manageRoles);
      this.menuLinks.push(this.manageUsers);
      this.menuLinks.push(this.emailActions);
    }
  }

  _logOut() {
    this.logOut();
  }

  gotoPreferences() {
    this.router.navigate(['/settings/preferences']);
  }
}
