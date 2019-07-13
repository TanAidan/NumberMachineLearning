
//copy video into a canvas, read intensities of pixels, and downsample the image (0-255 gray/5x5)
//lib svm

async function xor() {
    const SVM = await
    require('https://cdn.jsdelivr.net/npm/libsvm-js@0.2.1/dist/browser/wasm/libsvm.js'); //getting the link to download
    const svm = new SVM({
        kernel: SVM.KERNEL_TYPES.RBF, // The type of kernel I want to use
        type: SVM.SVM_TYPES.C_SVC,    // The type of SVM I want to run
        gamma: 1,                     // RBF kernel gamma parameter
        cost: 1                       // C_SVC cost parameter
    });

    // This is the xor problem
    //
    //  1  0
    //  0  1
    const features = [[0, 0], [1, 1], [1, 0], [0, 1]];
    const labels = [0, 0, 1, 1];
    svm.train(features, labels);  // train the model
    const predictedLabel = svm.predictOne([0.7, 0.8]);
    console.log(predictedLabel) // 0
}

xor().then(() => console.log('done!'));

var video = document.querySelector("#videoElement");  // gets tag from html page
var stop = document.querySelector("#stop");

if (navigator.mediaDevices.getUserMedia){  //checking to see if method exists
	navigator.mediaDevices.getUserMedia ({video : true})
	.then(function(stream){  //passing in the stream that the method returns              
		video.srcObject = stream;
		var mediaRecorder = new MediaRecorder(stream);
		mediaRecorder.start(2000);
		console.log(mediaRecorder.state);
		console.log("recorder started");
		stop.onclick = function(){
			mediaRecorder.stop();
			console.log("recorder stopped");
		}
		mediaRecorder.ondataavailable = function(e){
			console.log(e);
			console.log(e.data.size);
			
		}
	})
	.catch(function (err0r){
		console.log(err0r);
		console.log("Something went wrong!");
	});
}


//Vainavi's code
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function getVideoImage(path, secs, callback){
		var me = this, video = document.querySelector("#videoElement"); //not sure if this is right
		video.onloadedmetadata = function(){
			if ('function' === typeof secs){
				secs = secs(this.duration);
			}
			this.currentTime = Math.min(Math.max(0, (secs <0 ? this.duration : 0) + secs), this.duration);
		};
		video.onseeked = function(e){
			var canvas = document.createElement('canvas');
			canvas.height = video.videoHeight;
			canvas.width = video.videoWidth;
			var ctx = canvas.getContext('2d');
			ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
			var img = new Image();
			img.src =canvas.toDatURL();
			callback.call(me, img, this.currentTime);
		};
		video.onerror = function(e) {
			callback.call(me, undefined, undefined, e);
		};
		video.src = path;
	}
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///- REQUIRE FN
	// equivalent to require from node.js
	function require(url){
	    if (url.toLowerCase().substr(-3)!=='.js') url+='.js'; // to allow loading without js suffix;
	    if (!require.cache) require.cache=[]; //init cache
	    var exports=require.cache[url]; //get from cache
	    if (!exports) { //not cached
	            try {
	                exports={};
	                var X=new XMLHttpRequest();
	                X.open("GET", url, 0); // sync
	                X.send();
	                if (X.status && X.status !== 200)  throw new Error(X.statusText);
	                var source = X.responseText;
	                // fix (if saved form for Chrome Dev Tools)
	                if (source.substr(0,10)==="(function("){ 
	                    var moduleStart = source.indexOf('{');
	                    var moduleEnd = source.lastIndexOf('})');
	                    var CDTcomment = source.indexOf('//@ ');
	                    if (CDTcomment>-1 && CDTcomment<moduleStart+6) moduleStart = source.indexOf('\n',CDTcomment);
	                    source = source.slice(moduleStart+1,moduleEnd-1); 
	                } 
	                // fix, add comment to show source on Chrome Dev Tools
	                source="//@ sourceURL="+window.location.origin+url+"\n" + source;
	                //------
	                var module = { id: url, uri: url, exports:exports }; //according to node.js modules 
	                var anonFn = new Function("require", "exports", "module", source); //create a Fn with module code, and 3 params: require, exports & module
	                anonFn(require, exports, module); // call the Fn, Execute the module
	                require.cache[url]  = exports = module.exports; //cache obj exported by module
	            } catch (err) {
	                throw new Error("Error loading module "+url+": "+err);
	            }
	    }
	    return exports; //require returns object exported by module
	}
	///- END REQUIRE FN
