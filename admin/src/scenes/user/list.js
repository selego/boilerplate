import React, { useEffect, useState } from "react";
import { Container, Table } from "reactstrap";
import { useHistory } from "react-router-dom";

import api from "../../services/api";

import Header from "../../components/header";

export default () => {
  const [users, setUsers] = useState(null);
  const history = useHistory();

  useEffect(() => {
    (async () => {
      const { users: u } = await api.get("/user");
      setUsers(u);
    })();
  }, []);

  if (!users) return <div>loading...</div>;

  return (
    <div>
      <Header title="Users" />
      <Container style={{ padding: "40px 0" }}>
        <Table hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Last Login</th>
            </tr>
          </thead>
          <tbody>
            {users.map(({ _id, name, email, last_login_at, role }) => {
              return (
                <tr onClick={() => history.push(`/admin/user/${_id}`)}>
                  <td>{name}</td>
                  <td>{email}</td>
                  <td>{role}</td>
                  <td>{(last_login_at || "").slice(0, 10)}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};
