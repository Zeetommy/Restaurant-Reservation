import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { deleteTableReservation, listTables } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function TableDetail({ table }) {
  const [currentTable, setCurrentTable] = useState(table);
  const history = useHistory();
  const [error, setError] = useState(null);

  async function clearAndLoadTables() {
    const abortController = new AbortController();
    try {
      const response = await deleteTableReservation(
        currentTable.table_id,
        abortController.signal
      );
      const tableToSet = response.find(
        (table) => table.table_id === currentTable.table_id
      );
      setCurrentTable({ ...tableToSet });
      listTables();
      return tableToSet;
    } catch (error) {
      setError(error);
    }
  }

  async function handleFinishClick(event) {
    event.preventDefault();
    setError(null);

    const confirmation = window.confirm(
      "Is this table ready to seat new guests? This cannot be undone."
    );

    if (confirmation) {
      try {
        await clearAndLoadTables();
        history.push("/tables");
      } catch (error) {
        setError(error.message || "An error occurred.");
      }
    }
  }

  return (
    <>
      <ErrorAlert error={error} />
      <tr>
        <th scope="row"> {currentTable.table_id} </th>
        <td> {currentTable.table_name} </td>
        <td> {currentTable.capacity} </td>
        <td> {currentTable.reservation_id} </td>
        <td data-table-id-status={`${table.table_id}`}>
          {" "}
          {currentTable.table_status}{" "}
        </td>
        <td>
          {currentTable.reservation_id ? (
            <button
              className="btn btn-danger"
              onClick={handleFinishClick}
              data-table-id-finish={`${table.table_id}`}
            >
              Finish
            </button>
          ) : null}
        </td>
      </tr>
    </>
  );
}

export default TableDetail;