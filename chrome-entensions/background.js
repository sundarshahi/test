// 'use strict'

// chrome.tabs.onActivated.addListener(function(){
//     micDetect();
// });
// chrome.tabs.onUpdated.addListener(function(){
//     micDetect();
// });

var deviceready = 0;
//Divyanshu defined variables....
var twilioDevice;
var newTwilioDevice = 0;
var twilioToken = "";
var outAudioDevices = [];
var token;
var balance;
var checkcallstatus;
var lastselectedInputDevice;

//...Divyanshu Defined variables end.

var jcbackcookie = "";
var currcon;
var calltimer;
var mutestate = 0; //Mute variable

var outcall_conn;

//Hold variable
var hold_status = 0;
var hold_status_check = 0;
var holdcount = 0;
var callto_hold;
var callfrom_hold;
var hold_sid;

//Merge Call
var merge_conference_name;
var merge_status = 0;
var merge_inprogress = 0; //Used in disconnect call
var merge_added = 0;
var merge_member;

//Secure Line
var secure_status = 0;
var secure_conference_name;

var chrome_ringtone = 0;

var answer_senddigits = 0;

var disablednotes = 0;

var opendesktopapp = 0;

var anyerror = true;

var previoustabid = "";

var previouswindowid = "";

var busy_callsid;
var outcallsid;
var calltype = 0;

var getlive_xhr;
var warningTimer;
var callErrorLogs = [];
var callErrorIndex = -1;
var codec = 0; // opus

var eventsource3;

var div_data = {
  user: {
    name: "",
    email: "",
    hash: null,
    save_notes: 1,
    availability: 0,
    user_availability_obj: null,
    user_availability_obj_disable: 0,
  },

  recent: {
    calls: null,
  },

  isLoggedIn: false,
  iconChangingInterval: null,
  timerCalculatingInterval: null,

  call: {
    status: 0, // call.status: 0- standby, 1- ringing, 2- inprogress, 3- completed
    connection: null,
    queuecall: 0,
    dispositions: null,
    disposition_selected: "",
    secured: 0,
    record: 0,
    notes: 0,
    notes_text: "",
    from: "",
    to: "",
    to_custom_name: "",
    callerName: "",
    timer: "",
    // states
    mute: 0,
    keypad: 0,
    keypad_digits_display: "",
    hold: 0,
    transfer_sc: 0, // on transfer contact list
    transfer_input: "",
    transfer_data: null, // transfer data -
    talk_to_agent_sc: 0, // talk_to_agent_sc started
    tta_call: {
      // talk to agent status
      status: 0, // 0 - initiated, 1- ringing, 2- inprogress, 3- completed
      merged: 0, // 0 - not_merged, 1- merged, 2- failed // The talk to agent call was finally merged or not
      error: 0, // talk-to-agent api failed and the caller could not get connected
      error_msg: "",
      connection: null,
    },

    crm: {
      name: "",
      url: "",
      data: null,
    },
  },

  reset_call: {
    status: 0,
    connection: null,
    queuecall: 0,
    dispositions: null,
    disposition_selected: "",
    secured: 0,
    record: 0,
    notes: 0,
    notes_text: "",
    from: "",
    to: "",
    to_custom_name: "",
    callerName: "",
    timer: "",
    // states
    mute: 0,
    keypad: 0,
    keypad_digits_display: "",
    hold: 0,
    transfer_sc: 0,
    transfer_input: "",
    transfer_data: null,
    talk_to_agent_sc: 0,
    tta_call: {
      status: 0, // 0 - initiated, 1- ringing, 2- inprogress, 3- completed
      merged: 0, // 0 - not_merged, 1- merged, 2-failed. // The talk to agent call was finally merged or not
      error: 0, // talk-to-agent api failed and the caller could not get connected
      error_msg: "",
      connection: null,
    },
    crm: {
      name: "",
      url: "",
      data: null,
    },
    // call.status: 0- standby, 1- ringing, 2- inprogress, 3- completed
  },
};

var salesforce_addon = "false";

/* PLEASE DO NOT DELETE-------------------------------------

  if talk_to_agent_sc == 1 and {
    if status < 3 { 
      if(merged == 1){
        show MainScreen
      } else {
        means that the call was connected with the agent and the conversation is on
        // show the tta_screen
      }
    } else {
      // return to the main call screen
      // Disable the transfer button.

      if(merged == 1){
        // agent merged into the initial call, but now disconnected as the call completed
        // success message that the transferred agent is connected to the call.
      } else merged == 0{
        if(error == 1 && error_msg != ""){
          // some error occured in the api's 
          // display the error message
        } else {
          // successfully talked to the agent
        }
        // block the transfer btn
      }
    }
  } else {
    // enable the transfer button
  }

  PLEASE DO NOT DELETE-------------------------------------
*/

// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//     // insertDictionaryScript();

//     // console.log("tab updated with URL", tab);

//     // chrome.tabs.executeScript({
//     //   file: 'content.js'
//     // });
// });

// chrome.permissions.contains({
//         origins: ['*://*/*']
//       }, function(result) {
//         if (result) {
//           console.log("// The extension has the permissions.");
//            // chrome.tabs.executeScript({
//            //    file: 'jquery1.11.2.min.js'
//            //  });

//            //  chrome.tabs.executeScript({
//            //    file: 'select2.min.js'
//            //  });

//            //   chrome.tabs.executeScript({
//            //    file: 'gritter.js'
//            //  });

//            // chrome.tabs.executeScript({
//            //    file: 'content.js'
//            //  });
//         } else {
//           console.log("The extension doesn't have the permissions.");
//         }
//   });

chrome.tabs.onUpdated.addListener(function (tab, changeinfo, tbe) {
  var origins = [];
  chrome.permissions.getAll(function (permissionobj) {
    origins = permissionobj.origins;
    console.log(origins);
  });

  if (
    tbe.url !== undefined &&
    (tbe.url.indexOf("one.zoho.com") >= 0 ||
      tbe.url.indexOf("one.zoho.in") >= 0 ||
      tbe.url.indexOf("one.zoho.com.au") >= 0 ||
      tbe.url.indexOf("one.zoho.eu") >= 0)
  ) {
    chrome.tabs.executeScript({
      file: "jquery1.11.2.min.js",
      allFrames: true,
    });

    chrome.tabs.executeScript({
      file: "select2.min.js",
      allFrames: true,
    });

    chrome.tabs.executeScript({
      file: "gritter.js",
      allFrames: true,
    });

    chrome.tabs.executeScript({
      file: "content.js",
      allFrames: true,
    });
  }

  chrome.permissions.contains(
    {
      origins: ["*://*/*"],
    },
    function (result) {
      if (
        result &&
        tbe.url !== undefined &&
        (tbe.url.indexOf("app.leadsimple.com") > -1 ||
          tbe.url.indexOf("salesmate.io") > -1 ||
          tbe.url.indexOf("copper.com") > -1 ||
          tbe.url.indexOf("zoho.recruit.in") > -1 ||
          tbe.url.indexOf("pipelinecrm") > -1 ||
          tbe.url.indexOf("quickbase.com") > -1 ||
          tbe.url.indexOf("planetaltig.com") > -1 ||
          tbe.url.indexOf("testing-vaclaimsinsider-web.azurewebsites.net") >
            -1 ||
          tbe.url.indexOf("insider.vaclaimsinsider.com") > -1 ||
          tbe.url.indexOf("qa-vaclaimsinsider-web.azurewebsites.net") > -1 ||
          tbe.url.indexOf("crm.simple.trade") > -1 ||
          tbe.url.indexOf("app-eu1.hubspot.com") > -1 ||
          tbe.url.indexOf("salesloft.com") > -1 ||
          tbe.url.indexOf("gohighlevel.com") > -1 ||
          tbe.url.indexOf("wolfpackadvising.com") > -1 ||
          tbe.url.indexOf("freshworks") > -1 ||
          tbe.url.indexOf("sugarcrm.com") > -1 ||
          tbe.url.indexOf("leadsquared.com") > -1 ||
          tbe.url.indexOf("595marketing.com") > -1 ||
          tbe.url.indexOf("bloobirds.com") > -1 ||
          tbe.url.indexOf("jobadder.com") > -1 ||
          tbe.url.indexOf("axela-tech.com") > -1 ||
          tbe.url.indexOf("crm.osteostrongriverside.com") > -1 ||
          tbe.url.indexOf("crm.osteostronglakemary.com") > -1 ||
          tbe.url.indexOf("crm.followupasaservice.com") > -1 ||
          tbe.url.indexOf("crm.osteostrongatx.com") > -1 ||
          tbe.url.indexOf("crm.osteostrongboulder.com") > -1 ||
          tbe.url.indexOf("crm.otbtax.com") > -1 ||
          tbe.url.indexOf("gorgias.com") > -1 ||
          tbe.url.indexOf("teamwave.com") > -1 ||
          tbe.url.indexOf("nocrm.io") > -1)
      ) {
        // The extension has the permissions.
        chrome.tabs.executeScript({
          file: "jquery1.11.2.min.js",
          allFrames: true,
        });

        chrome.tabs.executeScript({
          file: "select2.min.js",
          allFrames: true,
        });

        chrome.tabs.executeScript({
          file: "gritter.js",
          allFrames: true,
        });

        chrome.tabs.executeScript({
          file: "content.js",
          allFrames: true,
        });
      } else {
        if (
          tbe.url !== undefined &&
          (tbe.url.indexOf("app.leadsimple.com") > -1 ||
            tbe.url.indexOf("salesmate.io") > -1 ||
            tbe.url.indexOf("copper.com") > -1 ||
            tbe.url.indexOf("zoho.recruit.in") > -1 ||
            tbe.url.indexOf("pipelinecrm") > -1 ||
            tbe.url.indexOf("quickbase.com") > -1 ||
            tbe.url.indexOf("planetaltig.com") > -1 ||
            tbe.url.indexOf("testing-vaclaimsinsider-web.azurewebsites.net") >
              -1 ||
            tbe.url.indexOf("insider.vaclaimsinsider.com") > -1 ||
            tbe.url.indexOf("qa-vaclaimsinsider-web.azurewebsites.net") > -1 ||
            tbe.url.indexOf("crm.simple.trade") > -1 ||
            tbe.url.indexOf("app-eu1.hubspot.com") > -1 ||
            tbe.url.indexOf("salesloft.com") > -1 ||
            tbe.url.indexOf("gohighlevel.com") > -1 ||
            tbe.url.indexOf("wolfpackadvising.com") > -1 ||
            tbe.url.indexOf("freshworks") > -1 ||
            tbe.url.indexOf("sugarcrm.com") > -1 ||
            tbe.url.indexOf("leadsquared.com") > -1 ||
            tbe.url.indexOf("595marketing.com") > -1 ||
            tbe.url.indexOf("bloobirds.com") > -1 ||
            tbe.url.indexOf("jobadder.com") > -1 ||
            tbe.url.indexOf("axela-tech.com") > -1 ||
            tbe.url.indexOf("crm.osteostrongriverside.com") > -1 ||
            tbe.url.indexOf("crm.osteostronglakemary.com") > -1 ||
            tbe.url.indexOf("crm.followupasaservice.com") > -1 ||
            tbe.url.indexOf("crm.osteostrongatx.com") > -1 ||
            tbe.url.indexOf("crm.osteostrongboulder.com") > -1 ||
            tbe.url.indexOf("crm.otbtax.com") > -1 ||
            tbe.url.indexOf("gorgias.com") > -1 ||
            tbe.url.indexOf("teamwave.com") > -1 ||
            tbe.url.indexOf("nocrm.io") > -1)
        ) {
          chrome.tabs.executeScript({
            file: "jquery1.11.2.min.js",
            allFrames: true,
          });

          chrome.tabs.executeScript({
            file: "select2.min.js",
            allFrames: true,
          });

          chrome.tabs.executeScript({
            file: "gritter.js",
            allFrames: true,
          });

          chrome.tabs.executeScript({
            file: "content.js",
            allFrames: true,
          });
        }
      }
    }
  );
});

function merge_complete(status) {
  if (status == "success") {
    div_data.call.tta_call.merged = 1;
    div_data.call.tta_call.error_msg =
      div_data.call.transfer_data.display_name +
      " is now connected to the call";
    merge_added = 1;
  } else {
    div_data.call.tta_call.status = 3;
  }

  $.ajax({
    type: "POST",
    url: "https://callingservice.justcall.io/mobile/calling/merge/step3_merge_test.php",
    data: {
      callsid: div_data.call.tta_call.connection.parameters.CallSid,
      conferencename: div_data.call.connection.parameters.CallSid,
      status: status,
    },
    success: function (res) {
      merge_status = 0;
      stopindicatingIncomingCallPopupWindow(2);
    },
  });
}

function initiate_call_talk_to_agent_step2(res) {
  // disconnect current connection
  twilioDevice.disconnectAll();

  $.ajax({
    type: "POST",
    url: "https://justcall.io/calling/generatetokenext.php",
    data: {
      hash: div_data.user.hash,
    },
    success: function (response) {
      checkcallstatus = 1;
      response = JSON.parse(response);

      var balance = response.balance;
      var randshit = response.random;

      if (res.t_type == "Member") {
        var params = {
          PhoneNumber: res.t_hash,
          From:
            "+" +
            res.jc_number +
            "^" +
            div_data.user.hash +
            "^" +
            randshit +
            "^" +
            balance +
            "^2001" +
            "^2^" +
            div_data.call.connection.parameters.CallSid,
        };
      } else if (res.t_type == "Number" || res.t_type == "Contact") {
        var params = {
          PhoneNumber: res.t_number,
          From:
            "+" +
            res.jc_number +
            "^" +
            div_data.user.hash +
            "^" +
            randshit +
            "^" +
            balance +
            "^2001" +
            "^2^" +
            div_data.call.connection.parameters.CallSid,
        };
      } else if (res.t_type == "Team") {
        var params = {
          PhoneNumber: res.t_hash,
          From:
            "+" +
            res.jc_number +
            "^" +
            div_data.user.hash +
            "^" +
            randshit +
            "^" +
            balance +
            "^2001" +
            "^2^" +
            div_data.call.connection.parameters.CallSid +
            "^Team",
        };
      }

      merge_inprogress = 1;
      div_data.call.tta_call.status = 1;
      stopindicatingIncomingCallPopupWindow(2);

      // no need to tell the Popup window
      twilioDevice.connect(params);
    },
  });
}

