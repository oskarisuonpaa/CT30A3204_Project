import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";

const Register = () => {
  const initValues = { username: "", password1: "", password2: "" };
  const [formValues, setFormValues] = useState(initValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
  };

  // Used to handle the submition of the form
  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      fetch("/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formValues.username,
          password: formValues.password1,
        }),
      }).then((res) => {
        res.json().then((data) => {
          if (data.error) {
            const errors = {};
            errors.username = `${data.error}`;
            setFormErrors(errors);
          } else {
            window.location.replace("http://localhost:3000/login");
          }
        });
      });
    }
  }, [formErrors]);

  // Used to validate the input values
  const validate = (values) => {
    const errors = {};
    const passwordStrengthRegex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{8,}$/;

    if (!values.username) {
      errors.username = "Username is required!";
    }

    if (!values.password1) {
      errors.password1 = "Password is required!";
    } else if (!passwordStrengthRegex.test(values.password1)) {
      errors.password1 =
        "Password should be at least 8 characters long and have at least one uppercase character, special character and number.";
    }

    if (!values.password2) {
      errors.password2 = "Confirm password is required!";
    }

    if (values.password1 !== values.password2) {
      errors.password2 = "Passwords do not match!";
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
              name="password1"
              placeholder="Enter Password"
              value={formValues.password1}
              onChange={handleChange}
            />
            <p style={{ color: "#9e1316" }}>{formErrors.password1}</p>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="password2"
              placeholder="Enter Password"
              value={formValues.password2}
              onChange={handleChange}
            />
            <p style={{ color: "#9e1316" }}>{formErrors.password2}</p>
          </Form.Group>
          <Button className="mb-3" variant="primary" type="submit">
            Register
          </Button>
        </Form>
      </div>
    </>
  );
};

export default Register;
