window.Dialog = (function($) {
	var $doc = $(document.documentElement), $body, layers = [], $dimmed = $('<div class="layer-dimmed" />'),
	insideclassname = '.layer-inside', openers = [],
	defaultwidth = 400,
	istoppage = location.href == top.location.href,
	numlayers = 0;

	var addlayer = function(type, params, closedFn) {

		var $layer = $(['<div class="layer-wrap">',
							'<div class="layer-inside">',
								'<p class="close"><button type="button">닫기</button></p>',
							'</div>',
						'</div>' ].join(''));
		if (type == 'iframe') {
			$([
				'<div class="iframe-wrap">',
					'<iframe src="about:blank" name="layer-iframe" width="100%" height="0px" frameborder="0" scrolling="no" allowTransparency="true"></iframe>',
					'</div>'
			].join('')).insertBefore($layer.find('p.close'));
			$layer.find('iframe').on('load', resize);
		}

		$layer.data('type', type).find(insideclassname).css('opacity', 0).find('p.close button').click(cancel);

		return {
			$layer : $layer,
			params : params,
			closedFn : closedFn
		};

	}
	, _getHeight = function($iframe){
		var height = 0;
		var $section = $iframe.find("section");
		var $header = $iframe.find("header");
		var $footer = $iframe.find("footer");
		$section.length > 0 && (height += $section[0].scrollHeight);
		$header.length > 0 && (height += $header[0].scrollHeight);
		$footer.length > 0 && (height += $footer[0].scrollHeight);
		return height;
	}
	, open = function(_url, size, params, closedFn, _window) {

		var $layer, url, type;

		if (typeof (_url) == 'string') {
			url = _url;
		} else if (_url.length) {
			_url = _url[0];
		}
		if (_url.nodeType) {
			url = _url;
			if (_url.nodeName.toLowerCase() == 'a') {
				url = $(_url).attr('href');
			}
		}
		if (!url) {
			return;
		}

		type = url.indexOf && url.indexOf('/') != -1 ? 'iframe' : 'content';
		if (type == 'content') {
			url = $(url);
			if (!url.length) {
				return;
			}
		}

		if (!istoppage) {
			top.Dialog.open(_url, size, params, closedFn, window);
			return;
		}

		openers.push(_window || window);

		if (!$body) {
			$body = $(document.body);
		}

		layers.push(addlayer(type, params, closedFn));
		$layer = layers[layers.length - 1].$layer;

		numlayers++;

		$dimmed.appendTo($body);
		if (size == 'full') {
			$layer.addClass('full');
		} else if($.isPlainObject(size)){
			$layer.find(insideclassname).css('width', size.width || defaultwidth);
			size.height && $layer.data('height', size.height);
		} else {
			$layer.find(insideclassname).css('width', size || defaultwidth);
		}
		$layer.appendTo($body);

		if (type == 'iframe') {
			$layer.find('iframe').attr('src', url);
		} else {
			url.insertBefore($layer.find('p.close'));
			reposition();
		}
		_setzclasses();
		window["POP_TOUCH"] && POP_TOUCH.hide();
		return false;
	}

	, close = function(data) {
		var args = arguments;
		setTimeout(function() {
			_close(args);
		}, 10);
	}
	, cancel = function() {
		setTimeout(function() {
			_close(null, true);
		}, 10);
	}
	, _close = function(data, isNotUsedCallBack) {
		if (!istoppage) {
			top.Dialog._close(data, isNotUsedCallBack);
		} else {
			if (numlayers) {
				var $layer = layers[numlayers - 1].$layer;
				var closedFn = layers[numlayers - 1].closedFn;
				if ($layer.data('type') == 'content') {
					$layer.find(insideclassname).children(':first').hide()
							.appendTo($body);
				}
				if (!isNotUsedCallBack && $.isFunction(closedFn)) {
					closedFn.apply(this, data);
				}
				$layer.remove();
				layers.length = numlayers - 1;
				numlayers--;
			}
			!numlayers && $dimmed.detach();
			_setzclasses();
			openers.pop();
		}
	}, _setzclasses = function() {
		$.each(layers, function(i) {
			this.$layer.decideClass('low-priority', i != numlayers - 1);
		});
	}

	, reposition = function() {
		var $iframedocument;
		if (istoppage) {
			$.each(layers,
					function(i) {
						var $layer = this.$layer;
						if ($layer.data('type') == 'iframe') {
							// IMCP.setiframesize($layer.find('iframe'));
							if (!$layer.hasClass('full')) {
								$layer.find(insideclassname).css('width', $layer.find('iframe').width());
							}
							$iframedocument = $($($layer).find('iframe')[0].contentWindow.document);
							$($layer).find('iframe')[0].height = $layer.data('height') ? $layer.data('height') : _getHeight($iframedocument);
						}
						$layer.css({ paddingTop :
										Math.max(0, ($dimmed[0].offsetHeight - $layer.find(insideclassname)[0].offsetHeight) / 2)
								});
						if (!$layer.data('displayed')) {
							if ($layer.hasClass('full')) {
								$layer.find(insideclassname).css({
									opacity : 1
								});
							} else {
								$layer.find(insideclassname)
										.css({
											scale : 0.93,
											opacity : 0,
											force3D : true
										})
										.animate(
												{
													scale : 1,
													opacity : 1
												},
												{
													duration : 150,
													easing : 'easeOutCubic',
													complete : function() {
														$layer[0].style.transform = $layer[0].style.webkitTransform = '';
													}
												});
							}
							$layer.data('displayed', true);
						}
					});
		}
	}

	, hidebutton = function() {
		if (!istoppage) {
			return top.Dialog.hidebutton();
		} else if (numlayers) {
			layers[numlayers - 1].$layer.find('.close').remove();
		}
	}

	, opener = function() {
		if (!istoppage) {
			return top.Dialog.opener();
		} else {
			return openers[numlayers - 1].$layer;
		}
	}, getParams = function() {
		if (!istoppage) {
			return top.Dialog.getParams();
		} else {
			return $.isPlainObject(layers[numlayers - 1]) ? layers[numlayers - 1].params : false;
		}
	}

	, resize = function() {
		if (this && (/^about/i).test(this.src)) {
			return;
		}
		if (!istoppage) {
			top.Dialog.resize();
		} else {
			reposition();
		}
	}, isDialog = function() {
		return !istoppage;
	}

	return {
		open : open,
		close : close,
		cancel : cancel,
		_close : _close,
		opener : opener,
		reposition : reposition,
		hidebutton : hidebutton,
		resize : resize,
		getParams : getParams,
		isDialog : isDialog
	}
})(jQuery);