export interface Expenses {
  categoryName: string;
  _id: string;
  userId: number;
  categoryId: number;
  amount: number;
  description?: string;
  date?: string;
  dateCreated?: string;
  dateModified?: string;
}
