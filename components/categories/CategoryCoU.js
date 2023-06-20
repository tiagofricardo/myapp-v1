import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { FormProvider, useForm } from "react-hook-form";
import { toasterOptions } from "@/utils/toaster/toasterOptions";
import { InputStatic } from "@/components/forms/InputStatic";
import { Spinner } from "@/components/common/Spinner";
import {
  description_validation,
  name_validation,
  color_validation,
} from "@/utils/forms/inputValidations";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import InputError from "@/components/forms/InputError";
import { BsUpload } from "react-icons/bs";
import { HiOutlineTrash } from "react-icons/hi";
import InputSelectWithComp from "../forms/InputSelectWithComp";
import { colorOptions } from "@/utils/colorsOptions";

export default function CategoryCoU({ categoryData, onSubmit }) {
  const methods = useForm();
  const [image, setImage] = useState(categoryData?.image || "");
  const [prevImage, setPrevImage] = useState("");
  const [pageState, setPageState] = useState({
    error: "",
    processingForm: false,
    processingImage: false,
    showEmptyImage: false,
  });
  const handleCategoryCreate = methods.handleSubmit(
    async ({ name, color, description }) => {
      if (!image) {
        setPageState((old) => ({ ...old, showEmptyImage: true }));
        return;
      }
      const colorRef = color.value;
      setPageState((old) => ({ ...old, processingForm: true, error: "" }));
      if (!categoryData?.id) {
        await axios
          .post("/api/categories", {
            name,
            colorRef,
            description,
            image,
          })
          .then((response) => {
            setPageState((old) => ({
              ...old,
              processingForm: false,
              error: "",
            }));
            onSubmit();
            toast.success("Category created successfully", {
              ...toasterOptions,
            });
          })
          .catch((err) => {
            setPageState((old) => ({
              ...old,
              processingForm: false,
              error: err.response?.data,
            }));
            toast.error(pageState.error, {
              ...toasterOptions,
            });
          });
      } else {
        const id = categoryData?.id;
        await axios
          .put("/api/categories", {
            id,
            name,
            colorRef,
            description,
            image,
          })
          .then((response) => {
            setPageState((old) => ({
              ...old,
              processingForm: false,
              error: "",
            }));
            onSubmit();
            toast.success("Category updated successfully", {
              ...toasterOptions,
            });
          })
          .catch((err) => {
            setPageState((old) => ({
              ...old,
              processingForm: false,
              error: err.response.data,
            }));
            toast.error(pageState.error, {
              ...toasterOptions,
            });
          });
        deleteImage(true);
      }

      methods.reset();
    }
  );

  async function uploadImage(ev) {
    setPageState((old) => ({
      ...old,
      processingImage: true,
      showEmptyImage: false,
    }));
    const files = ev.target?.files;
    if (files?.length > 0) {
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios
        .post("api/supabaseImages", data)
        .then((response) => {
          setImage(response.data);
        })
        .catch((error) => {});
    }
    setPageState((old) => ({
      ...old,
      processingImage: false,
    }));
  }

  async function deleteImage(isSubmit) {
    if (!isSubmit) {
      setPrevImage(image);
      setImage("");
    }
    setPageState((old) => ({
      ...old,
      processingForm: true,
      error: "",
    }));
    await axios
      .delete(`/api/supabaseImagesDelete?imagePath=${prevImage}`)
      .then((response) => {
        setPageState((old) => ({
          ...old,
          processingForm: false,
          error: "",
        }));
        setImage("");
      })
      .catch((error) => {
        setPageState((old) => ({
          ...old,
          processingForm: false,
          error: error?.response?.data,
        }));
      });
  }

  return (
    <>
      {!categoryData?.id ? (
        <h3>Create new Category</h3>
      ) : (
        <h3>{`Update category ${categoryData.name}`}</h3>
      )}

      <FormProvider {...methods}>
        <form
          onSubmit={(e) => e.preventDefault()}
          noValidate
          autoComplete="off"
          className=""
        >
          <div className=" max-w-md flex flex-col gap-16 ">
            <div className="flex gap-4 items-center justify-between">
              <div className=" basis-8/12">
                <InputStatic
                  {...name_validation}
                  defaultvalue={categoryData?.name}
                  isValidationOn
                />
              </div>

              <div className="basis-4/12 ">
                <InputSelectWithComp
                  {...color_validation}
                  isLabelVisible
                  options={colorOptions}
                  defaultvalue={categoryData?.colorRef || colorOptions[0].value}
                />
              </div>
            </div>

            <InputStatic
              {...description_validation}
              defaultvalue={categoryData?.description}
              isValidationOn
              isTextArea
            />
            <div className="flex flex-col justify-center items-center w-52 h-52">
              {pageState.processingImage ? (
                <Spinner />
              ) : !image ? (
                <div className="w-full h-full">
                  <label className=" min-w-full min-h-full cursor-pointer text-center flex flex-col items-center justify-center gap-1 text-sm text-primary bg-ultralight rounded-lg  transition-all ease-in-out duration-500 hover:shadow-md hover:shadow-slate-200 hover:gap-3 ">
                    <BsUpload size={20} />
                    <div>Add Image</div>
                    <input
                      type="file"
                      onChange={uploadImage}
                      className="hidden"
                    ></input>
                  </label>

                  <AnimatePresence mode="wait" initial={false}>
                    {pageState.showEmptyImage && (
                      <InputError message={"Required"} />
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => {
                    deleteImage(false);
                  }}
                  className="relative w-max group "
                >
                  <Image
                    alt={image}
                    className="ease-in-out transition-all duration-300 group-hover:opacity-25 "
                    src={image}
                    width={208}
                    height={208}
                    style={{
                      maxWidth: "208px",
                      maxHeight: "208px",
                    }}
                  />
                  <label className="absolute inset-0 translate-y-10 flex items-center justify-center opacity-0 ease-in-out transition-all duration-300 group-hover:-translate-y-0 group-hover:opacity-100 group-hover:cursor-pointer ">
                    <HiOutlineTrash className="text-primary" size={40} />
                  </label>
                </button>
              )}
            </div>
            <div className="flex justify-start items-center gap-8">
              <div>
                <button
                  onClick={() => {
                    onSubmit();
                  }}
                  className="btn-secondary"
                  disabled={pageState.processingForm}
                >
                  Back
                </button>
              </div>
              <div className="w-5/12">
                <button
                  onClick={handleCategoryCreate}
                  className="btn-primary "
                  disabled={pageState.processingForm}
                >
                  {pageState.processingForm ? <Spinner /> : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  );
}
