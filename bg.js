
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
        t = request.text.split(/\s*/).join('');

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
        t = request.text.split(/\s*/).join('');

        try
        {
            i = parseFloat(t);
        } catch (ex) { };

        if (i && !isNaN(i))
        {
            var title;

            if (request.curr == 'usd')
            {
                if (usdRate && !isNaN(usdRate))
                {
                    usd = i / usdRate;
                }
                title = '$' + numberToString(usd);
            }
            else if (request.curr == 'eur')
            {
                if (eurRate && !isNaN(eurRate))
                {
                    eur = i / eurRate;
                }
                title = '€' + numberToString(eur);
            }
            else if (request.curr == 'rub')
            {
                if (rubRate && !isNaN(rubRate))
                {
                    rub = i / rubRate;
                }
                title = '₽' + numberToString(rub);
            }

            sendResponse({ text: title });

        }
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
    $.ajax('http://www.nbrb.by/').always(function (data)
    {
        var $data = $(data);
        var $table = $data.find('.content .tmainnn');

        var td = $table.find('td:contains("USD")').next().next();
        usdRate = +(td.text().split(/\s*/).join('').replace(',', '.'));

        td = $table.find('td:contains("EUR")').next().next();
        eurRate = +(td.text().split(/\s*/).join('').replace(',', '.'));

        td = $table.find('td:contains("RUB")').next().next();
        rubRate = +(td.text().split(/\s*/).join('').replace(',', '.'));

        chrome.storage.sync.set({
            usdRate: usdRate,
            eurRate: eurRate,
            rubRate: rubRate
        }, function ()
        {
        });
    });
}

take();
setInterval(take, 5 * 60 * 1000);

