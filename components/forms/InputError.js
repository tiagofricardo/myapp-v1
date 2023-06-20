import { upperFade } from "@/utils/framer/fadeEffects";
import { MdError } from "react-icons/md";
import { motion } from "framer-motion";

export default function InputError({ message }) {
  return (
    <motion.p
      className="flex items-center gap-2 mt-1 font-semibold text-red-500 rounded-sm text-sm max-w-fit"
      {...upperFade}
    >
      <MdError />
      {message}
    </motion.p>
  );
}
