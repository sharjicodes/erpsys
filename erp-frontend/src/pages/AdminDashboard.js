// src/pages/AdminDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const { authTokens } = useAuth();
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: "", password: "", role: "EMPLOYEE" });

  // Fetch all users
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/users/", {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, [authTokens]);

  // Create user
  const handleCreate = (e) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:8000/api/register/", newUser, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      })
      .then((res) => {
        setUsers([...users, res.data]);
        setNewUser({ username: "", password: "", role: "EMPLOYEE" });
      })
      .catch((err) => console.error(err));
  };

  // Delete user
  const handleDelete = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/api/users/${id}/`, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      })
      .then(() => setUsers(users.filter((u) => u.id !== id)))
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>

      {/* User Creation Form */}
      <form onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        >
          <option value="ADMIN">Admin</option>
          <option value="MANAGER">Manager</option>
          <option value="EMPLOYEE">Employee</option>
        </select>
        <button type="submit">Create User</button>
      </form>

      {/* Users Table */}
      <table border="1">
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>
                {/* Update feature later */}
                <button onClick={() => handleDelete(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
