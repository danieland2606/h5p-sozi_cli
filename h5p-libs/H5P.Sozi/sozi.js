var H5P = H5P || {};

H5P.Sozi = (function ($) {
    /**
     * Constructor function.
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
     * Attach function called by H5P framework to insert H5P content into
     * page
     *
     * @param {jQuery} $container
     */
    C.prototype.attach = function ($container) {

        const json_path = H5P.getPath(this.options.json.path, this.id);
        let frameNr= 0;
        let json_data;


        const svg_path = H5P.getLibraryPath("H5P.Sozi-1.0") + "/projektarbeiten.svg";
        //const svg_path = H5P.getLibraryPath("H5P.Sozi-1.0") + "/tutorial-layers.svg";
        let svg_width;
        let svg_height;

        let div = document.createElement("div");
        div.id = "content";

        let buttondiv = document.createElement("div");
        buttondiv.className = "buttonDivClass";

        let backbtn = document.createElement("button");
        backbtn.className = "buttonClass";
        backbtn.innerHTML= "Previous Frame";
        backbtn.addEventListener("click", function() {
            prevFrame();
        });

        let nextbtn = document.createElement("button");
        nextbtn.innerHTML= "Next Frame";
        nextbtn.className = "buttonClass";
        nextbtn.addEventListener("click", function() {
            nextFrame();
        });

        buttondiv.append(backbtn);
        buttondiv.append(nextbtn);

        let frameDiv = document.createElement("div");
        frameDiv.className = "frameClass";


        window.onload = async function () {

            const div = document.getElementById("content");
            const file = await fetch(svg_path);
            const text = await file.text();
            div.innerHTML = text;
            const svg = document.querySelector("svg");
            svg_width = parseInt(svg.getAttribute("width"),10);
            svg_height = parseInt(svg.getAttribute("height"),10);


            const json = await fetch(json_path);
            const data = await json.json();
            json_data = data;
            
            dataForFrame();

            frameDiv.innerHTML=framePostion();
        }

        function nextFrame() {
            if(frameNr == json_data.frames.length-1) {
                dataForFrame();
            } else {
                frameNr++;
                dataForFrame();
            }
            frameDiv.innerHTML=framePostion();
        }

        function prevFrame() {
            if(frameNr == 0) {
                dataForFrame();
            } else {
                frameNr--;
                dataForFrame();
            }
            frameDiv.innerHTML=framePostion();
        }

        function dataForFrame() {
            const frames = json_data.frames[frameNr];
            Object.keys(frames.cameraStates).forEach((layer) => {
                if (layer !== "__sozi_auto__") {
                    const name = layer;
                    const cx = frames.cameraStates[layer].cx;
                    const cy = frames.cameraStates[layer].cy;
                    const opacity = frames.cameraStates[layer].opacity;
                    const width = frames.cameraStates[layer].width;
                    const height = frames.cameraStates[layer].height;
                    const angle = frames.cameraStates[layer].angle;
                    displayFrame(name, cx, cy, opacity, width, height, angle);
                }
            })
        }

        function displayFrame(name, cx, cy, opacity, widthLayer, heightLayer, angle) {
            const layer = document.getElementById(name);
            const scale = Math.min(svg_width / widthLayer, svg_height / heightLayer);
            const width = svg_width/scale/2;
            const height = svg_height/scale/2;
            const x = width - cx;
            const y = height - cy;

            layer.setAttribute('transform','scale(' + scale + ') translate(' + x + ',' + y + ') rotate(' + -(angle) + ',' + cx + ',' + cy +')');
            if(opacity === 1) {
                layer.style.opacity = 1;
            } else {
                layer.style.opacity = 0;
            }
            //layer.style.display = (opacity == 1) ? "initial" : "none";
        }
        function framePostion() {
            let currentFrame= frameNr +1;
            return currentFrame + "/" + json_data.frames.length;
        }



        $container.append(div);
        $container.append(buttondiv);
        $container.append(frameDiv);

    };



    return C;
})(H5P.jQuery);