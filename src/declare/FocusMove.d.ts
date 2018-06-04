declare namespace FocusMove {
   
    public static var Priority: {
        LEFT,
        RIGHT,
        TOP,
        BOTTOM,
        CONTAIN
    };
    public static var DistMode: {
        CENTER,
        EDGE,
    };
    public static var KeyEvent: {
        KEY_LEFT: Number,
        KEY_RIGHT: Number,
        KEY_UP: Number,
        KEY_DOWN: Number,
        KEY_DEBUG: Number,
    };

    public var Option: {
        selector: String,
        scope: HTMLElement,
        distmode: DistMode,
        priority: Priority,
        floatframe: HTMLElement,
        activedelement: HTMLElement,
        autoscroll: boolean,
        enableaction: boolean,
    };
    public var pause: boolean;
    public var onFocus: function;
    private function onLeft(): void;
    private function onRight(): void;
    private function onUp(): void;
    private function onDown(): void;
    private function moveFloatFrame(): void;
    private function GetScrollParent(element: HTMLElement): HTMLElement;
    private function minDistance(): void;
    function ready(): void;
    function ready(option: Object): void;
    function Debug(): void;
    function preventDefault(): void;
    function keydown(e: KeyEvent): void;
    function addEvent(event: Object): void;
    function removeEvent(event: Object): void;
    function init(): void;
    function init(autoFocus: boolean=true): void;
    function init(autoFocus: boolean=true, clearKeyEvents: boolean=false): void;
    function setScope(containerElement: HTMLElement): void;
    function setSelector(selector: String): void;
    function setFocus(target: Number | String | Object): void;
    declare namespace Manage {

        private var stack: Array;
        private var list: Object;
        public var current: string;
        public static var Type: {
            LIST,
            STACK,
        };
        function change(name: String): void;
        function change(name: String, focusobj: HTMLElement): void;
        function update(name: String, option: Object): void;
        function add(name: String, option: Object): void;
        function add(name: Object): void;
        function remove(name: String): void;
        function clear(type: "list" | "stack"): void;
        function push(): void;
        function pop(): void;
    }
}