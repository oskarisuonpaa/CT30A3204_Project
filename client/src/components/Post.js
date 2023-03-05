import { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import { useParams } from "react-router-dom";
import SyntaxHighlighter from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import Comment from "./Comment";
import Form from "react-bootstrap/Form";
import { UserContext } from "./UserContext";

const Post = () => {
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const [postValues, setPostValues] = useState(null);
  const [comment, setComment] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) => {
    setComment(e.target.value);
  };

  // Used to fetch the post data
  useEffect(() => {
    fetch(`/posts/${id}`).then((res) =>
      res.json().then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          const date = new Date(data.question.date);
          data.question.date = date.toUTCString();
          setPostValues({ ...postValues, ...data });
        }
      })
    );
  }, []);

  // Used for submitting new comment to the post
  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      fetch(`/posts/comment/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token"),
        },
        body: JSON.stringify({
          content: comment,
        }),
      }).then((res) => {
        res.json().then((data) => {
          if (data.error) {
            console.log(data.error);
          } else {
            window.location.reload();
          }
        });
      });
    }
  }, [formErrors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(comment));
    setIsSubmit(true);
  };

  const handlePlusScore = () => {
    fetch(`/posts/upvote/${id}`, {
      method: "PUT",
      headers: {
        Authorization: sessionStorage.getItem("token"),
      },
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

  const handleMinusScore = () => {
    fetch(`/posts/downvote/${id}`, {
      method: "PUT",
      headers: {
        Authorization: sessionStorage.getItem("token"),
      },
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

  const validate = (values) => {
    const errors = {};

    if (comment === "") {
      errors.comment = "Comment text is required!";
    }

    return errors;
  };

  const handleDelete = () => {
    fetch(`/posts/${id}`, {
      method: "DELETE",
      headers: { Authorization: sessionStorage.getItem("token") },
    }).then((res) =>
      res.json().then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          window.location.href = "http://localhost:3000/";
        }
      })
    );
  };

  return (
    <>
      {postValues !== null && (
        <div className="mt-3">
          {user !== null &&
            (user.admin || user.username === postValues.question.user) && (
              <Button
                className="mb-3"
                style={{ width: "80vw" }}
                onClick={handleDelete}>
                Delete question
              </Button>
            )}
          <div className="post-container bg-dark mb-3">
            <div>
              <h1 style={{ textAlign: "center" }}>
                {postValues.question.title}
              </h1>
              <p style={{ textAlign: "right" }}>{postValues.question.user}</p>
            </div>

            <div className="d-flex flex-row justify-content-center align-items-center">
              {user !== null && (
                <div
                  id="score-container"
                  className="d-flex flex-column text-center me-3">
                  <Button
                    variant="outline-primary"
                    style={{ fontSize: "32px" }}
                    onClick={handlePlusScore}>
                    +
                  </Button>
                  <h2>{postValues.question.score}</h2>
                  <Button
                    variant="outline-primary"
                    style={{ fontSize: "32px" }}
                    onClick={handleMinusScore}>
                    -
                  </Button>
                </div>
              )}
              {user === null && (
                <div
                  id="score-container"
                  className="d-flex flex-column text-center me-3">
                  <h2>{postValues.question.score}</h2>
                </div>
              )}
              <div className="post-container" style={{ width: "100%" }}>
                <p>{postValues.question.question}</p>
                {postValues.question.code !== null && (
                  <div style={{ width: "100%", padding: 0 }}>
                    <SyntaxHighlighter wrapLines="true" style={dark}>
                      {postValues.question.code}
                    </SyntaxHighlighter>
                  </div>
                )}
              </div>
            </div>
            <div className="d-flex flex-row justify-content-center align-items-end">
              <p className="ms-auto">Asked: {postValues.question.date}</p>
            </div>
          </div>
          <div className="post-container bg-dark">
            {postValues !== null && (
              <ul style={{ listStyle: "none" }}>
                {postValues.comments.map((comment) => (
                  <li
                    className="mb-3"
                    key={postValues.comments.indexOf(comment)}>
                    <Comment comment={comment} />
                  </li>
                ))}
              </ul>
            )}
            {user !== null && (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="comment">
                  <Form.Label>Add comment</Form.Label>
                  <Form.Control
                    type="text"
                    name="comment"
                    placeholder="Enter comment"
                    value={comment}
                    onChange={handleChange}
                  />
                </Form.Group>
                <p style={{ color: "#9e1316" }}>{formErrors.comment}</p>
                <Button className="mb-3" variant="primary" type="submit">
                  Post comment
                </Button>
              </Form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Post;
