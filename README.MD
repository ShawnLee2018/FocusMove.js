# A javascript spatial navigation library

[![NPM version](https://img.shields.io/npm/v/focusmove.svg?style=flat)](https://www.npmjs.org/package/focusmove) [![Build Status](https://travis-ci.org/ShawnLee2018/FocusMove.js.svg?branch=master)](https://travis-ci.org/ShawnLee2018/FocusMove.js)

## Installation

`npm install focusmove --save`

## Build

`npm run build`
 

 ### Simply usage:

 make the focusable element have a tabindex attribute 
 
 ```html
 
 <script type="text/javascript" src="dist/focusmove.js"></script>
 <script>
 window.onload=function(){
     FocusMove.ready();
 }
 </script>
 
 ```
 

### Normaly usage

```javascript
var config={
priority: Priority.LEFT | Priority.TOP, Priority. default processing all.Multiple values can be connected by '|' , e.g. Priority.LEFT | Priority.TOP. when it have Priority.CONTAIN  the other four properties is invalid.

distmode: FocusMove.DistMode.CENTER, // Distance calculation method,center or edge.default is FocusMove.DistMode.EDGE.

selector: "a", // selector who can used by document.querySelectorAll. default is "[tabindex]"

scope: document.getElementById("container"), // lock the scope in this htmlelement.

floatframe: document.getElementById("floatframe"),//A float div covered on the focus element if necessary.
enableaction: true, // if dircetion attribute id is not found then eval dirction string and focus attribute as script.      
       

}
FocusMove.ready(); 

```
```javascript
FocusMove.init(); // Initialization to get focus object. setSelector() and ready() will call this function,you don't have to call it manually.This function will be set the first element to be focused.
```
```javascript
FocusMove.onFocus=function(obj){} // will call after focus changed.
```

```javascript
function onKeyEnterDown(obj) {
    $(obj).trigger("click");
}

FocusMove.addEvent({
key: 13,// keycode
fun: onKeyEnterDown,// callback
once:false,// auto remove if once is ture,default is false;
before:false// call fun before focus change if ture or after,default is false
}) // Additional keysevent.

FocusMove.removeEvent({
key: 13,
fun: onKeyEnterDown
}) // remove keyevent which added by addEvent().

```
```javascript

FocusMove.setFocus(htmlelement)  // change focus manual

FocusMove.setScope(htmlelement) // change scope

FocusMove.setSelector(string) // change focus item selector 

FocusMove.preventDefault()//skip once action

FocusMove.pause = true; //pause focus move

```
 
### Declarative usage

this is hight priority then the autofocus way.

```html

<div  id="f1" fm-right="f2" fm-click="alert('key enter')" tabindex="-1">goto world</div>
<div  id="f2" fm-left="f1" fm-up="alert('you do up')" tabindex="-1">goto world</div>

```


>* if current focus target has "fm-left fm-right fm-up fm-down" property,it will force set to target  focus.
>* if direction property value is '-1' ,the target direction  will be stop move any way.
>* if direction is empty,it will be auto move.
>* if fm-[direction/click] is not empty then the engine will first find target element which id is the same as this attribute.if not found then try to execute attribute string as javascript and 'this' is current element。

## FocusScopeManage 

*hash usage:*

```javascript
FocusMove.Manage.add("menu"); //add new scope to manager

FocusMove.Manage.add("menu",{scope:"a"}); //add new scope to manager

FocusMove.Manage.change("menu"); //change scope

FocusMove.Manage.remove("menu"); //remove scope from manager
```

*stack usage:*

```javascript
FocusMove.Manage.push(); //push current scope to stack.

FocusMove.Manage.pop(); //remove current scope and revert last scope from stack.

FocusMove.Manage.clear(); //clear all stack and scope list.
```

