;(function($){
	var lightBox = function(config){
		self = this;
		this.config={
					speed:800,

						}
						
		$.extend({},this.config,config)
		$.extend(this.config,config||{});
		
		this.bg = $('<div class="lightBox-bg">');
		this.win = $('<div class="lightBox-main">');
		this.bodyNode = $('body').eq(0);
		this.add_DOM();

		this.lightBoxBg =$('.lightBox-bg');
		this.lightBoxMain = $('.lightBox-main');
		this.imgArea = $('.lightBox-imgArea');
		this.img = $('#lightBox-img');
		this.prevBtn = $('.lightBox-prev-btn');
		this.nextBtn = $('.lightBox-next-btn');
		this.desArea = $('.lightBox-descArea');
		this.desTitle = $('.lightBox-imgTitle');
		this.desIndex = $('.lightBox-index');
		this.closeBtn = $('.lightBox-close-btn');

		this.groupData = [];
		this.groupName=null;
		this.currentId=null;
		this.currentIdIndex; 
		//对图片点击进行事件委托 获取当前点击图片组的数据 调用init
		this.bodyNode.delegate(".smallPic,[data-js='lightBox']","click",function(e){
			e.stopPropagation();

			var currentGroupName=$(this).attr("data-group");
			
			if(currentGroupName!=self.groupName){
				self.groupName = currentGroupName;
				self.getGroup();
			}
		self.currentId =$(this).attr('data-id')
		self.initBox(self.currentId);



		})
		//点击关闭lightbox
		this.lightBoxBg.click(function(){
			self.lightBoxBg.hide(1000);
			self.lightBoxMain.hide(1000);
		})
		this.closeBtn.click(function(){
			self.lightBoxBg.fadeOut(1000);
			self.lightBoxMain.fadeOut(1000);
		})
		//左右切换按钮
		this.prevBtn.click(function(){
			self.currentIdIndex--;
			var index = self.getIndex(self.currentId)+self.currentIdIndex;
			self.loadImg(index);
		})
		this.nextBtn.click(function(){
			self.currentIdIndex++;
			var index = self.getIndex(self.currentId)+self.currentIdIndex;
			self.loadImg(index);
		})
		//绑定窗口改变大小
		var timer = null
		$(window).resize(function(){
			clearTimeout(timer);
			timer = window.setTimeout(function(){
				var current = self.getIndex(self.currentId);
				self.loadImg(current);
			},510)
		})

	}

	lightBox.prototype={
		getIndex:function(ident){
			var index=0;
			
			// for(var i=0;i<this.groupData.length;i++){
			// 	if(this.groupData[i]['id']==ident){
			// 		index=i;
			// 		break;
			// 	}
			//	}
		
			$(this.groupData).each(function(i){
				if($(this).attr('id')==ident){
					index = i+1;
					return;
				}
			})
			return index;

		},
		bindHover:function(index){
			this.prevBtn.show();
			this.nextBtn.show();
			this.prevBtn.hover(function(){
									if(index==1) {
										$(this).removeClass('btnHoverPrev').hide();
										
									}else {
										$(this).addClass('btnHoverPrev');
									}
							   },function(){
							   		$(this).removeClass('btnHoverPrev');
							   })
			this.nextBtn.hover(function(){
									if(index == self.groupData.length){
										$(this).removeClass('btnHoverNext').hide();
									}else{
										$(this).addClass('btnHoverNext');
									}
								},function(){
									$(this).removeClass('btnHoverNext')
								})
		},
		loadImg:function(index){
			var self = this;
			var winW = $(window).width();
			var winH = $(window).height();
			var data = this.groupData[index-1];
			// var img = new Image();
			this.img.attr('src',data['src']);
			this.img.hide();
			this.bindHover(index);
			// if(img.hasOwnProperty("onload")){
			// 	img.onload=function(){
					
			// 		self.img.attr('src',self.groupData[index-1]['src']);
			// 	}
			// }else if(img.hasOwnProperty('onreadystatechange')){
			// 	img.onreadystatechange=function(){
			// 		if(img.readyState=="200"){
			// 			self.img.attr('src',self.groupData[index-1]['src']);
			// 		}
			// 	}
			// }
			var width = $(this.img).width();
			var height = $(this.img).height();
			// if(width>1100){
			// 	width=1100;height=700;
			// }
			// if(height>700){
			// 	height=700;width=1100;
			// }
			this.lightBoxMain.animate({
									width:width,
									height:height,
									left:'50%',
									marginLeft:-width/2,
									top:'50%',
									marginTop:-height/2
									},500,function(){
										self.img.show();
									})
			this.desTitle.text('当前名称  '+data['caption']);
			this.desIndex.text('NO：'+index);
			this.desArea.show();
			

		},

		showLightBox:function(index){
			this.currentIdIndex = 0;
			this.img.hide();
			this.desArea.hide();
			this.lightBoxBg.fadeIn(1000);
			var self= this;
			var winW = $(window).width();
			var winH = $(window).height();
			
			this.lightBoxMain.css({
									width:winW/2,
									height:winH/2,
									top:-winH/2,
									left:"50%",
									marginLeft:-winW/4
									})
							 		.animate({top:winH/4},1000,function(){
							 		self.loadImg(index);
									}).show();

		},

		initBox:function(id){
			self = this;
			var index = this.getIndex(id);
			this.showLightBox(index);
			

		},
		getGroup:function(){
			var self = this;
			var imgList = this.bodyNode.find("*[data-group="+this.groupName+"]");
				
				self.groupData.length=0;
				imgList.each(function(){
					self.groupData.push({
						src:$(this).attr('data-src'),
						id:$(this).attr('data-id'),
						caption:$(this).attr('data-caption')
					});
				})
			
		},
		add_DOM:function(){
			var domStr = '<div class="lightBox-imgArea">'+
						'<span class="lightBox-prev-btn "></span>'+
						'<img class="lightBox-img" id="lightBox-img" src="images/1-4.jpg" >'+
						'<span class="lightBox-next-btn "></span>'+
					'</div>'+
					'<div class="lightBox-descArea">'+
						'<div class="lightBox-content">'+
							'<p class="lightBox-imgTitle">图片名称</p>'+
							'<span class="lightBox-index">当前索引：</span>'+
						'</div>'+
						'<span class="lightBox-close-btn"></span>'+
					'</div>';
			this.win.html(domStr);	
			this.bodyNode.append(this.bg,this.win);
		}		
	}

	window["lightBox"] = lightBox;

})(jQuery);