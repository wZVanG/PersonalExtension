"use strict"

var BG = chrome.extension.getBackgroundPage();

function eventPlus(){
	chrome.tabs.executeScript(null, { file: 'eventPlus.js' } );
}

function jq(){
	chrome.tabs.executeScript(null, { file: 'js/jquery.js' } );
}

function restoreTabs(){

	BG.restoreTabs();

}

function Init(){
	var main = $("#main");
	
	var List = {
		"Facebook Personal Mensajes": "https://www.facebook.com/messages/",
		"Facebook DBA Mensajes": "https://www.facebook.com/DragonBound.Aimbot/messages/",
		"Facebook DBA Group": "https://www.facebook.com/groups/dragonboundaimbotvip/",
		"Facebook Group Solicitudes": "https://www.facebook.com/groups/dragonboundaimbotvip/requests/",
		
		"-1-" : "",
		"DBA User Admin Panel": "https://dragonboundaimbot.com/dba",
		"DBA Web Admin": "https://dragonboundaimbot.com/admin",
		
		"-2-" : "",

		"BCP": "https://bcpzonasegura.viabcp.com/bcp",
		"Interbank": "https://bancaporinternet.interbank.com.pe/Warhol/login",
		//"BCP - Titanic": "https://www.cuentapremiobcp.com/juegos/titanic.php",
		
		"-3-" : "",
		
		"wz.vang@gmail.com": "https://mail.google.com/mail/u/0/#inbox",
		"vip@dragonboundaimbot.com": "https://mail.google.com/mail/u/1/#inbox",
		
		"-4-" : "",

		"Restore Favorite Tabs" : "restoreTabs",
		//"Evento VIP" : "eventPlus"
		//"Extensions": "chrome://extensions/",
		
	}
	
	var listDiv = $("<div>",{'class':'listLinks'});
	
	$.each(List,function(descr,link){
		var linkObj = $("<a>",{href:link,target:'_blank'});
		linkObj.text(descr);
		linkObj.button();
		if(link == ""){
			linkObj = $("<div>",{'class':'hr'});
		}else if(!link.match(/^http/gi)){
			linkObj.attr({"href":"#"});
			//linkObj = $("<div>",{'class':''}).html(descr);
			linkObj.click(function(e){
				eval("("+link+"())");
				e.preventDefault();
				e.stopPropagation();
				window.close();
				return false;
			});
		}
		listDiv.append(linkObj);
	})
	
	main.append(listDiv)
	
}

$(document).ready(Init);