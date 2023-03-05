import { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import PostPreview from "./PostPreview";
import { UserContext } from "./UserContext";

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);

  //Used to get posts from api
  useEffect(() => {
    fetch("/posts").then((res) =>
      res.json().then((data) => {
        setPosts(data);
      })
    );
  }, []);

  return (
    <div className="d-flex flex-column justify-content-center aling-items-center mt-3">
      {user !== null && (
        <div className="text-center mb-3">
          <Button
            style={{ width: "50vw" }}
            onClick={() => {
              window.location.href = "http://localhost:3000/newQuestion";
            }}>
            Ask a question
          </Button>
        </div>
      )}

      {posts.length !== 0 && (
        <ul style={{ listStyle: "none" }}>
          {posts.map((post) => (
            <li key={posts.indexOf(post)}>
              <div
                className="d-flex flex-column justify-content-center aling-items-center bg-dark post-container mb-3"
                style={{ cursor: "pointer" }}>
                <PostPreview post={post} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
