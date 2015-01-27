(function ()
{
    var byr,
        usd,
        eur,
        rub,

        usdRate,
        eurRate,
        rubRate;



    chrome.storage.sync.get({
        usdRate: 0,
        eurRate: 0,
        rubRate: 0
    }, function (items)
    {
        usdRate = items.usdRate;
        eurRate = items.eurRate;
        rubRate = items.rubRate;
    });



    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse)
    {
        var t, i;

        if (request.type == 'parsed')
        {
            t = normalizeAmount(request.text);

            try
            {
                i = parseFloat(t);
            } catch (ex) { };

            if (i && !isNaN(i))
            {
                byr = i;

                if (usdRate && !isNaN(usdRate))
                {
                    usd = i / usdRate;
                }

                if (eurRate && !isNaN(eurRate))
                {
                    eur = i / eurRate;
                }

                if (rubRate && !isNaN(rubRate))
                {
                    rub = i / rubRate;
                }


                chrome.storage.sync.get({
                    notification: true,
                    alert: false,
                    defaultCurrency: 'usd'
                }, function (items)
                {
                    var title,
                        message;

                    if (items.defaultCurrency == 'usd')
                    {
                        title = '$' + numberToString(usd);
                        message = '€' + numberToString(eur) + '\n' + '₽' + numberToString(rub);
                    }
                    else if (items.defaultCurrency == 'eur')
                    {
                        title = '€' + numberToString(eur);
                        message = '$' + numberToString(usd) + '\n' + '₽' + numberToString(rub);
                    }
                    else
                    {
                        title = '₽' + numberToString(rub);
                        message = '$' + numberToString(usd) + '\n' + '€' + numberToString(eur);
                    }

                    message += '\n' + numberToString(i) + ' BYR';

                    if (items.notification)
                    {
                        chrome.notifications.create('', { type: 'basic', title: title, message: message, iconUrl: '128.png' }, function (n)
                        {
                            setTimeout(function ()
                            {
                                chrome.notifications.clear(n, function callback()
                                {
                                })
                            }, 3000);
                        });
                    }

                    if (items.alert)
                    {
                        alert(title);
                    }
                });

            }
        }
        else if (request.type == 'found')
        {

            var res = [];
            var text = request.text;

            if (typeof text === 'string')
            {
                text = [text];
            }

            for (var i = 0 ; i < text.length; ++i)
            {
                t = normalizeAmount(text[i]);

                try
                {
                    var n = parseFloat(t);
                } catch (ex) { };

                if (n && !isNaN(n))
                {
                    if (request.curr == 'usd')
                    {
                        if (usdRate && !isNaN(usdRate))
                        {
                            t = '$' + numberToString(n / usdRate);
                        }
                    }
                    else if (request.curr == 'eur')
                    {
                        if (eurRate && !isNaN(eurRate))
                        {
                            t = '€' + numberToString(n / eurRate);
                        }
                    }
                    else if (request.curr == 'rub')
                    {
                        if (rubRate && !isNaN(rubRate))
                        {
                            t = '₽' + numberToString(n / rubRate);
                        }
                    }
                }

                res.push(t);
            }

            sendResponse({ text: res });

        }
        else if (request.type == 'rates')
        {
            sendResponse({
                usdRate: usdRate,
                eurRate: eurRate,
                rubRate: rubRate,
                byr: byr,
                usd: usd,
                eur: eur,
                rub: rub
            });
        }
    });





    function take()
    {
        var d = new Date();

        $.ajax('http://www.nbrb.by/Services/XmlExRates.aspx?ondate=' + (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear())
            .always(function (data)
            {
                var $data = $(data);

                usdRate = +$(data).find('Currency[Id=145] Rate').text();
                eurRate = +$(data).find('Currency[Id=19] Rate').text();
                rubRate = +$(data).find('Currency[Id=190] Rate').text();

                chrome.storage.sync.set({
                    usdRate: usdRate,
                    eurRate: eurRate,
                    rubRate: rubRate
                }, function ()
                {
                });
            });
    }

    function normalizeAmount(text)
    {
        var result = text.split(/[\s.,]*/).join('');

        return result;
    }

    take();
    setInterval(take, 10 * 60 * 1000);

})();