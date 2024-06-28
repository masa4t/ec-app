import React from "react";
import "./loading.scss";

type LoadingProps = {
  style?: React.CSSProperties;
};

const Loading = ({ style }: LoadingProps) => {
  return <div className="load" style={style}></div>;
};

export default Loading;
