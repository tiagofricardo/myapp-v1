import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

export default function SubMenu({ data }) {
  const router = useRouter();
  const subMenuName = data.name.replace(/\s/g, "").toLowerCase();
  const subMenuOnRouter = router.pathname.includes(subMenuName);
  const [subMenuOpen, setSubMenuOpen] = useState(subMenuOnRouter);

  return (
    <>
      <li
        onClick={() => setSubMenuOpen(!subMenuOpen)}
        className={subMenuOnRouter ? `navActiveLink` : `navInactiveLink`}
      >
        <data.icon size={20} />
        <p className="flex-1 ">{data.name}</p>
        <IoIosArrowDown
          className={`${subMenuOpen && "rotate-180"} duration-200`}
        />
      </li>
      <motion.ul
        animate={subMenuOpen ? { height: "fit-content" } : { height: 0 }}
        className="flex flex-col pl-11 text-sm font-normal overflow-hidden h-0"
      >
        {data.menus.map((menu) => (
          <li key={menu}>
            <Link
              href={`/${subMenuName}/${menu.replace(/\s/g, "").toLowerCase()}`}
              className={
                router.pathname.includes(menu.replace(/\s/g, "").toLowerCase())
                  ? `navActiveLink`
                  : `navInactiveLink`
              }
            >
              {menu}
            </Link>
          </li>
        ))}
      </motion.ul>
    </>
  );
}
