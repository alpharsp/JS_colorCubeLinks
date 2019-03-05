function objectLength(jsObject){
  var total=0;
  for (var item in jsObject){
    total++;
  }
  return total;
}

function randomColor(colors){
  //colors is an array of strings with color names
  //Example ["red","green","blue"]
  return colors[Math.floor(Math.random()*colors.length)];
}

function randomColors(side,colors){
  var i;
  var myHash={}
  for (i=1; i<=side*side; i++){
    myHash[i]=randomColor(colors);
  }
  return myHash;
}

function drawCube(colorsHash, cubeTable){
  //colorsArray is a linearArray created using function randomColors
  //cubeTable is a html table tag
  var innerCode=""
  var index=1;
  var totBlocks=objectLength(colorsHash);
  var side=Math.sqrt(totBlocks);
  for (var i=1; i<=side; i++){
    //for each row
    innerCode+="<tr>\n";
    for (var j=1; j<=side; j++){
      //each element
      var myClass=colorsHash[index];
      innerCode+="\t<td class='square " + myClass + "'" + " id='cube" + index + "' ></td>\n"
      index++;
    }
    innerCode+="</tr>\n";
  }
  cubeTable.innerHTML=innerCode;
}

function lToC(position){
  var x=((position-1)%5)+1;
  var y=Math.floor((position-1)/5)+1;
  return [y,x];
}

function cToL(y, x){
  position=((y-1)*5)+x;
  return position;
}

function getNeighbors(colorsHash, position){
  /*A neighbor is considered one of the 8 blocks around the target.
  Not every block has 8 neighbors*/
  /*colorHash is the js object containing all the colors, usually generated
  using the random colors function*/
  //position is the linear position of the colorblock to evaluate
  var coor=lToC(position);
  var sides=Math.sqrt(objectLength(colorsHash));
  var y=coor[0];
  var x=coor[1];
  var neighbors=[];
  var index=0;
  if (y>1) {minI=y-1;} else {minI=1;}
  if (x>1) {minJ=x-1;} else {minJ=1;}
  if (y<sides-1) {maxI=y+1} else {maxI=sides;}
  if (x<sides-1) {maxJ=x+1} else {maxJ=sides;}
  for (var i=minI; i<=maxI; i++){
    for (var j=minJ; j<=maxJ; j++){
      var neighbor = cToL(i,j);
      if (neighbor!=position){
        neighbors[index]=neighbor;
        index++;
      }
    }
  }
  return neighbors;
}

function itemColor(colorHash, position){
  return colorHash[position];
}

function getConnectionsRecursion(colorHash, position, involvedItems){
  //don't call this directly on the main program, call getConnections() instead
  var connections=involvedItems[0];
  var itemsExplored=involvedItems[1];
  var color = itemColor(colorHash, position);
  itemsExplored[position]=color;
  connections[position]=color;
  var neighbors= getNeighbors(colorHash, position);
  //Iterates through every neighbor
  for (var neighbor of neighbors){
    if (itemsExplored[neighbor]==undefined){
      //If the neighbor was not already explored then do the following
      var neighborColor=colorHash[neighbor];
      //if the neighbor color is the same color as the block being evaluated
      if (neighborColor===color){
        //if the connection is not already part of the connections,
        //call recursion to add it and explore its neighbors
        if(connections[neighbor]==undefined){
          involvedItems = getConnectionsRecursion(colorHash, neighbor, involvedItems);
        }
      }
      //mark as explored before leaving
      itemsExplored[neighbor]=color;
    }
  }
  return involvedItems;
}

function getConnections(colorHash,position){
  var itemsExplored={};
  var connections={}
  involvedItems=[connections,itemsExplored];
  var color=colorHash[position];
  var connections = getConnectionsRecursion(colorHash,position,involvedItems)[0];
  return connections;
}

function getLargestSet(colorHash){
  var blocksLeft=colorHash;
  var tot= objectLength(blocksLeft);
  var largestSet={}
  var largestSetLength=0;
  for (var i=1; i<=tot; i++){
    //Not efficient it checks every single block again
      var tempSet= getConnections(colorHash, i);
      var setLength = objectLength(tempSet);
      if (setLength>largestSetLength){
        largestSet=tempSet;
        largestSetLength=setLength;
      }
  }
  return largestSet;
}

//mainProgram------------------------------------------------------------------
sides=5;
var colors=["red","green","blue"];
var cubeTable= document.getElementById("colorBlocks");
colorBlocks=randomColors(sides, colors);
drawCube(colorBlocks,cubeTable);

function highlightBlocks(colorHash=colorBlocks){
  var HLitems=getLargestSet(colorHash);
  var tot=objectLength(colorHash)
  for (var i=1; i<=tot; i++){
    var highLight=HLitems[i]!=undefined; //true if number part og HLitems
    var blockHTML = document.querySelector("#cube" + i);
    var color=blockHTML.className.split(" ")[1];
    if (highLight){
      blockHTML.className= "square " + color + " highLight";

    }
    else{
      blockHTML.className= "square " + color + " noHighLight";
    }
  }
}

function unhighlightBlocks(colorHash=colorBlocks){
  var tot=objectLength(colorHash)
  for (var i=1; i<=tot; i++){
    var blockHTML = document.querySelector("#cube" + i);
    var color=colorHash[i];
    blockHTML.className= "square " + color;
  }
}
