*******************************************************************
* Bb Codes & Buttons Manager - Advanced Bb Codes v.3.3            *
* by Cédric CLAERHOUT                                             *
*******************************************************************

>Version 3.3 is out. Major update:
	- addon has been renamed to "Bb Codes & Buttons Manager - Advanced Bb Codes"
	- coding has been drastically simplified
		> All Bb Codes have been rewritten using templates
		> Obsolete functions have been removed: 
			+ the toolbar (use BBM)
			+ the custom buttons (use BBM)
			+ old vBulletin Bb Codes are not anymore included (see the conversion procedure in the extras directory)
			+ all templates listeners except 1 have been deleted
	- many problems have been fixed
	- Picasa Bb Code has been integrated (and rewritten as well)

>Version 3.2 is out. To see what's new, please go here:
http://www.afioc.com/forums/threads/advanced-Bb Codes-toolbar-3-2-whats-new.1603/

>Version 3.1 is out. To see what's new, please go here:
http://www.afioc.com/forums/threads/advanced-Bb Codes-toolbar-3-1-whats-new.1579/


**********************************
*      Addon Presentation        *
**********************************
Created in 2007 for vBulletin (http://www.vbulletin.org/forum/showthread.php?t=247338), this application adds advanced Bb Codes. Those Bb Codes help members to design the layout of their messages to make them look like an article from a magazine. This third version for Xenforo has been fully rewritten. It has exactly the same functions than the previous vBulletin version... and much more.


#### New Bb Codes list:	####

BIMG BB Code: 		Resize a big picture
			Display the original size of the picture with the XenForo JS Slideshow
			Caption above or below/inside or outside the picture
			[Safety Default&Max Width System included]
		
			#option commands:
			>Img block
				Numbers (with or without (px): The width of image (can't go over the limit set up in options) in pixels
				Numbers with %: The width of image in percentage
				fleft: float left ; the image will be float on the left inside a block
				fright: float right ; the image will be float on the right inside a block
				bleft: align the block to the left
				bcenter: align the block to the center
				bright: align the block to the right
		
			>Caption
				Normal Text: The image caption,
				top|bottom: The position of image caption (above or below image); the default behaviour is bottom,
				inside: The position of image caption (inside or outside image)
				left|center|right: The alignement of image caption; the default behaviour is left,

			#replace the following Bb Codes on previous vBulletin version:
			igauche, igauchex, idroite, idroitex, bimgx


ARTICLE BB Code: 	Display an article inside a message.
			Custom CSS system according to the browser (IE or not)

			#option commands:
				Normal text: article source (will be displayed below the article box)
			

ENCADRE BB Code:	This BB Code insert a text box to the right of a message. Default width is 20% of window
			Custom CSS system according to the browser (IE or not)
			[SDMWS included]

			#option commands:
				Normal Text: The text box title
				Numbers (with or without %): The width of text box (can't go over the limit set up in options) in percentage
				Numbers with px: The width of text box (can't go over the limit set up in options) in pixels
				skin2: To use another skin for the encadre bbcode
				fleft: float left
				fright or nothing: default float right option

			#replace the following Bb Codes on previous vBulletin version:
			encadrex


FIELDSET BB Code: 	This BB Code inserts a [fieldset] with a custom title
			Custom CSS system according to the browser (IE or not)
			[SDMWS included]

			#option commands:
				Normal Text: The fieldset title
				Numbers (with or without %): The width of fieldset (can't go over the limit set up in options) in percentage
				Numbers with px: The width of fieldset (can't go over the limit set up in options) in pixels
				bleft: align the block to the left
				bcenter: align the block to the center
				bright: align the block to the right


Google DOCS Viewers: 	This BB Code allows to display documents using the "Google Docs - Viewer" (supports many different file types: pdf,ppt,doc,xls...).
			Can be wrapped inside another bbcode inside options (for ie: spoiler)
			Width and height are specified inside Admin options		

			#option commands:
				Normal Text: The title of document



SPOILERBB BB Code: 	This [spoilerbb] code hides the part of a text. Because the spoiler bbcode created by King Kovifor is really good, 
			the Advanced Bb Codes Toolbar original spoiler tag name has been modified from [spoiler] to [spoilerbb]. 

			#option commands:
				Normal Text: The title of spoiler

JUSTIFY Text BB Code: 	Display full justified text

LATEX BB Code: 		Display mathematical content with mimetex

			#option commands:
				Normal Text: The Latex box title (default:none)
				Numbers (with or without px): The width of text box (can't go over the limit set up in options) in pixels
				Numbers with %: The width of text box (can't go over the limit set up in options) in percentage
				fleft: block will float left
				fright: block will float right
				bleft: align the block to the left
				bcenter: align the block to the center
				bright: align the block to the right

ACCORDION BB Code: 	Display an accordion box

			#Master tag commands (tag: accordion)
				Numbers (with or without px): The width of text box (can't go over the limit set up in options) in pixels
				Numbers with %: The width of text box (can't go over the limit set up in options) in percentage
				Num1(px/%)xNum2: Set the width of the accordion box and the default height for all slides
	
				fleft: block will float left
				fright: block will float right
				bleft: align the block to the left
				bcenter: align the block to the center
				bright: align the block to the right

			#Slave tag commands (special bbcode: {slide})
				Numbers: the height of the slide (in px)
				text: Slide title
				left or blank: title of the slide will be align to the left
				center: title of the slide will be align to the center
				right: title of the slide will be align to the right
				open: the slide will be opened by default

TABS BB Code: 	Display some tabs

			#Master tag commands (tag: tabs)
				Numbers (with or without px): The width of text box (can't go over the limit set up in options) in pixels
				Numbers with %: The width of text box (can't go over the limit set up in options) in percentage
				Num1(px/%)xNum2: Set the width of the accordion box and the default height for all slides
	
				fleft: block will float left
				fright: block will float right
				bleft: align the block to the left
				bcenter: align the block to the center
				bright: align the block to the right

			#Slave tag commands (special bbcode: {slide})
				text: Slide title
				left: title of the slide will be align to the left
				center or blank: title of the slide will be align to the center
				right: title of the slide will be align to the right
				open: the slide will be opened by default

			#Special function command
				{tab=id}Text{tab}: creates a link to a tab of the current Bb Code - id is numeric: 1 (first tab), 2 (second tab), etc.

SLIDER BB Code: Display a slider

			#Master tag commands (tag: slider)
				Numbers (with or without px): The width of text box (can't go over the limit set up in options) in pixels
				Numbers with %: The width of text box (can't go over the limit set up in options) in percentage
				Num1(px/%)xNum2: Set the width of the accordion box and the default height for all slides
				Numbers with ms (3000ms): to set an interval between slides
	
				fleft: block will float left
				fright: block will float right
				bleft: align the block to the left
				bcenter: align the block to the center
				bright: align the block to the right

				cmd: to display slider commands (play & pause)
				autoplay: to start the slider when the page is loaded (this command can be disabled)
				num: to disable numeric tabs (below the slider) instead of bullet tabs
				inside: to disable the 'inside' layout which will place all slider commands (previous/next slide, tabs, play/pause) inside slides

			#Slave tag commands (special bbcode: {slide})
				text: Slide title
				left: title of the slide will be align to the left
				center or blank: title of the slide will be align to the center
				right: title of the slide will be align to the right
				top: to display the title with an absolute layout on the top
				bottom: to display the title with an absolute layout on the bottom
				open: the slide will be opened by default when the page is loaded
				Number (attachement id): will fetch the attachement by its id (must be an image) and will display it with a new large layout
					=> in this layout another command exists: 'full'. It will stretch the image to the container but without respected the ratio

### How to use Text/Image Boxes Bb Codes ###
If you want to display a text box or an image on the right of a text (float right), you have to insert first the Text Box or Image, then the Main Text. 

Example:
[ENCADRE]Text box on the right[/ENCADRE]Main Content

[bimg=fgauche]image_url[/bimg]Main Content

[bimg=fright]image_url[/bimg]Main Content


**********************************
*         Installation           *
**********************************
0) Check if you've installed the Bb Codes & Buttons Manager  Url: http://xenforo.com/community/resources/Bb Codes-buttons-manager.1731/
1) Use Chris Auto installer or a) upload the CONTENT of the "upload" folder in your forum directory b) import addon xml file
2) Import the Bb Codes bulk xml file (inside the "extras" directory)


**********************************
*        Configuration           *
**********************************
1) Configure addon (usergroups) in ADMIN->OPTIONS->[Bb Codes & Buttons Manager] Advanced Bb Codes 
2) If you want to change the appearance of some Bb Codes, go to ADMIN->Appearance->Style Properties->[Bb Codes & Buttons Manager] Advanced Bb Codes

**********************************
*            License             *
**********************************
http://creativecommons.org/licenses/by/3.0/

