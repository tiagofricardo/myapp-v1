import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Layout from "@/components/common/Layout";
import HolidaysList from "@/components/holidays/holidaysList";
import HolidaysCoU from "@/components/holidays/holidaysCoU";
import { leftFade } from "@/utils/framer/fadeEffects";

export default function holidays() {
  const [isEditOn, setIsEditOn] = useState(false);
  const [editHolidays, setEditHolidays] = useState();

  function onEditHoliday(holidayData) {
    setEditHolidays(holidayData);
    setIsEditOn(true);
  }

  function onSubmitData() {
    setEditHolidays("");
    setIsEditOn(false);
  }
  return (
    <Layout>
      <h1>Holidays</h1>
      <AnimatePresence mode="wait" initial={false}>
        {isEditOn ? (
          <motion.div key={1} {...leftFade}>
            <HolidaysCoU
              editHolidaysData={editHolidays}
              onSubmit={onSubmitData}
            />
          </motion.div>
        ) : (
          <motion.div key={2} {...leftFade}>
            <HolidaysList setEditHolidays={onEditHoliday} />
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
