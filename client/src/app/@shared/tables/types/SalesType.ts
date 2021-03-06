export default class SalesType {
  constructor(
    public salesId?: number,
    public clientId?: number,
    public bidNumber?: string,
    public projectName?: string,
    public projectAddressLine1?: string,
    public projectAddressLine2?: string,
    public projectCity?: string,
    public projectState?: string,
    public projectCountry?: string,
    public projectZip?: string,
    public projectContactName?: string,
    public projectContactEmail?: string,
    public projectPhone1CountryCode?: string,
    public projectPhone1Number?: string,
    public projectPhone1Ext?: string,
    public projectPhone2CountryCode?: string,
    public projectPhone2Number?: string,
    public projectPhone2Ext?: string,
    public bidReceivedDate?: Date,
    public bidDueDate?: Date,
    public bidSentDate?: Date,
    public bidType?: string,
    public documentReceived?: string,
    public documentPath?: string,
    public executive?: string,
    public remarks?: string,
    public salesRemarks?: string,
    public status?: string,
    public projectStatus?: string,
    public createDate?: Date,
    public createUserId?: number,
    public updateDate?: Date,
    public updateUserId?: number,
    public $operation$?: string
  ) {}
}
