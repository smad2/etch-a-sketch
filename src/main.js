document.addEventListener("DOMContentLoaded", () => {
  const dom = {
    sketch: document.getElementById("sketch"),
    borders: document.getElementById("grid-borders-toggle"),
    gridSize: document.getElementById("grid-size"),
    gridSizeDisplay: document.getElementById("grid-size-value"),
    colorPicker: document.getElementById("color-picker"),
    clearBtn: document.getElementById("clear"),
    eraserBtn: document.getElementById("eraser"),
    eyeDropper: document.getElementById("eye-dropper"),
    eyeDropperOn: false,
    rainbowBtn: document.getElementById("rainbow-mode"),
    darkBtn: document.getElementById("darkening-mode"),
    clickOn: false,
    rainbowColors: [
      "#FF355E",
      "#FF6037",
      "#FF9966",
      "#FFCC33",
      "#CCFF00",
      "#66FF66",
      "#50BFE6",
      "#FF6EFF",
      "#EE34D2",
      "#FF00CC",
      "#9D00FF",
      "#8D38C9",
    ],

    black: "#000000",
    white: "#ffffff",
    toggleEyeDropper: function () {
      this.eyeDropper.classList.toggle("active");
      document.body.classList.toggle("eye-dropper-mode");
      this.eyeDropperOn = !this.eyeDropperOn;
    },
  };

  dom.rainbowBtn.classList.remove("active");
  dom.colorPicker.value = dom.black;
  createGrid(dom, dom.gridSize.value);
  createListeners(dom);
});

function createGrid(dom, grid) {
  dom.sketch.innerHTML = "";
  dom.gridSizeDisplay.textContent = `${grid}x${grid}`;

  const totalCells = grid * grid;
  const cellPercentage = (100 / grid).toFixed(6);
  const fragment = document.createDocumentFragment();

  const getRandomRainbowColor = () => {
    return dom.rainbowColors[
      Math.floor(Math.random() * dom.rainbowColors.length)
    ];
  };

  const darkenColour = (color, count) => {
    if (!color) color = dom.white;
    if (count === 15) return dom.black;

    let r, g, b, a;

    if (color.charAt(0) === "#") {
      r = parseInt(color.slice(1, 3), 16);
      g = parseInt(color.slice(3, 5), 16);
      b = parseInt(color.slice(5, 7), 16);
    } else if (color.startsWith("rgb(")) {
      const rgb = color.slice(4, -1).replaceAll(" ", "").split(",");
      r = parseInt(rgb[0]);
      g = parseInt(rgb[1]);
      b = parseInt(rgb[2]);
    } else if (color.startsWith("rgba(")) {
      const rgba = color.slice(5, -1).replaceAll(" ", "").split(",");
      r = parseInt(rgba[0]);
      g = parseInt(rgba[1]);
      b = parseInt(rgba[2]);
      a = parseFloat(rgba[3]);
    }


    if (color.startsWith("rgba(") && a !== undefined) {
      return `rgba(${Math.floor(r * 0.9)}, ${Math.floor(g * 0.9)}, ${Math.floor(
        b * 0.9
      )}, ${a})`;
    } else {
      return `rgb(${Math.floor(r * 0.9)}, ${Math.floor(g * 0.9)}, ${Math.floor(
        b * 0.9
      )})`;
    }
  };

  const colorToHex = (color) => {
    if (!color) return "#000000";

    if (color.startsWith("#")) {
      return color;
    }

    let r, g, b;

    if (color.startsWith("rgb(")) {
      const rgb = color.slice(4, -1).replaceAll(" ", "").split(",");
      r = parseInt(rgb[0]);
      g = parseInt(rgb[1]);
      b = parseInt(rgb[2]);
    } else if (color.startsWith("rgba(")) {
      const rgba = color.slice(5, -1).replaceAll(" ", "").split(",");
      r = parseInt(rgba[0]);
      g = parseInt(rgba[1]);
      b = parseInt(rgba[2]);
    }

    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  };

  const changeColor = (e) => {
    if (!dom.clickOn || dom.eyeDropperOn) return;
    if (dom.eraserBtn.classList.contains("active")) {
      e.target.style.backgroundColor = dom.white;
      return;
    } else if (dom.rainbowBtn.classList.contains("active")) {
      dom.colorPicker.value = getRandomRainbowColor();
    } else if (dom.darkBtn.classList.contains("active")) {
      let count = parseInt(e.target.dataset.interactionCount) || 0;
      if (count < 15) {
        count++;
        e.target.dataset.interactionCount = count;
        e.target.style.backgroundColor = colorToHex(
          darkenColour(e.target.style.backgroundColor, count)
        );
      }
      return;
    }

    e.target.style.backgroundColor = colorToHex(dom.colorPicker.value);
  };

  function addMultiEvent(element, events, handler) {
    events.forEach((event) => element.addEventListener(event, handler));
  }

  const handleTouchMove = (e) => {
    if (dom.clickOn) {
      e.preventDefault();

      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];

        const element = document.elementFromPoint(touch.clientX, touch.clientY);

        if (element && element.classList.contains("grid-item")) {
          const simulatedEvent = { target: element };
          changeColor(simulatedEvent);
        }
      }
    }
  };

  addMultiEvent(dom.sketch, ["mousedown", "touchstart"], (e) => {
    if (e.target.classList.contains("grid-item")) {
      e.preventDefault();

      if (dom.eyeDropperOn) {
        if (e.target.style.backgroundColor) {
          dom.colorPicker.value = colorToHex(e.target.style.backgroundColor);
        } else {
          dom.colorPicker.value = dom.white;
        }
        dom.toggleEyeDropper();
        return;
      }
      dom.clickOn = true;
      changeColor(e);
    }
  });

  dom.sketch.addEventListener("mouseover", (e) => {
    if (
      !dom.eyeDropperOn &&
      dom.clickOn &&
      e.target.classList.contains("grid-item")
    ) {
      changeColor(e);
    }
  });

  dom.sketch.addEventListener("touchmove", handleTouchMove);

  addMultiEvent(dom.sketch, ["mouseup", "touchend", "touchcancel"], (e) => {
    if (dom.clickOn) {
      dom.clickOn = false;
    }
  });

  dom.sketch.addEventListener("click", (e) => {
    if (e.target.classList.contains("grid-item")) {
      if (dom.eyeDropperOn) {
        if (e.target.style.backgroundColor) {
          dom.colorPicker.value = colorToHex(e.target.style.backgroundColor);
        } else {
          dom.colorPicker.value = dom.white;
        }
        dom.toggleEyeDropper();
        return;
      }
      changeColor(e);
    }
  });

  addMultiEvent(
    document,
    ["mouseup", "touchend", "touchcancel"],
    () => (dom.clickOn = false)
  );

  dom.sketch.addEventListener("mouseleave", () => (dom.clickOn = false));
  for (let i = 0; i < totalCells; i++) {
    const gridItem = document.createElement("div");
    gridItem.classList.add("grid-item");
    if (dom.borders.checked) gridItem.classList.add("grid-item-border");
    gridItem.style.width = `${cellPercentage}%`;
    gridItem.style.height = `${cellPercentage}%`;
    fragment.appendChild(gridItem);
  }

  dom.sketch.appendChild(fragment);
}

