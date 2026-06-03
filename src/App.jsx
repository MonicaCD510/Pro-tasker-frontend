import { useState } from "react";
import axios from "axios";

const API_URL = "https://pro-tasker-1w72.onrender.com";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState({});

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("To Do");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/api/users/login`, {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      setIsLoggedIn(true);
      alert("Login successful!");
    } catch (err) {
      alert("Login failed");
      console.error(err);
    }
  };

  const getProjects = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_URL}/api/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProjects(response.data);
    } catch (err) {
      alert("Could not load projects");
      console.error(err);
    }
  };

  const createProject = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_URL}/api/projects`,
        {
          name: projectName,
          description: projectDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProjectName("");
      setProjectDescription("");
      getProjects();
    } catch (err) {
      alert("Could not create project");
      console.error(err);
    }
  };

  const getTasks = async (projectId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/api/tasks/project/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks({
        ...tasks,
        [projectId]: response.data,
      });
    } catch (err) {
      alert("Could not load tasks");
      console.error(err);
    }
  };

  const createTask = async (projectId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_URL}/api/tasks/project/${projectId}`,
        {
          title: taskTitle,
          description: taskDescription,
          status: taskStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTaskTitle("");
      setTaskDescription("");
      setTaskStatus("To Do");
      getTasks(projectId);
      alert("Task created!");
    } catch (err) {
      alert("Could not create task");
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setProjects([]);
    setTasks({});
  };

  if (isLoggedIn) {
    return (
      <div>
        <h1>Pro-Tasker Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>

        <form onSubmit={createProject}>
          <h2>Create Project</h2>

          <input
            type="text"
            placeholder="Project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />

          <br />
          <br />

          <input
            type="text"
            placeholder="Project description"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
          />

          <br />
          <br />

          <button type="submit">Create Project</button>
        </form>

        <hr />

        <button onClick={getProjects}>Load Projects</button>

        <h2>My Projects</h2>

        {projects.map((project) => (
          <div key={project._id}>
            <h3>{project.name}</h3>
            <p>{project.description}</p>

            <button onClick={() => getTasks(project._id)}>Load Tasks</button>

            <h4>Create Task</h4>

            <input
              type="text"
              placeholder="Task title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />

            <br />
            <br />

            <input
              type="text"
              placeholder="Task description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />

            <br />
            <br />

            <select
              value={taskStatus}
              onChange={(e) => setTaskStatus(e.target.value)}
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>

            <br />
            <br />

            <button onClick={() => createTask(project._id)}>Create Task</button>

            <h4>Tasks</h4>

            {(tasks[project._id] || []).map((task) => (
              <div key={task._id}>
                <p>
                  <strong>{task.title}</strong> - {task.status}
                </p>
                <p>{task.description}</p>
              </div>
            ))}

            <hr />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h1>Pro-Tasker</h1>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />
        <br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default App;