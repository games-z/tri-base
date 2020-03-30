/**
 * Блок Визарда
 * @constructor
 */
PageBlockWizard = function PageBlockWizard() {
    let self = this;

    /**
     * Показывать ли страницу.
     * @type {boolean}
     */
    let showed = false;

    /**
     * Массив всех элементов страницы.
     * @type {Array}
     */
    this.elements = [];

    let canvas = null;
    /** @type {CanvasRenderingContext2D} */
    let cntx = null;

    this.init = function () {
        let el;

        /** Canvas */
        canvas = document.getElementById('wizardArea');
        canvas.width = DataCross.application.width;
        canvas.height = DataCross.application.height;
        cntx = canvas.getContext('2d');

        /** on Click */
        canvas.onclick = function (event) {
            let pixelData;
            pixelData = cntx.getImageData(event.offsetX, event.offsetY, 1, 1).data;
            if (pixelData[3] === 0) {
                canvas.style.display = 'none';
                el = document.elementFromPoint(event.clientX, event.clientY);
                el.dispatchEvent(new MouseEvent(event.type, event));
                canvas.style.display = '';
            }
        };
        canvas.onmousemove = function (event) {
            let pixelData;
            pixelData = cntx.getImageData(event.offsetX, event.offsetY, 1, 1).data;
            if (pixelData[3] === 0) {
                canvas.style.display = 'none';
                el = document.elementFromPoint(event.clientX, event.clientY);
                el.dispatchEvent(new MouseEvent(event.type, event));
                canvas.style.cursor = el.style.cursor;
                canvas.style.display = '';
            } else {
                canvas.style.cursor = '';
            }
        };

        let image;
        // images
        image = new Image();
        image.onload = function () {
            drawBackground();

            cntx.globalAlpha = 1;
            cntx.globalCompositeOperation = 'destination-out';
            cntx.drawImage(image, 0, 140);
        };
        image.src = '/images/wizard-01.png';

        //canvas =
        //    self.elements.push(el);
        /*
        var img = document.getElementById('my-image');
var canvas = document.createElement('canvas');
canvas.width = img.width;
canvas.height = img.height;
canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
         */
        /*
        var pixelData = canvas.getContext('2d').getImageData(event.offsetX, event.offsetY, 1, 1).data;
         */
    };

    let drawBackground = function () {
        cntx.globalCompositeOperation = 'source-out';
        cntx.globalAlpha = 0.75;
        cntx.fillStyle = 'black';
        cntx.fillRect(0, 0, DataCross.application.width, DataCross.application.height);
    };

    /**
     * Покажем все элементы на странице.
     */
    this.show = function () {
        if (showed) return;
        showed = true;
        self.preset();
        for (let i in self.elements) {
            self.elements[i].show();
        }
        self.redraw();
    };

    /**
     * Спрачем все элементы на странице.
     */
    this.hide = function () {
        if (!showed) return;
        showed = false;
        for (let i in self.elements) {
            self.elements[i].hide();
        }
    };

    /**
     * Настройка перед отрисовкой.
     */
    this.preset = function () {

    };

    /**
     * Обновляем онлайн индикатор и индикатор очков.
     */
    this.redraw = function () {
        if (!showed) return;
        self.preset();
        self.elements.forEach(function (el) {
            el.redraw();
        });
    };
};

/** @type {PageBlockWizard} */
PageBlockWizard = new PageBlockWizard();