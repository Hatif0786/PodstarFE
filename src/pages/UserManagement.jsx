import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import "../css/UserManagement.css";
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';

const UserManagement = ({ setMenuOpened, logout, setUserlogged, setPlayerVisible, darkMode }) => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loader, setLoader] = useState(true);
    const navigate = useNavigate();
    const [loadingUpdate, setLoadingUpdate] = useState(false); // For update button
    const [loadingAdd, setLoadingAdd] = useState(false); // For add button

    const [newUser, setNewUser] = useState({
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      password: '',
      confirmPassword: '',
    });
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Add New User modal state
  
    // Use useCallback to prevent unnecessary re-renders
    const handleLogout = useCallback(() => {
      logout();
      setPlayerVisible(false);
      setMenuOpened(false);
      setUserlogged(false);
      navigate("/login");
    }, [logout, setPlayerVisible, setMenuOpened, setUserlogged, navigate]);
  
    // Fetch user data from the API
    useEffect(() => {
      const fetchUsers = async () => {
        if (!Cookies.get("token")) {
          handleLogout();
          return;
        }
  
        try {
          const response = await axios.get("https://podstar-1.onrender.com/api/user/all", {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          });
          setUsers(response.data);
          setLoader(false);
        } catch (error) {
          console.error("Error fetching users:", error);
          setLoader(false);
        }
      };
  
      fetchUsers();
    }, [handleLogout]); // Add handleLogout to dependencies
  
    // Handle user deletion
    const handleDelete = (id) => {
      setUsers(users.filter((user) => user.id !== id));
    };
  
    // Open update modal
    const openUpdateModal = (user) => {
      setSelectedUser(user);
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
      setSelectedUser(null);
    };
  
    const handleUpdate = async () => {
      setLoadingUpdate(true);
      if (!Cookies.get("token")) {
            handleLogout();
            return;
        }  
      try {
        await axios.put(
          `https://podstar-1.onrender.com/api/user/updateRole?role=${selectedUser.role}&updatedUsername=${selectedUser.username}`, 
          {}, 
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        setUsers(users.map(user => (user.id === selectedUser.id ? { ...user, role: selectedUser.role } : user)));
      } catch (error) {
        console.error("Error updating user:", error);
      }finally {
        setLoadingUpdate(false); // Stop loading
        closeModal();
      }
    };
  
    // Open Add New User Modal
    const openAddModal = () => {
      setIsAddModalOpen(true);
    };
  
    // Close Add New User Modal
    const closeAddModal = () => {
      setIsAddModalOpen(false);
      setNewUser({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        password: '',
        confirmPassword: '',
      });
    };
  
    // Handle Add New User
    const handleAddUser = async () => {
        setLoadingAdd(true);
        if (!Cookies.get("token")) {
          handleLogout();
          return;
        }
      
        try {
          if (newUser.password !== newUser.confirmPassword) {
            alert("Passwords do not match");
            return;
          }
      
          const response = await axios.post(
            "https://podstar-1.onrender.com/api/user/admin-add", 
            newUser, 
            {
              headers: {
                Authorization: `Bearer ${Cookies.get("token")}`,
              },
            }
          );
      
          // Assuming the API returns the newly created user in the response
          const addedUser = response.data;
      
          // Update the users list with the newly added user
          setUsers(prevUsers => [...prevUsers, addedUser]);
      
          closeAddModal();
        } catch (error) {
          console.error("Error adding user:", error);
          alert("Failed to add user.");
        }
        finally {
          setLoadingAdd(false); // Stop loading
        }
      };
      
  
    const filteredUsers = users.filter((user) =>
      user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const getChipColor = (role) => {
      switch (role.toLowerCase()) {
        case 'admin':
          return 'error'; // Red color for Admin
        case 'normal':
          return 'warning'; // Yellow color for Normal
        default:
          return 'default'; // Default color if no specific role matches
      }
    };

  return (
    <div className="user-management-container">
      <div className="user-management-header">
        <h1>User Management</h1>
        <button className="add-user-button" style={{borderRadius:"30px"}} onClick={openAddModal}>Add New User</button>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{borderRadius:"30px", fontSize:"16px"}}
        />
        <button className="search-button" style={{borderRadius:"30px"}}>Search</button>
      </div>

      {loader ? (
        <section className="dots-container">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </section>
      ) : (
        <div className="user-list-container">
          {filteredUsers.map((user) => (
            <div className="user-card" key={user.id}>
              <img 
                src={user.profileImageUrl ? `https://images.weserv.nl/?url=${encodeURIComponent(user.profileImageUrl)}` : "http://bootdey.com/img/Content/avatar/avatar1.png"} 
                alt="profile" 
              />
              <h3>{user.firstName} {user.lastName}</h3>
              <p>{user.email}</p>
              <Stack direction="row" justifyContent="center" spacing={1} style={{marginBottom: "20px"}}>
                <Chip label={user.role} color={getChipColor(user.role)} />
              </Stack>
              <button className="edit-button" style={{borderRadius:"30px"}} onClick={() => openUpdateModal(user)}>
                Update
              </button>
              <button className="delete-button" style={{borderRadius:"30px"}} onClick={() => handleDelete(user.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Update User Modal */}
      {isModalOpen && (
        <div className="modal1-overlay">
          <div className="modal1">
            <h2>Update User</h2>
            <input
              type="text"
              placeholder="First Name"
              value={selectedUser?.firstName}
              disabled
            />
            <input
              type="text"
              placeholder="Last Name"
              value={selectedUser?.lastName}
              disabled
            />
            <input
              type="email"
              placeholder="Email"
              value={selectedUser?.email}
              disabled
            />
            <select
              value={selectedUser?.role}
              onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '15px',
                border: '1px solid #ccc',
                borderRadius: '20px',
                fontSize: '16px',
                transition: 'border-color 0.3s',
              }}
            >
              <option value="NORMAL">NORMAL</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={handleUpdate} style={{ borderRadius: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center'  }}>
                {!loadingUpdate ? 'Update' : (
                  <div className="dot-spinner" style={{ height: "95%", marginLeft: "10px", marginRight:"10px" }}>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                  </div>
                )}
              </button>
              <button onClick={closeModal} style={{ borderRadius: '30px' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Add New User Modal */}
      {isAddModalOpen && (
        <div className="modal1-overlay">
          <div className="modal1" style={{ width: '500px' }}> {/* Wider modal */}
            <h2>Add New User</h2>
            <input
              type="text"
              placeholder="Username"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <input
              type="text"
              placeholder="First Name"
              value={newUser.firstName}
              onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={newUser.lastName}
              onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Phone"
              value={newUser.phone}
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={newUser.confirmPassword}
              onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={handleAddUser} style={{ borderRadius: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center'  }}>
                {!loadingAdd ? 'Add User' : (
                  <div className="dot-spinner" style={{ height: "95%", marginLeft: "10px", marginRight:"10px" }}>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                  </div>
                )}
              </button>
              <button onClick={closeAddModal} style={{ borderRadius: '30px' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
