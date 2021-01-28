import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider, useMutation } from "react-apollo";
import { render } from "react-dom";
import {
  AppHeader,
  Home,
  Host,
  Listing,
  Listings,
  Login,
  NotFound,
  Stripe,
  User,
} from "./sections";
import { LOG_IN } from "./lib/graphql/mutations";
import {
  LogIn as LogInData,
  LogInVariables,
} from "./lib/graphql/mutations/LogIn/__generated__/LogIn";
import { Viewer } from "./lib/types";
import { AppHeaderSkeleton, ErrorBanner } from "./lib/components";
import { Affix, Layout, Spin } from "antd";
import { StripeProvider, Elements } from "react-stripe-elements";
import reportWebVitals from "./reportWebVitals";
import "./styles/index.css";

const client = new ApolloClient({
  uri: "/api",
  request: async (operation) => {
    const token = sessionStorage.getItem("token");
    operation.setContext({
      headers: {
        "X-CSRF-TOKEN": token || "",
      },
    });
  },
});

const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false,
};

const App = () => {
  const [viewer, setViewer] = useState<Viewer>(initialViewer);
  console.log(viewer);
  const [logIn, { error }] = useMutation<LogInData, LogInVariables>(LOG_IN, {
    onCompleted: (data) => {
      if (data && data.logIn) {
        setViewer(data.logIn);

        if (data.logIn.token) {
          sessionStorage.setItem("token", data.logIn.token);
        } else {
          sessionStorage.removeItem("token");
        }
      }
    },
  });

  const logInRef = useRef(logIn);

  useEffect(() => {
    logInRef.current();
  }, []);

  if (!viewer.didRequest && !error) {
    return (
      <Layout className="app-skeleton">
        <AppHeaderSkeleton />
        <div className="app-skeleton__spin-section">
          <Spin size="large" tip="Loading RyanBnB..." />
        </div>
      </Layout>
    );
  }

  const logInErrorBannerElement = error ? (
    <ErrorBanner description="We weren't able to verify if you were previously logged in. Please try again later!" />
  ) : null;

  return (
    <Layout id="app">
      {logInErrorBannerElement}
      <Affix offsetTop={0} className="app__affix-header">
        <AppHeader viewer={viewer} setViewer={setViewer} />
      </Affix>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route
          exact
          path="/host"
          render={(props) => <Host {...props} viewer={viewer} />}
        />
        <Route
          exact
          path="/listing/:id"
          render={(props) => (
            <Elements>
              <Listing {...props} viewer={viewer} />
            </Elements>
          )}
        />
        <Route exact path="/listings/:location?" component={Listings} />
        <Route
          exact
          path="/login"
          render={(props) => <Login {...props} setViewer={setViewer} />}
        />
        <Route
          exact
          path="/stripe"
          render={(props) => (
            <Stripe {...props} viewer={viewer} setViewer={setViewer} />
          )}
        />
        <Route
          exact
          path="/user/:id"
          render={(props) => (
            <User {...props} viewer={viewer} setViewer={setViewer} />
          )}
        />
        <Route exact component={NotFound} />
      </Switch>
    </Layout>
  );
};

render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <StripeProvider apiKey="pk_test_51IDYu2DPA2EfKp5HBJs9fogpxFDAAK37GNXSms7MIoiWrnMHzqsEMbQ6wVtpjndzDl5grVNFZM6MTbvzqZP3MHAL00977fzMru">
        <App />
      </StripeProvider>
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
