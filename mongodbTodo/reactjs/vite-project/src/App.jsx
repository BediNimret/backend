import React, { useEffect, useActionState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [tasks, setTasks] = React.useState([]);
  const handleSubmit = (prevData, formData) => {
    const taskName = formData.get("task");
    const response = axios.post("http://localhost:8000/api/todos", {
      id: new Date().getTime(),
      name: taskName,
      completed: false,
    });
    return response?.data?.message;
  };
  const [state, formAction, isPending] = useActionState(
    handleSubmit,
    undefined,
  );
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/todos/${id}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error(err);
    }
  };
  const handleStatusChange = async (id) => {
    try {
      await axios.put(`http://localhost:8000/api/todos/${id}`);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? { ...task, completed: !task.completed } : task,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    const getList = async () => {
      const response = await axios.get("http://localhost:8000/api/todos");
      console.log(response.data);
      setTasks(response.data);
    };
    if (!isPending) {
      getList();
    }
  }, [isPending]);

  return (
    <>
      <h1 className="text-3xl text-red-300 text-center font-bold underline">
        Todo List
      </h1>
      <form
        action={formAction}
        className="flex justify-center items-center gap-2 my-4"
      >
        <input
          name="task"
          className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></input>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={isPending}
        >
          Add Task
        </button>
        <p>{state?.message}</p>
      </form>
      <div className="flex justify-center items-center flex-col gap-10">
        <div className="flex justify-center items-center flex-col">
          <h2 className="text-2xl text-yellow-500">Incomplete Tasks</h2>
          {tasks
            .filter((t) => !t.completed)
            .map((item) => (
              <div
                key={item._id}
                className="flex gap-2  justify-center items-center"
              >
                <p className="text-2xl text-blue-300">{item.name}</p>
                <button
                  onClick={() => handleStatusChange(item._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Mark as Completed
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-800 text-white px-4 py-2 rounded"
                >
                  DELETE
                </button>
              </div>
            ))}
        </div>
        <div className="flex justify-center items-center flex-col">
          <h2 className="text-2xl text-green-500">Completed Tasks</h2>
          {tasks
            .filter((t) => t.completed)
            .map((item) => (
              <div
                key={item._id}
                className="flex gap-2  justify-center items-center"
              >
                <p className="text-2xl text-blue-300">{item.name}</p>
                <button
                  onClick={() => handleStatusChange(item._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Mark as Incomplete
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-800 text-white px-4 py-2 rounded"
                >
                  DELETE
                </button>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default App;
