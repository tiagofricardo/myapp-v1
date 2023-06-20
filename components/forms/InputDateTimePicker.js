import { useFormContext, Controller } from "react-hook-form";
import { AnimatePresence } from "framer-motion";
import { findInputError } from "@/utils/forms/findInputError";
import { isFormInvalid } from "@/utils/forms/isFormInvalid";
import InputError from "./InputError";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { pt } from "date-fns/locale";
import { format } from "date-fns";
import { useEffect, useState } from "react";

export const InputDateTimePicker = ({
  name,
  label,
  id,
  defaultValue,
  validation,
  isValidationOn,
  isEndDate,
  isShowTime,
  maxDate,
  minDate,
}) => {
  const {
    formState: { errors },
    control,
    watch,
    getValues,
  } = useFormContext();

  const [startDateSelected, setStartDateSelected] = useState();
  useEffect(() => {
    setStartDateSelected(watch().startDatePicker);
  }, [watch().startDatePicker]);

  if (isEndDate && !startDateSelected) {
    setStartDateSelected(getValues().startDatePicker);
  }

  function validate(value) {
    const selectedDate = new Date(value);
    const startDate = new Date(watch().startDatePicker);
    if (selectedDate <= startDate) {
      return "Invalid End Date ";
    }
    return true;
  }

  const updatedValidation = isEndDate
    ? { ...validation, validate: validate }
    : { ...validation };

  function formatDateSelected(value) {
    const formatDate = isShowTime
      ? format(
          value
            ? new Date(
                isEndDate
                  ? startDateSelected < value
                    ? value
                    : watch().startDatePicker
                  : value
              )
            : new Date(defaultValue),
          "dd MMM yyyy HH:mm",
          {
            locale: pt,
          }
        )
      : format(
          value
            ? new Date(
                isEndDate
                  ? startDateSelected < value
                    ? value
                    : watch().startDatePicker
                  : value
              )
            : new Date(defaultValue),
          "dd MMM yyyy HH:mm",
          {
            locale: pt,
          }
        );

    return formatDate;
  }

  const inputErrors = findInputError(errors, name);
  const isInvalid = isFormInvalid(inputErrors);
  registerLocale("ptPT", pt);

  return (
    <>
      <Controller
        id={id}
        name={name}
        control={control}
        rules={isValidationOn ? updatedValidation : undefined}
        defaultValue={defaultValue}
        render={({ field: { onChange, value } }) => (
          <DatePicker
            selected={
              isEndDate
                ? startDateSelected < value
                  ? value
                  : watch().startDatePicker
                : value
            }
            onChange={(date) => {
              onChange(date);
            }}
            dateFormat=" dd MMMM yyyy - HH:mm"
            showTimeSelect={isShowTime}
            locale="ptPT"
            timeCaption="Time"
            timeFormat="HH:mm"
            maxDate={maxDate ? maxDate : null}
            minDate={
              minDate ? minDate : isEndDate ? watch().startDatePicker : null
            }
            customInput={
              <div className="relative w-full">
                <input
                  id={id}
                  readOnly
                  value={formatDateSelected(value)}
                  className="peer h-ful l w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5  text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-primary focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                />
                <label
                  htmlFor={id}
                  className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 flex h-full w-full select-none text-sm font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-2.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-primary after:transition-transform after:duration-300 peer-placeholder-shown:leading-tight peer-placeholder-shown:text-blue-gray-500 peer-focus:text-sm peer-focus:leading-tight peer-focus:text-primary peer-focus:after:scale-x-100 peer-focus:after:border-primary peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
                >
                  {label}
                </label>
              </div>
            }
          />
        )}
      />

      <AnimatePresence>
        {isInvalid && (
          <InputError
            message={inputErrors.error.message}
            key={inputErrors.error.message}
          />
        )}
      </AnimatePresence>
    </>
  );
};
