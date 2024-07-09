"use client";
import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import "./address.scss";
import { prefectures } from "./prefectures";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useForm } from "react-hook-form";
import { AddressData, AddressRef } from "@/app/types";

const Address = forwardRef<AddressRef>((props, ref) => {
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm();

  const watchSaveInfo = watch("saveInfo");

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("userInfo") || "{}");
    if (savedData) {
      for (const [key, value] of Object.entries(savedData)) {
        setValue(key, value);
      }
    }
  }, [setValue]);

  useEffect(() => {
    if (watchSaveInfo) {
      const dataToSave = {
        email: watch("email"),
        lastName: watch("lastName"),
        firstName: watch("firstName"),
        postalCode: watch("postalCode"),
        prefecture: watch("prefecture"),
        city: watch("city"),
        address: watch("address"),
        building: watch("building"),
        phoneNumber: watch("phoneNumber"),
      };
      localStorage.setItem("userInfo", JSON.stringify(dataToSave));
    }
  }, [watchSaveInfo, watch]);

  const getErrorMessage = (error: any) => {
    if (error && typeof error.message === "string") {
      return error.message;
    }
    return "";
  };

  useImperativeHandle(ref, () => ({
    validateForm: async () => {
      const result = await trigger();
      return result;
    },
    getAddressData: () => {
      const data = watch();
      return data as AddressData;
    },
  }));

  return (
    <form>
      <div className="input-user">
        <h2>連絡先</h2>
        <fieldset className="fieldset">
          <input
            className={`input-field mainfiled ${errors.email ? "error" : ""}`}
            placeholder=" "
            {...register("email", {
              required: "eメールは必須です",
              pattern: {
                value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                message: "無効なメールアドレスです",
              },
            })}
          />
          <label className="label-title">eメール</label>
        </fieldset>
        {errors.email && (
          <span className="error-message">{getErrorMessage(errors.email)}</span>
        )}
        <br />
        <h2>配達</h2>
        <p>この注文の請求先住所としても使用されます。</p>
        <div className="addFieldSet">
          <div className="subfiledset">
            <fieldset className="fieldset">
              <input
                className={`input-field subfiled ${
                  errors.lastName ? "error" : ""
                }`}
                placeholder=" "
                {...register("lastName", { required: "姓は必須です" })}
              />
              <label className="label-title">姓</label>
            </fieldset>
            {errors.lastName && (
              <span className="error-message">
                {getErrorMessage(errors.lastName)}
              </span>
            )}
            <fieldset className="fieldset">
              <input
                className={`input-field subfiled ${
                  errors.postalCode ? "error" : ""
                }`}
                placeholder=" "
                {...register("postalCode", {
                  required: "郵便番号は必須です",
                  pattern: {
                    value: /^\d{3}-\d{4}$/,
                    message: "無効な郵便番号です",
                  },
                })}
              />
              <label className="label-title">郵便番号（ハイフンあり）</label>
            </fieldset>
            {errors.postalCode && (
              <span className="error-message">
                {getErrorMessage(errors.postalCode)}
              </span>
            )}
          </div>

          <div className="subfiledset">
            <fieldset className="fieldset">
              <input
                className={`input-field subfiled ${
                  errors.firstName ? "error" : ""
                }`}
                placeholder=" "
                {...register("firstName", { required: "名は必須です" })}
              />
              <label className="label-title">名</label>
            </fieldset>
            {errors.firstName && (
              <span className="error-message">
                {getErrorMessage(errors.firstName)}
              </span>
            )}
            <fieldset className="fieldset">
              <div
                className={`select-wrapper ${errors.prefecture ? "error" : ""}`}
              >
                <select
                  className={`input-field subfiled ${
                    errors.prefecture ? "error" : ""
                  }`}
                  defaultValue=""
                  {...register("prefecture", {
                    required: "都道府県は必須です",
                  })}
                >
                  <option value="" disabled></option>
                  {prefectures.map((prefecture, index) => (
                    <option key={index} value={prefecture}>
                      {prefecture}
                    </option>
                  ))}
                </select>
                <label className="label-title">都道府県</label>
              </div>
            </fieldset>
            {errors.prefecture && (
              <span className="error-message">
                {getErrorMessage(errors.prefecture)}
              </span>
            )}
          </div>
        </div>

        <fieldset className="fieldset">
          <input
            className={`input-field mainfiled ${errors.city ? "error" : ""}`}
            placeholder=" "
            {...register("city", { required: "市区町村は必須です" })}
          />
          <label className="label-title">市区町村</label>
        </fieldset>
        {errors.city && (
          <span className="error-message">{getErrorMessage(errors.city)}</span>
        )}
        <fieldset className="fieldset">
          <input
            className={`input-field mainfiled ${errors.address ? "error" : ""}`}
            placeholder=" "
            {...register("address", { required: "住所は必須です" })}
          />
          <label className="label-title">住所</label>
        </fieldset>
        {errors.address && (
          <span className="error-message">
            {getErrorMessage(errors.address)}
          </span>
        )}
        <fieldset className="fieldset">
          <input
            className="input-field mainfiled"
            placeholder=" "
            {...register("building")}
          />
          <label className="label-title">建物名、部屋番号など</label>
        </fieldset>
        <fieldset className="fieldset tellphone">
          <input
            className={`input-field mainfiled ${
              errors.phoneNumber ? "error" : ""
            }`}
            placeholder=" "
            {...register("phoneNumber", {
              required: "電話番号は必須です",
              pattern: {
                value: /^\d{2,4}-\d{2,4}-\d{4}$/,
                message: "無効な電話番号です",
              },
            })}
          />
          <label className="label-title">電話番号（ハイフンあり）</label>
          <HelpOutlineIcon className="helpIcon" />
          <div className="caveat">
            ご注文について連絡をする必要があるときに使用します。
          </div>
        </fieldset>
        {errors.phoneNumber && (
          <span className="error-message">
            {getErrorMessage(errors.phoneNumber)}
          </span>
        )}
        <div className="checkBox">
          <input type="checkbox" {...register("saveInfo")} />
          <span>次回のためこの情報を保存する</span>
        </div>
      </div>
    </form>
  );
});

Address.displayName = "Address";
export default Address;
