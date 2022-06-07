import { randomIntGenerator } from "../../helpers/randomIntGenerator";
import '../Generator/generator.css';
import { useEffect, useState } from 'react';
import { checkForMatchesRowsThree } from "../CheckForMatches/CheckForMatchesRows/checkForMatchesRows"
function Generator() {
  const [generatedSeedArray, setGeneratedSeedArray] = useState([]);
  const [selectedGem, setSelectedGem] = useState({});
  const [replacedGem, setReplacedGem] = useState({});
  //Tiles are A B C D E F

  //Generate array with 5 A x 5 As
  // [
  //    [A,A,A,A,A]
  //    [A,A,A,A,A]
  //    [A,A,A,A,A]
  //    [A,A,A,A,A]
  //    [A,A,A,A,A]
  //]
  //[y, x]
  //Target first A would be [0,0]
  const gemColorArray = ["red", "blue", "yellow", "green", "black", "purple"];
  //Generate a random number 



  const yArray = [];
  // a generated seed can not have any3 matched
  // need to check for repeating values
  // the the previous two x entries are the same, change it
  // check the third element forward

  //how to return divs?
  const generatedSeed = () => {
    for (let y = 0; y < 8; y++) {
      yArray.push([]);
      for (let x = 0; x < 8; x++) {
        let randomNum = randomIntGenerator(5)
        if ((x >= 2
          && (yArray[y][x - 1] === gemColorArray[randomNum])
          && (yArray[y][x - 2] === gemColorArray[randomNum])
        ) ||
          (
            y >= 2
            && (yArray[y - 1][x] === gemColorArray[randomNum])
            && (yArray[y - 2][x] === gemColorArray[randomNum])
          )) {
          if (randomNum === 0) {
            randomNum = randomIntGenerator(4) + 1
            yArray[y].push(gemColorArray[randomNum]);
          } else {
            yArray[y].push(gemColorArray[randomIntGenerator(randomNum)]);
          }
        } else {
          yArray[y].push(gemColorArray[randomNum]);
        }
      }
    }
    const gemArray = [];
    const finalGemArray = gemArray.concat(yArray[0],
      yArray[1],
      yArray[2],
      yArray[3],
      yArray[4],
      yArray[5],
      yArray[6],
      yArray[7]
    )
    setGeneratedSeedArray(finalGemArray)
  }
  useEffect(() => {
    generatedSeed()
  }, [])
  useEffect(() => {
  }, [])
  // console.log("withing generated seed", generatedSeedArray)

  function dragStart(e) {
    // console.log("dragStart",e.target.className)
    // setSelectedGem(e.target.className);
    setSelectedGem({ color: e.target.className, id: e.target.id });
  }
  const copyOfGenerateSeed = [...generatedSeedArray];
  // useEffect(() => {
  //   setGeneratedSeedArray(copyOfGenerateSeed)
  // }, [setSelectedGem])
  function dragEnd(e) {
    // e.target.setAttribute("class", replacedGem)
    //figure out how to set array
    // generatedSeedArray[replacedGem.id] = selectedGem.color
    // generatedSeedArray[selectedGem.id] = replacedGem.color

    // console.log("replaced", generatedSeedArray[replacedGem.id])
    // console.log("selected", selectedGem)
    // console.log(copyOfGenerateSeed)
    copyOfGenerateSeed.splice(replacedGem.id, 1, selectedGem.color)
    copyOfGenerateSeed.splice(selectedGem.id, 1, replacedGem.color)
    // console.log("copy", copyOfGenerateSeed)
    // generatedSeedArray[replacedGem.id] = selectedGem.color
    // generatedSeedArray[selectedGem.id] = replacedGem.color
    setGeneratedSeedArray(copyOfGenerateSeed)
    checkForMatchesRowsThree(generatedSeedArray)
    setSelectedGem({})
    setReplacedGem({})
  }
  function dragDrop(e) {
    //dropped on
    //grab state of dropped on
    //then setState 
    // setReplaceGem(e.target.className)
    // e.target.setAttribute("class", selectedGem)
    setReplacedGem({ color: e.target.className, id: e.target.id });
    //trying to modify the generateSeed array via splice then set it
    // copyOfGenerateSeed.splice(selectedGem.id, 0, selectedGem.color)
    // trying to set it directly but it doesn't work
    // generatedSeedArray[selectedGem.id] = selectedGem.color
  }

  const generateDivs = generatedSeedArray.map((letter, index) => {
    // if (Array.isArray(letter)) {
    //   
    // } else {
    //   return letter
    // }
    return <div
      key={index}
      draggable="true"
      onDragLeave={(e) => e.preventDefault()}
      onDragEnter={(e) => e.preventDefault()}
      onDragOver={(e) => e.preventDefault()}
      onDragStart={dragStart}
      onDragEnd={dragEnd}
      onDrop={dragDrop}
      id={index}
      className={letter}
    />

  })
  function check() {
    if (checkForMatchesRowsThree(generatedSeedArray)) {
      copyOfGenerateSeed.splice(checkForMatchesRowsThree(generatedSeedArray), 3, "white", "white", "white")
      console.log("after adding white", copyOfGenerateSeed)
      setGeneratedSeedArray(copyOfGenerateSeed)
    }
  }
  // function check() {
  //   if (checkForMatchesRowsThree(generatedSeedArray)) {
  //     copyOfGenerateSeed.splice(checkForMatchesRowsThree(generatedSeedArray), 3, "white", "white", "white")
  //     console.log("after adding white", copyOfGenerateSeed)
  //     setGeneratedSeedArray(copyOfGenerateSeed)
  //   }
  // }
  useEffect(() => {
    check()

  }, [check])
  // checkForMatchesRowsThree(generatedSeedArray)

  return (
    <div id="gem">
      {generateDivs}
    </div>
  );
}

export default Generator;