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
        darkBtn: document.getElementById('darkening-mode'),

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

        black: '#000000',
        white: '#ffffff',



    }

    dom.rainbowBtn.classList.remove('active');
    dom.colorPicker.value = dom.black;
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

    const colorToRgba = (color, opacity) => {
        if (color.charAt(0) === "#") {
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5), 16);

            return `rgba(${r},${g},${b},${opacity})`;
        } else if (color.startsWith("rgb(")) {
            const rgb = color.slice(4, -1).replaceAll(" ", "").split(",");
            return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${opacity})`;
        }

    }

    const darkenColour = (color, count) => {
        if (!color) color = dom.white;
        if (count===15) return dom.black;

        let r, g, b;

        if (color.charAt(0) === "#") {
            r = parseInt(color.slice(1, 3), 16);
            g = parseInt(color.slice(3, 5), 16);
            b = parseInt(color.slice(5), 16);

        } else if (color.startsWith("rgb(")) {
            const rgb = color.slice(4, -1).replaceAll(" ", "").split(",");
            r = parseInt(rgb[0]);
            g = parseInt(rgb[1]);
            b = parseInt(rgb[2]);
        }

        return `rgb(${Math.floor(r * 0.9)}, ${Math.floor(g * 0.9)}, ${Math.floor(b * 0.9)})`;

    }

    const changeColor = (e) => {
        if (dom.eraserBtn.classList.contains('active')) {
            e.target.style.backgroundColor = dom.white;
            return;
        }
        else if (dom.rainbowBtn.classList.contains('active')) {
            dom.colorPicker.value = getRandomRainbowColor();
        } else if (dom.darkBtn.classList.contains('active')) {
            let count = parseInt(e.target.dataset.interactionCount) || 0;

            if (count < 15) {
                count++;
                e.target.dataset.interactionCount = count;
                e.target.style.backgroundColor = darkenColour(e.target.style.backgroundColor, count);
            }
            return;

        }

        e.target.style.backgroundColor = dom.colorPicker.value;
    }

    for (let i = 0; i < totalCells; i++) {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');
        if (dom.borders.checked) gridItem.classList.add('grid-item-border');

        gridItem.style.width = `${cellPercentage}%`;
        gridItem.style.height = `${cellPercentage}%`;
        gridItem.addEventListener('click', changeColor);
        gridItem.addEventListener('mousedown', () => {console.log('EYUEYEY')});


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
            grid.style.backgroundColor = dom.white;
        });
    });

    const deactivateAllButtons = (id) => {
        const allActivatedButons = Array.from(document.querySelectorAll("button"));
        const actives = allActivatedButons.filter(button => button.classList.contains('active') && button.getAttribute('id') !== id);
        actives.map(button => button.classList.remove('active'));
    }

    dom.eraserBtn.addEventListener('click', () => {
        // dom.rainbowBtn.classList.remove('active');
        deactivateAllButtons(dom.eraserBtn.getAttribute('id'));
        dom.eraserBtn.classList.toggle('active');

    });

    dom.colorPicker.addEventListener('click', () => {
        deactivateAllButtons('');
        // dom.rainbowBtn.classList.remove('active');
        // dom.eraserBtn.classList.remove('active');

    });
    dom.rainbowBtn.addEventListener('click', () => {
        deactivateAllButtons(dom.rainbowBtn.getAttribute('id'));
        // dom.eraserBtn.classList.remove('active');
        dom.rainbowBtn.classList.toggle('active');

    });

    dom.darkBtn.addEventListener('click', () => {
        deactivateAllButtons(dom.darkBtn.getAttribute('id'));
        dom.darkBtn.classList.toggle('active');


    });




}