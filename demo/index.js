// const elementConfig = [
//     { selector: "*", draggable: true, droppable: true, selectable: true, hoverable: true},
//     { selector: "h1, h2", draggable: true, droppable: true, selectable: true, hoverable: true}
// ].reverse();
// let configElement = document.getElementById('a')
// configElement.elementConfig = elementConfig;
// console.log('elementConfig', configElement.elementConfig)


setTimeout(() => {
    const configElement = document.querySelector('script#c');
    // configElement.innerText =  `[
    //             { selector: "*", draggable: true, droppable: true, selectable: true, hoverable: true},
    //             { selector: "h1, h3", draggable: true, droppable: true, selectable: true, hoverable: true}
    //         ];`
    configElement.innerHTML = `[
                { selector: "*", draggable: true, droppable: true, selectable: true, hoverable: true},
                { selector: "h1, h3", draggable: true, droppable: true, selectable: true, hoverable: true}
            ];`
            console.log(configElement.innerHTML)
}, 3000);

function malformedJSON2Array (tar) {
    var arr = [];
    tar = tar.replace(/^\{|\}$/g,'').split(',');
    for(var i=0,cur,pair;cur=tar[i];i++){
        arr[i] = {};
        pair = cur.split(':');
        arr[i][pair[0]] = /^\d*$/.test(pair[1]) ? +pair[1] : pair[1];
    }
    return arr;
}