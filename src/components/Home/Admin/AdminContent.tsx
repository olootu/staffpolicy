// /pages/Admin.tsx
import { useQuery } from '@tanstack/react-query';
import { Register } from '../../Register/Register';
import { useState } from 'react';

const AdminContent = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['confirmations'],
        queryFn: async () => {
            const res = await fetch('https://staffpolicy-nodeserver.onrender.com/get-read-documents');
            return res.json();
        }
    });

    const [showRegister, setShowRegister] = useState(false);

    return (
        <div className="p-4">
            <div className='flex justify-between'>
                <h2 className="text-xl font-semibold mb-4">Document Confirmation Log</h2>
                <button onClick={() => setShowRegister(!showRegister)}
                 className='bg-green-700 text-white rounded pl-4 pr-4'>{showRegister ? 'Close Form' : 'Add New Staff Member'}</button>
            </div>
            {showRegister && (
                <div>
                    <Register />
                </div>
            )}


            {isLoading ? <p>Loading...</p> : (
                <table className="w-full border mt-6">
                    <thead className='text-left'>
                        <tr>
                            <th>Document</th>
                            <th>Read by</th>
                            <th>Read on</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((row: any, i: number) => (
                            <tr key={i}>
                                <td><a className='text-blue-500' href={row.document_url} target='_blank'>{row.document_name}</a></td>
                                <td>{row.user}</td>
                                <td>{new Date(row.timestamp).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminContent;
