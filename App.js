import React, { Component } from "react";
import { View, Modal, Image } from "react-native";
import CloseButton from "./app/table-of-contents/closeButton";
import EStyleSheet from "react-native-extended-stylesheet";

import TableOfContents from "./app/table-of-contents";
import RigidBodies from "./app/physics/rigid-bodies";
import OpenGLChapter from "./app/opengl";

EStyleSheet.build();

//-- There is a bunch of warnings about the use of deprecated lifecycle methods. A lot of them are caused
//-- by dependencies. Comment out the line below to see the warnings.
console.disableYellowBox = true;

export default class App extends Component {
  constructor(props) {
    super(props);
    let image = require("./assets/8Ball.gif");
    let imageBall4 = require("./assets/4Ball.gif");
    let images = [image, imageBall4];
    const scene = <RigidBodies images={images} />;
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

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.sceneVisible}
          onRequestClose={(_) => {}}
        >
          {this.state.scene}

          <CloseButton
            onPress={() => {
              this.unMountScene();
              this.mountScene();
            }}
          />
        </Modal>
      </View>
    );
  }
}