function initiate_call_talk_to_agent(res) {
  div_data.call.talk_to_agent_sc = 1;
  merge_status = 1;
  stopindicatingIncomingCallPopupWindow(2);

  $.ajax({
    type: "POST",
    url: "https://callingservice.justcall.io/mobile/calling/merge/inc_step1_initiate.php",
    data: {
      callsid: div_data.call.connection.parameters.CallSid,
      jcnumber: res.jc_number,
      mem_hash: res.t_hash,
    },
    success: function (response) {
      var response = JSON.parse(response);
      if (response[0] == "success") {
        setTimeout(function () {
          initiate_call_talk_to_agent_step2(res);
        }, 4000);
      } else {
        // COME BACK LATER
        // Initial call queue me connect nhi hui I guess
        // Can complete the call or return to the first call
        // restrict to transfer again
        transferFailed(1, "Unable to connect " + res.t_name + " to the call");
      }
    },

    error: function (err) {
      // call queue m nhi gyi h
      if (err.status == 400) {
        // merge wali screen waps band krdo with an alert or warning taht call has not been merged
        // also a message that person is not available for call at the moment and turn the transfer again restricted
        transferFailed(1, res.t_name + " is unavailable at the moment");
      }
    },
  });
}

function transferFailed(error, msg) {
  div_data.call.tta_call.status = 3;
  div_data.call.tta_call.error = error;
  div_data.call.tta_call.error_msg = msg;
  div_data.call.transfer_sc = 0;
  div_data.call.mute = 0;
  div_data.call.transfer_input = "";
  stopindicatingIncomingCallPopupWindow(2);
}

function resetDataObject() {
  try {
    clearInterval(div_data.iconChangingInterval);
  } catch (e) {}

  try {
    clearInterval(div_data.timerCalculatingInterval);
  } catch (e) {}

  div_data.iconChangingInterval = null;
  div_data.timerCalculatingInterval = null;

  var resetCallObj = { ...div_data.reset_call };
  var resetTTACallObj = { ...div_data.reset_call.tta_call };
  resetCallObj.tta_call = resetTTACallObj;

  div_data.call = resetCallObj;
}

function getUserData(sendMessage, rpl) {
  var hash = div_data.user.hash;
  console.log("GetUserData Called", hash);
  $.ajax({
    type: "POST",
    url: "https://justcall.io/api/get_recent_data_ext.php",
    data: { hash: hash },
    success: function (result) {
      var res = JSON.parse(result);
      if (res.status == "success") {
        div_data.isLoggedIn = true;

        if (res.name && res.name.trim() != "") {
          div_data.user.name = res.name;
        }

        if (res.user_email && res.user_email.trim() != "") {
          div_data.user.email = res.user_email;
        }

        if (res.user_availability >= 0) {
          div_data.user.availability = res.user_availability;
        }

        if (res.hasOwnProperty("user_availability_obj_disable")) {
          div_data.user.user_availability_obj_disable =
            res.user_availability_obj_disable;
        }

        if (res.hasOwnProperty("user_availability_obj")) {
          div_data.user.user_availability_obj = res.user_availability_obj;
        }

        if (res.call) {
          div_data.recent.calls = res.call;
        } else {
          div_data.recent.calls = [];
        }

        console.log("GetUserData Called", sendMessage, res);

        if (sendMessage == 1) {
          rpl.response = res.call;
          chrome.runtime.sendMessage(rpl);

          rpl.cmd = "user-data-rpl";
          rpl.response = div_data.user;
          chrome.runtime.sendMessage(rpl);
        }
      } else {
        if (res.hasOwnProperty("code") && res.code == "401") {
          div_data.isLoggedIn = false;
        }
      }
    },
  });
}

function reflectAcceptedCallInPopup() {
  div_data.call.timer = 0;
  div_data.call.status = 2;

  div_data.timerCalculatingInterval = setInterval(function () {
    div_data.call.timer++;
  }, 1000);

  var rpl = {
    cmd: "call-in-progress-rpl",
    response: div_data.call,
    src: "background",
  };
  chrome.runtime.sendMessage(rpl);
}

function notesSkipped() {
  // resetCallData
  resetDataObject();
  // call function to close call popup from all tabs
}

function notesSave(res) {
  $.ajax({
    type: "POST",
    url: "https://justcall.io/api/save_incomingnotes.php",
    data: {
      callsid: div_data.call.connection.parameters.CallSid,
      notes: div_data.call.notes_text,
      hash: div_data.user.hash,
      disposition_code: res.disposition_code,
      chr_ext: 1,
    },
    success: function (res) {
      notesSkipped();
    },
  });
}

function initiate_call_transfer(res) {
  $.ajax({
    type: "POST",
    url: "https://callingservice.justcall.io/mobile/calling/inc_initiate_transferv1_notes.php",
    data: {
      callsid: res.t_callsid,
      clientnumber: res.t_number,
      memberhash: res.t_hash,
      type: res.t_type,
      hash: div_data.user.hash,
      jcnumber: res.jc_number,
    },
    success: function (res) {
      stopindicatingIncomingCallPopupWindow(3);
    },
  });
}

function tta_disconnect_clicked() {
  merge_complete("fail");
}

function tta_merge_clicked() {
  merge_complete("success");
}

function record_toggle_clicked() {
  $.ajax({
    type: "POST",
    url: "https://callingservice.justcall.io/mobile/calling/recording_toggle.php",
    data: {
      callsid: div_data.call.connection.parameters.CallSid,
      calltype: 1,
    },
    success: function (res) {
      console.log(res);
      // $(elem).removeClass('disabled');
      // number_screen();
      res = JSON.parse(res);
      if (res.status == "success") {
        div_data.call.record = res.recording_status;
      } else {
        div_data.call.record = 0;
      }

      stopindicatingIncomingCallPopupWindow(2);
    },
  });
}

function opendialerpopupbackground() {
  // console.log("open dialer background");
  if (previouswindowid != "") {
    try {
      chrome.windows.get(previouswindowid, function (tab) {
        if (tab) {
          chrome.windows.update(
            previouswindowid,
            { focused: true, drawAttention: true },
            function (tab) {}
          );
        } else {
          openDialerPopupButton({ number: "", sms: 0 });
        }

        return;

        if (chrome.runtime.lastError) {
          // console.log(chrome.runtime.lastError.message);
          openDialerPopupButton({ number: "", sms: 0 });
          return;
        }
        if (!tab) {
          if (anyerror) {
            // if open dialer clicked on a page except CRM and justcall

            openDialerPopupButton({ number: "", sms: 0 });
          } else {
            chrome.tabs.query(
              { active: true, currentWindow: true },
              function (tabs) {
                var activeTab = tabs[0];
                if (activeTab && activeTab.hasOwnProperty("id")) {
                  console.log("andar aaya h");
                  chrome.tabs.sendMessage(activeTab.id, {
                    message: "clicked_browser_action",
                  });
                  ////////////
                } else {
                  openDialerPopupButton({ number: "", sms: 0 });
                }
              }
            );
          }
        } else {
          chrome.windows.update(
            previouswindowid,
            { focused: true, drawAttention: true },
            function (tab) {}
          );
        }
      });
    } catch (e) {
      console.log("catch kr liya");
    }
  } else {
    // console.log("should be here");
    if (anyerror) {
      openDialerPopupButton({ number: "", sms: 0 });
    } else {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0];
        console.log(activeTab);
        if (activeTab && activeTab.hasOwnProperty("id")) {
          console.log("Active Tab ka object");
          console.log(activeTab);
          if (activeTab.hasOwnProperty("openerTabId")) {
            chrome.tabs.sendMessage(activeTab.id, {
              message: "clicked_browser_action",
            });
          } else {
            openDialerPopupButton({ number: "", sms: 0 });
          }
        } else {
          openDialerPopupButton({ number: "", sms: 0 });
        }
      });
    }
  }
}

function switchAvailability(avail_status) {
  $.ajax({
    type: "POST",
    url: "https://justcall.io/api/toggleuseravailability_div.php",
    data: {
      hash: div_data.user.hash,
      availability: avail_status,
      source: "6",
      page_source: "extension",
    },
    success: function (res) {
      var response = JSON.parse(res);
      if (response.status == 200) {
        var data = response["data"];
        curr_avail_status = data["status"];
        curr_working_hours = data["workinghours"];
        div_data.user.user_availability_obj = data;
        var rpl = {
          cmd: "user-data-rpl",
          response: div_data.user,
          src: "background",
        };
        chrome.runtime.sendMessage(rpl);
      }
    },
  });
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  try {
    if (msg.src !== "popup") {
      return;
    }

    console.log("Received command: " + msg.cmd);
    var rpl = { cmd: null, response: null, src: "background" };
    rpl.cmd = msg.cmd + "-rpl";

    if (msg.cmd === "active-data") {
      if (div_data.isLoggedIn == false) {
        rpl = { cmd: "is-logged-out-rpl", response: 1, src: "background" };
      } else {
        if (1) {
          // send user Data;
          chrome.runtime.sendMessage({
            cmd: "user-data-rpl",
            response: div_data.user,
            src: "background",
          });
        }

        if (div_data.call.status > 0) {
          if (div_data.call.status == 1) {
            //is ringing
            rpl = {
              cmd: "call-ringing-rpl",
              response: div_data.call,
              src: "background",
            };
          } else if (div_data.call.status == 2) {
            // in progress
            rpl = {
              cmd: "call-in-progress-rpl",
              response: div_data.call,
              src: "background",
            };
          } else if (div_data.call.status == 3) {
            // is completed....show notes or not. If show notes = 0 , call status = 0
            var callData = { ...div_data.call };
            callData["save_notes"] = div_data.user.save_notes;
            rpl = {
              cmd: "call-completed-rpl",
              response: callData,
              src: "background",
            };
          }
        }
      }
    } else if (msg.cmd === "recent-call-data") {
      getUserData(1, rpl);
      return;
    } else if (msg.cmd === "skip-notes") {
      notesSkipped();
      return;
    } else if (msg.cmd === "save-notes") {
      notesSave(msg.data);
      return;
    } else if (msg.cmd === "open-keypad") {
      // call-in-progress even will update the view
      var source = msg.source;
      if (source == "merge") {
        div_data.call.keypad = 2;
      } else {
        div_data.call.keypad = 1;
      }
      stopindicatingIncomingCallPopupWindow(2);
      return;
    } else if (msg.cmd === "close-keypad") {
      // call-in-progress even will update the view
      div_data.call.keypad = 0;
      stopindicatingIncomingCallPopupWindow(2);
      return;
    } else if (msg.cmd === "open-transfer") {
      div_data.call.transfer_sc = 1;
      stopindicatingIncomingCallPopupWindow(2);
      return;
    } else if (msg.cmd === "close-transfer") {
      div_data.call.transfer_sc = 0;
      div_data.call.transfer_input = "";
      stopindicatingIncomingCallPopupWindow(2);
      return;
    } else if (msg.cmd === "search-transfer") {
      div_data.call.transfer_input = msg.searchInput;
      stopindicatingIncomingCallPopupWindow(2);
      return;
    } else if (msg.cmd === "initiated-transfer") {
      div_data.call.transfer_data = msg.data;
      div_data.call.transfer_sc = 0;
      initiate_call_transfer(msg.data);
      return;
    } else if (msg.cmd === "initiated-talk-to-agent") {
      div_data.call.transfer_sc = 0;

      var displayName = msg.data.t_name.trim();
      if (msg.data.t_name.trim() == "") {
        displayName = msg.data.t_number;
      }

      msg.data.display_name = displayName;
      div_data.call.transfer_data = msg.data;

      initiate_call_talk_to_agent(msg.data);
      return;
    } else if (msg.cmd === "tta-disconnect") {
      tta_disconnect_clicked();
      return;
    } else if (msg.cmd === "tta-merge") {
      tta_merge_clicked();
      return;
    } else if (msg.cmd === "record-toggle") {
      record_toggle_clicked();
      return;
    } else if (msg.cmd === "notes-open") {
      div_data.call.notes = 1;
      stopindicatingIncomingCallPopupWindow(2);
      return;
    } else if (msg.cmd === "notes-close") {
      div_data.call.notes = 0;
      stopindicatingIncomingCallPopupWindow(2);
      return;
    } else if (msg.cmd === "notes-typing") {
      div_data.call.notes_text = msg.data;
      return;
    } else if (msg.cmd === "disposition_change") {
      div_data.call.disposition_selected = msg.data;
      return;
    } else if (msg.cmd === "open_dialer_popup") {
      opendialerpopupbackground();
      return;
    } else if (msg.cmd === "recent_call_c2c") {
      console.log("recent_call_c2c", msg.data);
      openDialerPopupButton(msg.data);
      return;
    } else if (msg.cmd === "availability_toggle") {
      console.log("availability_toggle", msg.data);
      switchAvailability(msg.data);
      return;
    }

    console.log(rpl);
    chrome.runtime.sendMessage(rpl);
  } catch (e) {
    console.error(e);
  }
});

