var debug = false, wZ, Plugins = new AllPlugins(), $$ = window.console ? function () {
	console.info.apply(console, arguments);
} : $.noop;


Plugins.add("inthebox", /^https?\:\/\/www\.(light|mini)inthebox\.com/gi, function () {
	//var pricesObj = "$";

	var DOLAR_PEN = 2.85, prefix = "S/.", appendTo = $("body");

	$(".number, .price, strong.sale-price").filter(function () {
		var col = $(this).css("color");
		return col == "rgb(153, 0, 0)" || col == "rgb(167, 45, 44)" || col == "#900900" || col == "#900";
	}).each(function () {
		//}).add(".price.ctr-track").add(".sale-price").add(".prodPrice .number").each(function(){
		console.info($(this).text());

		var e = $(this), text = e.text(), isMoney = text.match(/\$\s?(\d+)\./);

		if (isMoney) {
			var offset = e.offset(), height = e.height(), width = e.width(),
				price = +isMoney[1], priceResult = Math.ceil((price + 0.99) * DOLAR_PEN).toFixed(2),
				n = $("<div>", { style: 'position:absolute;background:rgba(0,0,0,1);color:#fff;font-size:13px;border-radius:3px; padding:2px; box-shadow:2px 2px 0px rgba(0,0,0,.5)' });
			n.css({ left: offset.left + width - 40, top: offset.top + height, fontSize: e.css("font-size") }).html(prefix + priceResult);
			n.mousedown(function (e) { (this).remove(); e.stopPropagation(); e.preventDefault(); return false });
			appendTo.append(n);
		}

	});
});

const numberFormat = function (number) {
	return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(number);
}

Plugins.add("bcp", /^https?\:\/\/bcpzonasegura\.viabcp\.com/gi, function () {

	/*const interval = setInterval(function () {
		var secondaryElements = document.querySelectorAll("nhbk-details-wrapper-secondary");
		secondaryElements.forEach(function (p) {
			var spans = p.querySelectorAll("span"), found = false;
			Array.from(spans).forEach(function (span) {
				if ((span.textContent ?? '').trim().startsWith("Saldo disponible")) {
					found = true;
				}
			});

			if (found) {
				//buscar span que contenga texto que empiece por "S/"
				var span = Array.from(spans).find(function (span) {
					return span.textContent.trim().startsWith("S/")
				});
				if (span) {
					const saldo = parseFloat(span.textContent.trim().replace("S/", "").replace(",", "."));
					console.log("Saldo disponible:", saldo);
					span.innerHTML = numberFormat(29156084.13);
				}
			}
		})

	}, 100);*/

});

Plugins.add("interbanklogin", /^https?\:\/\/bancaporinternet\.interbank\.com\.pe\/Warhol\/login\/?$/gi, function () {

	$(document).ready(function () {

		if ($("#input-tarjeta").val().length == $("#input-tarjeta").attr("maxlength")
			&& $("#input-numero-documento").val().length == $("#input-numero-documento").attr("maxlength")
		) {
			$("#a-ingresar").trigger("click");
		}
	});

}, true);

Plugins.add("interbankloginConfirmar", /^https?\:\/\/bancaporinternet\.interbank\.com\.pe\/Warhol\/loginConfirmar\/?$/gi, function () {

	$(document).ready(function () {
		var img = $("#form-inicio-p2").find("img");

		if (img.attr("src").indexOf("intersello70") !== -1) {
			$("#button__irinicio").trigger("click");
		}

	});

}, true);

Plugins.add("interbankloginingreso", /^https?\:\/\/bancaporinternet\.interbank\.com\.pe\/Warhol\/loginIngreso$/gi, function () {

	$(document).ready(function () {
		var obj, zoom = function () {
			obj.css("transition", "all 0.3s ease-in");
			obj.css("transform", "scale(1.8)");
		}, it = setInterval(function () {
			obj = $(".fancybox-wrap");
			obj.length && (zoom(), clearInterval(it));
		});
	});

}, true);


