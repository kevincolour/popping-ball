import { Bullet, Virus } from "./renderers";
import Matter from "matter-js";
import { Dimensions } from "react-native";
import * as Haptics from "expo-haptics";
import { useState } from "react";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

let boxIds = 0;
let virusID = 0;
const MAX_INDEX = 4;

const Physics = (state, { touches, time }) => {
  let engine = state["physics"].engine;

  Matter.Engine.update(engine, time.delta);

  return state;
};

const handleCollision = (state, world, virusBody, bulletBody) => {
  console.log("Collision");

  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  Matter.World.remove(world, virusBody);
  Matter.World.remove(world, bulletBody);
  delete state[virusBody.id];
  delete state[bulletBody.id];
  let virusSizeHalved = Math.sqrt(virusBody.area) / 2;
  // virusBody.

  let virusIndex = parseInt(virusBody.label.split("_")[1]) + 1;

  if (virusIndex == MAX_INDEX) {
    return;
  }

  let newBodyOptions = {
    frictionAir: 0,
    friction: 0,
    frictionStatic: 0,
    restitution: 1,
    inertia: Infinity,
    inverseInertia: 0,
    label: "Virus_" + virusIndex,
    mass: 1,
    inverseMass: 1,
  };

  let body = Matter.Bodies.rectangle(
    0 + virusBody.position.x,
    0 + virusBody.position.y,
    virusSizeHalved,
    virusSizeHalved,
    newBodyOptions
  );

  let copy = Matter.Bodies.rectangle(
    0 + virusBody.position.x,
    0 + virusBody.position.y + virusSizeHalved * 2,
    virusSizeHalved,
    virusSizeHalved,
    newBodyOptions
  );

  Matter.Body.setVelocity(body, { x: -1, y: -1 });
  Matter.Body.setVelocity(copy, { x: 1, y: 1 });

  Matter.World.add(world, [body, copy]);

  state[body.id] = {
    body: body,
    size: [virusSizeHalved, virusSizeHalved],
    color: boxIds % 2 == 0 ? "red" : "#B8E986",
    image: state["images"][virusIndex],

    renderer: Virus,
  };
  state[copy.id] = {
    body: copy,
    size: [virusSizeHalved, virusSizeHalved],
    color: boxIds % 2 == 0 ? "red" : "#B8E986",
    image: state["images"][virusIndex],
    renderer: Virus,
  };
};

const CreateCollission = (state, { screen }) => {
  let world = state["physics"].world;
  let engine = state["physics"].engine;
  if (state["createCollissionHandler"]) {
    Matter.Events.on(engine, "collisionStart", (event) => {
      // console.log(event.pairs.length, "eventPairs");
      event.pairs.map((ele) => {
        // console.log(ele);
        let bothBodies = [ele.bodyA, ele.bodyB];
        let virusBody = bothBodies.find(
          (ele) => ele.label.indexOf("Virus") > -1
        );
        let bulletBody = bothBodies.find((ele) => ele.label == "bullet");

        if (virusBody && bulletBody) {
          handleCollision(state, world, virusBody, bulletBody);
        }
        let playerBody = bothBodies.find((ele) => ele.label == "playerCircle");
        if (virusBody && playerBody) {
          let restartFunc = state["restart"];
          restartFunc();
          //explode
        }

        let staticEle = ele.activeContacts.map((eleContact) => {
          // console.log(eleContact.vertex.body.label);
          // console.log(eleContact);
        });
        if (staticEle.length > 0) {
          return;
        }
      });
    });
    state["createCollissionHandler"] = false;
  }
  return state;
};

