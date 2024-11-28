import React from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import EmployeeList from "./components/EmployeeList";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <h1>Employee Management</h1>
        <EmployeeList />
      </div>
    </Provider>
  );
}

export default App;