function openDialerPopupButton(res) {
  var taburl = "";
  if (opendesktopapp == 1 || opendesktopapp == "1") {
    taburl = "justcall://" + res.number;
  } else {
    taburl = "https://justcall.io/dialer.php?numbers=" + res.number;
  }

  if (res.sms == 1) {
    taburl += "&sms=1";
  }

  if (previoustabid != "") {
    // Background page gives error on this line, previus tab id does not exist.
    chrome.tabs.get(previoustabid, function (tab) {
      if (!tab) {
        console.log("tab does not exist");
      } else {
        chrome.tabs.remove(previoustabid);
      }
    });
  }

  chrome.windows.getCurrent(function (win) {
    var width = 440;
    var height = 220;
    var left = screen.width / 2 - width / 2 + win.left;
    var top = screen.height / 2 - height / 2 + win.top;

    top = parseInt(top);
    left = parseInt(left);

    console.log("top : ", top);
    console.log("left : ", left);
    console.log("width : ", width);
    console.log("height : ", height);

    chrome.tabs.create({ url: taburl, active: true }, function (tab) {
      previoustabid = tab.id;
      console.log("here is current tab id ", previoustabid);

      if (opendesktopapp == 1 || opendesktopapp == "1") {
      } else {
        chrome.windows.create(
          {
            tabId: tab.id,
            type: "popup",
            focused: true,
            left: left,
            top: top,
            state: "normal",
            height: 665,
            width: 380,
            // incognito, top, left, ...
          },
          function (window) {
            previouswindowid = window.id;
          }
        );
      }
    });
  });
}

chrome.runtime.onInstalled.addListener(function (details) {
  // if(details.reason == "install"){
  //     //call a function to handle a first install
  // }else if(details.reason == "update"){
  //     //call a function to handle an update
  // }
  console.log("Chrome Extension installed");
  console.log(details);
  console.log("Chrome Extension installed ends");

  var reason = "installed";
  if (details.reason == "update") {
    reason = "updated";
  } else if (details.reason == "install") {
    reason = "installed";
  }
});

chrome.contextMenus.removeAll(function () {
  chrome.contextMenus.create({
    title: "Call %s via JustCall",
    contexts: ["selection"],
    onclick: function (info, tab) {
      openDialerPopupButton({ number: info.selectionText, sms: 0 });
    },
  });

  chrome.contextMenus.create({
    title: "Text %s via JustCall",
    contexts: ["selection"],
    onclick: function (info, tab) {
      openDialerPopupButton({ number: info.selectionText, sms: 1 });
    },
  });

  chrome.contextMenus.create({
    title: "Reload Extension",
    contexts: ["browser_action"],
    onclick: function (info, tab) {
      chrome.runtime.reload();
    },
  });

  // chrome.contextMenus.create({title: "Reload all Tabs",
  //   contexts : ['browser_action'],
  //   onclick: function(info, tab){
  //       reloadAllTabs();
  //   }
  // });
});

chrome.cookies.get(
  { url: "https://justcall.io", name: "audio_speaker_device" },
  function (cookie) {
    if (cookie != "" && cookie != null) {
      localStorage.setItem("audio-speaker-device", cookie.value);
    }
  }
);

chrome.cookies.get(
  { url: "https://justcall.io", name: "audio_ringtone_device" },
  function (cookie) {
    if (cookie != "" && cookie != null) {
      localStorage.setItem("audio-ringtone-device", cookie.value);
    }
  }
);

chrome.cookies.get(
  { url: "https://justcall.io", name: "audio_input_device" },
  function (cookie) {
    if (cookie != "" && cookie != null) {
      localStorage.setItem("audio-input-device", cookie.value);
    }
  }
);

function reloadAllTabs() {
  chrome.tabs.query({ currentWindow: true }, function (tabs) {
    console.log(tabs);
    tabs.forEach((tab) => {
      if (tab.url) {
        chrome.tabs.update(tab.id, { url: tab.url });
      }
    });
  });
}

function install_notice() {
  if (localStorage.getItem("install_time2")) return;

  var now = new Date().getTime();

  localStorage.setItem("install_time2", now);
  // chrome.tabs.create({url: "https://justcall.io"});
  chrome.tabs.create(
    { url: chrome.extension.getURL("/telephony.html") },
    function (tab) {
      console.debug("Telephony Tab details are - ", tab);
      // testoutboundcall();
    }
  );
}

// chrome.tabs.onUpdated.addListener(updateBadge);

// fires when active tab changes
chrome.tabs.onActivated.addListener(updateBadge);

function updateBadge() {
  // get active tab on current window
  chrome.tabs.query(
    { active: true, currentWindow: true },
    function (arrayOfTabs) {
      // the return value is an array
      var activeTab = arrayOfTabs[0];
      if (!activeTab) return;
      // compute number for badge for current tab's url

      var count = getCount(activeTab.url);

      if (count) {
        // chrome.browserAction.setBadgeText({
        //   text: count.toString()
        // });
      }
    }
  );
}

function checkforsimilarity(cookie) {
  // console.log("cookies got",cookie);
  // console.log("already saved cookie is",localStorage["cookiesaved"]);
  var cookiegot = cookie;
  var alreadysavedcookie = localStorage["cookiesaved"];
  if (cookiegot === alreadysavedcookie) {
    //do nothing
    div_data.user.hash = cookie;
    if (deviceready == 0) {
      jcbackcookie = cookie;
      console.log("device was not ready");
      freshTokenSetup(jcbackcookie);
    }
  } else {
    jcbackcookie = cookie;
    console.log("new logged in user found");
    div_data.user.hash = cookie;
    getUserData();
    freshTokenSetup(jcbackcookie);
  }
}

function getCount(currentUrl) {
  // your logic, e.g., return 42
  // alert(currentUrl);
}

function checkSalesForce() {
  $.ajax({
    type: "POST",
    url: "https://autodialer.justcall.io/api/check_salesforce_addon.php",
    data: {
      hash: jcbackcookie,
    },
    success: function (res) {
      res = JSON.parse(res);
      salesforce_addon = res.added;
      let message = {
        data: res.added,
        cmd: "salesforce_got_addon",
        src: "background",
      };
      chrome.tabs.query({}, function (tabs) {
        for (var i = 0; i < tabs.length; ++i) {
          chrome.tabs.sendMessage(tabs[i].id, message);
        }
      });
    },
  });
}

function requestcookie() {
  console.log("requestcookie");
  try {
    // adddlert("Welcome guest!");
    chrome.cookies.get(
      { url: "https://justcall.io", name: "login_sess" },
      function (cookie) {
        if (cookie != null) {
          console.log("logged in user hash ", cookie.value);
          jcbackcookie = cookie.value;
          div_data.user.hash = cookie.value;
          getUserData();
          freshTokenSetup(jcbackcookie);
          checkSalesForce();
        } else {
          // alert("do nothing");
          jcbackcookie = "";
          div_data.user.hash = "";
          localStorage.setItem("cookiesaved", "");
          deviceready = 0;
          twilioDevice.destroy();
        }
      }
    );
  } catch (err) {
    console.log("could not get cookie store");
    chrome.browserAction.setBadgeBackgroundColor({ color: "#E53935" });

    // chrome.browserAction.setBadgeText({tabId: tabId, text: text});
    chrome.browserAction.setBadgeText({
      text: "x",
    });
  }
}

function micDetect() {
  navigator.webkitGetUserMedia(
    { audio: true },
    function () {
      chrome.tabs.query({}, function (tabs) {
        var message = { micison: "yes" };
        for (var i = 0; i < tabs.length; ++i) {
          chrome.tabs.sendMessage(tabs[i].id, message);
        }
        chrome.browserAction.setIcon({
          path: "icon.png",
        });

        chrome.browserAction.setBadgeText({
          text: "",
        });

        chrome.runtime.sendMessage(message);

        anyerror = false;
      });
    },
    function (e) {
      chrome.tabs.query({}, function (tabs) {
        var message = { micison: "no" };
        for (var i = 0; i < tabs.length; ++i) {
          chrome.tabs.sendMessage(tabs[i].id, message);
        }
        chrome.browserAction.setIcon({
          path: "icon2.png",
        });

        chrome.browserAction.setBadgeBackgroundColor({ color: "#E53935" });

        // chrome.browserAction.setBadgeText({tabId: tabId, text: text});
        chrome.browserAction.setBadgeText({
          text: "!",
        });

        chrome.runtime.sendMessage(message);

        anyerror = true;
      });
    }
  );

  // chrome.runtime.sendMessage(message);
}

function checkNotificationPermission() {
  if (!("Notification" in window)) {
    console.error("notifications are not supported");
    return;
  }

  Notification.requestPermission(function (status) {
    if (Notification.permission !== status) {
      Notification.permission = status;
    }
    if (Notification.permission !== "granted")
      alert(
        "It would have been nice to enable the desktop notifications. It's much more comfortable. If you change your mind, go to your browser's setting to enable it back"
      );
  });
}

function isObject(o) {
  return o instanceof Object && o.constructor === Object;
}

function freshTokenSetup(cookie) {
  console.log("fresh token set");
  if (cookie != "") {
    localStorage.setItem("cookiesaved", cookie);
  }

  $.ajax({
    type: "POST",
    url: "",
  });

  $.ajax({
    type: "POST",
    url: "https://justcall.io/calling/generatetokenext_debug.php",
    data: {
      hash: cookie,
      isExtension: 1,
    },
    success: function (res2) {
      res2 = JSON.parse(res2);
      token = res2.token;
      twilioToken = token;
      balance = res2.balance;
      chrome_ringtone = res2.ringtone;
      answer_senddigits = res2.senddigit;
      if (res2.codex && (res2.codex == 0 || res2.codex == 1)) {
        codec = res2.codex;
      }

      disablednotes = res2.disablednotes;

      opendesktopapp = res2.opendesktopapp;
      console.log("logged in user is ", res2.fname, res2.lname);
      console.log("freshToken calling setup");
      setupincomingcall(cookie);
    },
    error: function () {
      localStorage.setItem("cookiesaved", "");
    },
  });
}

function setupincomingcall(cookie) {
  console.log("Setup incoming call with cookie: " + cookie);
  checkcallstatus = 0;
  hold_status = 0;
  hold_status_check = 0;
  holdcount = 0;

  if (cookie != "") {
    localStorage.setItem("cookiesaved", cookie);

    if (newTwilioDevice == 0) {
      twilioDevice = new Twilio.Device();
      setEvents();
      newTwilioDevice = 1;
    }

    if (twilioDevice) {
      // console.log('device found: '+twilioDevice);
    } else {
      twilioDevice = new Twilio.Device();
    }

    var codexpref = [];
    if (codec == 0) {
      codexpref = ["opus", "pcmu"];
    } else {
      codexpref = ["pcmu", "opus"];
    }

    twilioDevice.setup(twilioToken, {
      codecPreferences: codexpref,
      debug: true,
      closeProtection:
        "Any active connection or call will be terminated if you leave this page",
      audioConstraints: true,
    });

    //console.log("setup successful");
    install_notice();
    localStorage.setItem("disablednotes", disablednotes);
  }
}

