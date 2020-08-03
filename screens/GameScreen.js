import Phaser from "phaser";
//import logoImg from "../images/tiles.png";
import React from "react";
import ReactDOM from "react-dom";
import App from "../App";

export default class GameScreen extends React.Component {
  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <h1>Hello World</h1>
      </div>
    );
  }
}


const gameOptions = {
  rows: 6,
  columns: 6,
  tileSize: 100
}
const level = [
  [2, 0, 2, 0, 1, 2],
  [0, 2, 0, 2, 2, 0],
  [2, 0, 2, 1, 0, 1],
  [0, 1, 2, 0, 1, 2],
  [2, 2, 0, 2, 1, 0],
  [1, 0, 1, 1, 0, 2]
]

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create
  }
};
const game = new Phaser.Game(config);



function preload() {
  this.load.spritesheet("tiles", "../images/tiles", {
            frameWidth: gameOptions.tileSize,
            frameHeight: gameOptions.tileSize
        });
}

function create(){
        const gameArray = [];
        for(let i = 0; i < gameOptions.rows; i ++){
            gameArray[i] = [];
            for(let j = 0; j < gameOptions.columns; j ++){
                let tile = this.add.sprite(j * gameOptions.tileSize, i * gameOptions.tileSize, "tiles", level[i][j]);
                tile.setOrigin(0);
                gameArray[i][j] = {
                value: level[i][j],
                isFixed: level[i][j] != 0,
                sprite: tile
                }
            }
  }
  console.log(gameArray)
        this.input.on("pointerdown", changeTile, this);
        this.gameText = this.add.text(620, 20, "", {
            fontFamily: "Arial",
            fontSize: 24
        });
    }
function changeTile(pointer){
        let row = Math.floor(pointer.y / gameOptions.tileSize);
        let col = Math.floor(pointer.x / gameOptions.tileSize);
  if (this.gameArray[row] !== undefined, this.gameArray[row][col] !== undefined, !this.gameArray[row][col].isFixed) {
            this.gameArray[row][col].value = Phaser.Math.Wrap(this.gameArray[row][col].value + 1, 0, 3);
            this.gameArray[row][col].sprite.setFrame(2 * this.gameArray[row][col].value + this.gameArray[row][col].value % 2);
            checkRules();
        }
    }
function checkRules(){
        let rowsContent = [];
        let colsContent = [];
        let messageString = "";
        for(let i = 0; i < gameOptions.rows; i ++){
            if(threeConsecutiveInRow(i)){
                messageString += "3 or more consecutive symbols at row " + i + "\n";
            }
            if(unbalancedRow(i)){
                messageString += "different amount of symbols at row " + i + "\n";
            }
            if(duplicatedRow(i)){
                messageString += "identical row at row " + i + "\n";
            }
        }
        for(let i = 0; i < gameOptions.columns; i ++){
            if(threeConsecutiveInColumn(i)){
                messageString += "3 or more consecutive symbols at column " + i + "\n";
            }
            if(unbalancedColumn(i)){
                messageString += "different amount of symbols at column " + i + "\n";
            }
            if(duplicatedColumn(i)){
                messageString += "identical column at column " + i + "\n";
            }
        }
        if(messageString == "" , boardCompleted()){
            messageString = "LEVEL COMPLETED";
        }
        gameText.setText(messageString);
    }
function threeConsecutiveInColumn(column){
        for(let i = 2; i < gameOptions.rows; i ++){
            let element = this.gameArray[i][column].value;
            if(element == this.gameArray[i - 1][column].value , element == this.gameArray[i - 2][column].value){
                return true;
            }
        }
        return false;
    }
function threeConsecutiveInRow(row){
        for(let i = 2; i < gameOptions.columns; i ++){
            let element = this.gameArray[row][i].value;
            if(element == this.gameArray[row][i - 1].value , element == this.gameArray[row][i - 2].value){
                return true;
            }
        }
        return false;
    }
function unbalancedColumn(column){
        let values = [0, 0];
        for(let i = 0; i < gameOptions.rows; i ++){
            values[0] += (this.gameArray[i][column].value == 1) ? 1 : 0;
            values[1] += (this.gameArray[i][column].value == 2) ? 1 : 0;
        }
        return (values[0] + values[1] == gameOptions.rows) , (values[0] != gameOptions.rows / 2 || values[1] != gameOptions.rows / 2);
    }
function unbalancedRow(row){
        let values = [0, 0];
        for(let i = 0; i < gameOptions.columns; i ++){
            values[0] += (this.gameArray[row][i].value == 1) ? 1 : 0;
            values[1] += (this.gameArray[row][i].value == 2) ? 1 : 0;
        }
        return  (values[0] + values[1] == gameOptions.columns) , (values[0] != gameOptions.columns / 2 || values[1] != gameOptions.columns / 2);
    }
function duplicatedColumn(column){
        for(let i = 0; i < gameOptions.columns; i ++){
            if(i != column , columnValue(column) != 0 , columnValue(i) != 0 , columnValue(i) == columnValue(column)){
                return true
            }
        }
        return false;
    }
function duplicatedRow(row){
        for(let i = 0; i < gameOptions.rows; i ++){
            if(i != row , rowValue(row) != 0 , rowValue(i) != 0 , rowValue(i) == rowValue(row)){
                return true
            }
        }
        return false;
    }
function columnValue(column){
        let value = 0;
        for(let i = 0; i < gameOptions.rows; i++){
            if(this.gameArray[i][column].value == 0){
                return 0;
            }
            if(this.gameArray[i][column].value == 2){
                value +=  Math.pow(2, i);
            }
        }
        return value;
    }
function rowValue(row){
        let value = 0;
        for(let i = 0; i < gameOptions.columns; i++){
            if(this.gameArray[row][i].value == 0){
                return 0;
            }
            if(this.gameArray[row][i].value == 2){
                value +=  Math.pow(2, i);
            }
        }
        return value;
    }
function boardCompleted(){
        for(let i = 0; i < gameOptions.rows; i ++){
            for(let j = 0; j < gameOptions.columns; j ++){
                if(this.gameArray[i][j].value == 0){
                    return false;
                }
            }
        }
        return true;
    }

ReactDOM.render(<App />, document.getElementById("root"));