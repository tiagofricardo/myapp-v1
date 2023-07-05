import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import { FiEdit3 } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import AppModal from "@/components/common/Modal";
import { Spinner } from "../common/Spinner";
import axios from "axios";
import { toast } from "react-toastify";
import { toasterOptions } from "@/utils/toaster/toasterOptions";
import { useMediaQuery } from "react-responsive";

export default function ServicesList({ setEditService }) {
  let isTab = useMediaQuery({ query: "(max-width: 640px)" });
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(isTab ? 5 : 10);
  const { data, error, isLoading, mutate } = useSWR(
    `/api/services?page=${currentPage}&perPage=${perPage}`,
    fetcher
  );
  const [serviceSelected, setServiceSelected] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    isTab ? setPerPage(5) : setPerPage(10);
  }, [isTab]);

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

  const toggleModal = (isOpen, service) => {
    setModalIsOpen(isOpen);
    isOpen && setServiceSelected(service);
  };

  const totalPages = Math.ceil(data.totalCount / perPage);
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
    mutate();
  };

  async function deleteService() {
    await axios
      .delete(`/api/services?deleteId=${serviceSelected.id}`)
      .then((response) => {
        toast.success("Service deleted successfully", {
          ...toasterOptions,
        });
      })
      .catch((err) => {
        toast.error(err.response.data, {
          ...toasterOptions,
        });
      });
    setModalIsOpen(false);
    mutate();
  }
  return (
    <>
      <div className="pr-5 ">
        <div className="flex justify-between items-center mb-10">
          <h3 className="mb-0">List of services</h3>
          <div className="">
            <button
              className="btn-primary"
              onClick={() => {
                setEditService();
              }}
            >
              New Service
            </button>
          </div>
        </div>

        <div class="container">
          <table class="tableRecords">
            <thead>
              {isTab ? (
                <>
                  {data.services.map((service) => (
                    <tr>
                      <th>
                        <h4 className="m-0">Name</h4>
                      </th>
                      <th className=" hidden lg:block">
                        <h4 className="m-0">Description</h4>
                      </th>
                      <th>
                        <h4 className="m-0">Price</h4>
                      </th>
                      <th>
                        <h4 className="m-0">Time</h4>
                      </th>
                      <th>
                        <h4 className="m-0">Category</h4>
                      </th>
                      <th></th>
                    </tr>
                  ))}
                </>
              ) : (
                <tr>
                  <th>
                    <h4 className="m-0">Name</h4>
                  </th>
                  <th className=" hidden lg:block">
                    <h4 className="m-0">Description</h4>
                  </th>
                  <th>
                    <h4 className="m-0">Price</h4>
                  </th>
                  <th>
                    <h4 className="m-0">Time</h4>
                  </th>
                  <th>
                    <h4 className="m-0">Category</h4>
                  </th>
                  <th></th>
                </tr>
              )}
            </thead>
            <tbody>
              {data.services.map((service) => (
                <tr key={service.name}>
                  <td className="py-2 sm:py-4 text-primary whitespace-nowrap">
                    {service.name}
                  </td>
                  <td className="py-2 sm:py-4 max-w-[100px] hidden lg:block">
                    <p className="truncate">{service.description}</p>
                  </td>
                  <td className="py-2 sm:py-4">{service.price} €</td>
                  <td className="py-2 sm:py-4">{service.time} min </td>
                  <td className="py-2 sm:py-4">{service.category.name}</td>
                  <td className="flex gap-1">
                    <button
                      onClick={() => {
                        setEditService(service);
                      }}
                      className="text-primary"
                    >
                      <FiEdit3 size={18} />
                    </button>
                    <button
                      onClick={() => toggleModal(true, service)}
                      className="ml-2 text-primary"
                    >
                      <MdDeleteOutline size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AppModal
          isOpen={modalIsOpen}
          onClose={toggleModal}
          title={`Remove the service ${serviceSelected?.name}?`}
          description={
            "This action is irreversible. Are you sure you want to delete?"
          }
          bt1Text={"Cancel"}
          bt2Text={"Confirm"}
          action={deleteService}
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
