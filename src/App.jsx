import { useState } from "react";
import axios from "axios";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [projects, setProjects] = useState([]);

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/login",
        { email, password }
      );

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

      const response = await axios.get("http://localhost:3000/api/projects", {
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
        "http://localhost:3000/api/projects",
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

  if (isLoggedIn) {
    return (
      <div>
        <h1>Pro-Tasker Dashboard</h1>

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