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
        
        <h3 className="mb-3">👤 {user.alias || user.name}</h3>
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
    </>
  );
};

export default UserProfile;
