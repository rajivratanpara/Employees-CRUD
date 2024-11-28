import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


interface Employee {
  id: number;
  name: string;
  position: string;
}

interface EmployeesState {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  selectedEmployee: Employee | null;
}

const initialState: EmployeesState = {
  employees: [],
  loading: false,
  error: null,
  selectedEmployee: null,
};

// Fetch mock API
export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async () => {
    debugger
    const response = await axios.get("/api/employees");
    return response.data?.employees;
  }
);

// New employee
export const addEmployee = createAsyncThunk(
  "employees/addEmployee",
  async (employee: Omit<Employee, "id">) => {
    debugger;
    const response = await axios.post("/api/employees", employee);
    return response.data?.employee;
  }
);

// Update employee
export const updateEmployee = createAsyncThunk(
  "employees/updateEmployee",
  async (employee: Employee) => {
    // Log the employee object to check if it's valid
    console.log("Updating employee:", employee);
    debugger;
    if (!employee || !employee.id) {
      throw new Error("Employee or employee.id is undefined");
    }

    const response = await axios.put(`/api/employees/${employee.id}`, employee);
    return response.data?.employee;
  }
);

// Delete employee
export const deleteEmployee = createAsyncThunk(
  "employees/deleteEmployee",
  async (id: number) => {
    await axios.delete(`/api/employees/${id}`);
    return id;
  }
);

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    setSelectedEmployee(state, action) {
      state.selectedEmployee = action.payload;
    },
    clearSelectedEmployee(state) {
      state.selectedEmployee = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch employees.";
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.employees.push(action.payload);
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.employees.findIndex(
          (emp) => emp.id === action.payload.id
        );
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.employees = state.employees.filter(
          (emp) => emp.id !== action.payload
        );
      });
  },
});

export const { setSelectedEmployee, clearSelectedEmployee } =
  employeeSlice.actions;
export default employeeSlice.reducer;
