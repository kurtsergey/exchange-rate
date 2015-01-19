function save_options()
{
    chrome.storage.sync.set({
        notification: document.getElementById('notification').checked,
        alert: document.getElementById('alert').checked,
        defaultCurrency: document.getElementById('defaultCurrency').value
    }, function ()
    {
        var status = document.getElementById('status');
        status.textContent = 'Настройки сохранены';
        setTimeout(function ()
        {
            status.textContent = '';
        }, 1000);
    });
}

function restore_options()
{
    chrome.storage.sync.get({
        notification: true,
        alert: false,
        defaultCurrency: 'usd'
    }, function (items)
    {
        document.getElementById('notification').checked = items.notification;
        document.getElementById('alert').checked = items.alert;
        document.getElementById('defaultCurrency').value = items.defaultCurrency;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
