import React, { useState } from 'react';
import { User, DEFAULT_AVATAR_URL } from '../../App';
import UpdateUserForm from '../modal/UpdateUserForm';
import DeleteUserForm from '../modal/DeleteUserForm';

interface UserCardViewProps {
  users: User[];
  onClose?: (shouldRefresh: boolean) => void; 
}

const UserCardView: React.FC<UserCardViewProps> = ({ users, onClose }) => {

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
  
    const handleClose = (shouldRefresh: boolean) => {
        setSelectedUser(null);
        setUserToDelete(null);
        
        if (shouldRefresh && onClose) {
          onClose(shouldRefresh);
        }
      };
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 gap-10">
        {users.map(user => (
            <div key={user.id} className="border-[1px] border-black border-solid rounded-[10px] pt-4">
            <div>
                <img 
                    src={user.avatar_url || DEFAULT_AVATAR_URL} 
                    alt="頭像" 
                    className="w-[250px] h-[250px] rounded-full object-cover mx-auto mb-4" 
                />
                <div className="space-y-2 pb-4">
                    <div className='flex justify-center items-center font-bold text-[24px]'>{user.name}</div>
                    <div className='mx-8 my-4 py-2 rounded-[10px] bg-[#F3F3F3] text-[20px] text-[#7E7E7E]'>
                        <div className='flex justify-center items-center'>{user.gender} / {user.birthday}</div>
                        <div className='flex justify-center items-center'>{user.occupation} / {user.phone_number}</div>
                    </div>
                </div>
            </div>
            <div>
                <div className="h-[1px] bg-black w-full mt-auto"></div>
                <div className='flex justify-end m-2 space-x-2'>
                    <button onClick={() => setUserToDelete(user)}>
                        <img src="delete.png" alt="Delete Icon" className="w-[25px] h-[25px]" />
                    </button>
                    <button onClick={() => setSelectedUser(user)}>
                        <img src="revise.png" alt="Revise Icon" className="w-[25px] h-[25px]" />
                    </button>
                </div>
            </div>
            </div>
        ))}
        </div>
        {selectedUser && (
            <UpdateUserForm 
                user={selectedUser} 
                onClose={handleClose} 
            />
        )}
        {userToDelete && (
            <DeleteUserForm
                user={userToDelete}
                onClose={handleClose}
            />
        )}
        </>
    );
};

export default UserCardView;