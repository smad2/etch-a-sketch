document.addEventListener('DOMContentLoaded', () => {

    const dom = {
        sketch: document.getElementById('sketch'),
        borders: document.getElementById('grid-borders-toggle'),
        gridSize: document.getElementById('grid-size'),
        gridSizeDisplay: document.getElementById('grid-size-value'),
        colorPicker: document.getElementById('color-picker'),
        clearBtn: document.getElementById('clear'),
        rainbowBtn: document.getElementById('rainbow-mode'),
        eraserBtn: document.getElementById('eraser'),

        rainbowColors: [
            '#FF355E', // Rojo vibrante
            '#FF6037', // Naranja coral
            '#FF9966', // Melocotón
            '#FFCC33', // Amarillo dorado
            '#CCFF00', // Verde lima
            '#66FF66', // Verde menta
            '#50BFE6', // Azul brillante
            '#FF6EFF', // Rosa neón
            '#EE34D2', // Rosa fucsia
            '#FF00CC', // Magenta
            '#9D00FF', // Púrpura eléctrico
            '#8D38C9'  // Violeta intenso
        ],


    }

    dom.rainbowBtn.classList.remove('active');
    dom.colorPicker.value = "#000000";
    createGrid(dom, dom.gridSize.value);
    createListeners(dom);

});


function createGrid(dom, grid) {

    dom.sketch.innerHTML = '';
    dom.gridSizeDisplay.textContent = `${grid}x${grid}`;

    const sketchSize = 600;
    const totalCells = grid * grid;

    const cellPercentage = (100 / grid).toFixed(6);

    const fragment = document.createDocumentFragment();

    const getRandomRainbowColor = () => {
        return dom.rainbowColors[Math.floor(Math.random() * dom.rainbowColors.length)]
    }

    const changeColor = (e) => {
        if(dom.eraserBtn.classList.contains('active')){
            e.target.style.backgroundColor = "white";
            return;
        }
        else if (dom.rainbowBtn.classList.contains('active')) {
            dom.colorPicker.value = getRandomRainbowColor();
        }


        e.target.style.backgroundColor = dom.colorPicker.value;
    }

    for (let i = 0; i < totalCells; i++) {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');
        if (dom.borders.checked) gridItem.classList.add('grid-item-border');

        gridItem.style.width = `${cellPercentage}%`;
        gridItem.style.height = `${cellPercentage}%`;

        gridItem.addEventListener('mouseover', changeColor);
        fragment.appendChild(gridItem);
    }

    dom.sketch.appendChild(fragment);

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

    dom.gridSize.addEventListener('input', () => {
        createGrid(dom, dom.gridSize.value);
    });

    dom.clearBtn.addEventListener('click', () => {
        const grids = document.querySelectorAll(".grid-item");
        grids.forEach((grid) => {
            grid.style.backgroundColor = "white";
        });
    });
    
    dom.eraserBtn.addEventListener('click', () => {
        dom.rainbowBtn.classList.remove('active');
        dom.eraserBtn.classList.toggle('active');

    });

    dom.colorPicker.addEventListener('click', () => {
        dom.rainbowBtn.classList.remove('active');
        dom.eraserBtn.classList.remove('active');

    });
    dom.rainbowBtn.addEventListener('click', (e) => {
        dom.eraserBtn.classList.remove('active');
        dom.rainbowBtn.classList.toggle('active');

    });




}