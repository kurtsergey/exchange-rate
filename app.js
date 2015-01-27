
$(function ()
{
    chrome.storage.sync.get({
        replaceSave: true
    }, function (sync)
    {
        if (sync.replaceSave)
        {
            var procId;

            procId = setTimeout(findSelectors, 200);

            $(document).bind("DOMSubtreeModified", function ()
            {
                clearTimeout(procId);
                procId = setTimeout(findSelectors, 200);
            });
        }
    });

    var sync = {
        replace: true,
        replaceSave: true
    };

    chrome.storage.sync.get({
        replace: true,
        replaceSave: true
    }, function (s)
    {
        sync.replace = s.replace;
        sync.replaceSave = s.replaceSave;
    });


    $(document).on('click', function (e)
    {
        if (e.originalEvent.ctrlKey || e.originalEvent.metaKey)
        {
            var t = $(e.target);
            if (t.data('exchange-rate-originalHtml'))
            {
                var s = getSelector(t);
                replacePricesToOriginal(s);
                removeSelector(s);
            }
            else
            {
                var text_nodes = t.contents().filter(function ()
                {
                    return this.nodeType == Node.TEXT_NODE;
                });

                if (text_nodes.length > 0)
                {
                    var original_content = t.clone();

                    text_nodes.replaceWith(function (i)
                    {
                        return $(this).text().replace(/([\d\s.,]*)/g, "<number>$1</number>");
                    });

                    var hit_word_elem = document.elementFromPoint(e.clientX, e.clientY);

                    if (hit_word_elem.nodeName == 'NUMBER')
                    {
                        hit_word = $(hit_word_elem).text();

                        chrome.runtime.sendMessage({ type: 'parsed', text: hit_word }, function (response) { });

                        if (sync.replace)
                        {
                            var tt = t.text();
                            if (tt.replace(/([\d\s.,byrблрруей]*)/gi, '') == '')
                            {
                                var s = getSelector(t);
                                replacePrices(s);
                                if (sync.replaceSave)
                                {
                                    pushSelector(s);
                                }
                            }
                        }
                    }

                    t.replaceWith(original_content);
                }
            }

            e.preventDefault();
        }
    });



    function getSelector($node)
    {
        var res = '';

        if ($node && $node.length)
        {
            var p = $node.parents();
            if (p && p.length)
            {
                res = p.map(function (index, o) { return o.tagName + ' > '; }).toArray().reverse().join(' ') + ' ' + $node.prop("tagName");
            }
        }

        return res;
    }


    function replacePrices(selector)
    {
        chrome.storage.sync.get({
            defaultCurrency: 'usd'
        }, function (sync)
        {
            $(selector).each(function (index, item)
            {
                var $item = $(item);
                var tt = $item.text();
                if (tt.replace(/([\d\s.,byrблрруей]*)/gi, '') == '')
                {
                    chrome.runtime.sendMessage({ type: 'found', text: tt, curr: sync.defaultCurrency }, function (response)
                    {
                        $item.data('exchange-rate-originalHtml', $item.html());
                        $item.html(response.text + ' <span class="exchange-rate-icon"></span>');
                    });
                }
            });
        });
    }

    function replacePricesToOriginal(selector)
    {
        $(selector).each(function (index, item)
        {
            var $item = $(item);
            $item.html($item.data('exchange-rate-originalHtml'));
            $item.removeData('exchange-rate-originalHtml')
        });
    }





    function findSelectors()
    {
        var o = {};
        var hn = 'selectors-' + document.location.hostname;
        o[hn] = '';


        chrome.storage.sync.get(o, function (sync)
        {
            if (!!sync[hn])
            {
                var items = sync[hn].split(',');
                for (var i = 0; i < items.length; ++i)
                {
                    replacePrices(items[i]);
                }
            }
        });
    }





    function pushSelector(selector)
    {
        var o = {};
        var hn = 'selectors-' + document.location.hostname;
        o[hn] = '';

        chrome.storage.sync.get(o, function (sync)
        {
            if (!sync[hn])
            {
                sync[hn] = selector;
            }
            else
            {
                var items = sync[hn].split(',');
                if (items.indexOf(selector) == -1)
                {
                    items.push(selector);
                }
                sync[hn] = items.join(',');
            }
            chrome.storage.sync.set(sync, function () { });
        });
    }

    function removeSelector(selector)
    {
        var o = {};
        var hn = 'selectors-' + document.location.hostname;
        o[hn] = '';

        chrome.storage.sync.get(o, function (sync)
        {
            if (!!sync[hn])
            {
                var items = sync[hn].split(',');

                var index = items.indexOf(selector);
                if (index !== -1)
                {
                    items.splice(index, 1);
                }
                sync[hn] = items.join(',');
            }
            chrome.storage.sync.set(sync, function () { });
        });
    }



    //if (document.location.hostname == 'ab.onliner.by')
    //{
    //    find();
    //    setInterval(find, 1000);
    //}


    //function find()
    //{
    //    chrome.storage.sync.get({
    //        defaultCurrency: 'usd'
    //    }, function (items)
    //    {
    //        $('.cost').each(function ()
    //        {
    //            var self = $(this);
    //            var s = self.text();
    //            if (s)
    //            {
    //                chrome.runtime.sendMessage({ type: "found", text: s, curr: items.defaultCurrency }, function (r)
    //                {
    //                    if (r.text)
    //                    {
    //                        self.find('strong').html(r.text);
    //                    }
    //                });
    //            }
    //        });
    //    });
    //};

});

