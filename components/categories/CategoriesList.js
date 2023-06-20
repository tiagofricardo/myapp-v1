import axios from "axios";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import { toasterOptions } from "@/utils/toaster/toasterOptions";
import Image from "next/image";
import { Spinner } from "@/components/common/Spinner";
import AppModal from "@/components/common/Modal";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

export default function CategoriesList({ editCategory }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [categorySelected, setCategorySelected] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;
  const { data, error, isLoading, mutate } = useSWR(
    `/api/categories?page=${currentPage}&perPage=${perPage}`,
    fetcher
  );
  let isLarge = useMediaQuery({ query: "(max-width: 1024px)" });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-full ">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <p className="flex justify-center items-center h-screen w-full text-redError font-semibold">
        Erro ao carregar os dados
      </p>
    );
  }

  const totalPages = Math.ceil(data.totalCount / perPage);
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
    mutate();
  };
  const toggleModal = (isOpen, category) => {
    setModalIsOpen(isOpen);
    isOpen && setCategorySelected(category);
  };

  async function deleteCategory(ev) {
    const id = categorySelected.id;
    await axios
      .delete(`/api/categories?deleteId=${id}`, {
        id,
      })
      .then(() => {
        setModalIsOpen(false);
        toast.success("Record deleted successfully", {
          ...toasterOptions,
        });
        deleteImage(categorySelected.image);
        mutate();
      })
      .catch((err) => {
        toast.error(err.response?.data, {
          ...toasterOptions,
        });
      });
  }

  async function deleteImage(imageUrl) {
    await axios
      .delete(`/api/supabaseImagesDelete?imagePath=${imageUrl}`)
      .then((response) => {
        return;
      })
      .catch((err) => {
        toast.error(err.response?.data, {
          ...toasterOptions,
        });
      });
  }

  return (
    <>
      <div className="pr-5 ">
        <div className="flex justify-between items-center mb-10">
          <h3 className="mb-0">List of existing categories</h3>
          <div className="">
            <button
              className="btn-primary"
              onClick={() => {
                editCategory();
              }}
            >
              New Category
            </button>
          </div>
        </div>

        <div className="md:block hidden">
          <table className="tableRecords">
            <thead>
              <tr>
                {!isLarge ? <th></th> : ""}
                <th>
                  <h4 className="m-0">Name</h4>
                </th>
                <th>
                  <h4 className="m-0">Description</h4>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.categories.map((data) => (
                <tr key={data.id}>
                  {!isLarge ? (
                    <td>
                      {data.image ? (
                        <Image
                          alt={data.image}
                          src={data.image}
                          height={100}
                          width={100}
                          style={{
                            maxWidth: "80px",
                            maxHeight: "80px",
                          }}
                          className="rounded-sm"
                        ></Image>
                      ) : (
                        ""
                      )}
                    </td>
                  ) : (
                    ""
                  )}

                  <td className="py-4 text-sm text-primary whitespace-nowrap ">
                    {data.name}
                  </td>

                  <td className="py-4 text-sm text-justify">
                    {data.description}
                  </td>
                  <td className="">
                    <div className="">
                      <button
                        onClick={() => editCategory(data)}
                        className="btn-secondary p-0"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleModal(true, data)}
                        className="btn-secondary"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
          {data.categories.map((data) => (
            <div key={data.id} className="w-full">
              <div className="cardRecord">
                <Image
                  alt={data.image}
                  src={data.image}
                  width={100}
                  height={100}
                />
                <div className="cardRecord-text ">
                  <h5 className="text-center">{data.name}</h5>
                  <div className="flex flex-row">
                    <button
                      onClick={() => editCategory(data)}
                      className="btn-secondary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggleModal(true, data)}
                      className="btn-secondary"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <AppModal
          isOpen={modalIsOpen}
          onClose={toggleModal}
          title={`Remove the category ${categorySelected.name}?`}
          description={
            "This action is irreversible. Are you sure you want to delete?"
          }
          bt1Text={"Cancel"}
          bt2Text={"Confirm"}
          action={deleteCategory}
        />
        <ReactPaginate
          previousLabel={
            totalPages == 1 ? "" : <MdKeyboardArrowLeft size={18} />
          }
          nextLabel={totalPages == 1 ? "" : <MdKeyboardArrowRight size={18} />}
          breakLabel={"..."}
          pageCount={totalPages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageChange}
          containerClassName={"paginationContent"}
          subContainerClassName={""}
          pageLinkClassName={"paginationLink"}
          activeClassName={"paginationActive"}
          previousClassName={"paginationNav"}
          nextClassName={"paginationNav"}
          disabledClassName={"paginationDisabled"}
          forcePage={currentPage - 1}
        />
      </div>
    </>
  );
}
