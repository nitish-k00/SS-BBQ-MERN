import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  FormControl,
  Checkbox,
  FormControlLabel,
  Typography,
  List,
  ListItem,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import { Form } from "react-bootstrap";

import Autocomplete from "@mui/material/Autocomplete";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { createProduct, editProduct, getCategory } from "./API";
import { Spinner } from "react-bootstrap";

const formFormat = {
  name: "",
  description: "",
  price: "",
  discount: "",
  quantity: "",
  available: false,
  special: false,
  category: "",
  photo: [],
};

function ProductForm({
  formData,
  setFormData,
  formError,
  setFormError,
  setIsModelOpen,
  setProduct,
}) {
  const [category, setCategory] = useState([]);
  const [loading, setLoding] = useState(false);

  const handleInputChange = (event) => {
    const { id, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData({
      ...formData,
      [id]: newValue,
    });
    setFormError("");
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const base64 = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const fileSize = Math.round(file.size / 1024); // Size in KB

        if (formData.photo.length < 3) {
          if (fileSize > 1000) {
            // Check if file size exceeds 1MB (1000KB)
            setFormError({
              ...formError,
              photo: "One or more images exceed 1MB size limit",
            });
          } else {
            base64.push(reader.result);

            if (base64.length === files.length) {
              if (formData.photo.length + files.length <= 3) {
                setFormData({
                  ...formData,
                  photo: [...formData.photo, ...base64],
                });
                setFormError("");
              } else {
                toast.error("You can only select up to 3 images.");
              }
            }
          }
        } else {
          setFormError({
            ...formError,
            photo: "max photo limit reached",
          });
        }
      };
    });
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...formData.photo];
    updatedFiles.splice(index, 1);
    setFormData({
      ...formData,
      photo: updatedFiles,
    });
  };

  const formCheck = () => {
    const { name, description, price, discount, quantity, category, photo } =
      formData;

    const errors = {};
    if (!name.trim()) errors.name = "Please enter product name";
    if (!description.trim())
      errors.description = "Please enter product description";
    if (!price) errors.price = "Please enter product price";
    else if (isNaN(price)) errors.price = "Please enter a valid number";
    if (!discount) errors.discount = "Please enter product discount";
    else if (isNaN(discount)) errors.discount = "Please enter a valid number";
    else if (discount > 100)
      errors.discount = "Discount should be less than 100";
    if (!quantity) errors.quantity = "Please enter product quantity";
    else if (isNaN(quantity)) errors.quantity = "Please enter a valid number";
    if (!category) errors.category = "Please enter product category";
    if (!photo.length) errors.photo = "Please upload product photo";
    setFormError(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchEditProductData = async () => {
    const productData = await editProduct(formData);
    setProduct(Array.isArray(productData) ? productData : []);
    setFormData(formFormat);
    setIsModelOpen(false);
  };

  const fetchCreateProductData = async () => {
    const productData = await createProduct(formData);
    setProduct(Array.isArray(productData) ? productData : []);
    setFormData(formFormat);
    setIsModelOpen(false);
    console.log("fihvivt");
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    if (!formCheck()) return;
    setLoding(true);
    try {
      formData._id
        ? await fetchEditProductData()
        : await fetchCreateProductData();
    } catch (error) {
      console.log(error);
    }
    setLoding(false);
  };

  useEffect(() => {
    const fetchCategory = async () => {
      const cate = await getCategory();
      setCategory(cate);
    };
    fetchCategory();
  }, []);

  console.log(formData.category, "ss");

  const categoryName = category.find((data) => data._id === formData.category);
  const cate = categoryName ? categoryName.name : null;

  return (
    <FormControl
      fullWidth
      sx={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}
    >
      {!formData._id ? (
        <Form.Group controlId="name" className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product name"
            value={formData.name}
            onChange={handleInputChange}
            isInvalid={!!formError.name}
            disabled={loading}
          />
          {formError.name && (
            <Form.Control.Feedback type="invalid">
              {formError.name}
            </Form.Control.Feedback>
          )}
        </Form.Group>
      ) : (
        ""
      )}

      <Form.Group controlId="description">
        <Form.Label>Description </Form.Label>
        <Form.Control
          as="textarea"
          placeholder="Enter product description"
          rows={3}
          value={formData.description}
          onChange={handleInputChange}
          isInvalid={!!formError.description}
          disabled={loading}
        />
        {formError.description && (
          <Form.Control.Feedback type="invalid">
            {formError.description}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      <div style={{ display: "flex" }}>
        <TextField
          id="price"
          label="Price"
          placeholder="Enter product price"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.price}
          onChange={handleInputChange}
          error={!!formError.price}
          helperText={formError.price}
          disabled={loading}
          className="me-2"
        />
        <TextField
          id="discount"
          label="Discount"
          placeholder="Enter product discount"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.discount}
          onChange={handleInputChange}
          error={!!formError.discount}
          helperText={formError.discount}
          disabled={loading}
        />
      </div>

      <div style={{ display: "flex" }}>
        <TextField
          id="quantity"
          label="Quantity"
          placeholder="Enter product quantity"
          variant="outlined"
          margin="normal"
          value={formData.quantity}
          onChange={handleInputChange}
          error={!!formError.quantity}
          helperText={formError.quantity}
          className="me-2"
          disabled={loading}
        />
        <Autocomplete
          id="category"
          fullWidth
          options={category.map((cat) => cat.name)}
          disabled={loading}
          value={cate && cate}
          onChange={(event, value) => {
            const id = category.find((category) => category.name === value);

            setFormData(
              { ...formData, category: id ? id._id : "" },
              setFormError("")
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Category"
              variant="outlined"
              margin="normal"
              error={!!formError.category}
              helperText={formError.category}
              disabled={loading}
            />
          )}
        />
      </div>

      <input
        accept="image/*"
        id="photo"
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={handleFileChange}
        disabled={loading}
      />
      <label htmlFor="photo" className="mt-2">
        <Typography variant="body1" gutterBottom>
          Choose product photo (up to 3 images)
        </Typography>
        <Button variant="contained" component="span" disabled={loading}>
          Upload
        </Button>
        <p className="mt-1" style={{ color: "red" }}>
          {formError?.photo}
        </p>
      </label>
      <List>
        {formData.photo.map((file, index) => (
          <ListItem key={index}>
            <img
              src={file}
              alt="Preview"
              style={{
                marginTop: "10px",
                maxWidth: "100px",
              }}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                style={{ color: "red" }}
                onClick={() => handleRemoveFile(index)}
                disabled={loading}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <FormControlLabel
        control={
          <Checkbox
            id="available"
            checked={formData.available}
            onChange={handleInputChange}
            disabled={loading}
          />
        }
        label="Check if product is available"
      />

      <FormControlLabel
        control={
          <Checkbox
            id="special"
            checked={formData.special}
            onChange={handleInputChange}
            disabled={loading}
          />
        }
        label=" Special of the day ?!"
      />

      <Button
        variant="contained"
        color="primary"
        onClick={onSubmitForm}
        disabled={loading}
        style={{ marginTop: "10px" }}
      >
        {loading ? <Spinner /> : " Submit"}
      </Button>
    </FormControl>
  );
}

export default ProductForm;
