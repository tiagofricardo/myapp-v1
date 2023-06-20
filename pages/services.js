import Layout from "@/components/common/Layout";
import ServicesCoU from "@/components/services/ServicesCoU";
import ServicesList from "@/components/services/ServicesList";
import { leftFade } from "@/utils/framer/fadeEffects";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function ServicesPage({ categoriesOptions }) {
  const [isEditOn, setIsEditOn] = useState(false);
  const [editService, setEditService] = useState();

  function onEditService(serviceData) {
    setEditService(serviceData);
    setIsEditOn(true);
  }

  function onSubmitData() {
    setEditService("");
    setIsEditOn(false);
  }

  return (
    <Layout>
      <h1>Services</h1>
      <AnimatePresence mode="wait" initial={false}>
        {isEditOn ? (
          <motion.div key={1} {...leftFade}>
            <ServicesCoU
              categoriesOptions={categoriesOptions}
              servicesData={editService}
              onSubmit={onSubmitData}
            />
          </motion.div>
        ) : (
          <motion.div key={2} {...leftFade}>
            <ServicesList setEditService={onEditService} />
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const response = await axios.get("http://localhost:3000/api/categories");
    const categoriesOptions = response.data.categories.map(({ id, name }) => ({
      label: name,
      value: id,
    }));

    return {
      props: {
        categoriesOptions,
      },
    };
  } catch (err) {
    console.log(err);

    return {
      props: {
        categoriesOptions: [],
      },
    };
  }
}
