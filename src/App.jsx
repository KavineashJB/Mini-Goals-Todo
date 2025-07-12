import { useEffect, useState } from "react";
import "./App.css";
import { AiOutlineDelete } from "react-icons/ai";
import { MdDone } from "react-icons/md";
import { FaRegCalendarCheck } from "react-icons/fa";
import { BiRedo } from "react-icons/bi";
import { FaEdit } from "react-icons/fa";

const App = () => {
  const [Id, setId] = useState(0);
  const [isEditable, setIsEditable] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [allTodo, setAllTodo] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [completedTodos, setCompletedTodos] = useState([]);
  const [modfiedId, setModifiedId] = useState(-1);

  const handleClick = (todoId) => {
    if (!newTitle || !newDesc) return;

    if (isEditable) {
      setIsEditable(false);
    } else {
      setAllTodo([...allTodo, { id: Id + 1, title: newTitle, desc: newDesc }]);
      setId((id) => id + 1);
    }
    setNewTitle("");
    setNewDesc("");
  };

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem("allTodo")) || [];
    const savedCompletedTodos =
      JSON.parse(localStorage.getItem("completedTodos")) || [];
    const savedMaxId = JSON.parse(localStorage.getItem("maxId")) || 0;
    // While mounting;
    setAllTodo(savedTodos);
    setCompletedTodos(savedCompletedTodos);
    setId(savedMaxId);
  }, []);

  useEffect(() => {
    localStorage.setItem("allTodo", JSON.stringify(allTodo));
    localStorage.setItem("completedTodos", JSON.stringify(completedTodos));
    localStorage.setItem("maxId", JSON.stringify(Id));
  }, [allTodo, completedTodos, Id]);

  const handleUpdate = () => {
    const todoIndex = allTodo.findIndex((todo) => todo.id === modfiedId);
    allTodo[todoIndex] = { id: modfiedId, title: newTitle, desc: newDesc };
    setAllTodo(allTodo);
    setNewTitle("");
    setNewDesc("");
  };
  const handleEdit = (id) => {
    const todoIndex = allTodo.findIndex((todo) => todo.id === id);
    setNewTitle(allTodo[todoIndex].title);
    setNewDesc(allTodo[todoIndex].desc);
    setModifiedId(id);
  };

  const handleDelete = (id) => {
    if (!isCompleted) {
      const deleteTodos = allTodo.filter((todo) => todo.id !== id);
      setAllTodo([...deleteTodos]);
    } else {
      const deletedCompletedTodos = completedTodos.filter(
        (completedTodo) => completedTodo.id !== id
      );
      setCompletedTodos([...deletedCompletedTodos]);
    }
  };

  const handleComplete = (id, isRedo) => {
    if (!isRedo) {
      const todo = allTodo.find((todo) => todo.id === id);

      const filteredTodo = allTodo.filter((todo) => todo.id !== id);
      let completedAt = new Date().toUTCString();
      const completedTodo = { ...todo, "completed At": completedAt };

      setAllTodo([...filteredTodo]);
      setCompletedTodos([...completedTodos, completedTodo]);
    } else {
      const redoTodoIndex = completedTodos.findIndex((todo) => todo.id === id);
      const redoTodos = completedTodos.slice(redoTodoIndex, redoTodoIndex + 1);
      const filteredTodo = completedTodos.filter((todo) => todo.id !== id);
      delete redoTodos[0]["completed At"];
      setCompletedTodos([...filteredTodo]);
      setAllTodo([...allTodo, redoTodos[0]]);
    }
  };

  return (
    <div className="app">
      <h1 className="title">My Todos</h1>

      {/* Todo input entering area */}
      <div className="todo-wrapper">
        <div className="todo-input">
          <span className="todo-input-item">
            <label>Title</label>
            <div>
              <input
                type="text"
                autoComplete="additional-name"
                placeholder="What's in your mind..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
          </span>
          <span className="todo-input-item">
            <label>Description</label>
            <div>
              <input
                type="text"
                autoComplete="new-password"
                placeholder="Tell about your task..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
            </div>
          </span>
          <span className="todo-add-btn">
            <button
              onClick={() => {
                if (!isEditable) {
                  handleClick();
                } else {
                  handleUpdate();
                  setIsEditable(false);
                }
              }}>
              {!isEditable ? "Add" : "Update"}
            </button>
          </span>
        </div>
        <hr />
        {/* Todo list showcasing Btns */}
        <div className="todo-btn-area">
          <button
            onClick={() => setIsCompleted(false)}
            className={`${!isCompleted && "active"}`}>
            To Do
          </button>
          <button
            onClick={() => setIsCompleted(true)}
            className={`${isCompleted && "active"}`}>
            Completed
          </button>
        </div>

        {/* Todo list showcasing area*/}
        <div className="todo-list">
          {!isCompleted
            ? allTodo.map((todo) => (
                <div
                  key={todo.title + Math.random()}
                  className={`
                  todo-list-item ${
                    todo.id === modfiedId && isEditable ? "editable" : ""
                  }`}>
                  <span className="todo-list-item-activity">
                    <h1>{todo.title}</h1>
                    <p>{todo.desc}</p>
                  </span>
                  <span className="todo-list-item-icons">
                    <FaEdit
                      onClick={() => {
                        setIsEditable(true);
                        handleEdit(todo.id);
                      }}
                      className="icon edit"
                      title="Edit Task"
                    />
                    <AiOutlineDelete
                      onClick={() => handleDelete(todo.id)}
                      className="icon delete"
                      title="delete Task"
                    />
                    <MdDone
                      onClick={() => handleComplete(todo.id, false)}
                      className="icon completed"
                      title="Complete Task"
                    />
                  </span>
                </div>
              ))
            : completedTodos.map((todo) => (
                <div
                  key={todo.title + Math.random()}
                  className="todo-list-item">
                  <span className="todo-list-item-activity">
                    <h1>{todo.title}</h1>
                    <p>{todo.desc}</p>
                    <p>
                      <span>
                        <FaRegCalendarCheck
                          style={{ marginTop: "10px", marginRight: "10px" }}
                        />
                      </span>
                      <span>{todo["completed At"]}</span>
                    </p>
                  </span>
                  <span className="todo-list-item-icons">
                    <AiOutlineDelete
                      onClick={() => handleDelete(todo.id)}
                      className="delete"
                      title="delete Task"
                    />
                    <BiRedo
                      onClick={() => handleComplete(todo.id, true)}
                      className="completed"
                      title="Redo Task"
                    />
                  </span>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default App;
