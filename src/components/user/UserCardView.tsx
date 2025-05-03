import React from 'react';
import { User, DEFAULT_AVATAR_URL } from '../../App';

interface UserCardViewProps {
  users: User[];
}

const UserCardView: React.FC<UserCardViewProps> = ({ users }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map(user => (
        <div key={user.id} className="border rounded-lg shadow-md p-4">
          <img 
            src={user.avatar_url || DEFAULT_AVATAR_URL} 
            alt="頭像" 
            className="w-[250px] h-[250px] object-cover mx-auto mb-4" 
          />
          <div className="space-y-2">
            <div>姓名: {user.name}</div>
            <div>性別: {user.gender}</div>
            <div>生日: {user.birthday}</div>
            <div>職業: {user.occupation}</div>
            <div>電話: {user.phone_number}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserCardView;