import React, { useState, forceUpdate } from "react";
import { StatusBar, Dimensions, Button, View } from "react-native";
import { GameEngine } from "react-native-game-engine";
import {
  Physics,
  CreateBox,
  MoveBox,
  CleanBoxes,
  ControlVelocity,
  CreateBullet,
} from "./systems";
import { PlayerCircle } from "./renderers";
import Matter from "matter-js";

Matter.Resolver._restingThresh = 0.001;
Matter.Common.isElement = () => false; //-- Overriding this function because the original references HTMLElement
const { width, height } = Dimensions.get("window");

const RigidBodies = (props) => {
  const engine = Matter.Engine.create({ enableSleeping: false });
  engine.world.gravity.y = 0;
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

  const playerRadius = width / 16;
  const playerBody = Matter.Bodies.circle(width / 2, height / 2, playerRadius, {
    isStatic: true,
  });

  const constraint = Matter.Constraint.create({
    label: "Drag Constraint",
    pointA: { x: 0, y: 0 },
    pointB: { x: 0, y: 0 },
    length: 0.01,
    stiffness: 1,
    angularStiffness: 1,
  });

  Matter.World.add(world, [
    rightBarrier,
    leftBarrier,
    rightBarrier,
    topBarrier,
    floor,
    playerBody,
  ]);
  Matter.World.addConstraint(world, constraint);
  let createVirus = true;

  console.log("new run \n\n\n");

  return (
    <>
      <GameEngine
        systems={[Physics, CreateBox, CreateBullet, CleanBoxes]}
        entities={{
          physics: { engine: engine, world: world, constraint: constraint },
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
