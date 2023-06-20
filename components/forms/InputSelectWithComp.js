import { findInputError } from "@/utils/forms/findInputError";
import { isFormInvalid } from "@/utils/forms/isFormInvalid";
import { Controller, useFormContext } from "react-hook-form";
import InputError from "./InputError";
import { AnimatePresence } from "framer-motion";
import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

const InputSelectWithComp = ({
  name,
  label,
  id,
  defaultvalue,
  validation,
  isValidationOn,
  isLabelVisible,
  options,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const inputErrors = findInputError(errors, name);
  const isInvalid = isFormInvalid(inputErrors);

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  const findOptionByValue = (value) => {
    return options.find((option) => option.value === value);
  };

  return (
    <div className="relative h-15 ">
      <Controller
        id={id}
        name={name}
        control={control}
        rules={isValidationOn ? validation : undefined}
        defaultValue={findOptionByValue(defaultvalue)}
        render={({ field: { onChange, value } }) => (
          <Listbox
            value={value}
            onChange={(value) => onChange(value)}
            by={"id"}
            defaultValue={findOptionByValue(defaultvalue)}
          >
            {({ open }) => (
              <>
                <div className="relative h-15">
                  <Listbox.Button
                    className={`${
                      open
                        ? "border-2 border-primary border-t-transparent outline-0"
                        : ""
                    } "peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 text-sm outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 disabled:border-0 disabled:bg-blue-gray-50 "`}
                  >
                    <span className="flex items-center">
                      {value?.component}
                      <span className="ml-3 block truncate">
                        {isLabelVisible && value?.label}
                      </span>
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>

                  <Listbox.Label
                    className={`${
                      open
                        ? "text-[11px] leading-tight text-primary before:border-t-2 before:border-l-2 before:border-primary after:border-t-2 after:border-r-2 after:border-primary after:border-transparent"
                        : ""
                    }before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent  peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500`}
                  >
                    {label}
                  </Listbox.Label>

                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm scrollbar-thin scrollbar-track-white scrollbar-thumb-ultralight">
                      {options.map((option) => (
                        <Listbox.Option
                          key={option.id}
                          className={({ active }) =>
                            classNames(
                              active
                                ? " bg-ultralight text-grayText"
                                : "text-gray-900",
                              "relative cursor-default select-none py-2 pl-3 pr-9"
                            )
                          }
                          value={option}
                        >
                          {({ selected, active }) => (
                            <>
                              <div className="flex items-center">
                                {option.component}
                                <span
                                  className={classNames(
                                    selected ? "font-semibold" : "font-normal",
                                    "ml-3 block truncate"
                                  )}
                                >
                                  {isLabelVisible && option.label}
                                </span>
                              </div>

                              {selected ? (
                                <span
                                  className={classNames(
                                    active ? "text-white" : "text-indigo-600",
                                    "absolute inset-y-0 right-0 flex items-center pr-4"
                                  )}
                                >
                                  <CheckIcon
                                    className="h-5 w-5 text-secondary"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </>
            )}
          </Listbox>
        )}
      />
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

export default InputSelectWithComp;
