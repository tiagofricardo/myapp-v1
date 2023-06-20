import { Input } from "./Input";
import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import {
  fullName_validation,
  email_validation,
  password_validation,
} from "@/utils/forms/inputValidations";
import { Alert } from "@mui/material";
import { Spinner } from "../common/Spinner";

export default function RegisterForm({ updateRegisterStatus }) {
  const methods = useForm();
  const [pageState, setPageState] = useState({
    error: "",
    processing: false,
  });

  const handleCreateUSer = methods.handleSubmit(
    async ({ name, email, password }) => {
      setPageState((old) => ({
        ...old,
        processing: true,

        error: "",
      }));

      await axios
        .post("/api/register", {
          name,
          email,
          password,
        })
        .then((response) => {
          setPageState((old) => ({
            ...old,
            processing: false,

            error: "",
          }));

          updateRegisterStatus(false);
        })
        .catch((error) => {
          setPageState((old) => ({
            ...old,
            processing: false,

            error: error?.response?.data,
          }));
        });
      methods.reset();
    }
  );

  return (
    <>
      <h1 className="tracking-tight">Register your account</h1>
      {pageState.error !== "" && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {pageState.error}
        </Alert>
      )}
      <FormProvider {...methods}>
        <form
          onSubmit={(e) => e.preventDefault()}
          noValidate
          autoComplete="off"
          className="container"
        >
          <div className="flex flex-col gap-12 ">
            <Input {...name_validation} isValidationOn />
            <Input {...email_validation} isValidationOn />
            <Input {...password_validation} isValidationOn />
          </div>
          <div className="mt-5">
            <button onClick={handleCreateUSer} className="btn-primary mt-9 ">
              {pageState.processing ? <Spinner /> : "Register"}
            </button>
          </div>
        </form>
      </FormProvider>
    </>
  );
}
