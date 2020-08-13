var StackoverflowQuestions, AllNotifications = [];

function getGamePages(callback,callbackfalse){
	chrome.tabs.query({
		url: "*://*.facebook.com/*"
	}, function (a) {
		a && 0 !== a.length ? a.forEach(function(a){
			callback(a);
		}) : (typeof callbackfalse == "function" ? callbackfalse() : void(0));
	})
}

function onMessage(request, sender, sendResponse) {
	switch(request.type) {
		case "init":
			sendResponse({
				ok: true,
				url: sender.tab.url
			});
			break;
		case "getBackgroundQuestions": 
			sendResponse({
				questions: StackoverflowQuestions.questions ||[]
			});
			break;
		case "createNotification": 
			AllNotifications.push(request.id);
			chrome.notifications.create(request.id + "", request.options, function(){});

			while(AllNotifications.length > 5){
				chrome.notifications.clear(AllNotifications.shift() + "");
			}
			break;
	}
};


function Questions(){
	
	var self = this;

	this.titlePopup = "Stackoverflow JavaScript Questions";
	this.url = "https://api.stackexchange.com/2.2/questions?pagesize=5&order=desc&sort=creation&tagged=javascript&site=stackoverflow";
	this.questions = [];

	this.existQuestion = function(question){
		return this.questions.some(function(q){
			if(q.question_id === question.question_id) return true;
			return false
		})
	};

	this.addQuestion = function(question){
		
		$.extend(question, {read: false});

		this.questions.push(question);

		this.questions.sort(function(a, b){ //SORT by creation_date DESC
			return b.creation_date - a.creation_date
		});

		while(this.questions.length > 5){
			this.questions.pop();
		}
	};

	this.showQuestions = function(){

		chrome.tabs.query({title:this.titlePopup}, function(tabs){
			console.log("tabs",tabs);
			if(!tabs.length){
				chrome.windows.create({url:'questions.html', type: 'detached_panel'}, function(tab){
					self.sendQuestionsToPopup(tab.id)
				})
			}else{
				chrome.tabs.update(tabs[0].id, {active: true}, function(){
					self.sendQuestionsToPopup(tabs[0].id)
				})
			}
			
		})		
	};

	this.updateQuestions = function(){
		$.getJSON(this.url, function(data){
			data.items.forEach(function(question){
				if(!self.existQuestion(question)){
					self.addQuestion(question)
				}
			});
			//self.showQuestions();
		})
	}

	this.interval = setInterval(this.updateQuestions.bind(this), 3000);

}

function restoreTabs(){
	var myTabs = [
		{url: "https://www.facebook.com/messages/", pinned: true},
		{url: "https://www.facebook.com/DragonBound.Aimbot/messages", pinned: true},
		{url: "https://mail.google.com/mail/u/0/#inbox", pinned: true},
		{url: "https://mail.google.com/mail/u/1/#inbox", pinned: true},
		{url: "https://dragonboundaimbot.com/dba/users", pinned: true}
	], current = 0;
	myTabs.forEach(function(tabObj, i){
		tabObj.index = i;
		chrome.tabs.create(tabObj, function(createdTab){
			current++;
			if(current >= myTabs.length){
				chrome.tabs.query({}, function(tabs){
					tabs.forEach(function(tab){
						if(tab.index >= myTabs.length){
							chrome.tabs.remove(tab.id)	
						}
					})
				});
				chrome.tabs.query({index: 0}, function(tabs){
					chrome.tabs.update(tabs[0].id,{active:true});
				});
			}
		});
	});
}

/*StackoverflowQuestions = new Questions();
//chrome.windows.create({url:'questions.html', type: 'detached_panel', width:500, height:200}, function(tab){})
chrome.windows.create({url:'questions.html', type: 'popup', width:500, height:200}, function(tab){})*/
chrome.notifications.onClicked.addListener(function(notificationID){
	chrome.tabs.create({url: "http://stackoverflow.com/questions/" + notificationID, active: true});
})



chrome.browserAction.setBadgeBackgroundColor({color: [0, 200, 0, 75]});
chrome.browserAction.enable();
chrome.runtime.onMessage.addListener(onMessage);
/*
chrome.runtime.onInstalled.addListener(function(){
	getGamePages(function(a){
		chrome.tabs.reload(a.id)
	},function(){
		chrome.tabs.create({url : "http://dragonbound.net"}, function(tab) {
			chrome.tabs.reload(tab.id)
		});
	});

});*/

/*chrome.webRequest.onBeforeRequest.addListener(function (info) {
		return {redirectUrl: 'http://i.imgur.com/LMRpL5z.png'};},
	{urls: ["http://i.imgur.com/H2z9Ca7.png","http://dragonbound.net/static/images/game_stuff6.png"],
	
},	["blocking"]);*/