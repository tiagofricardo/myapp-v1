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

export const InputTimePicker = ({
  name,
  label,
  id,
  defaultValue,
  validation,
  isValidationOn,
  isEndDate,
}) => {
  const {
    formState: { errors },

    control,
    watch,
    getValues,
    clearErrors,
  } = useFormContext();

  const inputs = Object.entries(getValues()).map(([name, value]) => ({
    name,
    value,
  }));

  const inputId = name.split("-")[1];
  const inputName = name.split("-")[0];
  const oppositeTimePicker = inputs
    .filter((obj) => {
      const value = obj.name.split("-")[1];
      return value === inputId && obj.name !== name;
    })
    .shift();

  const filterTime = (time) => {
    const compareDate = new Date(oppositeTimePicker.value);
    const timeValue = new Date(time);
    return compareDate.getTime() < timeValue.getTime();
  };

  function validateEndTime(inputValue) {
    const allInputs = Object.entries(getValues()).map(([name, value]) => ({
      name,
      value,
    }));
    const endDateInputs = allInputs.filter((obj) => {
      const inputNames = obj.name.split("-")[0];
      return inputNames === inputName && obj.name !== "keepValues";
    });
    const repeatedValues = endDateInputs.filter((objeto, index, arr) => {
      const valueToValidate = objeto.value?.toString();
      return arr.some(
        (item, i) => i !== index && item.value?.toString() === valueToValidate
      );
    });
    if (repeatedValues.some((objeto) => objeto.name === name)) {
      return "Same value";
    }
    const startDateInputs = allInputs.filter((obj) => {
      const inputNames = obj.name.split("-")[0];
      return inputNames !== inputName && obj.name !== "keepValues";
    });

    const objetosComInterseccao = [];

    for (let i = 0; i < endDateInputs.length; i++) {
      const currentObj = endDateInputs[i];
      const currentId = currentObj.name.split("-")[1];
      const currentName = currentObj.name.split("-")[0];
      const currentEndTime = currentObj.value;
      const currentStartTime = startDateInputs
        .filter((obj) => {
          const value = obj.name.split("-")[1];
          return value === currentId && obj.name !== currentName;
        })
        .shift().value;

      for (let j = i + 1; j < endDateInputs.length; j++) {
        const comparedObj = endDateInputs[j];
        const comparedId = comparedObj.name.split("-")[1];
        const comparedName = comparedObj.name.split("-")[0];
        const comparedEndTime = comparedObj.value;
        const comparedStartTime = startDateInputs
          .filter((obj) => {
            const value = obj.name.split("-")[1];
            return value === comparedId && obj.name !== comparedName;
          })
          .shift().value;

        if (
          (comparedStartTime > currentStartTime &&
            comparedStartTime < currentEndTime) ||
          (comparedEndTime > currentStartTime &&
            comparedEndTime < currentEndTime) ||
          (currentStartTime > comparedStartTime &&
            currentEndTime < comparedEndTime)
        ) {
          objetosComInterseccao.push(comparedObj, currentObj);
        }
      }
    }
    if (objetosComInterseccao.some((objeto) => objeto.name === name)) {
      return "Time not valid";
    }
  }

  const updatedValidation = isEndDate
    ? { ...validation, validate: validateEndTime }
    : { ...validation };

  function formatDateSelected(value) {
    const formatDate = format(
      value
        ? new Date(
            isEndDate
              ? oppositeTimePicker.value < value
                ? value
                : watch(oppositeTimePicker.name)
              : value
          )
        : new Date(defaultValue),
      "HH:mm",
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
                ? oppositeTimePicker.value < value
                  ? value
                  : watch(oppositeTimePicker.name)
                : value
            }
            onChange={(date) => {
              onChange(date);
              clearErrors();
            }}
            dateFormat="HH:mm"
            showTimeSelect
            showTimeSelectOnly
            locale="ptPT"
            timeCaption="Time"
            timeFormat="HH:mm"
            timeIntervals={15}
            filterTime={isEndDate ? filterTime : undefined}
            customInput={
              <div className="relative w-full">
                <input
                  id={id}
                  readOnly
                  value={formatDateSelected(value)}
                  className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5  text-sm text-center font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-primary focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
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
