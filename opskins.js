"use-strict";

const fetch = require('node-fetch')

module.exports = class Opskins{
    constructor(apiKey){
        this.apiKey = apiKey;
        this.authHash = Buffer.from(apiKey + ":", "ascii").toString("base64");
    }

    getBalance(){
        return fetch('https://api.opskins.com/IUser/GetBalance/v1/', { headers: this.getHeaders() })
            .then(res => res.json())
            .then(body => {
                 return body.balance;
            });
    }

    getCryptoCurrencies() {
        return fetch('https://api.opskins.com/ICrypto/GetCurrencies/v1/', { headers: this.getHeaders() })
            .then(res => res.json())
            .then(body => {
                return body.response.currencies;
            });
    }

    getInventory() {
        return fetch('https://api.opskins.com/IInventory/GetInventory/v2/', { headers: this.getHeaders() })
            .then(res => res.json())
            .then(body => {
                return body.response;
            });
    }

    /*
    appid STRING default value = '730_2' CS:GO 
    itemName optional STRING
    tradeLock optional INT can be only a value 0 or 1
    */
    search(appId = '730_2', itemName, tradeLock){
        let url = 'https://api.opskins.com/ISales/Search/v2/?app=' + appId + '&search_item=' + encodeURIComponent(itemName) + '&trade_locked=' + tradeLock;
        return fetch(url, { headers: this.getHeaders() })
            .then(res => res.json())
            .then(body => {
                return body.response.sales;
            });
    }

    /* 
    Buy items
    */
    buyItems(saleIds, totalPrice) {
        return fetch('https://api.opskins.com/ISales/BuyItems/v1/', {
            method: 'POST', headers: this.getHeaders(), 
                body: JSON.stringify({
                    'saleids': saleIds,
                    'total': totalPrice
                })
            })
            .then(res => res.json())
            .then(body => {
                console.log(body);
                return body.response;
            });

    }

    /* 
    withdraw
    */
    withdraw(itemsIds, userSteamId, userToken, userMessage ) {
        return fetch('https://api.opskins.com/IInventory/Withdraw/v1/', {
            method: 'POST', headers: this.getHeaders(),
            body: JSON.stringify({
                'items': itemsIds,
                'delivery_id64': userSteamId,
                'delivery_token': userToken,
                'delivery_message': userMessage,
            })
        })
            .then(res => res.json())
            .then(body => {
                console.log(body);
                return body;
            });
    }

    

    // binding headers for fetch, require authHash parameter
    getHeaders(){
        return {
            'authorization': 'Basic ' + this.authHash,
            'content-type': 'application/json; charset=utf-8'
        }
    }
}
