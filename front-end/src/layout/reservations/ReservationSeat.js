import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { listTables, updateSeat } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function ReservationSeat() {
  const history = useHistory();
  const { reservation_id } = useParams();

  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the list of tables when the component mounts
    listTables().then(setTables).catch(setError);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedTable) {
      setError("Please select a table to seat the reservation.");
      return;
    }

    // Convert the selectedTable to a JavaScript object
    const tableObj = JSON.parse(selectedTable);

    // Update the reservation's seat to the selected table
    updateSeat(tableObj.table_id, reservation_id)
      .then((response) => {
        const updatedTables = tables.map((table) => {
          return table.table_id === response.table_id ? response : table;
        });
        setTables(updatedTables);
        history.push("/dashboard");
      })
      .catch(setError);
  };

  return (
    <>
      <div className="mb-3">
        <h1>Seat The Current Reservation</h1>
      </div>

      <ErrorAlert error={error} />

      <div className="mb-3">
        <h3>Current Reservation: {reservation_id}</h3>
      </div>

      <form className="form-group" onSubmit={handleSubmit}>
        <div className="col mb-3">
          <label className="form-label" htmlFor="table_id">
            Select Table
          </label>
          <select
            className="form-control"
            name="table_id"
            id="table_id"
            onChange={(event) => setSelectedTable(event.target.value)}
            required={true}
          >
            <option value="">Table Name - Capacity</option>
            {tables.map((table) => (
              <option
                key={table.table_id}
                value={JSON.stringify(table)}
                required={true}
              >
                {table.table_name} - {table.capacity}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={() => history.goBack()}
          className="btn btn-secondary mr-2"
        >
          Cancel
        </button>
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </form>
    </>
  );
}

export default ReservationSeat;
