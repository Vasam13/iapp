export default class ProjectRfiDetailsType {
 constructor(
   public id?: number,
   public projectId?: number,
   public sendDate?: Date,
   public receivedDate?: Date,
   public desciption?: string,
   public rfiEmailFolder?: string,
   public status?: string,
   public remarks?: string,
   public createDate?: Date,
   public createUserId?: number,
   public updateDate?: Date,
   public updateUserId?: number,
   public $operation$?: string) {} 
 }