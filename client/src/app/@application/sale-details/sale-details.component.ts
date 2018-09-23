import { Row, QueryOperation, Roles, Functions, LeadStatus } from '@types';
import { MessageService } from '@message';
import { Utils } from '@utils';
import { Store, Status } from '@types';
import { StoreService } from '@StoreService';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import ClientsType from './../tables/types/ClientsType';
import SalesType from './../tables/types/SalesType';
import EstimationsType from './../tables/types/EstimationsType';
import QuotesType from './../tables/types/QuotesType';
import { DataUtils } from '../data';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-sale-details',
  templateUrl: './sale-details.component.html',
  styleUrls: ['./sale-details.component.scss']
})
export class SaleDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('closeLeadModal')
  closeLeadModal: ModalDirective;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService,
    private message: MessageService,
    private formBuilder: FormBuilder
  ) {
    this.route.params.subscribe(params => (this.saleId = params.id));
  }
  startEstimate = false;
  startQuotaion = false;
  public saleId: number;

  salesStore: Store;
  clientStore: Store;
  estimationStore: Store;
  quotesStore: Store;
  salesPersonStore: Store;
  estimationLeadsStore: Store;
  estimatorsStore: Store;
  countryStore: Store;
  statesStore: Store;
  exclusionsInclusionsStore: Store;

  estimations: EstimationsType[] = [];
  quotations: QuotesType[] = [];
  countryChanged: boolean;

  salesForm: FormGroup;

  salesRow: SalesType;
  clientRow: ClientsType;
  estimationsRow: EstimationsType;
  leadFinalStatus: string;

  requirements = ['Structural', 'Engineering', 'Miscellaneous'];

  leadCloseStatus = [
    { status: LeadStatus.CLOSED_WIN, label: 'Win' },
    { status: LeadStatus.CLOSED_LOSE, label: 'Lose' }
  ];

  estimationEditing = false;
  quotationEditing = false;

  isPageBusy() {
    return (
      this.salesStore.isBusy ||
      this.clientStore.isBusy ||
      this.estimationStore.isBusy ||
      this.quotesStore.isBusy ||
      this.salesPersonStore.isBusy ||
      this.estimationLeadsStore.isBusy ||
      this.estimatorsStore.isBusy ||
      this.countryStore.isBusy ||
      this.statesStore.isBusy ||
      this.exclusionsInclusionsStore.isBusy
    );
  }

  filter(type: string) {
    const filtered = [];
    if (this.exclusionsInclusionsStore.rows) {
      this.exclusionsInclusionsStore.rows.forEach(row => {
        if (row.type === type) {
          filtered.push(row);
        }
      });
    }
    return filtered;
  }

  isSalesManager() {
    return Utils.hasAnyRole([Roles.SALES_MANAGER]);
  }

  isEstimationManager() {
    return Utils.hasAnyRole([Roles.ESTIMATION_MANAGER]);
  }

  isEstimatior() {
    return Utils.hasAnyRole([Roles.ESTIMATION_MANAGER, Roles.ESTIMATOR]);
  }

  visibleSaveAsDraftBtn() {
    if (Utils.hasAnyRole([Roles.SALES_PERSON, Roles.SALES_MANAGER])) {
      if (this.salesRow && this.salesRow.status) {
        if (this.salesRow.status === LeadStatus.DRAFT) {
          return true;
        }
      }
    }
    return false;
  }

  visibleSalesPublishBtn() {
    if (Utils.hasAnyRole([Roles.SALES_PERSON, Roles.SALES_MANAGER])) {
      if (this.salesRow && this.salesRow.status) {
        if (
          this.salesRow.status === LeadStatus.DRAFT ||
          this.salesRow.status === LeadStatus.OPEN
        ) {
          return true;
        }
      }
    }
    return false;
  }

  visiableSendForEstimationBtn() {
    return this.visibleSalesPublishBtn();
  }

  visibleOldEstimations() {
    if (Utils.hasAnyRole([Roles.SALES_PERSON, Roles.SALES_MANAGER])) {
      if (this.salesRow && this.salesRow.status) {
        if (
          (this.salesRow.status === LeadStatus.REQUEST_FOR_QUOTATION ||
            this.salesRow.status === LeadStatus.QUOTED) &&
          this.quotations.length > 0
        ) {
          return true;
        }
      }
    }
  }
  visibleOldQuotations() {
    if (Utils.hasAnyRole([Roles.ESTIMATOR, Roles.ESTIMATION_MANAGER])) {
      if (this.salesRow && this.salesRow.status) {
        if (
          (this.salesRow.status === LeadStatus.REQUEST_FOR_ESTIMATION ||
            this.salesRow.status === LeadStatus.ESTIMATED) &&
          this.estimations.length > 0
        ) {
          return true;
        }
      }
    }
  }
  visibleSaveEstimationBtn() {
    if (Utils.hasAnyRole([Roles.ESTIMATOR, Roles.ESTIMATION_MANAGER])) {
      if (this.salesRow && this.salesRow.status) {
        if (
          (this.salesRow.status === LeadStatus.REQUEST_FOR_ESTIMATION ||
            this.salesRow.status === LeadStatus.ESTIMATED) &&
          this.estimationEditing
        ) {
          return true;
        }
      }
    }
    return false;
  }

  visibleStartEstimationBtn() {
    if (Utils.hasAnyRole([Roles.ESTIMATOR, Roles.ESTIMATION_MANAGER])) {
      if (this.salesRow && this.salesRow.status) {
        if (
          (this.salesRow.status === LeadStatus.REQUEST_FOR_ESTIMATION ||
            this.salesRow.status === LeadStatus.ESTIMATED) &&
          !this.estimationEditing
        ) {
          return true;
        }
      }
    }
    return false;
  }

  visibleCompleteEstimationBtn() {
    return this.visibleSaveEstimationBtn();
  }

  visibleStartQuoteBtn() {
    if (Utils.hasAnyRole([Roles.SALES_PERSON, Roles.SALES_MANAGER])) {
      if (this.salesRow && this.salesRow.status) {
        if (
          (this.salesRow.status === LeadStatus.REQUEST_FOR_QUOTATION ||
            this.salesRow.status === LeadStatus.QUOTED) &&
          !this.quotationEditing
        ) {
          return true;
        }
      }
    }
    return false;
  }

  visibleCompleteQuoteBtn() {
    if (Utils.hasAnyRole([Roles.SALES_PERSON, Roles.SALES_MANAGER])) {
      if (this.salesRow && this.salesRow.status) {
        if (
          (this.salesRow.status === LeadStatus.REQUEST_FOR_QUOTATION ||
            this.salesRow.status === LeadStatus.QUOTED) &&
          this.quotationEditing
        ) {
          return true;
        }
      }
    }
    return false;
  }
  visibleCloseLeadeBtn() {
    if (Utils.hasAnyRole([Roles.SALES_PERSON, Roles.SALES_MANAGER])) {
      if (this.salesRow && this.salesRow.status) {
        if (
          this.salesRow.status === LeadStatus.QUOTED &&
          this.estimations.length > 0 &&
          !this.quotationEditing
        ) {
          return true;
        }
      }
    }
    return false;
  }

  _saveSalesRow(salesRow: SalesType) {
    salesRow.$operation$ = QueryOperation.UPDATE;
    salesRow.bidType = this.arrayToString(salesRow.bidType);
    this.salesStore.saveRows([<Row>salesRow]).then(_res => {
      if (_res.rows[0].$status$ === Status.SUCCESS) {
        Utils.notifyInfo(this.message, 'Success', 'Lead saved!');
        this.gotoSales();
      }
    });
  }

  saveAsDraft() {
    if (this.isFormValid()) {
      const salesRow: SalesType = this.salesForm.value.projectDetails;
      salesRow.status = LeadStatus.DRAFT;
      this._saveSalesRow(salesRow);
    }
  }
  publishLead() {
    if (this.isFormValid()) {
      const salesRow: SalesType = this.salesForm.value.projectDetails;
      salesRow.status = LeadStatus.OPEN;
      this._saveSalesRow(salesRow);
    }
  }
  sendLeadForEstimation() {
    if (this.isFormValid()) {
      const salesRow: SalesType = this.salesForm.value.projectDetails;
      salesRow.status = LeadStatus.REQUEST_FOR_ESTIMATION;
      this._saveSalesRow(salesRow);
    }
  }
  startEstimation() {
    this.estimationEditing = true;
  }

  startQuotation() {
    this.quotationEditing = true;
  }

  assignEstimaor() {
    // if (this.isFormValid()) {
    const salesRow: SalesType = this.salesForm.value.projectDetails;
    if (!salesRow.estimator) {
      Utils.notifyError(this.message, 'Error', 'Please select an estimator');
      return;
    }
    this._saveSalesRow(salesRow);
    // }
  }

  _saveEstimationsRow(salesRow: SalesType, estimateRow: EstimationsType) {
    estimateRow.$operation$ = QueryOperation.UPDATE;
    if (!estimateRow.id) {
      estimateRow.$operation$ = QueryOperation.INSERT;
    }
    estimateRow.salesId = salesRow.salesId;
    estimateRow.mainSteelInclusions = this.arrayToString(
      estimateRow.mainSteelInclusions
    );
    estimateRow.mainSteelExclusions = this.arrayToString(
      estimateRow.mainSteelExclusions
    );
    estimateRow.miscSteelInclusions = this.arrayToString(
      estimateRow.miscSteelInclusions
    );
    estimateRow.miscSteelExclusions = this.arrayToString(
      estimateRow.miscSteelExclusions
    );
    salesRow.$operation$ = QueryOperation.UPDATE;
    salesRow.bidType = this.arrayToString(salesRow.bidType);
    this.salesStore.saveRows([<Row>salesRow]).then(() => {
      this.estimationStore.saveRows([<Row>estimateRow]).then(_res => {
        if (_res.rows && _res.rows.length > 0) {
          if (_res.rows[0].$status$ === Status.SUCCESS) {
            Utils.notifyInfo(this.message, 'Success', 'Estimation saved!');
            this.gotoSales();
          }
        }
      });
    });
  }

  saveEstimation() {
    if (this.isFormValid()) {
      const salesRow: SalesType = this.salesForm.value.projectDetails;
      salesRow.status = LeadStatus.ESTIMATED;
      const estimateRow: EstimationsType = this.salesForm.value.estimations;
      this._saveEstimationsRow(salesRow, estimateRow);
    }
  }

  completeEstimation() {
    if (this.isFormValid()) {
      const salesRow: SalesType = this.salesForm.value.projectDetails;
      salesRow.status = LeadStatus.REQUEST_FOR_QUOTATION;
      const estimateRow: EstimationsType = this.salesForm.value.estimations;
      this._saveEstimationsRow(salesRow, estimateRow);
    }
  }

  estimationAction(completeEstimation: boolean) {
    if (this.isFormValid()) {
      const salesRow: SalesType = this.salesForm.value.projectDetails;
      salesRow.status = LeadStatus.ESTIMATED;
      if (completeEstimation) {
        salesRow.status = LeadStatus.REQUEST_FOR_QUOTATION;
      }
      const estimateRow: EstimationsType = this.salesForm.value.estimations;
      estimateRow.$operation$ = QueryOperation.UPDATE;
      if (!estimateRow.id) {
        estimateRow.$operation$ = QueryOperation.INSERT;
      }
      estimateRow.versionNumber = this.estimations.length;
      if (estimateRow.versionNumber === 0) {
        estimateRow.versionNumber = 1;
      }
      estimateRow.salesId = salesRow.salesId;
      estimateRow.mainSteelInclusions = this.arrayToString(
        estimateRow.mainSteelInclusions
      );
      estimateRow.mainSteelExclusions = this.arrayToString(
        estimateRow.mainSteelExclusions
      );
      estimateRow.miscSteelInclusions = this.arrayToString(
        estimateRow.miscSteelInclusions
      );
      estimateRow.miscSteelExclusions = this.arrayToString(
        estimateRow.miscSteelExclusions
      );
      salesRow.bidType = this.arrayToString(salesRow.bidType);
      this.salesStore.saveRows([<Row>salesRow]).then(() => {
        this.estimationStore.saveRows([<Row>estimateRow]).then(_res => {
          if (_res.rows && _res.rows.length > 0) {
            if (_res.rows[0].$status$ === Status.SUCCESS) {
              Utils.notifyInfo(this.message, 'Success', 'Estimation saved!');
              this.gotoSales();
            }
          }
        });
      });
    }
  }

  saveQuotation(complete: boolean) {
    if (this.isFormValid()) {
      const salesRow: SalesType = this.salesForm.value.projectDetails;
      if (complete) {
        salesRow.status = LeadStatus.QUOTED;
      }
      salesRow.$operation$ = QueryOperation.UPDATE;
      const quoteRow: QuotesType = this.salesForm.value.quotation;
      quoteRow.$operation$ = QueryOperation.INSERT;
      quoteRow.versionNumber = this.quotations.length;
      quoteRow.salesId = salesRow.salesId;
      quoteRow.estimateId = this.estimations[this.estimations.length - 1].id;
      salesRow.bidType = this.arrayToString(salesRow.bidType);
      salesRow.$actionParams$ = {
        generateQuotePDF: 'Y'
      };
      this.salesStore.saveRows([<Row>salesRow]).then(() => {
        this.quotesStore.saveRows([<Row>quoteRow]).then(_res => {
          if (_res.rows && _res.rows.length > 0) {
            if (_res.rows[0].$status$ === Status.SUCCESS) {
              Utils.notifyInfo(
                this.message,
                'Success',
                'Quotation sent for approval!'
              );
              this.gotoSales();
            }
          }
        });
      });
    }
  }

  completeQuotation() {
    this.saveQuotation(true);
  }

  closeLead() {
    if (this.leadFinalStatus) {
      if (this.isFormValid()) {
        const salesRow: SalesType = this.salesForm.value.projectDetails;
        salesRow.status = this.leadFinalStatus;
        salesRow.$operation$ = QueryOperation.UPDATE;
        salesRow.bidType = this.arrayToString(salesRow.bidType);
        this.salesStore.saveRows([<Row>salesRow]).then(_res => {
          if (_res.rows && _res.rows.length > 0) {
            if (_res.rows[0].$status$ === Status.SUCCESS) {
              Utils.notifyInfo(
                this.message,
                'Success',
                'Lead closed successfully!'
              );
              this.gotoSales();
            }
          }
        });
      }
    } else {
      Utils.notifyError(this.message, 'Error', 'Please select Lead status');
    }
  }

  gotoSales() {
    this.router.navigate(['/sales']);
  }

  ngOnDestroy() {
    this.salesStore.destroy();
    this.countryStore.destroy();
    this.statesStore.destroy();
    this.exclusionsInclusionsStore.destroy();
    this.clientStore.destroy();
    this.estimationStore.destroy();
    this.quotesStore.destroy();
    this.salesPersonStore.destroy();
    this.estimationLeadsStore.destroy();
    this.estimatorsStore.destroy();
  }

  ngOnInit() {
    const selectParams = DataUtils.getTypeParams('SalesType');
    this.salesStore = this.storeService.getInstance('Sales', 'sales', [], {
      whereClause: 'sales_id = ?',
      whereClauseParams: [this.saleId],
      selectParams
    });
    this.countryStore = this.storeService.getInstance(
      'Countries',
      'countries',
      [],
      { skipOrderBy: true }
    );
    this.countryStore.query();
    this.statesStore = this.storeService.getInstance('States', 'states', [], {
      skipOrderBy: true
    });
    this.statesStore.whereClause = 'country_id = ?';
    this.exclusionsInclusionsStore = this.storeService.getInstance(
      'ExclusionsInclusions',
      'ExclusionsInclusions',
      []
    );
    this.clientStore = this.storeService.getInstance('Clients', 'clients', [], {
      whereClause: 'client_id = ?'
    });
    this.estimationStore = this.storeService.getInstance(
      'Estimations',
      'estimations',
      [],
      {
        whereClause: 'sales_id = ?',
        orderByClause: 'update_date asc'
      }
    );
    this.quotesStore = this.storeService.getInstance('Quotes', 'quotes', [], {
      whereClause: 'sales_id = ?',
      orderByClause: 'update_date asc'
    });
    this.salesForm = this.formBuilder.group({
      clientDetails: this.formBuilder.group(this.formFromObject('ClientsType')),
      projectDetails: this.formBuilder.group(this.formFromObject('SalesType')),
      requirements: this.formBuilder.group({
        miscellaneous: new FormControl(),
        engineering: new FormControl(),
        structural: new FormControl()
      }),
      estimations: this.formBuilder.group(
        this.formFromObject('EstimationsType')
      ),
      oldEstimations: this.formBuilder.array([]),
      quotation: this.formBuilder.group(this.formFromObject('QuotesType')),
      oldQuotations: this.formBuilder.array([])
    });
    this.salesPersonStore = this.storeService.getInstance('Users', 'users', []);
    this.salesPersonStore.whereClause =
      'user_id in (select user_id from user_roles where role_id =' +
      '(select role_id from roles where role_code = ?))';
    this.salesPersonStore.whereClauseParams = ['salesperson'];
    if (this.isSalesManager()) {
      this.salesPersonStore.query();
    }

    this.estimationLeadsStore = this.storeService.getInstance(
      'Users',
      'users',
      []
    );
    this.estimationLeadsStore.whereClause =
      'user_id in (select user_id from user_roles where role_id =' +
      '(select role_id from roles where role_code = ?))';
    this.estimationLeadsStore.whereClauseParams = ['estimationmanager'];
    this.estimationLeadsStore.query();

    this.estimatorsStore = this.storeService.getInstance('Users', 'users', []);
    this.estimatorsStore.whereClause =
      'user_id in (select user_id from user_roles where role_id =' +
      '(select role_id from roles where role_code = ?))';
    this.estimatorsStore.whereClauseParams = ['estimator'];
    if (this.isEstimationManager()) {
      this.estimatorsStore.query();
    }
    this.exclusionsInclusionsStore.query();
    this.salesStore.query().then(res => {
      if (res.status !== Status.SUCCESS || res.rows.length === 0) {
        Utils.notifyError(
          this.message,
          'Error',
          'No such sales data found for Id ' + this.saleId
        );
        this.router.navigate(['/sales']);
      } else {
        this.salesRow = res.rows[0];
        this._parseRequirements(<Row>this.salesRow);
        this.copyRowToForm('projectDetails', <Row>this.salesRow);
        this.clientStore.whereClauseParams = [this.salesRow.clientId];
        this.estimationStore.whereClauseParams = [this.salesRow.salesId];
        this.quotesStore.whereClauseParams = [this.salesRow.salesId];
        if (this.salesRow.projectCountry) {
          const country = this.filterCountry(this.salesRow.projectCountry);
          if (country) {
            this.statesStore.whereClauseParams = [country.id];
            this.statesStore.query();
          }
        }
        this.clientStore.query().then(_res => {
          if (_res.rows && _res.rows.length > 0) {
            this.clientRow = _res.rows[0];
            this.copyRowToForm('clientDetails', <Row>this.clientRow);
          }
        });
        this.estimationStore.query().then(_res => {
          if (_res.status === Status.SUCCESS) {
            this.estimations = _res.rows;
            if (_res.rows && _res.rows.length > 0) {
              this._parseEstimationRows(_res.rows);
              const oldEstimations = [];
              _res.rows.forEach((row: EstimationsType, index) => {
                if (
                  index === _res.rows.length - 1 &&
                  this.salesRow &&
                  this.salesRow.status === LeadStatus.ESTIMATED
                ) {
                  this.copyRowToForm('estimations', <Row>row);
                  this.estimationEditing = true;
                } else {
                  const control = new FormGroup(
                    this.formFromObject('EstimationsType')
                  );
                  (<FormArray>this.salesForm.get('oldEstimations')).push(
                    control
                  );
                  oldEstimations.push(row);
                }
              });
              this.copyRowsToForm('oldEstimations', oldEstimations);
            }
          }
        });
        this.quotesStore.query().then(_res => {
          if (_res.status === Status.SUCCESS) {
            this.quotations = _res.rows;
            if (_res.rows && _res.rows.length > 0) {
              const oldQuotations = [];
              _res.rows.forEach((row: QuotesType, index) => {
                // if (
                //   index === _res.rows.length - 1 &&
                //   this.salesRow &&
                //   this.salesRow.status === LeadStatus.QUOTED
                // ) {
                //   this.copyRowToForm('quotation', <Row>row);
                //   this.quotationEditing = true;
                // } else {
                const control = new FormGroup(
                  this.formFromObject('QuotesType')
                );
                (<FormArray>this.salesForm.get('oldQuotations')).push(control);
                oldQuotations.push(row);
                // }
              });
              this.copyRowsToForm('oldQuotations', oldQuotations);
            }
          }
        });
      }
    });
  }

  _parseRequirements(row: Row) {
    if (row.bidType) {
      row.bidType = this.strToArray(row.bidType);
    }
  }

  _parseEstimationRows(rows: Row[]) {
    rows.forEach(row => {
      if (row.mainSteelInclusions) {
        row.mainSteelInclusions = this.strToArray(row.mainSteelInclusions);
      }
      if (row.mainSteelExclusions) {
        row.mainSteelExclusions = this.strToArray(row.mainSteelExclusions);
      }
      if (row.miscSteelInclusions) {
        row.miscSteelInclusions = this.strToArray(row.miscSteelInclusions);
      }
      if (row.miscSteelExclusions) {
        row.miscSteelExclusions = this.strToArray(row.miscSteelExclusions);
      }
    });
  }
  strToArray(str: any) {
    return <string>str.split('$');
  }
  arrayToString(str: any) {
    let _str = '';
    if (str instanceof Array) {
      str.forEach(ms => {
        _str += ms + '$';
      });
    }
    if (_str.endsWith('$')) {
      _str = _str.substr(0, _str.length - 1);
    }
    return _str;
  }

  copyRowToForm(formGroup: string, currentRow: Row) {
    const formRow = this.salesForm.value[formGroup];
    Object.keys(currentRow).forEach(key => {
      if (formRow.hasOwnProperty(key)) {
        const form = this.salesForm.controls[formGroup] as FormGroup;
        form.controls[key].setValue(currentRow[key]);
      }
    });
  }

  copyRowsToForm(formGroup: string, rows: Row[]) {
    const formArray = this.salesForm.get(formGroup)['controls'] as FormArray;
    for (let i = 0; i < formArray.length; i++) {
      const cntl = formArray[i];
      const row = rows[i];
      Object.keys(row).forEach(key => {
        if (cntl['controls'].hasOwnProperty(key)) {
          cntl['controls'][key].setValue(row[key]);
        }
      });
    }
  }

  formFromObject(dataClass: string) {
    const columns = DataUtils.getTypeParams(dataClass);
    const formGroup = {};
    columns.forEach(element => {
      formGroup[element] = new FormControl();
    });
    return formGroup;
  }

  isFieldValid(formGroupIndex: number, field: string) {
    let formGroup = null;
    if (formGroupIndex === 0) {
      formGroup = 'clientDetails';
    } else if (formGroupIndex === 1) {
      formGroup = 'projectDetails';
    } else if (formGroupIndex === 2) {
      formGroup = 'estimations';
    } else if (formGroupIndex === 3) {
      formGroup = 'quotation';
    }
    if (!formGroup) {
      return false;
    }
    const form = this.salesForm.controls[formGroup] as FormGroup;
    const control = form.controls[field];
    return control.invalid && (control.dirty || control.touched);
  }

  isFormValid() {
    if (this.salesForm.valid) {
      return true;
    } else {
      Utils.notifyError(this.message, 'Error', 'Please fill required fields');
      return false;
    }
  }

  onCountryChange = open => {
    if (!open) {
      const country = this.salesForm.value.projectDetails.projectCountry;
      if (!country) {
        return;
      }
      if (this.countryStore && this.countryStore.rows) {
        const selectedCoutries = this.countryStore.rows.filter(
          _country => _country.name === country
        );
        if (selectedCoutries.length > 0) {
          const form = this.salesForm.controls['projectDetails'] as FormGroup;
          form.controls['projectState'].setValue(null);
          this.statesStore.whereClauseParams = [selectedCoutries[0].id];
          this.statesStore.query();
        }
      }
    }
  };

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
}
