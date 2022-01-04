import { Box, Virus } from "./renderers";
import Matter from "matter-js";
import { Dimensions } from "react-native";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

let boxIds = 0;
let virusID = 0;
const distance = ([x1, y1], [x2, y2]) =>
  Math.sqrt(Math.abs(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));

const Physics = (state, { touches, time }) => {
  let engine = state["physics"].engine;

  Matter.Engine.update(engine, time.delta);

  return state;
};

const handleCollision = (state, world, virusBody, bulletBody) => {
  console.log("Collision");
  Matter.World.remove(world, virusBody);
  Matter.World.remove(world, bulletBody);
  delete state[virusBody.id];
  delete state[bulletBody.id];
  let virusSize = Math.sqrt(virusBody.area / Math.PI) / 2;
  // virusBody.
  let newBodyOptions = {
    frictionAir: 0,
    friction: 0,
    frictionStatic: 0,
    restitution: 1,
    inertia: Infinity,
    inverseInertia: 0,
    label: "Virus",
    mass: 1,
    inverseMass: 1,
  };
  let body = Matter.Bodies.circle(
    0 + virusBody.position.x,
    0 + virusBody.position.y,
    virusSize,
    newBodyOptions
  );

  let copy = Matter.Bodies.circle(
    0 + virusBody.position.x,
    0 + virusBody.position.y + virusSize * 2,
    virusSize,
    newBodyOptions
  );

  Matter.Body.applyForce(
    body,
    { x: virusBody.position.x, y: virusBody.position.y },
    { x: -0.01, y: -0.01 }
  );
  Matter.Body.applyForce(
    copy,
    {
      x: virusBody.position.x,
      y: virusBody.position.y,
    },
    { x: 0.01, y: 0.01 }
  );

  Matter.World.add(world, [body, copy]);

  state[body.id] = {
    body: body,
    size: [virusSize * 2, virusSize * 2],
    color: boxIds % 2 == 0 ? "red" : "#B8E986",
    renderer: Virus,
  };
  state[copy.id] = {
    body: copy,
    size: [virusSize * 2, virusSize * 2],
    color: boxIds % 2 == 0 ? "red" : "#B8E986",
    renderer: Virus,
  };
};

const CreateBox = (state, { touches, screen }) => {
  let world = state["physics"].world;
  let engine = state["physics"].engine;

  if (state["createVirus"]) {
    console.log("createcollissionhanlder");
    console.log(Matter.World.Bodies);
    Matter.Events.on(engine, "collisionStart", (event) => {
      // console.log(event.pairs.length, "eventPairs");
      event.pairs.map((ele) => {
        // console.log(ele);
        let bothBodies = [ele.bodyA, ele.bodyB];
        let virusBody = bothBodies.find((ele) => ele.label == "Virus");
        let bulletBody = bothBodies.find((ele) => ele.label == "bullet");
        if (virusBody && bulletBody) {
          handleCollision(state, world, virusBody, bulletBody);
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

    const virusSize =
      Math.trunc(Math.max(screen.width, screen.height) * 0.075) * 2;

    let body = Matter.Bodies.circle(
      0 + virusSize + 5,
      0 + virusSize,
      virusSize / 2,
      {
        frictionAir: 0,
        friction: 0,
        frictionStatic: 0,
        restitution: 1,
        // inertia: Infinity,
        // inverseInertia: 0,
        label: "Virus",
        mass: 1,
        inverseMass: 1,
      }
    );
    Matter.Body.setVelocity(body, {
      x: 3,
      y: 3,
    });

    // Matter.Body.applyForce(body, { x: 3, y: 3 }, { x: 3, y: 3 });
    Matter.World.add(world, [body]);

    state[body.id] = {
      body: body,
      size: [virusSize, virusSize],
      color: boxIds % 2 == 0 ? "red" : "#B8E986",
      renderer: Virus,
    };
    state["createVirus"] = false;
  }

  return state;
};

const CreateBullet = (state, { touches, screen }) => {
  let constraint = state["physics"].constraint;
  const boxSize = Math.trunc(Math.max(screen.width, screen.height) * 0.075) / 2;
  let world = state["physics"].world;
  //-- Handle start touch
  let end = touches.find((x) => x.type === "end");
  let move = touches.find((x) => x.type === "move");
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
      renderer: Box,
    };
    Matter.Body.setVelocity(body, {
      x: move.delta.pageX,
      y: move.delta.pageY,
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
        (state[key].body.position.y > screen.height * 2 ||
          state[key].body.position.x > screen.width * 2)
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

export { Physics, CreateBox, CleanBoxes, ControlVelocity, CreateBullet };
