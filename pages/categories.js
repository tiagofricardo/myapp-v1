import Layout from "@/components/common/Layout";
import CategoryCoU from "@/components/categories/CategoryCoU";
import CategoriesList from "@/components/categories/CategoriesList";
import { useState } from "react";
import { leftFade } from "@/utils/framer/fadeEffects";
import { AnimatePresence, motion } from "framer-motion";

export default function Categories() {
  const [isEditOn, setIsEditOn] = useState(false);
  const [editCategories, setEditedCategories] = useState();

  function onEditCategory(categoryDetails) {
    setEditedCategories(categoryDetails);
    setIsEditOn(true);
  }
  function onSubmitData() {
    setEditedCategories("");
    setIsEditOn(false);
  }

  return (
    <Layout>
      <h1>Categories</h1>
      <AnimatePresence mode="wait" initial={false}>
        {isEditOn ? (
          <motion.div key={1} {...leftFade}>
            <CategoryCoU
              categoryData={editCategories}
              onSubmit={onSubmitData}
            />
          </motion.div>
        ) : (
          <motion.div key={2} {...leftFade}>
            <CategoriesList editCategory={onEditCategory} />
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
