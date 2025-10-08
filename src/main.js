document.addEventListener('DOMContentLoaded', () => {

    const dom = {
        sketch: document.getElementById('sketch'),
        borders: document.getElementById('grid-borders-toggle')

    }


    createGrid(dom, 10);
    createListeners(dom);

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
        grid.classList.add('grid-item');
        grid.classList.add('grid-item-border');


        grid.style.width = cellWidth + "px";
        grid.style.height = cellHeight + "px";

        grid.addEventListener('mouseover', changeColor);

        dom.sketch.appendChild(grid);

    }

}

function createListeners(dom) {
    dom.borders.checked = "true"

    const toggleBorders = () => {
        const grids = document.querySelectorAll(".grid-item");
        grids.forEach((grid) => {
            grid.classList.toggle('grid-item-border')
        });

    }

    dom.borders.addEventListener('change', toggleBorders);


}