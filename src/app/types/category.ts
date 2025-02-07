export interface MainCategory {
  id: number;
  name: string;
  imageUrl: string;
  subCategories: SubCategory[]
}

export interface SubCategory {
  parentId: number;
  id: number;
  name: string;
  imageUrl: string;
  mainCategory: MainCategory;
}

export interface SubCategoryResponse {
  data: {
    result: SubCategory[];
  };
}

export interface SubCategoriesByMainCategoryId {
  data: SubCategory[]
}

export interface SubCategoryRes {
  data: SubCategory;
}

export interface Category {
  parentId: number;
  id: number;
  name: string;
  imageUrl: string;
  subCategory: SubCategory;
  mainCategory: MainCategory;
}


export interface CategoryRes {
  data: Category;
}

export interface CategoryResponse {
  data: {
    result: Category[];
  };
}

export interface ListCategory {
  data: Category[]
}