Plugins.add("stackoverflow", /tags\/javascript/g, function () {

	var preventTags = "canvas c++ django geolocation swift parse.com ruby-on-rails meteor vbscript angular-material sqlmap jasmine unit-testing servlets fabricjs eslint groovy polymer-1.0 backbone.js asp.net asp.net-mvc c# cordova charts chart.js yammer polymer video web-audio linkedin authentication qtip qtip2 bacon.js localization google-maps phonegap android phonegap-plugins perl mandrill wordpress reactjs vb.net datepicker d3.js lavarel material-design magento rsvp.js jsf jwplayer jqgrid gruntjs three.js 3d protractor karma drupal drupal-7 liferay knockout.js lightbox paypal itunes cakephp excel polyfills ionic ionic-framework karma-jasmine ember.js mongodb mongoose mean-stack cross-domain rxjs".split(" ");

	var questions = [];
	var que_questions = [];
	var timer;

	function existsQuestion(question) {
		return questions.some(function (q) {
			if (q.question_id === question.question_id) return true;
			return false
		})
	}

	function qeueQuestions() {
		var questionToshow;
		if (questionToshow = que_questions.pop()) {
			console.log("New question: ", questionToshow.title, questionToshow);

			chrome.extension.sendMessage({
				type: "createNotification",
				id: questionToshow.question_id,
				options: {
					type: "basic",
					title: questionToshow.title,
					message: questionToshow.content,
					iconUrl: "img/stackoverflow_logo.png",
					buttons: [
						{ iconUrl: "img/stackoverflow_logo.png", title: questionToshow.tags.join(" ") }
					]
				}
			});
		}

	}


	function onnewQuestions() {
		$(".question-summary").eq(0).each(function () {
			var el = $(this), id = el.attr("id"), questionID = id.match(/\d+$/);
			if (questionID) {
				questionID = +questionID[0];

				var title = el.find("h3").text().trim(), content = el.find(".excerpt").text().trim()
					, tags = el.find(".tags").text().trim().split(" ");

				var question = { question_id: questionID, title: title, content: content, tags: tags };

				if (!existsQuestion(question)) {
					questions.push(question);
					que_questions.push(question);

					//delete questions with specified tags
					que_questions = que_questions.filter(function (q) {
						return !q.tags.some(function (tag) {
							return preventTags.indexOf(tag) !== -1
						})
					});
				}
			}

		});

		while (questions.length > 100) {
			questions.pop();
		}


		if (que_questions.length) {
			que_questions.sort(function (a, b) {
				return b.question_id - a.question_id
			});

			qeueQuestions();

			/*if(que_questions.length === 1){
				qeueQuestions();
			}else{
				timer && clearInterval(timer);
				timer = setInterval(qeueQuestions, 4000);
				qeueQuestions();
			}*/
		}
	}


	var observer = new MutationObserver(function (mutations) {
		mutations.forEach(function (mutation) {
			var newNodes = mutation.addedNodes;
			if (newNodes !== null) {
				var $nodes = $(newNodes);
				$nodes.each(function () {
					var $node = $(this);
					if ($node.hasClass("new-post-activity")) {
						$node.trigger("click");
						onnewQuestions();
					}
				});
			}
		});
	});


	$(document).ready(function () {
		observer.observe($("#questions")[0], {
			childList: true,
			characterData: true
		});
	})


});


