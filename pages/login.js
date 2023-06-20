import * as React from "react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import RegisterForm from "@/components/forms/RegisterForm";
import LoginForm from "@/components/forms/LoginForm";
import { leftFade } from "@/utils/framer/fadeEffects";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleUpdateRegisterStatus = (status) => {
    setIsRegister(status);
    setIsSubmitted(!status);
  };

  return (
    <div>
      <div className=" m-auto w-full bg-white rounded-lg shadow dark:border sm:mt-16 sm:max-w-md xl:p-0">
        <div className="p-6 space-y-4 sm:space-y-6 sm:p-8">
          <AnimatePresence mode="wait" initial={false}>
            {isRegister ? (
              <motion.div key={1} {...leftFade}>
                <RegisterForm
                  updateRegisterStatus={handleUpdateRegisterStatus}
                />
                <p className="mt-3 text-center text-sm">
                  Already have an account?
                  <a
                    className=" ml-1 font-medium text-primary cursor-pointer transition-all delay-100 hover:text-pink-400 "
                    onClick={() => {
                      setIsRegister(false);
                    }}
                  >
                    Sign in
                  </a>
                </p>
              </motion.div>
            ) : (
              <motion.div key={2} {...leftFade}>
                <LoginForm />
                {isSubmitted && (
                  <p className="mt-5 text-center font-semibold text-greenSuccess">
                    Your account has been successfully created, please log in
                  </p>
                )}
                <p className="mt-3 text-center text-sm">
                  Don't have an account?
                  <a
                    className="ml-1 font-medium text-primary cursor-pointer transition-all delay-100 hover:text-pink-400 "
                    onClick={() => {
                      setIsRegister(true);
                    }}
                  >
                    Register
                  </a>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
