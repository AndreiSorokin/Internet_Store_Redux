import axios from "axios";

import { Gender, Products, Size } from "../misc/type";
import productReducer, {
    fetchProducts,
    fetchSingleProduct,
    filterByCategory,
    createProduct,
    deleteProduct,
    updateProduct,
    fetchAllProducts
} from "../redux/slices/productSlice";

const initialState = {
  products: [],
  userInput: '',
  loading: false,
  error: null,
  selectedProduct: null,
  selectedCategory: '',
  priceFilter: '',
  filteredProducts: [],
  totalCount: 0,
};

describe("product reducer", () => {

   let mockProducts: Products[] = [
   {
      id: 1,
      categoryId: 1,
      name: "product1",
      price: 10,
      description: "product1",
      category: { id: 1, name: "Category 1", image: 'img' },
      images: ["img1", "img2"],
      size: Size.Medium,
      gender: Gender.Male
   },
   {
      id: 2,
      categoryId: 2,
      name: "product2",
      price: 120,
      description: "product2",
      category: { id: 2, name: "Category 2", image: 'img' },
      images: ["img1", "img2"],
      size: Size.Small,
      gender: Gender.Female
},
];

  describe("fulfilled", () => {
    test("should return a list of all products", () => {
      const mockPayload = {
        products: mockProducts,
        totalCount: mockProducts.length,
      };
    
      const state = productReducer(
        initialState,
        fetchAllProducts.fulfilled(mockPayload, "fulfilled")
      );
    
      expect(state).toEqual({
        products: mockProducts,
        totalCount: mockProducts.length,
        loading: false,
        error: null,
        filteredProducts: [],
        selectedCategory: '',
        selectedProduct: null,
        userInput: '',
        priceFilter: ''
      });
    });

    test("should return a list of filtered products", () => {
      const fetchProductsAction = fetchProducts.fulfilled({
        products: mockProducts,
        totalCount: mockProducts.length
      }, "fulfilled", {
        limit: 10,
        offset: 0,
        size: 'Medium',
        gender: 'Male'
      });
    
      const state = productReducer(initialState, fetchProductsAction);
    
      expect(state).toEqual({
        products: mockProducts,
        totalCount: mockProducts.length,
        loading: false,
        error: null,
        filteredProducts: [],
        selectedCategory: '',
        selectedProduct: null,
        userInput: '',
        priceFilter: '',
      });
    });

    test("should fetch a single product", async () => {
      const state = productReducer(
        initialState,
        fetchSingleProduct.fulfilled(mockProducts[0], '1', "fulfilled")
      )
    
      jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: mockProducts[0] });
      
      expect(state).toEqual({
        products: [],
        loading: false,
        error: null,
        filteredProducts: [],
        selectedCategory: '',
        selectedProduct: mockProducts[0],
        userInput: '',
        priceFilter: '',
        totalCount: 0,
      });
    });

    test("should create a product", () => {
      const newProduct = {
        title: 'title3',
        price: 30,
        description: 'description3',
        categoryId: 3,
        images: ["img1", "img2"]
      }
    
      const action = createProduct.fulfilled(newProduct, '3', newProduct);
    
      const state = productReducer(initialState, action);
    
      expect(state).toEqual({
        products: [...initialState.products, newProduct],
        loading: false,
        error: null,
        filteredProducts: [],
        selectedCategory: '',
        selectedProduct: null,
        userInput: '',
        priceFilter: '',
        totalCount: initialState.totalCount,
      });
    });

    test("should delete a product", () => {
      jest.spyOn(axios, 'delete').mockResolvedValueOnce(undefined);

      const productIdToDelete = '1';
      const state = productReducer(
        { ...initialState,
          products: mockProducts
        },
        deleteProduct.fulfilled(productIdToDelete, '1', productIdToDelete)
      );

      expect(state.products).toHaveLength(mockProducts.length - 1);
      expect(state.products.map(product => product.id)).not.toContain(productIdToDelete);
    });

    test("should update a product", () => {
      jest.spyOn(axios, 'put').mockResolvedValueOnce({ data: { id: '1', title: 'Updated Product', price: 20 } });
  
      const updatedProduct = { id: 1, name: 'Updated Product', price: 20 };
      const state = productReducer(
        { ...initialState,
          products: mockProducts
        },
        updateProduct.fulfilled(updatedProduct, '1', {id: '1', name: 'Updated Product', price: 20})
      );
  
      const updatedProductIndex = state.products.findIndex(product => product.id === updatedProduct.id);
  
      expect(state.products[updatedProductIndex].name).toBe('Updated Product');
      expect(state.products[updatedProductIndex].price).toBe(20);
    });

    test("should filter by category", () => {
      const state = productReducer({
        ...initialState,
        products: mockProducts
      },
      filterByCategory("Category 1")
      )
      expect(state.filteredProducts.length).toBe(1)
      expect(state.filteredProducts[0].category.name).toBe("Category 1")
      });
  });

  describe("pending", () => {
    test("should have loading truthy when fetching all products", () => {
      const state = productReducer(
        initialState,
        fetchAllProducts.pending("pending")
      );

      expect(state).toEqual({
        ...initialState,
        loading: true,
      });
    });

    test("should have loading truthy when fetching products", () => {
      const state = productReducer(
        initialState,
        fetchProducts.pending("pending", {
          limit: 10,
          offset: 0,
          size: 'Medium',
          gender: 'Male'
        })
      );

      expect(state).toEqual({
        ...initialState,
        loading: true,
      });
    });

    test("should have loading truthy when fetching a single product", () => {
      const state = productReducer(
        initialState,
        fetchSingleProduct.pending('1', "pending")
      );

      expect(state).toEqual({
        ...initialState,
        loading: true,
      });
    })

    test("should have loading truthy when creating a product", () => {
      const newProduct = {
        title: 'title3',
        price: 30,
        description: 'description3',
        categoryId: 3,
        images: ["img1", "img2"]
      }

      const state = productReducer(
        initialState,
        createProduct.pending('1', newProduct)
      )

      expect(state).toEqual({
        ...initialState,
        loading: true,
      });
    })

    test("should have loading truthy when deleting a product", () => {
      const productIdToDelete = {
        title: 'title3',
        price: 30,
        description: 'description3',
        categoryId: 3,
        images: ["img1", "img2"]
      }
      const state = productReducer(
        initialState,
        createProduct.pending('1', productIdToDelete)
      );

      expect(state).toEqual({
        ...initialState,
        loading: true,
      })
    })

    test("should have loading truthy when updating a product", () => {
      const state = productReducer(
        initialState,
        updateProduct.pending('1', { id: '1', name: 'Updated Product', price: 20 })
      );

      expect(state).toEqual({
        ...initialState,
        loading: true,
      })
    })
  })

  describe("rejected", () => {
    const error = new Error("error");

    test("fetching all products should have error", () => {
      const state = productReducer(
        initialState,
        fetchAllProducts.rejected(error, "rejected")
      );

      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: error.message
      });
    });

    test("fetching filtered products should have error", () => {
      const state = productReducer(
        initialState,
        fetchProducts.rejected(error, "rejected", {
          limit: 10,
          offset: 0,
          size: 'Medium',
          gender: 'Male'
        })
      );

      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: error.message
      });
    });

    test("fetching a single product should have error", () => {
      const state = productReducer(
        initialState,
        fetchSingleProduct.rejected(error, "1", "error")
      );

      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: error.message
      });
    })

    test("creating a new product should have error", () => {
      const newProduct = {
        title: 'title3',
        price: 30,
        description: 'description3',
        categoryId: 3,
        images: ["img1", "img2"]
      }
      const state = productReducer(
        initialState,
        createProduct.rejected(error, "1", newProduct)
      );

      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: error.message
      });
    })

    test("deleting a product should have error", () => {
      const productIdToDelete = '1';

      const state = productReducer(
        initialState,
        deleteProduct.rejected(error, "1", productIdToDelete)
      );

      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: error.message
      });
    })

    test("updating a product should have error", () => {
      const state = productReducer(
        initialState,
        updateProduct.rejected(error, "1", {id: '1', name: 'Updated Product', price: 20})
      );

      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: error.message
      });
    })
  });
});