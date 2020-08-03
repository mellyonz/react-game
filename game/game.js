let game;
let gameOptions = {
    rows: 6,
    columns: 6,
    tileSize: 100
}
let level = [
    [2, 0, 2, 0, 1, 2],
    [0, 2, 0, 2, 2, 0],
    [2, 0, 2, 1, 0, 1],
    [0, 1, 2, 0, 1, 2],
    [2, 2, 0, 2, 1, 0],
    [1, 0, 1, 1, 0, 2]
]
window.onload = function() {
    let gameConfig = {
        type: Phaser.AUTO,
        backgroundColor: 0x444444,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: "thegame",
            width: 1200,
            height: 600
        },
       scene: playGame
    }
    game = new Phaser.Game(gameConfig);
}
class playGame extends Phaser.Scene{
    constructor(){
        super("PlayGame");
    }
    preload(){
        this.load.spritesheet("tiles", "tiles.png", {
            frameWidth: gameOptions.tileSize,
            frameHeight: gameOptions.tileSize
        });
    }
    create(){
        this.gameArray = [];
        for(let i = 0; i < gameOptions.rows; i ++){
            this.gameArray[i] = [];
            for(let j = 0; j < gameOptions.columns; j ++){
                let tile = this.add.sprite(j * gameOptions.tileSize, i * gameOptions.tileSize, "tiles", level[i][j]);
                tile.setOrigin(0);
                this.gameArray[i][j] = {
                    value: level[i][j],
                    isFixed: level[i][j] != 0,
                    sprite: tile
                }
            }
        }
        this.input.on("pointerdown", this.changeTile, this);
        this.gameText = this.add.text(620, 20, "", {
            fontFamily: "Arial",
            fontSize: 24
        });
    }
    changeTile(pointer){
        let row = Math.floor(pointer.y / gameOptions.tileSize);
        let col = Math.floor(pointer.x / gameOptions.tileSize);
        if(this.gameArray[row] != undefined && this.gameArray[row][col] != undefined && !this.gameArray[row][col].isFixed){
            this.gameArray[row][col].value = Phaser.Math.Wrap(this.gameArray[row][col].value + 1, 0, 3);
            this.gameArray[row][col].sprite.setFrame(2 * this.gameArray[row][col].value + this.gameArray[row][col].value % 2);
            this.checkRules();
        }
    }
    checkRules(){
        let rowsContent = [];
        let colsContent = [];
        let messageString = "";
        for(let i = 0; i < gameOptions.rows; i ++){
            if(this.threeConsecutiveInRow(i)){
                messageString += "3 or more consecutive symbols at row " + i + "\n";
            }
            if(this.unbalancedRow(i)){
                messageString += "different amount of symbols at row " + i + "\n";
            }
            if(this.duplicatedRow(i)){
                messageString += "identical row at row " + i + "\n";
            }
        }
        for(let i = 0; i < gameOptions.columns; i ++){
            if(this.threeConsecutiveInColumn(i)){
                messageString += "3 or more consecutive symbols at column " + i + "\n";
            }
            if(this.unbalancedColumn(i)){
                messageString += "different amount of symbols at column " + i + "\n";
            }
            if(this.duplicatedColumn(i)){
                messageString += "identical column at column " + i + "\n";
            }
        }
        if(messageString == "" && this.boardCompleted()){
            messageString = "LEVEL COMPLETED";
        }
        this.gameText.setText(messageString);
    }
    threeConsecutiveInColumn(column){
        for(let i = 2; i < gameOptions.rows; i ++){
            let element = this.gameArray[i][column].value;
            if(element == this.gameArray[i - 1][column].value && element == this.gameArray[i - 2][column].value){
                return true;
            }
        }
        return false;
    }
    threeConsecutiveInRow(row){
        for(let i = 2; i < gameOptions.columns; i ++){
            let element = this.gameArray[row][i].value;
            if(element == this.gameArray[row][i - 1].value && element == this.gameArray[row][i - 2].value){
                return true;
            }
        }
        return false;
    }
    unbalancedColumn(column){
        let values = [0, 0];
        for(let i = 0; i < gameOptions.rows; i ++){
            values[0] += (this.gameArray[i][column].value == 1) ? 1 : 0;
            values[1] += (this.gameArray[i][column].value == 2) ? 1 : 0;
        }
        return (values[0] + values[1] == gameOptions.rows) && (values[0] != gameOptions.rows / 2 || values[1] != gameOptions.rows / 2);
    }
    unbalancedRow(row){
        let values = [0, 0];
        for(let i = 0; i < gameOptions.columns; i ++){
            values[0] += (this.gameArray[row][i].value == 1) ? 1 : 0;
            values[1] += (this.gameArray[row][i].value == 2) ? 1 : 0;
        }
        return  (values[0] + values[1] == gameOptions.columns) && (values[0] != gameOptions.columns / 2 || values[1] != gameOptions.columns / 2);
    }
    duplicatedColumn(column){
        for(let i = 0; i < gameOptions.columns; i ++){
            if(i != column && this.columnValue(column) != 0 && this.columnValue(i) != 0 && this.columnValue(i) == this.columnValue(column)){
                return true
            }
        }
        return false;
    }
    duplicatedRow(row){
        for(let i = 0; i < gameOptions.rows; i ++){
            if(i != row && this.rowValue(row) != 0 && this.rowValue(i) != 0 && this.rowValue(i) == this.rowValue(row)){
                return true
            }
        }
        return false;
    }
    columnValue(column){
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
    rowValue(row){
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
    boardCompleted(){
        for(let i = 0; i < gameOptions.rows; i ++){
            for(let j = 0; j < gameOptions.columns; j ++){
                if(this.gameArray[i][j].value == 0){
                    return false;
                }
            }
        }
        return true;
    }
}
