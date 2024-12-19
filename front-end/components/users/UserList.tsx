import React, { useEffect, useState } from 'react';
import UserService from '../../services/UserService'; // Import UserService
import { UserShow} from '../../types';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<UserShow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await UserService.getAllUsers(); // Fetch raw user data
        setUsers(users);
      } catch (err) {
        setError('Failed to fetch users.');
      }
    };

    fetchUsers();
  }, []);

  if (error) {
    return <div className="text-red-500">Error loading users: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User List</h1>
      {users.length === 0 ? (
        <div>Loading...</div>
      ) : (
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Username</th>
              <th className="border border-gray-300 px-4 py-2">Full Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border border-gray-300 px-4 py-2">{user.username}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.firstName} {user.lastName}
                </td>
                <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                <td className="border border-gray-300 px-4 py-2">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserList;
