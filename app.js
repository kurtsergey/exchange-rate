
$(function ()
{
    $(document).on('click', function (e)
    {
        if (e.originalEvent.ctrlKey || e.originalEvent.metaKey)
        {
            var t = $(e.target);

            var text_nodes = t.contents().filter(function ()
            {
                return this.nodeType == Node.TEXT_NODE;
            });

            if (text_nodes.length > 0)
            {
                var original_content = t.clone();

                text_nodes.replaceWith(function (i)
                {
                    return $(this).text().replace(/([\d\s]*)/g, "<number>$1</number>");
                });

                var hit_word_elem = document.elementFromPoint(e.clientX, e.clientY);

                if (hit_word_elem.nodeName == 'NUMBER')
                {
                    hit_word = $(hit_word_elem).text();

                    chrome.runtime.sendMessage({ type: 'parsed', text: hit_word }, function (response)
                    {
                    });
                }

                t.replaceWith(original_content);
            }

            e.preventDefault();
        }
    });


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

