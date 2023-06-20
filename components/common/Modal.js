import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
export default function AppModal({
  isOpen,
  onClose,
  title,
  description,
  bt1Text,
  bt2Text,
  action,
}) {
  console.log();
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

          <div className="fixed inset-0 flex items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3">{title}</Dialog.Title>
                {description}

                <div className="mt-8 flex justify-center gap-5 ">
                  <div className="basis-1/5">
                    <button
                      className="btn-secondary "
                      onClick={() => onClose(false)}
                    >
                      {bt1Text}
                    </button>
                  </div>
                  <div className="basis-2/5">
                    <button className="btn-primary " onClick={action}>
                      {bt2Text}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
