import React from "react";
import { StatusBar, Dimensions } from "react-native";
import { GameEngine } from "react-native-game-engine";
import { Physics, CreateBox, MoveBox, CleanBoxes } from "./systems";
import { Box } from "./renderers";
import Matter from "matter-js";

Matter.Common.isElement = () => false; //-- Overriding this function because the original references HTMLElement

const RigidBodies = (props) => {
  const { width, height } = Dimensions.get("window");
  const boxSize = Math.trunc(Math.max(width, height) * 0.075);

  const engine = Matter.Engine.create({ enableSleeping: false });
  engine.world.gravity.y = 0;
  const world = engine.world;
  const body = Matter.Bodies.rectangle(width / 2, -1000, boxSize, boxSize, {
    frictionAir: 0.021,
  });
  const floor = Matter.Bodies.rectangle(
    width / 2,
    height - boxSize / 2,
    width,
    boxSize,
    { isStatic: true }
  );
  const topBarrier = Matter.Bodies.rectangle(width / 2, 0, width, boxSize, {
    isStatic: true,
  });
  const leftBarrier = Matter.Bodies.rectangle(0, height / 2, boxSize, height, {
    isStatic: true,
  });
  const rightBarrier = Matter.Bodies.rectangle(
    width,
    height / 2,
    boxSize,
    height,
    {
      isStatic: true,
    }
  );

  const constraint = Matter.Constraint.create({
    label: "Drag Constraint",
    pointA: { x: 0, y: 0 },
    pointB: { x: 0, y: 0 },
    length: 0.01,
    stiffness: 1,
    angularStiffness: 1,
  });

  Matter.World.add(world, [body, floor]);
  Matter.World.add(world, [body, topBarrier]);
  Matter.World.add(world, [body, leftBarrier]);
  Matter.World.add(world, [body, rightBarrier]);
  Matter.World.addConstraint(world, constraint);

  return (
    <GameEngine
      systems={[Physics, CreateBox, MoveBox, CleanBoxes]}
      entities={{
        physics: { engine: engine, world: world, constraint: constraint },
        box: {
          body: body,
          size: [boxSize, boxSize],
          color: "pink",
          renderer: Box,
        },
        floor: {
          body: floor,
          size: [width, boxSize],
          color: "#86E9BE",
          renderer: Box,
        },
        top: {
          body: topBarrier,
          size: [width, boxSize],
          color: "pink",
          renderer: Box,
        },
        left: {
          body: leftBarrier,
          size: [boxSize, height],
          color: "pink",
          renderer: Box,
        },
        right: {
          body: rightBarrier,
          size: [boxSize, height],
          color: "pink",
          renderer: Box,
        },
      }}
    >
      <StatusBar hidden={true} />
    </GameEngine>
  );
};

export default RigidBodies;
