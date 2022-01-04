import React from "react";
import { View, Image } from "react-native";

import Animated from "react-native-reanimated";

const Bullet = (props) => {
  const width = props.size[0];
  const height = props.size[1];
  const x = props.body.position.x - width / 2;
  const y = props.body.position.y - height / 2;

  return (
    <View
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: width,
        borderRadius: width,
        height: height,
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

  return (
    <Image
      source={require("./assets/8Ballv2.gif")}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: width,
        height: height,
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
    <Image
      source={require("./assets/homeVirus.gif")}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: width,
        height: height,
        borderRadius: width,
        // backgroundColor: "purple",
      }}
    />
  );
};

export { Bullet, Virus, PlayerCircle };
