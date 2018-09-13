export default class EmailActionsType {
 constructor(
   public id?: number,
   public toEmails?: string,
   public ccEmails?: string,
   public datasource?: string,
   public event?: string,
   public condition?: string,
   public subject?: string,
   public body?: string,
   public active?: string,
   public createDate?: Date,
   public createUserId?: number,
   public updateDate?: Date,
   public updateUserId?: number,
   public $operation$?: string) {} 
 }