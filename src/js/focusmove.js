import Link from './link.js';
//polyfill
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}
if (typeof Object.assign != 'function') {
    Object.defineProperty(Object, 'assign', {
        value: function assign(target, varArgs) {
            'use strict';
            if (target == null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var to = Object(target);

            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];

                if (nextSource != null) {
                    for (var nextKey in nextSource) {
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        },
        writable: true,
        configurable: true
    });
}
const FocusMove = {
    version: "1.2.44",
    Priority: {
        LEFT: 1,
        RIGHT: 2,
        TOP: 4,
        BOTTOM: 8,
        CONTAIN: 16,
    },
    FocusType: {
        FOCUS: 1,
        CLASS: 2,
    },
    DistMode: {
        CENTER: 'center',
        EDGE: 'edge',
    },
    KeyEvent: {
        KEY_LEFT: 37,
        KEY_RIGHT: 39,
        KEY_UP: 38,
        KEY_DOWN: 40,
        KEY_ENTER: 13,
        KEY_DEBUG: 118,
    },
    get actived() {
        return this._actived;
    },
    set actived(act) {
        if (this._actived && this._actived.element && act && this._actived.element != act.element) {
            if (this.__onblur instanceof Function) {
                this.__onblur(this._actived);
            }
        }
        this._actived = act;
    },
    pause: false, // if enable current scope will pause.
    __keyevents: [], // Keystroke event set.
    elinks: [], // A collection of focus objects(link).
    Option: {
        selector: '[tabindex]', //selector who can used by document.querySelectorAll.
        scope: null, //lock the scope in this htmlelement.
        distmode: 'edge', //Distance calculation method,center or edge.
        priority: 0, //Priority. default processing all.Multiple values can be connected by '|' , e.g. Priority.LEFT | Priority.TOP. when it have Priority.CONTAIN  the other four properties is invalid.
        floatframe: null, //A float div covered on the focus element if necessary.
        activedelement: null, //the current focused element .the same as actived.element.
        autoscroll: false, // scroll to focus.
        enableaction: true, // if dircetion attribute id is not found then eval dirction string and focus attribute as script. 
        moveduration: 500, //movefloatframe duration time to fixed animations.
        focusType: 3, // use element.focus() function to set Focus or use class name to set focus.
        focusClassName: "focus", //toggle focus element class.
    },
    __onblur: null,
    set onBlur(callback) {
        if (callback) {
            this.__onblur = callback;
        }
    },
    get onBlur() {
        return this.__onblur;
    },
    __onfocus: null,
    set onFocus(callback) {
        if (callback) {
            this.__onfocus = callback;
        }
    },
    get onFocus() {
        return this.__onfocus;
    },
    __beforeFocus: null,
    set beforeFocus(callback) {
        if (typeof callback == "function") {
            this.__beforeFocus = callback;
        }
    },
    get beforeFocus() {
        return this.__beforeFocus;
    },

    onLeft() {
        if (!this.actived) return;
        const self = this.actived;
        let target = self;
        const contain = [];
        const top = [];
        const bottom = [];
        let plist = [];

        if (typeof self.element['fm-left'] == 'function') {
            self.element['fm-left'].call(self.element);
        }
        const fl = self.element.getAttribute('fm-left');
        if (fl != null) {
            if (fl === '-1') {
                return;
            }
            for (let i = 0; i < this.elinks.length; i += 1) {
                const obj = this.elinks[i];
                if (fl === obj.element.getAttribute('id')) {
                    this.actived = obj;
                    this.setFocus();
                    return;
                }
            }

            if (document.getElementById(fl) != null) {
                this.setFocus(document.getElementById(fl));
            } else if (this.Option.enableaction) {
                try {
                    if (typeof self.element.fmeval !== 'function') {
                        self.element.fmeval = function (s) {
                            eval(s)
                        };
                    }
                    self.element.fmeval.call(self.element, fl);
                } catch (e) {
                    console.warn(e + ':action not found.');
                }
                return;
            }

        }
        for (let i = 0; i < this.elinks.length; i += 1) {
            const obj = this.elinks[i];
            const isNotCurrentObj = self !== obj;
            const isCenterMode = this.Option.distmode === this.DistMode.CENTER;
            const isLeftObj = self.l >= obj.r || (isCenterMode && self.l > obj.l && self.x > obj.x);

            if (isNotCurrentObj && isLeftObj) {
                if ((obj.t >= self.t && obj.b <= self.b) || (obj.t <= self.t && obj.b >= self.b)) {
                    contain.push(obj);
                } else if (obj.t <= self.t) {
                    top.push(obj);
                } else if (obj.b >= self.b) {
                    bottom.push(obj);
                }
            }
        }

        if ((this.Option.priority & this.Priority.CONTAIN) && contain.length > 0) {
            plist = plist.concat(contain);
        }
        if ((this.Option.priority & this.Priority.BOTTOM) && bottom.length > 0) {
            plist = plist.concat(bottom);
        }
        if ((this.Option.priority & this.Priority.TOP) && top.length > 0) {
            plist = plist.concat(top);
        }
        if (plist.length === 0) {
            plist = contain.concat(top).concat(bottom);
        }

        if (plist.length > 0) {
            [target] = plist;
            if (this.Option.distmode === this.DistMode.CENTER) {
                for (let i = plist.length - 1; i >= 0; i -= 1) {
                    const shorter = plist[i].dist < target.dist;
                    const closer = plist[i].dist === target.dist && plist[i].r > target.r;
                    if (shorter || closer) {
                        target = plist[i];
                    }
                }
            } else {
                for (let i = plist.length - 1; i >= 0; i -= 1) {
                    const closer = plist[i].r > target.r;
                    const shorter = plist[i].r === target.r && plist[i].dist < target.dist;
                    if (closer || shorter) {
                        target = plist[i];
                    }
                }
            }
        }
        this.actived = target;
        this.setFocus();
    },
    onRight() {
        if (!this.actived) return;
        const self = this.actived;
        let target = self;
        const contain = [];
        const top = [];
        const bottom = [];
        let plist = [];
        if (typeof self.element['fm-right'] == 'function') {
            self.element['fm-right'].call(self.element);
        }
        const fr = self.element.getAttribute('fm-right');
        if (fr != null) {
            if (fr === '-1') {
                return;
            }
            for (let i = 0; i < this.elinks.length; i += 1) {
                const obj = this.elinks[i];
                if (fr === obj.element.getAttribute('id')) {
                    this.actived = obj;
                    this.setFocus();
                    return;
                }
            }
            if (document.getElementById(fr) != null) {
                this.setFocus(document.getElementById(fr));
            } else if (this.Option.enableaction) {
                try {
                    if (typeof self.element.fmeval !== 'function') {
                        self.element.fmeval = function (s) {
                            eval(s)
                        };
                    }
                    self.element.fmeval.call(self.element, fr);
                } catch (e) {
                    console.warn(e + ':action not found.');
                }
                return;
            }
        }
        for (let i = 0; i < this.elinks.length; i += 1) {
            const obj = this.elinks[i];
            const isNotCurrentObj = self !== obj;
            const isCenterMode = this.Option.distmode === this.DistMode.CENTER;
            const isRightObj = self.r <= obj.l || (isCenterMode && self.r < obj.r && self.x < obj.x);

            if (isNotCurrentObj && isRightObj) {
                if ((obj.t >= self.t && obj.b <= self.b) || (obj.t <= self.t && obj.b >= self.b)) {
                    contain.push(obj);
                } else if (obj.t <= self.t) {
                    top.push(obj);
                } else if (obj.b >= self.b) {
                    bottom.push(obj);
                }
            }
        }

        if ((this.Option.priority & this.Priority.CONTAIN) && contain.length > 0) {
            plist = plist.concat(contain);
        }
        if ((this.Option.priority & this.Priority.BOTTOM) && bottom.length > 0) {
            plist = plist.concat(bottom);
        }
        if ((this.Option.priority & this.Priority.TOP) && top.length > 0) {
            plist = plist.concat(top);
        }
        if (plist.length === 0) {
            plist = contain.concat(top).concat(bottom);
        }

        if (plist.length > 0) {
            [target] = plist;
            if (this.Option.distmode === this.DistMode.CENTER) {
                for (let i = plist.length - 1; i >= 0; i -= 1) {
                    const shorter = plist[i].dist < target.dist;
                    const closer = plist[i].dist === target.dist && plist[i].l < target.l;
                    if (shorter || closer) {
                        target = plist[i];
                    }
                }
            } else {
                for (let i = plist.length - 1; i >= 0; i -= 1) {
                    const closer = plist[i].l < target.l;
                    const shorter = plist[i].l === target.l && plist[i].dist < target.dist;
                    if (closer || shorter) {
                        target = plist[i];
                    }
                }
            }
        }
        this.actived = target;
        this.setFocus();
    },
    onUp() {
        if (!this.actived) return;
        const self = this.actived;
        let target = self;
        const contain = [];
        const left = [];
        const right = [];
        let plist = [];
        if (typeof self.element['fm-up'] == 'function') {
            self.element['fm-up'].call(self.element);
        }
        const fu = self.element.getAttribute('fm-up');
        if (fu !== null) {
            if (fu === '-1') {
                return;
            }
            for (let i = 0; i < this.elinks.length; i += 1) {
                const obj = this.elinks[i];
                if (fu === obj.element.getAttribute('id')) {
                    this.actived = obj;
                    this.setFocus();
                    return;
                }
            }
            if (document.getElementById(fu) != null) {
                this.setFocus(document.getElementById(fu));
            } else if (this.Option.enableaction) {
                try {
                    if (typeof self.element.fmeval !== 'function') {
                        self.element.fmeval = function (s) {
                            eval(s)
                        };
                    }
                    self.element.fmeval.call(self.element, fu);
                } catch (e) {
                    console.warn(e + ':action not found.');
                }
                return;
            }
        }
        for (let i = 0; i < this.elinks.length; i += 1) {
            const obj = this.elinks[i];
            const isNotCurrentObj = self !== obj;
            const isCenterMode = this.Option.distmode === this.DistMode.CENTER;
            const isTopObj = self.t >= obj.b || (isCenterMode && self.t > obj.t && self.y > obj.y);
            if (isNotCurrentObj && isTopObj) {
                if ((obj.l >= self.l && obj.r <= self.r) || (obj.l <= self.l && obj.r >= self.r)) {
                    contain.push(obj);
                } else if (obj.l <= self.l) {
                    left.push(obj);
                } else if (obj.r >= self.r) {
                    right.push(obj);
                }
            }
        }

        if ((this.Option.priority & this.Priority.CONTAIN) && contain.length > 0) {
            plist = plist.concat(contain);
        } else if ((this.Option.priority & this.Priority.RIGHT) && right.length > 0) {
            plist = plist.concat(right);
        } else if ((this.Option.priority & this.Priority.LEFT) && left.length > 0) {
            plist = plist.concat(left);
        }
        if (plist.length === 0) {
            plist = contain.concat(left).concat(right);
        }

        if (plist.length > 0) {
            [target] = plist;
            if (this.Option.distmode === this.DistMode.CENTER) {
                for (let i = plist.length - 1; i >= 0; i -= 1) {
                    const shorter = plist[i].dist < target.dist;
                    const closer = plist[i].dist === target.dist && plist[i].b > target.b;
                    if (shorter || closer) {
                        target = plist[i];
                    }
                }
            } else {
                for (let i = plist.length - 1; i >= 0; i -= 1) {
                    const closer = plist[i].b > target.b;
                    const shorter = plist[i].b === target.b && plist[i].dist < target.dist;
                    if (closer || shorter) {
                        target = plist[i];
                    }
                }
            }
        }

        this.actived = target;
        this.setFocus();
    },
    onDown() {
        if (!this.actived) return;
        const self = this.actived;
        let target = self;
        const contain = [];
        const left = [];
        const right = [];
        let plist = [];
        if (typeof self.element['fm-down'] == 'function') {
            self.element['fm-down'].call(self.element);
        }
        const fd = self.element.getAttribute('fm-down');
        if (fd !== null) {
            if (fd === '-1') {
                return;
            }
            for (let i = 0; i < this.elinks.length; i += 1) {
                const obj = this.elinks[i];
                if (fd === obj.element.getAttribute('id')) {
                    this.actived = obj;
                    this.setFocus();
                    return;
                }
            }
            if (document.getElementById(fd) != null) {
                this.setFocus(document.getElementById(fd));
            } else if (this.Option.enableaction) {
                try {
                    if (typeof self.element.fmeval !== 'function') {
                        self.element.fmeval = function (s) {
                            eval(s)
                        };
                    }
                    self.element.fmeval.call(self.element, fd);
                } catch (e) {
                    console.warn(e + ':action not found.');
                }
                return;
            }
        }
        for (let i = 0; i < this.elinks.length; i += 1) {
            const obj = this.elinks[i];
            const isNotCurrentObj = self !== obj;
            const isCenterMode = this.Option.distmode === this.DistMode.CENTER;
            const isDownObj = self.b <= obj.t || (isCenterMode && self.b < obj.b && self.y < obj.y);
            if (isNotCurrentObj && isDownObj) {
                if ((obj.l >= self.l && obj.r <= self.r) || (obj.l <= self.l && obj.r >= self.r)) {
                    contain.push(obj);
                } else if (obj.l <= self.l) {
                    left.push(obj);
                } else if (obj.r >= self.r) {
                    right.push(obj);
                }
            }
        }

        if ((this.Option.priority & this.Priority.CONTAIN) && contain.length > 0) {
            plist = plist.concat(contain);
        }
        if ((this.Option.priority & this.Priority.RIGHT) && right.length > 0) {
            plist = plist.concat(right);
        }
        if ((this.Option.priority & this.Priority.LEFT) && left.length > 0) {
            plist = plist.concat(left);
        }
        if (plist.length === 0) {
            plist = contain.concat(left).concat(right);
        }

        if (plist.length > 0) {
            [target] = plist;
            if (this.Option.distmode === this.DistMode.CENTER) {
                for (let i = plist.length - 1; i >= 0; i -= 1) {
                    const shorter = plist[i].dist < target.dist;
                    const closer = plist[i].dist === target.dist && plist[i].t < target.t;
                    if (shorter || closer) {
                        target = plist[i];
                    }
                }
            } else {
                for (let i = plist.length - 1; i >= 0; i -= 1) {
                    const closer = plist[i].t < target.t;
                    const shorter = (plist[i].t === target.t && plist[i].dist < target.dist);
                    if (closer || shorter) {
                        target = plist[i];
                    }
                }
            }
        }
        this.actived = target;
        this.setFocus();
    },
    onEnter() {
        if (this.Option.enableaction && this.actived != null && this.actived.element != null) {
            const o = this.actived.element;
            const fmc = o.getAttribute("fm-click");
            if (fmc != null) {
                try {
                    if (typeof o.fmeval !== 'function') {
                        o.fmeval = function (s) {
                            eval(s)
                        };
                    }
                    o.fmeval.call(o, fmc);
                } catch (e) {
                    console.warn(e + ':action not found.');
                }

            } else if (typeof o['fm-click'] == 'function') {
                o['fm-click'].call(o);
            }
        }
    },
    Debug() {
        const p = this.actived;
        let str = `x=${p.x}  y=${p.y}\r\n`;
        str += `          t=${p.t}\r\n`;
        str += `l=${p.l}          r=${p.r}\r\n`;
        str += `          b=${p.b}`;
        console.log(str); //    'l='+p.l+',t='+p.t+',r='+p.r+',b='+p.b);
    },
    preventDefault() {
        this.ispreventDefault = true;
    },
    keydown(e) {

        if (this.pause) return;
        const key = e.which || e.keyCode;
        for (let i = 0; i < this.__keyevents.length; i += 1) {
            if (key === this.__keyevents[i].key && Object.prototype.hasOwnProperty.call(this.__keyevents[i], 'before') && this.__keyevents[i].before === true) {
                if (this.__keyevents[i].fun.call(this.actived.element, this.actived.element)) {
                    return;
                }
                if (this.__keyevents[i].once === true) {
                    this.__keyevents.splice(i, 1);
                }
                if (this.ispreventDefault === true) {
                    this.ispreventDefault = false;
                    return;
                }
            }
        }

        switch (key) {
            case this.KeyEvent.KEY_LEFT:
                this.onLeft();
                break;
            case this.KeyEvent.KEY_UP:
                this.onUp();
                break;
            case this.KeyEvent.KEY_RIGHT:
                this.onRight();
                break;
            case this.KeyEvent.KEY_DOWN:
                this.onDown();
                break;
            case this.KeyEvent.KEY_ENTER:
                this.onEnter();
                break;
            case this.KeyEvent.KEY_DEBUG:
                this.Debug();
                break;
            default:
                break;
        }

        for (let i = 0; i < this.__keyevents.length; i += 1) {
            const notBefore = !Object.prototype.hasOwnProperty.call(this.__keyevents[i], 'before') || this.__keyevents[i].before !== true;
            if (notBefore && key === this.__keyevents[i].key) {
                this.__keyevents[i].fun.call(this.actived.element, this.actived.element);
                if (this.__keyevents[i].once === true) {
                    this.__keyevents.splice(i, 1);
                }
            }
        }
    },
    addEvent(obj) {
        this.__keyevents.push(obj);
    },
    removeEvent(obj) {
        for (let i = 0; i < this.__keyevents.length; i += 1) {
            if (this.__keyevents[i].key === obj.key && this.__keyevents[i].fun === obj.fun) {
                this.__keyevents.splice(i, 1);
            }
        }
    },

    init(autoFocus = true, clearKeyEvents = false) {
        if (this.Option.selector === null) return false;
        if (clearKeyEvents) {
            this.__keyevents = [];
        }
        this.elinks = [];
        if (Object.prototype.hasOwnProperty.call(this.Option, 'scope') && this.Option.scope != null) {

            this.Option.scope.querySelectorAll(this.Option.selector).forEach(element => {
                this.elinks.push(new Link(element));
            });
        } else {
            document.querySelectorAll(this.Option.selector).forEach(element => {
                this.elinks.push(new Link(element));
            });
        }

        if (this.elinks.length > 0 && autoFocus) {
            this.setFocus(this.elinks[0].element);
        }
        return true;

    },
    setScope(containerElement) {
        // change focus scope
        const needInit = this.Option.scope !== containerElement;
        if (containerElement instanceof HTMLElement) {
            this.Option.scope = containerElement;
        } else {
            this.Option.scope = null;
        }
        return needInit && this.init();

    },
    setSelector(selector) {
        this.Option.selector = selector;
        this.init();

    },
    GetScrollParent(obj) {
        if (!(obj instanceof HTMLElement)) return document.body;
        let child = obj;
        while (child != null) {
            const parent = child.parentNode;
            const isBody = parent instanceof HTMLBodyElement;
            const isContainer = parent != null && parent.offsetWidth < child.offsetWidth;
            if (isBody || isContainer) {
                return parent;
            }
            child = parent;

        }
        return document.body;

    },
    setFocus(oid) {
        let nextFocusLink = null;
        if (typeof oid === 'number' && oid % 1 === 0) {
            if (oid >= 0 && this.elinks.length > oid) {
                nextFocusLink = this.elinks[oid];
            } else if (oid === -1 && this.elinks.length > 0) {
                nextFocusLink = this.elinks[this.elinks.length - 1];
            } else {
                return;
            }
        } else if (oid instanceof HTMLElement) {
            nextFocusLink = new Link(oid);
        } else if (this.actived === null || !Object.prototype.hasOwnProperty.call(this.actived, 'element')) {
            return;
        } else {
            nextFocusLink = this.actived;
        }

        const next = (focusEle = null) => {
            this.actived = focusEle ? new Link(focusEle) : nextFocusLink;

            const scrollContainer = this.GetScrollParent(this.actived.element);
            const isbody = scrollContainer instanceof HTMLBodyElement;
            if (this.Option.autoscroll && scrollContainer != null && scrollContainer.length > 0) {
                const leftscroll = this.actived.element.offsetLeft - document.body.scrollLeft;
                if (leftscroll < 0) {
                    const scrolldis = isbody ? 0 : (scrollContainer.scrollLeft + this.actived.element.offsetLeft - 10);
                    scrollContainer.scrollLeft += scrolldis;
                }
                const rightscroll = window.innerWidth + document.body.scrollLeft - this.actived.element.offsetLeft - this.actived.element.offsetWidth;
                if (rightscroll < 0) {
                    const scrolldis = scrollContainer.scrollLeft - rightscroll + 10;
                    scrollContainer.scrollLeft += scrolldis;
                }
                const topscroll = this.actived.element.offsetTop - document.body.scrollTop;
                if (topscroll < 0) {
                    const scrolldis = isbody ? 0 : (scrollContainer.scrollTop + this.actived.element.offsetTop - 10);
                    scrollContainer.scrollTop += scrolldis;
                }
                const bottomscroll = window.innerHeight + document.body.scrollTop - this.actived.element.offsetTop - this.actived.element.offsetHeight;
                if (bottomscroll < 0) {
                    const scrolldis = scrollContainer.scrollTop - bottomscroll + 10;
                    scrollContainer.scrollTop += scrolldis;
                }
            }
            if (this.Option.focusType & this.FocusType.FOCUS) {
                this.actived.element.focus();
            }
            if (this.Option.focusClassName && (this.Option.focusType & this.FocusType.CLASS)) {
                const focusList = document.getElementsByClassName(this.Option.focusClassName);
                if (focusList.length > 0) {
                    Array.prototype.forEach.call(focusList, element => {
                        if (element.hasOwnProperty("classList")) {
                            element.classList.remove(this.Option.focusClassName);
                        } else {
                            element.className = element.className.replace(new RegExp("(\\s|^)" + this.Option.focusClassName + "(\\s|$)"), " ");
                        }
                    });
                }
                if (this.actived.element.hasOwnProperty("classList")) {
                    this.actived.element.classList.add(this.Option.focusClassName);
                } else {
                    this.actived.element.className += " " + this.Option.focusClassName;
                }
            }

            this.init(false);
            this.minDistance();

            this.moveFloatFrame();
            this.Option.activedelement = this.actived.element;
            if (this.__onfocus instanceof Function) {
                this.__onfocus(this.actived);
            }
            const ff = this.actived.element.getAttribute('fm-focus');
            if (this.Option.enableaction && ff != null) {
                try {
                    if (typeof this.actived.element.fmeval !== 'function') {
                        this.actived.element.fmeval = function (s) {
                            eval(s)
                        };
                    }
                    this.actived.element.fmeval.call(this.actived.element, ff);
                } catch (e) {
                    console.warn(e + ':action focus not found.');
                }
            } else if (typeof this.actived.element['fm-focus'] == 'function') {
                this.actived.element['fm-focus'](this.actived.element);
            }
        }

        if (typeof this.beforeFocus == "function") {
            this.beforeFocus(nextFocusLink, next);
        } else {
            next();
        }

    },
    moveFloatFrame() {
        if (Object.prototype.hasOwnProperty.call(this.Option, 'floatframe') && this.Option.floatframe !== null) {

            const actived = this.actived.element;
            this.Option.floatframe.style.width = `${actived.offsetWidth}px`;
            this.Option.floatframe.style.height = `${actived.offsetHeight}px`;
            let t = null;
            let bst = (((t = document.documentElement) || (t = document.body.parentNode)) && typeof t.scrollTop == 'number' ? t : document.body).scrollTop;
            let bsl = (((t = document.documentElement) || (t = document.body.parentNode)) && typeof t.scrollLeft == 'number' ? t : document.body).scrollLeft;
            if (typeof bst == 'undefined' || typeof bsl == 'undefined') {
                bst = bsl = 0;
            }
            const frameborderLeft = getComputedStyle(this.Option.floatframe).borderLeftWidth.match(/\d+/);
            const frameborderTop = getComputedStyle(this.Option.floatframe).borderTopWidth.match(/\d+/);
            const rect = actived.getBoundingClientRect();
            this.Option.floatframe.style.top = `${rect.top - bst - frameborderTop}px`;
            this.Option.floatframe.style.left = `${rect.left - bsl - frameborderLeft}px`;
            this.Option.floatframe.style.borderTopLeftRadius = getComputedStyle(this.actived.element).borderTopLeftRadius;
            this.Option.floatframe.style.borderTopRightRadius = getComputedStyle(this.actived.element).borderTopRightRadius;
            this.Option.floatframe.style.borderBottomLeftRadius = getComputedStyle(this.actived.element).borderBottomLeftRadius;
            this.Option.floatframe.style.borderBottomRightRadius = getComputedStyle(this.actived.element).borderBottomRightRadius;

        }
    },
    minDistance() {
        for (let i = 0; i < this.elinks.length; i += 1) {
            this.elinks[i].dist = parseInt(Math.sqrt((this.actived.x - this.elinks[i].x) * (this.actived.x - this.elinks[i].x) + (this.actived.y - this.elinks[i].y) * (this.actived.y - this.elinks[i].y)), 10);
        }
    },
    ready(option = null) {
        document.removeEventListener('keydown', e => {
            this.keydown(e);
        });
        document.addEventListener('keydown', e => {
            this.keydown(e);
        });

        if (option !== null) {
            Object.assign(this.Option, option);
            if (typeof option.onLeft instanceof Function) {
                this.onLeft = option.onLeft;
            }
            if (typeof option.onRight instanceof Function) {
                this.onRight = option.onRight;
            }
            if (typeof option.onUp instanceof Function) {
                this.onUp = option.onUp;
            }
            if (typeof option.onDown instanceof Function) {
                this.onDown = option.onDown;
            }
        }
        this.init(true, true);
        if (Object.prototype.hasOwnProperty.call(this.Option, 'floatframe') && this.Option.floatframe !== null) {
            window.addEventListener('resize', () => {
                this.setFocus();
            });
            window.addEventListener('scroll', () => {
                this.moveFloatFrame();
            });
            this.Option.floatframe.style.pointerEvents = 'none';
            if (this.Option.floatframe.style.position === '') {
                this.Option.floatframe.style.position = 'fixed';
            }
            if (this.Option.floatframe.style.display === 'none') {
                this.Option.floatframe.style.display = 'block';
            }
        }
    },
    Manage: {
        stack: [],
        list: {},
        current: '',
        Type: {
            LIST: 'list',
            STACK: 'stack',
        },
        change(name, focusobj = null) {
            if (Object.prototype.hasOwnProperty.call(this.list, name)) {
                const option = this.list[name];
                Object.assign(FocusMove.Option, option);
                FocusMove.init();
                if (focusobj !== null) {
                    FocusMove.setFocus(focusobj);
                } else if (Object.prototype.hasOwnProperty.call(option, 'activedelement') && option.activedelement !== null) {
                    FocusMove.setFocus(option.activedelement);
                }
                this.current = name;
            }
        },
        update(name, option) {
            this.add(name, option);
        },
        add(name, option) {
            if (typeof name === 'string') {
                const op = Object.assign({}, option);
                this.list[name] = op;
            } else if (typeof name === 'object' && typeof name.name === 'string') {
                this.list[name.name] = Object.assign({}, name);
            } else if (typeof name === 'object' && name.scope instanceof HTMLElement) {
                this.list[name.scope] = Object.assign({}, name);
            }
        },
        remove(name) {
            delete this.list[name];
        },
        clear(type) {
            if (type === this.Type.LIST) {
                this.list = {};
            } else if (type === this.Type.STACK) {
                this.stack = [];
            } else {
                this.list = {};
                this.stack = [];
            }
        },
        push() {
            const option = Object.assign({}, FocusMove.Option);
            this.stack.push(option);
        },
        pop() {
            if (this.stack.length > 0) {
                const option = this.stack[this.stack.length - 1];
                Object.assign(FocusMove.Option, option);
                FocusMove.init();
                FocusMove.setFocus(option.activedelement);
                this.stack.pop();
            }
        },
    },
};
if (typeof define === 'function' && define.amd) {
    define(function () {
        return FocusMove;
    });
} else if (typeof module != 'undefined' && module.exports) {
    module.exports = FocusMove;
} else {
    window.FocusMove = FocusMove;
}
export default FocusMove;