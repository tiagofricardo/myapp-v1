import { findInputError } from "@/utils/forms/findInputError";
import { isFormInvalid } from "@/utils/forms/isFormInvalid";
import React from "react";
import { useFormContext } from "react-hook-form";
import InputError from "./InputError";
import { AnimatePresence } from "framer-motion";

export const InputSwitch = ({
  name,
  id,
  defaultvalue,
  validation,
  isValidationOn,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const inputErrors = findInputError(errors, name);
  const isInvalid = isFormInvalid(inputErrors);

  return (
    <div className="relative h-15">
      <div className="relative inline-block h-4 w-8 cursor-pointer rounded-full">
        <input
          id={id}
          defaultChecked={defaultvalue}
          type="checkbox"
          {...register(name, isValidationOn ? validation : "")}
          className="peer absolute h-4 w-8 cursor-pointer appearance-none rounded-full bg-gray-100 transition-colors duration-300 checked:bg-primary peer-checked:border-primary peer-checked:before:bg-primary"
        />
        <label
          htmlFor={id}
          className="before:content[''] absolute top-2/4 -left-1 h-5 w-5 -translate-y-2/4 cursor-pointer rounded-full border border-blue-gray-100 bg-white shadow-md transition-all duration-300 before:absolute before:top-2/4 before:left-2/4 before:block before:h-10 before:w-10 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity hover:before:opacity-10 peer-checked:translate-x-full peer-checked:border-primary peer-checked:before:bg-primary"
        >
          <div className="top-2/4 left-2/4 inline-block -translate-x-2/4 -translate-y-2/4 rounded-full p-5"></div>
        </label>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {isInvalid && (
          <InputError
            message={inputErrors.error.message}
            key={inputErrors.error.message}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
