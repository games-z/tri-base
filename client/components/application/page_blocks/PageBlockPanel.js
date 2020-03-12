/**
 * Блок общих.
 * @constructor
 */
PageBlockPanel = function PageBlockPanel() {
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

    let elSoundsButton = null;

    let elFSButton = null;

    let moneyText;

    let dialogMoneyShop;

    let dialogHealthShop;

    this.init = function () {
        let el, pMX, pHX;

        /**
         * Панель внутрений валюты
         * @type {number}
         */
        pMX = 110;//110 идеальный уентр
        el = GUI.createElement(ElementImage, {
            x: pMX, y: 0,
            src: '/images/panel-money.png'
        });
        self.elements.push(el);

        /** деньги - монета */
        el = GUI.createElement(ElementButton, {
            x: pMX + 5, y: -2,
            srcRest: '/images/button-money-rest.png',
            srcHover: '/images/button-money-hover.png',
            srcActive: '/images/button-money-active.png',
            onClick: function () {
                dialogMoneyShop.showDialog();
            }
        });
        self.elements.push(el);
        /** деньги - текст */
        moneyText = GUI.createElement(ElementText, {
            x: pMX + 58, y: 9, width: 70,
            alignCenter: true, bold: true
        });
        self.elements.push(moneyText);

        /** Деньги кнопка плюс */
        el = GUI.createElement(ElementButton, {
            x: pMX + 122, y: -2,
            srcRest: '/images/button-add-rest.png',
            srcHover: '/images/button-add-hover.png',
            srcActive: '/images/button-add-active.png',
            onClick: function () {
                dialogMoneyShop.showDialog();
            }
        });
        self.elements.push(el);

        /**
         * Панель жизни
         * @type {number}
         */
        pHX = 463 - 15 - 50; //463 идеальный центр
        /** жизни - панель */
        el = GUI.createElement(ElementImage, {
            x: pHX, y: 0,
            src: '/images/panel-hearth.png'
        });
        self.elements.push(el);

        /** жизни - сердца */
        el = GUI.createElement(ElementHealthIndicator, {
            x: pHX + 9,
            y: -1
        });
        self.elements.push(el);

        /** жизни - таймер */
        el = GUI.createElement(ElementHealthTimer, {
            x: pHX + 111, y: 10,
            healthIndicator: el,
        });
        self.elements.push(el);

        /** Жизни - кнопка плюс */
        el = GUI.createElement(ElementButton, {
            x: pHX + 190, y: -2,
            srcRest: '/images/button-add-rest.png',
            srcHover: '/images/button-add-hover.png',
            srcActive: '/images/button-add-active.png',
            onClick: function () {
                dialogHealthShop.showDialog();
            }
        });
        self.elements.push(el);

        /** кнопка звука **/
        elSoundsButton = GUI.createElement(ElementButton, {
            x: 660, y: 10,
            srcRest: '/images/button-sound-off.png',
            srcHover: '/images/button-sound-active.png',
            srcActive: '/images/button-sound-active.png',
            onClick: function () {
                Sounds.toggle();
                Sounds.play(Sounds.PATH_CHALK);
                PageController.redraw();
            }
        });
        self.elements.push(elSoundsButton);

        /** кнопка фулскрин **/
        elFSButton = GUI.createElement(ElementButton, {
            x: 690, y: 0,
            srcRest: '/images/button-fullscreen-on-rest.png',
            srcHover: '/images/button-fullscreen-on-hover.png',
            srcActive: '/images/button-fullscreen-on-active.png',
            onClick: onFullScreenButtonClick
        });
        self.elements.push(elFSButton);

        dialogMoneyShop = GUI.createElement(ElementDialogMoneyShop, {});
        self.elements.push(dialogMoneyShop);

        dialogHealthShop = GUI.createElement(ElementDialogHealthShop, {});
        self.elements.push(dialogHealthShop);

        setBackgroundImage();
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
        if (Sounds.isEnabled()) {
            elSoundsButton.srcRest = '/images/button-sound-on.png';
        } else {
            elSoundsButton.srcRest = '/images/button-sound-off.png';
        }
        if (LogicStuff.getStuff().goldQty !== undefined) {
            moneyText.setText(LogicStuff.getStuff('goldQty'))
        }
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

    this.showDialogMoneyShop = function () {
        dialogMoneyShop.showDialog();
    };

    let setBackgroundImage = function () {
        let elBody, backgroundImage;
        elBody = document.getElementsByTagName('body')[0];

        backgroundImage = "url('" + GUI.getImagePath('/images/old-paper.png') + "')";

        elBody.style.backgroundImage = backgroundImage;
        elBody.style.backgroundSize = "1px 1px";
    };

    let onFullScreenButtonClick = function () {
        GUI.fsSwitch();
        if (GUI.isFullScreen()) {
            elFSButton.srcRest = '/images/button-fullscreen-on-rest.png';
            elFSButton.srcHover = '/images/button-fullscreen-on-rest.png';
            elFSButton.srcActive = '/images/button-fullscreen-on-rest.png';
        } else {
            elFSButton.srcRest = '/images/button-fullscreen-off-rest.png';
            elFSButton.srcHover = '/images/button-fullscreen-off-rest.png';
            elFSButton.srcActive = '/images/button-fullscreen-off-rest.png';
        }
    };

};

PageBlockPanel = new PageBlockPanel();