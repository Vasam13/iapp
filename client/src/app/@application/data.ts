export class DataUtils {
  static getParams(functionName): string[] {
    const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
    const ARGUMENT_NAMES = /([^\s,]+)/g;

    const fnStr = functionName.toString().replace(STRIP_COMMENTS, '');
    const result = fnStr
      .slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')'))
      .match(ARGUMENT_NAMES);
    if (result) {
      return result;
    }
    return [];
  }

  static toCamelCase(str: string) {
    return str.replace(/_([a-z])/gi, function($0, $1) {
      return $1.toUpperCase();
    });
  }

  static getTypeParams(type: string) {
    if (type === 'ClientsType') {
      return DataUtils.getClientsParams();
    }
    if (type === 'SalesType') {
      return DataUtils.getSalesParams();
    }
    if (type === 'EstimationsType') {
      return DataUtils.getEstimationsParams();
    }
    if (type === 'QuotesType') {
      return DataUtils.getQuotesParams();
    }
    if (type === 'ProjectsType') {
      return DataUtils.getProjectsType();
    }
    return [];
  }

  static getQuotesParams() {
    return [
      'quoteId',
      'salesId',
      'estimateId',
      'versionNumber',
      'currency',
      'mainSteelPrice',
      'miscSteelPrice',
      'engineeringPrice',
      'remarks',
      'salesRemarks',
      'createDate',
      'createUserId',
      'updateDate',
      'updateUserId'
    ];
  }

  static getEstimationsParams() {
    return [
      'id',
      'salesId',
      'versionNumber',
      'mainSteelInclusions',
      'mainSteelExclusions',
      'mainSteelHours',
      'mainSteelSchedule',
      'miscSteelInclusions',
      'miscSteelExclusions',
      'miscSteelHours',
      'miscSteelSchedule',
      'remarks',
      'salesRemarks',
      'createDate',
      'createUserId',
      'updateDate',
      'updateUserId'
    ];
  }

  static getSalesParams() {
    return [
      'salesId',
      'clientId',
      'bidNumber',
      'projectName',
      'projectAddressLine1',
      'projectAddressLine2',
      'projectCity',
      'projectState',
      'projectCountry',
      'projectZip',
      'projectContactName',
      'projectContactEmail',
      'projectPhone1CountryCode',
      'projectPhone1Number',
      'projectPhone1Ext',
      'projectPhone2CountryCode',
      'projectPhone2Number',
      'projectPhone2Ext',
      'bidReceivedDate',
      'bidDueDate',
      'bidSentDate',
      'bidType',
      'documentReceived',
      'documentPath',
      'executive',
      'estimateLead',
      'estimator',
      'remarks',
      'salesRemarks',
      'status',
      'projectStatus',
      'createDate',
      'createUserId',
      'updateDate',
      'updateUserId',
      'isPdfGenerated'
    ];
  }

  static getClientsParams() {
    return [
      'clientId',
      'clientName',
      'contactName',
      'emailAddress',
      'phone1CountryCode',
      'phone1Number',
      'phone1Ext',
      'phone2CountryCode',
      'phone2Number',
      'phone2Ext',
      'website',
      'addressLine1',
      'addressLine2',
      'city',
      'state',
      'country',
      'zip',
      'createDate',
      'createUserId',
      'updateDate',
      'updateUserId'
    ];
  }

  static getProjectsType() {
    return [
      'projectId',
      'projectName',
      'complexity',
      'poNumber',
      'poDate',
      'assignedTo',
      'clientHours',
      'receivedDate',
      'conFolderLink',
      'targetedOfaDate',
      'developmentHours',
      'actualOfaDate',
      'bfaDate',
      'fabricationDate',
      'remarks',
      'status',
      'createDate',
      'createUserId',
      'updateDate',
      'updateUserId'
    ];
  }
}