function setEvents() {
  twilioDevice.on("ready", function (device) {
    if (chrome_ringtone == 1) {
      device.audio.incoming(1);
    } else {
      device.audio.incoming(0);
    }

    device.audio.outgoing(0);
    device.audio.disconnect(1);

    if (checkcallstatus == 1) {
      device.connect(params);
    }

    if (deviceready == 0) {
      deviceready = 1;
      updateAllDevices();
    }

    twilioDevice.audio.on("deviceChange", (device) => {
      var devicesArray = outAudioDevices;
      var selectedDevices = twilioDevice.audio.speakerDevices.get();
      var newdevicesArray = [];
      console.log("Devices changed");
      twilioDevice.audio.availableOutputDevices.forEach(function (device, id) {
        var isActive = selectedDevices.size === 0 && id === "default";

        selectedDevices.forEach(function (device) {
          if (device.deviceId === id) {
            isActive = true;
          }
        });

        var auddevice = { label: device.label, id: id, active: isActive };
        newdevicesArray.push(auddevice);
      });

      console.log(newdevicesArray);
      console.log(devicesArray);

      outAudioDevices = newdevicesArray;
      console.log("After");
      console.log(newdevicesArray);
      console.log(devicesArray);
      console.log("After ends");

      if (devicesArray.length > outAudioDevices.length) {
        console.log("devices > out");
        for (var a = 0; a < devicesArray.length; a++) {
          console.log(devicesArray[a].label);
          var selectedAudDevices = false;
          outAudioDevices.map((outDevice) => {
            console.log("outDevice");
            console.log(outDevice);
            console.log("outDevice log end");
            if (outDevice.label == devicesArray[a].label) {
              console.log("device matched");

              selectedAudDevices = true;
            }
          });

          if (!selectedAudDevices) {
            console.log(devicesArray[a].label);
            var message = {
              events: "device_changed",
              message: devicesArray[a].label + " removed.",
            };
            chrome.tabs.query({}, function (tabs) {
              console.log(message);
              for (var i = 0; i < tabs.length; ++i) {
                chrome.tabs.sendMessage(tabs[i].id, message);
              }
            });
          }
        }
      } else if (devicesArray.length < outAudioDevices.length) {
        console.log("devices < out");
        for (var a = 0; a < outAudioDevices.length; a++) {
          console.log(outAudioDevices[a].label);
          var selectedAudDevices = false;
          devicesArray.map((outDevice) => {
            console.log("outDevice");
            console.log(outDevice);
            console.log("outDevice log end");
            if (outDevice.label == outAudioDevices[a].label) {
              console.log("device matched");
              selectedAudDevices = true;
            }
          });

          if (!selectedAudDevices) {
            console.log(outAudioDevices[a].label);
            var message = {
              events: "device_changed",
              message: outAudioDevices[a].label + " connected.",
            };

            chrome.tabs.query({}, function (tabs) {
              console.log(message);
              for (var i = 0; i < tabs.length; ++i) {
                chrome.tabs.sendMessage(tabs[i].id, message);
              }
            });
          }
        }
      } else {
      }

      updateAllDevices();
    });
  });

  twilioDevice.on("connect", function (conn) {
    console.log("kya kabhi connect hua?");
    outcall_conn = conn;

    if (
      div_data.call.talk_to_agent_sc == 1 &&
      div_data.call.tta_call.status == 1
    ) {
      div_data.call.tta_call.connection = conn;
    } else {
      div_data.call.connection = conn;
    }
    outcall_conn.mute(false);
    mutestate = 0;

    console.log("connection extablished");
    outcallsid = conn.parameters.CallSid;

    if (merge_inprogress == 0) {
      busy_callsid = currcon.parameters.CallSid;
      update_busystatus(
        jcbackcookie,
        busy_callsid,
        "7055eced15538bfb7c07f8a5b28fc5d0",
        "Connect_event_ext"
      );
    }

    outcall_conn.on("warning", function (warningName) {
      var warning_msg = "";
      switch (warningName) {
        case "low-mos":
          warning_msg =
            "<b>LOW MOS:</b> MOS has fallen below 3, indicating a drop in call quality.";
          break;

        case "high-jitter":
          warning_msg =
            "<b>HIGH JITTER:</b> Jitter has exceeded 30 ms for 3 of the last 5 samples. High jitter correlates with poor network connection.";
          break;

        case "constant-audio-input-level":
          // $('#warning-alert-icon').hide();
          // $('#check_audio_btn').show();
          // $('#check_audio_btn').attr('onclick', "openSettingsAudio(1)");
          warning_msg =
            "<b>CONSTANT AUDIO INPUT LEVEL:</b> Audio input level has stayed constant for more than 10 seconds on an active, unmuted connection.";
          break;

        case "constant-audio-output-level":
          // $('#warning-alert-icon').hide();
          // $('#check_audio_btn').show();
          // $('#check_audio_btn').attr('onclick', "openSettingsAudio(2)");
          warning_msg =
            "<b>CONSTANT AUDIO OUTPUT LEVEL:</b> MOS has fallen below 3, indicating a drop in call quality.";
          break;

        case "high-packet-loss":
          warning_msg =
            "<b>HIGH PACKET LOSS:</b> Packet loss has exceeded 1% in 3 of last 5 samples. High packet loss correlates with poor network connection.";
          break;

        case "high-rtt":
          warning_msg =
            "<b>HIGH RTT:</b> Round-trip-time has exceeded 400 ms in 3 of last 5 samples. High RTT correlates with latency on a call.";
          break;

        case "ice-connectivity-lost":
          warning_msg =
            "<b>ICE CONNECTIVITY LOST:</b> Poor or Interrupted internet connectivity. We recommend you re-establish your internet connection and refresh the page.";
          break;
      }

      // show warning
    });

    outcall_conn.on("warning-cleared", function (warningName) {
      //clear warning
    });

    if (merge_inprogress == 1) {
      // merge wali call h
      console.log("Event source events on message initialise");
      eventsource3 = new EventSource(
        "https://justcall.io/api/sse_callstatus.php?callsid=" + outcallsid
      );
      eventsource3.onmessage = function (event) {
        console.log("Event " + event.data);
        if (event.data != "") {
          if (event.data == "In-progress") {
            // merge_inprogress_status = 1;
            div_data.call.tta_call.status = 2;
            stopindicatingIncomingCallPopupWindow(2);
          } else if (
            (event.data == "No-answer" || event.data == "busy") &&
            merge_inprogress == 1
          ) {
            merge_status = 0;
            merge_inprogress = 0;
            transferFailed(1, "Call to the agent went unanswered");
            stopindicatingIncomingCallPopupWindow(2);

            console.log("Merge call Ended with no-answer");
            // outcall_screen();
            // $('#mergediv').show();
            // $('#mergediv').html('<span class="label label-danger">'+merge_member+'is no longer connected on the call</span>')
            jc_merge_close("Member is no longer connected on the call");

            try {
              eventsource3.close();
            } catch (err) {}
          } else if (event.data == "completed" && merge_inprogress == 1) {
            merge_status = 0;
            merge_inprogress = 0;
            transferFailed(
              0,
              div_data.call.transfer_data.display_name +
                " is no longer connected with the call"
            );
            stopindicatingIncomingCallPopupWindow(2);

            console.log("Merge call Ended with completed");

            // outcall_screen();
            // $('#mergediv').show();
            // $('#mergediv').html('<span class="label label-danger">'+merge_member+'is no longer connected on the call</span>')
            jc_merge_close("Member is no longer connected on the call");
            try {
              eventsource3.close();
            } catch (err) {}
          }
        }
      };
    }
  });

  twilioDevice.on("cancel", function (conn) {
    chrome.notifications.clear("IncomingCall");

    console.log("hanging up call");
    console.log(conn);
    console.log(conn.status());
    mutestate = 0;
    hold_status = 0;
    hold_status_check = 0;
    // chrome.tabs.query({}, function(tabs) {
    //   var message = {"devicecancel": "devicecancel"};
    //   for (var i=0; i<tabs.length; ++i) {
    //     chrome.tabs.sendMessage(tabs[i].id, message);
    //   }
    // });

    stopindicatingIncomingCallPopupWindow(0);

    if (conn.status() != "closed") {
      // Div rollback
      // twiliohangup();
    }
  });

  twilioDevice.on("offline", function () {
    chrome.notifications.clear("IncomingCall");

    mutestate = 0;
    hold_status = 0;
    hold_status_check = 0;
    console.log("offline calling setup");
    setupincomingcall(jcbackcookie);
  });

  twilioDevice.on("error", function (error) {
    chrome.notifications.clear("IncomingCall");

    mutestate = 0;
    hold_status = 0;
    hold_status_check = 0;
    if (error.message == "JWT Token Expired") {
      freshTokenSetup(jcbackcookie);
    }

    console.log("error called");
  });

  twilioDevice.on("disconnect", function (conn) {
    chrome.notifications.clear("IncomingCall");

    try {
      eventsource3.close();
    } catch (err) {}

    if (twilioDevice.activeConnection() == undefined) {
      merge_inprogress = 0;
    }

    if (merge_inprogress == 1) {
      merge_inprogress = 0;

      if (div_data.call.tta_call.merged == 1) {
        console.log(
          "IInside disconnect and div_data.call.tta_call.merged == 1"
        );
        transferFailed(
          0,
          div_data.call.transfer_data.display_name +
            " is now connected with the call"
        );
      } else {
        transferFailed(
          1,
          div_data.call.transfer_data.display_name +
            " is no longer connected with the call"
        );
      }
      stopindicatingIncomingCallPopupWindow(2);
    } else if (hold_status == 0 && merge_status == 0) {
      update_busystatus(
        jcbackcookie,
        busy_callsid,
        "56018323b921dd2c5444f98fb45509de",
        "onDisconnect_event_ext"
      );
      console.log("hanging up call");
      mutestate = 0;

      saveAudioDevices();
      saveErrorlogs();

      stopindicatingIncomingCallPopupWindow(3);

      if (warningTimer) {
        clearInterval(warningTimer);
      }
      callErrorLogs = [];
      callErrorIndex = -1;
      mutestate = 0;
      hold_status = 0;
      hold_status_check = 0;
      secure_status = 0;
      merge_status = 0;
      twilioDevice.audio.unsetInputDevice().then(() => {
        console.log("Input devices unset successfully");
      });
      // chrome.tabs.query({}, function(tabs) {
      //   var message = {"twiliodisconnect": "twiliodisconnect"};
      //   for (var i=0; i<tabs.length; ++i) {
      //     chrome.tabs.sendMessage(tabs[i].id, message);
      //   }
      // });
    }
  });

  twilioDevice.on("incoming", function (conn) {
    resetDataObject();
    conn.status;
    currcon = conn;
    console.log("currcon value when this call arrived");
    console.log(currcon);
    // $("#callfrom").html(conn.parameters.From);
    // jQuery('#modal-incomingcall').modal('show', {backdrop: 'static'});
    callto_hold = conn.parameters.From;
    secure_status = 0;

    console.log("Incoming connection from " + conn.parameters.From);

    // chrome.tabs.query({}, function(tabs) {
    //   var message = {"incomingcall": conn.parameters};
    //   for (var i=0; i<tabs.length; ++i) {
    //     chrome.tabs.sendMessage(tabs[i].id, message);
    //   }
    // });

    div_data.call.connection = conn;

    // contactsourcenikalo(conn.parameters.From);
    var queuecall = conn.customParameters.get("queuecall");
    if (queuecall) {
      //newqueuelabel
      div_data.call.to = conn.parameters.From;
      div_data.call.queuecall = 1;
      var queueCallbackLabel = queuecall.substr(
        0,
        queuecall.indexOf("for") + 3
      );
      var queueCallbackNumber = queuecall.match(/[+]?\d+/g).join("");
      div_data.call.from = queueCallbackNumber;
      queueCallerLookup(queueCallbackLabel);
    } else {
      div_data.call.from = conn.parameters.From;
      div_data.call.queuecall = 0;
      callerlookupnikalo(conn.parameters.From);
      jcnumberlookup(conn.parameters.CallSid);
    }
    indicateIncomingCallPopupWindow(div_data.call);
    newcrmapi(conn.parameters.From);

    jc_gettransferlist_bck();
    jc_checksecure();
    jc_check_desposition();
  });
}

function stopindicatingIncomingCallPopupWindow(call_status) {
  console.log("stopindicatingIncomingCallPopupWindow", call_status);
  div_data.call.status = call_status;

  try {
    clearInterval(div_data.iconChangingInterval);
  } catch (err) {}

  if (call_status == 2) {
    // if progress call
    chrome.browserAction.setIcon({
      path: "gicon.png",
      // green icon
    });
    // send payload with call info and timer
    var rpl = {
      cmd: "call-in-progress-rpl",
      response: div_data.call,
      src: "background",
    };
  } else {
    chrome.browserAction.setIcon({
      path: "icon.png",
      // blue icon
    });

    if (call_status == 3) {
      // check if to show notes screen
      var callData = { ...div_data.call };
      callData["save_notes"] = div_data.user.save_notes;
      var rpl = {
        cmd: "call-completed-rpl",
        response: callData,
        src: "background",
      };

      if (div_data.user.save_notes == 0) {
        // if notes are not enabled, reset call data
        resetDataObject();
      } else {
        // data will be reset on save notification
      }
    } else {
      var rpl = {
        cmd: "call-canceled-rejected-rpl",
        response: "1",
        src: "background",
      };
      resetDataObject();
    }
  }
  chrome.runtime.sendMessage(rpl);
}

function indicateIncomingCallPopupWindow(cdata) {
  if (div_data.call.status == 0) {
    // seticonBrowser
    div_data.iconChangingInterval = setInterval(function () {
      console.log("Glow Browser Icon");
      chrome.browserAction.setIcon({
        path: "gicon.png",
      });

      setTimeout(function () {
        chrome.browserAction.setIcon({
          path: "icon.png",
        });
      }, 500);
    }, 1000);

    // set variables
    div_data.call.status = 1;
  }

  // sendMessage to Popup window
  // getIncoming Call details
  if (div_data.call.status == 1) {
    var rpl = {
      cmd: "call-ringing-rpl",
      response: div_data.call,
      src: "background",
    };
    chrome.runtime.sendMessage(rpl);
  } else if (div_data.call.status == 2) {
    var rpl = {
      cmd: "call-in-progress-rpl",
      response: div_data.call,
      src: "background",
    };
    chrome.runtime.sendMessage(rpl);
  }
}

function twiliohangup3() {
  // incomingdiv.remove();
  // if(window.location.hostname!="justcall.io") {
  //   incomingdiv.remove();
  // }
  mutestate = 0;
  hold_status = 0;
  hold_status_check = 0;
  secure_status = 0;
  merge_status = 0;
  // chrome.tabs.query({}, function(tabs) {
  //   var message = {"twiliohangup3": "twiliohangup3"};
  //   for (var i=0; i<tabs.length; ++i) {
  //     chrome.tabs.sendMessage(tabs[i].id, message);
  //   }
  // });

  twilioDevice.disconnectAll();
}

function getAllAvailableOutputDevices() {
  var devices = [];
  twilioDevice.audio.availableOutputDevices.forEach(function (device, id) {
    devices.push({ id: id, label: device.label });
  });

  return devices;
}

function getAllAvailableInputDevices() {
  var devices = [];
  twilioDevice.audio.availableInputDevices.forEach(function (device, id) {
    devices.push({ id: id, label: device.label });
  });

  return devices;
}

function updateAllDevices() {
  checkSpeakerdeviceCookies();
  checkRingtonedeviceCookies();
  checkInputdeviceCookies();
}

function checkSpeakerdeviceCookies() {
  console.log("CheckSpeakerAudioDevices");
  var devices = getAllAvailableOutputDevices();
  var dialerCookie = localStorage.getItem("audio-speaker-device");
  var extCookie = localStorage.getItem("audio-speaker-ext");

  var count = 0;
  if (extCookie != "" && extCookie != null) {
    for (var i = 0; i < devices.length; i++) {
      if (devices[i].label == extCookie) {
        count++;
        twilioDevice.audio.speakerDevices.set(devices[i].id);
        console.log(devices[i].id + " speaker id set updateAll ext");
      }
    }
  }

  if (count == 0 && dialerCookie != "" && dialerCookie != null) {
    for (var i = 0; i < devices.length; i++) {
      if (devices[i].label == dialerCookie) {
        count++;
        twilioDevice.audio.speakerDevices.set(devices[i].id);
        console.log(devices[i].id + " speaker id set updateAll dia");
      }
    }
  }

  if (count == 0) {
    var twilioSelectedId = twilioDevice.audio.speakerDevices.get();

    var tempId = "";
    twilioSelectedId.forEach(function (device) {
      tempId = device.deviceId;
    });

    twilioSelectedId = tempId;
    for (var i = 0; i < devices.length; i++) {
      if (devices[i].id == twilioSelectedId) {
        count++;
        twilioDevice.audio.speakerDevices.set(devices[i].id);
        console.log(devices[i].id + " speaker id set updateAll get");
      }
    }
  }

  if (count == 0) {
    twilioDevice.audio.speakerDevices.set("default");
    console.log("default" + " speaker id set updateAll def");
  }
}

