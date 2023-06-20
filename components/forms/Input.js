import { useFormContext } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { MdError } from "react-icons/md";
import { findInputError } from "@/utils/forms/findInputError";
import { isFormInvalid } from "@/utils/forms/isFormInvalid";
import { upperFade } from "@/utils/framer/fadeEffects";

export const Input = ({
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

  return (
    <div className="relative h-11 w-full ">
      {isTextArea ? (
        <></>
      ) : (
        <>
          <input
            id={id}
            type={type}
            defaultValue={defaultvalue}
            placeholder=" "
            className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.2 text-base text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-primary focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
            {...register(name, isValidationOn ? validation : "")}
          />
          <label
            htmlFor={id}
            className="after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-sm leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-primary after:transition-transform after:duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:leading-[3.5] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-sm peer-focus:leading-tight peer-focus:text-primary peer-focus:after:scale-x-100 peer-focus:after:border-primary peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
          >
            {label}
          </label>
        </>
      )}

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

const InputError = ({ message }) => {
  return (
    <motion.p
      className="flex items-center gap-1 mt-0.5 font-semibold text-red-500 rounded-sm text-sm max-w-fit"
      {...upperFade}
    >
      <MdError />
      {message}
    </motion.p>
  );
};
