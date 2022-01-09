import React, { useState, forceUpdate, useEffect } from "react";
import {
  StatusBar,
  Dimensions,
  Button,
  View,
  ImageBackground,
  Text,
} from "react-native";
import { GameEngine } from "react-native-game-engine";
import {
  Physics,
  CreateBox,
  CleanBoxes,
  CreateBullet,
  CreateCollission,
  Timer,
} from "./systems";
import { PlayerCircle, TimeScore } from "./renderers";
import Matter from "matter-js";
import { useAssets, Asset } from "expo-asset";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 24;
Matter.Resolver._restingThresh = 0.001;
Matter.Common.isElement = () => false; //-- Overriding this function because the original references HTMLElement
const { width, height } = Dimensions.get("window");

const Async = async (props) => {
  const value = await AsyncStorage.getItem("@highscore");
  console.log(value);
};

const RigidBodies = (props) => {
  // const [assets, error] = useAssets([
  //   require("./assets/8Ball.gif"),
  //   require("./assets/4Ball.gif"),
  // ]);
  // console.log(error, assets);
  const [highScore, setHighScore] = useState("");

  const engine = Matter.Engine.create({ enableSleeping: false });
  engine.world.gravity.y = 0;
  ``;
  const world = engine.world;

  const barrierOptions = { collisionFilter: { group: -1 }, isStatic: true };

  const floor = Matter.Bodies.rectangle(width / 2, height, width, 1, {
    ...barrierOptions,
  });
  const topBarrier = Matter.Bodies.rectangle(width / 2, 0, width, 1, {
    ...barrierOptions,
  });
  const leftBarrier = Matter.Bodies.rectangle(0, height / 2, 1, height, {
    ...barrierOptions,
  });
  const rightBarrier = Matter.Bodies.rectangle(width, height / 2, 1, height, {
    ...barrierOptions,
  });

  const playerRadius = Math.trunc(Math.max(width, height) / 32);
  const playerBody = Matter.Bodies.circle(width / 2, height / 2, playerRadius, {
    ...barrierOptions,
    label: "playerCircle",
  });

  let image = require("./assets/background2.jpg");

  Matter.World.add(world, [
    leftBarrier,
    rightBarrier,
    topBarrier,
    floor,
    playerBody,
  ]);
  let createCollissionHandler = true;
  console.log("new run \n\n\n");

  useEffect(() => {
    async function getHighscore() {
      const highscore = await AsyncStorage.getItem("@highscore");
      // console.log(highscore);
      setHighScore(highscore);
    }
    getHighscore();
  }, []);

  const newScoreProcess = async (score) => {
    const highscore = await AsyncStorage.getItem("@highscore");
    if (parseInt(highscore) < parseInt(score)) {
      await AsyncStorage.setItem("@highscore", score);
    }
    props.restartFunc();
  };
  return (
    <>
      <View
        style={{
          position: "absolute",
          flex: 1,
          zIndex: 10,
          right: 100,
        }}
      >
        <TimeScore time={highScore}></TimeScore>
      </View>
      <ImageBackground source={image} style={{ flex: 1 }}>
        <GameEngine
          systems={[
            Physics,
            CreateBullet,
            CreateBox,
            CleanBoxes,
            CreateCollission,
            Timer,
          ]}
          entities={{
            physics: { engine: engine, world: world },
            createVirus: true,
            playerBody: {
              body: playerBody,
              renderer: PlayerCircle,
            },
            dataObj: {},
            dataCallbacks: { newScoreProcess: newScoreProcess },
            images: props.images,
            createCollissionHandler: createCollissionHandler,
            timer: 0,
            velocity: { x: 1, y: 1 },
          }}
        >
          <StatusBar hidden={true} />
        </GameEngine>
      </ImageBackground>
    </>
  );
};

export default RigidBodies;