function checkRingtonedeviceCookies() {
  console.log("CheckringtoneAudioDevices");
  var devices = getAllAvailableOutputDevices();
  var dialerCookie = localStorage.getItem("audio-ringtone-device");
  var extCookie = localStorage.getItem("audio-ringtone-ext");
  var count = 0;
  if (extCookie != "" && extCookie != null) {
    for (var i = 0; i < devices.length; i++) {
      if (devices[i].label == extCookie) {
        count++;
        twilioDevice.audio.ringtoneDevices.set(devices[i].id);
        console.log(devices[i].id + " ringtone id set updateAll ext");
      }
    }
  }

  if (count == 0 && dialerCookie != "" && dialerCookie != null) {
    for (var i = 0; i < devices.length; i++) {
      if (devices[i].label == dialerCookie) {
        count++;
        twilioDevice.audio.ringtoneDevices.set(devices[i].id);
        console.log(devices[i].id + " ringtone id set updateAll dia");
      }
    }
  }

  if (count == 0) {
    var twilioSelectedId = twilioDevice.audio.ringtoneDevices.get();
    var tempId = "";
    twilioSelectedId.forEach(function (device) {
      tempId = device.deviceId;
    });

    twilioSelectedId = tempId;

    for (var i = 0; i < devices.length; i++) {
      if (devices[i].id == twilioSelectedId) {
        count++;
        twilioDevice.audio.ringtoneDevices.set(twilioSelectedId);
        console.log(twilioSelectedId + " ringtone id set updateAll get");
      }
    }
  }

  if (count == 0) {
    twilioDevice.audio.ringtoneDevices.set("default");
    console.log("default" + " ringtone id set updateAll def");
  }
}

function checkInputdeviceCookies() {
  console.log("CheckInputAudioDevices");
  var devices = getAllAvailableInputDevices();
  var dialerCookie = localStorage.getItem("audio-input-device");
  var extCookie = localStorage.getItem("audio-input-ext");
  var count = 0;
  if (extCookie != "" && extCookie != null) {
    for (var i = 0; i < devices.length; i++) {
      if (devices[i].label == extCookie) {
        count++;
        lastselectedInputDevice = devices[i].id;
        // twilioDevice.audio.setInputDevice(devices[i].id);
        console.log(devices[i].id + " input id set updateAll ext");
      }
    }
  }

  if (count == 0 && dialerCookie != "" && dialerCookie != null) {
    for (var i = 0; i < devices.length; i++) {
      if (devices[i].label == dialerCookie) {
        count++;
        lastselectedInputDevice = devices[i].id;
        // twilioDevice.audio.setInputDevice(devices[i].id);
        console.log(devices[i].id + " input id set updateAll dia");
      }
    }
  }

  if (count == 0) {
    if (twilioDevice) {
      var twilioSelectedId = twilioDevice.audio.inputDevice;
      for (var i = 0; i < devices.length; i++) {
        if (twilioSelectedId) {
          if (devices[i].id == twilioSelectedId.deviceId) {
            count++;
            lastselectedInputDevice = twilioSelectedId.deviceId;
            // twilioDevice.audio.setInputDevice(twilioSelectedId.deviceId);
            console.log(
              twilioSelectedId.deviceId + " input id set updateAll get"
            );
          }
        }
      }
    }
  }

  if (count == 0) {
    lastselectedInputDevice = "default";
    // twilioDevice.audio.setInputDevice('default');
    console.log("default" + " input id set updateAll def");
  }
}

function jcnumberlookup(callsid) {
  $.ajax({
    type: "POST",
    url: "https://justcall.io/api/jcnumberlookup.php",
    data: {
      sid: callsid,
    },
    success: function (res) {
      res = JSON.parse(res);
      div_data.call.to_custom_name = res.number;
      div_data.call.to = res.vanila_number;
      div_data.call.record = res.record;
      indicateIncomingCallPopupWindow(div_data.call);
      // chrome.tabs.query({}, function(tabs) {
      //   var message = {"jcnumberlookup": res};
      //   for (var i=0; i<tabs.length; ++i) {
      //     chrome.tabs.sendMessage(tabs[i].id, message);
      //   }
      // });
    },
  });
}

function contactsourcenikalo(callernumber) {
  $.ajax({
    type: "POST",
    url: "https://justcall.io/api/getcontactsourcev2.php",
    data: {
      hash: jcbackcookie,
      number: callernumber,
    },
    success: function (res) {
      res = JSON.parse(res);
      console.log("back me ", res);

      // chrome.tabs.query({}, function(tabs) {
      //   var message = {"opencontactsource": res};
      //   for (var i=0; i<tabs.length; ++i) {
      //     chrome.tabs.sendMessage(tabs[i].id, message);
      //   }
      // });
    },
  });
}

function callerlookupnikalo(callernumber) {
  $.ajax({
    type: "POST",
    url: "https://justcall.io/api/callerlookup.php",
    data: {
      hash: jcbackcookie,
      number: callernumber,
    },
    success: function (res) {
      res = JSON.parse(res);
      console.log("here are the caller details", res);
      var callerName = callernumber;

      if (res.count > 0) {
        callerName = res.name;
      }

      div_data.call.callerName = callerName;
      indicateIncomingCallPopupWindow(div_data.call);

      let userAgentString = navigator.userAgent;
      let firefoxAgent = userAgentString.indexOf("Firefox") > -1;

      if (firefoxAgent) {
        chrome.notifications.create(
          "IncomingCall",
          {
            type: "basic",
            iconUrl: "icon_48.png",
            title: "📞 Incoming Call",
            message: callerName + " is calling",
          },
          function callback(notificationId) {
            // nothing necessary here, but required before Chrome 42
            console.log("notificationId is " + notificationId);
          }
        );
      } else {
        chrome.notifications.create(
          "IncomingCall",
          {
            type: "basic",
            iconUrl: "icon_48.png",
            requireInteraction: true,
            title: "📞 Incoming Call",
            message: callerName + " is calling",
            buttons: [{ title: "📞 Answer" }, { title: "❌ Reject" }],
          },
          function callback(notificationId) {
            // nothing necessary here, but required before Chrome 42
            console.log("notificationId is " + notificationId);
          }
        );
      }

      // chrome.tabs.query({}, function(tabs) {
      //   var message = {"opencallerlookup": res};
      //   for (var i=0; i<tabs.length; ++i) {
      //     chrome.tabs.sendMessage(tabs[i].id, message);
      //   }
      // });
    },
  });
}

function queueCallerLookup(label) {
  var callerName = label;

  div_data.call.callerName = callerName;
  indicateIncomingCallPopupWindow(div_data.call);

  let userAgentString = navigator.userAgent;
  let firefoxAgent = userAgentString.indexOf("Firefox") > -1;

  if (firefoxAgent) {
    chrome.notifications.create(
      "IncomingCall",
      {
        type: "basic",
        iconUrl: "icon_48.png",
        title: "📞 Incoming Call",
        message: callerName,
      },
      function callback(notificationId) {
        // nothing necessary here, but required before Chrome 42
        console.log("notificationId is " + notificationId);
      }
    );
  } else {
    chrome.notifications.create(
      "IncomingCall",
      {
        type: "basic",
        iconUrl: "icon_48.png",
        requireInteraction: true,
        title: "📞 Incoming Call",
        message: callerName,
        buttons: [{ title: "📞 Answer" }, { title: "❌ Reject" }],
      },
      function callback(notificationId) {
        // nothing necessary here, but required before Chrome 42
        console.log("notificationId is " + notificationId);
      }
    );
  }
}

function newcrmapi(callernumber) {
  $.ajax({
    type: "POST",
    url: "https://justcall.io/api/search_crm.php",
    data: {
      hash: jcbackcookie,
      number: callernumber,
      sleep: "yes",
      calltype: "1",
      deviceType: "2",
    },
    success: function (res) {
      obj = JSON.parse(res);
      var index = 0;
      var crmarray = [];
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          console.log(key);
          if (key == "lcoc") {
            continue;
          }

          if (obj[key].length > 0) {
            var this_obj = obj[key][0];

            if (index == 0) {
              //make first crm display the name
              div_data.call.crm.name = this_obj.name;
              div_data.call.crm.url = this_obj.profileurl;
              index++;
            }

            var data = {
              name: this_obj.name,
              url: this_obj.profileurl,
              image: this_obj.image,
            };

            crmarray.push(data);
          }
        }
      }

      div_data.call.crm.data = crmarray;
      indicateIncomingCallPopupWindow(div_data.call);
    },
  });
}

function jc_gettransferlist_bck() {
  var jc_search_term = "";
  $.ajax({
    type: "POST",
    url: "https://justcall.io/api/getcontacts_extv1.php",
    data: {
      hash: jcbackcookie,
      search: jc_search_term,
    },
    success: function (res) {
      //console.log(res);
      res = JSON.parse(res);
      //console.log(res);

      // chrome.tabs.query({}, function(tabs) {
      //   var message = {"jc_gettransferlist_bck": res};
      //   for (var i=0; i<tabs.length; ++i) {
      //     chrome.tabs.sendMessage(tabs[i].id, message);
      //   }
      // });
    },
  });
}

function jc_checksecure() {
  $.ajax({
    type: "POST",
    url: "https://justcall.io/api/checksecure_ext.php",
    data: { hash: jcbackcookie },
    success: function (res) {
      // console.log(res);
      res = JSON.parse(res);
      if (res.status == "success") {
        div_data.call.secured = res.secured;
        if (div_data.call.status == 2) {
          stopindicatingIncomingCallPopupWindow(div_data.call.status);
        }
      }
    },
  });
}

function jc_check_desposition() {
  $.ajax({
    type: "POST",
    url: "https://justcall.io/api/get_dispositioncodev1.php",
    data: { hash: jcbackcookie },

    success: function (res) {
      // console.log(res);
      res = JSON.parse(res);
      div_data.call.dispositions = res;
      // chrome.tabs.query({}, function(tabs) {
      //   var message = {"jc_check_desposition": res};
      //   for (var i=0; i<tabs.length; ++i) {
      //     chrome.tabs.sendMessage(tabs[i].id, message);
      //   }
      // });
    },
  });
}

function twiliohangup() {
  console.log("twilio hangup 0");
  mutestate = 0;
  hold_status = 0;
  hold_status_check = 0;
  currcon.status; // => "closed"
  twilioDevice.disconnectAll();
  // chrome.tabs.query({}, function(tabs) {
  //   var message = {"twiliokahangup": "twiliokahangup"};
  //   for (var i=0; i<tabs.length; ++i) {
  //     chrome.tabs.sendMessage(tabs[i].id, message);
  //   }
  // });
}

//Hold call code [ENDS HERE]

function jc_holdcall() {
  console.log("Inside hold call function");
  hold_sid = currcon.parameters.CallSid;

  $.ajax({
    type: "POST",
    url: "https://justcall.io/mobile/calling/hold_v1.php",
    data: {
      callsid: hold_sid,
      jcnumber: callfrom_hold,
      calltype: 1,
    },
    success: function (res) {
      //console.log(res);
      // $(elem).removeClass('disabled');
      // number_screen();
      // res = JSON.parse(res);
      //console.log(res);
      // hold_div_css()

      console.log("Inside hold call success function");

      var response = JSON.parse(res);
      console.log("Inside hold call success function2 ", response);
      if (response.status == "success") {
      } else {
        return;
      }

      if (hold_status_check == 0) {
        // Activate Hold
        hold_status_check = 1;
        div_data.call.hold = 1;
      } else {
        // Deactivate Hold
        hold_status_check = 0;
        div_data.call.hold = 0;
      }

      stopindicatingIncomingCallPopupWindow(2);

      // chrome.tabs.query({}, function(tabs) {
      //   var message = {"holdcall_ui_state": "active"};
      //   for (var i=0; i<tabs.length; ++i) {
      //     chrome.tabs.sendMessage(tabs[i].id, message);
      //   }
      // });
    },
  });
}

//Hold call code [ENDS HERE]

//Secure Line code [STARTS HERE]
function jc_start_secure() {
  $.ajax({
    type: "POST",
    url: "https://justcall.io/mobile/calling/recording_toggle.php",
    data: {
      callsid: currcon.parameters.CallSid,
      calltype: "1",
    },
    success: function (res) {
      console.log(res);
      // $(elem).removeClass('disabled');
      // number_screen();
      res = JSON.parse(res);

      if (res.status == "success") {
        // recordbutton_css(res.recording_status)
      } else {
        // recordbutton_css(0)
      }
    },
  });

  // console.log("secure_status "+secure_status)
  // if (secure_status==0) {	//Initiate Secure Call
  // 	hold_status=1;
  // 	secure_status=1;
  // 	var outcall_sid = currcon.parameters.CallSid;
  // 	secure_conference_name = currcon.parameters.CallSid;

  // 	$.ajax({
  // 		type:"POST",
  // 		url:"https://justcall.io/mobile/calling/secure_line/inc_step1_secure.php",
  // 		data:{
  // 			callsid:secure_conference_name
  // 		},
  // 		success:function(res) {
  // 			jc_secure_conference(secure_conference_name);
  // 		}
  // 	});

  // }else{
  // 	secure_status=0;
  // 	randshit = 0;

  // 	$.ajax({
  // 		type:"POST",
  // 		url:"https://justcall.io/mobile/calling/secure_line/step3_insecure.php",
  // 		data:{
  // 			callsid:secure_conference_name,
  // 			hash:jcbackcookie,
  // 			jcnumber:callfrom_hold,
  // 			clientnumber:callto_hold,
  // 			randshit:randshit,
  // 			calltype:1
  // 		},
  // 		success:function(res) {
  // 		}
  // 	});

  // }
}

//Secure Line code [ENDS HERE]

function saveErrorlogs() {
  console.log("callErrorLogs strt");
  console.log(callErrorLogs);
  console.log("callErrorLogs end");

  var callSid = busy_callsid;
  var src = 2;

  if (callErrorLogs.length > 0) {
    $.ajax({
      type: "POST",
      url: "https://justcall.io/api/onCallWarningLogs.php",
      data: {
        callsid: callSid,
        callErr: callErrorLogs,
        calltype: 1,
        src: src,
      },
      success: function (res) {},
    });
  }
}

