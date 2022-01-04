import React, { useState, forceUpdate } from "react";
import { StatusBar, Dimensions, Button, View } from "react-native";
import { GameEngine } from "react-native-game-engine";
import { Physics, CreateBox, CleanBoxes, CreateBullet } from "./systems";
import { PlayerCircle } from "./renderers";
import Matter from "matter-js";

const SCREEN_HEIGHT = Dimensions.get("screen").height;
const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 24;
const SCREEN_WIDTH = Dimensions.get("screen").width - STATUS_BAR_HEIGHT;
// Matter.Resolver._restingThresh = 0.001;
Matter.Common.isElement = () => false; //-- Overriding this function because the original references HTMLElement
const { width, height } = Dimensions.get("window");

const RigidBodies = (props) => {
  const engine = Matter.Engine.create({ enableSleeping: false });
  engine.world.gravity.y = 0;
  const world = engine.world;

  const barrierOptions = { collisionFilter: { group: -1 }, isStatic: true };

  const floor = Matter.Bodies.rectangle(
    SCREEN_WIDTH / 2,
    height,
    SCREEN_WIDTH,
    1,
    {
      ...barrierOptions,
    }
  );
  const topBarrier = Matter.Bodies.rectangle(
    SCREEN_WIDTH / 2,
    0,
    SCREEN_WIDTH,
    1,
    {
      ...barrierOptions,
    }
  );
  const leftBarrier = Matter.Bodies.rectangle(0, height / 2, 1, height, {
    ...barrierOptions,
  });
  const rightBarrier = Matter.Bodies.rectangle(
    SCREEN_WIDTH,
    height / 2,
    1,
    height,
    {
      ...barrierOptions,
    }
  );

  const playerRadius = width / 16;
  const playerBody = Matter.Bodies.circle(width / 2, height / 2, playerRadius, {
    ...barrierOptions,
  });

  Matter.World.add(world, [
    leftBarrier,
    rightBarrier,
    topBarrier,
    floor,
    playerBody,
  ]);
  let createVirus = true;

  console.log("new run \n\n\n");

  return (
    <>
      <GameEngine
        systems={[Physics, CreateBullet, CreateBox, CleanBoxes]}
        entities={{
          physics: { engine: engine, world: world },
          createVirus: createVirus,
          playerBody: {
            body: playerBody,
            renderer: PlayerCircle,
          },
        }}
      >
        <StatusBar hidden={true} />
      </GameEngine>
    </>
  );
};

export default RigidBodies;
