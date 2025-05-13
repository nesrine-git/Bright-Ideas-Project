import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import userService from '../services/userService';
import ideaService from '../services/ideaService';
import Navbar from './Navbar';

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRes = await userService.getOne(id);
        setUser(userRes);

        const userIdeas = await ideaService.getByUser(id);
        setPosts(Array.isArray(userIdeas) ? userIdeas : []);
      } catch (err) {
        console.error(err);
        setError('Failed to load user profile');
      }
    };
    fetchUserData();
  }, [id]);

  if (error) {
    return <p className="text-red-600 text-center mt-4">{error}</p>;
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalReactions = posts.reduce((sum, post) => {
    const supportsCount = Array.isArray(post.supports) ? post.supports.length : 0;
    const inspirationsCount = Array.isArray(post.inspirations) ? post.inspirations.length : 0;
    return sum + supportsCount + inspirationsCount;
  }, 0);

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          {user.image ? (
            <img
              src={`http://localhost:3000/uploads/${user.image}`}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-500 text-white flex items-center justify-center text-lg font-semibold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <h3 className="text-xl font-semibold">{user.alias || user.name}</h3>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 space-y-3">
          <p><span className="font-semibold">Name:</span> {user.name}</p>
          <p><span className="font-semibold">Alias:</span> {user.alias}</p>
          <p><span className="font-semibold">Email:</span> {user.email}</p>
          <p><span className="font-semibold">Total Posts:</span> {posts.length}</p>
          <p><span className="font-semibold">Total Reactions Received:</span> {totalReactions}</p>
        </div>

        <h4 className="text-lg font-semibold mt-8 mb-2">🧠 Ideas by {user.alias || user.name}</h4>

        {posts.length === 0 ? (
          <p className="text-gray-500 italic">No ideas posted yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border border-gray-200 mt-2 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-2 border-b">Title</th>
                  <th className="text-left px-4 py-2 border-b">Supports</th>
                  <th className="text-left px-4 py-2 border-b">Inspirations</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">
                      <Link
                        to={`/ideas/${post._id}/likes`}
                        className="text-blue-600 hover:underline"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-4 py-2 border-b">{post.supports?.length || 0}</td>
                    <td className="px-4 py-2 border-b">{post.inspirations?.length || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default UserProfile;
