import React, { useEffect, useState } from "react";
import { Container, FormGroup, Input, Label, Button, Row, Col } from "reactstrap";
import { useSelector } from "react-redux";
import { Formik } from "formik";
import { toastr } from "react-redux-toastr";

import api from "../services/api";
import LoadingButton from "../components/loadingButton";
import Header from "../components/header";

import { S3PREFIX } from "../config";

const UPLAOD_URL = `${S3PREFIX}/users`;

export default () => {
  const user = useSelector((state) => state.Auth.user);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <Header title={user.name} />
      <Container style={{ padding: "40px 0" }}>
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
          {({ values, handleChange, handleSubmit, isSubmitting }) => (
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
                    <Input disabled name="email" value={values.email} onChange={handleChange} />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <ImageInput
                      name="avatar"
                      onChange={handleChange}
                      title="Avatar"
                      value={values.avatar}
                      url={`${UPLAOD_URL}/${user._id}`}
                      route={`/user/image?user_id=${user._id}`}
                    />
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
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <LoadingButton loading={isSubmitting} color="info" onClick={handleSubmit}>
                  Update
                </LoadingButton>
              </div>
            </React.Fragment>
          )}
        </Formik>
      </Container>
    </div>
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
