/*Twentytwenty + XenForo Integration*/
typeof Sedo=="undefined"&&(Sedo={}),!function(n,t,i){Sedo.TwentyX2={init:function(i){i.each(function(){var i=n(this),o=i.find("img").eq(0),a=i.find("img").eq(1),b,y,s,v,w,p;if(!(o.width()<=2)&&!(o.height()<=2)&&i.data("complete")!=1){var d=parseFloat(i.data("diffPos")),u=parseInt(o.data("width")),e=parseInt(a.data("width")),k=i.parents(".adv_bimg_block").addClass("compare"),h=k.width(),it=u/100;i.addClass("twentytwenty-container").data("complete",1),b=function(){if(i.hasClass("Fluid")){h=k.width();var n=h*it,t=new Image,r,f,s;return t.src=o.attr("src"),f=t.width,t.src=a.attr("src"),s=t.width,r=f>s?f:s,n>r&&(n=r),u=e=n,n}},b(),h!=0&&(u>h&&(u=h,o.attr("data-width",u)),e>h&&(e=h,a.attr("data-width",e))),o.width(u),a.width(e),y=u>e?u:e,i.width(y).attr("data-width",y);var r=d?d:.5,f=i.hasClass("DiffV")?"vertical":"horizontal",rt=f==="vertical"?"down":"left",ut=f==="vertical"?"up":"right";i.wrap("<div class='twentytwenty-wrapper twentytwenty-"+f+"'></div>"),i.append("<div class='twentytwenty-overlay'></div>"),i.append("<div class='twentytwenty-handle'></div>"),s=i.find(".twentytwenty-handle"),s.append("<span class='twentytwenty-"+rt+"-arrow'></span>"),s.append("<span class='twentytwenty-"+ut+"-arrow'></span>");var l=i.find("img:first").addClass("twentytwenty-before"),ft=i.find("img:last").addClass("twentytwenty-after"),g=i.find(".twentytwenty-overlay");g.append("<div class='twentytwenty-before-label'></div>"),g.append("<div class='twentytwenty-after-label'></div>");var nt=function(n){var r=l.width(),t=l.height(),i;return t<2&&(i=new Image,i.src=l.attr("src"),t=i.height*(r/i.width)),{w:r+"px",h:t+"px",cw:n*r+"px",ch:n*t+"px"}},tt=function(n){f==="vertical"?l.css("clip","rect(0,"+n.w+","+n.ch+",0)"):l.css("clip","rect(0,"+n.cw+","+n.h+",0)"),i.css("height",n.h)},c=function(n){var t=nt(n);s.css(f==="vertical"?"top":"left",f==="vertical"?t.ch:t.cw),tt(t)};n(t,s).on("adjustTwenty",function(){c(r)});c(r),v=function(){var n=k.parent().width(),f=i.width(),h=u>e?o:a,l=h.width(),s=i.find(".twentytwenty-overlay"),t;if(i.hasClass("Fluid")){t=b(),o.width(t),a.width(t),i.width(t),c(r);return}if(f<n){f<y&&(i.width(n),s.width(n),c(r));return}i.width(n),s.width(n),c(r)},v();n(t,i).on("resize",function(){v()});i.data("sedoTwenty",{adjustTwenty:c,resizeTwenty:v}),w=0,p=0;s.on("movestart",function(n){(n.distX>n.distY&&n.distX<-n.distY||n.distX<n.distY&&n.distX>-n.distY)&&f!=="vertical"?n.preventDefault():(n.distX<n.distY&&n.distX<-n.distY||n.distX>n.distY&&n.distX>-n.distY)&&f==="vertical"&&n.preventDefault(),i.addClass("active"),w=i.offset().left,offsetY=i.offset().top,p=l.width(),imgHeight=l.height()});s.on("moveend",function(){i.removeClass("active")});s.on("move",function(n){i.hasClass("active")&&(r=f==="vertical"?(n.pageY-offsetY)/imgHeight:(n.pageX-w)/p,r<0&&(r=0),r>1&&(r=1),c(r))});i.find("img").on("mousedown",function(n){n.preventDefault()})}})},reload:function(){n(".AdvBimgDiff").each(function(){var t=n(this);t.height()==0&&t.find("img").load(function(){t.width(t.data("width")).trigger("adjustTwenty")})})},rebuild:function(){Sedo.TwentyX2.init(n(".AdvBimgDiff"))}},XenForo.register(".AdvBimgDiff","Sedo.TwentyX2.init");n(i).on("XenForoActivate",Sedo.TwentyX2.reload);n(t).on("sedoRebuild",Sedo.TwentyX2.rebuild)}(jQuery,this,document);