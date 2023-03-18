   const easy = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
  ];
  const medium = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
  ];
  const hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
  ];

  //create variable
  var timer;
  var timeRemaining;
  var lives;
  var selectedNum;
  var selectedTile;
  var disableSelect;

  window.onload=function(){
      //run startgame function when button is clicked
      id("start-btn").addEventListener("click", startGame);
      //add  event list ner to each number in number container
      for(let i=0;i<id("number-container").children.length;i++)
      {
          id("number-container").children[i].addEventListener("click",function(){
                       //if selecting is not disabled 
                       if(!disableSelect)
                         {
                             //if number is allrady selected 
                            if(this.classList.contains("selectrf"))
                          {  //then remove selectioon
                            this.classList.remove("selected");
                            selectedNum=null;
                          }else{
                              //deselect all otheer numbeers
                              for(let i=0;i<9;i++){
                                  id("number-container").children[i].classList.remove("selected");
                              }
                              //select it and update selectNum variable
                              this.classList.add("selected");
                              selectedNum =this;
                              updateMove();
                          }
                        } 
         });
      }
  }
  function startGame(){
   //choose board difficulty
    let board;
   if(id("diff-1").checked) board = easy[0];
   else if(id("diff-2").checked) board= medium[0];
   else board =hard[0];
   //set liver to 3 and enable selecting number and title
   lives = 3;
   disableSelect =false;
   id("lives").textContent ="Lives Remaining : " + lives;
   //creates board based on difficulty
   generateBoard(board);
   //start the timer
   startTimer();
   //sets theme based on input
   if(id("theme-1").checked){
       qs("body").classList.remove("dark");
   }
   else{
       qs("body").classList.add("dark");
   }
   //show number container
   id("number-container").classList.remove("hidden");
  }
  function startTimer(){
      //set time remaining
      if(id("time-1").checked) timeRemaining = 300    ;
      else if(id("time-2").checked) timeRemaining =600;
      else timeRemaining =1200;
      //sets timer for first second
      id("timer").textContent=timeConversion(timeRemaining);
      //set timer to update every second
      timer=setInterval(function() {
          timeRemaining --;
          //if no time remaiing end the game 
          if(timeRemaining ===0) endGame();
          id("timer").textContent =timeConversion(timeRemaining);
      },1000);
  }
  //convert seconds into string of mm:ss format
  function timeConversion(time)
  {let minutes = Math.floor(time/60);
    if(minutes < 10) minutes ="0" + minutes;
    let seconds = time % 60;
    if(seconds < 10) seconds ="0" + seconds;
    return minutes + ":" + seconds;

  }
  function generateBoard(board){
      //clear privous board;
      clearPrevious();
      //let used to increment tile ids 
      let idCount = 0;
      //create 81 tiles
      for(let i=0;i<81;i++){
          //ceate a new paragraph element 
          let tile =document.createElement("p");
          //if the tile is not blank
          if(board.charAt(i)!="-"){//set tile text to correct number
            tile.textContent =board.charAt(i);
          }
          else{
              //add click event listener to tile
              tile.addEventListener("click",function(){
                  //if selecting is not disabled
                  if(!disableSelect)
                  {
                      //if the tile is alrady selected
                      if(tile.classList.contains("selected")){
                          //then remove seletion 
                          tile.classList.remove("selected");
                          selectedTile = null;
                      }else {
                          //deselect all other tiles
                          for(let i=0;i<81;i++){
                              qsa(".tile")[i].classList.remove("selected");
                          }
                          //add selection and update variable
                          tile.classList.add("selected");
                          selectedTile =tile;
                          updateMove();
                      }
                  }
              });
          }
          //assign tile id 
          tile.id=idCount;//increment for next tile
          idCount++;
          //add tile class to all tiles
          tile.classList.add("tile");
          if((tile.id>17 && tile.id <27 )||(tile.id>44 && tile.id<54)){
              tile.classList.add("bottomBorder");
          }
          if((tile.id+1)%9==3||(tile.id+1)%9==6){
              tile.classList.add("rightBorder");
          }
          //add tile to board
          id("board").append(tile);
      }
  }
  function updateMove()
  {
      //if a tile and a number is selected
      if(selectedTile && selectedNum){
          //set the tile to the correct number
          selectedTile.textContent =selectedNum.textContent;
          //if the number matches the corsponding number in the solution key
          if(checkCorrect(selectedTile)){
             //deselect the tiles
             selectedTile.classList.remove("selected");
             selectedNum.classList.remove("selected");
             //clear the selected variables
             selectedNum =null;
             selectedTile=null;
             //check if boarder is completed
             if(checkDone()){
                 endGame();
             }
             //if the number does not match the solution key
          }else{
              //disable selected new number for one second
              disableSelect =true;
              //make the tiles turn red
              selectedTile.classList.add("incorrect");
              //run in one second
              setTimeout(function(){
                 //suntrect  lives by one
                 lives --;
                 //if no lives left
                 if(lives ===0) {
                     endGame();
                 }else{
                 //if lives not 0
                 //update lives text
                 id("lives").textContent ="Lives Remaining:"+ lives;
                 //renable selecting number and tiles
                 disableSelect = false;
                 }
                 //restore tile color and remove selected from both
                 selectedTile.classList.remove("incorrect");
                 selectedTile.classList.remove("selected");
                 selectedNum.classList.remove("selected");
                 //clear the tiles text and cleare selected variables
                 selectedTile.textContent ="";
                 selectedTile=null;
                 selectedNum=null;
              },1000);
          }
      }
  }
  function checkDone()
  {
      let tiles =qsa(".tile");
      for(let i=0;i<tiles.length;i++){
          if(tiles[i].textContent=== "") return false;
      }
      return true;
  }
  function endGame(){
      //disable moves and stop the timer
      disableSelect =true;
      clearTimeout(timer);
      //display win or loss message;
      if(lives ==0 || timeRemaining==0){
          id("lives").textContent="you lost!"
      }
      else{
          id("lives").textContent ="you win!";
      }
  }
  function checkCorrect(tile){
      //set solution based on difficulty selection 
      let solution;
      if(id("diff-1").checked)solution =easy[1];
      else if(("diff-2").checked) solution =medium[1];
      else solution = hard[1];
      //if tiles number is equal to solution number
      if(solution.charAt(tile.id)===tile.textContent) return true ;
      else return false;
  }
  function clearPrevious()
  {//access all of the titles
      let tiles = qsa(".tile");
      //remove each title
      for(let i=0;i<tiles.length;i++)
      {
          tiles[i].remove();
      }
      //if there is a timer clear it 
      if(timer) clearTimeout(timer);
      //deselect any numbers
      for(let i=0;i<id("number-container").children.length;i++){
          id("number-container").children[i].classList.remove("selected");
      }
      //clear selected variables
      selectedTile=null;
      selectedNum=null;
  }
  function id(id){
      return document.getElementById(id);
  }
  function qs(selector){
      return document.querySelector(selector);
  }
  function qsa(selector){
      return document.querySelectorAll(selector);
  }