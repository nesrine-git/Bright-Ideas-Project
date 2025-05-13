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
        setPosts(userIdeas);
      } catch (err) {
        console.error(err);
        setError('Failed to load user profile');
      }
    };
    fetchUserData();
  }, [id]);

  if (error) return <p className="text-danger">{error}</p>;
  if (!user) return (
      <div className="spinner-grow" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
);

  const totalLikes = posts.reduce((sum, post) => sum + (Array.isArray(post.likes) ? post.likes.length : 0), 0);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className='d-flex align-items-center gap-2'>
        {user.profilePictureUrl ? (
                  <img
                  src={`http://localhost:3000/uploads/${user.image}`}
                  alt="profile"
                  className="rounded-circle"
                  style={{ width: '35px', height: '35px', borderRadius: '50%' }}
                />
                ) : (
                  <div
                    className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center"
                    style={{ width: '40px', height: '40px' }}
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <h3>{user.alias || user.name}</h3>
        </div>
        <div className='d-flex flex-column p-4' >
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Alias:</strong> {user.alias}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Total Posts:</strong> {posts.length}</p>
            <p><strong>Total Likes Received:</strong> {totalLikes}</p>

            <h5 className="mt-4">🧠 Ideas by {user.alias || user.name}</h5>
            {posts.length === 0 ? (
              <p className="text-muted">No ideas posted yet.</p>
            ) : (
              <table className="table table-bordered mt-2">
                <thead className="thead-light">
                  <tr>
                    <th>Title</th>
                    <th>Likes</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map(post => (
                    <tr key={post._id}>
                      <td>
                        <Link to={`/ideas/${post._id}/likes`}>{post.title}</Link>
                      </td>
                      <td>{post.likes?.length || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>
      </div>
    </>
  );
};

export default UserProfile;
