// make an array from start, end and no. steps. like Matlab linspace
function makeArr(startValue, stopValue, cardinality, round=false) {
    var arr = [];
    if (cardinality == 1) {
        arr.push(stopValue);
    } else {
    var step = (stopValue - startValue) / (cardinality - 1);
        for (var i = 0; i < cardinality; i++) {
            let val = startValue + (step * i);
            arr.push(round? Math.round(val): val);
        }
    }
    return arr;
  }

// make a js rgba gradient map 
function makeHeatMap(a,b,steps) {
    //a start colour format rgba
    //b end colour format rgba
    //i no of steps in gradient array
    let arr = []
    for(i=0; i < a.length; i++) {
        if (i<3){
            arr.push(makeArr(b[i],a[i],steps,true))
        } else {
            arr.push(makeArr(b[i],a[i],steps,false)) //opacity is a float
        }
    }
    // 
    let arr2 = []
    let opac = (4 == a.length)?true:false;
    for(i=0; i< arr[0].length;i++){
        if(opac){
            let val = [arr[0][i], arr[1][i], arr[2][i],arr[3][i]]
            arr2.push(val)
        } else {
            let val = [arr[0][i], arr[1][i], arr[2][i]]
            arr2.push(val)
        }
    }
    return arr2
}

let arrToRgba = arr => 'rgba('+arr+')'


// let a = [1, 20, 200, 0];
// let b = [200, 20, 10, 1];
// steps = 10;
// let arr = []
// console.log(makeHeatMap(a,b,10))
