import React from "react";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

class App extends React.Component {
  state = {
    tasks: [],
    taskName: "",
  };

  componentDidMount() {
    this.socket = io("ws://localhost:7000", { transports: ["websocket"] });

    this.socket.on("addTask", (taskName) => this.addTask(taskName, false));
    this.socket.on("removeTask", (id) => this.removeTask(id, false));
    this.socket.on("updateData", (tasks) => {
      this.setState({ tasks: [...tasks] });
    });
    console.log(this.state.tasks);
  }

  removeTask = (id, isLocal = true) => {
    this.setState({ tasks: this.state.tasks.filter((task) => task.id !== id) });
    if (isLocal) this.socket.emit("removeTask", id);
  };

  changeTaskName = (e) => {
    this.setState({ taskName: e.target.value });
  };

  addTask = (task, isLocal = true) => {
    this.setState({
      tasks: [...this.state.tasks, { name: task.name, id: task.id }],
    });
    if (isLocal) this.socket.emit("addTask", task);
  };

  submitForm = (e) => {
    e.preventDefault();
    this.addTask({
      name: this.state.taskName,
      id: uuidv4(),
    });
  };

  updateTask() {
    this.socket.on("addTask", (taskName) => this.addTask(taskName));
    this.socket.on("removeTask", (id) => this.removeTask(id));
  }

  render() {
    return (
      <div className="App">
        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>

          <ul className="tasks-section__list" id="tasks-list">
            {this.state.tasks.map((task) => (
              <li key={task.id} className="task">
                {task.name}
                <button
                  className="btn btn--red"
                  onClick={() => this.removeTask(task.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <form id="add-task-form" onSubmit={this.submitForm}>
            <input
              className="text-input"
              autoComplete="off"
              type="text"
              onChange={this.changeTaskName}
              placeholder={this.state.taskName}
              id="task-name"
            />
            <button className="btn" type="submit">
              Add
            </button>
          </form>
        </section>
      </div>
    );
  }
}

export default App;
