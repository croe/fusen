(function(global){

	function FusenBuilder(canvas, ds) {
		this.canvas = canvas;
		this.ds = ds;
		this.fusens = {};
	}

	FusenBuilder.prototype.getFusen = function(id) {
		return this.fusens[id];
	}

	FusenBuilder.prototype.createFusen = function(id, text, color) {
        var fusen = new Fusen(this.canvas, this.ds, id, text, color);
        this.fusens[id] = fusen;
		return fusen;
	}

	function Fusen(canvas, ds, _id, text, color) {
		var self = this;
		this.id = _id;
		this.ds = ds;
        this.pos = {x : 0, y : 0};
		this.canvas = canvas;

        if (fusen_util.getDevice() == "mobile") {
            this.canvas.append('<div id="'+this.id+'" class="p-husen p-husen--'+color+'">'+fusen_util.htmlEscape(text)+'<div class="p-husen__note">付箋を長押しで削除</div></div>');
        } else {
            this.canvas.append('<div id="'+this.id+'" class="p-husen p-husen--'+color+'">'+fusen_util.htmlEscape(text)+'<div class="p-husen__cross">×</div></div>');
        }

        var cross = $(".p-husen__cross", "#"+this.id);

        $( "#"+this.id ).draggable({
          start: function() {
          },
          drag: function() {
            self.pos.x = $("#"+self.id).position().left;
            self.pos.y = $("#"+self.id).position().top;
          },
          stop: function() {
            self.ds.child(self.id).set({
                x : self.pos.x,
                y : self.pos.y
            });
            self.setPos(self.pos.x, self.pos.y);
          }
        });

        cross.click(function(e) {
            self.ds.remove(self.id);
            e.stopPropagation();
        });

        if (fusen_util.getDevice() == "mobile") {
            $("#"+self.id).on("taphold", tapholdHandler);
        }

        function tapholdHandler(e){
            ret = confirm("このメッセージを削除しますか？");
            if (ret == true){
            	self.ds.remove(self.id);
            }
        }
	}

	Fusen.prototype.setPos = function(x, y) {
		var self = this;
		self.pos.x = x;
		self.pos.y = y;
		$("#" + this.id).offset({top : self.pos.y, left : self.pos.x});

		if( (self.pos.y + $("#"+self.id).height()) > self.canvas.height()){
			self.canvas.css( "height", (self.pos.y + $("#"+self.id).outerHeight())+"px" );
		}
		if( (self.pos.x + $("#"+self.id).width()) > self.canvas.width()){
			self.canvas.css( "width", (self.pos.x + $("#"+self.id).outerWidth())+"px" );
		}
	}

	Fusen.prototype.removeSelf = function() {
		var self = this;
		$("#" + self.id).remove();
	}

	global.FusenBuilder = FusenBuilder;
	global.Fusen = Fusen;
}(window))