import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import ReactPaginate from "react-paginate";
import axios from "axios";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { toast } from "react-toastify";
import { toasterOptions } from "@/utils/toaster/toasterOptions";
import { Spinner } from "@/components/common/Spinner";
import AppModal from "@/components/common/Modal";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { FiEdit3 } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

export default function HolidaysList({ setEditHolidays }) {
  let isTab = useMediaQuery({ query: "(max-width: 640px)" });
  const [holidaySelected, setHolidaySelected] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(isTab ? 5 : 10);
  const { data, error, isLoading, mutate } = useSWR(
    `/api/holidays?page=${currentPage}&perPage=${perPage}`,
    fetcher
  );

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

  const toggleModal = (isOpen, holiday) => {
    setModalIsOpen(isOpen);
    isOpen && setHolidaySelected(holiday);
  };

  const totalPages = Math.ceil(data.totalCount / perPage);
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
    mutate();
  };

  async function deleteholiday() {
    await axios
      .delete(`/api/holidays?deleteId=${holidaySelected.id}`)
      .then((response) => {
        toast.success("Holiday deleted successfully", {
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
    <div>
      <div className="pr-5 ">
        <div className="flex justify-between items-center mb-10">
          <h3 className="mb-0">List of holidays</h3>
          <div className="">
            <button
              className="btn-primary"
              onClick={() => {
                setEditHolidays();
              }}
            >
              New holiday
            </button>
          </div>
        </div>
        <div className="container">
          <table className="tableRecords">
            <thead>
              {isTab ? (
                <>
                  {data.holidays.map((holiday) => (
                    <tr>
                      <th>
                        <h4 className="m-0">Start</h4>
                      </th>
                      <th>
                        <h4 className="m-0 ">End</h4>
                      </th>
                      <th></th>
                    </tr>
                  ))}
                </>
              ) : (
                <tr>
                  <th>
                    <h4 className="m-0">Start</h4>
                  </th>
                  <th>
                    <h4 className="m-0">End</h4>
                  </th>
                </tr>
              )}
            </thead>
            <tbody>
              {data.holidays.map((holiday) => (
                <tr key={holiday.start}>
                  <td className="py-2 sm:py-4 ">
                    {format(new Date(holiday.start), "dd MMM yyyy HH:mm", {
                      locale: pt,
                    })}
                  </td>
                  <td className="py-2 sm:py-4">
                    {format(new Date(holiday.end), "dd MMM yyyy HH:mm", {
                      locale: pt,
                    })}
                  </td>
                  <td className="flex gap-1">
                    <button
                      onClick={() => {
                        setEditHolidays(holiday);
                      }}
                      className="text-primary"
                    >
                      <FiEdit3 size={18} />
                    </button>
                    <button
                      onClick={() => toggleModal(true, holiday)}
                      className="ml-2 text-primary"
                    >
                      <MdDeleteOutline size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <AppModal
            isOpen={modalIsOpen}
            onClose={toggleModal}
            title={`Remove the holiday ${
              holidaySelected?.start
                ? format(
                    new Date(holidaySelected?.start),
                    "dd MMM yyyy HH:mm",
                    {
                      locale: pt,
                    }
                  )
                : new Date()
            } - ${
              holidaySelected?.end
                ? format(new Date(holidaySelected?.end), "dd MMM yyyy HH:mm", {
                    locale: pt,
                  })
                : new Date()
            }?`}
            description={
              "This action is irreversible. Are you sure you want to delete?"
            }
            bt1Text={"Cancel"}
            bt2Text={"Confirm"}
            action={deleteholiday}
          />

          <ReactPaginate
            previousLabel={
              totalPages == 1 ? "" : <MdKeyboardArrowLeft size={18} />
            }
            nextLabel={
              totalPages == 1 ? "" : <MdKeyboardArrowRight size={18} />
            }
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
      </div>
    </div>
  );
}
