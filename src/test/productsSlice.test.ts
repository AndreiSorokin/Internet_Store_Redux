import axios from "axios";
import { Products } from "../misc/type";
import productReducer, {
    fetchProducts,
    fetchSingleProduct,
    filterByCategory,
    setPriceFilter,
    sortByPrice,
    createProduct
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

    test("should filter by category", () => {
    const state = productReducer({
      ...initialState,
      products: mockProducts
    },
    filterByCategory("Category 1")
    )
    expect(state.filteredProducts.length).toBe(1)
    expect(state.filteredProducts[0].category.name).toBe("Category 1")
    })

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
    })

    test("should sort by price from low to high", () => {
    const state = productReducer(
      {
        ...initialState,
        products: mockProducts
      },
      sortByPrice("from low to high")
    )
    expect(state.products[0].price).toBeLessThan(state.products[1].price)
    })

    test("should sort by price from high to low", () => {
    const state = productReducer(
      {
        ...initialState,
        products: mockProducts
      },
      sortByPrice("from high to low")
    )
    expect(state.products[0].price).toBeGreaterThan(state.products[1].price)
    })

    test("should create a product", () => {

      // const action = createProduct.fulfilled(mockProducts[0], '1', "fulfilled");


      // const state = productReducer(initialState, action);

      // expect(state).toEqual({
      //   products: [...initialState.products, newProduct],
      //   loading: false,
      //   error: null,
      //   filteredProducts: [],
      //   selectedCategory: '',
      //   selectedProduct: null,
      //   userInput: '',
      //   priceFilter: '',
      // });
    })
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

    })
  })

  describe("rejected", () => {
    test("fetching products should have error", () => {
    const error = new Error("error");
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
  })
});