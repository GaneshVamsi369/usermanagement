import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Table, Modal, Form, Alert } from "react-bootstrap";

const App = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });
  const [error, setError] = useState("");

  // Fetch users from API
  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        const formattedUsers = response.data.map((user) => ({
          id: user.id,
          firstName: user.name.split(" ")[0] || "",
          lastName: user.name.split(" ")[1] || "",
          email: user.email,
          department: user.company?.name || "N/A",
        }));
        setUsers(formattedUsers);
      })
      .catch(() => setError("Failed to fetch users."));
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission for add/edit
  const handleSubmit = () => {
    const { id, firstName, lastName, email, department } = formData;
    const userData = {
      id: id || Math.floor(Math.random() * 1000),
      name: `${firstName} ${lastName}`,
      email,
      company: { name: department },
    };

    const request = id
      ? axios.put(`https://jsonplaceholder.typicode.com/users/${id}`, userData)
      : axios.post("https://jsonplaceholder.typicode.com/users", userData);

    request
      .then(() => {
        if (id) {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === id ? { ...user, ...formData } : user
            )
          );
        } else {
          setUsers((prevUsers) => [...prevUsers, { ...formData, id: userData.id }]);
        }
        setShowForm(false);
        setFormData({
          id: null,
          firstName: "",
          lastName: "",
          email: "",
          department: "",
        });
      })
      .catch(() => setError("Failed to save user data."));
  };

  // Handle delete user
  const handleDelete = (id) => {
    axios
      .delete(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then(() => {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      })
      .catch(() => setError("Failed to delete user."));
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">User Management</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button
        className="mb-3"
        variant="primary"
        onClick={() => setShowForm(true)}
      >
        Add User
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.department}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => {
                    setFormData(user);
                    setShowForm(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* User Form Modal */}
      <Modal show={showForm} onHide={() => setShowForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{formData.id ? "Edit User" : "Add User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Department</Form.Label>
              <Form.Control
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowForm(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default App;
