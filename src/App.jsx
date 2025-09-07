import { useEffect, useState } from "react";
import axios from "axios";


function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [editing, setEditing] = useState(null); // { id, task }
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL ;

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => setTodos(res.data.data))
      .catch(() => setError("Failed to fetch todos"));
  }, []);

  // Add todo
  const addTodo = async () => {
    if (!task.trim()) return;
    try {
      const { data } = await axios.post(API_URL, { task });
      setTodos([...todos, data.data]);
      setTask("");
    } catch {
      setError("Failed to add todo");
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter((t) => t._id !== id));
    } catch {
      setError("Failed to delete todo");
    }
  };

  // Edit todo
  const saveEdit = async () => {
    if (!editing?.task.trim()) return;
    try {
      await axios.put(`${API_URL}/${editing.id}`, { task: editing.task });
      setTodos(
        todos.map((t) =>
          t._id === editing.id ? { ...t, task: editing.task } : t
        )
      );
      setEditing(null);
    } catch {
      setError("Failed to edit todo");
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-8 shadow-xl rounded-2xl bg-gradient-to-br from-blue-50 to-purple-100">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-purple-700">
        {" "}
        Todo List
      </h1>
      {error && <div className="mb-4 text-red-600 font-medium">{error}</div>}

      {/* Input */}
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Enter task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="border rounded-lg px-3 py-2 flex-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button
          onClick={addTodo}
          className="bg-purple-500 ml-2 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
        >
          ➕ Add
        </button>
      </div>

      {/* Todo List */}
      <ul className="space-y-2">
        {todos.map((todo) =>
          editing?.id === todo._id ? (
            <li key={todo._id} className="flex items-center space-x-2">
              <input
                type="text"
                value={editing.task}
                onChange={(e) =>
                  setEditing({ ...editing, task: e.target.value })
                }
                className="border px-2 py-1 rounded flex-1 shadow-sm focus:ring-2 focus:ring-green-400"
              />
              <button
                onClick={saveEdit}
                className="bg-green-500 text-white px-2 py-1 rounded-lg hover:bg-green-600"
              >
                💾 Save
              </button>
              <button
                onClick={() => setEditing(null)}
                className="bg-gray-400 text-white px-2 py-1 rounded-lg hover:bg-gray-500"
              >
                ❌ Cancel
              </button>
            </li>
          ) : (
            <li
              key={todo._id}
              className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm"
            >
              <span className="font-medium text-gray-700">{todo.task}</span>
              <div className="space-x-2">
                <button
                  onClick={() => setEditing({ id: todo._id, task: todo.task })}
                  className="bg-yellow-400 text-white px-2 py-1 rounded-lg hover:bg-yellow-500"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => deleteTodo(todo._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                >
                  🗑 Delete
                </button>
              </div>
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export default App;
