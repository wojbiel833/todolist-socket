import React from "react";
import io from "socket.io-client";

class App extends React.Component {
  state = {
    tasks: [
      { name: "Shopping", id: 1 },
      { name: "Gym", id: 2 },
      { name: "Learning how to code", id: 3 },
    ],
    taskName: "",
  };

  componentDidMount() {
    this.socket = io();
    this.socket.connect("http://localhost:8000");
    // this.socket.emit(this.state.tasks);
    console.log(this.state.tasks);
  }

  removeTask = (id) => {
    const index = this.state.tasks.findIndex((item) => item.id === id);

    this.state.tasks.splice(index, 1);
    this.socket.emit(id);
    console.log(this.state.tasks);
  };

  changeTaskName = () => {
    // this.state.setState(this.state.taskName)
    console.log(this.state.taskName);
  };

  submitForm(e) {
    e.preventDefault();
    this.addTask();
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
                <button className="btn btn--red" onClick={this.removeTask}>
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
              onChange={this.state.taskName}
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
