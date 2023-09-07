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
     * Attach function called by H5P framework to insert H5P content into
     * page
     *
     * @param {jQuery} $container
     */
    C.prototype.attach = function ($container) {

        const json_path = H5P.getPath(this.options.json.path, this.id);

        let svg_path = H5P.getLibraryPath("H5P.Sozi-1.0") + "/projektarbeiten.svg";

        let frameNr= 0;

        fetch(svg_path)
            .then(res => res.text())
            .then(text => {
                div.innerHTML = text;
            })

        let json_data;

        fetch(json_path)
            .then(res => res.json())
            .then(data => {
                json_data= data;
            })

        let div = document.createElement("div");
        div.id = "content";

        let backbtn = document.createElement("button");
        backbtn.innerHTML= "Previous Frame";
        backbtn.addEventListener("click", function() {
            prevFrame();
        });

        let nextbtn = document.createElement("button");
        nextbtn.innerHTML= "Next Frame";
        nextbtn.addEventListener("click", function() {
            nextFrame();
        });

        let buttondiv = document.createElement("div");
        buttondiv.append(backbtn);
        buttondiv.append(nextbtn);

        function nextFrame() {
            if(frameNr == json_data.frames.length-1) {
                dataForFrame();
            } else {
                frameNr++;
                dataForFrame();
            }
        }

        function prevFrame() {
            if(frameNr == 0) {
                dataForFrame();
            } else {
                frameNr--;
                dataForFrame();
            }
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
                    displayFrame(name, cx, cy, opacity, width, height);
                }
            })
        }

        function displayFrame(name, cx, cy, opacity, width, height) {
            const layer = document.getElementById(name);
            //layer.setAttribute("x", cx);
            //layer.setAttribute("y", cy);

            //layer.setAttribute('transform','translate(' + cx + ',' + cy + ') rotate(0)');

        }




        $container.append(div);
        $container.append(buttondiv);
    };



    return C;
})(H5P.jQuery);