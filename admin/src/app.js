import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import * as Sentry from "@sentry/browser";

import { setUser } from "./redux/auth/actions";

import Account from "./scenes/account";
import Auth from "./scenes/auth";
import User from "./scenes/user";
import Drawer from "./components/drawer";

import Header from "./components/header";

import api from "./services/api";

import { SENTRY_URL } from "./config";

import "./index.less";

if (process.env.NODE_ENV === "production") SENTRY_URL && Sentry.init({ dsn: SENTRY_URL, environment: "app" });

export default () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.Auth.user);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get("/user/me");
        if (!res.ok || !res.user) return setLoading(false);
        dispatch(setUser(res.user));
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <Router>
        <div className="main">
          {user && <Drawer />}
          {user && <Header />}
          <div className="screen-container">
            <Switch>
              <Route path="/auth" component={Auth} />
              <RestrictedRoute path="/account" component={Account} />
              <RestrictedRoute path="/" component={User} />
            </Switch>
          </div>
        </div>
      </Router>
    </div>
  );
};

const RestrictedRoute = ({ component: Component, isLoggedIn, ...rest }) => {
  const user = useSelector((state) => state.Auth.user);
  return <Route {...rest} render={(props) => (user ? <Component {...props} /> : <Redirect to={{ pathname: "/auth" }} />)} />;
};
