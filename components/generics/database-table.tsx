import React from "react";

export default function DatabaseTable(props: {
  ListItems: JSX.Element;
  NewItem: JSX.Element;
  EditItem: JSX.Element;
  view: "list" | "new" | "edit";
}) {
  switch (props.view) {
    case "list":
      return <div>{props.ListItems}</div>;
    case "new":
      return <div>{props.NewItem}</div>;
    case "edit":
      return <div>{props.EditItem}</div>;
  }
}
