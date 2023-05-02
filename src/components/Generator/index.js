import { randomIntGenerator } from "../../helpers/randomIntGenerator";
import '../Generator/generator.css';
import { useEffect, useState } from 'react';
import { checkForMatchesRowsThree } from "../../helpers/CheckForMatches/CheckForMatchesRows/checkForMatchesRows"
import { checkForMatchesColumnsThree } from "../../helpers/CheckForMatches/CheckForMatchesColumns/checkForMatchesColumns"
import { gemColorArray } from "../../constants/constants";
import { checkGridForMatches } from "../../helpers/CheckForMatches/CheckGridForMatches/checkGridForMatches";
function Generator() {
  const [generatedSeedArray, setGeneratedSeedArray] = useState([]);
  const [selectedGem, setSelectedGem] = useState({});
  const [replacedGem, setReplacedGem] = useState({});
  // Score needs to put the amount of stats you have
  // use those variables as a bar
  const [score, setScore] = useState(0);
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
  // const gemColorArray = ["red", "blue", "yellow", "green", "black", "purple"];
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
  // console.log("withing generated seed", generatedSeedArray)

  function dragStart(e) {
    // console.log("dragStart",e.target.className)
    // setSelectedGem(e.target.className);
    setSelectedGem({ color: e.target.src, id: e.target.id });
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
    // checkForMatchesRowsThree(generatedSeedArray)
    setSelectedGem({})
    setReplacedGem({})
  }
  function dragDrop(e) {
    //dropped on
    //grab state of dropped on
    //then setState 
    // setReplacedGem({ color: e.target.className, id: e.target.id });
    setReplacedGem({ color: e.target.src, id: e.target.id });
    //trying to modify the generateSeed array via splice then set it
    // copyOfGenerateSeed.splice(selectedGem.id, 0, selectedGem.color)
    // trying to set it directly but it doesn't work
    // generatedSeedArray[selectedGem.id] = selectedGem.color
  }
  function check() {
    let checkedMatchesRows = checkForMatchesRowsThree([...generatedSeedArray])
    let checkedMatchesColumns = checkForMatchesColumnsThree([...generatedSeedArray])
    //Copying one array here
    //The function uses two copies of it?
    //Yes because one needs to remain unchaged so it can grab the previous values.
    //The double arrays allows me to know the positions of previous gems
    const originalCopyOfGeneratedSeed = [...generatedSeedArray]
    if (checkedMatchesColumns !== false) {
      console.log("INSIDE LINE 119", checkedMatchesColumns)
      // Runs it only once if the 
      if (checkedMatchesColumns < 24) {
        console.log("INSIDE LINE 122", checkedMatchesColumns)
        //First replace the three matched ones
        copyOfGenerateSeed.splice(checkedMatchesColumns, 1, gemColorArray[randomIntGenerator(5)])
        copyOfGenerateSeed.splice(checkedMatchesColumns - 8, 1, gemColorArray[randomIntGenerator(5)])
        copyOfGenerateSeed.splice(checkedMatchesColumns - 16, 1, gemColorArray[randomIntGenerator(5)])
        setScore(prev => prev += 3)
        setGeneratedSeedArray(copyOfGenerateSeed)
      } else {
        //Out of the three matched in each column, grab the bottom one and replace it with the color that is three rows above. Do this for every row of the matched column until it reaches the fourth row
        let newStartingIndexForNewColors = 0;
        for (let index = checkedMatchesColumns; index > 23; index -= 8) {
          copyOfGenerateSeed.splice(index, 1, originalCopyOfGeneratedSeed[index - 24])
          newStartingIndexForNewColors = index;
        }
        console.log("LINE 136", newStartingIndexForNewColors)
        // // Generates new colors for the first three of the matched column
        copyOfGenerateSeed.splice(newStartingIndexForNewColors - 8, 1, gemColorArray[randomIntGenerator(5)])
        copyOfGenerateSeed.splice(newStartingIndexForNewColors - 16, 1, gemColorArray[randomIntGenerator(5)])
        copyOfGenerateSeed.splice(newStartingIndexForNewColors - 24, 1, gemColorArray[randomIntGenerator(5)])
        console.log(copyOfGenerateSeed, checkedMatchesRows - 8)
        setScore(prev => prev += 3)
        setGeneratedSeedArray(copyOfGenerateSeed)
      }
    }
    // this now checks for matches of three in rows
    // it modifies the color above, but now the issues is I need to loop and go backwards
    // for (let index = 0; index < array.length; index++) {
    //   const element = array[index];

    // }
    if (checkedMatchesRows !== false) {
      // cant move to the next one because it is negative
      // each loop -8, then condition is if i < 0
      console.log("LINE 144", checkedMatchesRows < 8)
      if (checkedMatchesRows < 8) {
        copyOfGenerateSeed.splice(checkedMatchesRows, 3, gemColorArray[randomIntGenerator(5)], gemColorArray[randomIntGenerator(5)], gemColorArray[randomIntGenerator(5)])
        console.log("inside if", checkedMatchesRows)
        setScore(prev => prev += 3)
        setGeneratedSeedArray(copyOfGenerateSeed)
      } else {
        let newStartingIndexForNewColors = 0;
        for (let index = checkedMatchesRows; index > 7; index -= 8) {
          copyOfGenerateSeed.splice(index, 3, originalCopyOfGeneratedSeed[index - 8], originalCopyOfGeneratedSeed[index - 7], originalCopyOfGeneratedSeed[index - 6])
          newStartingIndexForNewColors = index;
        }
        // Generates new colors
        copyOfGenerateSeed.splice(newStartingIndexForNewColors - 8, 3, gemColorArray[randomIntGenerator(5)], gemColorArray[randomIntGenerator(5)], gemColorArray[randomIntGenerator(5)])
        console.log(copyOfGenerateSeed, checkedMatchesRows - 8)
        setScore(prev => prev += 3)
        setGeneratedSeedArray(copyOfGenerateSeed)
      }
    }
  }
  // test one make it so when he state is updated run the check function
  useEffect(() => {
    generatedSeed()

  }, [])
  // Bug: when a match is made and the new colors that replace the matched ones create a new match, it doesnt replace it but instead creates an infinite loop
  useEffect(() => {
    // Idea is that everytime if it is going to check for matches in the array, regardless if something was dragged or not
    const checkingIntervalForMatches = setInterval(() => {
      console.log(checkForMatchesRowsThree([...generatedSeedArray]));
      //This returns 5
      //   if(checkForMatchesRowsThree([...generatedSeedArray])){
      //     let checkedMatchesRows = checkForMatchesRowsThree([...generatedSeedArray])
      // const originalCopyOfGeneratedSeed = [...copyOfGenerateSeed]
      // let newStartingIndexForNewColors = 0;

      // // Generates new colors
      // if(newStartingIndexForNewColors < 8){
      //   copyOfGenerateSeed.splice(newStartingIndexForNewColors, 3, gemColorArray[randomIntGenerator(5)], gemColorArray[randomIntGenerator(5)], gemColorArray[randomIntGenerator(5)])
      //   console.log("inside if", checkedMatchesRows)
      //   setScore(prev => prev += 3)
      //   setGeneratedSeedArray(copyOfGenerateSeed)
      // } else {
      //     for (let index = checkedMatchesRows; index > 7; index -= 8) {
      //       console.log(index)
      //       copyOfGenerateSeed.splice(index, 3, originalCopyOfGeneratedSeed[index-8], originalCopyOfGeneratedSeed[index-7], originalCopyOfGeneratedSeed[index-6])
      //       newStartingIndexForNewColors = index;
      //     }
      //     copyOfGenerateSeed.splice(newStartingIndexForNewColors - 8, 3, gemColorArray[randomIntGenerator(5)], gemColorArray[randomIntGenerator(5)], gemColorArray[randomIntGenerator(5)])
      //     console.log(copyOfGenerateSeed, checkedMatchesRows - 8)
      //     setScore(prev => prev += 3)
      //     setGeneratedSeedArray(copyOfGenerateSeed)
      //   }
      //   }
      checkGridForMatches(generatedSeedArray, setGeneratedSeedArray, gemColorArray, setScore)
      document.getElementById("healthbar").style.setProperty('width',`${score}%`);
    }, 250)
    // check()
    return () => clearInterval(checkingIntervalForMatches)

  }, [copyOfGenerateSeed, gemColorArray, generatedSeedArray])
  const generateDivs = generatedSeedArray.map((letter, index) => {
    // if (Array.isArray(letter)) {
    //   
    // } else {
    //   return letter
    // }
    //was a div
    return <img
      key={index}
      src={letter}
      draggable="true"
      onDragLeave={(e) => e.preventDefault()}
      onDragEnter={(e) => e.preventDefault()}
      onDragOver={(e) => e.preventDefault()}
      onDragStart={dragStart}
      onDragEnd={dragEnd}
      onDrop={dragDrop}
      id={index}
      className="gem"
    />

  })
  // checkForMatchesRowsThree(generatedSeedArray)

  return (
    <>
      <div id="head">
        <div id="healthbar"></div>
      </div>
      <h2>Score: {score}</h2>
      <div id="gem">
        {generateDivs}
      </div>
    </>
  );
}

export default Generator;