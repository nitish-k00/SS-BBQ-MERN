import React, { useEffect, useState } from "react";
import ProductBox from "../middleware/ProductBox";
import { getCategory, getFavColours, getProduct } from "../middleware/API";
import {
  Button,
  Container,
  Checkbox,
  FormControlLabel,
  TextField,
  CircularProgress,
  Box,
} from "@mui/material";
import { Slider } from "antd";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../redux/slices/userInfo";

function Menu() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categorys, setCategorys] = useState([]);
  const [fetchCate, setFetchCate] = useState([]);
  const [filterCategory, setFilterCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [productFiltered, setProductFiltered] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [priceChange, setPriceChange] = useState("");
  const [discount, setDiscount] = useState("");
  const [selectedDiscount, setSelectedDiscount] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [favID, setFavId] = useState([]);

  const userData = useSelector(selectUserInfo);

  const selectCategory = (cate) => {
    setSelectedCategory(cate === selectedCategory ? "" : cate);
  };

  const cateFilter = (value) => {
    const filteredCategories = categorys.filter((cate) =>
      cate.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilterCategory(filteredCategories);
  };

  useEffect(() => {
    const productFilter = () => {
      let filteredProducts = [...products];

      if (selectedCategory) {
        filteredProducts = filteredProducts.filter((data) =>
          data.category.name
            .toLowerCase()
            .includes(selectedCategory.toLowerCase())
        );
      }

      if (productSearch) {
        filteredProducts = filteredProducts.filter((data) =>
          data.name.toLowerCase().includes(productSearch)
        );
      }

      if (priceChange) {
        filteredProducts = filteredProducts.filter(
          (data) => data.discountPrice <= priceChange
        );
      }

      if (selectedDiscount) {
        filteredProducts = filteredProducts.filter(
          (data) => data.discount === selectedDiscount
        );
      }

      setProductFiltered(filteredProducts);
    };

    productFilter();
  }, [
    products,
    selectedCategory,
    priceChange,
    selectedDiscount,
    productSearch,
  ]);

  useEffect(() => {
    const filterCategories = () => {
      const productCategoryNames = new Set(
        products.map((data) => data.category.name)
      );
      const filteredCategories = fetchCate.filter((category) =>
        productCategoryNames.has(category.name)
      );
      setCategorys(filteredCategories);
      setFilterCategory(filteredCategories);
    };
    filterCategories();
  }, [products, fetchCate]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const product = await getProduct();
        setProducts(product);
        const category = await getCategory();
        setFetchCate(category);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const priceRange = () => {
      const setOfDiacountPrice = new Set(
        products.map((data) => data.discountPrice)
      );
      const min = Math.min(...setOfDiacountPrice);
      const max = Math.max(...setOfDiacountPrice);

      setPriceMin(min);
      setPriceMax(max);
      setPriceChange(max);

      // console.log(setOfDiacountPrice, "d");
    };

    priceRange();
  }, [products]);

  const priceOnchange = (value) => {
    setPriceChange(value);
  };

  useEffect(() => {
    const discountPercentage = () => {
      const uniquePercentages = [
        ...new Set(products.map((data) => data.discount)),
      ];
      const length = uniquePercentages.length;
      if (uniquePercentages[length - 1] === 0) {
        setDiscount(uniquePercentages.slice(0, -1));
      } else {
        setDiscount(uniquePercentages);
      }
    };
    discountPercentage();
  }, [products]);

  const onChangeSeletedDiscount = (dis) => {
    setSelectedDiscount(dis === selectedDiscount ? "" : dis);
  };

  // console.log(productFiltered, "s");

  const holeFav = async () => {
    try {
      const data = await getFavColours();
      setFavId(data);
      console.log("called", data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userData?.login) {
      holeFav();
    }
  }, [userData]);

  return (
    <div>
      {loading ? (
        <div
          style={{
            width: "100%",
            height: "90vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
          <p className="ms-2 h2">Loading....</p>
        </div>
      ) : (
        <Container>
          <Button
            style={{
              backgroundColor: "#f78000",
              color: "white",
              fontWeight: "bolder",
            }}
            className="ms-2 my-3"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            FILTER
          </Button>
          <div className="row ">
            {filterOpen && (
              <div
                className="col-md-4 col-lg-3 pe-5 mb-5"
                style={{
                  height: "70vh",
                  overflowY: "scroll",
                }}
              >
                <h5>CATEGORY</h5>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search category"
                  onChange={(e) => cateFilter(e.target.value)}
                />
                <div
                  className="my-2"
                  style={{
                    padding: "20px 10px",
                    boxShadow:
                      "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
                    height: "30vh",
                    overflowY: "scroll",
                  }}
                >
                  {filterCategory?.map((cate) => (
                    <div key={cate._id}>
                      <FormControlLabel
                        style={{ marginBottom: "10px" }}
                        control={
                          <Checkbox
                            className="ms-2"
                            checked={selectedCategory === cate.name}
                            onChange={() => selectCategory(cate.name)}
                          />
                        }
                        label={cate.name}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <h5>PRICE</h5>
                  <Box sx={{ maxWidth: 300 }} className="mt-4">
                    <Slider
                      value={priceChange}
                      onChange={priceOnchange}
                      valueLabelDisplay="auto"
                      min={priceMin}
                      max={priceMax}
                      step={10}
                    />
                    <span className="me-2">min Rs.{priceMin}</span>
                    <span className="me-2">- max Rs.{priceMax}</span>
                  </Box>
                </div>
                <div className="mt-4">
                  <h5>DISCOUNT</h5>
                  <div
                    className="my-2"
                    style={{
                      padding: "20px 10px",
                      boxShadow:
                        "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
                      height: "auto",
                      overflowY: "scroll",
                    }}
                  >
                    {discount?.map((dis, index) => (
                      <div key={index}>
                        {dis !== 0 && (
                          <FormControlLabel
                            style={{ marginBottom: "10px" }}
                            control={
                              <Checkbox
                                className="ms-2"
                                checked={selectedDiscount === dis}
                                onChange={() => onChangeSeletedDiscount(dis)}
                              />
                            }
                            label={`${dis}%`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div className="col">
              <div className="d-flex flex-wrap align-items-center justify-content-center  justify-content-lg-start">
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search Product"
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="mb-4"
                />

                {productFiltered.length !== 0 ? (
                  productFiltered?.map((product) => (
                    <ProductBox
                      key={product._id}
                      product={product}
                      favID={favID}
                      holeFav={holeFav}
                    />
                  ))
                ) : (
                  <h5>NO PRODUCT FOUND </h5>
                )}
              </div>
            </div>
          </div>
        </Container>
      )}
    </div>
  );
}

export default Menu;
