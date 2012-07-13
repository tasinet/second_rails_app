var DERPBACK_DOMAIN_ID=-1;
(function($) {
 
   $.feedback = function(element, options) {
      this.options = {};
       
      element.data('feedback', this);
      
      this.init = function(element, options) {         
	 this.element = element;
         this.options = $.extend({}, $.feedback.defaultOptions, options); 
	 this.load();
	 if (this.options.show!==0){
		this.show();
		if (this.options.opened){
			this.hover();
			this.open();
		}
	}
      };
      this.load = function(name) {
	this.element.addClass('feedback-div-closed');
	this.open_state = 0;
	this.element.html(this.template());
	this.element.click(this.toggle);
	this.element.mouseenter(this.hover);
	this.element.mouseleave(this.unHover);
	this.element.find('.feedback-button').mouseenter(this.hoverButt);
	this.element.find('.feedback-button').mouseleave(this.unHoverButt);
	this.element.find('.feedback-button').click(this.clickButt);
	this.element.find('.feedback-div-body').click(function(e){e.stopPropagation();e.preventDefault()});
      };

	//Mouse bindings
      this.hover = function(){
		console.log('hover');
		if (!$(this).data('feedback').open_state ){
			console.log(this,$(this).data('feedback').options.linkHighlightColour);
			$(this).css('color',$(this).data('feedback').options.linkHighlightColour);
			$(this).find('p.vertical-text').css('textShadow',$(this).data('feedback').options.linkHighlightTextShadow);
			console.log( $(this).data('feedback').options.linkHighlightTextShadow );
		}
	};
      this.unHover = function(){
		if (!$(this).data('feedback').open_state ){
			$(this).css('color','white');
			$(this).find('p.vertical-text').css('textShadow',$(this).data('feedback').options.linkTextShadow);
		}
	};
      this.toggle = function() {
	var data = $(this).data('feedback');
	if (data.open_state)
		data.close();
	else
		data.open();
      }

	//togglers
      this.open = function() {
	this.element.stop(true,true).attr('style','');
	this.show_page('main');
	this.open_state=1;
	this.element.animate({width:'360px'},250);
	this.element.find('p.vertical-text').css('color',this.options.linkHighlightColour).animate({left:'-34px'},250);
      }
      this.close = function() {
	this.element.stop(true,true);
	this.open_state=0;
	this.element.animate({width:'28px'},250);
	this.element.find('p.vertical-text').attr('style','').animate({left:'-37px'},250);
      }
      this.hide = function(name) {
	this.element.hide();
      };
      this.show = function(name) {
	this.element.show();
      };
      this.input_key_pressed = function(key) {
	if (key&&key.keyCode==13)
		this.submit();
      };
	//submit feedback function
      this.submit = function() {
	var body = this.element.find('#feedback-div-body-'+this.page_active);
	var message = body.find('textarea').val();
	var email = body.find('input.first').val();
	if (!message)
		return alert('You forgot to write something!');
	if ( this.page_active=='ask' && !email )
		return alert('Please let us know where we can reach you for an answer.\r\nFill in your email address.');
	if (email)
		this.element.find('input.first').val(email);//make email same on all pages
	var data = {domain_id:DERPBACK_DOMAIN_ID,feedback_type:this.page_active,message:message,email:email,fbid:typeof FB != "undefined" && FB && FB.getUserID()?FB.getUserID():false};
	$.ajax({
		type: 'post',
		url: 'http://derpback.herokuapp.com/add_derp',
		data: { feedback: data },
		dataType: "jsonp",
		success: this.submit_complete,
		error: this.submit_complete,
	});
      }
      this.submit_complete = function(r,s,t){
	if (r.ok==1){
		//todo clear textarea just submitted
		var self = $('#feedback-div').data('feedback');
		self.element.find('#feedback-div-body-'+self.page_active+' textarea').eq(0).val('');
		self.show_page('thanks');//timeout to close: 5s.
		self.element.find('#feedback-div-body-thanks .second').focus();
	}
	else
		alert('Something went wrong while submiting your feedback. Please try again.\r\nError message:'+s+' '+r.error);
      }
	this.pages={
		like: {
			description: '"I like (...)"'
		},
		dislike: {
			description: '"I dislike (...)"'
		},
		suggest: {
			description: 'Make a Suggestion'
		},
		ask: {
			description: 'Ask a Question'
		},
		problem: {
			description: 'Report a Problem'
		}
	}
	//main panel interaction
	this.hoverButt = function(){
		//read attr: data-feedbackpage
		var data = $('#feedback-div').data('feedback');
		var pagename = $(this).data('feedbackpage');
		var page = data.pages[pagename];
		data.element.find('#menupanelstatus').text(page.description);
		
		//status this.pages[id].description
	}
	this.unHoverButt = function(){
		var data = $('#feedback-div').data('feedback');
		data.element.find('#menupanelstatus').text('');
	}
	this.clickButt = function(){
		var data = $('#feedback-div').data('feedback');
		var pagename = $(this).data('feedbackpage');
		data.show_page( pagename );
	}
	this.show_page = function(name){
		this.page_active=name;
		$('.feedback-div-body').hide();
		$('#feedback-div-body-'+name).show();
	}
	//html,css
      this.template = function(){
	return ['<style>\
		p.vertical-text{margsn-bottom: 21px;margin-left: 0px !important;margin-right: 0px !important;margin-top: 21px;line-height:normal;background-attachment: scroll;background-clip: initial;background-color: transparent;background-image: none;background-origin: padding-box;border-bottom-color: white;border-bottom-style: none;border-bottom-width: 0px;border-left-color: white;border-left-style: none;border-left-width: 0px;border-right-color: white;border-right-style: none;border-right-width: 0px;border-top-color: white;border-top-style: none;border-top-width: 0px;bottom: auto;box-shadow: none;cursor: auto;display: block;font-family:"Trebuchet MS", Helvetica, Arial;font-size: 21px;font-weight: normal;height: 25px;left: -37px;position: absolute;right: 0px;text-align: center;text-shadow: black -1px 1px 1px;top: 16px;white-space: nowrap;width: 100px;-webkit-transform: rotate(-90deg);-moz-transform: rotate(-90deg);-ms-transform: rotate(-90deg);-o-transform: rotate(-90deg);}\
		p.vertical-text:hover{cursor:pointer}\
		#feedback-div{box-shadow: 1px 1px 1px #000;color:white;font-family:"Trebuchet MS",Helvetica,Arial;z-index:9999999}\
		.feedback-div-closed{position:fixed;right:-2px;bottom:140px;height:100px;width:28px;border:1px black solid;background:#888;font-size:21px;}\
		.feedback-div-closed:hover{cursor:pointer;}\
		.feedback-div-container{position:absolute;left:30px;bottom:100%;top:-200px;background:#888;border:1px black solid;border-bottom:0px;width:360px;}\
		.feedback-div-body{background:transparent;width:328px;;height:300px;text-align:center;position:absolute;cursor:auto;line-height: 1.3;box-sizing:initial !important}\
			\
		#feedback-div-body-main{line-height:3.3;}\
		.feedback-div-body h2{margin:0;background-attachment: scroll;background-clip: initial;background-color: transparent;background-image: none;background-origin: padding-box;border-bottom-color: white;border-bottom-style: none;border-bottom-width: 0px;border-left-color: white;border-left-style: none;border-left-width: 0px;border-right-color: white;border-right-style: none;border-right-width: 0px;border-top-color: white;border-top-style: none;border-top-width: 0px;bottom: auto;box-shadow: none;color: white;cursor: auto;display: block;font-family: "Trebuchet MS", Helvetica, Arial;font-size: 32px;font-weight: bold;height: 44px;line-height: 1.375;margin-bottom:16px;margin-top: 10px;position: static;right: auto;text-align: center;text-shadow: black 1px 1px 1px;width: 328px;z-index: auto;}\
		.feedback-button{background-attachment: scroll;background-clip: initial;background-color: #DDD;background-image: none;background-origin: padding-box;border-bottom-color: #888;border-bottom-left-radius: 6px;border-bottom-right-radius: 6px;border-bottom-style: none;border-bottom-width: 0px;border-left-color: #888;border-left-style: none;border-left-width: 0px;border-right-color: #888;border-right-style: none;border-right-width: 0px;border-top-color: #888;border-top-left-radius: 6px;border-top-right-radius: 6px;border-top-style: none;border-top-width: 0px;bottom: auto;box-shadow: none;color: #888;cursor: auto;display: inline-block;font-family: "Trebuchet MS", Helvetica, Arial;font-size: 21px;font-weight: bold;height: 56px;line-height: 2.0;margin-bottom: 6px;padding-top: 14px;position: static;right: auto;text-align: center;text-decoration: none;width: 70px;z-index: auto;}\
		.feedback-button:hover{background:#f5f5f5;cursor:pointer;color:#888;text-decoration:none;}\
		.feedback-button:link,feedback-button:visited,feedback-button:active{color:#888;text-decoration:none;}\
			\
		.feedback-div-body textarea{box-sizing:initial !important;border:0px;background-attachment: scroll;background-clip: initial;background-color: white;background-image: none;background-origin: padding-box;border-bottom-color: transparent;border-bottom-left-radius: 6px;border-bottom-right-radius: 6px;border-bottom-style: solid;border-bottom-width: 1px;border-left-color: transparent;border-left-style: solid;border-left-width: 1px;border-right-color: transparent;border-right-style: solid;border-right-width: 1px;border-top-color: transparent;border-top-left-radius: 6px;border-top-right-radius: 6px;border-top-style: solid;border-top-width: 1px;bottom: auto;box-shadow: none;color: black;cursor: auto;display: inline-block;font-family: "Lucida Grande";font-size: 15px;height:151px;letter-spacing: normal;line-height: normal;margin-bottom: -22px;margin-left: 2px;margin-right: 2px;margin-top: -17px;padding-bottom: 2px;padding-left: 2px;padding-right: 2px;padding-top: 2px;position: static;resize: both;right: auto;text-align: auto;text-indent: 0px;text-shadow: none;text-transform: none;white-space: pre-wrap;width: 310px;word-spacing: 0px;word-wrap: break-word;z-index: auto;vertical-align:baseline;}\
		.feedback-div-body input.first{box-sizing:initial !important;background-attachment: scroll;background-clip: initial;background-color: white;background-image: none;background-origin: padding-box;border-bottom-color: transparent;border-bottom-left-radius: 6px;border-bottom-right-radius: 6px;border-bottom-style: inset;border-bottom-width: 2px;border-left-color: transparent;border-left-style: inset;border-left-width: 2px;border-right-color: transparent;border-right-style: inset;border-right-width: 2px;border-top-color: transparent;border-top-left-radius: 6px;border-top-right-radius: 6px;border-top-style: inset;border-top-width: 2px;bottom: auto;box-shadow: none;color: black;cursor: auto;display: inline-block;font-family: "Lucida Grande";font-size: 14px;height: 27px;letter-spacing: normal;line-height: normal;margin-bottom: 5px;margin-left: 2px;margin-right: 2px;margin-top: 0px;padding-bottom: 2px;padding-left: 2px;padding-right: 2px;padding-top: 2px;position: static;right: auto;text-align: center;text-indent: 0px;text-shadow: none;text-transform: none;width: 282px;word-spacing: 0px;z-index: auto;vertical-align:baseline;}\
		.feedback-div-body div.big {margin:0;margin-top:21px;background-attachment: scroll;background-clip: initial;background-color: transparent;background-image: none;background-origin: padding-box;border-bottom-color: white;border-bottom-style: none;border-bottom-width: 0px;border-left-color: white;border-left-style: none;border-left-width: 0px;border-right-color: white;border-right-style: none;border-right-width: 0px;border-top-color: white;border-top-style: none;border-top-width: 0px;bottom: auto;box-shadow: none;color: white;cursor: auto;display: block;font-family: "Trebuchet MS", Helvetica, Arial;font-size: 21px;height: 70px;position: static;right: auto;text-align: center;width: 328px;z-index: auto;}\
		.feedback-div-body .second{box-sizing:initial !important;background-attachment: scroll;background-clip: initial;background-color: #555;background-image: none;background-origin: padding-box;border-bottom-color: silver;border-bottom-left-radius: 6px;border-bottom-right-radius: 6px;border-bottom-style: outset;border-bottom-width: 2px;border-left-color: silver;border-left-style: outset;border-left-width: 2px;border-right-color: silver;border-right-style: outset;border-right-width: 2px;border-top-color: silver;border-top-left-radius: 6px;border-top-right-radius: 6px;border-top-style: outset;border-top-width: 2px;bottom: auto;box-shadow: black 1px 1px 1px 0px;color: white;cursor: default;display: inline-block;font-family: "Lucida Grande";font-size: 15px;height: 29px;letter-spacing: normal;line-height: normal;margin-bottom: 2px;margin-left: 0px;margin-right: 2px;margin-top: 0px;padding-bottom: 2px;padding-left: 2px;padding-right: 2px;padding-top: 2px;position: static;right: auto;text-align: center;text-indent: 0px;text-shadow: black 1px 1px 1px;text-transform: none;white-space: pre;width: 110px;word-spacing: 0px;z-index: auto;vertical-align:baseline;}\
		.feedback-div-body .third{box-sizing:initial !important;background-attachment: scroll;background-clip: initial;background-color: green;background-image: none;background-origin: padding-box;border-bottom-color: silver;border-bottom-left-radius: 6px;border-bottom-right-radius: 6px;border-bottom-style: outset;border-bottom-width: 2px;border-left-color: silver;border-left-style: outset;border-left-width: 2px;border-right-color: silver;border-right-style: outset;border-right-width: 2px;border-top-color: silver;border-top-left-radius: 6px;border-top-right-radius: 6px;border-top-style: outset;border-top-width: 2px;bottom: auto;box-shadow: black 1px 1px 1px 0px;color: white;cursor: default;display: inline-block;font-family: "Lucida Grande";font-size: 15px;height: 29px;letter-spacing: normal;line-height: normal;margin-bottom: 2px;margin-left: -2px;margin-right: 2px;margin-top: 0px;padding-bottom: 2px;padding-left: 2px;padding-right: 2px;padding-top: 2px;position: static;right: auto;text-align: center;text-indent: 0px;text-shadow: black 1px 1px 1px;text-transform: none;white-space: pre;width:188px;word-spacing: 0px;z-index: auto;vertical-align:baseline;}\
		.feedback-close-button{position: absolute;top: 12px;right: 12px;background: white;color: #888;width: 12px;height: 12px;border-radius: 6px;padding-top: 0;line-height: 12px;font-size: 16px;font-weight: normal;text-decoration: none;text-align: Center;font-family: arial;}\
		.feedback-close-button:hover{cursor:pointer}\
		@-moz-document url-prefix() {\
			.feedback-div-body .second{ height:37px;width:118px;}\
			.feedback-div-body .third{ height:37px;width:196px;}\
			.feedback-div-body textarea {margin-bottom:-17px;vertical-align:text-bottom;}\
		}\
		\
		</style>\
			<p class="vertical-text">feedback</p>\
			<div class="feedback-div-container">\
				<div class="feedback-div-body" id="feedback-div-body-main">\
					<a href="" class="feedback-close-button" onclick="$(\'#feedback-div\').data(\'feedback\').close()">&times;</a>\
					<h2>Help us improve!</h2>\
					<a href="#" class="feedback-button" data-feedbackpage="like">:)</a> <a href="#" class="feedback-button" data-feedbackpage="dislike">:(</a><BR/>\
					<a href="#" class="feedback-button" data-feedbackpage="ask">?</a> <a href="#" class="feedback-button" data-feedbackpage="problem">&gt;:[</a> <a href="#" class="feedback-button" data-feedbackpage="suggest">!</a><BR/>\
					<h2 id="menupanelstatus"></h2>\
				</div>\
				<div class="feedback-div-body" id="feedback-div-body-like" style="display:none">\
					<a href="" class="feedback-close-button" onclick="$(\'#feedback-div\').data(\'feedback\').close()">&times;</a>\
					<h2>"I liked this:"</h2>\
					<textarea placeholder="Tell us what you liked - in as many words as you like. (But less than 5000)"></textarea>\
					<div class="big">&nbsp;@&nbsp;<input class="first" onkeyup="$(\'#feedback-div\').data(\'feedback\').input_key_pressed(event)" placeholder="Want to hear back? Leave your email" type="text"></input><BR/>\
						<button  class="second" onclick="$(\'#feedback-div\').data(\'feedback\').show_page(\'main\')">Back</button>\
						<button  class="third" value="Send" onclick="$(\'#feedback-div\').data(\'feedback\').submit()">Send</button>\
					</div>\
				</div>\
				<div class="feedback-div-body" id="feedback-div-body-dislike" style="display:none">\
					<a href="" class="feedback-close-button" onclick="$(\'#feedback-div\').data(\'feedback\').close()">&times;</a>\
					<h2>"I did not like:"</h2>\
					<textarea placeholder="Let us know if anything annoys you."></textarea>\
					<div class="big">&nbsp;@&nbsp;<input class="first" onkeyup="$(\'#feedback-div\').data(\'feedback\').input_key_pressed(event)" placeholder="Want to hear back? Leave your email" type="text"></input><BR/>\
						<input type="button" class="second" onclick="$(\'#feedback-div\').data(\'feedback\').show_page(\'main\')" value="Back"></input>\
						<input type="button" class="third" value="Send" onclick="$(\'#feedback-div\').data(\'feedback\').submit()"></input>\
					</div>\
				</div>\
				<div class="feedback-div-body" id="feedback-div-body-suggest" style="display:none">\
					<a href="" class="feedback-close-button" onclick="$(\'#feedback-div\').data(\'feedback\').close()">&times;</a>\
					<h2>"I have an idea!"</h2>\
					<textarea placeholder="We are very keen to hear your suggestions, please don\'t hold back!"></textarea>\
					<div class="big">&nbsp;@&nbsp;<input class="first" onkeyup="$(\'#feedback-div\').data(\'feedback\').input_key_pressed(event)" placeholder="Want to hear back? Leave your email" type="text"></input><BR/>\
						<input type="button" class="second" onclick="$(\'#feedback-div\').data(\'feedback\').show_page(\'main\')" value="Back"></input>\
						<input type="button" class="third" value="Send" onclick="$(\'#feedback-div\').data(\'feedback\').submit()"></input>\
					</div>\
				</div>\
				<div class="feedback-div-body" id="feedback-div-body-problem" style="display:none">\
					<a href="" class="feedback-close-button" onclick="$(\'#feedback-div\').data(\'feedback\').close()">&times;</a>\
					<h2>Report a problem:</h2>\
					<textarea placeholder="Make sure you include your browser version and as much detail as you can. Thanks!"></textarea>\
					<div class="big">&nbsp;@&nbsp;<input class="first" onkeyup="$(\'#feedback-div\').data(\'feedback\').input_key_pressed(event)" placeholder="Want to hear back? Leave your email" type="text"></input><BR/>\
						<input type="button" class="second" onclick="$(\'#feedback-div\').data(\'feedback\').show_page(\'main\')" value="Back"></input>\
						<input type="button" class="third" value="Send" onclick="$(\'#feedback-div\').data(\'feedback\').submit()"></input>\
					</div>\
				</div>\
				<div class="feedback-div-body" id="feedback-div-body-ask" style="display:none">\
					<a href="" class="feedback-close-button" onclick="$(\'#feedback-div\').data(\'feedback\').close()">&times;</a>\
					<h2>Ask us anything:</h2>\
					<textarea placeholder="Type your question here."></textarea>\
					<div class="big">&nbsp;@&nbsp;<input class="first" onkeyup="$(\'#feedback-div\').data(\'feedback\').input_key_pressed(event)" placeholder="Your email address (for us to reply)" type="text"></input><BR/>\
						<input type="button" class="second" onclick="$(\'#feedback-div\').data(\'feedback\').show_page(\'main\')" value="Back"></input>\
						<input type="button" class="third" value="Send" onclick="$(\'#feedback-div\').data(\'feedback\').submit()"></input>\
					</div>\
				</div>\
				<div class="feedback-div-body" id="feedback-div-body-thanks" style="display:none">\
					<a href="" class="feedback-close-button" onclick="$(\'#feedback-div\').data(\'feedback\').close()">&times;</a>\
					<h2>&nbsp;</h2>\
					<h2>Thank you for your feedback!</h2>\
					<h2>&nbsp;</h2>\
					<input type="button" class="second" onclick="$(\'#feedback-div\').data(\'feedback\').close()" value="Close"></input>\
				</div>\
			</div>',
		''].join("\n");
      }
      this.init(element, options);
   };
  
   $.fn.feedback = function(options) { 
      return this.each(function() {
         (new $.feedback($(this), options));              
      });        
   };
    
   $.feedback.defaultOptions = {
      class: 'feedback',
      show: 1,
      opened: 0,
      linkTextShadow: '#000000 -1px 1px 1px',
      linkHighlightColour: '#FFAA66',
      linkHighlightTextShadow: '#FF6600 -1px 1px 1px',
   }
})(jQuery);


