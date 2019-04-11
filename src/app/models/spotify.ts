export interface Icon {
  height?: number;
  url: string;
  width?: number;
}

export interface Item {
  href: string;
  icons: Icon[];
  id: string;
  name: string;
}

export interface Categories {
  href: string;
  items: Item[];
  limit: number;
  next: string;
  offset: number;
  previous?: any;
  total: number;
}

export interface CategoriesR {
  categories: Categories;
}
