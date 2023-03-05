import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";

const Login = () => {
  const initValues = { username: "", password: "" };
  const [formValues, setFormValues] = useState(initValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const { setUser } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
  };

  //Used to handle the submitting of the form
  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      fetch("/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formValues.username,
          password: formValues.password,
        }),
      }).then((res) =>
        res.json().then((data) => {
          if (data.username) {
            const errors = {};
            errors.username = `${data.username}`;
            setFormErrors(errors);
          } else if (data.password) {
            const errors = {};
            errors.password = `${data.password}`;
            setFormErrors(errors);
          } else {
            setUser(data.user);
            sessionStorage.setItem("user", JSON.stringify(data.user));
            sessionStorage.setItem("token", data.token);
            window.location.replace("http://localhost:3000/");
          }
        })
      );
    }
  }, [formErrors]);

  // Used to validate the input fields
  const validate = (values) => {
    const errors = {};

    if (!values.username) {
      errors.username = "Username is required!";
    }

    if (!values.password) {
      errors.password = "Password is required!";
    }

    return errors;
  };

  return (
    <>
      <div className="d-flex justify-content-center aling-items-center text-center bg-dark form-container">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="Enter username"
              value={formValues.username}
              onChange={handleChange}
            />
            <p style={{ color: "#9e1316" }}>{formErrors.username}</p>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formValues.password}
              onChange={handleChange}
            />
            <p style={{ color: "#9e1316" }}>{formErrors.password}</p>
          </Form.Group>
          <Button className="mb-3" variant="primary" type="submit">
            Login
          </Button>
        </Form>
      </div>
    </>
  );
};

export default Login;
