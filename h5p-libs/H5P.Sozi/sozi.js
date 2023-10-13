var H5P = H5P || {};

H5P.Sozi = (function ($) {
    /**
     * Konstruktor
     */
    function C(options, id) {
        // Extend defaults with provided options
        this.options = $.extend(true, {}, {
            json: null
        }, options);
        // Keep provided id.
        this.id = id;
    };

    /**


     fetch(json_path)
     .then(res => res.json())
     .then(data => {
                json_data= data;
            })

     /**
     fetch(svg_path)
     .then(res => res.text())
     .then(text => {
                div.innerHTML = text;
            })

     */

    /**
     * Atach Funktion welche von dem H5P Framework aufgerufen wird um die H5P-Inhalte in die Seite zu laden.
     *
     * @param {jQuery} $container
     */
    C.prototype.attach = function ($container) {

        let hashFrameID;
        window.addEventListener("hashchange", urlHashChange);
        /**
         * Erhalten von dem Pfad zu der JSON-Datei.
         */
        const json_path = H5P.getPath(this.options.json.path, this.id);
        let json_data;

        /**
         * Aktuelle Frame Nummer welche angezeigt wird.
         */
        let frameNr= 0;

        /**
         * Erhalten von dem Pfad zu der SVG-Datei.
         */
        const svg_path = H5P.getLibraryPath("H5P.Sozi-1.0") + "/projektarbeiten.svg";


        /**
         * Breite und Höhe der SVG-Datei.
         */
        let svg_width;
        let svg_height;
        let svg_bool = false;

        let text;

        /**
         * Erstellung von einem Div, welcher die SVG-Datei beinhaltet.
         */
        let div = document.createElement("div");

        /**
         * Erstellung von einem ButtonDiv, welcher die Buttons enthält.
         */
        let buttondiv = document.createElement("div");
        buttondiv.className = "buttonDivClass";

        /**
         * Erstellung von einem Button der zum vorherigen Frame springt.
         */
        let backbtn = document.createElement("button");
        backbtn.className = "buttonClass";
        backbtn.innerHTML= "Previous Frame";
        backbtn.addEventListener("click", function() {
            prevFrame();
        });

        /**
         * Erstellung von einem Button der zum nächsten Frame springt.
         */
        let nextbtn = document.createElement("button");
        nextbtn.innerHTML= "Next Frame";
        nextbtn.className = "buttonClass";
        nextbtn.addEventListener("click", function() {
            nextFrame();
        });

        /**
         * Das Anhängen von den Buttons zu der ButtonDiv.
         */
        buttondiv.append(backbtn);
        buttondiv.append(nextbtn);

        /**
         * Erstellung von einem FrameDiv um die aktuelle Frame Nummer anzuzegien.
         */
        let frameDiv = document.createElement("div");
        frameDiv.className = "frameClass";
        /**
         * Asynchone Funktion zum Laden der SVG-Datei, sowie die Höhe und Breite der SVG-Datei. Zudem das Laden der
         * JSON-Datei, sowie das Aufrufen der Funktionen dataforFrame() und framePostion,
         */
        window.onload = async function () {
            const file = await fetch(svg_path);
            text = await file.text();


            const json = await fetch(json_path);
            const data = await json.json();
            json_data = data;
            
            dataForFrame();

            frameDiv.innerHTML=framePostion();
        }

        /**
         * Dieses Methode wird aufgerufen wenn der nächste Frame angezeigt werden soll, hierbei wird frameNr
         * inkrementiert, sowie die Daten des nächsten Frames ausgelesen.
         */
        function nextFrame() {
            if(frameNr == json_data.frames.length-1) {
                dataForFrame();
            } else {
                frameNr++;
                dataForFrame();
            }
            frameDiv.innerHTML=framePostion();
        }

        /**
         * Dieses Methode wird aufgerufen wenn der vorherige Frame angezeigt werden soll, hierbei wird frameNr
         * dekrementiert, sowie die Daten des vorherigen Frames ausgelesen.
         */
        function prevFrame() {
            if(frameNr == 0) {
                dataForFrame();
            } else {
                frameNr--;
                dataForFrame();
            }
            frameDiv.innerHTML=framePostion();
        }

        /**
         * Diese Methode wird aufgerufen um den aktuellen Frames aus der JSON-Datei zu bestimmen und das Div-Element mit der SVG-Datei zu befüllen.
         */
        function dataForFrame() {
            div.innerHTML = text;

            if(svg_bool==false) {
                const svg = document.querySelector("svg");
                svg_width = parseInt(svg.getAttribute("width"), 10);
                svg_height = parseInt(svg.getAttribute("height"), 10);
                svg_bool= true;
            }

            if(hashFrameID != null) {
                let frameFound= false;
                frameNr= 0;
                json_data.frames.forEach((frame) => {
                    if(frame.frameId == hashFrameID) {
                        getData(frame);
                        frameFound=true;
                    }
                    if(!frameFound) {
                        frameNr++;
                    }
                })
                hashFrameID=null;
                frameDiv.innerHTML=framePostion();
            }else{

                const frames = json_data.frames[frameNr];
                getData(frames);

            }
        }

        /**
         * Diese Methode wird aufgerufen um SVG-Datei in die richtige Position des Frames zu tranformieren.
         *
         * @param {string} name - Name des aktuellen Layers
         * @param {number} cx - Positionierung des Layer auf der X-Koordinate
         * @param {number} cy - Positionierung des Layer auf der Y-Koordinate
         * @param {number} opacity - Transperenz des Layers
         * @param {number} widthLayer - Breite des Layers
         * @param {number} heightLayer - Höhe des Layers
         * @param {number} angle - Der Rotations-Winkel des Layers
         */
        function displayFrame(name, cx, cy, opacity, widthLayer, heightLayer, angle) {

            const scale = Math.min(svg_width / widthLayer, svg_height / heightLayer);
            const width = svg_width / scale / 2;
            const height = svg_height / scale / 2;
            const x = width - cx;
            const y = height - cy;


            const layer = document.getElementById(name);
            const transform = layer.getAttribute("transform");
            if (transform != null) {
                const transfromArr = transform
                    .match(/-?[\d.]+/g)
                    .map(parseFloat);
                const x1= transfromArr[0];
                const y1= transfromArr[1];
                const translateX= x+x1;
                const translateY= y+y1;
                const rotatecx= cx-x1;
                const rotatecy= cy-y1;
                layer.setAttribute('transform', 'scale(' + scale + ') translate(' + translateX + ',' + translateY + ') rotate(' + (-angle) + ',' + rotatecx + ',' + rotatecy + ')');
            }else{
                layer.setAttribute('transform', 'scale(' + scale + ') translate(' + x + ',' + y + ') rotate(' + (-angle) + ',' + cx + ',' + cy + ')');
            }

            layer.setAttribute("opacity", opacity);
            if(opacity == 0) {
                layer.style.display= "none";
            }



        }
        /**
         * Dieses Methode wird aufgerufen um den aktuellen Frame anzuzeigen.
         */
        function framePostion() {
            let currentFrame= frameNr +1;
            return currentFrame + "/" + json_data.frames.length;
        }
        /**
         * Dieses Methode wird aufgerufen um die URL des nächsten Frames Frame zubestimmen.
         */
        function urlHashChange() {
            hashFrameID = window.location.hash.slice(1);
            dataForFrame();
        }
        /**
         * Dieses Methode wird aufgerufen um die Daten des nöchsten Frames zu  bestimmen.
         */
        function getData(frame){
            Object.keys(frame.cameraStates).forEach((layer) => {
                if (layer !== "__sozi_auto__") {
                    const name = layer;
                    const cx = frame.cameraStates[layer].cx;
                    const cy = frame.cameraStates[layer].cy;
                    const opacity = frame.cameraStates[layer].opacity;
                    const width = frame.cameraStates[layer].width;
                    const height = frame.cameraStates[layer].height;
                    const angle = frame.cameraStates[layer].angle;
                    displayFrame(name, cx, cy, opacity, width, height, angle);
                }
            })
        }

        /**
         * Anhängen der jewweilien Divs an den Container.
         */
        $container.append(div);
        $container.append(buttondiv);
        $container.append(frameDiv);
    };



    return C;
})(H5P.jQuery);