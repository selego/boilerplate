import React, { useEffect, useState } from "react";
import { Container, Nav, NavItem, NavLink, TabContent, TabPane, FormGroup, Input, Label, Button, Row, Col } from "reactstrap";

import { useParams } from "react-router-dom";
import { Formik } from "formik";
import { toastr } from "react-redux-toastr";

import api from "../../services/api";

const S3PREFIX = "https://datadvise.s3.eu-west-3.amazonaws.com/app/users";

export default () => {
  const [activeTab, setActiveTab] = useState("1");
  const [user, setUser] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    (async () => {
      const { user: u } = await api.get(`/user/${id}`);
      setUser(u);
    })();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <Container style={{ padding: "40px 0" }}>
      <Nav tabs style={{ marginBottom: 30 }}>
        <NavItem>
          <NavLink style={{ backgroundColor: activeTab === "1" && "#eee" }} onClick={() => setActiveTab("1")}>
            View
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink style={{ backgroundColor: activeTab === "2" && "#eee" }} onClick={() => setActiveTab("2")}>
            Raw
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <Formik
            initialValues={user}
            onSubmit={async (values) => {
              try {
                await api.put(`/user?user_id=${user._id}`, values);
                toastr.success("Updated!");
              } catch (e) {
                console.log(e);
                toastr.error("Some Error!");
              }
            }}
          >
            {({ values, handleChange, handleSubmit }) => (
              <React.Fragment>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Name</Label>
                      <Input name="name" value={values.name} onChange={handleChange} />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Email</Label>
                      <Input name="email" value={values.email} onChange={handleChange} />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <ImageInput name="avatar" onChange={handleChange} title="Avatar" value={values.avatar} url={`${S3PREFIX}/${user._id}`} route={`/user`} />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Role</Label>
                      <Input type="select" name="role" value={values.role} onChange={handleChange}>
                        <option value="admin">Admin</option>
                        <option value="normal">Normal</option>
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
                <Button color="info" onClick={handleSubmit}>
                  Update
                </Button>
              </React.Fragment>
            )}
          </Formik>
        </TabPane>
        <TabPane tabId="2">
          <pre>
            {Object.keys(user).map((e) => (
              <div>
                <strong>{e}:</strong> {JSON.stringify(user[e])}
              </div>
            ))}
          </pre>
        </TabPane>
      </TabContent>
    </Container>
  );
};

const ImageInput = ({ title, value, url, route }) => {
  const [img, setImg] = useState(value);

  function handleChange(evt) {
    const files = evt.target.files;
    const file = files[0];
    let imgObject = new Image();
    let imgUrl = URL.createObjectURL(file);
    imgObject.src = imgUrl;
    imgObject.onload = async () => {
      try {
        const { user } = await api.putFormData(route, { avatar: `${url}/${file.name}` }, files);
        toastr.success("sucess");
        setImg(user.avatar);
      } catch (e) {
        toastr.success(e.code);
        console.log(e);
      }
    };
  }

  return (
    <Label>
      <div>{title}</div>
      {img ? <img src={img} style={{ width: "200px", objectFit: "contain" }} /> : <div className="image-input" />}
      <input accept=".gif,.jpg,.jpeg,.png" hidden type="file" onChange={handleChange} />
    </Label>
  );
};
