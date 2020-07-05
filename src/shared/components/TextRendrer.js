import React from "react";
import { isNil } from "lodash";

const TextRendrer = props => {
  if (!isNil(props.text)) {
    return (
      <p
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxHeight: "20px"
        }}
      >
        {props.text.length > 20
          ? props.text.slice(0, 20).concat("...")
          : props.text}
      </p>
    );
  } else {
    return <p></p>;
  }
};

export default TextRendrer;
