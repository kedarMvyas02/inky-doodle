import React, { useState, useEffect } from "react";
import InkyDoodle from "./components/InkyDoodle";
import styled from "styled-components";
import axios from "axios";
import LeftParents from "./components/LeftParents";
import RightParents from "./components/RightParents";
import InkyLogo from "./inky.png";
import "./App.css";

const StyledAppContainer = styled.div`
  max-height: 100vh;
  max-width: 100vw;
`;

const StyledMainContainer = styled.div`
  font-family: "Press Start 2P";
  font-size: 1rem;
  padding-left: 10%;
  padding-right: 10%;
  margin-top: ${(props) => (props.parentInkyDoodles ? "2vh" : "7vh")};
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-evenly;
  @media (max-width: 1024px) and (orientation: landscape) {
    margin-top: ${(props) => (props.parentInkyDoodles ? "10vh" : "15vh")};
    padding-left: 0;
    padding-right: 0;
  }
  @media (max-width: 768px) {
    padding-left: 0;
    padding-right: 0;
  }
  @media (max-width: 340px) {
    margin-top: ${(props) => (props.parentInkyDoodles ? "8vh" : "13vh")};
  }
`;

const StyledParentsContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-evenly;
`;

const StyledNavLogo = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  max-width: 100%;
`;

const StyledAnchor = styled.a`
  height: 5vh;
  display: block;
  position: relative;
  width: 100px;
  margin-top: 1rem;
  margin-left: 1rem;
  @media (max-width: 1024px) and (orientation: landscape) {
    margin-top: 0.5rem;
    margin-left: 0rem;
  }
`;

