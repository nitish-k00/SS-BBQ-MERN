import React, { useEffect, useState } from "react";
import {
  createCategory,
  deleteCategory,
  editCategorys,
  getCategory,
} from "../middleware/API";
import { Spinner } from "react-bootstrap";
import { Modal } from "antd";
import { Container, TextField } from "@mui/material";

function ACategory() {
  const [createCategoryValue, setCreateCategoryValue] = useState("");
  const [createCategoryError, setCreateCategoryError] = useState("");
  const [filterCategory, setFilterCategory] = useState([]);
  const [editCategory, setEditCategory] = useState("");
  const [editCategoryError, setEditCategoryError] = useState("");
  const [category, setCategory] = useState([]);
  const [deleteCate, setDeleteCate] = useState("");
  const [reRender, setReRender] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [DeleteModalOpen, setDeleteModalOpen] = useState(false);

  const onClickCreateCategory = async () => {
    if (createCategoryValue === "") {
      setCreateCategoryError("Please fill the category");
      return;
    }
    setLoadingCreate(true);
    try {
      await createCategory(createCategoryValue);
      setCreateCategoryValue("");
      setCreateCategoryError("");
      setReRender(!reRender);
    } catch (error) {
      console.error("Error creating category:", error);
    } finally {
      setLoadingCreate(false);
    }
  };

  const onClickEditCategory = async () => {
    if (editCategory.name === "") {
      setEditCategoryError("Please fill the category");
      return;
    }
    setLoadingEdit(true);
    try {
      await editCategorys(editCategory);
      setEditCategoryError("");
      setEditCategory("");
      setReRender(!reRender);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error editing category:", error);
    } finally {
      setLoadingEdit(false);
    }
  };

  const onclickDelete = async () => {
    setLoadingDelete(true);
    try {
      await deleteCategory(deleteCate);
      setReRender(!reRender);
      setDeleteModalOpen(false);
      setDeleteCate("");
    } catch (error) {
      console.error("Error deleteing category:", error);
    } finally {
      setLoadingDelete(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingList(true);
      try {
        const categoryData = await getCategory();
        setCategory(categoryData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingList(false);
      }
    };
    fetchCategories();
  }, [reRender]);

  useEffect(() => {
    const filterCategories = () => {
      const filteredCategory = category?.filter((data) =>
        data.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilterCategory(filteredCategory);
    };
    filterCategories();
  }, [searchValue, category]);

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Category</h2>
      <div className="d-flex mb-3">
        <div className=" me-3">
          <TextField
            type="text"
            value={createCategoryValue}
            placeholder="Enter Category name"
            onChange={(e) => setCreateCategoryValue(e.target.value)}
            error={!!createCategoryError}
            helperText={createCategoryError}
          />
        </div>
        <button
          className="btn btn-primary"
          style={{ width: "150px" }}
          onClick={onClickCreateCategory}
          disabled={loadingCreate || loadingList}
        >
          {loadingCreate ? (
            <Spinner animation="border" size="sm" />
          ) : (
            "Create Category"
          )}
        </button>
      </div>
      <input
        type="search"
        className="form-control mb-3"
        placeholder="Search Category"
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loadingList ? (
              <tr>
                <td colSpan="2" className="text-center">
                  <Spinner animation="border" size="sm" />
                </td>
              </tr>
            ) : (
              filterCategory?.map((Category) => (
                <tr key={Category._id}>
                  <td className="ps-5 pt-3">{Category.name}</td>
                  <td className="ps-5">
                    <button
                      className="btn btn-primary me-2 mb-1 "
                      onClick={() => (
                        setEditCategory(Category), setIsModalOpen(true)
                      )}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger mb-1"
                      onClick={() => (
                        setDeleteModalOpen(true), setDeleteCate(Category)
                      )}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Modal
        title="Edit Category"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <div className="my-4">
          <TextField
            type="text"
            onChange={(e) =>
              setEditCategory({
                ...editCategory,
                [e.target.name]: e.target.value,
              })
            }
            name="name"
            value={editCategory.name}
            error={!!editCategoryError}
            helperText={editCategoryError}
          />
          <button
            className="btn btn-primary mt-2 ms-3"
            onClick={onClickEditCategory}
            disabled={loadingEdit}
          >
            {loadingEdit ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Update Category"
            )}
          </button>
        </div>
      </Modal>
      <Modal
        title="Disclaimer"
        footer={null}
        onCancel={() => setDeleteModalOpen(false)}
        open={DeleteModalOpen}
        style={{ width: "400px" }}
      >
        <div style={{ padding: "20px" }}>
          <h2 style={{ marginBottom: "10px" }}>Warning</h2>
          <h4 style={{ marginBottom: "10px" }}>-- {deleteCate.name} --</h4>
          <p>
            If you delete the Category, the Products under the category will be
            deleted.
          </p>
          <p>Are you sure about that?</p>
          <div className="d-flex justify-content-between mt-4">
            <button
              className="btn btn-danger"
              onClick={onclickDelete}
              disabled={loadingDelete}
            >
              {loadingDelete ? <Spinner animation="border" size="sm" /> : "YES"}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setDeleteModalOpen(false)}
            >
              CANCEL
            </button>
          </div>
        </div>
      </Modal>
    </Container>
  );
}

export default ACategory;
