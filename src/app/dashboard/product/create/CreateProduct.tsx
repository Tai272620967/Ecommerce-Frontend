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
    name: yup.string().required(""),
    categoryId: yup.string().required(""),
    imageFile: yup
      .mixed()
      .nullable() // Cho phép giá trị null
      .required() // Thêm thông báo yêu cầu
      .test(
        "fileType",
        "Invalid file, only image formats (jpg, jpeg, png, gif) are accepted.",
        (value) => {
          if (!value) return true; // Cho phép giá trị null
          if (value instanceof File) {
            // Kiểm tra MIME type của file
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

    description: yup.string().required(""),
    minPrice: yup.string().required(""),
    maxPrice: yup.string(),
    stockQuantity: yup.string().required(""),
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
        setSubCategories(
          response.data.map((optionSubCategory) => ({
            label: optionSubCategory.name,
            value: optionSubCategory.id,
          }))
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategories = async (id: string) => {
    try {
      const response = await fetchCategoriesBySubCategoryIdApi(id);
      if (response) {
        setCategories(
          response.map((optionCategory) => ({
            label: optionCategory.name,
            value: optionCategory.id,
          }))
        );
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

      // Thêm các trường dữ liệu từ `data` vào FormData
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      // Thêm file ảnh nếu có
      if (imageFile) {
        formData.append("imageFile", imageFile);
      }

      // Gửi API
      const response = await createProductApi(formData);

      if (response) {
        // Xử lý logic nếu thành công
        setTimeout(() => {
          message.success("Create Product successfully!");
          setIsCreating(false);
          setValue("name", "");
          setValue("categoryId", "");
          setValue("imageFile", null);
          setImageFile(null);
          setCategories([]);
          setSubCategories([]);
          setMainCategories([]);
          setSelectedOption({ label: "Choose an option", value: 0 });
          setSelectedSubCategoryOption({ label: "Choose an option", value: 0 });
          setSelectedMainCategoryOption({
            label: "Choose an option",
            value: 0,
          });
          setValue("minPrice", "");
          setValue("maxPrice", "");
          setValue("stockQuantity", "");
          setValue("description", "");
        }, 1500);
      } else {
        console.log("Tạo sản phẩm không thành công.");
        setIsCreating(false);
      }
    } catch (error) {
      // Xử lý lỗi
      console.error("Lỗi khi tạo sản phẩm:", error);
      setIsCreating(false);
    }
  };

  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const response = await fetchAllMainCategoryApi();
        if (response) {
          setMainCategories(
            response.data.result.map((optionMainCategory) => ({
              label: optionMainCategory.name,
              value: optionMainCategory.id,
            }))
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

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
        placeholder="Choose an option"
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
            label="Product Sub Category"
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
