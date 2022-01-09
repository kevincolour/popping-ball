import React, { Component } from "react";
import { View, Modal, Image, Text } from "react-native";
import CloseButton from "./app/table-of-contents/closeButton";
import EStyleSheet from "react-native-extended-stylesheet";

import TableOfContents from "./app/table-of-contents";
import RigidBodies from "./app/physics/rigid-bodies";
import OpenGLChapter from "./app/opengl";
import AsyncStorage from "@react-native-async-storage/async-storage";
EStyleSheet.build();

//-- There is a bunch of warnings about the use of deprecated lifecycle methods. A lot of them are caused
//-- by dependencies. Comment out the line below to see the warnings.
console.disableYellowBox = true;

// const HighScore = async (props) => {
//   const highScore = await getData();
//   console.log(highScore);
//   return (
//     <View style={{ position: "absolute", flex: 1 }}>
//       <Text>{highScore ? highScore : ""}</Text>
//     </View>
//   );
// };

export default class App extends Component {
  constructor(props) {
    super(props);
    let image = require("./assets/8Ball.gif");
    let imageBall4 = require("./assets/4Ball.gif");
    let imageBall2 = require("./assets/2Ball.gif");
    let imageBall1 = require("./assets/1Ball.jpg");
    let images = [image, imageBall4, imageBall2, imageBall1];
    const scene = (
      <RigidBodies restartFunc={this.restartScene} images={images} />
    );
    this.state = {
      sceneVisible: true,
      scene: scene,
      oldScene: scene,
    };
  }

  mountScene = (scene) => {
    this.setState({
      sceneVisible: true,
      scene: this.state.oldScene,
    });
  };

  unMountScene = () => {
    this.setState({
      sceneVisible: false,
      scene: null,
    });
  };
  restartScene = async () => {
    // storeData(time);
    // getData();
    this.unMountScene();
    this.mountScene();
  };

  render() {
    return (
      <>
        {/* <HighScore /> */}
        <View style={{ flex: 1 }}>
          {this.state.scene}

          <CloseButton onPress={this.restartScene} />
        </View>
      </>
    );
  }
}
