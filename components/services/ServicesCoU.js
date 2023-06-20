import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { FormProvider, useForm } from "react-hook-form";
import { toasterOptions } from "@/utils/toaster/toasterOptions";
import { InputStatic } from "@/components/forms/InputStatic";
import { Spinner } from "@/components/common/Spinner";
import {
  name_validation,
  description_validation,
  price_validation,
  time_validation,
  category_validation,
} from "@/utils/forms/inputValidations";
import InputSelect from "../forms/InputSelect";
export default function ServicesCoU({
  categoriesOptions,
  servicesData,
  onSubmit,
}) {
  const methods = useForm();
  const [pageState, setPageState] = useState({
    error: "",
    processingForm: false,
  });
  const modifiedOptions = [
    { label: "Choose Category", value: 0 },
    ...categoriesOptions,
  ];

  const handleServiceCreate = methods.handleSubmit(
    async ({ name, description, price, time, categoryId }) => {
      const data = { ...{ name, description, price, time, categoryId } };
      setPageState((old) => ({ ...old, processingForm: true, error: "" }));

      if (!servicesData?.id) {
        try {
          await createService(data);
          setPageState((old) => ({ ...old, processingForm: false, error: "" }));
          toast.success("Service created successfully", {
            ...toasterOptions,
          });
          onSubmit();
        } catch (err) {
          setPageState((old) => ({
            ...old,
            processingForm: false,
            error: err.message,
          }));

          toast.error(pageState.error, {
            ...toasterOptions,
          });
        }
      } else {
        try {
          await updateService({ id: servicesData.id, ...data });
          setPageState((old) => ({ ...old, processingForm: false, error: "" }));
          toast.success("Service updated successfully", {
            ...toasterOptions,
          });
          onSubmit();
        } catch (err) {
          setPageState((old) => ({
            ...old,
            processingForm: false,
            error: err.message,
          }));

          toast.error(pageState.error, {
            ...toasterOptions,
          });
        }
      }
      methods.reset();
    }
  );

  async function createService(data) {
    await axios.post("/api/services", data).catch((err) => {
      throw new Error(err.response.data);
    });
  }

  async function updateService(data) {
    await axios.put("/api/services", data).catch((err) => {
      throw new Error(err.response.data);
    });
  }

  return (
    <>
      {!servicesData?.id ? (
        <h3>Create new Service</h3>
      ) : (
        <h3>{`Update service ${servicesData.name}`}</h3>
      )}
      <FormProvider {...methods}>
        <form
          onSubmit={(e) => e.preventDefault()}
          noValidate
          autoComplete="off"
        >
          <div className=" max-w-md flex flex-col gap-16 ">
            <InputStatic
              {...name_validation}
              defaultvalue={servicesData?.name}
              isValidationOn
            />
            <InputStatic
              {...description_validation}
              defaultvalue={servicesData?.description}
              isValidationOn
              isTextArea
            />
            <InputStatic
              {...price_validation}
              defaultvalue={servicesData?.price}
              isValidationOn
            />
            <InputStatic
              {...time_validation}
              defaultvalue={servicesData?.time}
              isValidationOn
            />

            <InputSelect
              {...category_validation}
              options={modifiedOptions}
              defaultvalue={servicesData?.categoryId}
              isValidationOn
            />

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
                  onClick={handleServiceCreate}
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
