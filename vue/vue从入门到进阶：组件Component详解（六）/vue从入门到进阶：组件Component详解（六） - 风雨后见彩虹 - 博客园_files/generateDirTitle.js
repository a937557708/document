;(function($,window,document,undefined){
	
	$.fn.extend({
		getDirHtml2: function(){
			var list = [], 
				elements = this.find('h1,h2,h3');
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
				html = '<li><a href="#'+list[i][1]+'" id="'+list[i][1]+'title">'+list[i][2]+'</a></li>';
				if(i == 0){
					var parent = $('<ul data-level="'+(level-1)+'" class="nav"></ul>');
					parent.append(html);
					target.append(parent);
				}else{
					if(list[i][0] > list[i-1][0]){
						var parent = $('<ul data-level="'+(level-1)+'"></ul>');
						parent.append(html);
						var last = target.find("#"+list[i-1][1]+"title").closest('li');
						//var last = target.find('ul > li:last');
						last.append(parent);
					}else if(list[i][0] == list[i-1][0] && list[i][0] -1 != target.find('ul:first').attr('data-level')){
						var last =  target.find("#"+list[i-1][1]+"title").closest('ul');
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
		
		
		initDir2: function(context,appendParent){
			var context = context || $('body');
			var dirHtml = context.getDirHtml2();
			if(!dirHtml){
				return;
			};
			var html = '<div class="parentsDiv"><div class="directoryDiv">'+
							'<div class="generationcatListTitle">文章目录</div>'+
								dirHtml+
							'</div>'+
						'</div></div>';
			appendParent.prepend(html);
			
		}
	});
	
	
})(jQuery,window,document);

  $(document).ready(function () {
	$('body').initDir2($('#cnblogs_post_body'),$("#mainContent .postBody"));
    $("#topics").on('click','.directoryDiv a',function(event){
    	event.preventDefault();
    	var targetSelector = $(this).attr('href');
    	var offset = $(targetSelector).offset().top;
		console.log(offset);
    	 $('html, body').stop().animate({
          scrollTop: offset
        }, 500);
    });

  });
