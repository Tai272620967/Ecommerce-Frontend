"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { User } from "@/base/types/user";
import InputField from "@/base/components/Input/Input";
import { Button } from "@/base/components/Button/Button";
import Image from "next/image";
import { getImageUrl } from "@/base/utils/imageUrl";
import "./UserDetailForm.scss";

interface UserDetailFormProps {
  user: User;
  onUpdate: (userData: Partial<User>, avatarFile?: File) => Promise<void>;
}

export default function UserDetailForm({ user, onUpdate }: UserDetailFormProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      address1: user.address1 || "",
      address2: user.address2 || "",
      address3: user.address3 || "",
      address4: user.address4 || "",
      phone: user.phone || "",
      birthday: user.birthday ? user.birthday.split("T")[0] : "",
      gender: user.gender || "",
    },
  });

  useEffect(() => {
    // Set initial avatar preview
    if (user.avatarUrl) {
      setAvatarPreview(getImageUrl(user.avatarUrl));
    } else {
      // Use default avatar from Unsplash
      setAvatarPreview(getDefaultAvatar());
    }
  }, [user.avatarUrl]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      await onUpdate(data, avatarFile || undefined);
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get default avatar URL from Unsplash
  const getDefaultAvatar = () => {
    return "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face&auto=format";
  };

  return (
    <form className="user-detail-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="user-detail-form__avatar-section">
        <div className="user-detail-form__avatar-wrapper">
          <Image
            src={avatarPreview || getDefaultAvatar()}
            alt="User Avatar"
            width={150}
            height={150}
            className="user-detail-form__avatar"
            unoptimized
            onError={(e) => {
              // Prevent infinite loop by checking if already using default avatar
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('unsplash.com')) {
                target.src = getDefaultAvatar();
              }
            }}
          />
        </div>
        <div className="user-detail-form__avatar-upload">
          <label htmlFor="avatar-upload" className="muji-button">
            Upload Avatar
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: "none" }}
          />
        </div>
      </div>

      <div className="user-detail-form__fields">
        <div className="user-detail-form__row">
          <div className="user-detail-form__field">
            <label className="custom-label">First Name</label>
            <InputField
              name="firstName"
              register={register}
              errors={errors}
              className="input__user-detail"
            />
          </div>
          <div className="user-detail-form__field">
            <label className="custom-label">Last Name</label>
            <InputField
              name="lastName"
              register={register}
              errors={errors}
              className="input__user-detail"
            />
          </div>
        </div>

        <div className="user-detail-form__row">
          <div className="user-detail-form__field">
            <label className="custom-label">Email</label>
            <InputField
              name="email"
              value={user.email}
              register={register}
              errors={errors}
              className="input__user-detail"
              disabled
            />
          </div>
          <div className="user-detail-form__field">
            <label className="custom-label">Phone</label>
            <InputField
              name="phone"
              register={register}
              errors={errors}
              className="input__user-detail"
            />
          </div>
        </div>

        <div className="user-detail-form__row">
          <div className="user-detail-form__field">
            <label className="custom-label">Birthday</label>
            <InputField
              name="birthday"
              type="date"
              register={register}
              errors={errors}
              className="input__user-detail"
            />
          </div>
          <div className="user-detail-form__field">
            <label className="custom-label">Gender</label>
            <select
              {...register("gender")}
              className="custom-select"
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        <div className="user-detail-form__field">
          <label className="custom-label">Address 1</label>
          <InputField
            name="address1"
            register={register}
            errors={errors}
            className="input__user-detail"
          />
        </div>

        <div className="user-detail-form__field">
          <label className="custom-label">Address 2</label>
          <InputField
            name="address2"
            register={register}
            errors={errors}
            className="input__user-detail"
          />
        </div>

        <div className="user-detail-form__row">
          <div className="user-detail-form__field">
            <label className="custom-label">Address 3</label>
            <InputField
              name="address3"
              register={register}
              errors={errors}
              className="input__user-detail"
            />
          </div>
          <div className="user-detail-form__field">
            <label className="custom-label">Address 4</label>
            <InputField
              name="address4"
              register={register}
              errors={errors}
              className="input__user-detail"
            />
          </div>
        </div>

        <div className="user-detail-form__button-wrapper">
          <Button
            type="submit"
            className="muji-button muji-button--primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update User"}
          </Button>
        </div>
      </div>
    </form>
  );
}

