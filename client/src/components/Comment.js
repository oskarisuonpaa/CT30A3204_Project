import { useContext } from "react";
import Button from "react-bootstrap/esm/Button";
import { useParams } from "react-router-dom";
import { UserContext } from "./UserContext";

const Comment = (props) => {
  const content = props.comment.content;
  const commentID = props.comment.id;
  const commenter = props.comment.user;
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const date = new Date(props.comment.date).toUTCString();

  const handleDelete = () => {
    fetch(`/posts/${id}/${commentID}`, {
      method: "DELETE",
      headers: { Authorization: sessionStorage.getItem("token") },
    }).then((res) =>
      res.json().then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          window.location.reload();
        }
      })
    );
  };

  return (
    <div className="d-flex">
      {user !== null && (user.username === commenter || user.admin) && (
        <Button
          variant="outline-primary"
          className="me-3"
          onClick={handleDelete}>
          Delete
        </Button>
      )}
      <p>
        <span style={{ color: "#9e1316" }}>{commenter}</span>: {content}{" "}
      </p>
      <p className="ms-auto me-0">Commented: {date}</p>
    </div>
  );
};

export default Comment;
