import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [profile, setProfile] = useState(null);
  const [editUser, setEditUser] = useState(null); // track user being edited
  const [error, setError] = useState(null); // track errors

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const res = await API.get("profile/", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile", err);
        setError("Failed to load profile");
      }
    };

    const fetchUsers = async () => {
      if (["ADMIN", "MANAGER"].includes(user.role)) {
        try {
          const res = await API.get("users/", {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          setUsers(res.data);
        } catch (err) {
          console.error("Error fetching users", err);
          setError("Failed to load users");
        }
      }
    };

    fetchProfile();
    fetchUsers();
  }, [user]);

  if (!user) return <p>Please login first</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Dashboard ({user.role})</h1>
      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded mb-4"
      >
        Logout
      </button>

      {error && (
        <p className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</p>
      )}

      {/* Employee profile */}
      {user.role === "EMPLOYEE" && profile && (
        <div>
          <h2 className="text-lg font-bold">Profile</h2>
          <p>Username: {profile.username}</p>
          <p>Email: {profile.email}</p>
          <p>Role: {profile.role}</p>
        </div>
      )}

      {/* Manager and Admin - View Users */}
      {(user.role === "ADMIN" || user.role === "MANAGER") && (
        <div>
          <h2 className="text-lg font-bold mb-2">User List</h2>
          <table className="table-auto border w-full mb-4">
            <thead>
              <tr>
                <th className="border px-2">ID</th>
                <th className="border px-2">Username</th>
                <th className="border px-2">Role</th>
                {user.role === "ADMIN" && <th className="border px-2">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="border px-2">{u.id}</td>
                  <td className="border px-2">
                    {editUser?.id === u.id ? (
                      <input
                        defaultValue={u.username}
                        onChange={(e) =>
                          setEditUser({ ...editUser, username: e.target.value })
                        }
                        className="border px-1"
                      />
                    ) : (
                      u.username
                    )}
                  </td>
                  <td className="border px-2">
                    {editUser?.id === u.id ? (
                      <select
                        value={editUser.role}
                        onChange={(e) =>
                          setEditUser({ ...editUser, role: e.target.value })
                        }
                        className="border px-1"
                      >
                        <option value="EMPLOYEE">Employee</option>
                        <option value="MANAGER">Manager</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    ) : (
                      u.role
                    )}
                  </td>
                  {user.role === "ADMIN" && (
                    <td className="border px-2 space-x-2">
                      {editUser?.id === u.id ? (
                        <>
                          <button
                            onClick={async () => {
                              try {
                                await API.put(`users/${u.id}/`, editUser, {
                                  headers: { Authorization: `Bearer ${user.token}` },
                                });
                                setUsers(
                                  users.map((usr) =>
                                    usr.id === u.id ? { ...usr, ...editUser } : usr
                                  )
                                );
                                setEditUser(null);
                                setError(null);
                              } catch (err) {
                                console.error("Error updating user", err);
                                setError("Failed to update user");
                              }
                            }}
                            className="bg-green-500 text-white px-2 py-1 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditUser(null)}
                            className="bg-gray-400 text-white px-2 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditUser(u)}
                            className="bg-yellow-500 text-white px-2 py-1 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={async () => {
                              if (window.confirm(`Delete ${u.username}?`)) {
                                try {
                                  await API.delete(`users/${u.id}/delete/`, {
                                    headers: { Authorization: `Bearer ${user.token}` },
                                  });
                                  setUsers(users.filter((usr) => usr.id !== u.id));
                                  setError(null);
                                } catch (err) {
                                  console.error("Error deleting user", err);
                                  setError("Failed to delete user");
                                }
                              }
                            }}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Admin only - Create User */}
      {user.role === "ADMIN" && (
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-2">Create New User</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const payload = {
                username: formData.get("username"),
                password: formData.get("password"),
                role: formData.get("role"),
              };
              try {
                await API.post("users/create/", payload, {
                  headers: { Authorization: `Bearer ${user.token}` },
                });
                e.target.reset();
                const res = await API.get("users/", {
                  headers: { Authorization: `Bearer ${user.token}` },
                });
                setUsers(res.data);
                setError(null);
              } catch (err) {
                console.error("Error creating user", err);
                setError("Failed to create user");
              }
            }}
            className="mb-4 space-x-2"
          >
            <input
              name="username"
              placeholder="Username"
              className="border px-2"
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="border px-2"
              required
            />
            <select name="role" className="border px-2">
              <option value="EMPLOYEE">Employee</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </select>
            <button
              type="submit"
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Add
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
