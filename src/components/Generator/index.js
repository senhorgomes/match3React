import { randomIntGenerator } from "../../helpers/randomIntGenerator";
import '../Generator/generator.css';
import { useEffect, useState } from 'react';
import { checkForMatchesRowsThree } from "../../helpers/CheckForMatches/CheckForMatchesRows/checkForMatchesRows"
import { checkForMatchesColumnsThree } from "../../helpers/CheckForMatches/CheckForMatchesColumns/checkForMatchesColumns"
import { gemColorArray } from "../../constants/constants";
import { replaceGrid } from "../../helpers/CheckForMatches/CheckGridForMatches/checkGridForMatches";
function Generator() {
  const [generatedSeedArray, setGeneratedSeedArray] = useState([]);
  const [selectedGem, setSelectedGem] = useState({});
  const [replacedGem, setReplacedGem] = useState({});
  const [movedItem, setMovedItem] = useState(false);
  // Score needs to put the amount of stats you have
  // use those variables as a bar
  const [score, setScore] = useState({ammo:0,energy:0,shield:0});
  // const [score, setScore] = useState(0);
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
    setSelectedGem({ color: e.target.src, name: e.target.name,id: e.target.id });
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

    // {"image":red, "color":"red" }
    copyOfGenerateSeed.splice(replacedGem.id, 1, {"image":selectedGem.color, "color":selectedGem.name})
    copyOfGenerateSeed.splice(selectedGem.id, 1, {"image":replacedGem.color, "color":replacedGem.name})
    // console.log("copy", copyOfGenerateSeed)
    // generatedSeedArray[replacedGem.id] = selectedGem.color
    // generatedSeedArray[selectedGem.id] = replacedGem.color
    setMovedItem(true)
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
    setReplacedGem({ color: e.target.src, id: e.target.id, name: e.target.name });
    //trying to modify the generateSeed array via splice then set it
    // copyOfGenerateSeed.splice(selectedGem.id, 0, selectedGem.color)
    // trying to set it directly but it doesn't work
    // generatedSeedArray[selectedGem.id] = selectedGem.color
  }
  // test one make it so when he state is updated run the check function
  useEffect(() => {
    generatedSeed()

  }, [])
  useEffect(()=> {
    if(movedItem){

      const imagesOfGrid = replaceGrid(generatedSeedArray, gemColorArray);
        let timerForReplacementOfGrids = 1000;
        if (!imagesOfGrid) return;
        imagesOfGrid.forEach((image)=>{
          setTimeout(()=>{setGeneratedSeedArray(image)
            timerForReplacementOfGrids += 1000;
          }, timerForReplacementOfGrids)
        })
    }
  }, [generatedSeedArray])
  // Bug: when a match is made and the new colors that replace the matched ones create a new match, it doesnt replace it but instead creates an infinite loop
  // useEffect(() => {
  //   // Idea is that everytime if it is going to check for matches in the array, regardless if something was dragged or not
  //   const checkingIntervalForMatches = setInterval(() => {
  //     //This returns 5
  //     //   if(checkForMatchesRowsThree([...generatedSeedArray])){
  //     //     let checkedMatchesRows = checkForMatchesRowsThree([...generatedSeedArray])
  //     // const originalCopyOfGeneratedSeed = [...copyOfGenerateSeed]
  //     // let newStartingIndexForNewColors = 0;

  //     // // Generates new colors
  //     // if(newStartingIndexForNewColors < 8){
  //     //   copyOfGenerateSeed.splice(newStartingIndexForNewColors, 3, gemColorArray[randomIntGenerator(5)], gemColorArray[randomIntGenerator(5)], gemColorArray[randomIntGenerator(5)])
  //     //   console.log("inside if", checkedMatchesRows)
  //     //   setScore(prev => prev += 3)
  //     //   setGeneratedSeedArray(copyOfGenerateSeed)
  //     // } else {
  //     //     for (let index = checkedMatchesRows; index > 7; index -= 8) {
  //     //       console.log(index)
  //     //       copyOfGenerateSeed.splice(index, 3, originalCopyOfGeneratedSeed[index-8], originalCopyOfGeneratedSeed[index-7], originalCopyOfGeneratedSeed[index-6])
  //     //       newStartingIndexForNewColors = index;
  //     //     }
  //     //     copyOfGenerateSeed.splice(newStartingIndexForNewColors - 8, 3, gemColorArray[randomIntGenerator(5)], gemColorArray[randomIntGenerator(5)], gemColorArray[randomIntGenerator(5)])
  //     //     console.log(copyOfGenerateSeed, checkedMatchesRows - 8)
  //     //     setScore(prev => prev += 3)
  //     //     setGeneratedSeedArray(copyOfGenerateSeed)
  //     //   }
  //     //   }
  //     replaceGrid(generatedSeedArray, setGeneratedSeedArray, gemColorArray, setScore)
  //     document.getElementById("healthbar").style.setProperty('width',`${score}%`);
  //   }, 250)
  //   // check()
  //   return () => clearInterval(checkingIntervalForMatches)

  // }, [copyOfGenerateSeed, gemColorArray, generatedSeedArray])
  const generateDivs = generatedSeedArray.map((letter, index) => {
    // if (Array.isArray(letter)) {
    //   
    // } else {
    //   return letter
    // }
    //was a div
    return <img
      key={index}
      name={letter.color}
      src={letter.image}
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
      <h2>Ammo: {score.ammo}</h2>
      <h2>Energy: {score.energy}</h2>
      <h2>Shield: {score.shield}</h2>
      <div id="gem">
        {generateDivs}
      </div>
    </>
  );
}

export default Generator;