const App = () => {
  const [parentInkyDoodles, changeParentInkyDoodles] = useState("");

  // Left Tree Parents (Gen 1)
  const [leftTreeLeftParent, changeLeftTreeLeftParent] = useState("");
  const [leftTreeRightParent, changeLeftTreeRightParent] = useState("");

  // Right Tree Parents (Gen 1)
  const [rightTreeLeftParent, changeRightTreeLeftParent] = useState("");
  const [rightTreeRightParent, changeRightTreeRightParent] = useState("");

  // Left Gen 2
  const [leftGen2, changeLeftGen2] = useState("");
  const [leftGen2Loading, changeLeftGen2Loading] = useState(false);

  // Right Gen 2
  const [rightGen2, changeRightGen2] = useState("");
  const [rightGen2Loading, changeRightGen2Loading] = useState(false);

  // Gen 3
  const [gen3, changeGen3] = useState("");
  const [gen3Loading, changeGen3Loading] = useState(false);

  const parentInkyDoodlesQuery = `
        query {
            inkyDoodleCollection(where: {generation_in: 1}) {
                items   {
                generation
                name
                image {
                    url
                }
            }
        }
    }
`;

  useEffect(() => {
    axios({
      url: `https://graphql.contentful.com/content/v1/spaces/${process.env.REACT_APP_SPACE_ID}`,
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_ACCESS_TOKEN}`,
      },
      data: {
        query: parentInkyDoodlesQuery,
      },
    })
      .then((res) => res.data)
      .then(({ data, errors }) => {
        if (errors) {
          console.error(errors);
        }

        changeParentInkyDoodles(data.inkyDoodleCollection.items);
      });
  }, [parentInkyDoodlesQuery]);

  const gen3InkyDoodlesQuery = `
    query {
        inkyDoodleCollection(where: {generation_in: 3, parents_contains_all: [${
          leftGen2.name ? JSON.stringify(leftGen2.name) : null
        }, ${rightGen2.name ? JSON.stringify(rightGen2.name) : null}]}) {
            items {
                generation
                name
                parents
                image {
                    url
                }
            }
        }
    }
`;

  useEffect(() => {
    const getGen3Function = () => {
      changeGen3Loading(true);

      axios({
        url: `https://graphql.contentful.com/content/v1/spaces/${process.env.REACT_APP_SPACE_ID}`,
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_ACCESS_TOKEN}`,
        },
        data: {
          query: gen3InkyDoodlesQuery,
        },
      })
        .then((res) => {
          return res.data;
        })
        .then(({ data, errors }) => {
          changeGen3Loading(false);
          if (errors) {
            console.error(errors);
          }

          if (data.inkyDoodleCollection.items[0]) {
            changeGen3(data.inkyDoodleCollection.items[0]);
          } else {
            changeGen3("No Match");
          }
        });
    };

    if (leftGen2) {
      if (rightGen2) {
        if (leftGen2.name && rightGen2.name) {
          if (
            JSON.stringify(leftGen2.name) === JSON.stringify(rightGen2.name)
          ) {
            changeGen3(leftGen2);
          } else {
            getGen3Function();
          }
        } else {
          if (
            JSON.stringify(leftGen2.label) === JSON.stringify(rightGen2.label)
          ) {
            changeGen3(leftGen2);
          } else {
            getGen3Function();
          }
        }
      }
    }
  }, [gen3InkyDoodlesQuery, leftGen2, rightGen2]);

  useEffect(() => {
    // In order to prevent iOS keyboard from opening on dropdown focus
    window.addEventListener("load", () => {
      const nesDropdowns = [...document.getElementsByTagName("INPUT")];
      if (nesDropdowns.length > 0) {
        nesDropdowns.forEach((item) => item.setAttribute("readonly", true));
      }
    });

    document.addEventListener("DOMContentLoaded", () => {
      const nesDropdowns = [...document.getElementsByTagName("INPUT")];
      if (nesDropdowns.length > 0) {
        nesDropdowns.forEach((item) => item.setAttribute("readonly", true));
      }
    });
  }, []);

  return (
    <StyledAppContainer>
      <link
        href="https://fonts.googleapis.com/css?family=Press+Start+2P"
        rel="stylesheet"
      />
      <StyledAnchor href="/">
        <StyledNavLogo src={InkyLogo} alt="Inky Doodle Logo" />
      </StyledAnchor>
      <StyledMainContainer parentInkyDoodles={parentInkyDoodles}>
        <StyledParentsContainer>
          <LeftParents
            parentInkyDoodles={parentInkyDoodles}
            leftTreeLeftParent={leftTreeLeftParent}
            changeLeftTreeLeftParent={changeLeftTreeLeftParent}
            leftTreeRightParent={leftTreeRightParent}
            changeLeftTreeRightParent={changeLeftTreeRightParent}
            changeLeftGen2={changeLeftGen2}
            changeLeftGen2Loading={changeLeftGen2Loading}
          />
        </StyledParentsContainer>
        <StyledParentsContainer>
          <RightParents
            parentInkyDoodles={parentInkyDoodles}
            rightTreeLeftParent={rightTreeLeftParent}
            changeRightTreeLeftParent={changeRightTreeLeftParent}
            rightTreeRightParent={rightTreeRightParent}
            changeRightTreeRightParent={changeRightTreeRightParent}
            changeRightGen2={changeRightGen2}
            changeRightGen2Loading={changeRightGen2Loading}
          />
        </StyledParentsContainer>
      </StyledMainContainer>
      <StyledMainContainer>
        <StyledParentsContainer style={{ justifyContent: "space-around" }}>
          <InkyDoodle
            leftGen2={leftGen2}
            leftGen2Loading={leftGen2Loading}
            gen2Identifier={true}
          />
          <InkyDoodle
            rightGen2={rightGen2}
            rightGen2Loading={rightGen2Loading}
            gen2Identifier={true}
          />
        </StyledParentsContainer>
      </StyledMainContainer>
      <StyledMainContainer>
        <InkyDoodle
          gen3={gen3}
          gen3Loading={gen3Loading}
          gen3Identifier={true}
        />
      </StyledMainContainer>
    </StyledAppContainer>
  );
};

export default App;