import React from "react";
import { View, Image, Text } from "react-native";

import Animated from "react-native-reanimated";

const TimeScore = (props) => {
  const floatTime = parseInt(props.time);

  const second = (floatTime / 1000).toFixed(0);
  const millisecond = (floatTime / 1000).toFixed(3).toString().slice(-3);

  return (
    <View
      style={{
        position: "absolute",
        top: 10,
        right: 30,
        zIndex: 11,
        flex: 1,
        flexDirection: "row",
      }}
    >
      <View>
        <Text style={{ fontSize: 24 }}>{second}</Text>
      </View>
      <Text
        style={{
          position: "absolute",
          top: 25,
          fontSize: 12,
          left: 0,
        }}
      >
        {millisecond}
      </Text>
    </View>
  );
};
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
  // console.log(props);
  return (
    <Image
      source={props.image}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: width,
        height: height,
        // backgroundColor: "black",
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

export { Bullet, Virus, PlayerCircle, TimeScore };
