import { useFormContext } from "react-hook-form";
import { AnimatePresence } from "framer-motion";
import { findInputError } from "@/utils/forms/findInputError";
import { isFormInvalid } from "@/utils/forms/isFormInvalid";
import InputError from "./InputError";

export const InputStatic = ({
  name,
  label,
  type,
  id,
  defaultvalue,
  validation,
  isValidationOn,
  isTextArea,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const inputErrors = findInputError(errors, name);
  const isInvalid = isFormInvalid(inputErrors);

  function textArea() {
    return (
      <div className="relative w-full h-28">
        <textarea
          id={id}
          defaultValue={defaultvalue}
          placeholder=" "
          className="peer h-full min-h-[100px] w-full resize-none border-b border-blue-gray-200 bg-transparent pt-3 pb-1.5 text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-primary focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
          {...register(name, isValidationOn ? validation : "")}
          step={0.01}
        ></textarea>
        <label
          htmlFor={id}
          className="after:content[' ']  pointer-events-none absolute left-0 -top-3.5 flex h-full w-full select-none text-sm font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-3.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-primary after:transition-transform after:duration-300 peer-placeholder-shown:leading-tight peer-placeholder-shown:text-blue-gray-500 peer-focus:text-sm peer-focus:leading-tight peer-focus:text-primary peer-focus:after:scale-x-100 peer-focus:after:border-primary peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
        >
          {label}
        </label>
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
  }

  function normalInput() {
    return (
      <div className="relative h-11 w-full  ">
        <input
          id={id}
          type={type}
          defaultValue={defaultvalue}
          placeholder=" "
          className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5  text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-primary focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
          {...register(name, isValidationOn ? validation : "")}
          step={0.01}
        />
        <label
          htmlFor={id}
          className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 flex h-full w-full select-none text-sm font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-2.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-primary after:transition-transform after:duration-300 peer-placeholder-shown:leading-tight peer-placeholder-shown:text-blue-gray-500 peer-focus:text-sm peer-focus:leading-tight peer-focus:text-primary peer-focus:after:scale-x-100 peer-focus:after:border-primary peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
        >
          {label}
        </label>
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
  }

  return <>{isTextArea ? textArea() : normalInput()}</>;
};