Plugins.add("facebook", /^https?\:\/\/www\.facebook\.com/gi, function () {

	//$$("Facebook !", location);
	var Facebook_filters = [
		"daroplay.com",
		"ask.fm"
	], AddFilter = function () {
		var selected = false;
		$.each(Facebook_filters, function (i, filter) {
			if ($(this).attr("href").match(new RegExp(filter, "gi"))) {
				selected = true;
				return false;
			}
		});
		return selected;
	}, SearchObj = function (selector, contentselector, parentselector) {
		$(selector).each(function () {
			var e = $(this), a = e.find(contentselector), selected = false;
			a.each(function () {
				var e = $(this);
				if (!selected) {
					selected = AddFilter.apply(this, []);
				}
			});
			if (selected) {
				var parent = e.parents(parentselector);
				parent.css({ "opacity": 0.3 });
			}
		});
	};

	function DeletePosts() {
		/*var targetNodes         = $("body");
		var MutationObserver    = window.MutationObserver || window.WebKitMutationObserver;
		var myObserver          = new MutationObserver (mutationHandler);
		var obsConfig           = { childList: true, characterData: true, attributes: true, subtree: true };

		//--- Add a target node to the observer. Can only add one node at a time.
		targetNodes.each ( function () {
			myObserver.observe (this, obsConfig);
		} );*/

		/*$$(targetNodes.length)

		function mutationHandler (mutationRecords) {
			console.info ("mutationHandler:");

			mutationRecords.forEach ( function (mutation) {
				console.log (mutation.type);
				if (typeof mutation.removedNodes == "object") {
					var jq = $(mutation.removedNodes);
					console.log (jq);
					console.log (jq.is("span.myclass2"));
					console.log (jq.find("span") );
				}
			} );
		}*/
		/*this.interval = setInterval(function(){
			SearchObj("h5[data-ft]","a","*[data-ft]:first");
			SearchObj("h5[data-ft]","a",".fbTimelineUnit:first");
		},200);*/
	}

	var Actions = {}, ReadyActions = [];

	Actions["main"] = Actions["none"] = function () {
		$$("VanG.js Principal/None...");
		var Del = new DeletePosts();
	};

	Actions["messages"] = function () {
		$$("VanG.js Mensajes...");

		var currentActive = 0, textareaCurrent, textarea = $("*[aria-controls='webMessengerRecentMessages']"), textareaOffset = textarea.length ? textarea.offset() : { left: 0, top: 0 }, messages = [

			'Este es mi número si haces el depósito: 976907964',

			'De nuestro aimbot NO han baneado amigo, nuestra versión es oficial. Los baneos siempre suceden por aimbots piratas y no oficiales. Te recomendamos no usar  el aimbot en Prix',

			//'Abrir múltiples ACC:\nIr a Configuración > Personas/Usuarios > Añadir Persona/Usuario\nSe abrirá otra ventana de Chrome el cual debes realizar los mismos pasos de instalación',

			//'S/.70 si depositas por Interbank o S/.77.5 si lo haces por BCP\nhttp://dragonboundaimbot.com/adquirir/interbank\nTe recomiendo hacer el pago por Interbank',

			//'el vaucher también puedes enviarlo por aquí amigo,\nme indicas tu correo registrado en nuestra página dragonboundaimbot.com',

			//'Para la licencia SuperVIP ilimitada S/.150 si depositas por Interbank S/.157.5 si lo haces por BCP',
			'la licencia SuperVIP por el momento no está disponible',

			'solo me indicas por aquí el vaucher y tu correo registrado en nuestra página',

			//'Activado, revisa tu correo o ingresa a http://dragonboundaimbot.com/vip. Te recomiendo seguir correctamente el videotutorial. No olvides descargar el "Chrome Dev" que está en descargas (No es el mismo Chrome), Recuerda que por este medio no damos soporte, cualquier duda deberás hacerla en el grupo VIP, en tu panel están los pasos para unirte al grupo de FB.',
			'Activado, revisa tu correo o ingresa a http://dragonboundaimbot.com/vip. Te recomiendo seguir correctamente tutorial de instalación. Recuerda que por este medio no damos soporte, cualquier duda deberás hacerla en el grupo VIP, en tu panel están los pasos para unirte al grupo de FB.',

			'S/.70 si depositas por Interbank o S/.77.5 si lo haces por BCP\nAquí están los datos del banco http://dragonboundaimbot.com/adquirir\nLa activación es inmediata apenas verifiquemos el pago',

			'para renovar realizas los mismos pasos, actualmente no hay descuentos por renovación',
			//'para renovar realizas los mismos pasos y también me puedes avisar por aquí (y)\n1 mes: S/.50 por Interbank, S/.57.5 por BCP\n2 meses: S/.90 por Interbank, S/.97.5 por BCP\n3 meses: S/.120 por Interbank, S/.127.5 por BCP\nAquí están los datos del banco http://dragonboundaimbot.com/adquirir/?renovar',

			'el tiempo de licencia que tendrás es por 1, 2 y 3 meses, entra aquí y podrás ver los precios: http://dragonboundaimbot.com/adquirir (y)',

			//'la solución a ese problema está en preguntas frecuentes del panel VIP: http://dragonboundaimbot.com/vip/preguntasfrecuentes',

			//'Prueba con el Chrome Iron:\n1º Instalar Iron Chrome: http://www.srware.net/es/software_srware_iron_download.php\n2º Instalar las 2 extensiones del aimbot: https://chrome.google.com/webstore/detail/pdpilhoobkeopbmpajnlbchofebbdjdd\n https://chrome.google.com/webstore/detail/cdbpifgcffdplkddelniookdmchijfhg\n 3º Realizar los mismos pasos de instalación de la guía',

			//'amigo con la versión V9 ya lleva más de 1 año y medio sin presentarse baneos, es indetectable definitivo :)',

			'puedes usarlo hasta en 2 PC\'s diferentes y hasta 4 acc\'s en una misma PC',

			'Ok, cuál es tu correo registrado en la página del aimbot?',

			//'Para poner la barra transparente debes habilitar los colores Aero de Windows (Click derecho en Escritorio > Personalizar pantalla), Windows XP no soporta la barra transparente',

			'Ok, indícame el número de operación y hora exacta del vóucher',

			//'Click derecho en el escritorio > Personalizar Pantalla > Temas Aero > Elegir un tema Aero, reiniciar Chrome.',

			'Ya no contamos con versión FREE debido al posible exceso de usuarios que traería confuciones con nuestros miembros VIP, la versión actual está funcionando perfectamente ;)',

			//'cualquier duda deberás hacerla en el grupo VIP, en tu panel VIP están los pasos para unirte al grupo',

			//'el descuento para usuarios antiguos es del 30%, Realizas los mismos pasos http://dragonboundaimbot.com/adquirir/?renovar',

			'al obterner los permisos VIP a tu usuario de la página www.dragonboundaimbot.com, ya podrás visualizar la descarga, videotutorial de instalación y uso :)',

			'puedes hacer transferencia también, en ese caso me envías la constancia de la transferencia a vip@dragonboundaimbot.com',

			'Hola amigo, bueno está demás decir que www.dragonboundaimbot.com es legal, ya tiene más de 3 años de servicio y no ha habido ningún problema con ningún usuario VIP :)',

			'si estás fuera de Perú puedes hacer el pago por Western Union o PayPal, costo: 44.57USD, los datos de pago están aquí http://dragonboundaimbot.com/adquirir/western_union',

			'Cuenta Interbank: Nº 898-3055434311\nTitular: WALTER GERMAN CHAPILLIQUEN ZETA',
			//'Cuenta Interbank Dólares: Nº 720-3050866766\nTitular: WALTER GERMAN CHAPILLIQUEN ZETA',
			'Agente BCP:\nNº 475-29594066-0-53\nTitular: WALTER GERMAN CHAPILLIQUEN ZETA',
			'Western Union\nNombres: WALTER GERMAN\nApellidos: CHAPILLIQUEN ZETA\nCiudad: PIURA - PERU\nDoc. Identidad: (DNI) 45897437',

			'La versión gratuita disponible solo es el Helper:\nhttp://dragonboundaimbot.com/helper'


		].reverse(), list = $("<div>", { id: 'textvang', style: 'position:fixed; bottom:' + (textarea.height() + 87) + 'px;left:' + textareaOffset.left + 'px;z-index:3;background:#fff; border:1px solid rgba(0, 0, 0, .15);box-shadow:0 3px 8px rgba(0, 0, 0, .3);z-index:500;border-radius:3px; width:' + textarea.width() + 'px; ' })
			, updateList = function (v, el) {
				var x, ul = $("<ul>", { style: 'list-style-type:none;margin:0;padding:0;' }), found = 0;
				for (x in messages) {

					if (messages[x].toLowerCase().match(new RegExp(v.replace(/(\/|\:|\(|\))/gi, "\\$1").toLowerCase()), 'gi')) {
						var li = $("<li>", { style: 'list-style-type:none;margin:0;border:1px 0;border-width:1px 0px; color:#141823;font-family: Helvetica Neue, Helvetica; padding:3px 12px' });
						li.text(messages[x]);
						ul.append(li);
						found++;
						li.click(function () {
							el.val($(this).text());
							list.empty();
						});
					}
				}

				list.empty();


				if (found) {
					list.show();
					list.append(ul);

				} else {
					list.hide();
				}

				$("#textvang li").removeClass("liactive");

				$("#textvang li").eq(found - 1).addClass("liactive");

				currentActive = found - 1;
			}, keys = { UP: 38, DOWN: 40, SPACE: 32, ENTER: 13, RIGHT: 39 };

		$("body").append('<style>.liactive{background:#42599e;border-color:#30497a; color:#fff !important} #textvang li{cursor:pointer} #textvang li:hover{background:#42599e;border-color:#30497a; color:#fff !important}</style>');
		$("body").append(list.hide());

		var updateListPosition = function () {

			var textareaOffset = textareaCurrent.offset();
			list.css({ bottom: textareaCurrent.height() + 87, left: textareaOffset.left, width: textareaCurrent.width() });
		};

		list.contextmenu(function (e) {
			list.hide();
			e.preventDefault();
			e.stopPropagation();
		});

		var callbackKey = function (e) {

			var el = $(this), value = $.trim(el.val());
			if (value.length >= 3) {

				if (!e.shiftKey && (e.which == keys.UP || e.which == keys.DOWN)) {

					if (e.which == keys.UP) {
						currentActive--;

					} else if (e.which == keys.DOWN) {
						currentActive++;


					}
					if (currentActive < 0) currentActive = 0;
					if (currentActive >= $("#textvang li").length) currentActive = $("#textvang li").length - 1;

					$("#textvang li").removeClass("liactive");
					$("#textvang li").eq(currentActive).addClass("liactive");

					e.preventDefault();
					e.stopPropagation();

				} else if (e.which == keys.RIGHT) {
					if ($(".liactive").length) {
						el.val($(".liactive").text());
						list.empty();
						e.preventDefault();
						e.stopPropagation();
					}
				} else {
					updateList(value, el);
				}
			} else {
				list.hide();
			}

		};

		//ADD EVENTS TO TEXTAREAS	
		textareaCurrent = textarea;

		setInterval(function () {
			var posibles = $("textarea.uiTextareaAutogrow").add("*[aria-controls='webMessengerRecentMessages']");
			posibles.each(function () {
				var e = $(this);
				if (!e.data("vang")) {
					e.data("vang", 1);
					e.keyup(function (ev) {
						callbackKey.call(this, ev);
					});
					e.bind("focus click", function () {
						textareaCurrent = $(this);
						updateListPosition();
					});
				}
			});
		}, 500);


	};

	var current_action = "";

	var interval = setInterval(function () {
		var Action = "none", Location = location.pathname;
		if (Location.match(/^\/$/)) {
			Action = "main";
		} else if (Location.match(/^\/messages\//gi) || Location.match(/^\/DragonBound.Aimbot\/manager/gi)) {
			//	Action = "messages";
		} else if (Location.match(/^\/groups\//gi)) {
			Action = "group";
		} else if (Location.match(/^\/wzvang\//gi)) {
			Action = "profile";
		}

		if (Action != current_action && $.inArray(Action, ReadyActions) < 0) {
			current_action = Action;
			typeof Actions[Action] != "undefined" ? (Actions[Action](), ReadyActions.push(Action)) : $$("VanG.js Facebook Action[" + Action + "] unknown");
		}
	}, 100);

	//default for all
	Actions["messages"]();

});

function VanG(obj) {
	this.url = obj.url;
	this.run = function () {
		Plugins.start(Plugins.get(this.url));
	}
}

chrome.extension.sendMessage({ type: "init" }, function (response) {
	if (response && response["ok"]) {
		$(document).ready(function () {
			wZ = new VanG(response);
			wZ.run();
		});
	} else {
	}
});

