"use strict";var video=document.getElementById("scannerElement");function createSnapshot(e){var t=document.createElement("canvas"),o=t.getContext("2d");t.width=e.offsetWidth,t.height=e.offsetHeight,o.drawImage(e,0,0,e.offsetWidth,e.offsetHeight);var a=t.toDataURL("image/jpeg"),i=new FormData;i.append("file",a),fetch("/upload-snapshot",{method:"POST",body:i})}navigator.mediaDevices.getUserMedia?navigator.mediaDevices.getUserMedia({audio:!1,video:{width:{ideal:100},height:{ideal:50}}}).then(function(e){video.srcObject=e,setInterval(function(){createSnapshot(video)},2e3)}).catch(function(e){console.log("Error: ",e)}):console.log("Your browser down not support video streams");