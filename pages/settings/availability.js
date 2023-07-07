import { useEffect, useState } from "react";
import axios from "axios";
import { FormProvider, useForm } from "react-hook-form";
import Layout from "@/components/common/Layout";
import { toast } from "react-toastify";
import { toasterOptions } from "@/utils/toaster/toasterOptions";
import { AnimatePresence, motion } from "framer-motion";
import { upperFade } from "@/utils/framer/fadeEffects";
import {
  endTimePicker_validation,
  startTimePicker_validation,
  switch_validation,
} from "@/utils/forms/inputValidations";
import { InputSwitch } from "@/components/forms/InputSwitch";
import { InputTimePicker } from "@/components/forms/InputTimePicker";
import { Spinner } from "@/components/common/Spinner";
import { MdDeleteOutline } from "react-icons/md";

export default function Availability({ availabilityData }) {
  const [pageState, setPageState] = useState({
    error: "",
    processingForm: false,
  });
  const methods = useForm({ shouldUnregister: true });
  const days = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];
  const [workTimes, setWorkTimes] = useState(availabilityData);

  function onAddTimeFields(event, day) {
    event.preventDefault();
    if (!workTimes[day]) {
      setWorkTimes((prevState) => {
        return {
          ...prevState,
          [day]: [
            {
              id: 1,
              isActive: true,
              startTime: new Date("04-08-1993 10:00"),
              endTime: new Date("04-08-1993 12:00"),
            },
          ],
        };
      });
    } else {
      setWorkTimes((prevState) => {
        return {
          ...prevState,
          [day]: [
            ...prevState[day],
            {
              id: prevState[day].length + 1,
              startTime: new Date("04-08-1993 10:00"),
              endTime: new Date("04-08-1993 12:00"),
            },
          ],
        };
      });
    }
  }

  function onDeleteTimeField(event, day, id) {
    event.preventDefault();
    setWorkTimes((prevState) => {
      const updatedTimes = prevState[day].filter((time) => time.id !== id);
      return {
        ...prevState,
        [day]: updatedTimes,
      };
    });
    const updatedFields = Object.keys(methods.getValues()).filter(
      (fieldName) =>
        fieldName.startsWith(`${day.toLowerCase()}start-${id}`) ||
        fieldName.startsWith(`${day.toLowerCase()}end-${id}`)
    );
    updatedFields.forEach((fieldName) => {
      methods.unregister(fieldName);
    });
  }

  useEffect(() => {
    days.map((day) => {
      methods.setValue(
        `switch-${day.toLowerCase()}`,
        workTimes?.activeDays.includes(day)
      );
    });
  }, []);

  async function handleAvailabilityChange(formData) {
    setPageState((old) => ({ ...old, processingForm: true, error: "" }));

    let data = [];
    let activeDays = [];
    let inactiveDays = [];

    for (let i = 0; i < days.length; i++) {
      const day = days[i];
      if (!activeDays[day] && formData[`switch-${day.toLowerCase()}`]) {
        activeDays.push(day);

        for (let i = 0; i < workTimes[day]?.length; i++) {
          const dayTime = workTimes[day][i];
          const formStartTime = new Date(
            formData[`${day.toLowerCase()}start-${dayTime.id}`]
          );
          const formEndTime = new Date(
            formData[`${day.toLowerCase()}end-${dayTime.id}`]
          );
          const dayTimeData = {
            id: dayTime.id.length > 15 ? dayTime.id : null,
            day: `${day.toUpperCase()}`,
            isActive: true,
            startTime: formStartTime,
            endTime: formEndTime,
          };

          data.push(dayTimeData);
        }
      } else {
        inactiveDays.push(day);
      }
    }

    const dataTimes = {
      data,
      activeDays,
      inactiveDays,
    };
    try {
      await createAvailability(dataTimes);
      setPageState((old) => ({ ...old, processingForm: false, error: "" }));
      toast.success("Availability updated successfully", {
        ...toasterOptions,
      });
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

  async function createAvailability(data) {
    await axios.post("/api/availability", data).catch((err) => {
      throw new Error(err.response.data);
    });
  }

  return (
    <Layout>
      <h1>Availability</h1>
      <div className="pr-5 ">
        <h3>
          Choose the available workdays, which are possible to schedule jobs
        </h3>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit((formData) => {
              handleAvailabilityChange(formData);
            })}
          >
            {days.map((day) => (
              <div
                key={day}
                className=" py-5 border-t border-slate-200 max-w-lg flex flex-col justify-between items-center sm:flex-row"
              >
                <div className="ml-1 flex gap-3">
                  <InputSwitch
                    {...switch_validation}
                    defaultvalue={workTimes?.activeDays.includes(day)}
                    name={`switch-${day.toLowerCase()}`}
                    id={`switch-${day.toLowerCase()}`}
                  />
                  <p className="w-15 text-sm">
                    {day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()}
                  </p>
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  {methods.watch(`switch-${day.toLowerCase()}`) ? (
                    <motion.div key={1} {...upperFade}>
                      <div className="flex flex-col">
                        <AnimatePresence initial={false}>
                          {workTimes[day]?.map((data) => (
                            <motion.div
                              key={data.id}
                              {...upperFade}
                              className="flex h-20 items-start gap-2 mx-2 sm:mx-10"
                            >
                              <div>
                                <InputTimePicker
                                  {...startTimePicker_validation}
                                  name={`${day.toLowerCase()}start-${data.id}`}
                                  id={`${day.toLowerCase()}start-${data.id}`}
                                  defaultValue={new Date(data.startTime)}
                                  isValidationOn
                                  isShowTime
                                />
                              </div>
                              <p className="mt-5">-</p>
                              <div>
                                <InputTimePicker
                                  {...endTimePicker_validation}
                                  name={`${day.toLowerCase()}end-${data.id}`}
                                  id={`${day.toLowerCase()}end-${data.id}`}
                                  defaultValue={new Date(data.endTime)}
                                  isValidationOn
                                  isShowTime
                                  isEndDate
                                />
                              </div>
                              <button
                                onClick={(event) =>
                                  onDeleteTimeField(event, day, data.id)
                                }
                                className="mt-5 text-primary"
                              >
                                <MdDeleteOutline />
                              </button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                      <div className="w-full flex items-center justify-end">
                        <button
                          onClick={(event) => onAddTimeFields(event, day)}
                          className=" btn-secondary text-primary items-center"
                        >
                          Add time
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key={2} {...upperFade}>
                      <p className="text-sm font-semibold text-primary mt-4 sm:mr-10 sm:mt-0">
                        Unavailable
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            <div className=" w-44 mb-10">
              <button
                type="submit"
                disabled={pageState.processingForm}
                className="btn-primary mt-5"
              >
                {pageState.processingForm ? <Spinner /> : "Apply changes"}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const response = await axios.get(`${process.env.APP_URL}/api/availability`);
    const availabilityData = response.data;

    return {
      props: {
        availabilityData,
      },
    };
  } catch (err) {
    console.log(err);

    return {
      props: {
        availabilityData: [],
      },
    };
  }
}
