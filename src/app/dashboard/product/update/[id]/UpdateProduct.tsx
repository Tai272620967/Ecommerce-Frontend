"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, useForm } from "react-hook-form";
import "../../create/CreateProduct.scss";
import InputField from "@/base/components/Input/Input";
import CustomSelect, { SelectOption } from "@/base/components/Select/Select";
import { useEffect, useState } from "react";
import UploadCustom from "@/base/components/Upload/Upload";
import TextArea from "@/base/components/TextArea/TextArea";
import { Button } from "@/base/components/Button/Button";
import { updateProductApi, fetchProductByIdApi } from "@/base/utils/api/product";
import {
  fetchAllMainCategoryApi,
  fetchCategoriesBySubCategoryIdApi,
  fetchSubCategoriesByMainCategoryIdApi,
} from "@/base/utils/api/category";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { message } from "antd";
import { useParams, useRouter } from "next/navigation";
import { getImageUrl } from "@/base/utils/imageUrl";
import Image from "next/image";

const UpdateProduct: React.FC = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const productId = params.id;
  const [selectedOption, setSelectedOption] = useState<
    SelectOption | undefined
  >(undefined);
  const [selectedMainCategoryOption, setSelectedMainCategoryOption] = useState<
    SelectOption | undefined
  >(undefined);
  const [selectedSubCategoryOption, setSelectedSubCategoryOption] = useState<
    SelectOption | undefined
  >(undefined);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadKey, setUploadKey] = useState<number>(0);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [mainCategories, setMainCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  type FormValues = {
    name: string;
    categoryId: string;
    minPrice: string;
    maxPrice?: string;
    stockQuantity: string;
    description: string;
    imageFile: File | null;
  };

  const yupSchema = yup.object().shape({
    name: yup.string().required("Product name is required"),
    categoryId: yup.string().required("Category is required"),
    imageFile: yup
      .mixed()
      .nullable()
      .test(
        "fileType",
        "Invalid file format. Only image formats (jpg, jpeg, png, avif, webp) are accepted.",
        (value) => {
          if (!value) return true;
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
        if (!value || value.trim() === "") return true;
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
      setValue("categoryId", selected.value.toString());
    } else {
      setValue("categoryId", "");
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
        
        if (selectedSubCategoryOption) {
          const stillExists = newSubCategories.find(
            (cat) => cat.value === selectedSubCategoryOption.value
          );
          if (stillExists) {
            setSelectedSubCategoryOption(stillExists);
            fetchCategories(selectedSubCategoryOption.value.toString());
          }
        }
      }
    } catch (error) {
      // Error fetching sub categories
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
        
        if (selectedOption) {
          const stillExists = newCategories.find(
            (cat) => cat.value === selectedOption.value
          );
          if (stillExists) {
            setSelectedOption(stillExists);
            setValue("categoryId", stillExists.value.toString());
          }
        }
      }
    } catch (error) {
      // Error fetching categories
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

  const loadProductData = async () => {
    if (!productId) return;
    
    try {
      setIsLoading(true);
      const productResponse = await fetchProductByIdApi(productId);
      
      // Handle ProductResponse structure: { data: Product }
      const product = (productResponse as any).data || productResponse;
      
      if (product) {
        setValue("name", product.name || "");
        setValue("minPrice", product.minPrice?.toString() || "");
        setValue("maxPrice", product.maxPrice?.toString() || "");
        setValue("stockQuantity", product.stockQuantity?.toString() || "");
        setValue("description", product.description || "");
        
        if (product.imageUrl) {
          setCurrentImageUrl(getImageUrl(product.imageUrl));
        }
        
        // Type cast to access category (not in Product interface but exists in API response)
        const productWithCategory = product as any;
        if (productWithCategory.category) {
          const categoryId = productWithCategory.category.id.toString();
          
          if (productWithCategory.category.subCategory) {
            const subCategoryId = productWithCategory.category.subCategory.id.toString();
            
            if (productWithCategory.category.subCategory.mainCategory) {
              const mainCategoryId = productWithCategory.category.subCategory.mainCategory.id.toString();
              
              const mainCategoryOption = mainCategories.find(
                (cat) => cat.value.toString() === mainCategoryId
              );
              if (mainCategoryOption) {
                setSelectedMainCategoryOption(mainCategoryOption);
                
                const subCategoriesResponse = await fetchSubCategoriesByMainCategoryIdApi(mainCategoryId);
                if (subCategoriesResponse) {
                  const newSubCategories = subCategoriesResponse.data.map((optionSubCategory) => ({
                    label: optionSubCategory.name,
                    value: optionSubCategory.id,
                  }));
                  setSubCategories(newSubCategories);
                  
                  const subCategoryOption = newSubCategories.find(
                    (cat) => cat.value.toString() === subCategoryId
                  );
                  if (subCategoryOption) {
                    setSelectedSubCategoryOption(subCategoryOption);
                    
                    const categoriesResponse = await fetchCategoriesBySubCategoryIdApi(subCategoryId);
                    if (categoriesResponse) {
                      const newCategories = categoriesResponse.map((optionCategory) => ({
                        label: optionCategory.name,
                        value: optionCategory.id,
                      }));
                      setCategories(newCategories);
                      
                      const categoryOption = newCategories.find(
                        (cat) => cat.value.toString() === categoryId
                      );
                      if (categoryOption) {
                        setSelectedOption(categoryOption);
                        setValue("categoryId", categoryId);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } catch (error: any) {
      message.error("Failed to load product data");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    if (!productId) return;
    
    setIsUpdating(true);
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("minPrice", data.minPrice);
      if (data.maxPrice && data.maxPrice.trim() !== "") {
        formData.append("maxPrice", data.maxPrice);
      }
      formData.append("description", data.description || "");
      formData.append("stockQuantity", data.stockQuantity);
      formData.append("categoryId", data.categoryId);

      if (imageFile) {
        formData.append("imageFile", imageFile);
      }

      const response = await updateProductApi(parseInt(productId), formData);

      if (response) {
        message.success("Product updated successfully!");
        setTimeout(() => {
          router.push("/dashboard/product");
        }, 1000);
      }
    } catch (error: any) {
      if (error.response?.data?.error) {
        message.error(error.response.data.error);
      } else {
        message.error("Failed to update product. Please try again.");
      }
    } finally {
      setIsUpdating(false);
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
      }
    } catch (error) {
      // Error fetching main categories
    }
  };

  useEffect(() => {
    fetchMainCategories();
  }, []);

  useEffect(() => {
    if (mainCategories.length > 0) {
      loadProductData();
    }
  }, [mainCategories.length]);

  if (isLoading) {
    return (
      <div className="create-product__wrapper">
        <div style={{ padding: "40px", textAlign: "center" }}>Loading product data...</div>
      </div>
    );
  }

  return (
    <form className="create-product__wrapper" onSubmit={handleSubmit(onSubmit)}>
      {isUpdating && (
        <div className="create-product__overlay">
          <div className="create-product__spinner" />
        </div>
      )}
      <h1 className="create-product__title">Update Product</h1>
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
          handleChangeSubCategory(selected);
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
              field.onChange(selected);
              handleChange(selected);
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
        {currentImageUrl && !imageFile && (
          <div style={{ marginBottom: "16px" }}>
            <p style={{ marginBottom: "8px", fontSize: "14px", color: "#6d6d72" }}>
              Current image:
            </p>
            <Image
              src={currentImageUrl}
              alt="Current product image"
              width={200}
              height={200}
              style={{ objectFit: "cover", borderRadius: "4px" }}
              unoptimized
            />
          </div>
        )}
        <UploadCustom
          key={uploadKey}
          setFile={(file: File | null) => {
            setImageFile(file);
            setValue("imageFile", file, { shouldValidate: true });
            if (file) {
              setCurrentImageUrl(null);
            }
          }}
        />
        {errors.imageFile && (
          <p className="error-message__upload-image">
            {errors.imageFile.message}
          </p>
        )}
        <p style={{ marginTop: "8px", fontSize: "12px", color: "#6d6d72" }}>
          Leave empty to keep current image
        </p>
      </div>
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextArea
            {...field}
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
        <Button className="create-product__button">Update Product</Button>
      </div>
    </form>
  );
};

export default UpdateProduct;

