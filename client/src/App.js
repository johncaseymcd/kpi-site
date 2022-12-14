import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import { Button, Container, Card, Row } from "react-bootstrap";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setMemberName: "",
      setMemberBirthday: "",
      fetchData: [],
      memberUpdate: "",
    };
  }

  handleChange = event => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({
      [name]: value,
    });
  };

  handleChange2 = event => {
    this.setState({
      memberUpdate: event.target.value,
    });
  };

  componentDidMount() {
    axios.get("/api/members").then(response => {
      this.setState({
        fetchData: response.data,
      });
    });
  }

  submit = () => {
    axios.post("/api/members/new", this.state).then(() => {
      alert("success post");
    });

    console.log(this.state);
    document.location.reload();
  };

  delete = memberId => {
    // eslint-disable-next-line no-restricted-globals
    const confirmed = confirm("Are you sure you want to remove this member?");

    if (confirmed) {
      axios.delete(`/api/members/delete/${memberId}`);
      document.location.reload();
    }
  };

  edit = memberId => {
    axios.put(`/api/update/${memberId}`, this.state);
    document.location.reload();
  };

  render() {
    let card = this.state.fetchData.map((val, key) => {
      return (
        <React.Fragment>
          <Card
            style={{ width: "18rem" }}
            className="m-2"
          >
            <Card.Body>
              <Card.Title>{val.memberName}</Card.Title>
              <Card.Text>{val.memberBirthday}</Card.Text>

              <input
                name="memberUpdate"
                onChange={this.handleChange2}
                placeholder="Update Member"
              ></input>
              <Button
                className="m-2"
                onClick={() => {
                  this.edit(val.memberId);
                }}
              >
                Update
              </Button>
              <Button
                onClick={() => {
                  this.delete(val.memberId);
                }}
              >
                Delete
              </Button>
            </Card.Body>
          </Card>
        </React.Fragment>
      );
    });

    return (
      <div className="App">
        <h1>KPop Indiana - Members</h1>
        <div className="form">
          <input
            name="setMemberName"
            placeholder="Enter Member's Name"
            onChange={this.handleChange}
          />
          <input
            name="setMemberBirthday"
            placeholder="Enter Member's Birthday"
            onChange={this.handleChange}
          />
        </div>
        <Button
          className="my-2"
          variant="primary"
          onClick={this.submit}
        >
          Submit
        </Button>{" "}
        <br />
        <br />
        <Container>
          <Row>{card}</Row>
        </Container>
      </div>
    );
  }
}

export default App;
