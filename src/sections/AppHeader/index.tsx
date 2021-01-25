import React, { useState, useEffect } from "react";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import { Input, Layout } from "antd";
import { Viewer } from "../../lib/types";
import { displayErrorMessage } from "../../lib/utils";
import { MenuItems } from "./components";

import logo from "./assets/tinyhouse-logo.png";

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

const { Header } = Layout;
const { Search } = Input;

export const AppHeader = withRouter(
  ({ viewer, setViewer, location, history }: Props & RouteComponentProps) => {
    const [search, setSearch] = useState("");

    useEffect(() => {
      const { pathname } = location;
      const splitPathname = pathname.split("/");

      if (!pathname.includes("/listings")) {
        setSearch("");
        return;
      }

      if (pathname.includes("/listings") && splitPathname.length === 3) {
        setSearch(splitPathname[2]);
      }
    }, [location]);

    const onSearch = (value: string) => {
      const trimmedValue = value.trim();

      if (trimmedValue) {
        history.push(`/listings/${trimmedValue}`);
      } else {
        displayErrorMessage("Please enter a valid search term!");
      }
    };

    return (
      <Header className="app-header">
        <div className="app-header__logo-search-section">
          <div className="app-header__logo">
            <Link to="/">
              <img src={logo} alt="App logo" />
            </Link>
          </div>
          <div className="app-header__search-input">
            <Search
              placeholder="Search 'San Francisco'"
              enterButton
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onSearch={onSearch}
            />
          </div>
        </div>
        <div className="app-header__menu-section">
          <MenuItems viewer={viewer} setViewer={setViewer} />
        </div>
      </Header>
    );
  }
);
