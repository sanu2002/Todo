import "./App.css";
import Navbar from "./component/navbar";
import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [todos, setTodo] = useState([]);
  const [inputvalue, setInputValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [checkboxStates, setCheckboxStates] = useState([]);
  const [tasktime, setTaskTime] = useState([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    const savedCheckboxStates = JSON.parse(localStorage.getItem("checkboxStates")) || [];
    const savedTaskTime = JSON.parse(localStorage.getItem("tasktime")) || [];
    setTodo(savedTodos);
    setCheckboxStates(savedCheckboxStates);
    setTaskTime(savedTaskTime);
  }, []);

  // Function to save data to localStorage
  const savetolocalstorage = () => {
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("checkboxStates", JSON.stringify(checkboxStates));
    localStorage.setItem("tasktime", JSON.stringify(tasktime));
  };

  // Handle task submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputvalue.trim()) {
      const newTask = inputvalue;
      setTodo([...todos, newTask]);
      setCheckboxStates([...checkboxStates, false]);
      setTaskTime([...tasktime, ""]);
      setInputValue("");
      savetolocalstorage();
    }
  };

  // Handle time update
  const handleTimeChange = (index, value) => {
    const updatedTaskTime = [...tasktime];
    updatedTaskTime[index] = value;
    setTaskTime(updatedTaskTime);
  };

  // Save tasks to backend
  const handleTimeSubmit = async () => {
    const taskData = todos.map((task, index) => ({
      task,
      checked: checkboxStates[index],
      time: tasktime[index],
      id: index,
    }));

    try {
      await axios.post("http://localhost:3000/schedule", { tasks: taskData });
      alert("Tasks saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save tasks. Please try again. Backend server might be down.");
    }
    savetolocalstorage();
  };

  // Edit task data
  const editdata = (index) => {
    setIsEditing(true);
    setEditIndex(index);
    setInputValue(todos[index]);
  };

  // Save edited task
  const saveEdit = () => {
    const updatedTodos = todos.map((item, i) =>
      i === editIndex ? inputvalue : item
    );
    const updatedCheckboxStates = [...checkboxStates];
    const updatedTaskTime = [...tasktime];

    setTodo(updatedTodos);
    setCheckboxStates(updatedCheckboxStates);
    setTaskTime(updatedTaskTime);
    setIsEditing(false);
    setEditIndex(null);
    setInputValue("");
    savetolocalstorage();
  };

  // Delete task
  const deleteTask = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    const updatedCheckboxStates = checkboxStates.filter((_, i) => i !== index);
    const updatedTaskTime = tasktime.filter((_, i) => i !== index);

    setTodo(updatedTodos);
    setCheckboxStates(updatedCheckboxStates);
    setTaskTime(updatedTaskTime);

    savetolocalstorage(); // Ensure that after deletion, it's removed from localStorage
  };

  // Handle checkbox change
  const handleCheckboxChange = (index) => {
    const updatedCheckboxStates = [...checkboxStates];
    updatedCheckboxStates[index] = !updatedCheckboxStates[index];
    setCheckboxStates(updatedCheckboxStates);
    savetolocalstorage();
  };

  return (
    <>
      <Navbar />

      <form onSubmit={handleSubmit}>
        <div className="addtask flex items-center space-x-1 m-8">
          <input
            type="text"
            value={inputvalue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add a task"
            className="border border-gray-300 rounded-lg px-4 py-2 flex-grow"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </form>

      <div className="container bg-violet-100 mx-auto my-5 p-6 rounded-xl">
        <div className="m-2">
          <h1 className="text-xl font-bold">Todo: Manage your todo at one place</h1>
        </div>

        {/* Task List */}
        {todos.map((task, index) => (
          <div key={index} className="container">
            <div className="bg-white p-4 rounded-lg shadow-md mb-4">
              <div className="flex items-center justify-between space-x-2">
                <input
                  type="checkbox"
                  checked={checkboxStates[index]}
                  onChange={() => handleCheckboxChange(index)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300"
                />

                <input
                  type="datetime-local"
                  value={tasktime[index] || ""}
                  onChange={(e) => handleTimeChange(index, e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2"
                />

                <span
                  style={{
                    textDecoration: checkboxStates[index] ? "line-through" : "none",
                  }}
                  className="flex-grow"
                >
                  {task}
                </span>

                <div className="btn flex space-x-4">
                  <button
                    onClick={() => editdata(index)}
                    className="bg-gradient-to-r from-red-500 to-blue-500 text-white px-4 py-2 rounded-2xl"
                    disabled={checkboxStates[index]}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(index)}
                    className="bg-gradient-to-r from-red-500 to-blue-500 text-white px-4 py-2 rounded-2xl"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Edit Task Modal */}
        {isEditing && (
          <div className="edit-task-container bg-white p-4 rounded-lg shadow-md mb-4">
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={inputvalue}
                onChange={(e) => setInputValue(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 flex-grow"
              />
              <button
                onClick={saveEdit}
                className="bg-green-500 text-white px-4 py-2 rounded-2xl"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditIndex(null);
                  setInputValue("");
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-2xl"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="m-2">
          <button
            onClick={handleTimeSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            Save To localstorage
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
