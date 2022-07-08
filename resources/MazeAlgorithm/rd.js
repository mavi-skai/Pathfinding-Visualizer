const timer = ms => new Promise(res => setTimeout(res, ms))




export const rd_maze_algorithm = async (gridarray, start, end, row, col) => {
    debugger
    const nodesToAnimate = []
    for(let x=0;x<row;x++){
        for(let y=0;y<col;y++){
            if(y===0 || y===53){
                nodesToAnimate.push(gridarray[x][y]);
            }
            if(x=== 0 || x === 18){
                nodesToAnimate.push(gridarray[x][y]);
            }
        }
    }
    await timer(300);
    
    const isPassage = Array.from({ length: row }, () => Array.from({ length: col }, () => false));
    let firstRow = 1;
    let lastRow = gridarray.length - 2;
    let firstCol = 1;
    let lastCol =  col - 2;

    let orientation = chooseOrientation(gridarray,firstRow,lastRow,firstCol,lastCol)
    devide(gridarray,firstRow,lastRow,firstCol,lastCol,orientation,nodesToAnimate,isPassage)
    

}


const chooseOrientation = (gridarray,firstRow,lastRow,firstCol,lastCol) => {
    let width = lastCol-firstCol
    let height = lastRow - firstRow
    if(width>height){
        return 'Vertical'
    }
    else if(height>width){
        return 'Horizontal'
    }
    else{
        const num = Math.random();
        return (num<0.5) ? 'Vertical' : 'Horizontal'
    }
}

const devide = (gridarray,firstRow,lastRow,firstCol,lastCol,orientation,nodesToAnimate,isPassage) => {
    let width = lastCol - firstCol + 1
    let height = lastRow - firstRow + 1

    let firstValidRow = firstRow
    let lastValidRow = lastRow
    let firstValidCol = firstCol
    let lastValidCol = lastCol

    if(orientation=='Vertical'){
        firstValidRow +=1
        lastValidRow -=1
    }
    else{
        firstValidCol+=1
        lastValidCol-=1
    }

    let validWidth = lastValidCol - firstValidCol + 1
    let validHeight = lastValidRow - firstValidRow + 1

    if(width<2 || height<2 || validHeight<1 || validWidth<1) return

    if(orientation=='Horizontal'){
        let rowIdxToBeWall = Math.floor(Math.random()* validHeight) + firstValidRow;

        let passageIdx;
        if (isPassage[rowIdxToBeWall][firstCol-1]){
			 passageIdx = firstCol;
		} else if (isPassage[rowIdxToBeWall][lastCol+1]){
			 passageIdx = lastCol;
		} else {
			 passageIdx = Math.random()>0.5 ? firstCol: lastCol; // random end assignment
        }

        gridarray[rowIdxToBeWall].foreach((node,index)=>{
            if(node.cell.className == 'START' || node.cell.className == 'END'){
                isPassage[rowIdxToBeWall][index] = true
            }
            if(isPassage[rowIdxToBeWall][index]) return
            if(index<firstValidCol || index>lastValidCol) return
            if(index == passageIdx){
                isPassage[rowIdxToBeWall][index] = true
                return
            }
            nodesToAnimate.push(node)
        })

        let orientation = chooseOrientation(gridarray,firstRow,rowIdxToBeWall-1,firstCol,lastCol);
        devide(gridarray,firstRow,rowIdxToBeWall-1,firstCol,lastCol,orientation,nodesToAnimate,isPassage);

        orientation = chooseOrientation(gridarray,rowIdxToBeWall+1,lastRow,firstCol,lastCol);
        devide(gridarray,rowIdxToBeWall+1,lastRow,firstCol,lastCol,orientation,nodesToAnimate,isPassage);
    }
    else{
        let colIdxToBeWall = Math.floor(Math.random()* validWidth ) + firstValidCol;

        let passageIdx;
        if (firstRow-1>=0 && isPassage[firstRow-1][colIdxToBeWall]){
			passageIdx = firstRow;
		} else if (lastRow+1<grid.length && isPassage[lastRow+1][colIdxToBeWall]){
			passageIdx = lastRow;
		} else {
			passageIdx = Math.random()>0.5 ? firstRow: lastRow; // random end assignment
		}

        // gridarray.foreach((row,index) => {
        //     if(index<firstValidRow || index>lastValidRow) return
        //     if(index == passageIdx){
        //         isPassage[index][colIdxToBeWall] = true
        //         return
        //     }
            
        //     row.foreach((node,idx)=>{
        //         if(node.cell.className == 'START' || node.cell.className == 'END'){
        //             isPassage[index][idx] = true
        //         }
        //         if(isPassage[index][idx]) return
    
        //         idx==colIdxToBeWall && nodesToAnimate.push(node)
        //     })})

        // orientation = chooseOrientation(gridarray,firstRow,lastRow,firstCol,colIdxToBeWall-1);
        // devide(gridarray,firstRow,lastRow,firstCol,colIdxToBeWall - 1 ,orientation,nodesToAnimate,isPassage);


        // //right side
        // orientation = chooseOrientation(gridarray,firstRow,lastRow,colIdxToBeWall + 1,lastCol);
        // devide(gridarray,firstRow,lastRow,colIdxToBeWall + 1, lastCol ,orientation,nodesToAnimate,isPassage);
    }
}