function saveAudioDevices() {
  console.log("Save Audio Devices entered");
  $.ajax({
    type: "GET",
    url: "https://justcall.io/api/saveAudioDevices.php",
    data: {
      input_devices: getAllInputDevices(),
      output_devices: getAllOutputDevices(),
      ringtone_devices: getAllRingtoneDevices(),
      calltype: 1,
      callsid: busy_callsid,
      src: 2,
    },
    success: function (res) {},
  });
}

function getAllInputDevices() {
  var devices = [];
  var selected = twilioDevice.audio.inputDevice;
  console.log("getAllInputDevices selected id");
  twilioDevice.audio.availableInputDevices.forEach(function (device, id) {
    if (selected.deviceId == id) {
      devices.push({ label: device.label, id: id, selected: "true" });
    } else {
      devices.push({ label: device.label, id: id });
    }
  });

  return devices;
}

function getAllOutputDevices() {
  var devices = [];
  var selectedId = "";
  var selected = twilioDevice.audio.speakerDevices.get();
  selected.forEach(function (device) {
    selectedId = device.deviceId;
  });
  twilioDevice.audio.availableOutputDevices.forEach(function (device, id) {
    if (selectedId == id) {
      devices.push({ label: device.label, id: id, selected: "true" });
    } else {
      devices.push({ label: device.label, id: id });
    }
  });
  return devices;
}

function getAllRingtoneDevices() {
  var devices = [];
  var selectedId = "";
  var selected = twilioDevice.audio.ringtoneDevices.get();
  selected.forEach(function (device) {
    selectedId = device.deviceId;
  });
  twilioDevice.audio.availableOutputDevices.forEach(function (device, id) {
    if (selectedId == id) {
      devices.push({ label: device.label, id: id, selected: "true" });
    } else {
      devices.push({ label: device.label, id: id });
    }
  });
  return devices;
}

//Merge call code [Starts HERE]
function jc_start_merge(
  merge_member_hash,
  merge_member_number,
  merge_member_type
) {
  merge_status = 1;
  var incall_sid = currcon.parameters.CallSid;
  merge_conference_name = currcon.parameters.CallSid;

  $.ajax({
    type: "POST",
    url: "https://justcall.io/mobile/calling/merge/inc_step1_initiate.php",
    data: {
      callsid: incall_sid,
      mem_hash: merge_member_hash,
    },
    success: function (res) {
      //console.log(res);
      // $(elem).removeClass('disabled');
      // number_screen();
      // res = JSON.parse(res);
      //console.log(res);
      // toastr.success('This call has been transfered successfully. Please wait...');
      jc_merge_callagent(
        merge_member_hash,
        merge_member_number,
        merge_member_type,
        merge_conference_name
      );
    },

    error: function (err) {
      console.log(err.status);
      // err = JSON.parse(err);
      if (err.status == 400) {
        jc_merge_close("Member is unavailable/busy");
      }
    },
  });
}

function jc_merge_close(msg) {
  // chrome.tabs.query({}, function(tabs) {
  //   var message = {"jc_merge_close": msg};
  //   for (var i=0; i<tabs.length; ++i) {
  //     chrome.tabs.sendMessage(tabs[i].id, message);
  //   }
  // });
}

function jc_merge_callagent(
  agenthash,
  agentnumber,
  agenttype,
  conference_name
) {
  // console.log('Conference Name '+conference_name);
  $.ajax({
    type: "POST",
    url: "https://justcall.io/calling/generatetokenext.php",
    data: {
      hash: jcbackcookie,
    },
    success: function (res2) {
      checkcallstatus = 1;
      //console.log(res2);
      res2 = JSON.parse(res2);
      //console.log(res2);

      token = res2.token;
      balance = res2.balance;
      randshit = res2.random;

      // params = {"PhoneNumber": '+'+callto_hold, "From" : '+'+callfrom_hold+'^<? echo $masterhash?>^'+randshit+'^'+outcallsid+'^<? echo $base_plan?>'};

      if (agenttype == "Member") {
        params = {
          PhoneNumber: agenthash,
          From:
            "+" +
            callfrom_hold +
            "^" +
            jcbackcookie +
            "^" +
            randshit +
            "^" +
            balance +
            "^2001" +
            "^2^" +
            conference_name,
        };
      } else if (agenttype == "Number" || agenttype == "Contact") {
        params = {
          PhoneNumber: agentnumber,
          From:
            "+" +
            callfrom_hold +
            "^" +
            jcbackcookie +
            "^" +
            randshit +
            "^" +
            balance +
            "^2001" +
            "^2^" +
            conference_name,
        };
      }

      // console.log('Call Hui 1');
      merge_inprogress = 1;
      twilioDevice.connect(params);
      // twilioDevice.setup(token , {closeProtection : "Any active connection or call will be terminated if you leave this page" , dscp :true, audioConstraints : true });
      // console.log(twilioDevice.instance);

      jc_merge_screen();
    },
  });
}

function jc_merge_screen() {
  // chrome.tabs.query({}, function(tabs) {
  //   var message = {"jc_merge_screen": "mergescreen"};
  //   for (var i=0; i<tabs.length; ++i) {
  //     chrome.tabs.sendMessage(tabs[i].id, message);
  //   }
  // });
}

function getOutDeviceIdByLabel(label) {
  var deviceid = "default";
  twilioDevice.audio.availableOutputDevices.forEach(function (device, id) {
    if (device.label == label) {
      console.log(device);
      deviceid = id;
    }
  });

  return deviceid;
}

function getInputDeviceIdByLabel(label) {
  var deviceid = "default";
  twilioDevice.audio.availableInputDevices.forEach(function (device, id) {
    if (device.label == label) {
      deviceid = id;
      console.log(device);
    }
  });
  return deviceid;
}

function jc_merge_complete_func(jc_merge_complete_status) {
  var outcall_sid = outcall_conn.parameters.CallSid;

  if (jc_merge_complete_status == "success") {
    merge_added = 1;
  }
  // $('#merge_teammember_label').html($("#teammembers option:selected").text());
  // merge_member = $("#teammembers option:selected").text();
  $.ajax({
    type: "POST",
    url: "https://justcall.io/mobile/calling/merge/step3_merge.php",
    data: {
      callsid: outcall_sid,
      conferencename: merge_conference_name,
      status: jc_merge_complete_status,
    },
    success: function (res) {
      merge_status = 0;

      res = JSON.parse(res);

      // chrome.tabs.query({}, function(tabs) {
      //     var message = {"jc_merge_complete_ui": "jc_merge_complete_ui"};
      //     for (var i=0; i<tabs.length; ++i) {
      //       chrome.tabs.sendMessage(tabs[i].id, message);
      //     }
      //   });

      // outcall_screen();

      // $('#mergediv').show();
      if (merge_added == 1) {
        // $('#mergediv').html('<span class="label label-success">'+merge_member+' has been added to the call</span>')
        // chrome.tabs.query({}, function(tabs) {
        //       var message = {"jc_merge_added": "success"};
        //       for (var i=0; i<tabs.length; ++i) {
        //         chrome.tabs.sendMessage(tabs[i].id, message);
        //       }
        //     });
      } else {
        // $('#mergediv').html('<span class="label label-danger">'+merge_member+' has been disconnect from the call</span>')
        // chrome.tabs.query({}, function(tabs) {
        //       var message = {"jc_merge_added": "fail"};
        //       for (var i=0; i<tabs.length; ++i) {
        //         chrome.tabs.sendMessage(tabs[i].id, message);
        //       }
        //     });
      }
      merge_added = 0;

      if (res.status == "fail") {
        // chrome.tabs.query({}, function(tabs) {
        //       var message = {"jc_merge_failbadge": "jc_merge_failbadge"};
        //       for (var i=0; i<tabs.length; ++i) {
        //         chrome.tabs.sendMessage(tabs[i].id, message);
        //       }
        //     });
      }

      //console.log(res);
      // $(elem).removeClass('disabled');
      // number_screen();
      // res = JSON.parse(res);
      //console.log(res);
      // toastr.success('This call has been transfered successfully. Please wait...');
    },
  });
}
//Merge call code [Ends HERE]

function update_busystatus(
  busy_cookie,
  busy_callsid,
  busy_status,
  event = null
) {
  if (getlive_xhr && getlive_xhr.readyState != 4) {
    getlive_xhr.abort();
  }

  getlive_xhr = $.ajax({
    type: "POST",
    url: "https://justcall.io/api/update_busystatus.php",
    data: {
      hash: busy_cookie,
      callsid: busy_callsid,
      ub: busy_status,
      call_type: "1",
      event: event,
    },
    success: function (res2) {},
  });
}