const CreateBox = (state, { touches, screen, time }) => {
  let world = state["physics"].world;
  let engine = state["physics"].engine;

  if (state["createVirus"]) {
    const virusSize =
      Math.trunc(Math.max(screen.width, screen.height) * 0.075) * 2;

    let body = Matter.Bodies.rectangle(
      0 + Math.random() * (screen.width - virusSize / 2) + virusSize / 2,
      0 + virusSize / 2,
      virusSize,
      virusSize,
      {
        frictionAir: 0,
        friction: 0,
        frictionStatic: 0,
        restitution: 1,
        label: "Virus_0",
        mass: 1,
        inverseMass: 1,
      }
    );
    Matter.Body.setVelocity(body, {
      x: 1,
      y: 1,
    });

    // Matter.Body.applyForce(body, { x: 3, y: 3 }, { x: 3, y: 3 });
    Matter.World.add(world, [body]);

    state[body.id] = {
      body: body,
      size: [virusSize, virusSize],
      color: boxIds % 2 == 0 ? "red" : "#B8E986",
      image: state["images"][0],
      renderer: Virus,
    };
    state["createVirus"] = false;
  }

  return state;
};

const roundToArray = (roundValues, goal) => {
  return roundValues.reduce(function (prev, curr) {
    return Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev;
  });
};

const distance = ([x1, y1], [x2, y2]) =>
  Math.sqrt(Math.abs(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));

const CreateBullet = (state, { touches, screen }) => {
  const boxSize = Math.trunc(Math.max(screen.width, screen.height) * 0.075) / 4;
  let world = state["physics"].world;
  //-- Handle start touch
  let end = touches.find((x) => x.type === "end");
  let move = touches.find((x) => x.type === "move");
  touches.map((ele) => console.log(ele.type));
  if (end && move) {
    let body = Matter.Bodies.circle(
      screen.width / 2,
      screen.height / 2,
      boxSize / 2,
      {
        frictionAir: 0,
        restitution: 1,
        label: "bullet",
        collisionFilter: { group: -1 },
      }
    );
    Matter.World.add(world, [body]);

    state[body.id] = {
      body: body,
      size: [boxSize, boxSize],
      color: boxIds % 2 == 0 ? "red" : "#B8E986",
      renderer: Bullet,
    };

    const roundValues = [4, 10, 20];

    let distanceVal = Math.abs(
      distance([0, 0], [move.delta.pageX, move.delta.pageY])
    );
    let distanceRounded = roundToArray(roundValues, distanceVal);

    let multiplier = distanceRounded / distanceVal;

    Matter.Body.setVelocity(body, {
      x: move.delta.pageX * multiplier,
      y: move.delta.pageY * multiplier,
    });
  }

  return state;
};

const CleanBoxes = (state, { touches, screen }) => {
  let world = state["physics"].world;

  Object.keys(state)
    .filter(
      (key) =>
        state[key].body &&
        (state[key].body.position.y > screen.height * 1.25 ||
          state[key].body.position.y < 0 ||
          state[key].body.position.x < 0 ||
          state[key].body.position.x > screen.width * 1.25)
    )
    .forEach((key) => {
      Matter.Composite.remove(world, state[key].body);
      delete state[key];
    });

  return state;
};

const ControlVelocity = (state, { touches, screen }) => {
  let world = state["physics"].world;

  Object.keys(state)
    .filter((key) => state[key].body)
    .forEach((key) => {
      //   Matter.Body.setVelocity(state[key].body, {
      //     x: state[key].body.velocity.x,
      //     y: state[key].body.velocity.y,
      //   });
    });

  return state;
};
const Timer = (state, { time }) => {
  let timeMSprev = parseInt(state["timer"]);
  let timeSecondPrev = Math.ceil(timeMSprev / 1000);

  state["timer"] += time.delta;
  let timeMS = parseInt(state["timer"]);

  let timeSecond = Math.ceil(timeMS / 1000);

  console.log(timeSecond);
  if (timeSecond % 10 == 0 && timeSecondPrev & (10 != 0)) {
    state["createVirus"] = true;
  }
  return state;
};

export {
  Physics,
  CreateBox,
  CleanBoxes,
  ControlVelocity,
  CreateBullet,
  CreateCollission,
  Timer,
};
