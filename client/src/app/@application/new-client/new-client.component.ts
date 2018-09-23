import { DataUtils } from './../data';
import { Row } from '@types';
import { Store, QueryOperation, Status } from '@types';
import { MessageService } from '@message';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { StoreService } from '@StoreService';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import {Utils} from '@utils';
import { ClientsTable } from '../tables/ClientsTable';
import ClientsType from '../tables/types/ClientsType';

@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.scss']
})
export class NewClientComponent implements OnInit, OnDestroy {
  constructor(
    private storeService: StoreService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private message: MessageService
  ) {
    this.route.params.subscribe(params => (this.clientId = params.id));
  }

  public clientForm: FormGroup;
  clientStore: Store;
  countryStore: Store;
  statesStore: Store;
  public clientId: any;

  gotoClients() {
    this.router.navigate(['/clients']);
  }

  ngOnDestroy() {
    this.clientStore.destroy();
    this.countryStore.destroy();
    this.statesStore.destroy();
  }
  ngOnInit() {
    this.clientStore = this.storeService.getInstance('Clients', 'clients', []);
    this.countryStore = this.storeService.getInstance(
      'Countries',
      'countries',
      [],
      {
        autoQuery: true,
        skipOrderBy: true
      }
    );
    this.statesStore = this.storeService.getInstance('States', 'states', [], {
      skipOrderBy: true
    });
    this.statesStore.whereClause = 'country_id = ?';
    this.clientForm = this.formBuilder.group({
      clientDetails: this.formBuilder.group(this.formFromObject('ClientsType'))
    });
    if (this.clientId !== 'new') {
      this.clientStore.whereClause = 'client_id = ?';
      this.clientStore.whereClauseParams = [this.clientId];
      this.clientStore.query().then(res => {
        if (res.status !== Status.SUCCESS || res.rows.length === 0) {
          Utils.notifyError(
            this.message,
            'Error',
            'No such Client found for Id ' + this.clientId
          );
          this.router.navigate(['/clients']);
        } else {
          this.copyRowToForm('clientDetails', res.rows[0]);
          const clientRow: ClientsType = <ClientsType>res.rows[0];
          if (!this.countryStore.rows || this.countryStore.rows.length === 0) {
            this.countryStore.query().then(() => {
              this.queryStates(clientRow);
            });
          } else {
            this.queryStates(clientRow);
          }
        }
      });
    }
  }

  queryStates(clientRow) {
    if (clientRow.country) {
      const country = this.filterCountry(clientRow.country);
      if (country) {
        this.statesStore.whereClauseParams = [country.id];
        this.statesStore.query();
      }
    }
  }

  filterCountry(countryName: string) {
    if (this.countryStore && this.countryStore.rows) {
      const selectedCoutries = this.countryStore.rows.filter(
        _country => _country.name === countryName
      );
      if (selectedCoutries.length > 0) {
        return selectedCoutries[0];
      }
    }
  }

  onCountryChange(open: string) {
    if (!open) {
      const country = this.clientForm.value.clientDetails.country;
      if (!country) {
        return;
      }
      if (this.countryStore && this.countryStore.rows) {
        const selectedCoutries = this.countryStore.rows.filter(
          _country => _country.name === country
        );
        if (selectedCoutries.length > 0) {
          const form = this.clientForm.controls['clientDetails'] as FormGroup;
          form.controls['state'].setValue(null);
          this.statesStore.whereClause = 'country_id = ?';
          this.statesStore.whereClauseParams = [selectedCoutries[0].id];
          this.statesStore.query();
        }
      }
    }
  }

  copyRowToForm(formGroup: string, currentRow: Row) {
    const formRow = this.clientForm.value[formGroup];
    Object.keys(currentRow).forEach(key => {
      if (formRow.hasOwnProperty(key)) {
        const form = this.clientForm.controls[formGroup] as FormGroup;
        form.controls[key].setValue(currentRow[key]);
      }
    });
  }

  save() {
    if (this.clientForm.valid) {
      const row: ClientsType = this.clientForm.value.clientDetails;
      row.$operation$ = QueryOperation.INSERT;
      if (row.clientId) {
        row.$operation$ = QueryOperation.UPDATE;
      }
      this.clientStore
        .saveRows([this.clientForm.value.clientDetails])
        .then(res => {
          // Utils.notifySuccess(this.message, 'Error', 'Please fill required fields');
          this.router.navigate(['/clients']);
        });
    } else {
      Utils.notifyError(this.message, 'Error', 'Please fill required fields');
    }
  }

  formFromObject(dataClass: string) {
    const clientProfileColumns = DataUtils.getTypeParams(dataClass);
    const formGroup = {};
    clientProfileColumns.forEach(element => {
      formGroup[element] = new FormControl();
    });
    return formGroup;
  }

  isFieldValid(field: string) {
    const form = this.clientForm.controls['clientDetails'] as FormGroup;
    const control = form.controls[field];
    return control.invalid && (control.dirty || control.touched);
  }
}