// install_notice();
setTimeout(function () {
  requestcookie();
}, 1000);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "open_new_tab") {
    var urltosend;
    var desktopappuri;
    if (request.sms == "1") {
      urltosend = request.url + "?numbers=" + request.numbers + "&sms=1";

      desktopappuri = request.numbers + "&sms=1";
    } else {
      urltosend = request.url + "?numbers=" + request.numbers;
      console.log(urltosend);
      desktopappuri = request.numbers;
    }

    if (
      request.zoho == "1" ||
      request.pipedrive == "1" ||
      request.freshsales == "1"
    ) {
      urltosend = request.url;
      // console.log("url to send is "+urltosend);

      desktopappuri = request.numbers;
      // console.log("desktopappuri "+desktopappuri);

      if (request.commtype == "sms") {
        desktopappuri = request.numbers + "&sms=1";
      }
      // console.log("idhar form hua?");
    }

    if (previoustabid != "") {
      chrome.tabs.get(previoustabid, function (tab) {
        if (!tab) {
          console.log("tab does not exist");
        } else {
          chrome.tabs.remove(previoustabid);
        }
      });
    }

    console.log("Desktop app uri", desktopappuri);

    // attempt to redirect to the uri:scheme
    // the lovely thing about javascript is that it's single threadded.
    // if this WORKS, it'll stutter for a split second, causing the timer to be off
    var finalurl = "justcall://" + desktopappuri;

    if (opendesktopapp == 1 || opendesktopapp == "1") {
      // chrome.tabs.query({}, function(tabs) {
      //     var message = {"open_desktop_app": finalurl};

      //     for (var i=0; i<tabs.length; ++i) {

      //     	var taburl = tabs[i].url;
      //     	// console.log(taburl);

      //     	if(typeof taburl!== 'undefined') {

      //      	if ((taburl.indexOf("https://meet.google.com") != -1)||(taburl.indexOf("https://hangouts.google.com") != -1)) {

      //      	} else {

      //          chrome.tabs.sendMessage(tabs[i].id, message);
      //      	}
      //     	}

      //     }
      // });

      chrome.tabs.query(
        { active: true, windowType: "normal", currentWindow: true },
        function (d) {
          console.log(d[0]);

          // var taburl = d[0].url;
          var message = { open_desktop_app: finalurl };

          // if(typeof taburl!== 'undefined') {

          //   if ((taburl.indexOf("https://meet.google.com") != -1)||(taburl.indexOf("https://hangouts.google.com") != -1)) {

          //   } else {

          //     chrome.tabs.sendMessage(d[0].id, message);
          //   }
          // }

          console.log("meet.google", message);
          chrome.tabs.sendMessage(d[0].id, message);
        }
      );
    } else {
      chrome.windows.getCurrent(function (win) {
        var width = 440;
        var height = 220;
        var left = screen.width / 2 - width / 2 + win.left;
        var top = screen.height / 2 - height / 2 + win.top;

        top = parseInt(top);
        left = parseInt(left);

        chrome.tabs.create({ url: urltosend, active: false }, function (tab) {
          previoustabid = tab.id;
          console.log("here is current tab id ", previoustabid);
          chrome.windows.create(
            {
              tabId: tab.id,
              type: "popup",
              focused: true,
              left: left,
              top: top,
              state: "normal",
              height: 632,
              width: 380,
              // incognito, top, left, ...
            },
            function (window) {
              previouswindowid = window.id;
            }
          );
        });
      });
    }
  } else if (request.message == "updatebadge") {
    chrome.tabs.get(sender.tab.id, function (tab) {
      if (chrome.runtime.lastError) {
        return; // the prerendered tab has been nuked, happens in omnibox search
      }
      if (tab.index >= 0) {
        // tab is visible
        // chrome.browserAction.setBadgeBackgroundColor({color: '#E53935'});
        // chrome.browserAction.setBadgeText({tabId:tab.id, text:request.count});
      } else {
        // prerendered tab, invisible yet, happens quite rarely
        var tabId = sender.tab.id,
          text = request.count;
        chrome.webNavigation.onCommitted.addListener(function update(details) {
          if (details.tabId == tabId) {
            // chrome.browserAction.setBadgeBackgroundColor({color: '#E53935'});

            // chrome.browserAction.setBadgeText({tabId: tabId, text: text});
            chrome.webNavigation.onCommitted.removeListener(update);
          }
        });
      }
    });
  } else if (request.method == "getStatus") {
    chrome.cookies.get(
      { url: "https://justcall.io", name: "login_sess" },
      function (cookie) {
        if (cookie != null) {
          // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          //   var activeTab = tabs[0];
          //   chrome.tabs.sendMessage(activeTab.id, {"cookiegot": cookie.value});
          // });
          checkforsimilarity(cookie.value);
          // chrome.tabs.query({}, function(tabs) {
          //   var message = {"twiliodisconnect": "twiliodisconnect"};
          //   for (var i=0; i<tabs.length; ++i) {
          //     chrome.tabs.sendMessage(tabs[i].id,  {"cookiegot": cookie.value});
          //   }
          // });
        } else {
          // alert("do nothing");
          // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          //   var activeTab = tabs[0];
          //   chrome.tabs.sendMessage(activeTab.id, {"cookiegot": ""});
          // });
          div_data.user.hash = "";
          deviceready = 0;
          localStorage.setItem("cookiesaved", "");
          twilioDevice.destroy();
          //  chrome.tabs.query({}, function(tabs) {
          //   var message = {"twiliodisconnect": "twiliodisconnect"};
          //   for (var i=0; i<tabs.length; ++i) {
          //     chrome.tabs.sendMessage(tabs[i].id,  {"cookiegot": ""});
          //   }
          // });
        }
      }
    );
  } else if (request.acceptcall == "incoming") {
    console.log("going to accept the call");
    acceptthisCallPlease();
  } else if (request.twiliohangup2 == "hangup") {
    currcon.reject();
    if (div_data.call.status > 1) {
      // handled within disconnect event if the call was hanged up after accepting

      if (twilioDevice.activeConnection() == undefined) {
        // uncomment when user says ki outcall screen hangs, cannot disconnect
        stopindicatingIncomingCallPopupWindow(0);
      }
    } else {
      stopindicatingIncomingCallPopupWindow(0);
    }
    currcon.disconnect();
    twilioDevice.disconnectAll();
  } else if (request.ignore == "ignore") {
    currcon.ignore();
  } else if (request.checkforsimilarity) {
    checkforsimilarity(request.checkforsimilarity);
  } else if (request.mutecall == "mute") {
    //Mute call
    console.log("going to mute the call");

    if (mutestate == 0) {
      //Mute Call
      twilioDevice.activeConnection().mute(true);

      // chrome.tabs.query({}, function(tabs) {
      //    var message = {"mutecall_ui": "mute"};
      //    for (var i=0; i<tabs.length; ++i) {
      //      chrome.tabs.sendMessage(tabs[i].id, message);
      //    }
      //  });
      mutestate = 1;
      div_data.call.mute = 1;
    } else {
      //Un-Mute Call
      twilioDevice.activeConnection().mute(false);
      // chrome.tabs.query({}, function(tabs) {
      //     var message = {"mutecall_ui": "unmute"};
      //     for (var i=0; i<tabs.length; ++i) {
      //       chrome.tabs.sendMessage(tabs[i].id, message);
      //     }
      //  });

      mutestate = 0;
      div_data.call.mute = 0;
    }

    stopindicatingIncomingCallPopupWindow(2);
  } else if (request.jc_chrome_ui_reset == "reset") {
    // chrome.tabs.query({}, function(tabs) {
    //   var message = {"jc_reset_ui": "reset"};
    //   for (var i=0; i<tabs.length; ++i) {
    //     chrome.tabs.sendMessage(tabs[i].id, message);
    //   }
    // });
  } else if (request.holdcall == "hold") {
    if (hold_status_check == 0) {
      //Hold Call

      jc_holdcall();

      // chrome.tabs.query({}, function(tabs) {
      //     var message = {"holdcall_ui": "hold"};
      //     for (var i=0; i<tabs.length; ++i) {
      //       chrome.tabs.sendMessage(tabs[i].id, message);
      //     }
      //   });
    } else {
      //Un-Hold Call

      jc_holdcall();

      // chrome.tabs.query({}, function(tabs) {
      //     var message = {"holdcall_ui": "unhold"};
      //     for (var i=0; i<tabs.length; ++i) {
      //       chrome.tabs.sendMessage(tabs[i].id, message);
      //     }
      //   });
    }

    // chrome.tabs.query({}, function(tabs) {
    //   var message = {"holdcall_ui_state": "inactive"};
    //   for (var i=0; i<tabs.length; ++i) {
    //     chrome.tabs.sendMessage(tabs[i].id, message);
    //   }
    // });
  } else if (request.hold_callfrom) {
    callfrom_hold = request.hold_callfrom;
  } else if (request.ignorecall == "minimize") {
    // chrome.tabs.query({}, function(tabs) {
    //   var message = {"ignorecall_ui": "minimize"};
    //   for (var i=0; i<tabs.length; ++i) {
    //     chrome.tabs.sendMessage(tabs[i].id, message);
    //   }
    // });
  } else if (request.ignorecall == "maximize") {
    // chrome.tabs.query({}, function(tabs) {
    //   var message = {"ignorecall_ui": "maximize"};
    //   for (var i=0; i<tabs.length; ++i) {
    //     chrome.tabs.sendMessage(tabs[i].id, message);
    //   }
    // });
  } else if (request.jc_start_merge) {
    var merge_member_data = request.jc_start_merge;
    var merge_arr = merge_member_data.split("^"); //0=hash || 1=number || 2=type
    jc_start_merge(merge_arr[0], merge_arr[1], merge_arr[2]);
  } else if (request.jc_start_merge_calling) {
    var jc_start_merge_calling = request.jc_start_merge_calling;

    // chrome.tabs.query({}, function(tabs) {
    //   var message = {"jc_start_merge_calling_ui": jc_start_merge_calling};
    //   for (var i=0; i<tabs.length; ++i) {
    //     chrome.tabs.sendMessage(tabs[i].id, message);
    //   }
    // });
  } else if (request.jc_merge_complete) {
    var jc_merge_complete = request.jc_merge_complete;
    jc_merge_complete_func(jc_merge_complete);
  } else if (request.method == "checkMic") {
    micDetect();
  } else if (request.jc_start_secure) {
    if (secure_status == 0) {
      //Secure
      secure_status = 1;
      // chrome.tabs.query({}, function(tabs) {
      //     var message = {"securecall_ui": "secure"};
      //     for (var i=0; i<tabs.length; ++i) {
      //       chrome.tabs.sendMessage(tabs[i].id, message);
      //     }
      //   });
    } else {
      //Unsecure
      secure_status = 0;
      // chrome.tabs.query({}, function(tabs) {
      //     var message = {"securecall_ui": "unsecure"};
      //     for (var i=0; i<tabs.length; ++i) {
      //       chrome.tabs.sendMessage(tabs[i].id, message);
      //     }
      //   });
    }

    jc_start_secure();
  } else if (request.jc_press_digit) {
    var jc_press_digit = request.jc_press_digit;
    console.log("DIgit " + jc_press_digit);
    if (div_data.call.keypad == 1) {
      currcon.sendDigits(jc_press_digit);
    } else if (div_data.call.keypad == 2) {
      div_data.call.tta_call.connection.sendDigits(jc_press_digit);
    }

    div_data.call.keypad_digits_display += jc_press_digit.toString();
    stopindicatingIncomingCallPopupWindow(2);
  } else if (request.jc_shownotes == "shownotesui") {
    // update_busystatus(jcbackcookie,busy_callsid,'56018323b921dd2c5444f98fb45509de');
    //  chrome.tabs.query({}, function(tabs) {
    //   var message = {"jc_shownotes_ui": "shownotesbro"};
    //   for (var i=0; i<tabs.length; ++i) {
    //     chrome.tabs.sendMessage(tabs[i].id, message);
    //   }
    // });
  } else if (request.message == "destroytwilio") {
    console.log("destroying twilio");
    // console.log(twilioDevice.status());
    jcbackcookie = "";
    localStorage.setItem("cookiesaved", "");
    deviceready = 0;
    twilioDevice.destroy();
  } else if (request.getDisabledNotes == "get") {
    var valueis = localStorage.getItem("disablednotes");
    // chrome.tabs.query({}, function(tabs) {
    //   var message = {"disablednotes": "savevalue","disablednotesvalue":valueis};
    //   for (var i=0; i<tabs.length; ++i) {
    //     chrome.tabs.sendMessage(tabs[i].id, message);
    //   }
    // });
  } else if (request.message == "getAvailableOutputDevices") {
    // var devices = getAllAvailableOutputDevices();
    // chrome.cookies.get({ url: 'https://justcall.io', name: 'audio_speaker_ext'}, function(cookie){
    //   var count = 0;
    //    if(cookie != null && cookie.value != "") {
    //      var cvalue = cookie.value;
    //      var ecount = 0;
    //      var eid = '';
    //      var ehtml = '';
    //      for(var i = 0 ; i < devices.length; i++){
    //        ehtml += '<option data-id="'+devices[i].id+'" data-label="'+devices[i].label+'" value="'+devices[i].id+'"';
    //        if(devices[i].label == cvalue){
    //          eid = devices[i].id;
    //          count++;
    //          ecount++;
    //          ehtml += ' selected="selected"';
    //        }
    //        ehtml += '>'+devices[i].label+'</option>';
    //      }
    //
    //      if(ecount == 0){
    //        ehtml = '';
    //      } else {
    //        console.log("ehtml");
    //        console.log(ehtml);
    //        sendResponse({data: {html: ehtml}});
    //        return true;
    //      }
    //    }
    //
    //    if(count == 0) {
    //      // extension cookie not set.
    //      chrome.cookies.get({ url: 'https://justcall.io', name: 'audio_speaker_device'}, function(dcookie){
    //        var dcount = 0;
    //        var did = '';
    //        var dhtml = '';
    //
    //        if(dcookie != null && dcookie.value != "") {
    //          var dvalue = dcookie.value;
    //
    //          for(var i = 0 ; i < devices.length; i++){
    //            dhtml += '<option data-id="'+devices[i].id+'" data-label="'+devices[i].label+'" value="'+devices[i].id+'"';
    //            if(devices[i].label == dvalue){
    //              did = devices[i].id;
    //              count++;
    //              dcount++;
    //              dhtml += ' selected="selected"';
    //            }
    //            dhtml += '>'+devices[i].label+'</option>';
    //          }
    //
    //          if(dcount == 0){
    //            dhtml = '';
    //          } else {
    //            //return ehtml;
    //          }
    //
    //        }
    //
    //        if(count == 0){
    //          var twid = twilioDevice.audio.speakerDevices.get();
    //          for(var i = 0 ; i < devices.length; i++){
    //            dhtml += '<option data-id="'+devices[i].id+'" data-label="'+devices[i].label+'" value="'+devices[i].id+'"';
    //            if(devices[i].id == twid){
    //              did = devices[i].id;
    //              count++;
    //              dcount++;
    //              dhtml += ' selected="selected"';
    //            }
    //            dhtml += '>'+devices[i].label+'</option>';
    //          }
    //
    //          if(dcount == 0){
    //            dhtml = '';
    //          } else {
    //            //return ehtml;
    //          }
    //        }
    //
    //        if(count == 0){
    //          var defaultid = 'default';
    //          for(var i = 0 ; i < devices.length; i++){
    //            dhtml += '<option data-id="'+devices[i].id+'" data-label="'+devices[i].label+'" value="'+devices[i].id+'"';
    //            if(devices[i].id == defaultid){
    //              did = devices[i].id;
    //              count++;
    //              dcount++;
    //              dhtml += ' selected="selected"';
    //            }
    //            dhtml += '>'+devices[i].label+'</option>';
    //          }
    //
    //          if(dcount == 0){
    //            dhtml = '';
    //          } else {
    //            //return ehtml;
    //          }
    //        }
    //
    //        if(count != 0){
    //          console.log("dhtml");
    //          console.log(dhtml);
    //          sendResponse({data: {html: dhtml}});
    //          return true;
    //        } else {
    //          console.log("No html");
    //        }
    //      });
    //    }
    // });
    var devices = getAllAvailableOutputDevices();
    var count = 0;
    var html = "";
    var getextcookie = localStorage.getItem("audio-speaker-ext");
    var getdialercookie = localStorage.getItem("audio-speaker-device");

    if (getextcookie && getextcookie != "" && getextcookie != null) {
      for (var i = 0; i < devices.length; i++) {
        html +=
          '<option data-id="' +
          devices[i].id +
          '" data-label="' +
          devices[i].label +
          '" value="' +
          devices[i].id +
          '"';
        if (devices[i].label == getextcookie) {
          count++;
          html += ' selected="selected"';
        }
        html += ">" + devices[i].label + "</option>";
      }
    }

    if (
      count == 0 &&
      getdialercookie &&
      getdialercookie != "" &&
      getdialercookie != null
    ) {
      html = "";
      for (var i = 0; i < devices.length; i++) {
        html +=
          '<option data-id="' +
          devices[i].id +
          '" data-label="' +
          devices[i].label +
          '" value="' +
          devices[i].id +
          '"';
        if (devices[i].label == getdialercookie) {
          count++;
          html += ' selected="selected"';
        }
        html += ">" + devices[i].label + "</option>";
      }
    }

    if (count == 0) {
      html = "";
      var twid = twilioDevice.audio.speakerDevices.get();
      for (var i = 0; i < devices.length; i++) {
        html +=
          '<option data-id="' +
          devices[i].id +
          '" data-label="' +
          devices[i].label +
          '" value="' +
          devices[i].id +
          '"';
        if (devices[i].id == twid) {
          count++;
          html += ' selected="selected"';
        }
        html += ">" + devices[i].label + "</option>";
      }
    }

    if (count == 0) {
      html = "";
      var sid = "default";
      for (var i = 0; i < devices.length; i++) {
        html +=
          '<option data-id="' +
          devices[i].id +
          '" data-label="' +
          devices[i].label +
          '" value="' +
          devices[i].id +
          '"';
        if (devices[i].id == sid) {
          count++;
          html += ' selected="selected"';
        }
        html += ">" + devices[i].label + "</option>";
      }
    }

    if (count != 0) {
      sendResponse({ data: { html: html } });
      return true;
    }
  } else if (request.message == "getAvailableRingtoneDevices") {
    var devices = getAllAvailableOutputDevices();
    var count = 0;
    var html = "";
    var getextcookie = localStorage.getItem("audio-ringtone-ext");
    var getdialercookie = localStorage.getItem("audio-ringtone-device");

    if (getextcookie && getextcookie != "" && getextcookie != null) {
      for (var i = 0; i < devices.length; i++) {
        html +=
          '<option data-id="' +
          devices[i].id +
          '" data-label="' +
          devices[i].label +
          '" value="' +
          devices[i].id +
          '"';
        if (devices[i].label == getextcookie) {
          count++;
          html += ' selected="selected"';
        }
        html += ">" + devices[i].label + "</option>";
      }
    }

    if (
      count == 0 &&
      getdialercookie &&
      getdialercookie != "" &&
      getdialercookie != null
    ) {
      html = "";
      for (var i = 0; i < devices.length; i++) {
        html +=
          '<option data-id="' +
          devices[i].id +
          '" data-label="' +
          devices[i].label +
          '" value="' +
          devices[i].id +
          '"';
        if (devices[i].label == getdialercookie) {
          count++;
          html += ' selected="selected"';
        }
        html += ">" + devices[i].label + "</option>";
      }
    }

    if (count == 0) {
      html = "";
      var twid = twilioDevice.audio.ringtoneDevices.get();
      for (var i = 0; i < devices.length; i++) {
        html +=
          '<option data-id="' +
          devices[i].id +
          '" data-label="' +
          devices[i].label +
          '" value="' +
          devices[i].id +
          '"';
        if (devices[i].id == twid) {
          count++;
          html += ' selected="selected"';
        }
        html += ">" + devices[i].label + "</option>";
      }
    }

    if (count == 0) {
      html = "";
      var sid = "default";
      for (var i = 0; i < devices.length; i++) {
        html +=
          '<option data-id="' +
          devices[i].id +
          '" data-label="' +
          devices[i].label +
          '" value="' +
          devices[i].id +
          '"';
        if (devices[i].id == sid) {
          count++;
          html += ' selected="selected"';
        }
        html += ">" + devices[i].label + "</option>";
      }
    }

    if (count != 0) {
      sendResponse({ data: { html: html } });
      return true;
    }
  } else if (request.message == "getAvailableInputDevices") {
    var devices = getAllAvailableInputDevices();
    var count = 0;
    var html = "";
    var getextcookie = localStorage.getItem("audio-input-ext");
    var getdialercookie = localStorage.getItem("audio-input-device");

    if (getextcookie && getextcookie != "" && getextcookie != null) {
      for (var i = 0; i < devices.length; i++) {
        html +=
          '<option data-id="' +
          devices[i].id +
          '" data-label="' +
          devices[i].label +
          '" value="' +
          devices[i].id +
          '"';
        if (devices[i].label == getextcookie) {
          count++;
          html += ' selected="selected"';
        }
        html += ">" + devices[i].label + "</option>";
      }
    }

    if (
      count == 0 &&
      getdialercookie &&
      getdialercookie != "" &&
      getdialercookie != null
    ) {
      html = "";
      for (var i = 0; i < devices.length; i++) {
        html +=
          '<option data-id="' +
          devices[i].id +
          '" data-label="' +
          devices[i].label +
          '" value="' +
          devices[i].id +
          '"';
        if (devices[i].label == getdialercookie) {
          count++;
          html += ' selected="selected"';
        }
        html += ">" + devices[i].label + "</option>";
      }
    }

    if (count == 0) {
      html = "";
      var twid = twilioDevice.audio.inputDevice;
      if (twid) {
        twid = twid.deviceId;
      }
      for (var i = 0; i < devices.length; i++) {
        html +=
          '<option data-id="' +
          devices[i].id +
          '" data-label="' +
          devices[i].label +
          '" value="' +
          devices[i].id +
          '"';
        if (devices[i].id == twid) {
          count++;
          html += ' selected="selected"';
        }
        html += ">" + devices[i].label + "</option>";
      }
    }

    if (count == 0) {
      html = "";
      var sid = "default";
      for (var i = 0; i < devices.length; i++) {
        html +=
          '<option data-id="' +
          devices[i].id +
          '" data-label="' +
          devices[i].label +
          '" value="' +
          devices[i].id +
          '"';
        if (devices[i].id == sid) {
          count++;
          html += ' selected="selected"';
        }
        html += ">" + devices[i].label + "</option>";
      }
    }

    if (count != 0) {
      sendResponse({ data: { html: html } });
      return true;
    }
  } else if (request.message == "dialer_speaker_devices_changed") {
    var optionData = request.option;
    localStorage.setItem("audio-speaker-device", optionData);
    console.log(getOutDeviceIdByLabel(optionData));

    var extCookie = localStorage.getItem("audio-speaker-ext");
    if (extCookie && extCookie != "") {
      return true;
    }
    twilioDevice.audio.speakerDevices.set(getOutDeviceIdByLabel(optionData));
    console.log("Audio speaker device changes");
  } else if (request.message == "dialer_input_devices_changed") {
    var optionData = request.option;
    localStorage.setItem("audio-input-device", optionData);
    console.log(getInputDeviceIdByLabel(optionData));
    var extCookie = localStorage.getItem("audio-input-ext");
    if (extCookie && extCookie != "") {
      return true;
    }
    lastselectedInputDevice = getInputDeviceIdByLabel(optionData);
    // twilioDevice.audio.setInputDevice(getInputDeviceIdByLabel(optionData));
    console.log("Audio input device changes");
  } else if (request.message == "dialer_ringtone_devices_changed") {
    var optionData = request.option;
    localStorage.setItem("audio-ringtone-device", optionData);
    console.log(getOutDeviceIdByLabel(optionData));
    var extCookie = localStorage.getItem("audio-ringtone-ext");
    if (extCookie && extCookie != "") {
      return true;
    }
    twilioDevice.audio.ringtoneDevices.set(getOutDeviceIdByLabel(optionData));
    console.log("Audio ringtone device changes");
  } else if (request.message == "testSpeakerDevice") {
    twilioDevice.audio.speakerDevices.test();
  } else if (request.message == "testRingtoneDevice") {
    twilioDevice.audio.ringtoneDevices.test();
  } else if (request.speaker_device_changed) {
    var selectedSpeakerDeviceId = request.speaker_device_changed;
    twilioDevice.audio.speakerDevices.set(selectedSpeakerDeviceId);
    console.log(selectedSpeakerDeviceId + "id speaker selected");
  } else if (request.ringtone_device_changed) {
    var selectedRingtoneDeviceId = request.ringtone_device_changed;
    twilioDevice.audio.ringtoneDevices.set(selectedRingtoneDeviceId);
    console.log(selectedRingtoneDeviceId + "id ringtone selected");
  } else if (request.input_device_changed) {
    var selectedInputDeviceId = request.input_device_changed;
    lastselectedInputDevice = selectedInputDeviceId;
    twilioDevice.audio.setInputDevice(selectedInputDeviceId);
    console.log(selectedInputDeviceId + "id input selected");
  } else if (request.message === "checkSalesforceAddonAD") {
    let message = {
      data: salesforce_addon,
      cmd: "salesforce_got_addon",
      src: "background",
    };
    chrome.tabs.query({}, function (tabs) {
      for (var i = 0; i < tabs.length; ++i) {
        chrome.tabs.sendMessage(tabs[i].id, message);
      }
    });
  }
});

