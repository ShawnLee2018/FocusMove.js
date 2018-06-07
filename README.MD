install

`npm install`

build

`npm run build`
 

 
 

*first usage:*

FocusMove.ready({
priority: Priority.LEFT | Priority.TOP, Priority. default processing all.Multiple values can be connected by '|' , e.g. Priority.LEFT | Priority.TOP. when it have Priority.CONTAIN  the other four properties is invalid.

distmode: FocusMove.DistMode.CENTER, //Distance calculation method,center or edge.default is FocusMove.DistMode.EDGE.

selector: "a", //selector who can used by document.querySelectorAll. default is "[tabindex]"

scope: document.getElementById("container"), //lock the scope in this htmlelement.

floatframe: document.getElementById("floatframe"),//A float div covered on the focus element if necessary.

}); 

FocusMove.init() //Initialization to get focus object. setSelector() and ready() will call this function,you don't have to call it manually.This function will be set the first element to be focused.

FocusMove.onFocus=function(obj){} //will call after focus changed.

function onKeyEnterDown(obj) {
    $(obj).trigger("click");
}

FocusMove.addEvent({
key: 13,//keycode
fun: onKeyEnterDown,//callback
once:false,//auto remove if once is ture,default is false;
before:false//call fun before focus change if ture or after,default is false
}) //Additional keysevent.

FocusMove.removeEvent({
key: 13,
fun: onKeyEnterDown
}) //remove keyevent which added by addEvent().

FocusMove.setFocus(htmlelement)  //change focus manual

FocusMove.setScope(htmlelement) //change scope

FocusMove.setSelector(string) //change focus item selector 

FocusMove.preventDefault()//skip once action

FocusMove.pause //pause focus move

 
**second usage:**
this  is  hight priority then the first way.

```<div  id="f1" fm-right="f2" tabindex="-1">goto world</div>
<div  id="f2" fm-left="f1" tabindex="-1">goto world</div>```


1、if current focus target has "left right up down" property,it will force set to target  focus.
2、if direction property value is '-1' ,the target direction  will be stop move any way.
3、if direction was empty,it will be auto move.


**FocusScopeManage**

first：
`FocusMove.Manage.change("menu"); //change scope`

`FocusMove.Manage.add("menu"); //add new scope to manager`

`FocusMove.Manage.add("menu",{scope:"a"}); //add new scope to manager`

`FocusMove.Manage.remove("menu"); //remove scope from manager`

second:

`FocusMove.Manage.push(); //push current scope to stack.`

`FocusMove.Manage.pop(); //remove current scope and revert last scope from stack.`

`FocusMove.Manage.clear(); //clear all stack and scope list.`

