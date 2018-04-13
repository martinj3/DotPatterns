$(document).ready(function() {
    var d_canvas = document.getElementById('canvas');
    var context = d_canvas.getContext('2d');
  
    //var ballon = document.getElementById('ballon')
  	//context.drawImage(background, 0, 0);
  	  // context.fillStyle = 'rgb(' + dotToDraw.r + ',' + dotToDraw.g + ',' + dotToDraw.b + ')';
          // context.fillRect(dotToDraw.x, dotToDraw.y, dotSize, dotSize);
    
    var count = 0;
    
    var initSpeed = 3;
    var maxSpeed = 4;
    var speedDriftRate = 0.15;
    var maxTurnRate = 0.1;
    var turnRateDriftRate = 0.06;
    var maxLineWidth = 8;
    var lineWidthDriftRate = 0.4;
    var dotSize = 1;
		var numDots = 30;
    var theDots = [];
    
    for (var i = 0; i < numDots; i++) {
      var x = Math.floor(Math.random() * canvas.width);
      var y = Math.floor(Math.random() * canvas.height);
      var initDirection = Math.random() * 2 * Math.PI;
      var initTurnRate = (Math.random() -0.5) * 2 * maxTurnRate;
      var initLineWidth = Math.random() * maxLineWidth;
      var hue = Math.floor(Math.random() * 360);
      
      var newDot = new MovingDot(x,y,initDirection,initTurnRate,initSpeed, initLineWidth, hue);
         
      theDots.push(newDot);
    }

		context.fillStyle = 'black';
		context.fillRect(0, 0, canvas.width, canvas.height);
    
    var myInterval = setInterval(redraw, 33);
    
    function redraw() {
        
        for (var i = 0; i < numDots; i++) {
        	var dotToDraw = theDots[i];
          
          dotToDraw.update();
          
          dotToDraw.draw(context);


        }
        
        
        count = count + 1;
        if (count > 30000) {
            clearInterval(myInterval);
        }
    }
    
    
    function MovingDot(xp, yp, dir, tr, spd, lw, hue) {
    			this.x = xp;
          this.y = yp;
          this.direction = dir;
          this.turnRate = tr;
          this.speed = spd
          this.lineWidth = lw;
    	  var rgb = hsvToRgb(hue, 255, 255);
       this.r = rgb.r;  this.g = rgb.g;  this.b = rgb.b;
    	  
    	  this.update = function() {
    	  	this.prevX = this.x;
          this.prevY = this.y;
          this.turnRate = this.turnRate + (Math.random() - 0.5) * turnRateDriftRate;
          //this.speed = this.speed + (Math.random() - 0.5) * speedDriftRate;
          this.lineWidth = this.lineWidth + (Math.random() - 0.51) * lineWidthDriftRate;
          checkInBounds(this);
          this.direction = this.direction + this.turnRate;
          var xVelocity = this.speed * Math.cos(this.direction);
          var yVelocity = this.speed * Math.sin(this.direction);
          this.x = this.x + xVelocity;
          this.y = this.y + yVelocity;
    	  }
          
       this.draw = function(context) {
       		context.beginPath();
          context.strokeStyle = 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
          context.lineWidth = this.lineWidth;
          
          context.moveTo(this.prevX, this.prevY);
          context.lineTo(this.x, this.y);
          
          context.stroke();
       }
          
    }
    
    
    function newDirectionAndSpeed(dot) {
    	dot.speed = Math.max(1, Math.random() * maxSpeed);
      var direction = Math.floor(Math.random() * 360);
      dot.xVelocity = Math.cos(direction) * dot.speed;
      dot.yVelocity = Math.sin(direction) * dot.speed;
    }
    
    
    function checkInBounds(dot) {
      if (Math.abs(dot.turnRate) > maxTurnRate) {
        dot.turnRate = maxTurnRate * Math.sign(dot.turnRate);
      }
      if (Math.abs(dot.speed) > maxSpeed) {
        dot.speed = maxSpeed * Math.sign(dot.speed);
      }
      if (dot.lineWidth > maxLineWidth) {
        dot.lineWidth = maxLineWidth;
      }
      if (dot.lineWidth < 1) {
        dot.lineWidth = 1;
      }
    	if (dot.x < 0) {
        dot.prevX = canvas.width;
      	dot.x = canvas.width;
      }
      if (dot.y < 0) {
        dot.prevY = canvas.height;
      	dot.y = canvas.height;
      }
      if (dot.x > canvas.width) {
        dot.prevX = 0;
      	dot.x = 0;
      }
      if (dot.y > canvas.height) {
        dot.prevY = 0
      	dot.y = 0;
      }
    }
    
    
    
    function hsvToRgb(h, s, v) {
        var rgb = {};
        if (s === 0) {
            rgb.r = rgb.g = rgb.b = v;
        } else {
            if (h < 0) { h = h + 360; }
            h = Math.abs(h % 360);
            var t1 = v;
            var t2 = (255 - s) * v / 255;
            var t3 = (t1 - t2) * (h % 60) / 60;
            if (h < 60) { rgb.r = t1; rgb.b = t2; rgb.g = t2 + t3; }
            else if (h < 120) { rgb.g = t1; rgb.b = t2; rgb.r = t1 - t3; }
            else if (h < 180) { rgb.g = t1; rgb.r = t2; rgb.b = t2 + t3; }
            else if (h < 240) { rgb.b = t1; rgb.r = t2; rgb.g = t1 - t3; }
            else if (h < 300) { rgb.b = t1; rgb.g = t2; rgb.r = t2 + t3; }
            else if (h < 360) { rgb.r = t1; rgb.g = t2; rgb.b = t1 - t3; }
            else { rgb.r = 0; rgb.g = 0; rgb.b = 0; }
        }
        return { r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b) };
    }
    
});


    