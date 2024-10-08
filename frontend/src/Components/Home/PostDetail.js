import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const PostDetail = () => {
    const { id } = useParams(); // Lấy id từ URL
    const [posts, setPosts] = useState([]); // Tất cả các bài viết
    const [currentPost, setCurrentPost] = useState(null); // Bài viết hiện tại
   
    const [comments, setComments] = useState([]); // Danh sách bình luận
    const [newComment, setNewComment] = useState({ name: '', email: '', content: '' }); // Giá trị bình luận mới

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

    const fetchPostDetail = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/post/${id}`);
            console.log('Fetched post detail:', response.data);
            setCurrentPost(response.data);
        } catch (error) {
            console.error('Error fetching post detail', error);
            setCurrentPost(null);
        }
    };

    useEffect(() => {
        fetchPosts();
        fetchPostDetail();
    }, [id]); // Gọi API mỗi khi id thay đổi
    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (newComment.content.trim() === '') return; // Kiểm tra ô nhập bình luận không rỗng
        const comment = {
            id: comments.length + 1, // Tạo id giả cho bình luận mới
            name: newComment.name,
            email: newComment.email,
            content: newComment.content,
            date: new Date().toLocaleDateString(), // Ngày bình luận
        };
        setComments([...comments, comment]); // Thêm bình luận vào danh sách
        setNewComment({ name: '', email: '', content: '' }); // Xóa ô nhập sau khi gửi
    };


    if (!currentPost) {
        return <div>Loading...</div>; // Hiển thị loading nếu chưa có dữ liệu
    }

    return (
        <div className='container' style={{ height: "100%" }}>
            <div className='row'>
                <div className='col-4'>
                    <h4 className='my-2'>Tất cả bài viết</h4>
                    <section className="maincontent my-3">
                        {posts.map((post) => (
                            <div
                                key={post.id}
                                className="rounded-4 border m-1 bg-white shadow"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setCurrentPost(post)}
                            >
                                <Link to={`/chi-tiet-bai-viet/${post.id}`}>
                                    <img src={post.image} style={{ height: "200px", width: "100%" }} className="rounded-4 border" alt={post.name} />
                                </Link>
                                <p className="mx-1">{post.name}</p>
                            </div>
                        ))}
                    </section>
                </div>
                <div className='col-8'>
                    <h2 className='my-2'>{currentPost.name}</h2>
                    <img src={currentPost.image} style={{ height: "500px", width: "800px" }} className="rounded-4 border my-2" alt={currentPost.name} />
                    <p>{currentPost.detail}</p>
                    <Link to="/" className="btn btn-secondary mt-3">Quay lại</Link> {/* Nút quay lại trang danh sách */}
                    <div className="my-4">
                        <h5>Viết bình luận của bạn:</h5>
                        <form onSubmit={handleCommentSubmit} className="border p-3 rounded">
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Họ và tên"
                                    value={newComment.name}
                                    onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Email"
                                    value={newComment.email}
                                    onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <textarea
                                    className="form-control"
                                    placeholder="Nội dung"
                                    rows="3"
                                    value={newComment.content}
                                    onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                                    required
                                ></textarea>
                            </div>
                            <button className="btn btn-primary" type="submit">Gửi thông tin</button>
                        </form>
                        <div className="comments mt-4">
                            <h6>Bình luận ({comments.length})</h6>
                            {comments.map(comment => (
                                <div key={comment.id} className="comment my-2 border p-2 rounded">
                                    <strong>{comment.name} ({comment.email})</strong>
                                    <p>{comment.content}</p>
                                    <small>{comment.date}</small>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
