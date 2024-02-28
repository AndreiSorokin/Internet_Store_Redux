import axios from "axios";
import { Products } from "../misc/type";
import productReducer, {
    fetchProducts,
    fetchSingleProduct,
    filterByCategory,
    setPriceFilter,
    sortByPrice,
    createProduct,
    deleteProduct,
    updateProduct
} from "../redux/slices/productSlice";

const initialState = {
  products: [],
  userInput: '',
  loading: false,
  error: null,
  selectedProduct: null,
  selectedCategory: '',
  priceFilter: '',
  filteredProducts: []
};

describe("product reducer", () => {

  let mockProducts: Products[] = [
  {
    id: 1,
    title: "product1",
    price: 10,
    description: "product1",
    category: { id: 1, name: "Category 1", image: 'img' },
    images: ["img1", "img2"],
  },
  {
    id: 2,
    title: "product2",
    price: 90,
    description: "product2",
    category: { id: 2, name: "Category 2", image: 'img' },
    images: ["img1", "img2"],
  },
];

  describe("fulfilled", () => {
    test("should return a list of products", () => {

    const state = productReducer(
      initialState,
      fetchProducts.fulfilled(mockProducts, "fulfilled")
    );

    expect(state).toEqual({
      products: mockProducts,
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
  
      const updatedProduct = { id: 1, title: 'Updated Product', price: 20 };
      const state = productReducer(
        { ...initialState,
          products: mockProducts
        },
        updateProduct.fulfilled(updatedProduct, '1', {id: '1', title: 'Updated Product', price: 20})
      );
  
      const updatedProductIndex = state.products.findIndex(product => product.id === updatedProduct.id);
  
      expect(state.products[updatedProductIndex].title).toBe('Updated Product');
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

    test("should filter by price category", () => {
    const state = productReducer(
      {
        ...initialState,
        products: mockProducts
      },
      setPriceFilter("20 to 100")
    );
    expect(state.priceFilter).toBe("20 to 100");

    expect(state.filteredProducts).toHaveLength(1);
    });

    test("should sort by price from low to high", () => {
    const state = productReducer(
      {
        ...initialState,
        products: mockProducts
      },
      sortByPrice("from low to high")
    )
    expect(state.products[0].price).toBeLessThan(state.products[1].price)
    });

    test("should sort by price from high to low", () => {
    const state = productReducer(
      {
        ...initialState,
        products: mockProducts
      },
      sortByPrice("from high to low")
    )
    expect(state.products[0].price).toBeGreaterThan(state.products[1].price)
    });
  })

  describe("pending", () => {
    test("should have loading truthy when fetching products", () => {
      const state = productReducer(
        initialState,
        fetchProducts.pending("pending")
      );

      expect(state).toEqual({
        products: [],
        loading: true,
        error: null,
        filteredProducts: [],
        selectedCategory: '',
        selectedProduct: null,
        userInput: '',
        priceFilter: '',
      });
    });

    test("should have loading truthy when fetching a single product", () => {
      const state = productReducer(
        initialState,
        fetchSingleProduct.pending('1', "pending")
      );

      expect(state).toEqual({
        products: [],
        loading: true,
        error: null,
        filteredProducts: [],
        selectedCategory: '',
        selectedProduct: null,
        userInput: '',
        priceFilter: '',
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
        products: [],
        loading: true,
        error: null,
        filteredProducts: [],
        selectedCategory: '',
        selectedProduct: null,
        userInput: '',
        priceFilter: '',
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
        products: [],
        loading: true,
        error: null,
        filteredProducts: [],
        selectedCategory: '',
        selectedProduct: null,
        userInput: '',
        priceFilter: '',
      })
    })

    test("should have loading truthy when updating a product", () => {
      const state = productReducer(
        initialState,
        updateProduct.pending('1', { id: '1', title: 'Updated Product', price: 20 })
      );

      expect(state).toEqual({
        products: [],
        loading: true,
        error: null,
        filteredProducts: [],
        selectedCategory: '',
        selectedProduct: null,
        userInput: '',
        priceFilter: '',
      })
    })
  })

  describe("rejected", () => {
    const error = new Error("error");

    test("fetching products should have error", () => {
      const state = productReducer(
        initialState,
        fetchProducts.rejected(error, "error")
      );

      expect(state).toEqual({
        products: [],
        loading: false,
        error: error.message,
        filteredProducts: [],
        selectedCategory: '',
        selectedProduct: null,
        userInput: '',
        priceFilter: '',
      });
    });

    test("fetching a single product should have error", () => {
      const state = productReducer(
        initialState,
        fetchSingleProduct.rejected(error, "1", "error")
      );

      expect(state).toEqual({
        products: [],
        loading: false,
        error: error.message,
        filteredProducts: [],
        selectedCategory: '',
        selectedProduct: null,
        userInput: '',
        priceFilter: '',
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
        products: [],
        loading: false,
        error: error.message,
        filteredProducts: [],
        selectedCategory: '',
        selectedProduct: null,
        userInput: '',
        priceFilter: '',
      });
    })

    test("deleting a product should have error", () => {
      const productIdToDelete = '1';

      const state = productReducer(
        initialState,
        deleteProduct.rejected(error, "1", productIdToDelete)
      );

      expect(state).toEqual({
        products: [],
        loading: false,
        error: error.message,
        filteredProducts: [],
        selectedCategory: '',
        selectedProduct: null,
        userInput: '',
        priceFilter: '',
      });
    })

    test("updating a product should have error", () => {
      const state = productReducer(
        initialState,
        updateProduct.rejected(error, "1", {id: '1', title: 'Updated Product', price: 20})
      );

      expect(state).toEqual({
        products: [],
        loading: false,
        error: error.message,
        filteredProducts: [],
        selectedCategory: '',
        selectedProduct: null,
        userInput: '',
        priceFilter: '',
      });
    })
  });
});