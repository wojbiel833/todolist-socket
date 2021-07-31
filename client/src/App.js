import React from "react";
import io from "socket.io";

class App extends React.Component {
  state = {
    tasks: ["Shopping"],
  };

  componentDidMount() {
    this.socket = io();
    // this.socket.connect("http://localhost:8000");
    //CO JEST NIE TAK Z POLACZENIEM HOSTOW?
  }

  removeTask(id) {
    console.log("remove");
    // const task = this.state.tasks.find((item) => item.id === id);
    const index = this.state.tasks.findIndex(
      (item) => item.id === this.socket.id
    );

    this.state.tasks.splice(index, 1);
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
              <li key={task + task.length} className="task">
                {task}
                <button className="btn btn--red" onClick={this.removeTask}>
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <form id="add-task-form">
            <input
              className="text-input"
              autoComplete="off"
              type="text"
              placeholder="Type your description"
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
