import React, { useState, useEffect } from "react";
import { GET_LIST, showNotification, withDataProvider } from "react-admin";
import { User } from "../../core/model";
import SelectArrayInput from "./CustomArraySelector";

const UserSelector = ({ dataProvider, dispatch, ...rest }: any) => {
  const [managers, setManagers] = useState<User[]>([]);

  useEffect(() => {
    dataProvider(GET_LIST, "users")
      .then(({ data }: any) => {
        setManagers(data);
      })
      .catch((e) => {
        console.error("Error: ", e);
        dispatch(showNotification("Error: Get user list error", "warning"));
      });
  }, []);

  return (
    <SelectArrayInput
      label="Users"
      source={"managers"}
      choices={managers.map((u) => ({
        ...u,
        manager: { username: u.username, user: u.id, is_admin: true },
      }))}
      style={{ minWidth: "60%" }}
      optionText="username"
      optionValue="manager"
      {...rest}
    />
  );
};

export const ManagerSelector = withDataProvider(UserSelector);
