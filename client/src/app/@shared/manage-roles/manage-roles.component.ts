import { Component, OnInit, OnDestroy } from '@angular/core';
import { StoreService } from '@StoreService';
import {
  ColumnMetaData,
  ColumnType,
  DropDownColumn,
  Row,
  QueryOperation
} from '@types';
import { Store, DMLResponse, Response, Status } from '@types';
import { RolesTable } from './../tables/RolesTable';
import { FunctionsTable } from './../tables/FunctionsTable';
import { CODE } from '@code';

@Component({
  selector: 'app-manage-roles',
  templateUrl: './manage-roles.component.html',
  styleUrls: ['./manage-roles.component.scss']
})
export class ManageRolesComponent implements OnInit, OnDestroy {
  constructor(private storeService: StoreService) {}

  roleCategoryStore: Store = this.storeService.getInstance(
    'RoleCategory',
    'rolecategory',
    [],
    {
      autoQuery: true
    }
  );

  roleColumns: ColumnMetaData<RolesTable>[] = [
    {
      column: RolesTable.roleName,
      title: 'Role Name',
      type: ColumnType.STRING,
      required: true,
      inserAllowed: true,
      updateAllowed: true
    },
    {
      column: RolesTable.roleCode,
      title: 'Role Code',
      type: ColumnType.STRING,
      required: true,
      inserAllowed: true,
      updateAllowed: false
    },
    {
      column: RolesTable.roleCategory,
      title: 'Role Category',
      type: ColumnType.DROP_DOWN,
      required: true,
      inserAllowed: true,
      updateAllowed: true,
      dropDownConfiguration: {
        store: this.roleCategoryStore,
        displayColumn: 'categoryName',
        valueColumn: 'categoryName'
      }
    }
  ];

  functionsColumns: ColumnMetaData<FunctionsTable>[] = [
    {
      column: FunctionsTable.functionName,
      title: 'Function',
      type: ColumnType.STRING,
      required: true,
      inserAllowed: true,
      updateAllowed: true
    },
    {
      column: FunctionsTable.functionCode,
      title: 'Function Code',
      type: ColumnType.STRING,
      required: true,
      inserAllowed: true,
      updateAllowed: false
    }
  ];

  rolesStore: Store = this.storeService.getInstance(
    'Roles',
    'roles',
    this.roleColumns,
    {
      autoQuery: true,
      inserAllowed: true,
      updateAllowed: true,
      deleteAllowed: true
    }
  );

  functionsStore: Store = this.storeService.getInstance(
    'Functions',
    'functions',
    this.functionsColumns,
    {
      autoQuery: true,
      inserAllowed: true,
      updateAllowed: true,
      deleteAllowed: true
    }
  );

  ngOnInit() {
    // this.functionsStore.beforeSave = (dirtyRows: Row[]) => {
    //   const role = this.rolesStore.getCurrentRow();
    //   const response: Response = {
    //     status: Status.SUCCESS,
    //     responseCode: CODE.ERR_BERORE_DML,
    //     message: ''
    //   };
    //   for (let i = 0; i < dirtyRows.length; i++) {
    //     const dirtyRow = dirtyRows[i];
    //     if (dirtyRow.$operation$ !== QueryOperation.DELETE) {
    //       if (role && role.roleId) {
    //         dirtyRows[i].roleId = role.roleId;
    //       } else {
    //         response.status = Status.ERROR;
    //         response.message = 'Please save/select roles first';
    //         break;
    //       }
    //     }
    //   }
    //   return response;
    // };
  }
  ngOnDestroy() {
    this.rolesStore.destroy();
    this.roleCategoryStore.destroy();
    this.functionsStore.destroy();
  }
}
