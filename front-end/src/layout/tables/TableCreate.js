import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function TableCreate() {
  const [error, setError] = useState(null);
  const history = useHistory();
  const [table, setTable] = useState({
    table_name: "",
    capacity: 0,
  });

  const handleChange = ({ target }) => {
    const { name, value } = target;

    if (name === "capacity" && isNaN(value)) {
      setError("Capacity must be a number.");
    } else {
      setTable({
        ...table,
        [name]: value,
      });
      setError(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const numericCapacity = parseFloat(table.capacity);
    if (isNaN(numericCapacity)) {
      setError("Capacity must be a number.");
      return;
    }

    const tableData = { ...table, capacity: numericCapacity };
    try {
      await createTable(tableData);
      history.push("/dashboard");
    } catch (error) {
      setError(error);
    }
  };

  return (
    <main>
      <h1>Create A Table</h1>
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit} className="form-group">
        <div className="row mb-3">
          <div className="col-4 form-group">
            <label className="form-label" htmlFor="table_name">
              Table Name
            </label>
            <input
              className="form-control"
              name="table_name"
              id="table_name"
              required={true}
              type="text"
              onChange={handleChange}
              value={table.table_name}
            />
            <small className="form-text text-muted">Enter Table Name</small>
          </div>
          <div className="col-4 form-group">
            <label className="form-label" htmlFor="capacity">
              Table Capacity
            </label>
            <input
              className="form-control"
              name="capacity"
              id="capacity"
              required={true}
              type="number"
              onChange={handleChange}
              value={table.capacity}
            />
            <small className="form-text text-muted">Enter Table Capacity</small>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-secondary mr-3"
          onClick={() => history.goBack()}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </main>
  );
}

export default TableCreate;
