import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import {
  fetchEmployees,
  deleteEmployee,
  setSelectedEmployee,
  addEmployee,
  updateEmployee,
} from "../features/employees/employeeSlice";
import { Modal, Box, TextField, Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/EmployeeList.css";

const EmployeeList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { employees, loading, error } = useSelector((state: RootState) => state.employees);

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({ id: 0, name: "", position: "" });

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    dispatch(deleteEmployee(id));
    toast.success("Employee deleted successfully!");
  };

  const handleEdit = (id: number) => {
    const employee = employees.find((emp) => emp.id === id);
    if (employee) {
      setFormData({ id: employee.id, name: employee.name, position: employee.position });
      dispatch(setSelectedEmployee(employee));
      setOpenModal(true);
    }
  };

  const handleAdd = () => {
    setFormData({ id: 0, name: "", position: "" });
    setOpenModal(true);
  };

  const handleSave = () => {
    debugger
    if (formData.id) {
      // Update existing employee
      dispatch(updateEmployee(formData));
      toast.success("Employee updated successfully!");
    } else {
      // Add a new employee with a dynamic ID
      const maxId = employees.length > 0 ? Math.max(...employees.map((emp) => emp.id)) : 0;
      const newEmployee = { ...formData, id: maxId + 1 };
      dispatch(addEmployee(newEmployee));
      toast.success("Employee added successfully!");
    }
    setOpenModal(false);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "position", headerName: "Position", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <div>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleEdit(params.row.id)}
            style={{ marginRight: "10px" }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="employee-list" style={{ height: 500, width: "100%" }}>
      <ToastContainer />
      <h2>Employee List</h2>
      {loading && <p>Loading employees...</p>}
      {error && <p>Error: {error}</p>}
      <Button variant="contained" color="primary" onClick={handleAdd} style={{ marginBottom: 20 }}>
        Add Employee
      </Button>
      <DataGrid rows={employees} columns={columns} />

      <Modal open={openModal} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            width: "300px",
            borderRadius: "8px",
            boxShadow: 24,
          }}
        >
          <h2>{formData.id ? "Edit Employee" : "Add Employee"}</h2>
          <form>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
              <Button variant="contained" color="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" onClick={handleSave}>
                {formData.id ? "Update" : "Add"}
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default EmployeeList;
