export default class ProjectsType {
 constructor(
   public projectId?: number,
   public projectName?: string,
   public complexity?: string,
   public poNumber?: number,
   public poDate?: Date,
   public clientHours?: number,
   public receivedDate?: Date,
   public conFolderLink?: string,
   public targetedOfaDate?: Date,
   public actualOfaDate?: Date,
   public bfaDate?: Date,
   public fabricationDate?: Date,
   public remarks?: string,
   public status?: string,
   public createDate?: Date,
   public createUserId?: number,
   public updateDate?: Date,
   public updateUserId?: number,
   public $operation$?: string) {} 
 }