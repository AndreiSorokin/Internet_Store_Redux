import axios from "axios";
import { Products } from "../../misc/type";
import productReducer, {
    fetchProducts,
    fetchSingleProduct,
    filterByCategory,
    setPriceFilter,
    sortByPrice,
} from "../../redux/slices/productSlice";

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

  test("should have loading truthy when fetch is pending", () => {
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

  test("should have error", () => {
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

  test("should return a single product", async () => {
    
  })

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
});