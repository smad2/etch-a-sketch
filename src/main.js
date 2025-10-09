document.addEventListener('DOMContentLoaded', () => {

    const dom = {
        sketch: document.getElementById('sketch'),
        borders: document.getElementById('grid-borders-toggle'),
        gridSize: document.getElementById('grid-size'),
        gridSizeDisplay: document.getElementById('grid-size-value'),
        colorPicker: document.getElementById('color-picker'),
        clearBtn: document.getElementById('clear'),
        eraserBtn: document.getElementById('eraser'),
        eyeDropper: document.getElementById('eye-dropper'),
        eyeDropperOn: false,
        rainbowBtn: document.getElementById('rainbow-mode'),
        darkBtn: document.getElementById('darkening-mode'),
        clickOn: false,
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

    const totalCells = grid * grid;
    const cellPercentage = (100 / grid).toFixed(6);
    const fragment = document.createDocumentFragment();

    const getRandomRainbowColor = () => {
        return dom.rainbowColors[Math.floor(Math.random() * dom.rainbowColors.length)]
    };

    const darkenColour = (color, count) => {
        if (!color) color = dom.white;
        if (count === 15) return dom.black;

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
        if (!dom.clickOn || dom.eyeDropperOn) return;
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


    function addMultiEvent(element, events, handler) {
        events.forEach(event => element.addEventListener(event, handler));
    }

    const handleTouchMove = (e) => {
        if (dom.clickOn) {
            e.preventDefault();

            for (let i = 0; i < e.touches.length; i++) {
                const touch = e.touches[i];

                const element = document.elementFromPoint(touch.clientX, touch.clientY);

                if (element && element.classList.contains('grid-item')) {
                    const simulatedEvent = { target: element };
                    changeColor(simulatedEvent);
                }
            }
        }
    };


    addMultiEvent(dom.sketch, ['mousedown', 'touchstart'], (e) => {
        if (e.target.classList.contains('grid-item')) {
            e.preventDefault();
            dom.clickOn = true;
            changeColor(e);
        }
    });

    dom.sketch.addEventListener('mouseover', (e) => {
        if (!dom.eyeDropperOn && dom.clickOn && e.target.classList.contains('grid-item')) {
            changeColor(e);
        }
    });

    dom.sketch.addEventListener('touchmove', handleTouchMove);

    addMultiEvent(dom.sketch, ['mouseup', 'touchend', 'touchcancel'], (e) => {
        if (dom.clickOn && e.target.classList.contains('grid-item')) {
            dom.clickOn = false;

        }
    });


    dom.sketch.addEventListener('click', (e) => {
        if (e.target.classList.contains('grid-item')) {
            if (dom.eyeDropperOn) {
                dom.colorPicker.value = e.target.style.backgroundColor || dom.white;
                dom.eyeDropperOn = false;
                dom.eyeDropper.classList.remove('active');
                document.body.classList.remove('eye-dropper-mode');
                return;
            }
            changeColor(e);
        }
    });


    for (let i = 0; i < totalCells; i++) {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');
        if (dom.borders.checked) gridItem.classList.add('grid-item-border');
        gridItem.style.width = `${cellPercentage}%`;
        gridItem.style.height = `${cellPercentage}%`;
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
        deactivateAllButtons(dom.eraserBtn.getAttribute('id'));
        dom.eraserBtn.classList.toggle('active');
    });

    dom.eyeDropper.addEventListener('click', () => {
        deactivateAllButtons(dom.eyeDropper.getAttribute('id'));
        dom.eyeDropper.classList.add('active');
        document.body.classList.add('eye-dropper-mode');
        dom.eyeDropperOn = true;
    })

    dom.colorPicker.addEventListener('click', () => {
        deactivateAllButtons('');
    });
    dom.rainbowBtn.addEventListener('click', () => {
        deactivateAllButtons(dom.rainbowBtn.getAttribute('id'));
        dom.rainbowBtn.classList.toggle('active');
    });

    dom.darkBtn.addEventListener('click', () => {
        deactivateAllButtons(dom.darkBtn.getAttribute('id'));
        dom.darkBtn.classList.toggle('active');
    });
}