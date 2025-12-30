"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, useForm } from "react-hook-form";
import "./CreateProduct.scss";
import InputField from "@/base/components/Input/Input";
import CustomSelect, { SelectOption } from "@/base/components/Select/Select";
import { useEffect, useState } from "react";
import UploadCustom from "@/base/components/Upload/Upload";
import TextArea from "@/base/components/TextArea/TextArea";
import { Button } from "@/base/components/Button/Button";
import { createProductApi } from "@/base/utils/api/product";
import {
  fetchAllMainCategoryApi,
  fetchCategoriesBySubCategoryIdApi,
  fetchSubCategoriesByMainCategoryIdApi,
} from "@/base/utils/api/category";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { message } from "antd";

const CreateProduct: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<
    SelectOption | undefined
  >(undefined);
  const [selectedMainCategoryOption, setSelectedMainCategoryOption] = useState<
    SelectOption | undefined
  >(undefined);
  const [selectedSubCategoryOption, setSelectedSubCategoryOption] = useState<
    SelectOption | undefined
  >(undefined);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null); // State to store the uploaded image
  const [uploadKey, setUploadKey] = useState<number>(0); // Key to force re-render Upload component
  const [mainCategories, setMainCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // Định nghĩa kiểu dữ liệu cho form
  type FormValues = {
    name: string;
    categoryId: string;
    minPrice: string;
    maxPrice?: string;
    stockQuantity: string;
    description: string;
    imageFile: File | null; // Kiểu dữ liệu cho file
  };

  const yupSchema = yup.object().shape({
    name: yup.string().required("Product name is required"),
    categoryId: yup.string().required("Category is required"),
    imageFile: yup
      .mixed()
      .nullable()
      .required("Product image is required")
      .test(
        "fileType",
        "Invalid file format. Only image formats (jpg, jpeg, png, avif, webp) are accepted.",
        (value) => {
          if (!value) return false;
          if (value instanceof File) {
            return [
              "image/jpeg",
              "image/png",
              "image/gif",
              "image/avif",
              "image/webp",
            ].includes(value.type);
          }
          return false;
        }
      ),
    description: yup.string().required("Description is required"),
    minPrice: yup
      .string()
      .required("Minimum price is required")
      .test("is-number", "Minimum price must be a valid number", (value) => {
        if (!value) return false;
        const num = parseFloat(value);
        return !isNaN(num) && num > 0;
      }),
    maxPrice: yup
      .string()
      .test("is-number", "Maximum price must be a valid number", (value) => {
        if (!value || value.trim() === "") return true; // Optional field
        const num = parseFloat(value);
        return !isNaN(num) && num > 0;
      })
      .test("greater-than-min", "Maximum price must be greater than minimum price", function(value) {
        const minPrice = parseFloat(this.parent.minPrice);
        if (!value || value.trim() === "" || isNaN(minPrice)) return true;
        const maxPrice = parseFloat(value);
        return maxPrice >= minPrice;
      }),
    stockQuantity: yup
      .string()
      .required("Stock quantity is required")
      .test("is-integer", "Stock quantity must be a valid positive integer", (value) => {
        if (!value) return false;
        const num = parseInt(value);
        return !isNaN(num) && num >= 0;
      }),
  });

  const defaultValues = {
    name: "",
    categoryId: "",
    minPrice: "",
    maxPrice: "",
    stockQuantity: "",
    description: "",
    imageFile: null,
  };

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<FormValues>({
    resolver: yupResolver(yupSchema) as any,
    defaultValues,
  });

  const handleChange = (selected: SelectOption | undefined) => {
    setSelectedOption(selected);
    if (selected) {
      setValue("categoryId", selected.value.toString()); // Gán giá trị vào React Hook Form
    } else {
      setValue("categoryId", ""); // Nếu không có lựa chọn nào, gán giá trị trống
    }
  };

  const fetchSubCategories = async (id: string) => {
    try {
      const response = await fetchSubCategoriesByMainCategoryIdApi(id);
      if (response) {
        const newSubCategories = response.data.map((optionSubCategory) => ({
          label: optionSubCategory.name,
          value: optionSubCategory.id,
        }));
        setSubCategories(newSubCategories);
        
        // Preserve selected sub category if it still exists in the new list
        if (selectedSubCategoryOption) {
          const stillExists = newSubCategories.find(
            (cat) => cat.value === selectedSubCategoryOption.value
          );
          if (stillExists) {
            // Keep the selection, but update with new data
            setSelectedSubCategoryOption(stillExists);
            // Reload categories for the selected sub category
            fetchCategories(selectedSubCategoryOption.value.toString());
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategories = async (id: string) => {
    try {
      const response = await fetchCategoriesBySubCategoryIdApi(id);
      if (response) {
        const newCategories = response.map((optionCategory) => ({
          label: optionCategory.name,
          value: optionCategory.id,
        }));
        setCategories(newCategories);
        
        // Preserve selected category if it still exists in the new list
        if (selectedOption) {
          const stillExists = newCategories.find(
            (cat) => cat.value === selectedOption.value
          );
          if (stillExists) {
            // Keep the selection, but update with new data
            setSelectedOption(stillExists);
            setValue("categoryId", stillExists.value.toString());
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeMainCategory = (selected: SelectOption | undefined) => {
    if (!selected) return;
    setSelectedMainCategoryOption(selected);
    fetchSubCategories(selected.value.toString());
  };

  const handleChangeSubCategory = (selected: SelectOption | undefined) => {
    if (!selected) return;
    setSelectedSubCategoryOption(selected);
    fetchCategories(selected.value.toString());
  };

  const onSubmit = async (data: any) => {
    setIsCreating(true);
    try {
      const formData = new FormData();

      // Add form fields to FormData with correct parameter names
      formData.append("name", data.name);
      formData.append("minPrice", data.minPrice);
      if (data.maxPrice && data.maxPrice.trim() !== "") {
        formData.append("maxPrice", data.maxPrice);
      }
      formData.append("description", data.description || "");
      formData.append("stockQuantity", data.stockQuantity);
      formData.append("categoryId", data.categoryId);

      // Add image file
      if (imageFile) {
        formData.append("imageFile", imageFile);
      } else {
        message.error("Product image is required");
        setIsCreating(false);
        return;
      }

      // Send API request
      const response = await createProductApi(formData);

      if (response) {
        message.success("Product created successfully!");
        
        // Reset form fields but keep category selections
        setTimeout(() => {
          setIsCreating(false);
          setValue("name", "");
          setValue("categoryId", "");
          setValue("imageFile", null);
          setImageFile(null);
          // Force re-render Upload component to clear the image preview
          setUploadKey((prev) => prev + 1);
          // Keep categories data - don't reset them
          // setCategories([]);
          // setSubCategories([]);
          // setMainCategories([]);
          // Keep selected options - don't reset them
          // setSelectedOption(undefined);
          // setSelectedSubCategoryOption(undefined);
          // setSelectedMainCategoryOption(undefined);
          setValue("minPrice", "");
          setValue("maxPrice", "");
          setValue("stockQuantity", "");
          setValue("description", "");
          
          // Reload categories after successful product creation to get latest data
          fetchMainCategories();
        }, 1000);
      }
    } catch (error: any) {
      console.error("Error creating product:", error);
      if (error.response?.data?.error) {
        message.error(error.response.data.error);
      } else {
        message.error("Failed to create product. Please try again.");
      }
      setIsCreating(false);
    }
  };

  const fetchMainCategories = async () => {
    try {
      const response = await fetchAllMainCategoryApi();
      if (response) {
        const newMainCategories = response.data.result.map((optionMainCategory) => ({
          label: optionMainCategory.name,
          value: optionMainCategory.id,
        }));
        setMainCategories(newMainCategories);
        
        // Preserve selected main category if it still exists in the new list
        if (selectedMainCategoryOption) {
          const stillExists = newMainCategories.find(
            (cat) => cat.value === selectedMainCategoryOption.value
          );
          if (stillExists) {
            // Keep the selection, but update with new data
            setSelectedMainCategoryOption(stillExists);
            // Reload sub categories for the selected main category
            fetchSubCategories(selectedMainCategoryOption.value.toString());
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMainCategories();
  }, []);

  return (
    <form className="create-product__wrapper" onSubmit={handleSubmit(onSubmit)}>
      {/* Overlay và spinner */}
      {isCreating && (
        <div className="create-product__overlay">
          <div className="create-product__spinner" />
        </div>
      )}
      <h1 className="create-product__title">Create Product</h1>
      <InputField
        name="name"
        register={register}
        errors={errors}
        label="Product name"
        className="input__product-name"
        isCustom
      />
      <CustomSelect
        options={mainCategories}
        value={selectedMainCategoryOption}
        onChange={(selected) => {
          //   field.onChange(selected);
          handleChangeMainCategory(selected);
        }}
        placeholder="Choose an option"
        label="Product Main Category"
        className="custom-select__wrapper"
        labelClassName="custom-label"
        selectClassName="custom-select"
      />
      <CustomSelect
        options={subCategories}
        value={selectedSubCategoryOption}
        onChange={(selected) => {
          handleChangeSubCategory(selected); // Update local state
        }}
        placeholder="Choose a sub category"
        label="Product Sub Category"
        className="custom-select__wrapper"
        labelClassName="custom-label"
        selectClassName="custom-select"
      />
      <Controller
        name="categoryId"
        control={control}
        render={({ field }) => (
          <CustomSelect
            options={categories}
            value={selectedOption}
            onChange={(selected) => {
              field.onChange(selected); // Update React Hook Form value
              handleChange(selected); // Update local state
            }}
            placeholder="Choose an option"
            label="Product Category"
            className="custom-select__wrapper"
            labelClassName="custom-label"
            selectClassName="custom-select"
          />
        )}
      />
      {errors.categoryId && (
        <p className="error-message__category">{errors.categoryId.message}</p>
      )}
      <div className="create-product__upload-image">
        <label className="create-product__upload-image-label">
          Image of Product
        </label>
        {/* Truyền setFile vào UploadCustom */}
        <UploadCustom
          key={uploadKey}
          setFile={(file: File | null) => {
            setImageFile(file); // Cập nhật file vào state
            setValue("imageFile", file, { shouldValidate: true }); // Lưu file và kích hoạt validate
          }}
        />
        {errors.imageFile && (
          <p className="error-message__upload-image">
            {errors.imageFile.message}
          </p>
        )}
      </div>
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextArea
            {...field} // Pass down the input props from React Hook Form
            className="custom"
            label="Additional Description"
            labelClassName="custom"
          />
        )}
      />
      {errors.description && (
        <p className="error-message__description">
          {errors.description.message}
        </p>
      )}
      <div className="input__product-price__wrapper">
        <InputField
          name="minPrice"
          register={register}
          errors={errors}
          label="Product min price"
          className="input__product-price"
          isCustom
        />
      </div>
      <div className="input__product-price__wrapper">
        <InputField
          name="maxPrice"
          register={register}
          errors={errors}
          label="Product max price"
          className="input__product-price"
          isCustom
        />
      </div>
      <div className="input__product-stock__wrapper">
        <InputField
          name="stockQuantity"
          register={register}
          errors={errors}
          label="Product stock quantity"
          className="input__product-stock"
          isCustom
        />
      </div>
      <div className="create-product__button-wrapper">
        <Button className="create-product__button">Submit</Button>
      </div>
    </form>
  );
};

export default CreateProduct;
