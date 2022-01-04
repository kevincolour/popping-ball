import React from "react";
import Animated from "react-native-reanimated";

const Box = (props) => {
  const width = props.size[0];
  const height = props.size[1];
  const x = props.body.position.x - width / 2;
  const y = props.body.position.y - height / 2;
  const angle = props.body.angle;

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: width,
        height: height,
        transform: [{ rotate: angle + "rad" }],
        backgroundColor: props.color || "pink",
      }}
    />
  );
};

const Virus = (props) => {
  const width = props.size[0];
  const height = props.size[1];
  const x = props.body.position.x - width / 2;
  const y = props.body.position.y - height / 2;
  const angle = props.body.angle;

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: width,
        height: height,
        borderRadius: width,
        transform: [{ rotate: angle + "rad" }],
        backgroundColor: props.color || "pink",
      }}
    />
  );
};

const PlayerCircle = (props) => {
  const width = Math.sqrt(props.body.area / Math.PI) * 2;
  const height = width;
  const x = props.body.position.x - width / 2;
  const y = props.body.position.y - height / 2;

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: width,
        height: height,
        borderRadius: width,
        backgroundColor: "purple",
      }}
    />
  );
};

export { Box, Virus, PlayerCircle };