function acceptthisCallPlease() {
  console.log("Inside acceptthisCallPlease");
  twilioDevice.audio
    .setInputDevice(lastselectedInputDevice)
    .then(() => {
      currcon.accept();
      console.log("After accept acceptthisCallPlease");
      reflectAcceptedCallInPopup();
    })
    .catch((error) => {
      // The audio device could not be set. Something has failed,
      // possibly a hardware (headset) failure.
      // Inform the user and try again or hang up the call.
      // Here you can also report this to your backend or system admin to help with the issue
    });

  // console.log(currcon.parameters.CallSid);

  if (
    jcbackcookie == "4adcf5f62d5c04cef5b8d129203f8972dd0ac3be" ||
    jcbackcookie == "3e0d451b99acb4cfac8c940c865daa61c8be92db" ||
    jcbackcookie == "f70151179156df5e7fbdbffddef4a656c9df4810" ||
    jcbackcookie == "c336e5bc82b6fcf5ff11badf760c1e077f89ef78" ||
    jcbackcookie == "a38f5bccc03ae41f0f0543a14b9dd3fba54ea7f9" ||
    jcbackcookie == "e44c679c4396c1677ea3088324d01a89" ||
    jcbackcookie == "6b9a96c45ea843ca3648d5f7affca7b95844e5d2" ||
    jcbackcookie == "d6f873fd5959933ed51e87e5af8bc6af1b62a89f" ||
    jcbackcookie == "ad6003a9678e6754114dec02680b8db86d8d81d5" ||
    jcbackcookie == "923f902a6eac46d60c3fcb89069e3b24" ||
    jcbackcookie == "699ab11c6ac5b686b9f5d17935bda8f78fb1766e" ||
    jcbackcookie == "d67b45dd1409f5099fd1b1ebfdf0a223eaa58e30" ||
    jcbackcookie == "40e9b2995120ec746d5e6e68dda60b434b4101a5" ||
    jcbackcookie == "95829701ce517ffa4662c6929ca4627473ba0ca8" ||
    jcbackcookie == "2d0d591b6ef385e02dad70aac2992579" ||
    jcbackcookie == "e4ac8e83342e71e84475d5b9d21d90a226cb7a52" ||
    jcbackcookie == "8bff22941178fd6ae3d4af4e5e9ec60856a5dba4" ||
    jcbackcookie == "e73d27ff9beea5e3863d2395923f45e06be9e1a8" ||
    jcbackcookie == "53b627bb0b83cb082e27bf374e6b7f7a" ||
    jcbackcookie == "489b25df84b54da25f3c31339963713787059a2c" ||
    jcbackcookie == "3a28749f7bc56fead76a747d89fc12f548bdd3f4" ||
    jcbackcookie == "cfd9171cc0e5ddcad67d599ce9dedf35aff5d1fa"
  ) {
    setTimeout(function () {
      currcon.sendDigits("1");
    }, 2000);
  }

  if (answer_senddigits == 1) {
    setTimeout(function () {
      currcon.sendDigits("1");
    }, 2000);
  }

  // chrome.tabs.query({}, function(tabs) {
  //   var message = {"acceptcall_ui": "acceptcall"};
  //   for (var i=0; i<tabs.length; ++i) {
  //     chrome.tabs.sendMessage(tabs[i].id, message);
  //   }
  // });
}

chrome.notifications.onButtonClicked.addListener(function (
  notificationId,
  buttonIndex
) {
  console.log("-- clicked on button: " + buttonIndex);

  // closeIncomingCallNotification();
  chrome.notifications.clear("IncomingCall");

  if (buttonIndex == 0) {
    // answerCall();
    console.log("going to accept the call");
    console.log(currcon);
    acceptthisCallPlease();
    // busy_callsid=currcon.parameters.CallSid;
    // update_busystatus(jcbackcookie,busy_callsid,'7055eced15538bfb7c07f8a5b28fc5d0');
    // // console.log(currcon.parameters.CallSid);

    // if (jcbackcookie == '4adcf5f62d5c04cef5b8d129203f8972dd0ac3be' || jcbackcookie == '3e0d451b99acb4cfac8c940c865daa61c8be92db' || jcbackcookie == 'f70151179156df5e7fbdbffddef4a656c9df4810' || jcbackcookie == 'c336e5bc82b6fcf5ff11badf760c1e077f89ef78' || jcbackcookie == 'a38f5bccc03ae41f0f0543a14b9dd3fba54ea7f9'||jcbackcookie=="e44c679c4396c1677ea3088324d01a89"||jcbackcookie=="6b9a96c45ea843ca3648d5f7affca7b95844e5d2"||jcbackcookie=="d6f873fd5959933ed51e87e5af8bc6af1b62a89f"||jcbackcookie=="ad6003a9678e6754114dec02680b8db86d8d81d5"||jcbackcookie=="923f902a6eac46d60c3fcb89069e3b24"||jcbackcookie=="699ab11c6ac5b686b9f5d17935bda8f78fb1766e"||jcbackcookie=="d67b45dd1409f5099fd1b1ebfdf0a223eaa58e30"||jcbackcookie=="40e9b2995120ec746d5e6e68dda60b434b4101a5"||jcbackcookie=="95829701ce517ffa4662c6929ca4627473ba0ca8" || jcbackcookie=="2d0d591b6ef385e02dad70aac2992579"||jcbackcookie=="e4ac8e83342e71e84475d5b9d21d90a226cb7a52"||jcbackcookie=="8bff22941178fd6ae3d4af4e5e9ec60856a5dba4"||jcbackcookie=="e73d27ff9beea5e3863d2395923f45e06be9e1a8"||jcbackcookie=="53b627bb0b83cb082e27bf374e6b7f7a"||jcbackcookie=="489b25df84b54da25f3c31339963713787059a2c"||jcbackcookie=="3a28749f7bc56fead76a747d89fc12f548bdd3f4"||jcbackcookie=="cfd9171cc0e5ddcad67d599ce9dedf35aff5d1fa") {
    //   setTimeout(function(){
    //     currcon.sendDigits('1');
    //   },2000);
    // }

    // if (answer_senddigits==1) {
    //   setTimeout(function(){
    //     currcon.sendDigits('1');
    //   },2000);
    // }

    // chrome.tabs.query({}, function(tabs) {
    //   var message = {"acceptcall_ui": "acceptcall"};
    //   for (var i=0; i<tabs.length; ++i) {
    //     chrome.tabs.sendMessage(tabs[i].id, message);
    //   }
    // });
  } else if (buttonIndex == 1) {
    // hangupCall();
    // currcon.ignore();
    currcon.reject();
    stopindicatingIncomingCallPopupWindow(0);
    twilioDevice.disconnectAll();
    if (hold_status == 0 && merge_status == 0) {
      update_busystatus(
        jcbackcookie,
        busy_callsid,
        "56018323b921dd2c5444f98fb45509de",
        "Rejected_via_notification_ext"
      );
      console.log("hanging up call");
      mutestate = 0;

      // saveAudioDevices();
      saveErrorlogs();

      if (warningTimer) {
        clearInterval(warningTimer);
      }
      callErrorLogs = [];
      callErrorIndex = -1;

      // chrome.tabs.query({}, function(tabs) {
      //   var message = {"twiliodisconnect": "twiliodisconnect"};
      //   for (var i=0; i<tabs.length; ++i) {
      //     chrome.tabs.sendMessage(tabs[i].id, message);
      //   }
      // });

      mutestate = 0;
      hold_status = 0;
      hold_status_check = 0;
      secure_status = 0;
      merge_status = 0;
    }
  }
});
