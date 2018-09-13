import {
  LinkConfiguration,
  Row,
  Status,
  Response,
  QueryOperation
} from '@types';
import { CODE } from '@code';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { StoreService } from '@StoreService';
import {
  ColumnMetaData,
  ColumnType,
  DropDownColumn,
  Store,
  DMLResponse
} from '@types';
import { EmailActionsTable } from './../tables/EmailActionsTable';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-email-actions',
  templateUrl: './email-actions.component.html',
  styleUrls: ['./email-actions.component.scss']
})
export class EmailActionsComponent implements OnInit, OnDestroy {
  constructor(private storeService: StoreService) {}
  @ViewChild('contentModal')
  contentModal: ModalDirective;
  @ViewChild('toMailsModal')
  toMailsModal: ModalDirective;
  @ViewChild('ccMailModal')
  ccMailModal: ModalDirective;

  emailActionsStore: Store;
  eventStore: Store;

  ngOnInit() {
    this.eventStore = this.storeService.getInstance('dummy', 'dummy', []);
    this.eventStore.rows = this.getEvents();
    this.emailActionsStore = this.storeService.getInstance(
      'EmailActions',
      'emailactions',
      this.getColumnsMd(),
      {
        autoQuery: true,
        inserAllowed: true,
        updateAllowed: true,
        deleteAllowed: true
      }
    );
  }

  ngOnDestroy() {
    this.emailActionsStore.destroy();
  }

  getColumnsMd = (): ColumnMetaData<EmailActionsTable>[] => {
    return [
      {
        column: EmailActionsTable.datasource,
        title: 'Table Name',
        type: ColumnType.STRING,
        required: true,
        inserAllowed: true,
        updateAllowed: true
      },
      {
        column: EmailActionsTable.event,
        title: 'Event',
        type: ColumnType.DROP_DOWN,
        dropDownConfiguration: {
          store: this.eventStore,
          displayColumn: 'label',
          valueColumn: 'value'
        },
        required: true,
        inserAllowed: true,
        updateAllowed: true
      },
      {
        column: EmailActionsTable.datasource,
        title: 'Condition',
        type: ColumnType.STRING,
        inserAllowed: true,
        updateAllowed: true
      },
      {
        column: EmailActionsTable.toEmails,
        title: 'To Emails',
        type: ColumnType.STRING,
        required: true,
        inserAllowed: true,
        updateAllowed: true
      },
      {
        column: EmailActionsTable.ccEmails,
        title: 'CC Emails',
        type: ColumnType.STRING,
        inserAllowed: true,
        updateAllowed: true
      },
      {
        column: '',
        title: 'Email Content',
        type: ColumnType.LINK,
        linkConfiguration: {
          text: 'View/Edit',
          onClick: (row, md) => {
            this.contentModal.show();
          }
        }
      }
    ];
  }

  getEvents() {
    return [
      {
        label: 'Before Insert',
        value: 'before_insert',
        $operation$: QueryOperation.QUERY
      },
      {
        label: 'After Insert',
        value: 'after_insert',
        $operation$: QueryOperation.QUERY
      },
      {
        label: 'Before Update',
        value: 'before_update',
        $operation$: QueryOperation.QUERY
      },
      {
        label: 'After Update',
        value: 'after_update',
        $operation$: QueryOperation.QUERY
      },
      {
        label: 'Before Delete',
        value: 'before_delete',
        $operation$: QueryOperation.QUERY
      },
      {
        label: 'After Delete',
        value: 'after_delete',
        $operation$: QueryOperation.QUERY
      }
    ];
  }
}
