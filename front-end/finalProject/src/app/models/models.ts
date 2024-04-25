export interface Book {
  isbn: string;
  title: string;
  author: string;
  copies: BookCopy[];
  price: number;
}

export const bookInit: Book = {
  isbn: '',
  title: '',
  author: '',
  copies: [],
  price: 100,
};

export interface BookCopy {
  _id: string;
  status: string;
}
export interface UserInventory {
  isbn: string;
  copy_id: string;
  title: string;
  dueDate: string;
}

export const inventoryInit: UserInventory = {
  isbn: '',
  copy_id: '',
  title: '',
  dueDate: '',
};

export interface addBook {
  isbn: string;
  title: string;
  author: string;
  price: number;
  number_of_copies: number;
}

export interface getBookResponse {
  success: boolean;
  data: Book;
}

export interface addBookResponse {
  success: boolean;
  data: string;
}

export interface addBookToInventoryResponse {
  success: boolean;
  data: string;
}

export interface getAllBookResponse {
  success: boolean;
  data: Book[];
}

export interface userInventoryResponse {
  success: boolean;
  data: UserInventory[];
}

export interface updateCopiesResponse {
  success: boolean;
  data: number;
}

export interface returnBookResponse {
  success: boolean;
  data: string;
}

export interface copiesRequest {
  copies: number;
}

export interface deleteBookResponse {
  success: boolean;
  data: number;
}