function createListeners(dom) {
  dom.borders.checked = "true";

  const toggleBorders = () => {
    const grids = document.querySelectorAll(".grid-item");
    grids.forEach((grid) => {
      grid.classList.toggle("grid-item-border");
    });
  };

  dom.borders.addEventListener("change", toggleBorders);

  dom.gridSize.addEventListener("input", () => {
    createGrid(dom, dom.gridSize.value);
  });

  dom.clearBtn.addEventListener("click", () => {
    const grids = document.querySelectorAll(".grid-item");
    grids.forEach((grid) => {
      grid.style.backgroundColor = dom.white;
    });
  });

  const deactivateAllButtons = (id) => {
    const allActivatedButons = Array.from(document.querySelectorAll("button"));
    const actives = allActivatedButons.filter(
      (button) =>
        button.classList.contains("active") && button.getAttribute("id") !== id
    );
    actives.map((button) => button.classList.remove("active"));
  };

  dom.eraserBtn.addEventListener("click", () => {
    deactivateAllButtons(dom.eraserBtn.getAttribute("id"));
    dom.eraserBtn.classList.toggle("active");
  });

  dom.eyeDropper.addEventListener("click", () => {
    deactivateAllButtons(dom.eyeDropper.getAttribute("id"));
    dom.toggleEyeDropper();
  });

  dom.colorPicker.addEventListener("click", () => {
    deactivateAllButtons("");
  });
  dom.rainbowBtn.addEventListener("click", () => {
    deactivateAllButtons(dom.rainbowBtn.getAttribute("id"));
    dom.rainbowBtn.classList.toggle("active");
  });

  dom.darkBtn.addEventListener("click", () => {
    deactivateAllButtons(dom.darkBtn.getAttribute("id"));
    dom.darkBtn.classList.toggle("active");
  });
}
