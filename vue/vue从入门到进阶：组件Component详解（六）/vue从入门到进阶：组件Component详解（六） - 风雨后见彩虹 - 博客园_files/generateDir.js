;(function($,window,document,undefined){
	
	$.fn.extend({
		getDirHtml: function(){
			var list = [], 
				elements = this.find('h2,h3');
			if(elements.length == 0){
				return '';
			}
			
			for(var i = 0, j = elements.length; i < j; i++){
				var obj = elements[i];
				var level = parseInt(obj.nodeName.substr(1));
				$(obj).attr('id','');
				obj.id = 'articleHeader' + i;
				
				list.push([level, obj.id, $(obj).text()]);
			}
			
			var target = $('<div></div>').appendTo($(document.createDocumentFragment()));
			var level,html;

			for(var i=0; i<list.length; i++){
				level = list[i][0];
				list[i][2] = $.trim(list[i][2]);
				html = '<li><a href="#'+list[i][1]+'" id="'+list[i][1]+'">'+list[i][2]+'</a></li>';
				if(i == 0){
					var parent = $('<ul data-level="'+(level-1)+'" class="nav"></ul>');
					parent.append(html);
					target.append(parent);
				}else{
					if(list[i][0] > list[i-1][0]){
						var parent = $('<ul data-level="'+(level-1)+'"></ul>');
						parent.append(html);
						var last = target.find("#"+list[i-1][1]).closest('li');
						//var last = target.find('ul > li:last');
						last.append(parent);
					}else if(list[i][0] == list[i-1][0] && list[i][0] -1 != target.find('ul:first').attr('data-level')){
						var last =  target.find("#"+list[i-1][1]).closest('ul');
						//var last = target.find('ul:last');
						last.append(html);
					}else if(list[i][0] < list[i-1][0] && list[i][0] -1 > target.find('ul:first').attr('data-level')){
						var last = target.find('ul[data-level="'+(level-1)+'"]:last');
						last.append(html);
					}else if(list[i][0] -1 == target.find('ul:first').attr('data-level')){
						var parent = target.find('ul:first');
						parent.append(html);
					}
				}
			}
			
			return '<div class="dirInner"><div class="highlight-title"></div><div class="listCon">' + target.html() + '</div></div>';

		},
		
		
		initDir: function(context,appendParent){
			var context = context || $('body');
			var dirHtml = context.getDirHtml();
			if(!dirHtml){
				$("#showdirectory").remove();
				return;
			};
			var html = '<div class="parentsDiv"><div class="directoryDiv">'+
							'<div class="catListTitle">文章目录</div>'+
								dirHtml+
							'</div>'+
						'</div></div>';
			appendParent.append(html);
			
		}
	});
	
	
})(jQuery,window,document);

  $(document).ready(function () {
	$('body').initDir($('#mainContent'),$("#sideBar"));
    var tocSelector = '#sideBar .directoryDiv';
    var $tocSelector = $(tocSelector);
    var activeCurrentSelector = '.active-current';

    $tocSelector.on('activate.bs.scrollspy', function () {
        var $currentActiveElement = $(tocSelector + ' .active').last();
        removeCurrentActiveClass();
        $currentActiveElement.addClass('active-current');
        //$tocSelector.find('.listCon')[0].scrollTop = $currentActiveElement.position().top;
		 var crTop = $currentActiveElement.position().top;
        var cuheight = $currentActiveElement.children('a').height() + 6;
        var curPh = $tocSelector.height() -35;
		
        if( $tocSelector.find('.dirInner').height() + 35 <= $(window).height()){
        	$(".dirInner").css('top',0);
        }else{
        	if(crTop + cuheight > 	curPh / 2){
        		$(".dirInner").css('top',-(crTop + cuheight - curPh/ 2));
	        }else{
	        	$(".dirInner").css('top',0);
	        }
        }
        $(".highlight-title").css({'height':cuheight,'top':crTop});
      })
      .on('clear.bs.scrollspy', function (){
        removeCurrentActiveClass();
      });

    function removeCurrentActiveClass (){
      $(tocSelector + ' ' + activeCurrentSelector)
        .removeClass(activeCurrentSelector.substring(1));
    }


    function getTOCMaxHeight () {
      var height = $(window).height(); 
      var dirHeight = $("#sideBar .directoryDiv .listCon > ul").height();
		if(dirHeight + 35 > height){
			$tocSelector.css('height', height);
			//$tocSelector.find(".dirInner").css('height',height - 35);
		}else{
			$tocSelector.css('height', dirHeight + 35);
			//$tocSelector.find(".dirInner").css('height',dirHeight);
		}         
    }
    getTOCMaxHeight();
    rightNavShow();
	scrollFun();
    function rightNavShow(){
		if($(window).width() < 768){
			$('.parentsDiv').hide();
		}else{
			$('.parentsDiv').show();
		}
    }
    $(window).resize(function(){
    	rightNavShow();
    	getTOCMaxHeight();
    	if($(tocSelector).hasClass('fixed')){
    		getTOCMaxHeight();
    	}
    });

    $('body').scrollspy({ target: tocSelector });

    $(window).scroll(function(){
		scrollFun();	
    });
	
	function scrollFun(){
		var wT = $(window).scrollTop();
		if($('.parentsDiv').length){
			var dT = $('.parentsDiv').offset().top;
			if(wT > 80){
				$(tocSelector).addClass('fixed');
				if($('#showdirectory').length && !$('#showdirectory').hasClass('current')){
					$("#sideBarMain").show();
					$(tocSelector).hide();
				}else{
					$("#sideBarMain").hide();
					$(tocSelector).show();
				}
				
				
			}else{
				$(tocSelector).removeClass('fixed');
				$("#sideBarMain").show();
				$(tocSelector).hide();
			}
		}	
	}
	
	
    $("#sideBar").on('click','.directoryDiv a',function(event){
    	event.preventDefault();
    	var targetSelector = $(this).attr('href');
    	var offset = $(targetSelector).offset().top;
    	 $('html, body').stop().animate({
          scrollTop: offset
        }, 500);
    });
	

  });
