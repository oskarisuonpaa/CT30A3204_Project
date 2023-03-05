import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";

const QuestionFormat = () => {
  const initValues = { title: "", question: "", code: "" };
  const [formValues, setFormValues] = useState(initValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // Used to allow tab indent within the textarea
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();

      const codeInput = document.getElementById("codeInput");

      codeInput.setRangeText(
        "    ",
        codeInput.selectionStart,
        codeInput.selectionStart,
        "end"
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
  };

  // Used to handle the submition of the form
  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      fetch("/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token"),
        },
        body: JSON.stringify({
          title: formValues.title,
          question: formValues.question,
          code: formValues.code,
        }),
      }).then((res) => {
        res.json().then((data) => {
          if (data.error) {
            console.log(data.error);
          } else {
            window.location.href = `http://localhost:3000/question/${data.question}`;
          }
        });
      });
    }
  }, [formErrors]);

  // Used to validate the form inputs
  const validate = (values) => {
    const errors = {};

    if (!values.title) {
      errors.title = "Title required!";
    }

    if (!values.question) {
      errors.question = "Question required!";
    }

    return errors;
  };

  return (
    <>
      <div className="d-flex justify-content-center aling-items-center text-center bg-dark post-container">
        <Form onSubmit={handleSubmit} className="w-100">
          <Form.Group className="mb-3" controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              placeholder="Enter question title"
              value={formValues.title}
              onChange={handleChange}
            />
            <p style={{ color: "#9e1316" }}>{formErrors.title}</p>
          </Form.Group>
          <Form.Group className="mb-3" controlId="question">
            <Form.Label>Question</Form.Label>
            <Form.Control
              type="text"
              as={"textarea"}
              name="question"
              rows={4}
              value={formValues.question}
              onChange={handleChange}></Form.Control>
            <p style={{ color: "#9e1316" }}>{formErrors.question}</p>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Code</Form.Label>
            <Form.Control
              id="codeInput"
              type="text"
              as={"textarea"}
              name="code"
              rows={4}
              value={formValues.code}
              onKeyDown={handleKeyDown}
              onChange={handleChange}></Form.Control>
          </Form.Group>
          <Button className="mb-3" variant="primary" type="submit">
            Post Question
          </Button>
        </Form>
      </div>
    </>
  );
};

export default QuestionFormat;
