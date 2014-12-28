/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var rootUrl = 'http://8b38ee8.ngrok.com'; 
var app = {
  // Application Constructor
  initialize: function() {
    this.bindEvents();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicity call 'app.receivedEvent(...);'
  onDeviceReady: function() {
    app.receivedEvent('deviceready');
  },
  // Update DOM on a Received Event
  receivedEvent: function(id) {
    var parentElement = document.getElementById(id);
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');

    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');

    console.log('Received Event: ' + id);

    // start to initialize PayPalMobile library
    app.initPaymentUI();
  },
  initPaymentUI: function() {
    var clientIDs = {
      "PayPalEnvironmentProduction": "AaHStRCheAnmoCT2nhk7HUreN70_ERBvO-75hQzmG_MLI98ISEX9iWFmGLzh",
      "PayPalEnvironmentSandbox": "AaHStRCheAnmoCT2nhk7HUreN70_ERBvO-75hQzmG_MLI98ISEX9iWFmGLzh"
    };
    PayPalMobile.init(clientIDs, app.onPayPalMobileInit);

  },
  onSuccesfulPayment: function(payment) {
    console.log("payment success: " + JSON.stringify(payment, null, 4));
    $j.ajax({
           url: rootUrl + '/api/v1/payment/1/?username=admin&api_key=53bf26edd8fc0252db480c746cfe995e1facb928',
           type: 'PUT',
           data: JSON.stringify(payment, null, 4),
           dataType: 'json',
           contentType: 'application/json',
            success: function(data) {
                 console.log(data);
            }
         });
  },
  onAuthorizationCallback: function(authorization) {
    console.log("authorization: " + JSON.stringify(authorization, null, 4));
    // $j.ajax({
    //        url: rootUrl + '/api/v1/payment/1/',
    //        type: 'PUT',
    //        data: authorization,
    //        dataType: 'json',
    //        contentType: 'application/json',
    //         success: function(data) {
    //              console.log(data);
    //         }
    //      });

    $j.ajax({
           url: rootUrl + '/api/v1/payment/1/approval/?username=admin&api_key=53bf26edd8fc0252db480c746cfe995e1facb928',
           type: 'POST',
           data: JSON.stringify(authorization, null, 4),
           dataType: 'json',
           contentType: 'application/json',
            success: function(data) {
                 console.log(data);
            }
         });

  },
  createPayment: function() {
    // for simplicity use predefined amount
    var paymentDetails = new PayPalPaymentDetails("100.00", "0.00", "0.00");
    var payment = new PayPalPayment("100.00", "USD", "Plata Order ID 2", "Authorize",
      paymentDetails);
    return payment;
  },
  configuration: function() {
    // for more options see `paypal-mobile-js-helper.js`
    var config = new PayPalConfiguration({
      merchantName: "My Plata shop",
      merchantPrivacyPolicyURL: "http://localhost:8000/policy",
      merchantUserAgreementURL: "http://localhost:8000/agreement"
    });
    return config;
  },
  onPrepareRender: function() {
    var buyNowBtn = document.getElementById("buyNowBtn");
    var buyInFutureBtn = document.getElementById("buyInFutureBtn");

    buyNowBtn.onclick = function(e) {
      // single payment
      PayPalMobile.renderSinglePaymentUI(app.createPayment(), app.onSuccesfulPayment,
        app.onUserCanceled);
    };

    buyInFutureBtn.onclick = function(e) {
      // future payment
      PayPalMobile.renderFuturePaymentUI(app.onAuthorizationCallback, app
        .onUserCanceled);
    };

  },
  onPayPalMobileInit: function() {
    // must be called
    // use PayPalEnvironmentNoNetwork mode to get look and feel of the flow
    PayPalMobile.prepareToRender("PayPalEnvironmentSandbox", app.configuration(),
      app.onPrepareRender);
  },
  onUserCanceled: function(result) {
    console.log(result);
  }
};

app.initialize();