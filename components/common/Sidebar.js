import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { Spinner } from "./Spinner";
import SubMenu from "./SubMenu";

/* Icons */
import { IoIosArrowBack } from "react-icons/io";
import { FaHome } from "react-icons/fa";
import { TbCategory } from "react-icons/tb";
import { VscSymbolMisc } from "react-icons/vsc";
import { CiLogout } from "react-icons/ci";
import { MdMenu, MdOutlineEditCalendar } from "react-icons/md";
import { LuCalendarHeart } from "react-icons/lu";

export default function Sidebar({ onSidebarChange }) {
  const router = useRouter();
  let isTab = useMediaQuery({ query: "(max-width: 768px)" });

  const subMenuCalendarData = [
    {
      name: "Settings",
      icon: MdOutlineEditCalendar,
      menus: ["Availability", "Holidays"],
    },
  ];

  const [isOpen, setIsOpen] = useState(isTab ? false : true);
  const changeSidebar = function (isOpen) {
    setIsOpen(isOpen);
    onSidebarChange(isOpen);
  };
  const { data, error, isLoading, mutate } = useSWR("/api/current", fetcher);

  const Sidebar_animation = isTab
    ? {
        open: {
          x: 0,
          width: "256px",
          transition: {
            damping: 40,
          },
        },
        closed: {
          x: -250,
          width: 0,
          transition: {
            damping: 40,
            delay: 0.15,
          },
        },
      }
    : {
        open: {
          width: "256px",
          transition: {
            damping: 40,
          },
        },
        closed: {
          width: "64px",
          transition: {
            damping: 40,
          },
        },
      };

  useEffect(() => {
    if (isTab) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [isTab]);

  return (
    <div>
      <div
        onClick={() => setIsOpen(false)}
        className={` ${
          isOpen ? "block" : "hidden"
        } md:hidden fixed inset-0 z-[998] bg-black/50 `}
      ></div>
      <motion.div
        variants={Sidebar_animation}
        initial={{ x: isTab ? -250 : 0 }}
        animate={isOpen ? "open" : "closed"}
        className={`flex flex-col gap-28 fixed bg-white shadow-xl z-[999] w-64 max-w-64 sm:h-full h-screen overflow-hidden
        `}
      >
        <div className="flex flex-col items-center py-6 h-20">
          <Image
            className="mt-5 rounded-full"
            src="/images/avatar_default.jpg"
            alt="avatar"
            width={80}
            height={80}
            priority
          />
          {isOpen ? (
            <>
              {isLoading ? (
                <Spinner />
              ) : (
                <>
                  <h4 className="mt-2 font-medium text-primary">
                    {data?.currentUser?.name}
                  </h4>
                  <p className="text-sm font-medium text-secondary">
                    {data?.currentUser?.email}
                  </p>
                </>
              )}
            </>
          ) : (
            ""
          )}
        </div>

        <div className="flex flex-col h-full">
          <ul className="whitespace-pre px-2.5 text-sm py-5 flex flex-col gap-1 font-medium overflow-x-hidden scrollbar-thin scrollbar-track-white scrollbar-thumb-ultralight h-4/6">
            <li>
              <Link
                href="/"
                className={
                  router.pathname == "/" ? "navActiveLink" : "navInactiveLink"
                }
              >
                <FaHome size={20} className="min-w-max" />
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/categories"
                className={
                  router.pathname == "/categories"
                    ? "navActiveLink"
                    : "navInactiveLink"
                }
              >
                <TbCategory size={20} className="min-w-max" />
                Categories
              </Link>
            </li>
            <li>
              <Link
                href="/services"
                className={
                  router.pathname == "/services"
                    ? "navActiveLink"
                    : "navInactiveLink"
                }
              >
                <VscSymbolMisc size={20} className="min-w-max" />
                Services
              </Link>
            </li>
            <li>
              <Link
                href="/calendar"
                className={
                  router.pathname == "/calendar"
                    ? "navActiveLink"
                    : "navInactiveLink"
                }
              >
                <LuCalendarHeart size={20} className="min-w-max" />
                Calendar
              </Link>
            </li>
            {(isOpen || isTab) && (
              <div>
                {subMenuCalendarData?.map((menu) => (
                  <div key={1} className="flex flex-col gap-1">
                    <SubMenu data={menu} />
                  </div>
                ))}
              </div>
            )}
            <li>
              <button onClick={() => signOut()} className="navInactiveLink">
                <CiLogout size={20} className="min-w-max" />
                Logout
              </button>
            </li>
          </ul>
        </div>

        <motion.div
          animate={
            isOpen
              ? {
                  x: 0,
                  y: 0,
                  rotate: 0,
                }
              : {
                  x: -10,
                  y: -200,
                  rotate: 180,
                }
          }
          transition={{
            duration: 0.1,
          }}
          onClick={() => changeSidebar(!isOpen)}
          className="absolute w-fit h-fit z-50 right-2 bottom-5 cursor-pointer md:block hidden"
        >
          <IoIosArrowBack size={25} />
        </motion.div>
      </motion.div>
      <div>
        <MdMenu
          className="absolute m-5 cursor-pointer md:hidden"
          size={25}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
    </div>
  );
}
