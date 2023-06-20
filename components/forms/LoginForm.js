import { Input } from "./Input";
import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import {
  email_validation,
  password_validation,
} from "@/utils/forms/inputValidations";

import { Alert } from "@mui/material";
import { Spinner } from "../common/Spinner";

export default function LoginForm() {
  const methods = useForm();
  const [pageState, setPageState] = useState({
    error: "",
    processing: false,
  });
  const router = useRouter();
  const handleAuth = methods.handleSubmit(async ({ email, password }) => {
    setPageState((old) => ({ ...old, processing: true, error: "" }));
    signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    })
      .then((response) => {
        console.log(response);
        if (response.ok) {
          router.push("/");
        } else {
          setPageState((old) => ({
            ...old,
            processing: false,
            error: response.error,
          }));
        }
      })
      .catch((error) => {
        console.log(error);
        setPageState((old) => ({
          ...old,
          processing: false,
          error: error.message ?? "Something went wrong",
        }));
      });
    methods.reset();
  });

  return (
    <>
      <h1 className="tracking-tight">Sign in to your account</h1>
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
            <Input {...email_validation} />
            <Input {...password_validation} />
          </div>
          <div className="m-auto">
            <button
              onClick={handleAuth}
              className="btn-primary mt-9"
              disabled={pageState.processing}
            >
              {pageState.processing ? <Spinner /> : "Log in"}
            </button>
          </div>
        </form>
      </FormProvider>
    </>
  );
}
