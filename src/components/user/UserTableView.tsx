import React from 'react';
import { User } from '../../App';

interface UserTableViewProps {
  users: User[];
}

const UserTableView: React.FC<UserTableViewProps> = ({ users }) => {
  return (
    <div className='flex flex-col overflow-hidden rounded-xl border mt-8'>
        <table className="w-full border-collapse">
        <thead className='text-[20px]'>
            <tr className="bg-[#D9D9D9]">
            <th className="border p-3 text-center">姓名</th>
            <th className="border p-3 text-center">性別</th>
            <th className="border p-3 text-center">生日</th>
            <th className="border p-3 text-center">職業</th>
            <th className="border p-3 text-center">電話</th>
            <th className="border p-3 text-center">更多</th>
            </tr>
        </thead>
        <tbody className='text-[16px]'>
            {users.map(user => (
            <tr key={user.id}>
                <td className="border p-4 text-center">{user.name}</td>
                <td className="border p-4 text-center">{user.gender}</td>
                <td className="border p-4 text-center">{user.birthday}</td>
                <td className="border p-4 text-center">{user.occupation}</td>
                <td className="border p-4 text-center">{user.phone_number}</td>
                <td className="border p-4">
                    <div className="flex justify-center space-x-2">
                        <button>
                        <img src="delete.png" alt="刪除" className="w-[25px] h-[25px]" />
                        </button>
                        <button>
                        <img src="revise.png" alt="修改" className="w-[25px] h-[25px]" />
                        </button>
                    </div>
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>
  );
};

export default UserTableView;