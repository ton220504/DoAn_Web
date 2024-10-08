import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Post = () => {
    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/post");
            console.log('Fetched posts:', response.data);
            setPosts(response.data || []);
        } catch (error) {
            console.error('Error fetching posts', error);
            setPosts([]);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // Lấy 3 bài viết đầu tiên
    const displayedPosts = posts.slice(0, 3);

    return (
        <div className='container'>
            <div className='row'>
                <h4 className='my-2'>Tất cả bài viết</h4>
                <section className="maincontent my-3">
                    <div className="row">
                        {displayedPosts.map((post) => (
                            <div
                                key={post.id}
                                className="col-md-4 mb-4"
                            >
                                <div className="rounded-4 border bg-white shadow" style={{ height: "100%" }}>
                                    <Link to={`/chi-tiet-bai-viet/${post.id}`}>
                                        <img src={post.image} style={{ height: "200px", width: "100%" }} className="rounded-4 border" alt={post.name} />
                                    </Link>
                                    <div className="p-2">
                                        <h5>{post.name}</h5>
                                        <Link to={`/chi-tiet-bai-viet/${post.id}`} className="btn btn-primary mt-2">Xem chi tiết</Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Post;
