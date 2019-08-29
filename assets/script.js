/*!
 * Copyright 2019 REOL Services
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
$(function() {
        $.widget("widget.covr", {
            options: {
                offsetY: 0,
                slideDelay: 3,
                slideOffsetXFactor: 2,
                slideOffsetYFactor: 2,
                mobileYFactor: .5
            },
            _create: function() {
                var i = this.element,
                    a = this;
                if (this.cacheSizes = [], this.previousIdx = null, this.activeIdx = null, this.imageLoaded = !1, this.slideDelay = this.element.data("slide-delay") || this.options.slideDelay, this.slideOffsetXFactor = this.element.data("slide-offset-x-factor") || this.options.slideOffsetXFactor, this.slideOffsetYFactor = this.element.data("slide-offset-y-factor") || this.options.slideOffsetYFactor, this.mobileYFactor = this.element.data("mobile-y-factor") || this.options.mobileYFactor, this.$stage = this.element.find(".w-covr-stage"), this.$images = this.$stage.find("img"), this.$images.size()) {
                    var t = this.element.data("offset-y-elements") || null;
                    if (t) {
                        var e = jQuery(t),
                            n = this.options.offsetY;
                        jQuery.each(e, function(t, e) {
                            n += jQuery(e).height()
                        }), this.options.offsetY = n
                    }
                    var s = 0;
                    this.ie();
                    this.ie() <= 10 && this.$images.each(function(t, e) {
                        (e = jQuery(e)).attr("src", e.attr("src") + "?" + Math.random())
                    }), this.$images.load(function() {
                        var t = jQuery(this),
                            e = t.data("idx");
                        a.cacheSizes[e] = {
                            w: t.width(),
                            h: t.height()
                        }, ++s == a.$images.size() && (a.imageLoaded = !0, i.addClass("_loaded"), a.render(), a.start())
                    }).each(function() {
                        (this.complete || 4 === this.readyState) && $(this).load()
                    });
                    var o = _.debounce(jQuery.proxy(this.render, this), 100);
                    $(window).on("resize", o);
                    var r = _.debounce(jQuery.proxy(this.render, this), 100);
                    $(window).on("scroll", r), this.render()
                }
            },
            isMobile: function() {
                return /Android/i.test(navigator.userAgent) || /BlackBerry/i.test(navigator.userAgent) || /iPhone|iPad|iPod/i.test(navigator.userAgent) || /IEMobile/i.test(navigator.userAgent)
            },
            render: function() {
                var o = this,
                    t = this.element,
                    e = this.options.offsetY,
                    i = $(window).height();
                this.isMobile() && (i *= this.mobileYFactor);
                var r = $(window).width(),
                    l = i - e;
                t.css({
                    height: l,
                    "min-height": l
                }), this.imageLoaded && jQuery.each(this.cacheSizes, function(t, e) {
                    var i = r,
                        a = r * e.h / e.w,
                        n = 0,
                        s = (a - l) / o.slideOffsetYFactor;
                    a < l && (s = 0, n = ((i = (a = l) * e.w / e.h) - r) / o.slideOffsetXFactor), o.$images.eq(t).css({
                        width: i,
                        height: a,
                        top: -s,
                        left: -n
                    })
                })
            },
            _gotoSlide: function() {
                this.$images.eq(this.previousIdx).removeClass("active"), this.$images.eq(this.activeIdx).addClass("active")
            },
            nextSlide: function() {
                null === this.activeIdx ? (this.activeIdx = 0, this.previousIdx = this.$images.size() - 1) : (this.previousIdx = this.activeIdx, ++this.activeIdx >= this.$images.size() && (this.activeIdx = 0)), this._gotoSlide()
            },
            previousSlide: function() {
                null === this.activeIdx ? (this.activeIdx = 0, this.previousIdx = 1) : (this.previousIdx = this.activeIdx, --this.activeIdx < 0 && (this.activeIdx = this.$images.size() - 1)), this._gotoSlide()
            },
            ie: function() {
                var t = -1,
                    e = window.navigator.userAgent,
                    i = e.indexOf("MSIE "),
                    a = e.indexOf("Trident/");
                if (0 < i) t = parseInt(e.substring(i + 5, e.indexOf(".", i)), 10);
                else if (0 < a) {
                    var n = e.indexOf("rv:");
                    t = parseInt(e.substring(n + 3, e.indexOf(".", n)), 10)
                }
                return -1 < t ? t : void 0
            },
            start: function() {
                1 != this.$images.size() ? (this.nextSlide(), setInterval(jQuery.proxy(this.nextSlide, this), 1e3 * this.slideDelay)) : this.$images.eq(0).addClass("active")
            },
            stop: function() {}
        })
    }), $(function() {
        $.widget("widget.filtr", {
            options: {},
            _create: function() {
                this.$input = this.element, this.active = [], this.$input.val(""), this.$input.prop("autocomplete", "off"), this.$sParents = jQuery(this.$input.data("search-parents")), this.$sChildren = jQuery(this.$input.data("search-children")), this.$sNotFound = jQuery(this.$input.data("search-notfound")), this.parentSelector = this.$input.data("search-parents"), this.$sNotFound.hide(), 0 < this.$sParents.size() && 0 < this.$sChildren.size() && this.$input.on("keyup", jQuery.proxy(this._changed, this))
            },
            getValue: function() {
                return this.$input.val() || ""
            },
            setValue: function(t) {
                this.$input.val(t), this._changed()
            },
            getVisible: function() {
                return "" === this.$input.val().toLowerCase().trim() ? this.$sChildren : this.visible && this.visible.length ? this.visible : []
            },
            _changed: function(t) {
                var n = this.$input.val().toLowerCase(),
                    s = this;
                if (this.visible = [], this.$sNotFound.hide(), jQuery.each(this.$sParents, function(t, e) {
                        (e = jQuery(e)).data("filtr-children-found", 0)
                    }), "" === n.trim()) return this.visible = this.$sChildren, this.$sParents.show(), this.$sChildren.show(), this.$sChildren.find("._repeat").removeClass("active"), void this._trigger("-change");
                jQuery.each(this.$sChildren, function(t, e) {
                    if (-1 == (e = jQuery(e)).data("searchable").indexOf(n)) e.hide(), e.find("._repeat").removeClass("active");
                    else {
                        var i = e.parents(this.parentSelector).eq(0),
                            a = i.data("filtr-children-found") || 0;
                        i.data("filtr-children-found", ++a), e.show(), e.find("._repeat").addClass("active"), s.visible.push(e)
                    }
                }), this.$sParents.show(), jQuery.each(this.$sParents, function(t, e) {
                    (e = jQuery(e)).data("filtr-children-found") || 0 || e.hide()
                }), this.visible.length || this.$sNotFound.show(), this._trigger("-change")
            }
        })
    }), $(function() {
        $.widget("widget.form", {
            options: {
                validators: {
                    isNonEmpty: function(t) {
                        return {
                            status: t && "" !== t.trim(),
                            msgError: "Field is required"
                        }
                    },
                    isEmail: function(t) {
                        return {
                            status: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(t),
                            msgError: "Invalid Email"
                        }
                    },
                    isUsZipCode: function(t) {
                        var e = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(t);
                        return {
                            status: e = !!(!t || "" === t.trim()) || e,
                            msgError: "Invalid Zip Code"
                        }
                    }
                }
            },
            _create: function() {
                this.isProcessing = !1, this.element.attr("novalidate", "novalidate").attr("autocomplete", "off"), this.element.on("submit", jQuery.proxy(this._handleSubmit, this))
            },
            _validate: function() {
                var t = this.element.find("[data-validators]"),
                    i = [],
                    s = this.options.validators;
                return jQuery.each(t, function(t, a) {
                    var e = (a = jQuery(a)).data("validators").split(","),
                        n = [];
                    jQuery.each(e, function(t, e) {
                        e = e.trim();
                        var i = (e = s[e])(a.val());
                        i.status || n.push(i.msgError)
                    }), n.length && (i.push(a), a.data("form-message", n))
                }), this._displayErrors(i), !i.length
            },
            _displayErrors: function(t) {
                this.element.find(".form-msg").remove(), jQuery.each(t, function(t, i) {
                    var e = (i = jQuery(i)).data("form-message");
                    jQuery.each(e, function(t, e) {
                        jQuery('<p class="form-msg form-msg-error">' + e + "</p>").insertAfter(i)
                    })
                })
            },
            _handleSubmit: function(t) {
                t.preventDefault(), this._validate() && this._process()
            },
            _process: function() {
                var t = this.element;
                this.isProcessing || (this.isProcessing = !0, jQuery.ajax({
                    url: t.attr("action") || "",
                    method: t.attr("method") || "post",
                    dataType: "JSON",
                    data: t.serialize()
                }).done(jQuery.proxy(this._response, this)))
            },
            _resetForm: function() {
                this.element.find("input, textarea, select").val("")
            },
            _response: function(t) {
                this.isProcessing = !1;
                var e = t.message;
                t.status ? (e = e || "Thank you! Message sent successfully.", jQuery('<p class="form-msg form-msg-success">' + e + "</p>").prependTo(this.element), this._resetForm()) : (e = e || "Server error during processing.", jQuery('<p class="form-msg form-msg-error">' + e + "</p>").prependTo(this.element))
            }
        })
    }), $(function() {
        $.widget("widget.geom", {
            options: {
                latitude: 40.7127,
                longitude: -74.0059,
                zoom: 12,
                mapTypeControl: !1,
                draggable: !0
            },
            _create: function() {
                this.latitude = this.element.data("latitude") || this.options.latitude, this.longitude = this.element.data("longitude") || this.options.longitude;
                var t = this.element,
                    a = this;
                this.options.draggable = !this.isMobile(), t.on("googleMapReady", function(t, e) {
                    a.map = e, a.addMarker(), a.render();
                    var i = _.debounce(jQuery.proxy(a.render, a), 100);
                    $(window).on("resize", i)
                }).googleMap(a.options)
            },
            isMobile: function() {
                return /Android/i.test(navigator.userAgent) || /BlackBerry/i.test(navigator.userAgent) || /iPhone|iPad|iPod/i.test(navigator.userAgent) || /IEMobile/i.test(navigator.userAgent)
            },
            addMarker: function() {
                var t = {
                    position: {
                        lat: this.latitude,
                        lng: this.longitude
                    },
                    map: this.map
                };
                this.options.markerImage && (t.icon = this.options.markerImage);
                var e = new google.maps.Marker(t),
                    i = "http://maps.google.com/maps?q=" + this.element.data("address") + "," + this.element.data("city") + "," + this.element.data("state");
                google.maps.event.addListener(e, "click", function() {
                    window.open(i, "_blank")
                })
            },
            render: function() {
                google.maps.event.trigger(this.map, "resize"), this.map.panTo({
                    lat: this.latitude,
                    lng: this.longitude
                })
            }
        })
    }), $(function() {
        $.widget("widget.loca", {
            options: {
                tpl: {
                    infoWindow: '<div class="w-loca-iw"><div class="w-loca-iw-header"><h1><%= locationName %></h1><i class="fa fa-times pull-right info-close-btn" aria-hidden="true"></i></div><div class="w-loca-iw-cocntent"><p><%= locationAddress %>,<br /><%= locationCity %>, <%= locationRegion %></p><p><% if (locationUrl) { %><a class="w-loca-iw-link" href="<%= locationUrl %>">Leasing Information</a><% } %><span class="w-loca-iw-sep hidden-xs">|</span><a class="w-loca-iw-link" target="_blank" href="http://maps.google.com/maps?q=<%= locationAddress %>,<%= locationCity %>,<%= locationRegion %>">Map &amp; Directions</a></p></div></div>'
                },
                markerImage: null,
                map: {
                    latitude: 40.7127,
                    longitude: -94.0059,
                    zoom: 4,
                    minZoom: 3,
                    maxZoom: 16,
                    mapTypeControl: !1
                }
            },
            _create: function() {
                var a = this.element,
                    n = this;
                this.options.scrollDisable && (this.options.map.scrollwheel = !1), this.markers = [], this.bounds = null, this.feedCnt = 0, this.data = null, this.markerImage = this.element.data("marker-image") || this.options.markerImage, a.on("googleMapReady", function(t, e) {
                    n.map = e, n.infoWindow = new google.maps.InfoWindow({
                        maxSize: 300
                    });
                    var i = _.debounce(jQuery.proxy(n._render, n), 100);
                    a.trigger("locaWidgetReady"), $(window).on("resize", i)
                }).googleMap(n.options.map)
            },
 
            reset: function() {
                this.bounds = null, this.markers.length && jQuery.each(this.markers, function(t, e) {
                    e.setMap(null)
                })
            },
            dataFormat: function() {
                return {
                    latitude: "",
                    longitude: "",
                    content: "",
                    template: _.template(this.options.tpl.infoWindow)
                }
            },
            feed: function(t) {
                if (this.feedCnt++, this.map && t)
                    if (0 !== t.length || this.options.keepmap) {
                        this.element.show();
                        if (this.reset(), this.data = t, this.markers = [], this.bounds = new google.maps.LatLngBounds, this.feedCnt <= 1 && this.options.animation) {
                            this.map.setCenter({
                                lat: this.options.map.latitude,
                                lng: this.options.map.longitude
                            });
                            for (var e = 0; e < t.length; e += 3)
                                for (var i = e; i < e + 3 && !(i >= t.length); i++) setTimeout(this._addMarker.bind(this, t[i]), 20 * e)
                        } else {
                            for (var a = 0; a < t.length; a++) this._addMarker(t[a]);
                            this._render()
                        }
                    } else this.element.hide();
                else console.log("Feed not accepted", t, this.map)
            },
            _addMarker: function(t) {
                if (t) {
                    var e = this,
                        i = new google.maps.LatLng(t.latitude, t.longitude),
                        a = {
                            position: i,
                            map: e.map,
                            icon: e.markerImage
                        };
                    this.options.animation && this.feedCnt <= 1 && (a.animation = google.maps.Animation.DROP);
                    var n = new google.maps.Marker(a);
                    n.addListener("click", function() {
                        e.infoWindow.setContent(t.content), e.infoWindow.open(e.map, n), e._styleInfodow()
                    }), e.markers.push(n), e.bounds.extend(i)
                }
            },
            _styleInfodow: function() {
                var t = this,
                    e = $(".gm-style-iw");
                if (e[0]) {
                    $(".info-close-btn").click(function() {
                        t.infoWindow.close()
                    });
                    var i = e.prev();
                    i.children(":nth-child(2)").css({
                        display: "none"
                    }), i.children(":nth-child(4)").css({
                        display: "none"
                    }), e.next().css({
                        display: "none"
                    })
                } else setTimeout(function() {
                    t._styleInfodow()
                }, 100)
            },
            _render: function() {
                this.map && (google.maps.event.trigger(this.map, "resize"), this.bounds && 0 < this.data.length ? this.map.fitBounds(this.bounds) : this.map.setCenter({
                    lat: this.options.map.latitude,
                    lng: this.options.map.longitude
                })), this.map && this.data || console.log("widget.loca waiting for data and map ready")
            }
        })
    }), $(function() {
        $.widget("widget.togg", {
            options: {},
            _create: function() {
                if (this.$triggers = this.element.find(this.element.data("triggers")), this.$triggers.size()) {
                    this.$active = null, this._hideAll(), this.$triggers.on("click", jQuery.proxy(this._switch, this));
                    var t = this.element.data("default-idx") || 0;
                    this._switch(this.$triggers.eq(t))
                }
            },
            _hideAll: function() {
                jQuery.each(this.$triggers, function(t, e) {
                    jQuery(jQuery(e).data("href")).hide()
                })
            },
            _switch: function(t) {
                var e = null;
                e = t.preventDefault ? (t.preventDefault(), jQuery(t.currentTarget)) : jQuery(t), this.$active && (this.$active.parent().removeClass("active"), jQuery(this.$active.data("href")).hide()), e.parent().addClass("active"), jQuery(e.data("href")).show(), this.$active = e, this._trigger("-change", null, {
                    role: e.data("role")
                })
            }
        })
    }),
    function() {
        var o = 0;
        $.widget("page.abt", {
            _create: function() {
                jQuery(this).resetStates(), this.modal = $("#mgt-team-modal"), this.items = $(".mgt-team-item");
                var e = this;
                this._initModal(), $(".mgt-team-item-toggle").on("click", function() {
                    var t = $(this).closest(".mgt-team-item");
                    o = e.items.index(t), e._showModal()
                })
            },
            _showModal: function() {
                var t = $(this.items[o]).find(".mgt-team-item-toggle"),
                    e = $(this.items[o]).find(".mgt-team-item-bg"),
                    i = t.next().html(),
                    a = '<p class="modal-title">' + t.data("title") + "</p>";
                bioImg = e.html();
                var n = this.modal.find(".modal-prev-btn"),
                    s = this.modal.find(".modal-next-btn");
                n.removeClass("disabled"), s.removeClass("disabled"), 0 === o && n.addClass("disabled"), o === this.items.length - 1 && s.addClass("disabled"), this.modal.find(".modal-header").find("h4").html(t.data("name")), this.modal.find(".modal-body").html(bioImg + a + i), this.modal.modal("show")
            },
            _initModal: function() {
                var t = $("#mgt-team-modal"),
                    e = t.find(".modal-prev-btn"),
                    i = t.find(".modal-next-btn"),
                    a = this;
                e.on("click", function() {
                    o = o - 1 < 0 ? 0 : o - 1, $(this).hasClass("disabled") || a._showModal()
                }), i.on("click", function() {
                    o = o + 1 >= a.items.length ? a.items.length - 1 : o + 1, $(this).hasClass("disabled") || a._showModal()
                })
            }
        })
    }(),
    function() {
        var i = 0;
        $.widget("page.cact", {
            _create: function() {
                jQuery(this).resetStates(), this.modal = $("#cact-video-modal"), this.items = $(".video-item");
                var e = this;
                $(".video-item-toggle").on("click", function() {
                    var t = $(this).closest(".video-item");
                    i = e.items.index(t), e._showModal()
                }), e._closeModal()
            },
            _showModal: function() {
                var t = $(this.items[i]).find(".video-item-toggle"),
                    e = $(this.items[i]).find(".video-item-cont");
                videoContent = e.html(), this.modal.find(".modal-header").find("h4").html(t.data("name")), this.modal.find(".modal-body").html(videoContent), this.modal.modal("show")
            },
            _closeModal: function() {
                this.modal.on("hidden.bs.modal", function() {
                    $("video").trigger("pause")
                })
            }
        })
    }(), $.widget("page.cnt", {
        _create: function() {
            jQuery(this).resetStates()
        }
    }), $.widget("page.hom", {
        _create: function() {
            jQuery(this).resetStates(), this.mapAnimated = !1, this._scrollToSections(), this._initMap(), this._initAnimation(), this._initMisc(), this._initDevRpt()
        },
        _scrollToSections: function() {
            $(".next-btn").on("click", function(t) {
                if ("" !== this.hash) {
                    t.preventDefault();
                    var e = this.hash;
                    $("html, body").animate({
                        scrollTop: $(e).offset().top
                    }, 600, function() {
                        window.location.hash = e
                    })
                }
            })
        },
        _initDevRpt: function() {
            var t = $("#report-modal");
            $(".dev-rpt-btn").on("click", function() {
                t.modal("show")
            })
        },
        _initMisc: function() {
            var a = this,
                t = $(".home-news-slide"),
                e = $(".home-events-slide"),
                i = $("#home-stockinfo"),
                n = $("#home-press"),
                s = $("#home-events"),
                o = this._extractStockRss(i),
                r = this._extractNewsEventsRss(n),
                l = this._extractNewsEventsRss(s, "event");
            this._renderStock(o), 3 < r.length && (r = r.splice(0, 3)), 3 < l.length && (l = l.splice(0, 3));
            var d = function(t, e) {
                var i = $("<div>", {
                    class: "slide-item"
                });
                0 === e && i.addClass("active"), i.append($("<a>", {
                    text: a._ellipsis(t.title),
                    href: t.link
                })), this.append(i)
            };
            t.currentIdx = 0, (t.slideData = r).forEach(d.bind(t)), e.currentIdx = 0, (e.slideData = l).forEach(d.bind(e));
            var h = function(t) {
                t < 0 || t >= this.slideData.length || t !== this.currentIdx && (this.find("i.fas").removeClass("disable"), 0 === t && this.find(".ctl-prev").addClass("disable"), t === this.slideData.length - 1 && this.find(".ctl-next").addClass("disable"), this.find(".slide-item").removeClass("active"), $(this.find(".slide-item")[t]).addClass("active"), this.currentIdx = t)
            };
            t._render = h.bind(t), e._render = h.bind(e), [t, e].forEach(function(t) {
                t.slideData.length <= 1 ? t.find("i.fas").addClass("hidden") : (t.find(".ctl-prev").on("click", function() {
                    t._render(t.currentIdx - 1)
                }), t.find(".ctl-next").on("click", function() {
                    t._render(t.currentIdx + 1)
                }))
            })
        },
        _renderStock: function(t) {
            t.price && $("#home-stock-price").html("$" + t.price), t.priceDollar && $("#home-pricechange-dollar").html(0 < t.priceDollar ? "+ $" + t.priceDollar : "- $" + Math.abs(t.priceDollar)), t.pricePercent && $("#home-pricechange-percent").html(0 < t.pricePercent ? "+ " + t.pricePercent + "%" : t.pricePercent + "%")
        },
        _ellipsis: function(t) {
            return 50 < t.length ? t.substring(0, 50) + " ..." : t
        },
        _extractStockRss: function(t) {
            var e = t.find("item").find("description").text(),
                i = {};
            try {
                var a = this._findFirstDigit(e.split("Price ($):")[1]);
                i.price = parseFloat(a), a = this._findFirstDigit(a.split("Change ($):")[1]), i.priceDollar = parseFloat(a), a = this._findFirstDigit(a.split("Change (%):")[1]), i.pricePercent = parseFloat(a)
            } catch (t) {
                console.log("extract stock error")
            }
            return i
        },
        _findFirstDigit: function(t) {
            var e = "(" === t[0],
                i = t.search(/(\d|-)/),
                a = "";
            return a = 0 < i ? t.substring(i) : t, e ? "-" + a : a
        },
        _extractNewsEventsRss: function(t, e) {
            for (var i = [], a = t.find("item"), n = 0; n < a.length; n++) {
                var s = $(a[n]).html().match(/<link><!--\[CDATA.*-->/)[0],
                    o = {
                        title: this._cleanCData($(a[n]).find("title").text()),
                        link: this._cleanCData(s, !0)
                    };
                "event" == e && (o.pubdata = $(a[n]).find("pubdate").text()), i.push(o)
            }
            return i
        },
        _cleanCData: function(t, e) {
            return e ? t.replace("<link>\x3c!--[CDATA[", "").replace("]]--\x3e", "") : t.replace("<![CDATA[", "").replace("]]>", "")
        },
        _visibleBottom: function() {
            return parseFloat($(document).scrollTop()) + $(window).height()
        },
        _initAnimation: function() {
            $(".hom-info");
            var t = $(".hom-mission"),
                e = (t.find(".hom-misson-content-title"), t.find(".hom-misson-content-p"), $(".hom-map")),
                i = $(".home-misc-top"),
                a = $(".home-misc-cards"),
                n = this;
            $(document).on("scroll", _.throttle(function() {
                parseFloat($(document).scrollTop());
                (Math.abs(n._visibleBottom() - t.offset().top - t.height()) < 250 && $(".hom-mission-bg").addClass("animated"), Math.abs(n._visibleBottom() - t.offset().top - t.height()) < 150 && $(".hom-misson-content-title").addClass("animated"), Math.abs(n._visibleBottom() - t.offset().top - t.height()) < 100 && $(".hom-mission-content-p").addClass("animated"), Math.abs(n._visibleBottom() - e.offset().top - e.height()) < 200) && (n.mapAnimated || (n.mapAnimated = !0, $(".hom-map-panel-content").addClass("panel-open"), setTimeout(function() {
                    ["#countup-item-asset", "#countup-item-sqft", "#countup-item-states"].forEach(function(t, e) {
                        var i = $(t),
                            a = parseFloat(i.data("endval"));
                        (1 === e ? new CountUp(i[0], 0, a, 1, 5, {
                            decimal: "."
                        }) : new CountUp(i[0], 0, a, 0, 5)).start()
                    })
                }, 1e3), n.locaWidgetReady ? n._onFilterChange.call(n) : jQuery("#map").on("locaWidgetReady", function() {
                    n._onFilterChange.call(n)
                })));
                Math.abs(n._visibleBottom() - i.offset().top - i.height()) < 50 && $(".home-misc-item-right").addClass("animated"), Math.abs(n._visibleBottom() - a.offset().top - a.height()) < 50 && $(".home-misc-card-item-bg").addClass("animated")
            }, 50))
        },
        _initMap: function() {
            var t = jQuery("#location-filtr"),
                e = jQuery("#map"),
                i = this;
            e.on("locaWidgetReady", function() {
                i.locaWidgetReady = !0
            }), t.on("filtr-change", this._onFilterChange.bind(this)), $(".hom-map-panel-toggle").on("click", function() {
                $(".hom-map-panel-content").toggleClass("panel-open")
            })
        },
        _onFilterChange: function() {
            var t = jQuery("#location-filtr"),
                e = jQuery("#map");
            Cookies.set("loc-default-search", t.filtr("getValue"));
            var i = t.filtr("getVisible");
            if (i) {
                var a = e.loca("dataFormat");
                i = this._translate(i, a), e.loca("feed", i)
            }
        },
        _translate: function(t, a) {
            var n = [];
            return jQuery.each(t, function(t, e) {
                e = jQuery(e);
                var i = {};
                i.latitude = e.data("latitude"), i.longitude = e.data("longitude"), i.content = a.template({
                    locationName: e.data("location-name"),
                    locationAddress: e.data("location-address"),
                    locationCity: e.data("location-city"),
                    locationRegion: e.data("location-region"),
                    locationUrl: e.data("location-url"),
                    locationLatitude: e.data("location-latitude"),
                    locationLongitude: e.data("location-longitude")
                }), n.push(i)
            }), n
        }
    }), $.widget("page.loc", {
        _create: function() {
            var n = this,
                s = null,
                t = jQuery("#location-views-toggler"),
                o = jQuery("#location-filtr"),
                r = jQuery("#map");
            t.on("togg-change", function(t, e) {
                if (s = e.role, Cookies.set("loc-default-tab", s), "map" == s) {
                    var i = o.filtr("getVisible");
                    if (i) {
                        var a = r.loca("dataFormat");
                        i = n._translate(i, a), r.loca("feed", i)
                    }
                }
            }), o.on("filtr-change", function(t) {
                if (Cookies.set("loc-default-search", o.filtr("getValue")), "map" == s) {
                    var e = o.filtr("getVisible");
                    if (e) {
                        var i = r.loca("dataFormat");
                        e = n._translate(e, i), r.loca("feed", e)
                    }
                }
            }), "" !== Cookies.get("loc-default-search") && o.filtr("setValue", Cookies.get("loc-default-search")), "map" == Cookies.get("loc-default-tab") && r.on("googleMapReady", function(t, e) {
                jQuery("[data-role=map]").click()
            })
        },
        _translate: function(t, a) {
            var n = [];
            return jQuery.each(t, function(t, e) {
                e = jQuery(e);
                var i = {};
                i.latitude = e.data("latitude"), i.longitude = e.data("longitude"), i.content = a.template({
                    locationName: e.data("location-name"),
                    locationAddress: e.data("location-address"),
                    locationCity: e.data("location-city"),
                    locationRegion: e.data("location-region"),
                    locationUrl: e.data("location-url"),
                    locationLatitude: e.data("location-latitude"),
                    locationLongitude: e.data("location-longitude")
                }), n.push(i)
            }), n
        }
    }), $.widget("page.mia", {
        _create: function() {
            jQuery(this).resetStates()
        }
    }), $.widget("page.ndv", {
        _create: function() {
            jQuery(this).resetStates(), this._sliderInit()
        },
        _sliderInit: function() {
            $(".gallery-items").imagelistexpander({
                prefix: "gallery-"
            }), $(".ndev-carousel").carousel({
                interval: !1
            }), $(".gallery-item").on("click", function() {
                $(".ndev-carousel").carousel("cycle")
            }), $(".carousel-inner").each(function() {
                $(this).find(".item:first").addClass("active"), 1 === $(this).children("div").length && $(this).siblings(".carousel-control, .carousel-indicators").hide()
            })
        }
    }), $.widget("page.prd", {
        _create: function() {
            var t = $("#siteplan-modal");
            $(".siteplan-btn")[0] && $(".siteplan-btn").on("click", function() {
                t.modal("show")
            })
        }
    }), $.widget("page.tos", {
        _create: function() {
            jQuery(this).resetStates()
        }
    });
var googleMapStyles = [{
    featureType: "landscape",
    stylers: [{
        saturation: -100
    }, {
        lightness: 65
    }, {
        visibility: "on"
    }]
}, {
    featureType: "poi",
    stylers: [{
        saturation: -100
    }, {
        lightness: 51
    }, {
        visibility: "simplified"
    }]
}, {
    featureType: "road.highway",
    stylers: [{
        saturation: -100
    }, {
        visibility: "simplified"
    }]
}, {
    featureType: "road.arterial",
    stylers: [{
        saturation: -100
    }, {
        lightness: 30
    }, {
        visibility: "on"
    }]
}, {
    featureType: "road.local",
    stylers: [{
        saturation: -100
    }, {
        lightness: 40
    }, {
        visibility: "on"
    }]
}, {
    featureType: "transit",
    stylers: [{
        saturation: -100
    }, {
        visibility: "simplified"
    }]
}, {
    featureType: "water",
    elementType: "labels",
    stylers: [{
        visibility: "on"
    }, {
        lightness: -25
    }, {
        saturation: -100
    }]
}, {
    featureType: "water",
    elementType: "geometry",
    stylers: [{
        hue: "#ffff00"
    }, {
        lightness: -25
    }, {
        saturation: -97
    }]
}];
$(document).ready(function() {
    _.each({
        ipad: "iPad",
        iphone: "iPhone",
        ipod: "iPod",
        android: "Android",
        blackberry: "BlackBerry",
        windowsphone: "IEMobile"
    }, function(t, e) {
        Modernizr.addTest(e, function() {
            return !!navigator.userAgent.match(new RegExp(t, "i"))
        })
    }), Modernizr.addTest("ios", function() {
        return Modernizr.ipad || Modernizr.ipod || Modernizr.iphone
    }), Modernizr.addTest("mobile", function() {
        return Modernizr.ios || Modernizr.android || Modernizr.blackberry || Modernizr.windowsphone
    }), Modernizr.testProp("ipad", "iphone", "ipod", "ios", "android", "blackberry", "windowsphone");
    var t = function() {
        var t = [{
                string: navigator.userAgent,
                subString: "Chrome",
                identity: "Chrome"
            }, {
                string: navigator.userAgent,
                subString: "MSIE",
                identity: "IE"
            }, {
                string: navigator.userAgent,
                subString: "Trident",
                identity: "NEWIE"
            }, {
                string: navigator.userAgent,
                subString: "Firefox",
                identity: "Firefox"
            }, {
                string: navigator.userAgent,
                subString: "Safari",
                identity: "Safari"
            }, {
                string: navigator.userAgent,
                subString: "Opera",
                identity: "Opera"
            }],
            a = "",
            e = function(t) {
                var e = t.indexOf(a);
                if (-1 != e) return parseFloat(t.substring(e + a.length + 1))
            };
        return {
            browser: function(t) {
                for (var e = 0; e < t.length; e++) {
                    var i = t[e].string;
                    if (a = t[e].subString, -1 != i.indexOf(t[e].subString)) return t[e].identity
                }
            }(t) || "Other",
            version: e(navigator.userAgent) || e(navigator.appVersion) || "Unknown"
        }
    };
    $.getBrowserInfo = t;
    $.fn.extend({
        widgetize: function() {
            var t = $(this);
            if (!t || t.is("script")) return this;
            var i = "widget",
                a = {};
            return $("[data-widget]:not(:data(widget-init))", t).add(t.attr("data-widget") ? t : null).each(function() {
                if (_wel = $(this), !_wel.is("script")) {
                    _wel.uniqueId();
                    _wel.attr("id");
                    var t = $.camelCase(_wel.attr("data-widget"));
                    if (_wel.data("widget-init", !0), $[i] && $[i][t]) {
                        var e = _wel.data();
                        delete e.widget, $[i][t](e, _wel), a[t.toLowerCase()] = _wel
                    }
                }
            }), _.defer(function() {
                _.each(a, function(t, e) {
                    t.trigger("widget:init:" + e, t)
                })
            }), this
        }
    });
    var e, i, a, n, s, o, r, l, d = _.once(function() {
        var t = jQuery.Deferred(),
            e = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBoWnGTGKwiF208iUd6GHzWJ__Z9fjPtE0&callback=__MAP_CALLBACK__",
            i = $("meta[name='google_maps_api']");
        return i.length && (e = i.attr("content") + "&callback=__MAP_CALLBACK__"), window.__MAP_CALLBACK__ = function() {
            _.delay(function() {
                t.resolve("done")
            }, 100)
        }, $.getScript(e).done(function(t, e) {}).fail(function() {
            t.reject("Cannot load Google Map API")
        }), t.promise()
    });
    $.fn.extend({
        googleMap: function(t) {
            var n = $(this),
                s = _.extend({}, t, {
                    mapTypeControlOptions: {
                        mapTypeIds: ["seritage"]
                    }
                });
            return $.when(d()).then(function(t) {
                var e = {
                    center: {
                        lat: s.latitude || 40.7127,
                        lng: s.longitude || -74.0059
                    },
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.LEFT_BOTTOM
                    },
                    streetViewControlOptions: {
                        position: google.maps.ControlPosition.LEFT_BOTTOM
                    }
                };
                _.extend(e, s);
                var i = new google.maps.Map(n[0], e),
                    a = new google.maps.StyledMapType(googleMapStyles);
                i.mapTypes.set("seritage", a), i.setMapTypeId("seritage"), n.trigger("googleMapReady", i)
            }), this
        }
    }), $.fn.extend({
        resetStates: function() {
            return Cookies.remove("loc-default-tab"), Cookies.remove("loc-default-search"), this
        }
    }), e = jQuery, i = jQuery.fn.html, e.fn.html = function() {
        var t = i.apply(this, arguments);
        return this.widgetize(), t
    }, a = t(), n = a.browser.toLowerCase(), s = a.version, $("html").addClass(n).addClass(n + "-" + s), $("body").widgetize(), o = $("body"), r = o.attr("id"), l = "page", $[l] && $[l][r] ? ($[l][r](o.data(), o), o.data("init", !0), $(document).trigger("page:load:" + r, o, l)) : $(document).trigger("page:load", o)
});