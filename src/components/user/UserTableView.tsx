import React from 'react';
import { User } from '../../App';

interface UserTableViewProps {
  users: User[];
}

const UserTableView: React.FC<UserTableViewProps> = ({ users }) => {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-2">姓名</th>
          <th className="border p-2">性別</th>
          <th className="border p-2">生日</th>
          <th className="border p-2">職業</th>
          <th className="border p-2">電話</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td className="border p-2">{user.name}</td>
            <td className="border p-2">{user.gender}</td>
            <td className="border p-2">{user.birthday}</td>
            <td className="border p-2">{user.occupation}</td>
            <td className="border p-2">{user.phone_number}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTableView;