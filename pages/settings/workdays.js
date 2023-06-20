import Layout from "@/components/common/Layout";
import { InputDateTimePicker } from "@/components/forms/InputDateTimePicker";
import { InputStatic } from "@/components/forms/InputStatic";
import {
  price_validation,
  startDatePicker_validation,
} from "@/utils/forms/inputValidations";
import { FormProvider, useForm } from "react-hook-form";

export default function Workdays() {
  const methods = useForm();

  return (
    <Layout>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit((data) => console.log(data))}>
          <div className="max-w-md flex flex-col gap-16">
            <InputDateTimePicker
              {...startDatePicker_validation}
              defaultValue={new Date("Sun Jun 05 2023")}
              isValidationOn
              isShowTime={true}
              maxDate={""}
              minDate={new Date()}
            />
            <InputStatic
              {...price_validation}
              defaultvalue={1}
              isValidationOn
            />
          </div>
          <button type="submit" className="btn-primary mt-5">
            Submit
          </button>
        </form>
      </FormProvider>
    </Layout>
  );
}
