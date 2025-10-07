document.addEventListener('DOMContentLoaded', () => {

    const dom = {
        sketch: document.getElementById('sketch')
    }


    createGrid(dom, 100);

});


function createGrid(dom, grid) {

    const sketchWidth = dom.sketch.clientWidth;
    const sketchHeight = dom.sketch.clientHeight;


    const totalCells = grid * grid;
    const cellWidth = sketchWidth / grid;
    const cellHeight = sketchHeight / grid;

    const changeColor = (e) => {
        e.target.style.backgroundColor = "black";
    }

    for (let i = 0; i < totalCells; i++) {

        const grid = document.createElement('div');
        grid.classList.add('grid');
        grid.style.width = cellWidth + "px";
        grid.style.height = cellHeight + "px";

        grid.addEventListener('mouseover', changeColor);

        dom.sketch.appendChild(grid);

    }

}