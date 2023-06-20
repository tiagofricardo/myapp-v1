import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import { Fragment, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { InputStatic } from "../forms/InputStatic";
import { InputDateTimePicker } from "../forms/InputDateTimePicker";
import {
  email_validation,
  endDatePicker_validation,
  name_validation,
  phoneNumber_validation,
  startDatePicker_validation,
  service_validation,
} from "@/utils/forms/inputValidations";
import InputSelect from "../forms/InputSelect";
import { Spinner } from "../common/Spinner";
import { toast } from "react-toastify";
import { toasterOptions } from "@/utils/toaster/toasterOptions";
import { MdDeleteOutline } from "react-icons/md";
import eventCoU from "@/utils/eventCoU";

export default function EventModal({
  isOpen,
  onClose,
  onEventChange,
  title,
  eventDataClick,
  servicesOptions,
}) {
  const methods = useForm({ shouldUnregister: true });
  const modifiedServicesOptions = [
    { label: "Choose Service", value: 0 },
    ...servicesOptions,
  ];
  const [pageState, setPageState] = useState({
    error: "",
    processingForm: false,
  });

  async function deleteEvent(id) {
    setPageState((old) => ({ ...old, processingForm: true, error: "" }));
    await axios
      .delete(`/api/calendar/events?id=${id}`)
      .then((response) => {
        setPageState((old) => ({
          ...old,
          processingForm: false,
        }));
        toast.success("Event deleted successfully", {
          ...toasterOptions,
        });
        onEventChange();
      })
      .catch((err) => {
        setPageState((old) => ({
          ...old,
          processingForm: false,
          error: err.message,
        }));
        toast.error(pageState.error, {
          ...toasterOptions,
        });
      });
  }
  const handleEventCreate = methods.handleSubmit(
    async ({
      serviceId,
      name,
      email,
      phonenumber,
      startDatePicker,
      endDatePicker,
    }) => {
      setPageState((old) => ({ ...old, processingForm: true, error: "" }));
      const data = {
        ...{
          serviceId,
          name,
          email,
          phonenumber,
          startDatePicker,
          endDatePicker,
        },
      };
      try {
        const response = await eventCoU(eventDataClick?.id, data);
        console.log(response);
        setPageState((old) => ({ ...old, processingForm: false, error: "" }));
        toast.success("Event created successfully", {
          ...toasterOptions,
        });
        onEventChange();
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
  );
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[999]" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-60" />
          </Transition.Child>

          <div className="fixed inset-0 top-10 left-[1%] md:left-1/3">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xl  overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3">{title}</Dialog.Title>
                <p className="mb-4">{`${
                  eventDataClick?.id
                    ? "Please, change the fields to update the event"
                    : "Please, fill the fields to create a new event"
                }`}</p>
                <FormProvider {...methods}>
                  <form
                    onSubmit={(e) => e.preventDefault()}
                    noValidate
                    autoComplete="off"
                  >
                    <div className="flex flex-col gap-16 ">
                      <InputSelect
                        {...service_validation}
                        options={modifiedServicesOptions}
                        defaultvalue={eventDataClick?.extendedProps?.serviceId}
                        isValidationOn
                      />
                      <InputStatic
                        {...name_validation}
                        defaultvalue={eventDataClick?.extendedProps?.name}
                        isValidationOn
                      />
                      <InputStatic
                        {...email_validation}
                        defaultvalue={eventDataClick?.extendedProps?.email}
                        isValidationOn
                      />
                      <InputStatic
                        {...phoneNumber_validation}
                        defaultvalue={
                          eventDataClick?.extendedProps?.phonenumber
                        }
                        isValidationOn
                      />
                      <div className="flex gap-3">
                        <div className="w-full">
                          <InputDateTimePicker
                            {...startDatePicker_validation}
                            defaultValue={
                              eventDataClick?.start || eventDataClick?.date
                            }
                            isValidationOn
                            isShowTime={true}
                          />
                        </div>
                        <div className="w-full">
                          <InputDateTimePicker
                            {...endDatePicker_validation}
                            defaultValue={
                              eventDataClick?.end || eventDataClick?.date
                            }
                            isValidationOn
                            isShowTime={true}
                            isEndDate
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </FormProvider>

                <div className="mt-8 flex justify-center gap-5 ">
                  <div className=" basis-2/5">
                    <button
                      className="btn-secondary "
                      onClick={() => onClose(false)}
                      disabled={pageState.processingForm}
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="basis-2/5">
                    <button
                      className="btn-primary "
                      onClick={handleEventCreate}
                      disabled={pageState.processingForm}
                    >
                      {pageState.processingForm ? (
                        <Spinner />
                      ) : (
                        `${eventDataClick?.id ? "Update" : "Create"}`
                      )}
                    </button>
                  </div>
                  {eventDataClick?.id ? (
                    <div className="basis-1/5">
                      <button
                        className="btn-primary"
                        onClick={() => deleteEvent(eventDataClick?.id)}
                        disabled={pageState.processingForm}
                      >
                        {pageState.processingForm ? (
                          <Spinner />
                        ) : (
                          <div className=" flex gap-1">
                            <MdDeleteOutline size={15} />
                            Delete
                          </div>
                        )}
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
