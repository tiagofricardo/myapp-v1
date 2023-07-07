import axios from "axios";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { toasterOptions } from "@/utils/toaster/toasterOptions";
import { InputDateTimePicker } from "@/components/forms/InputDateTimePicker";
import {
  endDatePicker_validation,
  startDatePicker_validation,
} from "@/utils/forms/inputValidations";
import { Spinner } from "@/components/common/Spinner";

export default function HolidaysCoU({ onSubmit, editHolidaysData }) {
  const methods = useForm({ shouldUnregister: true });
  const [pageState, setPageState] = useState({
    error: "",
    processingForm: false,
    isFirstPickerRendered: false,
  });

  useEffect(() => {
    setPageState((prevState) => ({
      ...prevState,
      isFirstPickerRendered: true,
    }));
  }, []);

  const handleHolidaysCoU = methods.handleSubmit(
    async ({ startDatePicker, endDatePicker }) => {
      setPageState((old) => ({ ...old, processingForm: true, error: "" }));
      const data = {
        id: editHolidaysData?.id,
        start: startDatePicker,
        end: endDatePicker,
      };
      editHolidaysData?.id
        ? await axios
            .put("/api/holidays", data)
            .then((response) => {
              setPageState((old) => ({
                ...old,
                processingForm: false,
                error: "",
              }));
              toast.success("Holiday updated successfully", {
                ...toasterOptions,
              });
              onSubmit();
            })
            .catch((err) => {
              setPageState((old) => ({
                ...old,
                processingForm: false,
              }));
              toast.error(err.response.data, {
                ...toasterOptions,
              });
            })
        : await axios
            .post("/api/holidays", data)
            .then((response) => {
              setPageState((old) => ({
                ...old,
                processingForm: false,
                error: "",
              }));
              toast.success("Holiday created successfully", {
                ...toasterOptions,
              });
              onSubmit();
            })
            .catch((err) => {
              toast.error(err.response.data, {
                ...toasterOptions,
              });
            });
    }
  );
  return (
    <div className=" mt-10">
      {!editHolidaysData?.id ? (
        <h3>Create new Holiday</h3>
      ) : (
        <h3>{`Update holiday period`}</h3>
      )}
      <div className=" w-96 pr-5 ">
        <FormProvider {...methods}>
          <form
            onSubmit={(e) => e.preventDefault()}
            noValidate
            autoComplete="off"
          >
            <div className="flex flex-col gap-16 ">
              <div className="flex gap-3">
                <div className="w-full">
                  <InputDateTimePicker
                    {...startDatePicker_validation}
                    defaultValue={
                      editHolidaysData?.start
                        ? new Date(editHolidaysData.start)
                        : new Date()
                    }
                    isValidationOn
                    isShowTime={true}
                  />
                </div>
                <div className="w-full">
                  {pageState.isFirstPickerRendered && (
                    <InputDateTimePicker
                      {...endDatePicker_validation}
                      defaultValue={
                        editHolidaysData?.start
                          ? new Date(editHolidaysData?.end)
                          : new Date()
                      }
                      isValidationOn
                      isShowTime={true}
                      isEndDate
                    />
                  )}
                </div>
              </div>
            </div>
          </form>
        </FormProvider>

        <div className="mt-8 flex justify-center gap-5 ">
          <div className=" basis-2/5">
            <button
              className="btn-secondary "
              onClick={onSubmit}
              disabled={pageState.processingForm}
            >
              Back
            </button>
          </div>
          <div className="basis-2/5">
            <button
              className="btn-primary "
              onClick={handleHolidaysCoU}
              disabled={pageState.processingForm}
            >
              {pageState.processingForm ? (
                <Spinner />
              ) : (
                `${editHolidaysData?.id ? "Update" : "Create"}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
