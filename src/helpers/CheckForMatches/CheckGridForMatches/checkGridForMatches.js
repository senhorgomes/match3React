import { checkForMatchesColumnsThree } from "../CheckForMatchesColumns/checkForMatchesColumns"
import { checkForMatchesRowsThree } from "../CheckForMatchesRows/checkForMatchesRows"
import { randomIntGenerator } from "../../randomIntGenerator"
export function checkGridForMatches(seedStateArray, setSeedStateArray, gemColorArray, setScore) {
  let checkedMatchesRows = checkForMatchesRowsThree([...seedStateArray])
  let checkedMatchesColumns = checkForMatchesColumnsThree([...seedStateArray])
  const copyOfGenerateSeed = [...seedStateArray]
  const unalteredCopyOfGeneratedSeed = [...copyOfGenerateSeed]
  if (checkedMatchesColumns !== false) {
    // Runs it only once if the 
    if (checkedMatchesColumns < 24) {
      //First replace the three matched ones
      copyOfGenerateSeed.splice(checkedMatchesColumns, 1, gemColorArray[randomIntGenerator(5)])
      copyOfGenerateSeed.splice(checkedMatchesColumns - 8, 1, gemColorArray[randomIntGenerator(5)])
      copyOfGenerateSeed.splice(checkedMatchesColumns - 16, 1, gemColorArray[randomIntGenerator(5)])
      setScore(prev => prev += 3)
      setSeedStateArray(copyOfGenerateSeed)
    } else {
      //Out of the three matched in each column, grab the bottom one and replace it with the color that is three rows above. Do this for every row of the matched column until it reaches the fourth row
      let newStartingIndexForNewColors = 0;
      for (let index = checkedMatchesColumns; index > 23; index -= 8) {
        copyOfGenerateSeed.splice(index, 1, unalteredCopyOfGeneratedSeed[index - 24])
        newStartingIndexForNewColors = index;
      }
      console.log("LINE 136", newStartingIndexForNewColors)
      // // Generates new colors for the first three of the matched column
      copyOfGenerateSeed.splice(newStartingIndexForNewColors - 8, 1, gemColorArray[randomIntGenerator(5)])
      copyOfGenerateSeed.splice(newStartingIndexForNewColors - 16, 1, gemColorArray[randomIntGenerator(5)])
      copyOfGenerateSeed.splice(newStartingIndexForNewColors - 24, 1, gemColorArray[randomIntGenerator(5)])
      console.log(copyOfGenerateSeed, checkedMatchesRows - 8)
      // setScore(prev => prev += 3)
      setSeedStateArray(copyOfGenerateSeed)
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
      setSeedStateArray(copyOfGenerateSeed)
    } else {
      let newStartingIndexForNewColors = 0;
      for (let index = checkedMatchesRows; index > 7; index -= 8) {
        copyOfGenerateSeed.splice(index, 3, unalteredCopyOfGeneratedSeed[index - 8], unalteredCopyOfGeneratedSeed[index - 7], unalteredCopyOfGeneratedSeed[index - 6])
        newStartingIndexForNewColors = index;
      }
      // Generates new colors
      copyOfGenerateSeed.splice(newStartingIndexForNewColors - 8, 3, gemColorArray[randomIntGenerator(5)], gemColorArray[randomIntGenerator(5)], gemColorArray[randomIntGenerator(5)])
      console.log(copyOfGenerateSeed, checkedMatchesRows - 8)
      setScore(prev => ({...prev, ammo: prev.ammo += 3 }))
      setSeedStateArray(copyOfGenerateSeed)
    }
  }
}