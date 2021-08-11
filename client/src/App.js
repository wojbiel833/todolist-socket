import React from "react";
import io from "socket.io-client";

class App extends React.Component {
  state = {
    tasks: [],
    taskName: "",
  };

  componentDidMount() {
    this.socket = io();
    this.socket.connect("http://localhost:7000");
    // this.socket.emit(this.state.tasks);
    console.log(this.state.tasks);

    this.socket.on("addTask", (taskName) => this.addTask(taskName));
    // !!!
    // opowiedz o kolejnosci wykonywania kolejnych zadan i komunikacji miedzy serverem i klientem - moze to mi ulatwi... :(
    // !!!
    this.socket.on("removeTask", (taskName, id) => this.removeTask(id));
    this.socket.on("updateData", (task) => {
      this.setState({ tasks: [...this.state.tasks, task] });
      this.updateTasks();
    });
    console.log(this.state.tasks);
  }

  removeTask = (taskName, id, socket) => {
    if (this.state.tasks[id]) this.index = id;

    this.state.tasks.splice(this.index, 1);
    // Musisz więc przemodelować tę funkcję, aby emitowanie zdarzenia do serwera miało miejsce tylko wtedy, gdy akcja usunięcia była wykonana najpierw lokalnie przez dany socket. Jeśli ta funkcja odpali się po informacji o potrzebie aktualizacji od serwera, powinna tylko usunąć odpowiedni element w swojej lokalnej tablicy. Krótko mówiąc, musisz uwarunkować odpowiednio emitowanie zdarzenia removeTask przez metodę removeTask.
    if (!socket.id) this.socket.broadcast.emit(id);
    console.log(this.state.tasks);
  };

  changeTaskName = () => {
    // this.state.setState(this.state.taskName)
    console.log(this.state.taskName);
    // Dodatkowo tak zmodyfikuj kod aplikacji, aby przy zmianie wartości w inpucie (onChange), automatycznie aktualizowała się też wartość zapisana w stanie (w state.taskName).
  };

  addTask = (task) => {
    // Stworzymy zaraz nową funkcję addTask, której zadaniem będzie tylko przyjmowanie w formie argumentu stringu z treścią zadania. Nie interesuje jej, czy pochodzi on ze state.taskName, czy może z informacji otrzymanej od serwera. Taka funkcja będzie mogła być używana od razu po wykryciu nowego tasku na serwerze, ale też właśnie przez naszą metodę submitForm.

    // task.name = ?;
    // task.id = ?;
    this.state.tasks.push({ name: task.name, id: task.id });
  };

  submitForm = (e) => {
    e.preventDefault();
    this.addTask();
    console.log(this.state.tasks);
    // Następnie powinna uruchamiać metodę addTask (zaraz ją dodamy). Przy wywołaniu tej metody pierwszy argument powinien mieć wartość state.taskName, aby funkcja addTask wiedziała, jaka ma być treść nowego zadania.
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
                  onClick={
                    this.removeTask
                    //Przy przypinaniu tej funkcji do nasłuchiwacza pamiętaj też o przekazaniu do niej indeksu zadania – w końcu removeTask będzie musiała wiedzieć, który element z listy ma usunąć.
                  }
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
