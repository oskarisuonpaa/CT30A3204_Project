const PostPreview = (props) => {
  return (
    <div
      className="d-flex flex-row justify-content-center align-items-center"
      onClick={() =>
        (window.location.href = `http://localhost:3000/post/${props.post.id}`)
      }>
      <div className="d-flex align-items-center me-3">
        <h2>{props.post.score}</h2>
      </div>
      <h1 className="ms-auto me-auto">{props.post.title}</h1>
      <p className="ms-3">Asked by {props.post.user}</p>
    </div>
  );
};

export default PostPreview;
