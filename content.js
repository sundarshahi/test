var retrievedObject = null;

// console.log("jc chrome extension");

var allhrefs = $("a[href^='tel']");
var alldoublehrefs = $('a[href^="tel:"]');
var selectedzohojson = [];
var selectedzohonumberjson = [];
var selectedzohonamejson = [];

var selectedzohomodulejson = [];
var showicons = 1;
var showiconsready = 0;

var salesforce_addon = "false";

chrome.storage.local.get("checkedvalue", function (result) {
  retrievedObject = result.checkedvalue;
  // console.log("retrievedObject is "+retrievedObject);

  if (retrievedObject == undefined) {
    retrievedObject = null;
  }

  if (retrievedObject != null) {
    if (retrievedObject == 0) {
      //uncheck the checkbox
      showicons = 0;
    } else if (retrievedObject == 1) {
      //check the checkbox
      showicons = 1;
    }
  } else {
    //check the checkbox
    showicons = 1;
  }

  showiconsready = 1;
  var host = window.location.hostname;
  if (host == "app.leadsimple.com") {
    replaceLeadSimpleHrefs();
  } else {
    replaceHrefs(allhrefs);
    replaceDoubleHrefs(alldoublehrefs);
  }
});
var jc_cookie = "";
var disablednotes = 0;

var updatednumber = "";
var thistime = "";

var frontcompose = 0;

var isInstalledNode = document.createElement("div");
isInstalledNode.id = "extension-is-installed-justcallio";
isInstalledNode.setAttribute(
  "data-version",
  chrome.runtime.getManifest().version
);
// console.log("hostname is ", window.location.hostname);
var hostnameis = window.location.hostname;

if (hostnameis == "justcall.io" || hostnameis == "myhometouch.com") {
  document.body.insertBefore(isInstalledNode, document.body.childNodes[0]);
}

var fa = document.createElement("style");
fa.type = "text/css";
fa.textContent =
  '@font-face { font-family: FontAwesome; src: url("' +
  chrome.extension.getURL("font-awesome/fonts/fontawesome-webfont.woff") +
  '"); }';
document.head.appendChild(fa);

var jc_calltimer;

var incomingdiv;

var conn_params;

var jc_transfer_name;
var jc_transfer_number;
var jc_transfer_type;
var jc_transfer_hash;
var jcnumber;

var unhold_xhr;

function showCallDiv(from, jc_callsid) {
  clearInterval(jc_calltimer);

  var jc_incomingdiv =
    '<div id="jc_incomingdiv" style="width:310px;height:418px;background: rgba(62, 70, 81, 0.98);z-index:9999999999999999999999;bott;bottom: -428display:inline-blockpx;position: fixed;display:block;right: 25px;border-radius:7px;box-shadow:0 4px 6px rgba(0, 0, 0, 0.3);text-align:center;line-height: 20px;transition: all 0.7s;">' +
    '<div id="integrationdiv" style="height:45px;margin-top:-40px;cursor:pointer;display:none">' +
    '<p style="padding: 10px;text-align: left;position: absolute;color: white !important;display:inline-block;left: 10px;font-size: 16px;vertical-align: middle;/* color: #ffffff; */font-family: Roboto, Arial, sans-serif;margin-top: 0px;margin-bottom:5px;" id="int_name"></p>' +
    '<p id="int_img" style="padding: 0px;text-align: right;color: white;display:inline-block;line-height:1px;position: absolute;right:10px;margin: 5px;">' +
    "</p>" +
    "</div>" +
    '<img id="jc_chrome_logo" src="https://justcall.io/app/assets/images/jc_logo.png" style="height: 20px;position: absolute;top: 36px;padding: 7px;right: 0;border: 1px solid white;border-right: none;background: rgba(0, 0, 0, 0.24);border-top-left-radius: 6px;border-bottom-left-radius: 8px;opacity: 0.6;transition: all 0.7s;display:none">' +
    '<i id="jc_ignorecall" class="fa fa-minus"></i>' +
    '<div class="jc_min_tooltip">' +
    '<i class="fa fa-caret-up" style="position: absolute; right:  30px; top: 18px; right: 29px; color: #2d333a; font-size: 22px;"></i>' +
    '<span class="jc_min_tooltip_txt">Minimize Call</span>' +
    "</div>" +
    '<i id="jc_maximizecall" class="fa fa-plus"></i>' +
    '<span id="jc_oncall_span">On Call: <span style="color:white">' +
    from +
    "</span></span>" +
    '<div id="jc_integrationdiv" style="position:absolute;z-index: 999999;">' +
    '<img class="jc_incomingimg" id="jc_img_zendesk" src="https://cdn.justcall.io/extension/zendesk.jpg" style="width: 20px;height: 20px;position: relative;top: 6px;padding: 3px;border-radius: 6px;background: white;margin-left: 6px;transition: all 0.3s;display:none;">' +
    '<img class="jc_incomingimg" id="jc_img_salesforce" src="https://cdn.justcall.io/extension/Salesforce.jpg" style="width: 30px;height: 20px;position: relative;top: 6px;padding: 3px;border-radius: 6px;background: white;margin-left: 6px;transition: all 0.3s;display:none;">' +
    '<img class="jc_incomingimg" id="jc_img_infusionsoft" src="https://cdn.justcall.io/extension/infusionsoft.jpg" style="width: 20px;height: 20px;position: relative;top: 6px;padding: 3px;border-radius: 6px;background: white;margin-left: 6px;transition: all 0.3s;display:none;">' +
    '<img class="jc_incomingimg" id="jc_img_kustomer" src="https://cdn.justcall.io/extension/kustomer.jpg" style="width: 68px;height: 16px;position: relative;top: 6px;padding: 3px;border-radius: 6px;background: white;margin-left: 6px;transition: all 0.3s;display:none;">' +
    '<img class="jc_incomingimg" id="jc_img_pipedrive" src="https://cdn.justcall.io/extension/pipedrive.jpg" style="width: 58px;height: 15px;position: relative;top: 6px;padding: 4px;padding-left: 3px;padding-right: 2px;border-radius: 6px;background: white;margin-left: 6px;transition: all 0.3s;display:none;">' +
    '<img class="jc_incomingimg" id="jc_img_freshdesk" src="https://cdn.justcall.io/extension/freshdesk.jpg" style="width: 47px;height: 20px;position: relative;top: 6px;padding: 3px;border-radius: 6px;background: white;margin-left: 6px;transition: all 0.3s;display:none;">' +
    '<img class="jc_incomingimg" id="jc_img_freshsales" src="https://cdn.justcall.io/extension/freshsales.jpg" style="width: 73px;height: 20px;position: relative;top: 6px;padding: 3px;border-radius: 6px;background: white;margin-left: 6px;transition: all 0.3s;display:none;">' +
    '<img class="jc_incomingimg" id="jc_img_zoho" src="https://cdn.justcall.io/extension/zoho.jpg" style="width: 53px;height: 20px;position: relative;top: 6px;padding: 3px;border-radius: 6px;background: white;margin-left: 6px;transition: all 0.3s;display:none;">' +
    '<img class="jc_incomingimg" id="jc_img_intercom" src="https://cdn.justcall.io/extension/Intercom_blue_symbol.jpg" style="width: 20px;height: 20px;position: relative;top: 6px;padding: 3px;border-radius: 6px;background: white;margin-left: 6px;transition: all 0.3s;display:none;">' +
    '<img class="jc_incomingimg" id="jc_img_groove" src="https://cdn.justcall.io/extension/groove.jpg" style="width: 40px;height: 20px;position: relative;top: 6px;padding: 3px;border-radius: 6px;background: white;margin-left: 6px;transition: all 0.3s;display:none;">' +
    '<img class="jc_incomingimg" id="jc_img_helpscout" src="https://cdn.justcall.io/extension/helpscout-logo.jpg" style="width: 71px;height: 18px;position: relative;top: 6px;padding: 3px;border-radius: 6px;background: white;margin-left: 6px;transition: all 0.3s;display:none;">' +
    '<img class="jc_incomingimg" id="jc_img_desk" src="https://cdn.justcall.io/extension/desk.jpg" style="width: 46px;height: 26px;position: relative;top: 6px;padding: 0px;border-radius: 6px;background: white;margin-left: 6px;transition: all 0.3s;display:none;">' +
    '<img class="jc_incomingimg" id="jc_img_agile" src="https://cdn.justcall.io/extension/agile.jpg" style="width: 76px;height: 17px;position: relative;top: 6px;padding: 3px;border-radius: 6px;background: white;margin-left: 6px;transition: all 0.3s;display:none;">' +
    '<img class="jc_incomingimg" id="jc_img_slack" src="https://cdn.justcall.io/extension/slack.jpg" style="width: 52px;height: 20px;position: relative;top: 6px;padding: 3px;border-radius: 6px;background: white;margin-left: 6px;transition: all 0.3s;display:none;">' +
    '<img class="jc_incomingimg" id="jc_img_hubspot" src="https://cdn.justcall.io/extension/hubspot.jpg" style="width: 48px;height: 20px;position: relative;top: 6px;padding: 3px;border-radius: 6px;background: white;margin-left: 6px;transition: all 0.3s;display:none;">' +
    '<img class="jc_incomingimg" id="jc_img_front" src="https://cdn.justcall.io/extension/front.jpg" style="width: 60px;height: 18px;position: relative;top: 6px;padding: 3px;border-radius: 6px;background: white;margin-left: 6px;transition: all 0.3s;display:none;">' +
    '<img class="jc_incomingimg" id="jc_img_zapier" src="https://cdn.justcall.io/extension/zapier.jpg" style="width: 40px;height: 20px;position: relative;top: 6px;padding: 3px;padding-left: 5px;padding-right: 5px;border-radius: 6px;background: white;margin-left: 6px;transition: all 0.3s;display:none;">' +
    '<img class="jc_incomingimg" id="jc_img_synchroteam" src="https://cdn.justcall.io/extension/logo-synchroteam.jpg" style="width: 63px;height: 20px;position: relative;top: 6px;padding: 3px;padding-left: 5px;padding-right: 5px;border-radius: 6px;background: white;margin-left: 6px;transition: all 0.3s;display:none;">' +
    '<img class="jc_incomingimg" id="jc_img_prosperworks" src="https://cdn.justcall.io/extension/logo-68923ccd427de8c06006f6bf040f5039.jpg" style="width: 20px;height: 20px;position: relative;top: 6px;padding: 3px;border-radius: 6px;background: white;margin-left: 6px;transition: all 0.3s;display:none;">' +
    "</div>" +
    '<div id="idadv">' +
    // '<i id="jc_ignoreconn" class="fa fa-times"></i>'+
    // '<span class="jc_arrow"></span>'+
    '<div class="jc_ignore_tooltip">' +
    '<i class="fa fa-caret-up" style="position: absolute; right:  0; top: 18px; right: 9px; color: #2d333a; font-size: 22px;"></i>' +
    '<span class="jc_ignore_tooltip_txt">Ignore Call</span>' +
    "</div>" +
    // '<div class="jc_min_tooltip">'+
    //   '<i class="fa fa-caret-up" style="position: absolute; right:  30px; top: 18px; right: 9px; color: #2d333a; font-size: 22px;"></i>'+
    //   '<span class="jc_min_tooltip_txt">Minimize Call</span>'+
    // '</div>'+

    '<div class="jc-circle">' +
    '<img class="jc_incoming_image" src="https://cdn.justcall.io/extension/call.jpg" alt="Avatar" style="height:65px;width:65px;border-radius:50%;">' +
    "</div>" +
    "</br>" +
    '<p style="font-size: 13px;color: #9da5ad;font-family: Roboto, Arial, sans-serif;margin-top: 85px;margin-bottom: 2px;">Incoming call</p>' +
    '<p style="font-size: 20px;color: #ffffff;font-family: Roboto, Arial, sans-serif;margin-top: 0px;margin-bottom:5px;" id="jc_callername">' +
    from +
    "</p>" +
    '<p style="font-size: 13px;color: #9da5ad;font-family: Roboto, Arial, sans-serif;margin-top: -4px;margin-bottom: 2px;display:none;" id="jc_callernumber">' +
    from +
    "</p>" +
    '<i class="fa fa-phone answercall_btn" style="margin-top: 10px;position: absolute;left: 79px;cursor: pointer;font-size: 28px;background: #3598db;padding: 12px;padding-left: 15px;padding-right: 16px;color: white;bottom: 94px;border-radius: 50%;-webkit-text-stroke: #3598db;-webkit-text-stroke-width: 1px;" id="jc_acceptcall"></i>' +
    '<span class="jc_answer_tooltip">Answer Call</span>' +
    '<i class="fa fa-times dismisscall_btn" style="margin-top: 10px;position: absolute;right: 76px;cursor: pointer;bottom: 94px;font-size: 28px;background: #242c38;padding: 13px;padding-left: 17px;padding-right: 17px;color: white;border-radius:50%;-webkit-text-stroke: #242c38;-webkit-text-stroke-width: 3px;" id="jc_ignoreconn"></i>' +
    '<span class="jc_ignorecall_tooltip">Ignore Call</span>' +
    '<p style="font-size: 12px;color: #9da5ad;font-family: Roboto, Arial, sans-serif;bottom: 42px;left: 132px;position: absolute;text-decoration:underline;cursor:pointer;" id="jc_hangupcall">Hang Up</p>' +
    '<p style="font-size: 13px;color: white;font-family: Roboto, Arial, sans-serif;display: block;bottom: -13px;position: absolute;background: black;width: 100%;border-bottom-left-radius: 7px;border-bottom-right-radius: 7px;padding-top: 2px;padding-bottom: 2px;display:none;" id="jc_inc_jcnumber">Line: <strong>Loading..</strong></p>' +
    "</div>" +
    '<div id="incalldiv" style="display:none">' +
    //Notes Thing [STARTS HERE]
    '<i class="fa fa-file-text" aria-hidden="true" style="position: absolute;left: 8px;font-size: 23px;t;top: 43px;cursor: pointer;color: #f9dd45;" id="jc_show_notes"></i>' +
    '<div id="jc_incall_notes" style="bottom: -400px">' +
    '<div style="background: #7f6c04;height: 30px;border-top-right-radius: 4px; border-top-left-radius: 4px;border-bottom: 2px dotted #655606;">' +
    '<i class="fa fa-times" id="jc_close_notes" aria-hidden="true" style="color: #4c4104; float: right; padding-top: 8px; padding-right: 9px; font-size: 14px; cursor: pointer;"></i>' +
    "</div>" +
    '<textarea id="jc_notes_textarea" style="width: 200px;height: 170px;background: #f9dd45;padding: 6px;border:none; !important"></textarea>' +
    "</div>" +
    //Notes Thing [ENDS HERE]

    '<div class="jc-circle" style="height: 46px;width: 46px;top: 48px;">' +
    '<img class="jc_incoming_image" src="https://justcall.io/app/assets/images/call.jpg" alt="Avatar" style="height: 46px;width: 46px;border-radius:50%;">' +
    "</div>" +
    "</br>" +
    '<p style="font-size: 11px;color: #9da5ad;font-family: Roboto, Arial, sans-serif;margin-top: 25px;margin-bottom: -1px;">In call</p>' +
    '<p id="jc_callernumber_incall" style="font-size: 16px;color: #ffffff;font-family: Roboto, Arial, sans-serif;margin-top: 0px;margin-bottom: 8px;">' +
    from +
    "</p>" +
    '<span id="jc_calltimer" style="font-size: 11px;color: #ffffff;font-family: Roboto, Arial, sans-serif;padding: 4px;padding-left: 7px;padding-right: 7px;border: 1px solid #9da5ad;border-radius: 12px;">00:00:00</span>' +
    "<div>" +
    //Mute
    '<i class="fa fa-microphone" style="margin-top: 12px;position: absolute;left: 104px;cursor: pointer;bottom: 183px;font-size: 22px;background: none;border: 1px solid #9da5ad;padding: 11px;padding-left: 15px;padding-right: 16px;color: white;border-radius:50%;" id="jc_mutecallbtn"></i>' +
    //Mute-Label
    '<p style="font-size: 11px;color: #9da5ad;font-family: Roboto, Arial, sans-serif;margin-top: 81px;margin-left: 115px;position: absolute;">Mute</p>' +
    "</div>" +
    "<div>" +
    //Hold
    '<i class="fa fa-pause" style="margin-top: 12px;position: absolute;left: 166px;cursor: pointer;bottom: 183px;font-size: 22px;background: none;border: 1px solid #9da5ad;padding: 11px;padding-left: 13px;padding-right: 13px;color: white;-webkit-text-stroke: #424a54;-webkit-text-stroke-width: 3px;border-radius:50%;" id="jc_holdcallbtn"></i>' +
    //Hold-Label
    '<p style="font-size: 11px;color: #9da5ad;font-family: Roboto, Arial, sans-serif;margin-top: 81px;margin-left: 179px;position: absolute;">Hold</p>' +
    "</div>" +
    "<div>" +
    //Transfer
    '<i class="fa fa-share" style="margin-top: 12px;position: absolute;left: 166px;cursor: pointer;bottom: 103px;font-size: 16px;background: none;border: 1px solid #9da5ad;padding: 14px;padding-left: 15px;padding-right: 14px;color: white;border-radius:50%;" id="jc_transfercall"></i>' +
    //Transfer-Label
    '<p style="font-size: 11px;color: #9da5ad;font-family: Roboto, Arial, sans-serif;margin-top: 162px;margin-left: 170px;position: absolute;">Transfer</p>' +
    "</div>" +
    "<div>" +
    //Keypad
    '<i class="fa fa-th" style="margin-top: 12px;position: absolute;left: 104px;cursor: pointer;bottom: 103px;font-size: 19px;background: none;border: 1px solid #9da5ad;padding: 12px;padding-left: 13px;padding-right: 12px;color: white;border-radius:50%;" id="jc_keypad"></i>' +
    //Keypad-Label
    '<p style="font-size: 11px;color: #9da5ad;font-family: Roboto, Arial, sans-serif;margin-top: 162px;margin-left: 109px;position: absolute;">Keypad</p>' +
    "</div>" +
    '<i class="fa fa-times" style="margin-top: 12px;position: absolute;right: 127px;cursor: pointer;bottom: 11px;font-size: 28px;background: #242c38;padding: 10px;padding-left: 13px;padding-right: 13px;color: white;border-radius:50%;-webkit-text-stroke: #242c38;-webkit-text-stroke-width: 3px;" id="jc_hangupcall_incall"></i>' +
    '<div id="jc_merge_badge" style="position: absolute; bottom: 8px; background: #F44336; left: 10px; color: white; padding-left: 6px; padding-right: 6px; border-radius: 7px; font-family: Roboto, Arial, sans-serif; font-size:12px;display:none;">Failed to merge</div>' +
    '<i class="fa fa-unlock-alt" style="margin-top: 12px;position: absolute;left: 9px;cursor: pointer;bottom: 10px;f;font-size: 14px;background: none;border: 1px solid #9da5ad;p;padding: 5px;padding-left: 8px;padding-right: 8px;color: white;border-radius:50%;display:none" id="jc_securecallbtn"></i>' +
    "</div>" +
    // '<div id="jc_transferscreen_1" style="display:none">'+
    // '<p id="jc_transfercall_span" style="font-size: 14px;color: white;font-family: Roboto, Arial, sans-serif;margin-top: 14px;margin-bottom: 2px;">Transfer/Merge call</p>'+
    //   '<p style="font-size: 13px;color: #9da5ad;font-family: Roboto, Arial, sans-serif;margin-top: 45px;margin-bottom: 2px;">Select type</p>'+

    //   '<select class="form-control" id="jc_transfertype" style="width: 80%;height: 29px;position: absolute;left: 32px;text-align: left;font-size: 12px;">'+
    //       '<option value="1">Transfer Call</option>'+
    //       '<option value="2">Merge Call</option>'+
    //     '</select>'+

    //   '<p style="font-size: 13px;color: #9da5ad;font-family: Roboto, Arial, sans-serif;margin-top: 19px;margin-bottom: 2px;">Select a team member</p>'+

    //   '<select class="form-control" id="jc_teammembers" style="width: 80%;height: 29px;position: absolute;left: 32px;text-align: left;font-size: 12px;">'+
    //     '<optgroup label="Team Members" id="jc_group_member"></optgroup>'+
    //     '<optgroup label="Teams" id="jc_group_team"></optgroup>'+
    //   '</select>'+

    //   '<button style="top: 190px;position: absolute;right: 112px;font-size: 15px;background: #3598db;padding: 10px 15px 10px 15px;color: white;font-family: Roboto, Arial, sans-seri;border: none;border-radius: 6px;" id="jc_transfercallbtn">Transfer</button>'+

    // '</div>'+

    //Transfer New
    '<div id="jc_transferscreen" style="display:none">' +
    '<p style="font-size: 13px;color: #9da5ad;font-family: Roboto, Arial, sans-serif;margin-top: 19px;margin-bottom: 2px;">Transfer to..</p>' +
    '<input id="jc_transfer_search" type="text" placeholder="Type a contact name or number" style="width:230px;padding:7px;"></input>' +
    '<div id="jc_transferscreen_buttons" style="position:  absolute; padding: 80px; background: rgba(66, 73, 83, 0.88); z-index: 9999; display:none;">' +
    '<span id="jc_btn_transfer" style="font-size: 12px; background: #3598db; padding: 7px 15px 7px 15px; color: white; font-family: Roboto, Arial, sans-seri; border: none; border-radius: 5px; display:  block; cursor:pointer;">Transfer Now</span>' +
    '<span id="jc_btn_merge" style="font-size: 12px; background: #3598db; padding: 7px 15px 7px 15px; color: white; font-family: Roboto, Arial, sans-seri; border: none; border-radius: 5px; display: block; margin-top: 20px; cursor:pointer;">Talk to Contact First</span>' +
    '<span id="jc_btn_cancel" style="font-size: 11px;background: #ee5e82;padding: 2px;color: white;font-family: Roboto, Arial, sans-seri;border: none;border-radius: 5px;display: block;margin-top: 33px;cursor:pointer;">Cancel</span>' +
    "</div>" +
    '<ul class="jc_transfer_ul" style="list-style: none;padding-top: 20px;padding-left: 0px;max-height: 225px;overflow-y: scroll">' +
    '<li class="jc_transfer_li">' +
    // '<span class="jc_transfer_li_name">Contact Name</span>'+
    // '<span class="jc_transfer_li_number">+91 8826 349 369</span>'+
    // '<span class="jc_transfer_li_type">Member</span>'+
    "</li>" +
    "</ul>" +
    '<div id="jc_invalidnumber_badge" style="position: absolute; bottom: 8px; background: #ee5e82; left: 10px; color: white; padding-left: 6px; padding-right: 6px; border-radius: 7px; font-family: Roboto, Arial, sans-serif; font-size:12px;display:none;z-index:99999999">Invalid number</div>' +
    '<i class="fa fa-arrow-left" style="margin-top: 12px;position: absolute;right: 127px;cursor: pointer;bottom: 20px;font-size: 21px;background: #242c38;padding: 14px;padding-left: 17px;padding-right: 17px;color: white;border-radius:50%;-webkit-text-stroke: #242c38;-webkit-text-stroke-width: 3px;" id="jc_transfer_goback"></i>' +
    "</div>" +
    //Merge Screen
    '<div id="jc_merge_screen" style="display:none">' +
    '<div id="jc_merge_onhold" style="top: 33px;background: #8BC34A;width: 100%;position: relative;font-size: 12px;color: white;font-family: Roboto, Arial, sans-serif;">On Hold: ' +
    from +
    "</div>" +
    '<div class="jc-circle" style="height: 46px;width: 46px;top: 52px;">' +
    '<img src="https://justcall.io/app/assets/images/call.jpg" alt="Avatar" style="height: 46px;width: 46px;border-radius:50%;">' +
    "</div>" +
    '<p style="font-size: 13px;color: #9da5ad;font-family: Roboto, Arial, sans-serif;margin-top: 103px;" id="jc_merge_calling">Calling</p>' +
    "</br>" +
    '<i class="fa fa-plus" style="margin-top: 10px;position: absolute;left: 79px;cursor: pointer;bottom: 45px;font-size: 28px;background: #3598db;padding: 13px;padding-left: 17px;padding-right: 17px;color: white;border-radius:50%;-webkit-text-stroke: #3598db;-webkit-text-stroke-width: 3px;" id="jc_merge_accept"></i>' +
    '<i class="fa fa-times" style="margin-top: 10px;position: absolute;right: 76px;cursor: pointer;bottom: 45px;font-size: 28px;background: #242c38;padding: 13px;padding-left: 17px;padding-right: 17px;color: white;border-radius:50%;-webkit-text-stroke: #242c38;-webkit-text-stroke-width: 3px;" id="jc_merge_reject"></i>' +
    "</div>" +
    //Call End Notes Screen
    '<div id="innotesdiv" style="display:none">' +
    '<p id="jc_addnote_span" style="font-size: 13px;color: #9da5ad;font-family: Roboto, Arial, sans-serif;margin-top: 15px;margin-bottom: 2px;">Add a note</p>' +
    '<textarea class="input-unstyled  autogrow" placeholder="Notes" id="jc_callendnotes" style="width: 260px;height: 197px;background: rgba(0, 0, 0, 0.13);color: white;border-color: rgba(0, 0, 0, 0.13);margin-top: 35px;resize: none;"></textarea>' +
    '<select id="jc_disposition_select" style="display: none;width: 250px;margin-top: 9px;height: 27px;margin-bottom: 4px;">' +
    "</select>" +
    '<i class="fa fa-check" style="margin-top: 12px;position: absolute;right: 127px;cursor: pointer;bottom: 20px;font-size: 21px;background: #242c38;padding: 14px;color: white;border-radius:50%;-webkit-text-stroke: #242c38;-webkit-text-stroke-width: 3px;" id="jc_savenotes_btn"></i>' +
    '<span id="notes_saved_badge" style="color: #252d39; position:  absolute; right: 16px; background: lightyellow; bottom: 15px; font-size: 11px; padding: 0px 11px; border-radius: 16px; display:none;">Saving..</span>' +
    "</div>" +
    //Keypad Screen
    '<div id="jc_keypad_screen" style="display:none">' +
    '<span class="jc_keypad_css" style="margin-top: 12px;position: absolute;left: 42px;cursor: pointer;top: 54px;font-size: 16px;background: none;border: 1px solid #9da5ad;padding: 15px;padding-left: 30px;padding-right: 30px;color: white;" id="jc_press_1">1</span>' +
    '<span class="jc_keypad_css" style="margin-top: 12px;position: absolute;left: 121px;cursor: pointer;top: 54px;font-size: 16px;background: none;border: 1px solid #9da5ad;padding: 15px;padding-left: 30px;padding-right: 30px;color: white;" id="jc_press_2">2</span>' +
    '<span class="jc_keypad_css" style="margin-top: 12px;position: absolute;left: 200px;cursor: pointer;top: 54px;font-size: 16px;background: none;border: 1px solid #9da5ad;padding: 15px;padding-left: 30px;padding-right: 30px;color: white;" id="jc_press_3">3</span>' +
    '<span class="jc_keypad_css" style="margin-top: 12px;position: absolute;left: 42px;cursor: pointer;top: 115px;font-size: 16px;background: none;border: 1px solid #9da5ad;padding: 15px;padding-left: 30px;padding-right: 30px;color: white;" id="jc_press_4">4</span>' +
    '<span class="jc_keypad_css" style="margin-top: 12px;position: absolute;left: 121px;cursor: pointer;top: 115px;font-size: 16px;background: none;border: 1px solid #9da5ad;padding: 15px;padding-left: 30px;padding-right: 30px;color: white;" id="jc_press_5">5</span>' +
    '<span class="jc_keypad_css" style="margin-top: 12px;position: absolute;left: 200px;cursor: pointer;top: 115px;font-size: 16px;background: none;border: 1px solid #9da5ad;padding: 15px;padding-left: 30px;padding-right: 30px;color: white;" id="jc_press_6">6</span>' +
    '<span class="jc_keypad_css" style="margin-top: 12px;position: absolute;left: 42px;cursor: pointer;top: 175px;font-size: 16px;background: none;border: 1px solid #9da5ad;padding: 15px;padding-left: 30px;padding-right: 30px;color: white;" id="jc_press_7">7</span>' +
    '<span class="jc_keypad_css" style="margin-top: 12px;position: absolute;left: 121px;cursor: pointer;top: 175px;font-size: 16px;background: none;border: 1px solid #9da5ad;padding: 15px;padding-left: 30px;padding-right: 30px;color: white;" id="jc_press_8">8</span>' +
    '<span class="jc_keypad_css" style="margin-top: 12px;position: absolute;left: 200px;cursor: pointer;top: 175px;font-size: 16px;background: none;border: 1px solid #9da5ad;padding: 15px;padding-left: 30px;padding-right: 30px;color: white;" id="jc_press_9">9</span>' +
    '<span class="jc_keypad_css" style="margin-top: 12px;position: absolute;left: 42px;cursor: pointer;top: 235px;font-size: 24px;background: none;border: 1px solid #9da5ad;padding: 15px;padding-left: 30px;padding-right: 30px;color: white;" id="jc_press_star">*</span>' +
    '<span class="jc_keypad_css" style="margin-top: 12px;position: absolute;left: 121px;cursor: pointer;top: 235px;font-size: 16px;background: none;border: 1px solid #9da5ad;padding: 15px;padding-left: 30px;padding-right: 30px;color: white;" id="jc_press_0">0</span>' +
    '<span class="jc_keypad_css" style="margin-top: 12px;position: absolute;left: 200px;cursor: pointer;top: 235px;font-size: 16px;background: none;border: 1px solid #9da5ad;padding: 15px;padding-left: 30px;padding-right: 30px;color: white;" id="jc_press_hash">#</span>' +
    '<i class="fa fa-arrow-left" style="margin-top: 12px;position: absolute;right: 127px;cursor: pointer;bottom: 20px;font-size: 21px;background: #242c38;padding: 14px;padding-left: 17px;padding-right: 17px;color: white;border-radius:50%;-webkit-text-stroke: #242c38;-webkit-text-stroke-width: 3px;" id="jc_keypad_goback"></i>' +
    "</div>" +
    "</div>";

  $("body").append(jc_incomingdiv);

  $("#jc_acceptcall").click(function () {
    acceptCall();
  });

  $("#jc_hangupcall").click(function () {
    // $('#jc_ignorecall').show();
    hangupincall();
  });

  $("#jc_hangupcall_incall").click(function () {
    hangupincall();
  });

  $("#jc_mutecallbtn").click(function () {
    muteincall();
  });

  $("#jc_holdcallbtn").click(function () {
    holdincall();
  });

  $("#jc_transfercall").click(function () {
    $("#idadv").hide();
    $("#incalldiv").hide();
    $("#jc_integrationdiv").hide();
    $("#integrationdiv").hide();
    jc_gettransferlist_div();
    $("#jc_transferscreen").fadeIn("fast");
  });

  $("#jc_transfercallbtn").click(function () {
    jc_start_transfer(from, jc_callsid);
  });

  $("#jc_keypad").click(function () {
    jc_showkeypad();
  });

  $("#jc_securecallbtn").click(function () {
    jc_start_secure();
  });

  $("#jc_press_1").click(function () {
    jc_press_digit("1");
  });

  $("#jc_press_2").click(function () {
    jc_press_digit("2");
  });

  $("#jc_press_3").click(function () {
    jc_press_digit("3");
  });

  $("#jc_press_4").click(function () {
    jc_press_digit("4");
  });

  $("#jc_press_5").click(function () {
    jc_press_digit("5");
  });

  $("#jc_press_6").click(function () {
    jc_press_digit("6");
  });

  $("#jc_press_7").click(function () {
    jc_press_digit("7");
  });

  $("#jc_press_8").click(function () {
    jc_press_digit("8");
  });

  $("#jc_press_9").click(function () {
    jc_press_digit("9");
  });

  $("#jc_press_0").click(function () {
    jc_press_digit("0");
  });

  $("#jc_press_star").click(function () {
    jc_press_digit("*");
  });

  $("#jc_press_hash").click(function () {
    jc_press_digit("#");
  });

  $("#jc_transfer_search").keyup(function () {
    jc_gettransferlist();
  });

  $(".jc_transfer_li").click(function () {
    $("#jc_transferscreen_buttons").fadeIn("fast");
    $(".jc_transfer_ul").css("filter", "blur(2x)");
  });

  $("#jc_keypad_goback").click(function () {
    $("#idadv").hide();
    $("#jc_keypad_screen").hide();
    $("#incalldiv").fadeIn("fast");
  });

  $("#jc_btn_cancel").click(function () {
    $("#jc_transferscreen_buttons").hide();
  });

  $("#jc_transfer_goback").click(function () {
    $("#idadv").hide();
    $("#jc_transferscreen").hide();
    $("#incalldiv").fadeIn("fast");
  });

  $("#jc_show_notes").click(function () {
    $("#jc_incall_notes").css("bottom", "145px");
    $("#jc_notes_textarea").focus();
  });

  $("#jc_close_notes").click(function () {
    $("#jc_incall_notes").css("bottom", "-400px");
  });

  $("#jc_notes_textarea").keyup(function () {
    $("#jc_callendnotes").val($("#jc_notes_textarea").val());
  });

  $("#jc_savenotes_btn").click(function () {
    jc_updatenotes();
  });

  $("#jc_chrome_logo").click(function () {
    window.open("https://justcall.io/app/", "_blank");
  });

  $("#jc_ignorecall").click(function () {
    chrome.runtime.sendMessage({ ignorecall: "minimize" });
    jc_ignorecall();
  });

  $("#jc_ignoreconn").click(function () {
    jc_ignoreconn();
  });

  $("#jc_maximizecall").click(function () {
    chrome.runtime.sendMessage({ ignorecall: "maximize" });
    jc_maximizecall();
  });

  $("#jc_transfertype").change(function () {
    // chrome.runtime.sendMessage({"ignorecall": "maximize"});
    jc_changetransferbtn();
  });

  $("#jc_merge_accept").click(function () {
    jc_merge_complete("success");
  });

  $("#jc_merge_reject").click(function () {
    jc_merge_complete("fail");
  });

  $("#jc_callendnotes").keyup(function () {
    var notes_modulus = $("#jc_callendnotes").val().length % 20;

    if (notes_modulus == 0 && $("#jc_callendnotes").val().length != 0) {
      jc_updatenotes_keystroke();
    }
  });

  $("#jc_btn_transfer").click(function () {
    if (jc_transfer_type == "Contact" || jc_transfer_type == "Number") {
      $.ajax({
        type: "GET",
        url: "https://justcall.io/api/lookup_chromeext.php",
        data: { number: jc_transfer_number },
        dataType: "json",
        success: function (result) {
          if (result != "fail") {
            $("#jc_invalidnumber_badge").hide();
            jc_transfer_number = result;

            inc_initiate_transferv1();
          } else {
            $("#jc_invalidnumber_badge").fadeIn("fast");
            return 0;
          }
        },
      });
    } else {
      inc_initiate_transferv1();
    }
  });

  function inc_initiate_transferv1() {
    $.ajax({
      type: "POST",
      url: "https://justcall.io/mobile/calling/inc_initiate_transferv1.php",
      data: {
        callsid: jc_callsid,
        clientnumber: jc_transfer_number,
        memberhash: jc_transfer_hash,
        type: jc_transfer_type,
        hash: jc_cookie,
        jcnumber: jcnumber,
      },
      success: function (res) {},
    });
  }

  $("#jc_btn_merge").click(function () {
    if (jc_transfer_type == "Contact" || jc_transfer_type == "Number") {
      $.ajax({
        type: "GET",
        url: "https://justcall.io/api/lookup_chromeext.php",
        data: { number: jc_transfer_number },
        dataType: "json",
        success: function (result) {
          if (result != "fail") {
            $("#jc_invalidnumber_badge").hide();
            jc_transfer_number = result;

            jc_start_merge(jc_transfer_hash);
          } else {
            $("#jc_invalidnumber_badge").fadeIn("fast");
            return 0;
          }
        },
      });
    } else {
      jc_start_merge(jc_transfer_hash);
    }
  });

  var refreshIntervalId = setInterval(function () {
    $("#jc_incomingdiv").css("bottom", "20px");
    clearInterval(refreshIntervalId);
  }, 1000);

  // callerlookup(from,jc_cookie);
  // jcnumberlookup(jc_callsid);
  // jccontactsource(from,jc_cookie);

  //jc_gettransferlist();
  // jc_checksecure(jc_cookie);
  //jc_check_desposition(jc_cookie);
  jc_disablednotes();

  //DON'T FORGET TO COMMENT
  // $('#idadv').hide();
  // $('#incalldiv').show();
  // $('#innotesdiv').show();
}

function jc_ignoreconn() {
  chrome.runtime.sendMessage({ ignore: "ignore" });
  // chrome.runtime.sendMessage({"jc_chrome_ui_reset": "reset"});

  // $('#jc_incomingdiv').css('bottom','-400px');
  // var removediv = setInterval(function(){ $('#jc_incomingdiv').remove(); clearInterval(removediv); }, 1000);
}

function jc_disablednotes() {
  chrome.runtime.sendMessage({ getDisabledNotes: "get" });
}

function jc_ignorecall() {
  // chrome.runtime.sendMessage({"ignorecall": "ignore"});
  $("#jc_incomingdiv").css("bottom", "-389px");
  $("#jc_maximizecall").fadeIn();
  $("#jc_oncall_span").fadeIn();
  $("#jc_integrationdiv").hide();
  $("#integrationdiv").hide();

  $("#jc_ignorecall").hide();
  $(".jc-circle").hide();
  $("#jc_addnote_span").hide();
  $("#jc_transfercall_span").hide();

  // var removediv = setInterval(function(){ $('#jc_incomingdiv').remove(); clearInterval(removediv); }, 1000);
}

function jc_maximizecall() {
  // chrome.runtime.sendMessage({"ignorecall": "ignore"});
  $("#jc_incomingdiv").css("bottom", "20px");
  $("#jc_oncall_span").hide();
  $("#jc_ignorecall").fadeIn();
  $("#jc_integrationdiv").fadeIn();
  $("#jc_maximizecall").hide();
  $(".jc-circle").fadeIn();
  $("#jc_addnote_span").fadeIn();
  $("#jc_transfercall_span").fadeIn();

  // var removediv = setInterval(function(){ $('#jc_incomingdiv').remove(); clearInterval(removediv); }, 1000);
}

function jc_press_digit(digit) {
  chrome.runtime.sendMessage({ jc_press_digit: digit });
}

function muteincall() {
  chrome.runtime.sendMessage({ mutecall: "mute" });
}

function holdincall() {
  chrome.runtime.sendMessage({ holdcall: "hold" });
}

function jc_gettransferlist() {
  var jc_search_term = $("#jc_transfer_search").val();

  var jc_transfer_ul = "";
  $.ajax({
    type: "POST",
    url: "https://justcall.io/api/getcontacts_extv1.php",
    data: {
      hash: jc_cookie,
      search: jc_search_term,
    },
    success: function (res) {
      //console.log(res);
      res = JSON.parse(res);
      //console.log(res);

      if (res.count > 0) {
        $.each(res.data, function (index, value) {
          var jc_transfer_li_type_css = "";
          var orig_value_type = value.type;

          if (value.type == "Member") {
            jc_transfer_li_type_css =
              'style="color: white;background:#4fa954 "';
            if (value.availability == "Unavailable") {
              jc_transfer_li_type_css =
                'style="color: #a0a0a0;background:#252c38 "';
            }
            value.type = value.availability;
          } else if (value.type == "Contact") {
            jc_transfer_li_type_css =
              'style="background: #f26083;color:white "';
          } else if (value.type == "Number") {
          }

          jc_transfer_ul +=
            '<li class="jc_transfer_li" data-name="' +
            value.name +
            '" data-number="' +
            value.number +
            '" data-hash="' +
            value.hash +
            '" data-type="' +
            orig_value_type +
            '">' +
            '<span class="jc_transfer_li_name">' +
            value.name +
            "</span>" +
            '<span class="jc_transfer_li_number">' +
            value.number +
            "</span>" +
            '<span class="jc_transfer_li_type" ' +
            jc_transfer_li_type_css +
            ">" +
            value.type +
            "</span></li>";
        });
      } else {
        jc_transfer_ul = '<span style="color:#9da5a8;">No result found</span>';
      }

      $(".jc_transfer_ul").html(jc_transfer_ul);

      $(".jc_transfer_li").click(function () {
        $("#jc_transferscreen_buttons").fadeIn("fast");
        $(".jc_transfer_ul").addClass("jc_blur");

        jc_transfer_name = $(this).attr("data-name");
        jc_transfer_number = $(this).attr("data-number");
        jc_transfer_type = $(this).attr("data-type");
        jc_transfer_hash = $(this).attr("data-hash");
        var jc_transfer_displaytext = "Talk to " + jc_transfer_name + " first";
        $("#jc_btn_merge").text(jc_transfer_displaytext);
      });
    },
  });
}

function jc_gettransferlist_div() {
  var jc_search_term = "";
  $.ajax({
    type: "POST",
    url: "https://justcall.io/api/getcontacts_extv1.php",
    data: {
      hash: jc_cookie,
      search: jc_search_term,
    },
    success: function (res) {
      //console.log(res);
      res = JSON.parse(res);
      //console.log(res);
      jc_gettransferlist_bck(res);
    },
  });
}

function jc_gettransferlist_bck(res) {
  var jc_transfer_ul = "";

  if (res.count > 0) {
    $.each(res.data, function (index, value) {
      var jc_transfer_li_type_css = "";
      var orig_value_type = value.type;

      if (value.type == "Member") {
        jc_transfer_li_type_css = 'style="color: white;background:#4fa954 "';
        if (value.availability == "Unavailable") {
          jc_transfer_li_type_css =
            'style="color: #a0a0a0;background:#252c38 "';
        }
        value.type = value.availability;
      } else if (value.type == "Contact") {
        jc_transfer_li_type_css = 'style="background: #f26083;color:white "';
      } else if (value.type == "Number") {
      }

      jc_transfer_ul +=
        '<li class="jc_transfer_li" data-name="' +
        value.name +
        '" data-number="' +
        value.number +
        '" data-hash="' +
        value.hash +
        '" data-type="' +
        orig_value_type +
        '">' +
        '<span class="jc_transfer_li_name">' +
        value.name +
        "</span>" +
        '<span class="jc_transfer_li_number">' +
        value.number +
        "</span>" +
        '<span class="jc_transfer_li_type" ' +
        jc_transfer_li_type_css +
        ">" +
        value.type +
        "</span></li>";
    });
  } else {
    jc_transfer_ul = '<span style="color:#9da5a8;">No result found</span>';
  }

  $(".jc_transfer_ul").html(jc_transfer_ul);

  $(".jc_transfer_li").click(function () {
    $("#jc_transferscreen_buttons").fadeIn("fast");
    $(".jc_transfer_ul").addClass("jc_blur");

    jc_transfer_name = $(this).attr("data-name");
    jc_transfer_number = $(this).attr("data-number");
    jc_transfer_type = $(this).attr("data-type");
    jc_transfer_hash = $(this).attr("data-hash");
    var jc_transfer_displaytext = "Talk to " + jc_transfer_name + " first";
    $("#jc_btn_merge").text(jc_transfer_displaytext);
  });
}

function jc_start_merge(memberhash) {
  // var jc_merge_calling_string = $("#jc_teammembers option:selected").text();
  $("#jc_merge_calling").html("Calling " + jc_transfer_name);
  chrome.runtime.sendMessage({
    jc_start_merge:
      memberhash + "^" + jc_transfer_number + "^" + jc_transfer_type,
  });
  chrome.runtime.sendMessage({ jc_start_merge_calling: jc_transfer_name });
}

function jc_merge_screen() {
  $("#idadv").hide();
  $("#incalldiv").hide();
  $("#jc_transferscreen").hide();
  $("#jc_chrome_logo").hide();
  $("#innotesdiv").hide();
  $("#jc_keypad_screen").hide();
  $("#jc_merge_screen").fadeIn();
}

function jc_merge_complete(jc_merge_complete_status) {
  chrome.runtime.sendMessage({ jc_merge_complete: jc_merge_complete_status });
  jc_show_incalldiv();
}

function jc_show_incalldiv() {
  $("#idadv").hide();
  $("#jc_transferscreen").hide();
  $("#jc_chrome_logo").hide();
  $("#jc_merge_screen").hide();
  $("#innotesdiv").hide();
  $("#jc_keypad_screen").hide();
  $("#incalldiv").fadeIn();
}

function jc_start_secure() {
  chrome.runtime.sendMessage({ jc_start_secure: "MERGE" });
}

function showCallDiv1(from) {
  // console.log("show div with call",from);

  incomingdiv = document.createElement("div");
  incomingdiv.id = "incomingdiv";
  incomingdiv.style.width = "300px";
  incomingdiv.style.height = "200px";
  incomingdiv.style.display = "block";
  incomingdiv.style.position = "fixed";
  incomingdiv.style.bottom = "10px";
  incomingdiv.style.borderColor = "rgba(0,0,0,0.4)";
  incomingdiv.style.borderRadius = "5px";
  incomingdiv.style.right = "10px";
  incomingdiv.style.textAlign = "center";
  incomingdiv.style.boxShadow = "5px 5px 15px rgba(0,0,0,0.4)";
  incomingdiv.style.zIndex = "9999999999999999999999";
  incomingdiv.style.lineHeight = "1.5em";

  incomingdiv.style.backgroundColor = "#ffffff";

  var adDiv = document.createElement("div");
  adDiv.id = "idadv";
  // adDiv.style.display="none";

  var img = document.createElement("img");
  img.setAttribute("src", "https://cdn.justcall.io/images/logo-desktop.png");
  img.style.height = "40px";
  img.style.width = "120px";
  img.style.marginTop = "10px";

  var img2 = document.createElement("img");
  img2.setAttribute("src", "https://cdn.justcall.io/images/logo-desktop.png");
  img2.style.height = "40px";
  img2.style.width = "120px";
  img2.style.marginTop = "10px";
  adDiv.appendChild(img2);

  var incomingcallheading = document.createElement("p");
  incomingcallheading.innerHTML = "Incoming call ...";
  incomingcallheading.style.color = "#000000";
  incomingcallheading.style.fontSize = "18px";
  incomingcallheading.style.fontWeight = "400";
  incomingcallheading.style.margin = "0px";
  incomingcallheading.style.padding = "0px";

  adDiv.appendChild(incomingcallheading);

  var incomingcallfrom = document.createElement("p");
  incomingcallfrom.innerHTML = from;
  incomingcallfrom.style.color = "#000000";
  incomingcallfrom.style.fontSize = "18px";
  incomingcallfrom.style.fontWeight = "400";
  incomingcallfrom.style.margin = "0px";
  incomingcallfrom.style.padding = "0px";

  var callerlookup = document.createElement("div");
  callerlookup.id = "callerlookup";

  var callerlookup2 = document.createElement("div");
  callerlookup2.id = "callerlookup2";

  var incom_name = document.createElement("p");
  incom_name.id = "incom_name";
  incom_name.style.color = "#000000";
  incom_name.style.fontSize = "18px";
  incom_name.style.fontWeight = "400";
  incom_name.style.margin = "0px";
  incom_name.style.padding = "0px";
  callerlookup.appendChild(incom_name);

  var incom_name2 = document.createElement("p");
  incom_name2.id = "incom_name2";
  incom_name2.style.color = "#000000";
  incom_name2.style.fontSize = "18px";
  incom_name2.style.fontWeight = "400";
  incom_name2.style.margin = "0px";
  incom_name2.style.padding = "0px";
  callerlookup2.appendChild(incom_name2);

  adDiv.appendChild(callerlookup);

  var incomingcallfrom2 = document.createElement("p");
  incomingcallfrom2.innerHTML = from;
  incomingcallfrom2.style.color = "#000000";
  incomingcallfrom2.style.fontSize = "18px";
  incomingcallfrom2.style.fontWeight = "400";
  incomingcallfrom2.style.margin = "0px";
  incomingcallfrom2.style.padding = "0px";

  adDiv.appendChild(incomingcallfrom2);

  var accepticon = document.createElement("i");
  accepticon.setAttribute("class", "fa fa-phone-square");
  // accepticon.style.height = "60px";
  // accepticon.style.width = "60px";
  accepticon.style.marginTop = "10px";
  accepticon.style.position = "absolute";
  accepticon.style.left = "70px";
  accepticon.style.cursor = "pointer";
  accepticon.style.fontSize = "60px";
  accepticon.style.color = "green";

  accepticon.style.bottom = "20px";
  accepticon.onclick = function () {
    acceptCall();
  };

  adDiv.appendChild(accepticon);

  var rejecticon = document.createElement("i");
  rejecticon.setAttribute("class", "fa fa-phone-square");
  rejecticon.style.fontSize = "60px";
  rejecticon.style.color = "#b13108";
  rejecticon.style.marginTop = "10px";
  rejecticon.style.position = "absolute";
  rejecticon.style.right = "70px";
  rejecticon.style.cursor = "pointer";
  rejecticon.style.bottom = "20px";
  rejecticon.onclick = function () {
    hangupincall();
  };

  var rejecticon2 = document.createElement("i");
  rejecticon2.setAttribute("class", "fa fa-phone-square");
  rejecticon2.style.fontSize = "60px";
  rejecticon2.style.color = "#b13108";
  rejecticon2.style.marginTop = "10px";
  rejecticon2.style.cursor = "pointer";
  rejecticon2.onclick = function () {
    hangupincall();
  };

  adDiv.appendChild(rejecticon);

  var closeicon = document.createElement("i");
  closeicon.setAttribute("class", "fa fa-times");
  // closeicon.style.height = "30px";
  // closeicon.style.width = "30px";
  closeicon.style.cursor = "pointer";

  closeicon.style.position = "absolute";
  closeicon.style.right = "5px";
  closeicon.style.fontSize = "20px";
  closeicon.style.color = "#63c5ed";

  closeicon.style.top = "5px";
  closeicon.onclick = function () {
    $("#jc_incomingdiv").hide();
    chrome.runtime.sendMessage({ ignore: "ignore" });
    // currcon.ignore();
  };

  adDiv.appendChild(closeicon);

  incomingdiv.appendChild(adDiv);

  var incalldiv = document.createElement("div");
  incalldiv.id = "incalldiv";

  var incallheading = document.createElement("p");
  incallheading.innerHTML = "In call";
  incallheading.style.color = "#000000";
  incallheading.style.fontSize = "18px";
  incallheading.style.fontWeight = "400";
  incallheading.style.margin = "0px";
  incallheading.style.padding = "0px";

  var incalltimer = document.createElement("p");
  incalltimer.id = "jc_calltimer";
  incalltimer.innerHTML = "00:00:00";
  incalltimer.style.color = "#000000";
  incalltimer.style.fontSize = "18px";
  incalltimer.style.fontWeight = "400";
  incalltimer.style.margin = "0px";
  incalltimer.style.padding = "0px";

  incalldiv.style.display = "none";
  incalldiv.appendChild(img);
  incalldiv.appendChild(incallheading);
  incalldiv.appendChild(callerlookup2);
  incalldiv.appendChild(incomingcallfrom);
  incalldiv.appendChild(incalltimer);
  incalldiv.appendChild(rejecticon2);
  // incalldiv.app

  incomingdiv.appendChild(incalldiv);

  document.body.appendChild(incomingdiv);
  this.callerlookup(from, jc_cookie);
}

function hangupincall() {
  // console.log("hangup in call has been called");
  // $('#jc_incomingdiv').css('bottom','-400px');

  // if(window.location.hostname!="justcall.io") {
  // var removediv = setInterval(function(){ $('#jc_incomingdiv').remove(); clearInterval(removediv); }, 1000);
  jc_shownotes();

  // }
  // console.log("hanging up call");
  $("#jc_calltimer").text("00:00:00");
  $("#incalldiv").hide();
  // $('#idadv').fadeIn('fast');
  // $('#jc_incomingdiv').hide();
  twiliohangup2();
}

function twiliohangup2() {
  // $('#jc_incomingdiv').css('bottom','-400px');
  // if(window.location.hostname!="justcall.io") {
  // var removediv = setInterval(function(){ $('#jc_incomingdiv').remove(); clearInterval(removediv); }, 1000);
  jc_shownotes();
  // }
  clearInterval(jc_calltimer);

  chrome.runtime.sendMessage({ twiliohangup2: "hangup" });
  // currcon.reject();
  //  currcon.disconnect();
  //  Twilio.Device.disconnectAll();
  //  Twilio.Device.destroy();
  //  setupincomingcall(jc_cookie);
}

function acceptCall() {
  // console.log("accept call clicked");
  // initTimer();
  // $('#idadv').hide();
  // $('#incalldiv').fadeIn('fast');
  // $('#jc_ignorecall').show();

  acceptTwilioCall();
}

function acceptTwilioCall() {
  // console.log("accepting call from twilio");
  // currcon.accept();
  //send message to background to accpet the connection
  chrome.runtime.sendMessage({ acceptcall: "incoming" });
}

function initTimer() {
  jc_calltimer = setInterval(countertimer, 1000);
}

function countertimer() {
  var time_shown = $("#jc_calltimer").text();
  var time_chunks = time_shown.split(":");
  var hour, mins, secs;

  hour = Number(time_chunks[0]);
  mins = Number(time_chunks[1]);
  secs = Number(time_chunks[2]);
  secs++;
  if (secs == 60) {
    secs = 0;
    mins = mins + 1;
  }
  if (mins == 60) {
    mins = 0;
    hour = hour + 1;
  }
  if (hour == 13) {
    hour = 1;
  }

  $("#jc_calltimer").text(plz(hour) + ":" + plz(mins) + ":" + plz(secs));
}

function plz(digit) {
  var zpad = digit + "";
  if (digit < 10) {
    zpad = "0" + zpad;
  }
  return zpad;
}

function checkcookie() {
  // console.log("checking cookie");

  chrome.runtime.sendMessage({ method: "getStatus" }, function (response) {
    // console.log("message send to background to get cookie");
  });
}

function checkmic() {
  // console.log("checking mic");
  chrome.runtime.sendMessage({ method: "checkMic" }, function (response) {
    // console.log("message send to background to get cookie");
  });
}

// function setupincomingcall(cookie) {
//   if(cookie!="") {

//    $.ajax({
//         type:"POST",
//         url:"https://justcall.io/calling/generatetoken.php",
//         data:{
//           hash:cookie
//         },
//         success:function(res2) {
//           //console.log(res2);
//           res2 = JSON.parse(res2);
//           //console.log(res2);

//           token = res2.token;
//           balance = res2.balance;
//           Twilio.Device.destroy();
//           Twilio.Device.setup(token);
//           //console.log("setup successful");

//          }
//       });
//   }
// }

function callerlookup(callernumber, cookie) {
  $.ajax({
    type: "POST",
    url: "https://justcall.io/api/callerlookup.php",
    data: {
      hash: cookie,
      number: callernumber,
    },
    success: function (res) {
      res = JSON.parse(res);

      if (res.count == 0) {
        // $('#callerlookup').hide();
        // $('#callerlookup2').hide();

        $("#jc_callernumber").hide();
      } else {
        // $('#incom_name').text(res.name);
        // $('#incom_name2').text(res.name);

        // $('#incom_companyname').text(res.company);
        $(".jc_incoming_image").attr("src", res.avatar);
        $("#jc_oncall_span").html(
          'On Call: <span style="color:white">' + res.name + "</span>"
        );
        $("#jc_merge_onhold").html("On Hold:" + res.name);

        $("#jc_callername").text(res.name);
        $("#jc_callernumber_incall").text(res.name);

        if (callernumber.includes("client")) {
          $("#jc_callernumber").hide();
        } else {
          $("#jc_callernumber").fadeIn("fast");
        }
      }
    },
  });
}

function callerlookup1(res) {
  if (res.count == 0) {
    // $('#callerlookup').hide();
    // $('#callerlookup2').hide();

    $("#jc_callernumber").hide();
  } else {
    // $('#incom_name').text(res.name);
    // $('#incom_name2').text(res.name);

    // $('#incom_companyname').text(res.company);
    $(".jc_incoming_image").attr("src", res.avatar);
    $("#jc_oncall_span").html(
      'On Call: <span style="color:white">' + res.name + "</span>"
    );
    $("#jc_merge_onhold").html("On Hold:" + res.name);

    $("#jc_callername").text(res.name);
    $("#jc_callernumber_incall").text(res.name);

    if (res.callernumber.includes("client")) {
      $("#jc_callernumber").hide();
    } else {
      $("#jc_callernumber").fadeIn("fast");
    }
  }
}

function jcnumberlookup(res) {
  if (res.count == 0) {
    $("#jc_inc_jcnumber").hide();
    // console.log('JCNumber fail')
  } else {
    jcnumber = res.vanila_number;
    chrome.runtime.sendMessage({ hold_callfrom: res.vanila_number });
    $("#jc_inc_jcnumber").html("Line: <strong>" + res.number + "</strong>");

    if (res.ivr_digit != "") {
      $("#jc_inc_jcnumber").html(
        "Line: <strong>" +
          res.number +
          "</strong> (Digit: " +
          res.ivr_digit +
          ")" +
          "</br>Msg: " +
          res.ivr_message
      );
    }

    $("#jc_inc_jcnumber").fadeIn("fast");
  }
}

function jc_shownotes() {
  //update_busystatus(jc_cookie,conn_params.CallSid,'56018323b921dd2c5444f98fb45509de');
  // if(window.location.hostname!="justcall.io") {
  jc_maximizecall();

  if (unhold_xhr && unhold_xhr.readyState != 4) {
    unhold_xhr.abort();
  }

  unhold_xhr = $.ajax({
    type: "POST",
    url: "https://justcall.io/mobile/calling/unhold.php",
    data: {
      callsid: conn_params.CallSid,
    },
    success: function (res2) {},
  });

  chrome.runtime.sendMessage({ jc_shownotes: "shownotesui" });

  $("#idadv").hide();
  $("#incalldiv").hide();
  $("#jc_transferscreen").hide();
  $("#jc_chrome_logo").hide();
  $("#jc_merge_screen").hide();
  $("#jc_keypad_screen").hide();
  $("#innotesdiv").fadeIn();

  // }else{
  // $('#jc_incomingdiv').css('bottom','-400px');
  // var removediv = setInterval(function(){ $('#jc_incomingdiv').remove(); clearInterval(removediv); }, 1000);
  // }

  if (disablednotes == "1" || disablednotes == 1) {
    chrome.runtime.sendMessage({ jc_chrome_ui_reset: "reset" });

    $("#jc_incomingdiv").css("bottom", "-400px");
    var removediv = setInterval(function () {
      $("#jc_incomingdiv").remove();
      clearInterval(removediv);
    }, 1000);
  }
}

function update_busystatus(busy_cookie, busy_callsid, busy_status) {
  $.ajax({
    type: "POST",
    url: "https://justcall.io/api/update_busystatus.php",
    data: {
      hash: busy_cookie,
      callsid: busy_callsid,
      ub: busy_status,
      call_type: "1",
    },
    success: function (res2) {},
  });
}

function jc_showkeypad() {
  $("#idadv").hide();
  $("#incalldiv").hide();
  $("#jc_transferscreen").hide();
  $("#jc_chrome_logo").hide();
  $("#jc_merge_screen").hide();
  $("#innotesdiv").hide();
  $("#jc_keypad_screen").fadeIn();
}

function jc_updatenotes() {
  var notes_callsid = conn_params.CallSid;
  var notes_notes = $("#jc_callendnotes").val();
  var notes_disposition = $("#jc_disposition_select").val();
  var disposition_heading = $("#jc_disposition_select option:selected").attr(
    "data-heading"
  );

  if (
    disposition_heading != "default" ||
    disposition_heading != "Default" ||
    disposition_heading != "" ||
    disposition_heading != "undefined"
  ) {
    if (typeof disposition_heading === "undefined") {
    } else {
      notes_disposition = disposition_heading + ": " + notes_disposition;
    }
  }

  var notes_hash = jc_cookie;

  if (notes_callsid == "" || notes_hash == "") {
    //Do nothing
  } else {
    $.ajax({
      type: "POST",
      url: "https://justcall.io/api/save_incomingnotes.php",
      data: {
        callsid: notes_callsid,
        notes: notes_notes,
        hash: notes_hash,
        disposition_code: notes_disposition,
        chr_ext: 1,
      },
      success: function (res) {
        res = JSON.parse(res);
      },
    });
  }

  chrome.runtime.sendMessage({ jc_chrome_ui_reset: "reset" });

  $("#jc_incomingdiv").css("bottom", "-400px");
  var removediv = setInterval(function () {
    $("#jc_incomingdiv").remove();
    clearInterval(removediv);
  }, 1000);
}

function jc_updatenotes_keystroke() {
  //typeof conn_params === 'undefined' || conn_params==''

  if (typeof conn_params === "undefined" || conn_params == "") {
  } else {
    $("#notes_saved_badge").html("Saving..");
    $("#notes_saved_badge").fadeIn("fast");

    var notes_callsid = conn_params.CallSid;
    var notes_notes = $("#jc_callendnotes").val();
    var notes_disposition = $("#jc_disposition_select").val();
    var disposition_heading = $("#jc_disposition_select option:selected").attr(
      "data-heading"
    );

    if (
      disposition_heading != "default" ||
      disposition_heading != "Default" ||
      disposition_heading != "" ||
      disposition_heading != "undefined"
    ) {
      if (typeof disposition_heading === "undefined") {
      } else {
        notes_disposition = disposition_heading + ": " + notes_disposition;
      }
    }

    var notes_hash = jc_cookie;

    if (notes_callsid == "" || notes_hash == "") {
      //Do nothing
    } else {
      $.ajax({
        type: "POST",
        url: "https://justcall.io/api/save_incomingnotes.php",
        data: {
          callsid: notes_callsid,
          notes: notes_notes,
          hash: notes_hash,
          disposition_code: notes_disposition,
          chr_ext: 1,
        },
        success: function (res) {
          res = JSON.parse(res);

          $("#notes_saved_badge").html("Saved ✓");
          var remove_badge = setInterval(function () {
            $("#notes_saved_badge").hide("fast");
            clearInterval(remove_badge);
          }, 1000);
        },
      });
    }
  }
}

function jccontactsource(callernumber, cookie) {
  var intecom_url = "";
  // console.log('yo '+cookie)

  return;

  //Don't forget to comment
  // $('#jc_img_intercom').show();
  // $('#jc_img_zendesk').show();
  // $('#jc_img_zoho').show();
  // $('#jc_img_agile').show();
  // $('#jc_img_hubspot').show();
  // $('#jc_img_helpscout').show();
  // $('#jc_img_synchroteam').show();
  // $('#jc_img_salesforce').show();

  $.ajax({
    type: "POST",
    url: "https://justcall.io/api/getcontactsourcev2.php",
    data: {
      hash: cookie,
      number: callernumber,
    },
    success: function (res) {
      res = JSON.parse(res);

      if (res.result == "fail") {
        //Do nothing
      } else {
        $.each(res.data, function (index, value) {
          // console.log('yelo '+index+' - '+value);
          if (value == 1) {
            $("#jc_img_" + index).show();

            if (index == "intercom") {
              //Get intercom URL
              // console.log('yelo '+res.intercom_url);
              $("#jc_img_" + index).css("cursor", "pointer");

              $("#jc_img_" + index).click(function () {
                window.open(res.intercom_url, "_blank");
              });
            }

            if (index == "zendesk") {
              //Get zendesk URL
              // console.log('yelo '+res.intercom_url);
              $("#jc_img_" + index).css("cursor", "pointer");

              $("#jc_img_" + index).click(function () {
                window.open(res.zendesk_url, "_blank");
              });
            }

            if (index == "zoho") {
              //Get zoho URL
              // console.log('yelo '+res.intercom_url);
              $("#jc_img_" + index).css("cursor", "pointer");

              $("#jc_img_" + index).click(function () {
                window.open(res.zoho_url, "_blank");
              });
            }

            if (index == "agile") {
              //Get agile URL
              // console.log('yelo '+res.intercom_url);
              $("#jc_img_" + index).css("cursor", "pointer");

              $("#jc_img_" + index).click(function () {
                window.open(res.agile_url, "_blank");
              });
            }

            if (index == "hubspot") {
              //Get infusionsoft URL
              // console.log('yelo '+res.intercom_url);
              $("#jc_img_" + index).css("cursor", "pointer");

              $("#jc_img_" + index).click(function () {
                window.open(res.hubspot_url, "_blank");
              });
            }

            if (index == "infusionsoft") {
              //Get infusionsoft URL
              // console.log('yelo '+res.intercom_url);
              $("#jc_img_" + index).css("cursor", "pointer");

              $("#jc_img_" + index).click(function () {
                window.open(res.infusionsoft_url, "_blank");
              });
            }

            if (index == "salesforce") {
              //Get infusionsoft URL
              // console.log('yelo '+res.intercom_url);
              $("#jc_img_" + index).css("cursor", "pointer");

              $("#jc_img_" + index).click(function () {
                window.open(res.salesforce_url, "_blank");
              });
            }

            if (index == "pipedrive") {
              //Get infusionsoft URL
              // console.log('yelo '+res.intercom_url);
              $("#jc_img_" + index).css("cursor", "pointer");

              $("#jc_img_" + index).click(function () {
                window.open(res.pipedrive_url, "_blank");
              });
            }

            if (index == "prosperworks") {
              //Get infusionsoft URL
              // console.log('yelo '+res.intercom_url);
              $("#jc_img_" + index).css("cursor", "pointer");

              $("#jc_img_" + index).click(function () {
                window.open(res.prosperworks_url, "_blank");
              });
            }
          }
        });
      }
    },
  });
}

function jccontactsource1(res) {
  // console.log(res);
  if (res.result == "fail") {
    //Do nothing
  } else {
    $.each(res.data, function (index, value) {
      // console.log('yelo '+index+' - '+value);
      if (value == 1) {
        $("#jc_img_" + index).show();

        if (index == "intercom") {
          //Get intercom URL
          // console.log('yelo '+res.intercom_url);
          $("#jc_img_" + index).css("cursor", "pointer");

          $("#jc_img_" + index).click(function () {
            window.open(res.intercom_url, "_blank");
          });
        }

        if (index == "zendesk") {
          //Get zendesk URL
          // console.log('yelo '+res.intercom_url);
          $("#jc_img_" + index).css("cursor", "pointer");

          $("#jc_img_" + index).click(function () {
            window.open(res.zendesk_url, "_blank");
          });
        }

        if (index == "zoho") {
          //Get zoho URL
          // console.log('yelo '+res.intercom_url);
          $("#jc_img_" + index).css("cursor", "pointer");

          $("#jc_img_" + index).click(function () {
            window.open(res.zoho_url, "_blank");
          });
        }

        if (index == "agile") {
          //Get agile URL
          // console.log('yelo '+res.intercom_url);
          $("#jc_img_" + index).css("cursor", "pointer");

          $("#jc_img_" + index).click(function () {
            window.open(res.agile_url, "_blank");
          });
        }

        if (index == "hubspot") {
          //Get infusionsoft URL
          // console.log('yelo '+res.intercom_url);
          $("#jc_img_" + index).css("cursor", "pointer");

          $("#jc_img_" + index).click(function () {
            window.open(res.hubspot_url, "_blank");
          });
        }

        if (index == "infusionsoft") {
          //Get infusionsoft URL
          // console.log('yelo '+res.intercom_url);
          $("#jc_img_" + index).css("cursor", "pointer");

          $("#jc_img_" + index).click(function () {
            window.open(res.infusionsoft_url, "_blank");
          });
        }

        if (index == "salesforce") {
          //Get infusionsoft URL
          // console.log('yelo '+res.intercom_url);
          $("#jc_img_" + index).css("cursor", "pointer");

          $("#jc_img_" + index).click(function () {
            window.open(res.salesforce_url, "_blank");
          });
        }

        if (index == "pipedrive") {
          //Get infusionsoft URL
          // console.log('yelo '+res.intercom_url);
          $("#jc_img_" + index).css("cursor", "pointer");

          $("#jc_img_" + index).click(function () {
            window.open(res.pipedrive_url, "_blank");
          });
        }

        if (index == "prosperworks") {
          //Get infusionsoft URL
          // console.log('yelo '+res.intercom_url);
          $("#jc_img_" + index).css("cursor", "pointer");

          $("#jc_img_" + index).click(function () {
            window.open(res.prosperworks_url, "_blank");
          });
        }
      }
    });
  }
}

function jc_check_desposition(res) {
  $("#jc_disposition_select").html("");
  var disposition_html = "";

  if (res.count > 0) {
    disposition_html =
      '<option selected value="" hidden>Select call outcome</option>';

    var dispo_heading_count = 0;
    $.each(res.data, function (index, value) {
      disposition_html += '<optgroup label="' + value.heading + '">';

      $.each(value.subheading, function (sub_index, sub_value) {
        disposition_html +=
          '<option value="' +
          sub_value.sub_code +
          '" data-heading="' +
          value.heading +
          '" data-id = "' +
          sub_value.id +
          '">' +
          sub_value.sub_code +
          "</option>";
      });

      disposition_html += "</optgroup>";

      dispo_heading_count++;
    });
    $("#jc_disposition_select").show();
    $("#jc_disposition_select").html(disposition_html);
  }
}

function jc_checksecure(res) {
  if (res.count > 0) {
    $("#jc_securecallbtn").show();
  } else {
    $("#jc_securecallbtn").hide();
  }
}

function openNumber(replacedtel) {
  event.preventDefault();
  chrome.runtime.sendMessage({
    message: "open_new_tab",
    url: "https://justcall.io/app/macapp/dialpad_app.php",
    numbers: replacedtel,
    sms: "0",
  });
}

function openNumberFront(replacedtel) {
  // event.preventDefault();
  chrome.runtime.sendMessage({
    message: "open_new_tab",
    url: "https://justcall.io/app/macapp/dialpad_app.php",
    numbers: replacedtel,
    sms: "0",
  });
}

function openNumberPW(replacedtel, elem) {
  replacedtel = $(elem).prevAll(".hello").first().find("div").text();
  var regex = /[+]?\d+/g;
  replacedtel = replacedtel.match(regex).join("");
  // replacedtel = updatednumber
  event.preventDefault();
  chrome.runtime.sendMessage({
    message: "open_new_tab",
    url: "https://justcall.io/app/macapp/dialpad_app.php",
    numbers: replacedtel,
    sms: "0",
  });
}

function openNumberPW2(replacedtel, elem) {
  replacedtel = $(elem).prevAll(".hello").first().find("div").text();
  var regex = /[+]?\d+/g;
  replacedtel = replacedtel.match(regex).join("");
  // replacedtel = updatednumber
  chrome.runtime.sendMessage({
    message: "open_new_tab",
    url: "https://justcall.io/app/macapp/dialpad_app.php",
    numbers: replacedtel,
    sms: "0",
  });
}

function openIntercomDialer() {
  var elements = $("span.attribute__value-label");
  var found = false;
  var number = "";
  try {
    elements.each(function (index) {
      var element = $(this);
      var testnumber = element.text().trim();
      var regex =
        /(\+?(?:(?:9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)|\((?:9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\))[0-9. -]{4,14})(?:\b|x\d+)/;
      if (regex.test(testnumber) == true) {
        if (testnumber.length > 7 && testnumber.length < 15) {
          number = testnumber;
          return true;
        }
      }
    });
  } catch (e) {}

  chrome.runtime.sendMessage({
    message: "open_new_tab",
    url: "https://justcall.io/app/macapp/dialpad_app.php",
    numbers: number,
    sms: "0",
  });
}

function openIntercomSMS() {
  var elements = $("span.attribute__value-label");
  var found = false;
  var number = "";
  try {
    elements.each(function (index) {
      var element = $(this);
      var testnumber = element.text().trim();

      var regex =
        /(\+?(?:(?:9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)|\((?:9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\))[0-9. -]{4,14})(?:\b|x\d+)/;
      if (regex.test(testnumber) == true) {
        if (testnumber.length > 7 && testnumber.length < 15) {
          number = testnumber;
          return true;
        }
      }
    });
  } catch (e) {}
  chrome.runtime.sendMessage({
    message: "open_new_tab",
    url: "https://justcall.io/app/macapp/dialpad_app.php",
    numbers: number,
    sms: "1",
  });
}

function openNumberPWO(replacedtel, elem) {
  replacedtel = $(elem).parent().text();
  var regex = /[+]?\d+/g;
  replacedtel = replacedtel.match(regex).join("");

  // replacedtel = updatednumber
  event.preventDefault();
  chrome.runtime.sendMessage({
    message: "open_new_tab",
    url: "https://justcall.io/app/macapp/dialpad_app.php",
    numbers: replacedtel,
    sms: "0",
  });
}

function openNumberZoho(url, gotNumber, type) {
  event.preventDefault();
  chrome.runtime.sendMessage({
    message: "open_new_tab",
    url: url,
    zoho: "1",
    commtype: type,
    numbers: gotNumber,
  });
}

function openNumberZohoCRMP(url, number, sms) {
  // event.preventDefault();

  // console.log("zoho crm p url is " + url);
  chrome.runtime.sendMessage({
    message: "open_new_tab",
    url: url,
    zoho: "1",
    numbers: number,
    commtype: sms,
  });
}

function openNumberSalesforce(url, number, sms) {
  chrome.runtime.sendMessage({
    message: "open_new_tab",
    url: url,
    salesforce: "1",
    numbers: number,
    sms: sms,
  });
}

function openNumberZohoDeskP(replacedtel) {
  chrome.runtime.sendMessage({
    message: "open_new_tab",
    url: "https://justcall.io/app/macapp/dialpad_app.php",
    numbers: replacedtel,
    sms: "0",
  });
}

function openNumberPipedrive(url, gotNumber, type) {
  event.preventDefault();
  // console.log("open Number Pipedrive called",gotNumber);
  chrome.runtime.sendMessage({
    message: "open_new_tab",
    url: url,
    pipedrive: "1",
    commtype: type,
    numbers: gotNumber,
  });
}

function openNumberFreshsales(url, gotNumber) {
  event.preventDefault();
  chrome.runtime.sendMessage({
    message: "open_new_tab",
    url: url,
    freshsales: "1",
    numbers: gotNumber,
  });
}

function openSMS(replacedtel) {
  event.preventDefault();
  chrome.runtime.sendMessage({
    message: "open_new_tab",
    url: "https://justcall.io/app/macapp/dialpad_app.php",
    numbers: replacedtel,
    sms: "1",
  });
}

function openSMSFront(replacedtel) {
  // event.preventDefault();
  chrome.runtime.sendMessage({
    message: "open_new_tab",
    url: "https://justcall.io/app/macapp/dialpad_app.php",
    numbers: replacedtel,
    sms: "1",
  });
}

function opensmszohodeskp(replacedtel) {
  // event.preventDefault();
  chrome.runtime.sendMessage({
    message: "open_new_tab",
    url: "https://justcall.io/app/macapp/dialpad_app.php",
    numbers: replacedtel,
    sms: "1",
  });
}

function openSMSPW(replacedtel, elem) {
  // replacedtel  = updatednumber;
  replacedtel = $(elem).prevAll(".hello").first().find("div").text();
  event.preventDefault();
  chrome.runtime.sendMessage({
    message: "open_new_tab",
    url: "https://justcall.io/app/macapp/dialpad_app.php",
    numbers: replacedtel,
    sms: "1",
  });
}

function openSMSPW2(replacedtel, elem) {
  // replacedtel  = updatednumber;
  replacedtel = $(elem).prevAll(".hello").first().find("div").text();
  chrome.runtime.sendMessage({
    message: "open_new_tab",
    url: "https://justcall.io/app/macapp/dialpad_app.php",
    numbers: replacedtel,
    sms: "1",
  });
}

function openSMSPWO(replacedtel, elem) {
  // replacedtel  = updatednumber;
  replacedtel = $(elem).parent().text();
  event.preventDefault();
  chrome.runtime.sendMessage({
    message: "open_new_tab",
    url: "https://justcall.io/app/macapp/dialpad_app.php",
    numbers: replacedtel,
    sms: "1",
  });
}

function checkforsimilarity(cookie) {
  chrome.runtime.sendMessage({ checkforsimilarity: cookie });
}

function hold_div_css() {
  $("#jc_holdcallbtn").css("opacity", "1");
  $("#jc_holdcallbtn").css("pointer-events", "all");
}

// this particular block runs when banda clicks on the browser action button (the button which is on chrome toolbar)
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "clicked_browser_action") {
    var allhrefs = $(
      "a[href^='https://justcall.io/app/macapp/dialpad_app.php']:visible"
    );
    var khaliarray = [];
    allhrefs.each(function () {
      // console.log($(this).attr("href"));
      var gottel = $(this).attr("href");
      var replacedtel = gottel.replace("tel:", "");
      // replacedtel = replacedtel.replace("+","");
      //remove sms waale numbers and push only call waale numbers
      var substring = "&sms=1";
      // console.log(replacedtel.indexOf(substring) !== -1);
      if ((replacedtel.indexOf(substring) !== -1) === false) {
        khaliarray.push(
          replacedtel.replace(
            "https://justcall.io/app/macapp/dialpad_app.php?numbers=",
            ""
          )
        );
      }
    });

    // console.log(khaliarray);

    var uniqueNames = [];
    $.each(khaliarray, function (i, el) {
      if ($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
    });
    // console.log(uniqueNames);
    if (uniqueNames.length > 0) {
      var stringuniquenames = uniqueNames.toString();
      chrome.runtime.sendMessage({
        message: "open_new_tab",
        url: "https://justcall.io/app/macapp/dialpad_app.php",
        numbers: stringuniquenames,
      });
    } else {
      chrome.runtime.sendMessage({
        message: "open_new_tab",
        url: "https://justcall.io/app/macapp/dialpad_app.php",
        numbers: "nonumber",
      });
    }
  } else if (request.message === "contextCall") {
    var numberhere = request.numberhere;
    // replacednumberhere = numberhere.replace("+","");
    replacednumberhere = numberhere;

    var khaliarray = [];
    khaliarray.push(replacednumberhere);
    var stringkhaliarray = khaliarray.toString();
    chrome.runtime.sendMessage({
      message: "open_new_tab",
      url: "https://justcall.io/app/macapp/dialpad_app.php",
      numbers: stringkhaliarray,
    });
  } else if (request.message === "contextSMS") {
    var numberhere = request.numberhere;
    // replacednumberhere = numberhere.replace("+","");
    replacednumberhere = numberhere;

    var khaliarray = [];
    khaliarray.push(replacednumberhere);
    var stringkhaliarray = khaliarray.toString();
    chrome.runtime.sendMessage({
      message: "open_new_tab",
      url: "https://justcall.io/app/macapp/dialpad_app.php",
      numbers: stringkhaliarray,
      sms: "1",
    });
  } else if (request.cookiegot) {
    // console.log("coming here");
    jc_cookie = request.cookiegot;
    // console.log(jc_cookie);
    if (jc_cookie != "") {
      // console.log("%c You are logged in  - JustCall.io chrome extension","background: #18a8df; color: #ffffff; font-size: 14px; border-radius: 5px;");
      checkforsimilarity(jc_cookie);

      //DON'T FORGET TO COMMENT
      // showCallDiv("183042000052","CAc312826d8b95a2f5b265019a5f18fb14");
      // $('#idadv').hide();
      // $('#incalldiv').show();
      // $('#jc_chrome_logo').hide();
      // $('#jc_merge_screen').hide();
      // $('#jc_keypad_screen').hide();
      // $('#innotesdiv').hide();
      // $('#jc_transferscreen').show();

      // $('#idadv').hide();
      // $('#incalldiv').show();
      // jc_showkeypad();
    } else {
      chrome.runtime.sendMessage({ message: "destroytwilio" });
      // console.log("%c You are NOT logged in - JustCall.io chrome extension","background: #18a8df; color: red; font-size: 14px; border-radius: 5px;");
    }
  } else if (request.cookiegot == "") {
    chrome.runtime.sendMessage({ message: "destroytwilio" });

    // console.log("%c You are NOT logged in - JustCall.io chrome extension","background: #18a8df; color: red; font-size: 14px; border-radius: 5px;");
  } else if (request.incomingcall) {
    // console.log("%c You are NOT logged in - JustCall.io chrome extension","background: #18a8df; color: #ffffff; font-size: 14px; border-radius: 5px;");
    // if(window.location.hostname!="justcall.io") {
    conn_params = request.incomingcall;

    $("#jc_incomingdiv").remove();
    showCallDiv(conn_params.From, conn_params.CallSid);
    // }
  } else if (request.devicecancel) {
    // console.log("%c You are NOT logged in - JustCall.io chrome extension","background: #18a8df; color: #ffffff; font-size: 14px; border-radius: 5px;");
    $("#jc_calltimer").text("00:00:00");
    $("#incalldiv").hide();
    $("#idadv").fadeIn("fast");

    $("#jc_incomingdiv").css("bottom", "-400px");
    // if(window.location.hostname!="justcall.io") {
    var removediv = setInterval(function () {
      $("#jc_incomingdiv").remove();
      clearInterval(removediv);
    }, 1000);
    // jc_shownotes();
    // }
    // $('#jc_incomingdiv').hide();
    // if(window.location.hostname!="justcall.io") {
    //   $('#jc_incomingdiv').remove();
    // }
  } else if (request.twiliokahangup || request.twiliohangup3) {
    // console.log("%c You are NOT logged in - JustCall.io chrome extension","background: #18a8df; color: #ffffff; font-size: 14px; border-radius: 5px;");
    //     if(window.location.hostname!="justcall.io") {
    //   $('#jc_incomingdiv').remove();
    // }
    $("#jc_calltimer").text("00:00:00");
    clearInterval(jc_calltimer);
    // $('#jc_incomingdiv').css('bottom','-400px');
    // if(window.location.hostname!="justcall.io") {
    // var removediv = setInterval(function(){ $('#jc_incomingdiv').remove(); clearInterval(removediv); }, 1000);
    jc_shownotes();
    // }
  } else if (request.twiliodisconnect) {
    // console.log("%c You are NOT logged in - JustCall.io chrome extension","background: #18a8df; color: #ffffff; font-size: 14px; border-radius: 5px;");
    $("#jc_calltimer").text("00:00:00");
    $("#incalldiv").hide();
    // $('#idadv').fadeIn('fast');
    // $('#jc_incomingdiv').hide();

    // $('#jc_incomingdiv').css('bottom','-400px');
    // var removediv = setInterval(function(){ $('#jc_incomingdiv').remove(); clearInterval(removediv); }, 1000);
    jc_shownotes();
  } else if (request.mutecall_ui == "mute") {
    $("#jc_mutecallbtn").css("background", "white");
    $("#jc_mutecallbtn").css("color", "#424a54");
  } else if (request.mutecall_ui == "unmute") {
    $("#jc_mutecallbtn").css("background", "none");
    $("#jc_mutecallbtn").css("color", "white");
  } else if (request.acceptcall_ui == "acceptcall") {
    // console.log("Call Accepted");
    $("#idadv").hide();
    $("#incalldiv").fadeIn("fast");

    initTimer();
  } else if (request.jc_reset_ui == "reset") {
    $("#jc_incomingdiv").css("bottom", "-400px");
    var removediv = setInterval(function () {
      $("#jc_incomingdiv").remove();
      clearInterval(removediv);
    }, 1000);
  } else if (request.open_desktop_app) {
    var url_desktop = request.open_desktop_app;

    var start, end, elapsed;

    // start a timer
    start = new Date().getTime();

    // attempt to redirect to the uri:scheme
    // the lovely thing about javascript is that it's single threadded.
    // if this WORKS, it'll stutter for a split second, causing the timer to be off

    document.location = url_desktop;

    // end timer
    end = new Date().getTime();

    elapsed = end - start;

    // // if there's no elapsed time, then the scheme didn't fire, and we head to the url.
    // if (elapsed < 1) {
    //     document.location = "https://justcall.io/";
    // }
  } else if (request.holdcall_ui == "hold") {
    $("#jc_holdcallbtn").css("background", "white");
    $("#jc_holdcallbtn").css("-webkit-text-stroke", "white");
    $("#jc_holdcallbtn").css("-webkit-text-stroke-width", "3px");

    $("#jc_holdcallbtn").css("color", "#424a54");
  } else if (request.holdcall_ui == "unhold") {
    // console.log("Unhold call")
    $("#jc_holdcallbtn").css("background", "none");
    $("#jc_holdcallbtn").css("-webkit-text-stroke", "#424a54");
    $("#jc_holdcallbtn").css("-webkit-text-stroke-width", "3px");

    $("#jc_holdcallbtn").css("color", "white");
  } else if (request.holdcall_ui_state == "active") {
    $("#jc_holdcallbtn").css("opacity", "1");
    $("#jc_holdcallbtn").css("pointer-events", "all");
  } else if (request.holdcall_ui_state == "inactive") {
    $("#jc_holdcallbtn").css("opacity", "0.5");
    $("#jc_holdcallbtn").css("pointer-events", "none");
  } else if (request.ignorecall_ui == "minimize") {
    jc_ignorecall();
  } else if (request.ignorecall_ui == "maximize") {
    jc_maximizecall();
  } else if (request.jc_merge_screen == "mergescreen") {
    jc_merge_screen();
  } else if (request.jc_start_merge_calling_ui) {
    $("#jc_merge_calling").html("Calling " + request.jc_start_merge_calling_ui);
  } else if (request.jc_merge_complete_ui) {
    jc_show_incalldiv();
  } else if (request.jc_merge_failbadge) {
    $("#jc_merge_badge").fadeIn();
  } else if (request.jc_merge_close) {
    jc_show_incalldiv();
    $("#jc_merge_badge").html(request.jc_merge_close);
    $("#jc_merge_badge").fadeIn();
  } else if (request.jc_merge_added) {
    var jc_merge_added = request.jc_merge_added;

    if (jc_merge_added == "success") {
      $("#jc_merge_badge").css("background", "#8BC34A");
      $("#jc_merge_badge").html("Member Added");
    }
    $("#jc_merge_badge").fadeIn();
  } else if (request.micison == "yes") {
    // console.log("mic is on");
  } else if (request.micison == "no") {
    // console.log("mic is off");
  } else if (request.securecall_ui == "secure") {
    $("#jc_securecallbtn").css("background", "#7cb342");
    $("#jc_securecallbtn").css("color", "white");
    $("#jc_securecallbtn").css("border", "1px solid #7cb342");
    $("#jc_securecallbtn").removeClass("fa-unlock-alt");
    $("#jc_securecallbtn").addClass("fa-lock");
    // $('#jc_securecallbtn').css('pointer-events','auto');
    // $('#jc_securecallbtn').css('opacity','1');
  } else if (request.securecall_ui == "unsecure") {
    $("#jc_securecallbtn").css("background", "none");
    $("#jc_securecallbtn").css("color", "white");
    $("#jc_securecallbtn").css("border", "1px solid white");
    $("#jc_securecallbtn").removeClass("fa-lock");
    $("#jc_securecallbtn").addClass("fa-unlock-alt");

    // $('#jc_securecallbtn').css('pointer-events','none');
    // $('#jc_securecallbtn').css('opacity','0.4');
  } else if (request.jc_shownotes_ui == "shownotesbro") {
    //Show notes screen
    // console.log("shayad yehi h woh code");
    //update_busystatus(jc_cookie,conn_params.CallSid,'56018323b921dd2c5444f98fb45509de');

    $("#idadv").hide();
    $("#incalldiv").hide();
    $("#jc_transferscreen").hide();
    $("#jc_chrome_logo").hide();
    $("#jc_merge_screen").hide();
    $("#jc_keypad_screen").hide();
    $("#innotesdiv").fadeIn();
  } else if (request.disablednotes == "savevalue") {
    disablednotes = request.disablednotesvalue;
  } else if (request.opencontactsource) {
    jccontactsource1(request.opencontactsource);
  } else if (request.opencallerlookup) {
    callerlookup1(request.opencallerlookup);
  } else if (request.jcnumberlookup) {
    jcnumberlookup(request.jcnumberlookup);
  } else if (request.jc_gettransferlist_bck) {
    jc_gettransferlist_bck(request.jc_gettransferlist_bck);
  } else if (request.jc_checksecure) {
    jc_checksecure(request.jc_checksecure);
  } else if (request.jc_check_desposition) {
    jc_check_desposition(request.jc_check_desposition);
  } else if (request.newcrmapi) {
    crmbadging(request.newcrmapi);
  } else if (request.events == "device_changed") {
    var test = window.location.href;
    if (test.indexOf("dialer") < 0 && test.indexOf("dialpad_app_v2") < 0) {
      try {
        // $.gritter.add({
        //   title: request.message,
        //   text: '<a href="https://justcall.io/app/macapp/dialpad_app_v2?audio=1" target="_blank" style="color: #64c9f1; text-decoration: underline">Configure Audio Settings</a>',
        //   image: 'https://cdn.justcall.io/dialer/headset.png',
        //   fade_in_speed: 'fast',
        //   fade_out_speed: 'fast'
        // });
      } catch (e) {}
    }
  } else if (
    request.cmd == "salesforce_got_addon" &&
    request.src == "background"
  ) {
    // console.log("ADDED",request.data);
    salesforce_addon = request.data;

    if (salesforce_addon == "true") {
      addADbtnSalesforce();
    }
  }
});

var synchrosip = $('a[href^="sip:"]');

var freshdeskspans = $("span:contains('Phone : ')");
var intercomspans = $("span.test__editable-phone__attribute-text");
var frontspans = $("span.key:contains('Phone number')").next();
var current = 'customer[\\"phone_numbers\\"][$index].value|linebreaks';
var deskdivs = $('div[ng-bind="' + current + '"]');
var hubspotinputs = $('input[data-field="phone"]');
var infusionsoftinputs1 = $('input[id="Contact0Phone1"]');
var infusionsoftinputs2 = $('input[id="Contact0Phone2"]');

var infusionsoftlis = $('li[name^="chunk-field-row-phoneWithExtension"]');
var grooveparagraphs = $("p.phoneNumber");

var salesforcephones = $(".uiOutputPhone");

var invalidNumbers = [];
var validNumbers = [];
var countnumbersfound = 0;

function updateCount(countnumbersfound) {
  if (countnumbersfound == 0) {
    chrome.runtime.sendMessage({ message: "updatebadge", count: "" });
  } else {
    chrome.runtime.sendMessage({
      message: "updatebadge",
      count: countnumbersfound.toString(),
    });
  }
}

function crmbadging(res) {
  obj = res;

  var tmp = "";

  var count = 0;

  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      // console.log(key);

      if (obj[key].length !== 0) {
        var crm_name = obj[key][0].name;
        var profile_url = obj[key][0].profileurl;
        var image_url = obj[key][0].image;

        if (count == 0) {
          $("#integrationdiv").show();
          $("#integrationdiv").css("background", "#33475b");

          // $("#int_img").attr('src', image_url);
          $("#int_name").text(crm_name);
        }

        tmp =
          tmp +
          `<a href="` +
          profile_url +
          `" target="_blank" style="margin-left: 10px" ><img style="width: 35px; height: 35px;" src="` +
          image_url +
          `" ></a>`;

        // $('#integrationdiv').click(function(){
        //   window.open( profile_url, '_blank');
        // });

        count++;
      }
    }
  }

  $("#int_img").html(tmp);
}

function replaceHrefs(allhrefs) {
  // return;
  //to look for tel tags in a page, add click to call and text icons next to it, on click open JustCall Chrome Popup

  // return true;
  var test = window.location.href;
  // console.log(test);

  if (
    test.indexOf("intercom.com") != -1 ||
    test.indexOf("freshdesk.com") != -1 ||
    test.indexOf("https://app.futuresimple.com/") != -1 ||
    test.indexOf("https://mail.google.com") != -1 ||
    test.indexOf("https://mail.missiveapp.com") != -1 ||
    test.indexOf("lever.co") != -1 ||
    test.indexOf("close.com") != -1 ||
    test.indexOf("findmetrodchomes.com") != -1 ||
    test.indexOf("hubspot.com") != -1 ||
    test.indexOf("simplesolutionstn.com") != -1 ||
    test.indexOf("outreach.io") != -1 ||
    test.indexOf("recruit.zoho") != -1 ||
    test.indexOf("pipedrive.com") != -1 ||
    test.indexOf("gorgias.com") != -1 ||
    test.indexOf("nocrm.io") != -1 ||
    test.indexOf("teamwave.com") != -1 ||
    test.indexOf("onepagecrm.com") != -1 ||
    test.indexOf("planetaltig.com") != -1 ||
    test.indexOf("amocrm.com") != -1 ||
    test.indexOf("keap.app") != -1
  ) {
  } else {
    var allhrefs = $("a[href^='tel']:visible");
    // console.log("hrefs on this page");
    allhrefs.each(function () {
      var href = $(this).attr("href");
      // console.log(href);
      // console.log("mai hi hun");
      var replacedtel = href.replace("tel:", "");
      $(this).attr(
        "href",
        "https://justcall.io/app/macapp/dialpad_app.php?numbers=" + replacedtel
      );
      $(this).attr("onclick", "event.preventDefault();");
      $(this).attr("target", "_blank");
      if (showicons == 1) {
        $(this).css("display", "inline");
      }

      var size = $(this).css("font-size");

      var html = $(this).text();
      replacedtel = decodeURIComponent(replacedtel);
      html =
        replacedtel +
        '<img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
        size +
        " !important;width:" +
        size +
        ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/>';
      if (showicons == 0) {
        html = replacedtel;
      }
      $(this).html(html);
      if (test.indexOf("pipedrive.com") != -1) {
        //get deal or person id from url
        var pathname = window.location.pathname.split("/");
        var pathname = window.location.pathname.split("/");
        var typeentity = "";
        var entityid = "";
        if (pathname[1] == "person") {
          typeentity = "person";
          entityid = pathname[2];
        }

        if (pathname[1] == "organization") {
          typeentity = "organization";
          entityid = pathname[2];
        }

        if (pathname[1] == "deal") {
          typeentity = "deal";
          entityid = pathname[2];
        }
        var urltosend =
          "https://justcall.io/app/macapp/dialpad_app.php?numbers=" +
          replacedtel +
          "&medium=pipedrive&type=" +
          typeentity +
          "&entityid=" +
          entityid;
        $(this).attr("href", urltosend);
        $(this)
          .unbind()
          .click(function () {
            openNumberPipedrive(urltosend, replacedtel, "call");
          });

        var smshtml = $(
          '<a style="display:inline" href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '&sms=1" target="_blank" onclick="event.preventDefault();" class = "smslink"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".smslink").remove();
        var smsurltosend =
          "https://justcall.io/app/macapp/dialpad_app.php?numbers=" +
          replacedtel +
          "&sms=1&medium=pipedrive&type=" +
          typeentity +
          "&entityid=" +
          entityid;

        $(this).after(smshtml);
        smshtml.unbind().click(function () {
          openNumberPipedrive(smsurltosend, replacedtel, "sms");
        });
        countnumbersfound = countnumbersfound + 1;
        updateCount(countnumbersfound);
      } else {
        $(this)
          .unbind()
          .click(function () {
            openNumber(replacedtel);
          });
        if (showicons == 1) {
          var smshtml = $(
            '<a style="display:inline" href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
              replacedtel +
              '&sms=1" target="_blank" onclick="event.preventDefault();" class = "smslink"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
              size +
              " !important;width:" +
              size +
              ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
          );
          $(this).nextAll(".smslink").remove();

          $(this).after(smshtml);
          smshtml.click(function () {
            openSMS(replacedtel);
          });
        }
        countnumbersfound = countnumbersfound + 1;
        updateCount(countnumbersfound);
      }
    });
  }
}

function replaceZohoCRMPHrefs(allhrefs) {
  // return;
  var test = window.location.href;
  // console.log(test);

  if (
    test.indexOf("intercom.com") != -1 ||
    test.indexOf("https://mail.google.com") != -1 ||
    test.indexOf("https://mail.missiveapp.com") != -1 ||
    test.indexOf("lever.co") != -1 ||
    test.indexOf("close.com") != -1 ||
    test.indexOf("hubspot.com") != -1 ||
    test.indexOf("simplesolutionstn.com") != -1
  ) {
  } else {
    var $iframe = $("#supportLoadFrame").contents();
    allhrefs = $iframe.find("a[href^='tel']:visible");
    // console.log("hrefs on this page");
    allhrefs.each(function () {
      var href = $(this).attr("href");
      // console.log(href);
      var replacedtel = href.replace("tel:", "");
      $(this).attr(
        "href",
        "https://justcall.io/app/macapp/dialpad_app.php?numbers=" + replacedtel
      );
      $(this).attr("onclick", "event.preventDefault();");
      $(this).attr("target", "_blank");
      $(this).css("display", "inline");

      var size = $(this).css("font-size");

      var html = $(this).text();
      replacedtel = decodeURIComponent(replacedtel);
      html =
        replacedtel +
        '<img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
        size +
        " !important;width:" +
        size +
        ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/>';
      $(this).html(html);

      $(this).click(function () {
        openNumberZohoDeskP(replacedtel);
      });

      var smshtml = $(
        '<a style="display:inline" href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
          replacedtel +
          '&sms=1" target="_blank" onclick="event.preventDefault();" class = "smslink"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
          size +
          " !important;width:" +
          size +
          ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
      );
      $(this).nextAll(".smslink").remove();

      $(this).after(smshtml);
      smshtml.click(function () {
        opensmszohodeskp(replacedtel);
      });
      countnumbersfound = countnumbersfound + 1;
      updateCount(countnumbersfound);
    });
  }
}

function replacePodioProfile() {
  var test = window.location.href;

  if (test.indexOf("podio") >= 0 && test.indexOf("users") >= 0) {
    var allcallto = $('div label[for="Phone"]').parent().siblings(".bd");
    allcallto.each(function () {
      if ($(this).hasClass("hello")) {
      } else {
        $(this).addClass("hello");
        var replacedtel = $(this).text().trim();

        var size = $(this).css("font-size");

        replacedtel = decodeURIComponent(replacedtel);
        var html = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '" target="_blank" onclick="event.preventDefault();" class = "calllink"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".calllink").remove();

        $(this).append(html);
        html.click(function () {
          openNumber(replacedtel);
        });
        var smshtml = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '&sms=1" target="_blank" onclick="event.preventDefault();" class = "smslink"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".smslink").remove();

        html.append(smshtml);
        smshtml.click(function () {
          openSMS(replacedtel);
        });
        countnumbersfound = countnumbersfound + 1;
        updateCount(countnumbersfound);
      }
    });
  }
  if (test.indexOf("podio") >= 0) {
    var allcallto = $('a[href^="callto:"]');
    allcallto.each(function () {
      if ($(this).hasClass("hello")) {
      } else {
        $(this).addClass("hello");
        var replacedtel = $(this).attr("href");
        var regex = /\d+/g;
        replacedtel = replacedtel.replace(" ", "");
        replacedtel = replacedtel.match(regex).join("");

        var size = $(this).css("font-size");

        replacedtel = decodeURIComponent(replacedtel);
        var html = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '" target="_blank" onclick="event.preventDefault();" class = "calllink"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".calllink").remove();

        $(this).after(html);
        html.click(function () {
          openNumber(replacedtel);
        });
        var smshtml = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '&sms=1" target="_blank" onclick="event.preventDefault();" class = "smslink"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".smslink").remove();

        html.after(smshtml);
        smshtml.click(function () {
          openSMS(replacedtel);
        });
        countnumbersfound = countnumbersfound + 1;
        updateCount(countnumbersfound);
      }
    });
  }
}

function replacePodio() {
  var test = window.location.href;

  if (test.indexOf("podio") >= 0 && test.indexOf("connections") >= 0) {
    var allcallto = $(".phone");
    allcallto.each(function () {
      if ($(this).hasClass("hello")) {
      } else {
        $(this).addClass("hello");
        var replacedtel = $(this).text().trim();

        var size = $(this).css("font-size");

        replacedtel = decodeURIComponent(replacedtel);
        var html = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '" target="_blank" onclick="event.preventDefault();" class = "calllink"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".calllink").remove();

        $(this).after(html);
        html.click(function () {
          openNumber(replacedtel);
        });
        var smshtml = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '&sms=1" target="_blank" onclick="event.preventDefault();" class = "smslink"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".smslink").remove();

        html.after(smshtml);
        smshtml.click(function () {
          openSMS(replacedtel);
        });
        countnumbersfound = countnumbersfound + 1;
        updateCount(countnumbersfound);
      }
    });
    var contactNumbers = $("div.contact-field")
      .find('strong:contains("Phone")')
      .next();
    contactNumbers.each(function () {
      if ($(this).hasClass("hello")) {
      } else {
        $(this).addClass("hello");
        var replacedtel = $(this).text().trim();

        var size = $(this).css("font-size");

        replacedtel = decodeURIComponent(replacedtel);
        var html = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '" target="_blank" onclick="event.preventDefault();" class = "calllink"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".calllink").remove();

        $(this).after(html);
        html.click(function () {
          openNumber(replacedtel);
        });
        var smshtml = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '&sms=1" target="_blank" onclick="event.preventDefault();" class = "smslink"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".smslink").remove();

        html.after(smshtml);
        smshtml.click(function () {
          openSMS(replacedtel);
        });
        countnumbersfound = countnumbersfound + 1;
        updateCount(countnumbersfound);
      }
    });
  }
  if (test.indexOf("podio") >= 0) {
    var index = $('th[title^="Phone"], th[title^="phone"]').index();
    var allcallto = $("td:nth-child(" + (index + 1) + ")");
    allcallto.each(function () {
      if ($(this).hasClass("hello") || $(this).attr("title") == "") {
      } else {
        $(this).addClass("hello");
        var replacedtel = $(this).attr("title");
        var regex = /\d+/g;
        replacedtel = replacedtel.match(regex).join("");

        var size = $(this).css("font-size");

        replacedtel = decodeURIComponent(replacedtel);
        var html = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '" target="_blank" onclick="event.preventDefault();" class = "calllink"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".calllink").remove();

        $(this).append(html);
        html.click(function () {
          openNumber(replacedtel);
        });
        var smshtml = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '&sms=1" target="_blank" onclick="event.preventDefault();" class = "smslink"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".smslink").remove();

        $(this).append(smshtml);
        smshtml.click(function () {
          openSMS(replacedtel);
        });
        countnumbersfound = countnumbersfound + 1;
        updateCount(countnumbersfound);
      }
    });
  }
}

function replaceNimbleCallto() {
  // $(".appScroll").addClass("justcall");
  // return;
  // var test = window.location.hostname;
  // if (test.indexOf("pipedrive") !=-1) {

  // } else {
  // reactCPVFrame
  var url = window.location.href;
  var $iframe = $(".base-wrapper").contents().find(".gwt-Frame").contents();
  if (url.indexOf("list") >= 0) {
    allcallto = $iframe
      .find('div[data-column-name="phone"]')
      .find(".contact-list-table-item-view");

    // allcallto = $("a[href^='tel']:visible");
    allcallto.each(function () {
      // console.log("hrefs on this page");
      if ($(this).attr("phone") == $(this).text()) {
      } else {
        $(this).attr("phone", $(this).text());
        var size = $(this).css("font-size");
        var regex = /[+]?\d+/g;
        var replacedtel = $(this).text();
        replacedtel = replacedtel.match(regex).join("");
        replacedtel = decodeURIComponent(replacedtel);
        var html = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '" target="_blank" onclick="event.preventDefault();" class = "calllink"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".calllink").remove();
        $(this).after(html);
        html.click(function () {
          openNumber(replacedtel);
        });
        var smshtml = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '&sms=1" target="_blank" onclick="event.preventDefault();" class = "smslink"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".smslink").remove();

        html.after(smshtml);
        smshtml.click(function () {
          openSMS(replacedtel);
        });
        countnumbersfound = countnumbersfound + 1;
        updateCount(countnumbersfound);
      }
    });
  } else {
    allcallto = $iframe.find('a[href^="tel"]');

    // allcallto = $("a[href^='tel']:visible");
    allcallto.each(function () {
      // console.log("hrefs on this page");

      var href = $(this).attr("href");
      // console.log(href);
      var replacedtel = href.replace("tel:", "");
      $(this).attr(
        "href",
        "https://justcall.io/app/macapp/dialpad_app.php?numbers=" + replacedtel
      );
      $(this).attr("onclick", "event.preventDefault();");
      $(this).attr("target", "_blank");
      var size = $(this).css("font-size");

      var html = $(this).text();
      replacedtel = decodeURIComponent(replacedtel);
      html =
        replacedtel +
        '<img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
        size +
        " !important;width:" +
        size +
        ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/>';
      $(this).html(html);
      $(this).click(function () {
        openNumber(replacedtel);
      });
      var smshtml = $(
        '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
          replacedtel +
          '&sms=1" target="_blank" onclick="event.preventDefault();" class = "smslink"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
          size +
          " !important;width:" +
          size +
          ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
      );
      $(this).nextAll(".smslink").remove();

      $(this).after(smshtml);
      smshtml.click(function () {
        openSMS(replacedtel);
      });
      countnumbersfound = countnumbersfound + 1;
      updateCount(countnumbersfound);
    });

    $(".TaskContactWidget").click(function (e) {
      removehellodesc();
    });
  }
  // }
}

function removehellodesc() {
  setTimeout(function () {
    var notespara11 = $(".desc");
    notespara11.each(function () {
      if ($(this).hasClass("hello")) {
        $(this).removeClass("hello");
      }
    });
    replaceNimbleDetail();
  }, 1000);
}

function replaceZendeskNumbers() {
  var regex =
    /(\+?(?:(?:9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)|\((?:9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\))[0-9. -]{4,14})(?:\b|x\d+)/;
  var test = window.location.hostname;
  if (test.indexOf("zendesk") != -1) {
    $(".item > div").each(function () {
      // console.log("mili");
      if (regex.test($(this).text()) == true) {
        if ($(this).hasClass("hello")) {
        } else {
          $(this).addClass("hello");
          var gotText = $(this).text();
          gotText = gotText.replace(/\s/g, "");
          // console.log(gotText);
          // $(this).css("display","inline-block");
          // $(this).css("width","110%");

          var gotNumber = gotText.replace("(directline)", "");
          // gotNumber = gotNumber.replace("+","");
          var html =
            '<a style="cursor:pointer" href = "https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            gotNumber +
            '" target="_blank" onclick="event.preventDefault();">' +
            gotText +
            "</a>";
          var size = $(this).css("font-size");
          html =
            html +
            '<img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/>';
          var sethtml = $(html);
          sethtml.click(function () {
            openNumber(gotNumber);
          });

          $(this).html(sethtml);
          // $(this).click(function(){ openNumber(gotNumber); });
          var smshtml = $(
            '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
              gotNumber +
              '&sms=1" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
              size +
              " !important;width:" +
              size +
              ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
          );
          $(this).append(smshtml);
          smshtml.click(function () {
            openSMS(gotNumber);
          });
          countnumbersfound = countnumbersfound + 1;
          updateCount(countnumbersfound);
        }
      }
    });
    // console.log(results);
  }
}

function replaceKustomerNumbers() {
  var regex =
    /(\+?(?:(?:9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)|\((?:9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\))[0-9. -]{4,14})(?:\b|x\d+)/;
  var test = window.location.hostname;
  if (test.indexOf("kustomerapp") != -1) {
    $(".Linkify").each(function () {
      // console.log("mili");
      if (regex.test($(this).text()) == true) {
        if ($(this).hasClass("hello")) {
          //already converted to cick to call
        } else {
          $(this).addClass("hello");
          var gotText = $(this).text();
          gotText = gotText.replace(/\s/g, "");
          // console.log(gotText);
          // $(this).css("display","inline-block");
          // $(this).css("width","110%");

          var gotNumber = gotText.replace("(directline)", "");

          // gotNumber = gotNumber.replace("+","");
          var html =
            '<a style="cursor:pointer" href = "https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            gotNumber +
            '" target="_blank" onclick="event.preventDefault();">' +
            gotText +
            "</a>";
          var size = $(this).css("font-size");
          html =
            html +
            '<img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/>';
          var sethtml = $(html);
          sethtml.click(function () {
            openNumber(gotNumber);
          });

          $(this).html(sethtml);
          // $(this).click(function(){ openNumber(gotNumber); });
          var smshtml = $(
            '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
              gotNumber +
              '&sms=1" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
              size +
              " !important;width:" +
              size +
              ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
          );
          $(this).append(smshtml);
          smshtml.click(function () {
            openSMS(gotNumber);
          });
          countnumbersfound = countnumbersfound + 1;
          updateCount(countnumbersfound);
        }
      }
    });
    // console.log(results);
  }
}

function replaceSynchroteamSip(synchrosip) {
  // console.log(window.location.hostname);
  var test = window.location.hostname;
  if (test.indexOf("synchroteam") != -1) {
    synchrosip = $('a[href^="sip:"]');
    // console.log("hrefs on this page");
    synchrosip.each(function () {
      var href = $(this).attr("href");
      // console.log(href);
      var replacedtel = href.replace("sip:", "");
      $(this).attr(
        "href",
        "https://justcall.io/app/macapp/dialpad_app.php?numbers=" + replacedtel
      );
      $(this).attr("onclick", "event.preventDefault();");
      $(this).attr("target", "_blank");
      var size = $(this).css("font-size");

      var html = $(this).text();
      html =
        replacedtel +
        '<img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
        size +
        " !important;width:" +
        size +
        ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/>';
      $(this).html(html);
      $(this).click(function () {
        openNumber(replacedtel);
      });
      var smshtml = $(
        '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
          replacedtel +
          '&sms=1" target="_blank" onclick="event.preventDefault();" class = "smslink"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
          size +
          " !important;width:" +
          size +
          ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
      );
      $(this).nextAll(".smslink").remove();

      $(this).after(smshtml);
      smshtml.click(function () {
        openSMS(replacedtel);
      });
      countnumbersfound = countnumbersfound + 1;
      updateCount(countnumbersfound);
    });

    var regex = /^([\+\[]?[\(\)]?[\s0-9]([\-\)\.\/-\]]?\s?\–?\(?\d){8,20})$/;
    $("tr td").each(function () {
      var value = $(this).text();
      if (regex.test(value) == true) {
        if ($(this).hasClass("hello")) {
        } else {
          $(this).addClass("hello");
          var gotText = $(this).text();
          $(this).css("display", "inline-block");
          $(this).css("width", "110%");

          var gotNumber = $(this).text();
          // gotNumber = gotNumber.replace("+","");
          var html =
            '<a style="cursor:pointer" href = "https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            gotNumber +
            '" target="_blank" onclick="event.preventDefault()">' +
            gotNumber +
            "</a>";
          var size = $(this).css("font-size");
          html =
            html +
            '<img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/>';
          $(this).html(html);
          $(this).click(function () {
            openNumber(gotNumber);
          });
          var smshtml = $(
            '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
              gotNumber +
              '&sms=1" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
              size +
              " !important;width:" +
              size +
              ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
          );
          $(this).append(smshtml);
          smshtml.click(function () {
            openSMS(gotNumber);
          });
          countnumbersfound = countnumbersfound + 1;
          updateCount(countnumbersfound);
        }
      }
    });
  }
}

function replaceLeadSimpleHrefs() {
  var leadSimpleHrefs = $('a[href^="tel:"]:visible');
  leadSimpleHrefs.each(function () {
    // console.log("it's me");

    var href = $(this).attr("href");
    // console.log(href);
    var replacedtel = href.replace("tel:", "");
    replacedtel = replacedtel.replace("+", "");
    $(this).attr(
      "href",
      "https://justcall.io/app/macapp/dialpad_app.php?numbers=" + replacedtel
    );

    var size = $(this).css("font-size");

    if (showicons == 1) {
      var callhtml = $(
        '<a style="display:inline" href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
          replacedtel +
          '" target="_blank" onclick="event.preventDefault();" class="calllink"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
          size +
          " !important;width:" +
          size +
          ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
      );
      $(this).nextAll(".calllink").remove();
      $(this).after(callhtml);
      callhtml.click(function () {
        openNumberFront(replacedtel);
      });
      var smshtml = $(
        '<a style="display:inline" href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
          replacedtel +
          '&sms=1" target="_blank" onclick="event.preventDefault();" class="smslink"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
          size +
          " !important;width:" +
          size +
          ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
      );
      $(this).nextAll(".smslink").remove();
      callhtml.after(smshtml);
      smshtml.click(function () {
        openSMS(replacedtel);
      });
    }
    countnumbersfound = countnumbersfound + 1;
    updateCount(countnumbersfound);
  });
}

function replaceDoubleHrefs(alldoublehrefs) {
  // return true;
  var test = window.location.href;
  if (
    test.indexOf("intercom.com") != -1 ||
    test.indexOf("freshdesk.com") != -1 ||
    test.indexOf("https://app.futuresimple.com/") != -1 ||
    test.indexOf("https://mail.google.com") != -1 ||
    test.indexOf("https://mail.missiveapp.com") != -1 ||
    test.indexOf("lever.co") != -1 ||
    test.indexOf("close.com") != -1 ||
    test.indexOf("findmetrodchomes.com") != -1 ||
    test.indexOf("hubspot.com") != -1 ||
    test.indexOf("simplesolutionstn.com") != -1 ||
    test.indexOf("outreach.io") != -1 ||
    test.indexOf("recruit.zoho") != -1 ||
    test.indexOf("pipedrive.com") != -1 ||
    test.indexOf("gorgias.com") != -1 ||
    test.indexOf("nocrm.io") != -1 ||
    test.indexOf("teamwave.com") != -1 ||
    test.indexOf("onepagecrm.com") != -1 ||
    test.indexOf("planetaltig.com") != -1 ||
    test.indexOf("amocrm.com") != -1 ||
    test.indexOf("keap.app") != -1
  ) {
  } else {
    var alldoublehrefs = $('a[href^="tel:"]:visible');
    alldoublehrefs.each(function () {
      // console.log("it's me");

      var href = $(this).attr("href");
      // console.log(href);
      var replacedtel = href.replace("tel:", "");
      // replacedtel = replacedtel.replace("+","");
      $(this).attr(
        "href",
        "https://justcall.io/app/macapp/dialpad_app.php?numbers=" + replacedtel
      );
      $(this).attr("onclick", "event.preventDefault();");
      $(this).attr("target", "_blank");

      if (showicons == 1) {
        $(this).css("display", "inline");
      }

      // $(this).css("padding","2px");
      // $(this).css("border-radius","15px");
      // $(this).removeClass();
      var size = $(this).css("font-size");

      var html = $(this).text();
      replacedtel = decodeURIComponent(replacedtel);

      html =
        replacedtel +
        '<img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
        size +
        " !important;width:" +
        size +
        ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/>';
      if (showicons == 0) {
        html = replacedtel;
      }
      $(this).html(html);
      if (test.indexOf("pipedrive.com") != -1) {
        var pathname = window.location.pathname.split("/");
        var typeentity = "";
        var entityid = "";
        if (pathname[1] == "person") {
          typeentity = "person";
          entityid = pathname[2];
        }

        if (pathname[1] == "organization") {
          typeentity = "organization";
          entityid = pathname[2];
        }

        if (pathname[1] == "deal") {
          typeentity = "deal";
          entityid = pathname[2];
        }
        var urltosend =
          "https://justcall.io/app/macapp/dialpad_app.php?numbers=" +
          replacedtel +
          "&medium=pipedrive&type=" +
          typeentity +
          "&entityid=" +
          entityid;
        $(this).attr("href", urltosend);
        $(this)
          .unbind()
          .click(function () {
            openNumberPipedrive(urltosend, replacedtel, "call");
          });

        var smshtml = $(
          '<a style="display:inline" href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '&sms=1" target="_blank" onclick="event.preventDefault();" class="smslink"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        var smsurltosend =
          "https://justcall.io/app/macapp/dialpad_app.php?numbers=" +
          replacedtel +
          "&sms=1&medium=pipedrive&type=" +
          typeentity +
          "&entityid=" +
          entityid;

        $(this).nextAll(".smslink").remove();
        $(this).after(smshtml);
        smshtml.unbind().click(function () {
          openNumberPipedrive(smsurltosend, replacedtel, "sms");
        });
        countnumbersfound = countnumbersfound + 1;
        updateCount(countnumbersfound);
      } else {
        $(this)
          .unbind()
          .click(function () {
            openNumber(replacedtel);
          });
        if (showicons == 1) {
          var smshtml = $(
            '<a style="display:inline" href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
              replacedtel +
              '&sms=1" target="_blank" onclick="event.preventDefault();" class="smslink"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
              size +
              " !important;width:" +
              size +
              ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
          );
          $(this).nextAll(".smslink").remove();
          $(this).after(smshtml);
          smshtml.click(function () {
            openSMS(replacedtel);
          });
        }
        countnumbersfound = countnumbersfound + 1;
        updateCount(countnumbersfound);
      }
    });
  }
}

function replaceDoubleCRMPHrefs(alldoublehrefs) {
  var test = window.location.href;
  if (
    test.indexOf("intercom.com") != -1 ||
    test.indexOf("https://mail.google.com") != -1 ||
    test.indexOf("https://mail.missiveapp.com") != -1 ||
    test.indexOf("lever.co") != -1 ||
    test.indexOf("close.com") != -1 ||
    test.indexOf("hubspot.com") != -1 ||
    test.indexOf("simplesolutionstn.com") != -1 ||
    test.indexOf("outreach.io") != -1
  ) {
  } else {
    var $iframe = $("#supportLoadFrame").contents();

    alldoublehrefs = $iframe.find('a[href^="tel:"]');
    alldoublehrefs.each(function () {
      var href = $(this).attr("href");
      // console.log(href);
      var replacedtel = href.replace("tel:", "");
      // replacedtel = replacedtel.replace("+","");
      $(this).attr(
        "href",
        "https://justcall.io/app/macapp/dialpad_app.php?numbers=" + replacedtel
      );
      $(this).attr("onclick", "event.preventDefault();");
      $(this).attr("target", "_blank");
      $(this).css("display", "inline");

      // $(this).css("padding","2px");
      // $(this).css("border-radius","15px");
      // $(this).removeClass();
      var size = $(this).css("font-size");

      var html = $(this).text();
      replacedtel = decodeURIComponent(replacedtel);

      html =
        replacedtel +
        '<img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
        size +
        " !important;width:" +
        size +
        ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/>';
      $(this).html(html);

      $(this).click(function () {
        openNumberZohoDeskP(replacedtel);
      });

      var smshtml = $(
        '<a style="display:inline" href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
          replacedtel +
          '&sms=1" target="_blank" onclick="event.preventDefault();" class="smslink"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
          size +
          " !important;width:" +
          size +
          ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
      );
      $(this).nextAll(".smslink").remove();
      $(this).after(smshtml);
      smshtml.click(function () {
        opensmszohodeskp(replacedtel);
      });
      countnumbersfound = countnumbersfound + 1;
      updateCount(countnumbersfound);
    });
  }
}

function replaceGorgias() {
  var url = window.location.href;
  if (url.indexOf("gorgias") >= 0) {
    var allcallto = $('a[href^="tel:"]');
    allcallto.each(function () {
      if ($(this).hasClass("hello")) {
      } else {
        $(this).addClass("hello");
        var replacedtel = $(this).attr("href");
        var regex = /[+]?\d+/g;
        replacedtel = replacedtel.match(regex).join("");

        var size = $(this).css("font-size");

        replacedtel = decodeURIComponent(replacedtel);
        var html = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '" target="_blank" onclick="event.preventDefault();" class = "calllink"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".calllink").remove();

        $(this).append(html);
        html.click(function () {
          openNumber(replacedtel);
        });
        var smshtml = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '&sms=1" target="_blank" onclick="event.preventDefault();" class = "smslink"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".smslink").remove();

        $(this).append(smshtml);
        smshtml.click(function () {
          openSMS(replacedtel);
        });
        countnumbersfound = countnumbersfound + 1;
        updateCount(countnumbersfound);
      }
    });
  }
}

function replaceQuickbase() {
  var url = window.location.href;
  if (url.indexOf("quickbase.com") >= 0) {
    var allPhones = $('label:contains("Phone")').next();
    allPhones.each(function () {
      if ($(this).hasClass("hello")) {
      } else {
        $(this).addClass("hello");
        var replacedtel = $(this).text().trim();
        var regex = /[+]?\d+/g;
        replacedtel = replacedtel.match(regex).join("");

        var size = $(this).css("font-size");

        replacedtel = decodeURIComponent(replacedtel);
        var html = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '" target="_blank" onclick="event.preventDefault();" class = "calllink"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".calllink").remove();

        $(this).append(html);
        html.click(function () {
          openNumber(replacedtel);
        });
        var smshtml = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '&sms=1" target="_blank" onclick="event.preventDefault();" class = "smslink"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".smslink").remove();

        $(this).append(smshtml);
        smshtml.click(function () {
          openSMS(replacedtel);
        });
        countnumbersfound = countnumbersfound + 1;
        updateCount(countnumbersfound);
      }
    });
  }
}

function replacePlanetaltig() {
  var url = window.location.href;
  if (url.indexOf("planetaltig.com") >= 0) {
    var allcallto = $('a[href^="tel:"]');
    allcallto.each(function () {
      if ($(this).hasClass("hello")) {
      } else {
        $(this).addClass("hello");
        var replacedtel = $(this).attr("href");
        var regex = /[+]?\d+/g;
        replacedtel = replacedtel.match(regex).join("");

        var size = $(this).css("font-size");

        replacedtel = decodeURIComponent(replacedtel);
        var html = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '" target="_blank" onclick="event.preventDefault();" class = "calllink"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".calllink").remove();
        $(this).parent().prev().append(html);
        html.click(function () {
          openNumber(replacedtel);
        });
        var smshtml = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '&sms=1" target="_blank" onclick="event.preventDefault();" class = "smslink"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px; margin-right:5px; max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".smslink").remove();

        html.after(smshtml);
        smshtml.click(function () {
          openSMS(replacedtel);
        });
        countnumbersfound = countnumbersfound + 1;
        updateCount(countnumbersfound);
      }
    });
  }
}

function replaceSalesmate() {
  var url = window.location.href;
  if (url.indexOf("salesmate") >= 0) {
    var allcallto = $(
      "div[col-id=mobile],div[col-id=phone],div[col-id=otherPhone]"
    )
      .find("grid-telephony")
      .find("span.text-ellipsis")
      .find("span");
    allcallto.each(function () {
      if ($(this).hasClass("hello")) {
      } else {
        $(this).addClass("hello");
        var replacedtel = $(this).text().trim();
        console.log(replacedtel);
        var regex = /[+]?\d+/g;
        replacedtel = replacedtel.match(regex).join("");

        var size = $(this).css("font-size");

        replacedtel = decodeURIComponent(replacedtel);
        var html = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '" target="_blank" onclick="event.preventDefault();" class = "calllink"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".calllink").remove();

        $(this).append(html);
        html.click(function () {
          openNumber(replacedtel);
        });
        var smshtml = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '&sms=1" target="_blank" onclick="event.preventDefault();" class = "smslink"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".smslink").remove();

        $(this).append(smshtml);
        smshtml.click(function () {
          openSMS(replacedtel);
        });
        countnumbersfound = countnumbersfound + 1;
        updateCount(countnumbersfound);
      }
    });

    var contactDetails = $("dialer")
      .find("div.pos-rlt")
      .find("span.text-ellipsis");
    contactDetails.each(function () {
      if ($(this).hasClass("hello")) {
      } else {
        $(this).addClass("hello");
        var replacedtel = $(this).find("span").text().trim();
        console.log(replacedtel);
        var regex = /[+]?\d+/g;
        replacedtel = replacedtel.match(regex).join("");

        var size = $(this).css("font-size");

        replacedtel = decodeURIComponent(replacedtel);
        var html = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '" target="_blank" onclick="event.preventDefault();" class = "calllink"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".calllink").remove();

        $(this).parents("sm-display-widget-value").append(html);
        html.click(function () {
          openNumber(replacedtel);
        });
        var smshtml = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '&sms=1" target="_blank" onclick="event.preventDefault();" class = "smslink"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".smslink").remove();

        $(this).parents("sm-display-widget-value").append(smshtml);
        smshtml.click(function () {
          openSMS(replacedtel);
        });
        countnumbersfound = countnumbersfound + 1;
        updateCount(countnumbersfound);
      }
    });
  }
}

function replaceSalesloft() {
  var url = window.location.href;
  if (url.indexOf("salesloft.com") >= 0) {
    var allcallto = $('div[class^="ContactItemValue__Value"]');
    allcallto.each(function () {
      if ($(this).hasClass("hello")) {
      } else {
        $(this).addClass("hello");
        var replacedtel = $(this).text();
        var regex = /[+]?\d+/g;
        replacedtel = replacedtel.match(regex).join("");

        var size = $(this).css("font-size");

        replacedtel = decodeURIComponent(replacedtel);
        var html = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '" target="_blank" onclick="event.preventDefault();" class = "calllink"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".calllink").remove();

        $(this).append(html);
        html.click(function () {
          openNumber(replacedtel);
        });
        var smshtml = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '&sms=1" target="_blank" onclick="event.preventDefault();" class = "smslink"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".smslink").remove();

        $(this).append(smshtml);
        smshtml.click(function () {
          openSMS(replacedtel);
        });
        countnumbersfound = countnumbersfound + 1;
        updateCount(countnumbersfound);
      }
    });
  }
}

function replaceGoHighLevel() {
  var url = window.location.href;
  if (
    url.indexOf("gohighlevel.com") >= 0 ||
    url.indexOf("595marketing.com") >= 0
  ) {
    var allPhones = $(".icon-a-phone").next();
    allPhones.each(function () {
      if ($(this).hasClass("hello")) {
      } else {
        $(this).addClass("hello");
        var replacedtel = $(this).text().trim();
        var regex = /[+]?\d+/g;
        replacedtel = replacedtel.match(regex).join("");

        var size = $(this).css("font-size");

        replacedtel = decodeURIComponent(replacedtel);
        var html = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '" target="_blank" onclick="event.preventDefault();" class = "calllink"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".calllink").remove();

        $(this).append(html);
        html.click(function () {
          openNumber(replacedtel);
        });
        var smshtml = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '&sms=1" target="_blank" onclick="event.preventDefault();" class = "smslink"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".smslink").remove();

        $(this).append(smshtml);
        smshtml.click(function () {
          openSMS(replacedtel);
        });
        countnumbersfound = countnumbersfound + 1;
        updateCount(countnumbersfound);
      }
    });
    var allPhones = $('td[data-title="Phone"]').find("span");
    allPhones.each(function () {
      if ($(this).hasClass("hello")) {
      } else {
        $(this).addClass("hello");
        var replacedtel = $(this).text().trim();
        var regex = /[+]?\d+/g;
        replacedtel = replacedtel.match(regex).join("");

        var size = $(this).css("font-size");

        replacedtel = decodeURIComponent(replacedtel);
        var html = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '" target="_blank" onclick="event.preventDefault();" class = "calllink"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".calllink").remove();

        $(this).append(html);
        html.click(function () {
          openNumber(replacedtel);
        });
        var smshtml = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '&sms=1" target="_blank" onclick="event.preventDefault();" class = "smslink"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".smslink").remove();

        $(this).append(smshtml);
        smshtml.click(function () {
          openSMS(replacedtel);
        });
        countnumbersfound = countnumbersfound + 1;
        updateCount(countnumbersfound);
      }
    });
    var allPhones = $('div[data-vv-as="phone"]');
    allPhones.each(function () {
      if ($(this).hasClass("hello")) {
      } else {
        $(this).addClass("hello");
        var replacedtel = $(this)
          .find('input[placeholder="Phone number"]')
          .val();
        var regex = /[+]?\d+/g;
        replacedtel = replacedtel.match(regex).join("");

        var size = $(this).css("font-size");

        replacedtel = decodeURIComponent(replacedtel);
        var html = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '" target="_blank" onclick="event.preventDefault();" class = "calllink"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".calllink").remove();

        $(this).after(html);
        html.click(function () {
          openNumber(replacedtel);
        });
        var smshtml = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '&sms=1" target="_blank" onclick="event.preventDefault();" class = "smslink"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".smslink").remove();

        html.after(smshtml);
        smshtml.click(function () {
          openSMS(replacedtel);
        });
        countnumbersfound = countnumbersfound + 1;
        updateCount(countnumbersfound);
      }
    });
  }
}

function replaceSugarCRM() {
  var url = window.location.href;
  if (url.indexOf("sugarcrm.com") >= 0) {
    var allcallto = $('a[href^="callto"]');
    allcallto.each(function () {
      if ($(this).hasClass("hello")) {
      } else {
        $(this).addClass("hello");
        var replacedtel = $(this).attr("href");
        var regex = /[+]?\d+/g;
        replacedtel = replacedtel.match(regex).join("");

        var size = $(this).css("font-size");

        replacedtel = decodeURIComponent(replacedtel);
        var html = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '" target="_blank" onclick="event.preventDefault();" class = "calllink"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".calllink").remove();

        $(this).after(html);
        html.click(function () {
          openNumber(replacedtel);
        });
        var smshtml = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '&sms=1" target="_blank" onclick="event.preventDefault();" class = "smslink"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".smslink").remove();

        html.after(smshtml);
        smshtml.click(function () {
          openSMS(replacedtel);
        });
        countnumbersfound = countnumbersfound + 1;
        updateCount(countnumbersfound);
      }
    });

    if (
      url.indexOf("Accounts/") >= 0 ||
      url.indexOf("Contacts/") >= 0 ||
      url.indexOf("Opportunities/") >= 0 ||
      url.indexOf("Leads/") >= 0
    ) {
      var allcalltonumbers = "";
      var allcalltoarray = [];
      allcallto.each(function () {
        var replacedtel = $(this).attr("href");
        var regex = /[+]?\d+/g;
        replacedtel = replacedtel.match(regex).join("");

        allcalltoarray.push(replacedtel);
      });

      allcalltoarray = Array.from(new Set(allcalltoarray));

      allcalltoarray.forEach(function (value) {
        allcalltonumbers = allcalltonumbers + "," + value;
      });

      allcalltonumbers = allcalltonumbers.substring(1);

      console.log(allcalltonumbers);

      var element = $("span[data-type='badge']");

      if (element.length == 0) {
        element = $("span[data-type='follow']");
      }

      var size = element.css("font-size");

      if (
        element.attr("numbers") === allcalltonumbers ||
        allcalltonumbers == ""
      ) {
      } else {
        element.attr("numbers", allcalltonumbers);
        allcalltonumbers = decodeURIComponent(allcalltonumbers);
        var html = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            allcalltonumbers +
            '" target="_blank" onclick="event.preventDefault();" class = "calllink"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        element.children(".calllink").remove();

        element.append(html);
        html.click(function () {
          openNumber(allcalltonumbers);
        });
        var smshtml = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            allcalltonumbers +
            '&sms=1" target="_blank" onclick="event.preventDefault();" class = "smslink"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        element.children(".smslink").remove();

        html.after(smshtml);
        smshtml.click(function () {
          openSMS(allcalltonumbers);
        });
        countnumbersfound = countnumbersfound + 1;
        updateCount(countnumbersfound);
      }
    }
  }
}

function replaceEngagebay() {
  var url = window.location.href;
  if (url.indexOf("engagebay.com") >= 0) {
    var allcallto = $('a[href^="tel"]');
    allcallto.each(function () {
      if ($(this).hasClass("hello")) {
      } else {
        $(this).addClass("hello");
        var replacedtel = $(this).attr("href");
        var regex = /[+]?\d+/g;
        replacedtel = replacedtel.match(regex).join("");

        var size = $(this).css("font-size");

        replacedtel = decodeURIComponent(replacedtel);
        var html = $(
          '<span onclick="event.preventDefault();" class = "calllink"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline; cursor:pointer;"/></span>'
        );
        $(this).nextAll(".calllink").remove();

        $(this).after(html);
        html.click(function () {
          openNumber(replacedtel);
        });
        var smshtml = $(
          '<span onclick="event.preventDefault();" class = "smslink"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline; cursor:pointer;"/></span>'
        );
        $(this).nextAll(".smslink").remove();

        html.after(smshtml);
        smshtml.click(function () {
          openSMS(replacedtel);
        });
        countnumbersfound = countnumbersfound + 1;
        updateCount(countnumbersfound);
      }
    });
  }
}

function replaceLeadsquared() {
  var url = window.location.href;
  if (url.indexOf("leadsquared.com") >= 0) {
    var allcallto = $("div.lead-grid-phone-field");
    allcallto.each(function () {
      if ($(this).hasClass("hello")) {
      } else {
        $(this).addClass("hello");
        var replacedtel = $(this).text();
        var regex = /[+]?\d+/g;
        replacedtel = replacedtel.match(regex).join("");
        console.log(replacedtel);
        $(this).css("width", "100%");

        var size = $(this).css("font-size");

        replacedtel = decodeURIComponent(replacedtel);
        var html = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '" target="_blank" onclick="event.preventDefault();" class = "calllink"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".calllink").remove();

        $(this).append(html);
        html.click(function () {
          openNumber(replacedtel);
        });
        var smshtml = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '&sms=1" target="_blank" onclick="event.preventDefault();" class = "smslink"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".smslink").remove();

        $(this).append(smshtml);
        smshtml.click(function () {
          openSMS(replacedtel);
        });
        countnumbersfound = countnumbersfound + 1;
        updateCount(countnumbersfound);
      }
    });

    var allcallto = $(
      'div.phone, div[data-schema-name*="Phone"], div[data-schema-name*="phone"], div[data-schema-name*="Mobile"], div[data-schema-name*="mobile"]'
    );
    allcallto.each(function () {
      if ($(this).hasClass("hello")) {
      } else {
        $(this).addClass("hello");
        var replacedtel = "";
        var replacedtelnumbers = $(this).text();
        var replacedtelarray = replacedtelnumbers.split(" ");
        var replacedtelarray = Array.from(new Set(replacedtelarray));
        replacedtelarray.forEach(function (value) {
          if (value == "" || value == "\n") {
            return;
          }
          var regex = /[+]?\d+/g;
          value = value.match(regex).join("");
          replacedtel = replacedtel + "," + value;
        });

        replacedtel = replacedtel.substring(1);

        if (replacedtel == "") {
          return;
        }

        var size = $(this).css("font-size");

        replacedtel = decodeURIComponent(replacedtel);
        var html = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '" target="_blank" onclick="event.preventDefault();" class = "calllink"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".calllink").remove();

        $(this).append(html);
        html.click(function () {
          openNumber(replacedtel);
        });
        var smshtml = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '&sms=1" target="_blank" onclick="event.preventDefault();" class = "smslink"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".smslink").remove();

        $(this).append(smshtml);
        smshtml.click(function () {
          openSMS(replacedtel);
        });
        countnumbersfound = countnumbersfound + 1;
        updateCount(countnumbersfound);
      }
    });
  }
}

function replaceBloobirds() {
  var url = window.location.href;
  if (url.indexOf("bloobirds.com") >= 0) {
    var allcallto = $("div[data-test*='Phone'], p[data-test*='Phone']");
    allcallto.each(function () {
      if ($(this).hasClass("hello")) {
      } else {
        $(this).addClass("hello");
        var replacedtel = $(this).text();
        var regex = /[+]?\d+/g;
        replacedtel = replacedtel.match(regex).join("");

        var size = $(this).css("font-size");

        replacedtel = decodeURIComponent(replacedtel);
        var html = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '" target="_blank" onclick="event.preventDefault();" class = "calllink"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".calllink").remove();

        $(this).append(html);
        html.click(function () {
          openNumber(replacedtel);
        });
        var smshtml = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '&sms=1" target="_blank" onclick="event.preventDefault();" class = "smslink"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".smslink").remove();

        $(this).append(smshtml);
        smshtml.click(function () {
          openSMS(replacedtel);
        });
        countnumbersfound = countnumbersfound + 1;
        updateCount(countnumbersfound);
      }
    });

    var allcallto = $(
      "span.content-module__fieldLinkTitle___1GcNp:contains(Phone)"
    ).next();
    allcallto.each(function () {
      if ($(this).hasClass("hello")) {
      } else {
        $(this).addClass("hello");
        var replacedtel = $(this).text();
        var regex = /[+]?\d+/g;
        replacedtel = replacedtel.match(regex).join("");

        var size = $(this).css("font-size");

        replacedtel = decodeURIComponent(replacedtel);
        var html = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '" target="_blank" onclick="event.preventDefault();" class = "calllink"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".calllink").remove();

        $(this).append(html);
        html.click(function () {
          openNumber(replacedtel);
        });
        var smshtml = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '&sms=1" target="_blank" onclick="event.preventDefault();" class = "smslink"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".smslink").remove();

        $(this).append(smshtml);
        smshtml.click(function () {
          openSMS(replacedtel);
        });
        countnumbersfound = countnumbersfound + 1;
        updateCount(countnumbersfound);
      }
    });
  }
}

function replaceAmoCRM() {
  var url = window.location.href;
  if (url.indexOf("amocrm.com") >= 0) {
    var allcallto = $("a[href^='tel:']");
    allcallto.each(function () {
      if ($(this).hasClass("hello")) {
      } else {
        $(this).addClass("hello");
        var replacedtel = $(this).attr("href");
        var regex = /[+]?\d+/g;
        replacedtel = replacedtel.match(regex).join("");

        var size = $(this).css("font-size");

        replacedtel = decodeURIComponent(replacedtel);
        var html = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '" onclick="event.preventDefault();" class = "calllink"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".calllink").remove();

        $(this).before(html);
        html.click(function () {
          openNumber(replacedtel);
        });
        var smshtml = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '&sms=1" onclick="event.preventDefault();" class = "smslink"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".smslink").remove();

        html.after(smshtml);
        smshtml.click(function () {
          openSMS(replacedtel);
        });
        countnumbersfound = countnumbersfound + 1;
        updateCount(countnumbersfound);
      }
    });

    var allcallto = $('div[data-pei-code*="phone"]');
    allcallto.each(function () {
      console.log("profile");
      if ($(this).hasClass("hello")) {
      } else {
        $(this).addClass("hello");
        var replacedtel = $(this).find("input[data-type='phone']").val();
        var regex = /[+]?\d+/g;
        replacedtel = replacedtel.match(regex).join("");

        var size = $(this).css("font-size");

        replacedtel = decodeURIComponent(replacedtel);
        var html = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '" onclick="event.preventDefault();" class = "calllink"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".calllink").remove();

        $(this).after(html);
        html.click(function () {
          openNumber(replacedtel);
        });
        var smshtml = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '&sms=1" onclick="event.preventDefault();" class = "smslink"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).nextAll(".smslink").remove();

        html.after(smshtml);
        smshtml.click(function () {
          openSMS(replacedtel);
        });
        countnumbersfound = countnumbersfound + 1;
        updateCount(countnumbersfound);
      }
    });
  }
}

function replaceFreshdeskSpans(freshdeskspans) {
  // return;

  var test = window.location.href;
  var result = test.indexOf("freshdesk");

  if (result != -1) {
    freshdeskspans = $("span:contains('Phone : ')");

    freshdeskspans.each(function () {
      var gotText = $(this).text();

      var gotNumber = gotText.replace("Phone : ", "");
      // gotNumber = gotNumber.replace("+","");
      var html =
        '<a style="cursor:pointer" href = "https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
        gotNumber +
        '" target="_blank" onclick="event.preventDefault()">' +
        gotNumber +
        "</a>";
      var size = $(this).css("font-size");
      html =
        html +
        '<img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
        size +
        " !important;width:" +
        size +
        ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/>';
      $(this).html(html);
      $(this).click(function () {
        openNumber(gotNumber);
      });
      var smshtml = $(
        '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
          gotNumber +
          '&sms=1" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
          size +
          " !important;width:" +
          size +
          ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
      );
      $(this).after(smshtml);
      smshtml.click(function () {
        openSMS(gotNumber);
      });
      countnumbersfound = countnumbersfound + 1;
      updateCount(countnumbersfound);
    });

    var freshdeskspans2 = $(".can-make-calls");

    freshdeskspans2.each(function () {
      if ($(this).hasClass("hello")) {
      } else {
        $(this).addClass("hello");
        var gotText = $(this).text();
        $(this).css("display", "inline-block");
        var gotNumber = gotText.replace("Phone : ", "");
        // gotNumber = gotNumber.replace("+","");
        var html =
          '<a style="cursor:pointer" href = "https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
          gotNumber +
          '" target="_blank" onclick="event.preventDefault()">' +
          gotNumber +
          "</a>";
        var size = $(this).css("font-size");
        html =
          html +
          '<img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
          size +
          " !important;width:" +
          size +
          ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/>';
        $(this).html(html);
        $(this).click(function () {
          openNumber(gotNumber);
        });
        var smshtml = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            gotNumber +
            '&sms=1" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).after(smshtml);
        smshtml.click(function () {
          openSMS(gotNumber);
        });
        countnumbersfound = countnumbersfound + 1;
        updateCount(countnumbersfound);
      }
    });
  }
}

function replaceReamaze() {
  var regex =
    /(\+?(?:(?:9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)|\((?:9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\))[0-9. -]{4,14})(?:\b|x\d+)/;
  var test = window.location.hostname;
  if (test.indexOf("reamaze.com") != -1) {
    var parent = $(".rmzfa-mobile-alt").parent();
    var all_elements = $(".rmzfa-mobile-alt").parent();

    // console.log(all_elements);

    all_elements.each(function () {
      var this_number = $(this).clone().children().remove().end().text();
      // console.log("mili");
      if (regex.test(this_number) == true) {
        if ($(this).hasClass("hello")) {
        } else {
          $(this).addClass("hello");
          var gotText = this_number;
          gotText = gotText.replace(/\s/g, "");
          // console.log(gotText);
          // $(this).css("display","inline-block");
          // $(this).css("width","110%");

          var gotNumber = gotText;
          // gotNumber = gotNumber.replace("+","");
          // var html = '<a style="cursor:pointer" href = "https://justcall.io/app/macapp/dialpad_app.php?numbers='+gotNumber+'" target="_blank" onclick="event.preventDefault();">'+gotText+'</a>';
          var size = $(this).css("font-size");
          html =
            '<a style="cursor:pointer" href = "https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            gotNumber +
            '" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>';
          var sethtml = $(html);
          sethtml.click(function () {
            openNumber(gotNumber);
          });

          $(this).append(sethtml);
          // $(this).click(function(){ openNumber(gotNumber); });
          var smshtml = $(
            '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
              gotNumber +
              '&sms=1" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
              size +
              " !important;width:" +
              size +
              ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
          );
          $(this).append(smshtml);
          smshtml.click(function () {
            openSMS(gotNumber);
          });
          countnumbersfound = countnumbersfound + 1;
          updateCount(countnumbersfound);
        }
      }
    });
  }
}

function replaceOntraport() {
  var test = window.location.href;
  var result = test.indexOf("app.ontraport.com");

  if (result != -1) {
    var allcontacts = $(
      ".ussr-component-collection-cell-type-phone, .ussr-component-collection-cell-type-sms"
    );

    if (allcontacts.hasClass("hello")) {
    } else {
      allcontacts.addClass("hello");

      allcontacts.each(function () {
        var phone_number_element = $(this).find("a");
        var phone_number = phone_number_element.text();

        var gotText = phone_number.replace(/[^0-9.]/g, "");
        // console.log(gotText);

        if (gotText) {
          var gotNumber = gotText;
          var size = phone_number_element.css("font-size");
          var html =
            '<a style="cursor:pointer" href = "https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            gotNumber +
            '" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>';
          var sethtml = $(html);
          sethtml.click(function () {
            openNumber(gotNumber);
          });
          phone_number_element.append(sethtml);
          var smshtml = $(
            '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
              gotNumber +
              '&sms=1" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
              size +
              " !important;width:" +
              size +
              ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
          );
          smshtml.click(function () {
            openSMS(gotNumber);
          });
          phone_number_element.append(smshtml);
          countnumbersfound = countnumbersfound + 1;
          updateCount(countnumbersfound);
        }
      });
    }

    var allcontacts = $(".ussr-component");

    allcontacts.each(function () {
      var phone_number_element = $(this).find(".ussr-form-input");
      var phone_number = phone_number_element.text();

      if (phone_number_element.hasClass("hello")) {
      } else {
        var inserting_elem = $(this).find(
          "> .ussr-component-input > .ussr-form-label"
        );
        var inserting_elem_text = inserting_elem.text();

        // console.log("inserting_elem_text ",inserting_elem_text);

        if (
          inserting_elem_text.indexOf("Office Phone") > -1 ||
          inserting_elem_text.indexOf("SMS Number") > -1 ||
          inserting_elem_text.indexOf("Fax") > -1 ||
          inserting_elem_text.indexOf("Mobile Phone") > -1
        ) {
          phone_number_element.addClass("hello");
        } else {
          return;
        }

        var gotText = phone_number.replace(/[^0-9.]/g, "");

        if (gotText) {
          var gotNumber = gotText;
          var size = phone_number_element.css("font-size");
          var html =
            '<a style="cursor:pointer" href = "https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            gotNumber +
            '" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>';
          var sethtml = $(html);
          sethtml.click(function () {
            openNumber(gotNumber);
          });

          var smshtml = $(
            '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
              gotNumber +
              '&sms=1" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
              size +
              " !important;width:" +
              size +
              ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
          );
          smshtml.click(function () {
            openSMS(gotNumber);
          });

          inserting_elem.after(smshtml);
          inserting_elem.after(sethtml);
          countnumbersfound = countnumbersfound + 1;
          updateCount(countnumbersfound);
        }
      }
    });

    // }
  }
}

function replaceCapsule() {
  var test = window.location.href;
  var result = test.indexOf("capsulecrm");

  if (result != -1) {
    if (test.indexOf("parties") >= 0) {
      var allcontacts = $("td.list-results__cell--phone").find(
        "div.contact-detail__detail"
      );

      allcontacts.each(function (index) {
        var phone_number = $(this).text().trim();
        if ($(this).attr("hello") == phone_number) {
        } else {
          $(this).attr("hello", phone_number);
          gotText = phone_number;

          if (gotText) {
            var gotNumber = gotText;
            var size = $(this).css("font-size");
            var html =
              '<a class="capsule-jc-call" style="cursor:pointer" href = "https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
              gotNumber +
              '" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
              size +
              " !important;width:" +
              size +
              ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>';

            var sethtml = $(html);
            sethtml.click(function () {
              openNumber(gotNumber);
            });
            $(this).nextAll(".capsule-jc-call").remove();
            $(this).after(sethtml);
            var smshtml = $(
              '<a class="capsule-jc-sms" href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
                gotNumber +
                '&sms=1" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
                size +
                " !important;width:" +
                size +
                ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
            );

            smshtml.click(function () {
              openSMS(gotNumber);
            });
            $(this).nextAll(".capsule-jc-sms").remove();
            sethtml.after(smshtml);

            countnumbersfound = countnumbersfound + 1;
            updateCount(countnumbersfound);
          }
        }
      });
    }
    if (test.indexOf("/party/") >= 0) {
      var allcontacts = $("div.contact-detail--phone-number").find(
        "div.contact-detail__detail"
      );
      allcontacts.each(function () {
        if ($(this).hasClass("hello")) {
        } else {
          $(this).addClass("hello");
          var phone_number = $(this).text().trim();
          gotText = phone_number;

          if (gotText) {
            var gotNumber = gotText;
            var size = $(this).css("font-size");
            var html =
              '<a style="cursor:pointer" href = "https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
              gotNumber +
              '" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
              size +
              " !important;width:" +
              size +
              ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>';
            var sethtml = $(html);
            sethtml.click(function () {
              openNumber(gotNumber);
            });
            $(this).append(sethtml);
            var smshtml = $(
              '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
                gotNumber +
                '&sms=1" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
                size +
                " !important;width:" +
                size +
                ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
            );
            smshtml.click(function () {
              openSMS(gotNumber);
            });
            $(this).append(smshtml);
            countnumbersfound = countnumbersfound + 1;
            updateCount(countnumbersfound);
          }
        }
      });
    }
  }
}

function replaceOnePageCRM() {
  var test = window.location.href;
  var result = test.indexOf("app.onepagecrm.com");

  if (result != -1) {
    var allcontacts = $(".phone");

    if (allcontacts.hasClass("hello")) {
    } else {
      allcontacts.addClass("hello");

      allcontacts.each(function () {
        var phone_number_element = $(this).find(".item-link");
        var phone_number = phone_number_element.text();
        var gotText = phone_number.replace(/[^+0-9.]/g, "");
        // console.log(gotText);

        if (gotText) {
          var gotNumber = gotText;
          var size = phone_number_element.css("font-size");
          var html =
            '<a style="cursor:pointer" href = "https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            gotNumber +
            '" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>';
          var sethtml = $(html);
          sethtml.click(function () {
            openNumber(gotNumber);
          });
          $(this).append(sethtml);
          var smshtml = $(
            '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
              gotNumber +
              '&sms=1" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
              size +
              " !important;width:" +
              size +
              ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
          );
          smshtml.click(function () {
            openSMS(gotNumber);
          });
          $(this).append(smshtml);
          countnumbersfound = countnumbersfound + 1;
          updateCount(countnumbersfound);
        }
      });
    }

    var allcontacts = $(".phone-area");

    if (allcontacts.hasClass("hello")) {
    } else {
      allcontacts.addClass("hello");

      allcontacts.each(function () {
        var phone_number_element = $(this).find(".show-app-call").first();
        var phone_number = phone_number_element.text();
        var gotText = phone_number.replace(/[^+0-9.]/g, "");
        // console.log(gotText);

        if (gotText) {
          var gotNumber = gotText;
          var size = phone_number_element.css("font-size");
          var html =
            '<a style="cursor:pointer" href = "https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            gotNumber +
            '" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>';
          var sethtml = $(html);
          sethtml.click(function () {
            openNumber(gotNumber);
          });
          $(this).append(sethtml);
          var smshtml = $(
            '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
              gotNumber +
              '&sms=1" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
              size +
              " !important;width:" +
              size +
              ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
          );
          smshtml.click(function () {
            openSMS(gotNumber);
          });
          $(this).append(smshtml);
          countnumbersfound = countnumbersfound + 1;
          updateCount(countnumbersfound);
        }
      });
    }

    return;
  }
}

function replaceZsell() {
  var test = window.location.href;
  var result = test.indexOf("app.futuresimple.com");
  // var result2 = test.indexOf("activehosted");

  // console.log("this is replace zsell function");

  if (result != -1) {
    // console.log("this is active campaign");
    var allcontacts = $("a[href^='tel']:visible");

    // console.log(allcontacts);

    allcontacts.each(function () {
      if ($(this).hasClass("hello")) {
      } else {
        $(this).addClass("hello");

        var phone_number = $(this).attr("href");
        var regex = /[+]?\d+/g;
        phone_number = phone_number.match(regex).join("");

        if (phone_number) {
          var gotText = phone_number;
          // console.log("gotText ",gotText);

          if (gotText) {
            var gotNumber = gotText;
            var size = $(this).css("font-size");
            var html =
              '<a style="cursor:pointer" href = "https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
              gotNumber +
              '" target="_blank" onclick="event.stopPropagation();"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
              size +
              " !important;width:" +
              size +
              ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>';
            var sethtml = $(html);
            sethtml.click(function () {
              openNumber(gotNumber);
            });
            $(this)
              .closest("button[data-test-id^='phone-number-button']")
              .after(sethtml);
            var smshtml = $(
              '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
                gotNumber +
                '&sms=1" target="_blank" onclick="event.stopPropagation();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
                size +
                " !important;width:" +
                size +
                ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
            );
            smshtml.click(function () {
              openSMS(gotNumber);
            });
            sethtml.after(smshtml);
            countnumbersfound = countnumbersfound + 1;
            updateCount(countnumbersfound);
          }
        }
      }
    });
  }
}

function replaceActiveCampaign() {
  var test = window.location.href;
  var result = test.indexOf("activehosted.com/app/contacts");

  var result2 =
    test.indexOf("crm.simple.trade/app/contacts") > -1 ||
    test.indexOf("wolfpackadvising.com/app/contacts") > -1 ||
    test.indexOf("crm.osteostrongriverside.com/app/contacts") > -1 ||
    test.indexOf("crm.osteostronglakemary.com/app/contacts") > -1 ||
    test.indexOf("crm.followupasaservice.com/app/contacts") > -1 ||
    test.indexOf("crm.osteostrongatx.com/app/contacts") > -1 ||
    test.indexOf("crm.osteostrongboulder.com/app/contacts") > -1 ||
    test.indexOf("crm.otbtax.com/app/contacts") > -1;

  if (result != -1 || result2) {
    var allcontacts = $('.phone,td[data-testid="c-table__cell--phone"]');
    if (allcontacts.hasClass("hello")) {
    } else {
      allcontacts.addClass("hello");
      allcontacts.each(function () {
        var phone_number_element_A = $(this).find("a");
        var phone_number_element = $(this).find("a").text();
        //console.log('phone_number_element_A: ',phone_number_element_A);

        if (phone_number_element_A.length == 0) {
          phone_number_element_A = $(this).find("span");
          //console.log('phone_number_element_A 2: ',phone_number_element_A);
          phone_number_element = $(this).find("span").text();
        }

        var gotText = phone_number_element.replace(/[^0-9.+]/g, "");
        // console.log(gotText);
        if (gotText.length >= 9 && gotText.length < 18) {
          // console.log("this can be a phone number");
          // console.log(gotText);
          var size = phone_number_element_A.css("font-size");
          var html =
            '<a style="cursor:pointer" href = "https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            gotText +
            '" target="_blank" onclick="event.stopPropagation();"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>';
          var sethtml = $(html);
          sethtml.click(function () {
            openNumber(gotText);
          });
          phone_number_element_A.after(sethtml);
          var smshtml = $(
            '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
              gotText +
              '&sms=1" target="_blank" onclick="event.stopPropagation();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
              size +
              " !important;width:" +
              size +
              ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
          );
          smshtml.click(function () {
            openSMS(gotText);
          });
          phone_number_element_A.after(smshtml);
          countnumbersfound = countnumbersfound + 1;
          updateCount(countnumbersfound);
        }
      });
    }

    var phone_field = $("#field_phone").find(".inline-edit");
    var this_phone_number = $("#field_phone").find(".value").text();

    if (phone_field.hasClass("hello")) {
    } else {
      phone_field.addClass("hello");

      gotText = this_phone_number.replace(/[^0-9.+]/g, "");
      // console.log(gotText);
      var gotNumber = gotText;
      var size = phone_field.css("font-size");
      var html =
        '<a style="cursor:pointer" href = "https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
        gotNumber +
        '" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
        size +
        " !important;width:" +
        size +
        ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>';
      var sethtml = $(html);
      sethtml.click(function () {
        openNumber(gotNumber);
      });

      var smshtml = $(
        '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
          gotNumber +
          '&sms=1" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
          size +
          " !important;width:" +
          size +
          ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
      );
      smshtml.click(function () {
        openSMS(gotNumber);
      });
      phone_field.append(smshtml);
      phone_field.append(sethtml);

      countnumbersfound = countnumbersfound + 1;
      updateCount(countnumbersfound);
    }

    var allcontacts = $("div[data-testid=field-phone-value]");
    allcontacts.each(function () {
      if ($(this).hasClass("hello")) {
      } else {
        $(this).addClass("hello");
        var phone_number_element = $(this).find(
          'span[data-testid="displayed-text"]'
        );
        var phone_number = $(phone_number_element).text();
        console.log(phone_number);

        var gotText = phone_number.replace(/[^0-9.+]/g, "");
        // console.log(gotText);
        if (gotText.length >= 9 && gotText.length < 18) {
          // console.log("this can be a phone number");
          // console.log(gotText);
          var size = phone_number_element.css("font-size");
          var html =
            '<a style="cursor:pointer" href = "https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            gotText +
            '" target="_blank" onclick="event.stopPropagation();"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>';
          var sethtml = $(html);
          sethtml.click(function () {
            openNumber(gotText);
          });
          phone_number_element.after(sethtml);
          var smshtml = $(
            '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
              gotText +
              '&sms=1" target="_blank" onclick="event.stopPropagation();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
              size +
              " !important;width:" +
              size +
              ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
          );
          smshtml.click(function () {
            openSMS(gotText);
          });
          phone_number_element.after(smshtml);
          countnumbersfound = countnumbersfound + 1;
          updateCount(countnumbersfound);
        }
      }
    });
  }

  var result = test.indexOf("activehosted.com/app/deals");
  var result2 =
    test.indexOf("crm.simple.trade/app/deals") > -1 ||
    test.indexOf("wolfpackadvising.com/app/deals") > -1 ||
    test.indexOf("crm.osteostrongriverside.com/app/deals") > -1 ||
    test.indexOf("crm.osteostronglakemary.com/app/deals") > -1 ||
    test.indexOf("crm.followupasaservice.com/app/deals") > -1 ||
    test.indexOf("crm.osteostrongatx.com/app/deals") > -1 ||
    test.indexOf("crm.osteostrongboulder.com/app/deals") > -1 ||
    test.indexOf("crm.otbtax.com/app/deals") > -1;

  if (result != -1 || result2) {
    var allcontacts = $(".phone");
    // allcontacts.addClass("hello");
    // console.log("URL MILA");

    allcontacts.each(function () {
      if ($(this).hasClass("hello")) {
      } else {
        var phone_number_element_A = $(this);
        $(this).addClass("hello");
        var phone_number_element = $(this).text();
        var gotText = phone_number_element.replace(/[^0-9.+]/g, "");
        // console.log("deals number ", gotText);
        if (gotText.length >= 9 && gotText.length < 14) {
          // console.log("this can be a phone number ", gotText);
          // console.log(gotText);
          var size = $(this).css("font-size");
          var html =
            '<a style="cursor:pointer" href = "https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            gotText +
            '" target="_blank" onclick="event.stopPropagation()"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>';
          var sethtml = $(html);
          sethtml.click(function () {
            openNumber(gotText);
          });
          $(this).append(sethtml);
          var smshtml = $(
            '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
              gotText +
              '&sms=1" target="_blank" onclick="event.stopPropagation()"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
              size +
              " !important;width:" +
              size +
              ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
          );
          smshtml.click(function () {
            openSMS(gotText);
          });
          $(this).append(smshtml);
          countnumbersfound = countnumbersfound + 1;
          updateCount(countnumbersfound);
        }
      }
    });
  }
}

function replace_harley_dufek() {
  var test = window.location.hostname;
  if (test.indexOf("findmetrodchomes.com") != -1) {
    var allleads = $(".lead-info");

    allleads.each(function () {
      var getChild = $(this).find(".cell-text").first();
      var getatag = getChild.find("a");

      if (getatag.hasClass("hello")) {
      } else {
        getatag.addClass("hello");
        var index = 0;
        var gotText = getatag.contents().eq(index).text();
        gotText = gotText.replace(/\s/g, "");
        // console.log(gotText);
        var gotNumber = gotText;
        //  var html = '<a style="cursor:pointer" href = "https://justcall.io/app/macapp/dialpad_app.php?numbers='+gotNumber+'" target="_blank" onclick="event.preventDefault();">'+gotText+'</a>';
        var size = $(this).css("font-size");
        var html =
          '<a style="cursor:pointer" href = "https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
          gotNumber +
          '" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
          size +
          " !important;width:" +
          size +
          ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>';
        var sethtml = $(html);
        sethtml.click(function () {
          openNumber(gotNumber);
        });
        getatag.after(sethtml);
        var smshtml = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            gotNumber +
            '&sms=1" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        smshtml.click(function () {
          openSMS(gotNumber);
        });
        getatag.after(smshtml);
        countnumbersfound = countnumbersfound + 1;
        updateCount(countnumbersfound);
      }
    });

    var allphone = $(".js-baseplaceholder");

    allphone.each(function () {
      var getatag = $(this).find(".dropdown-toggle");
      var phone_number = getatag.find("span").first().text();
      phone_number = phone_number.replace(/\s/g, "");
      // console.log(phone_number);
      if (getatag.hasClass("hello")) {
      } else {
        getatag.addClass("hello");
        var gotNumber = phone_number;
        var size = $(this).css("font-size");
        var html =
          '<a style="cursor:pointer" href = "https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
          gotNumber +
          '" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
          size +
          " !important;width:" +
          size +
          ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>';
        var sethtml = $(html);
        sethtml.click(function () {
          openNumber(gotNumber);
        });
        getatag.after(sethtml);
        var smshtml = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            gotNumber +
            '&sms=1" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        smshtml.click(function () {
          openSMS(gotNumber);
        });
        getatag.after(smshtml);
        countnumbersfound = countnumbersfound + 1;
        updateCount(countnumbersfound);
      }
    });
  }
}

function replaceOP() {
  var test = window.location.hostname;
  if (test.indexOf("close.com") != -1) {
    var allhrefs = $('a[href^="tel"]:visible');
    // console.log("hrefs on this page");

    allhrefs.each(function () {
      var href = $(this).attr("href");
      // console.log(href);
      // console.log("mai hi hun");
      var replacedtel = href.replace("tel:", "");

      $(this).attr("href", "");

      $(this).attr("onclick", "event.preventDefault()");
      $(this).removeClass("js-call");
      $(this).removeClass("call-specific");

      // $(this).removeClass("call");

      $(this).addClass("callbutton_js");

      var urltosend =
        "https://justcall.io/app/macapp/dialpad_app.php?numbers=" + replacedtel;
      $(this).click(function () {
        openNumberZoho(urltosend, replacedtel, "call");
      });
    });

    var allhrefs = $(".js-sms");
    // console.log("hrefs on this page");

    allhrefs.each(function () {
      var href = $(this).attr("href");
      // console.log(href);
      // console.log("mai hi hun");
      var replacedtel = href.replace("tel:", "");

      var title = $(this).attr("data-original-title");
      title = title.replace("Send SMS to ", "");

      replacedtel = title;

      $(this).attr("href", "#");

      $(this).attr("onclick", "event.preventDefault()");
      $(this).removeClass("js-sms");
      $(this).addClass("callbuttonsms_js");

      var urltosend =
        "https://justcall.io/app/macapp/dialpad_app.php?numbers=" +
        replacedtel +
        "&sms=1";
      $(this).click(function () {
        openNumberZoho(urltosend, replacedtel, "sms");
      });
    });
  }
}

function replaceLA() {
  // return;
  var regex =
    /(\+?(?:(?:9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)|\((?:9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\))[0-9. -]{4,14})(?:\b|x\d+)/;
  var test = window.location.hostname;
  if (test.indexOf("lessannoyingcrm") != -1) {
    $("span[class='ContactDetailsInfo']").each(function () {
      // console.log("mili");
      if (regex.test($(this).text()) == true) {
        if ($(this).text().length < 5) {
          return;
        }

        if ($(this).hasClass("hello")) {
        } else {
          $(this).addClass("hello");
          var gotText = $(this).text();
          gotText = gotText.replace(/\s/g, "");
          // console.log(gotText);
          // $(this).css("display","inline-block");
          // $(this).css("width","110%");

          var gotNumber = gotText.replace("(directline)", "");
          // gotNumber = gotNumber.replace("+","");
          var html =
            '<a style="cursor:pointer" href = "https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            gotNumber +
            '" target="_blank" onclick="event.preventDefault();"></a>';
          var size = $(this).css("font-size");
          html =
            html +
            '<img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/>';
          var sethtml = $(html);
          sethtml.click(function () {
            openNumber(gotNumber);
          });
          $(this).after(sethtml);

          // $(this).click(function(){ openNumber(gotNumber); });
          var smshtml = $(
            '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
              gotNumber +
              '&sms=1" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
              size +
              " !important;width:" +
              size +
              ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
          );
          $(this).after(smshtml);
          smshtml.click(function () {
            openSMS(gotNumber);
          });
          countnumbersfound = countnumbersfound + 1;
          updateCount(countnumbersfound);
        }
      }
    });

    $(".PhoneNumberClickable").each(function () {
      // console.log("mili");
      if (regex.test($(this).text()) == true) {
        if ($(this).text().length < 5) {
          return;
        }

        if ($(this).hasClass("hello")) {
        } else {
          $(this).addClass("hello");
          var gotText = $(this).text();
          gotText = gotText.replace(/\s/g, "");
          // console.log(gotText);
          // $(this).css("display","inline-block");
          // $(this).css("width","110%");

          var gotNumber = gotText.replace("(directline)", "");
          // gotNumber = gotNumber.replace("+","");
          var html =
            '<a style="cursor:pointer" href = "https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            gotNumber +
            '" target="_blank" onclick="event.preventDefault();"></a>';
          var size = $(this).css("font-size");
          html =
            html +
            '<img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/>';
          var sethtml = $(html);
          sethtml.click(function () {
            openNumber(gotNumber);
          });
          $(this).after(sethtml);

          // $(this).click(function(){ openNumber(gotNumber); });
          var smshtml = $(
            '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
              gotNumber +
              '&sms=1" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
              size +
              " !important;width:" +
              size +
              ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
          );
          $(this).after(smshtml);
          smshtml.click(function () {
            openSMS(gotNumber);
          });
          countnumbersfound = countnumbersfound + 1;
          updateCount(countnumbersfound);
        }
      }
    });
    // console.log(results);

    $(".IconSprite-translucent_telephone")
      .next()
      .each(function () {
        // console.log("mili");
        if (regex.test($(this).text()) == true) {
          if ($(this).hasClass("hello")) {
          } else {
            $(this).addClass("hello");
            var gotText = $(this).text();
            gotText = gotText.replace(/\s/g, "");
            // console.log(gotText);
            // $(this).css("display","inline-block");
            // $(this).css("width","110%");

            var gotNumber = gotText.replace("(directline)", "");
            // gotNumber = gotNumber.replace("+","");
            var html =
              '<a style="cursor:pointer" href = "https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
              gotNumber +
              '" target="_blank" onclick="event.preventDefault();">' +
              gotText +
              "</a>";
            var size = $(this).css("font-size");
            html =
              html +
              '<img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
              size +
              " !important;width:" +
              size +
              ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/>';
            var sethtml = $(html);
            sethtml.click(function () {
              openNumber(gotNumber);
            });

            $(this).html(sethtml);
            // $(this).click(function(){ openNumber(gotNumber); });
            var smshtml = $(
              '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
                gotNumber +
                '&sms=1" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
                size +
                " !important;width:" +
                size +
                ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
            );
            $(this).append(smshtml);
            smshtml.click(function () {
              openSMS(gotNumber);
            });
            countnumbersfound = countnumbersfound + 1;
            updateCount(countnumbersfound);
          }
        }
      });

    var allcontacts = $(".ContactInfoLeft");

    allcontacts.each(function () {
      if ($(this).hasClass("hello")) {
      } else {
        $(this).addClass("hello");

        var phone_number = $(this).find("span");
        var phone_number_text = phone_number.text();

        var gotText = phone_number_text.replace(/[^0-9.]/g, "");

        if (gotText) {
          var gotNumber = gotText;
          var size = phone_number.css("font-size");
          var html =
            '<a style="cursor:pointer" href = "https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            gotNumber +
            '" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>';
          var sethtml = $(html);
          sethtml.click(function () {
            openNumber(gotNumber);
          });
          phone_number.after(sethtml);
          var smshtml = $(
            '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
              gotNumber +
              '&sms=1" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
              size +
              " !important;width:" +
              size +
              ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
          );
          smshtml.click(function () {
            openSMS(gotNumber);
          });
          phone_number.after(smshtml);
          countnumbersfound = countnumbersfound + 1;
          updateCount(countnumbersfound);
        }
      }
    });
    var allcontacts = $(".NoPrint").find("span");
    allcontacts.each(function () {
      if ($(this).hasClass("hello")) {
      } else {
        $(this).addClass("hello");

        // if()

        var phone_number_text = $(this).text();

        // console.log("length is phone_number_text "+phone_number_text.length);
        // console.log("phone_number_text "+phone_number_text);

        if (
          phone_number_text.length < 5 ||
          phone_number_text.indexOf("of") !== -1
        ) {
          return;
        }
        var gotText = phone_number_text.replace(/[^0-9.]/g, "");

        if (gotText) {
          var gotNumber = gotText;
          var size = $(this).css("font-size");
          var html =
            '<a style="cursor:pointer" href = "https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            gotNumber +
            '" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>';
          var sethtml = $(html);
          sethtml.click(function () {
            openNumber(gotNumber);
          });
          $(this).after(sethtml);
          var smshtml = $(
            '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
              gotNumber +
              '&sms=1" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
              size +
              " !important;width:" +
              size +
              ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
          );
          smshtml.click(function () {
            openSMS(gotNumber);
          });
          $(this).after(smshtml);
          countnumbersfound = countnumbersfound + 1;
          updateCount(countnumbersfound);
        }
      }
    });
  }
}

function replaceOPCSkypes() {
  // return;
  var grooveparagraphs = $(".phone-number");

  grooveparagraphs.each(function () {
    if ($(this).hasClass("hello")) {
    } else {
      $(this).addClass("hello");
      var gotText = $(this).text();
      $(this).css("display", "inline-block");

      var gotNumber = gotText.replace("Mobile", "");
      gotNumber = gotNumber.replace("Work", "");
      gotNumber = gotNumber.replace("Copy", "");
      gotNumber = gotNumber.replace("Home", "");
      gotNumber = gotNumber.replace("Direct", "");
      gotNumber = gotNumber.replace("Fax", "");
      gotNumber = gotNumber.replace("Skype", "");
      gotNumber = gotNumber.replace("Other", "");
      gotNumber = gotNumber.replace("Organization", "");
      gotNumber = gotNumber.replace(" Start call", "");
      gotNumber = gotNumber.replace("Start call", "");

      // gotNumber = gotNumber.replace("+","");
      var size = $(this).css("font-size");
      var html =
        '<a style="cursor:pointer" href = "https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
        gotNumber +
        '" target="_blank" onclick="event.preventDefault()"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
        size +
        " !important;width:" +
        size +
        ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>';

      var sethtml = $(html);
      $(this).after(sethtml);
      sethtml.click(function () {
        openNumber(gotNumber);
      });
      var smshtml = $(
        '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
          gotNumber +
          '&sms=1" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
          size +
          " !important;width:" +
          size +
          ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
      );
      $(this).after(smshtml);
      smshtml.click(function () {
        openSMS(gotNumber);
      });
      countnumbersfound = countnumbersfound + 1;
      updateCount(countnumbersfound);
    }
  });
}

function replaceGrooveParagraphs(grooveparagraphs) {
  grooveparagraphs = $("div.KeyValue")
    .find('div.key:contains("Phone number")')
    .next();

  grooveparagraphs.each(function () {
    var gotText = $(this).text();
    // console.log(gotText);
    if ($(this).attr("phone") == gotText || $(this).hasClass("missing")) {
      if ($(this).hasClass("missing")) {
        $(this).removeAttr("phone");
        $(this).parents("div.KeyValue").parent().next(".calllink").remove();
        $(this).parents("div.KeyValue").parent().next(".smslink").remove();
      }
    } else {
      console.log(gotText);
      // gotText = $(this).text();
      $(this).attr("phone", gotText);
      var regex = /[+]?\d+/g;
      gotText = gotText.match(regex).join("");
      // $(this).css("display", "inline-block");
      var gotNumber = gotText;
      // gotNumber = gotNumber.replace("+","");
      var html = $(
        '<a class="calllink" href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
          gotNumber +
          '"target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
          size +
          " !important;width:" +
          size +
          ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
      );
      var size = $(this).css("font-size");
      $(this).parents("div.KeyValue").parent().nextAll(".calllink").remove();
      $(this).parents("div.KeyValue").parent().after(html);
      html.click(function () {
        openNumber(gotNumber);
      });
      var smshtml = $(
        '<a class="smslink" href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
          gotNumber +
          '&sms=1" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
          size +
          " !important;width:" +
          size +
          ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
      );
      $(this).parents("div.KeyValue").parent().nextAll(".smslink").remove();
      html.after(smshtml);
      smshtml.click(function () {
        openSMS(gotNumber);
      });
      countnumbersfound = countnumbersfound + 1;
      updateCount(countnumbersfound);
    }
  });
}

function replaceIntercomSpans(intercomspans) {
  var found = true;

  if (found == true) {
    // console.log("found value is true");
    var $btnActions = $("div.profile__user-data__actions");
    if ($btnActions.find("a.jc-intercom-withnum").length === 0) {
      var iconURL = chrome.runtime.getURL("icon_16.png");
      var iconURLSMS = chrome.runtime.getURL("chat_icon.png");

      // console.log("found value is true and number was found");

      var callhtml =
        '<div class="u__left ember-view"><a class="jc-intercom-withnum btn o__secondary o__in-right-list"><img alt="Call" class="jc_icon" src="' +
        iconURL +
        '"></img>  Call</a></div>';
      var smshtml =
        '<div class="u__left ember-view"><a class="jc-intercom-withnum btn o__secondary o__in-right-list"><img alt="Text" class="jc_icon" src="' +
        iconURLSMS +
        '"></img>  Text</a></div>';
      callhtml = $(callhtml);
      smshtml = $(smshtml);

      $btnActions.prepend(callhtml);
      $btnActions.prepend(smshtml);
      smshtml.click(function () {
        openIntercomSMS();
      });
      callhtml.click(function () {
        openIntercomDialer();
      });
    }
  } else {
  }
  return true;
}

function replaceIntercomSpans2() {
  var intercomspans2 = $('span[data-lookup-key="phone"]');

  intercomspans2.each(function () {
    if ($(this).hasClass("hello")) {
    } else {
      $(this).addClass("hello");
      $(this).parent().css("display", "inline-block");
      var gotText = $(this).text();
      // console.log(gotText);
      // $(this).addClass("hello");
      // console.log(gotText);
      var gotNumber = gotText;
      gotNumber = gotNumber.replace(/\s+/g, " ").trim();
      // console.log(gotNumber);
      // gotNumber = gotNumber.replace("+","");

      if (gotNumber == "Unknown") {
        return;
      }
      var size = $(this).css("font-size");
      var html =
        '<a style="cursor:pointer"  class = "val -ellipsis ng-pristine ng-untouched ng-valid ng-not-empty" onclick="event.preventDefault()"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
        size +
        " !important;width:" +
        size +
        ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>';
      html = $(html);
      $(this).val(gotText);
      $(this).after(html);
      html.click(function () {
        openNumber(gotNumber);
      });
      // $(this).remove();
      var smshtml = $(
        '<a onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
          size +
          " !important;width:" +
          size +
          ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
      );
      $(html).after(smshtml);
      smshtml.click(function () {
        openSMS(gotNumber);
      });
      countnumbersfound = countnumbersfound + 1;
      updateCount(countnumbersfound);
    }
  });
}

function replaceFrontSpans(frontspans) {
  var iframe = $("iframe[title='Settings']").contents();
  frontspans = iframe.find("span.key:contains('Phone number')").next();

  frontspans.each(function () {
    if ($(this).hasClass("hello")) {
    } else {
      $(this).addClass("hello");
      $(this).parent().css("display", "inline-block");
      var gotText = $(this).val();
      // console.log(gotText);
      // $(this).addClass("hello");
      // console.log(gotText);
      var gotNumber = gotText;
      // gotNumber = gotNumber.replace("+","");
      var size = $(this).css("font-size");
      var html =
        '<a style="cursor:pointer"  class = "val -ellipsis ng-pristine ng-untouched ng-valid ng-not-empty" onclick="event.preventDefault()"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
        size +
        " !important;width:" +
        size +
        ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>';
      html = $(html);
      $(this).val(gotText);
      $(this).after(html);
      html.click(function () {
        openNumber(gotNumber);
      });
      // $(this).remove();
      var smshtml = $(
        '<a onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
          size +
          " !important;width:" +
          size +
          ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
      );
      $(html).after(smshtml);
      smshtml.click(function () {
        openSMS(gotNumber);
      });
      countnumbersfound = countnumbersfound + 1;
      updateCount(countnumbersfound);
    }
  });
}

function replaceFrontCRMS() {
  //propertywarecrm
  // console.log("replaceFrontCRMS");
  var regex1 = /^[+][1-9]{0,1}[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
  var regex2 = /^[1-9]{0,1}[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
  var test = window.location.hostname;
  if (test.indexOf("app.frontapp") != -1) {
    var $iframe = $("iframe[title='Settings']").contents();

    $iframe
      .find(".contacts-table")
      .find(".table-cell")
      .each(function () {
        var number = $(this).find("div").text().trim();
        var regex;
        if (number.indexOf("+") >= 0) {
          regex = regex1;
        } else {
          regex = regex2;
        }
        // console.log($(this).find('div').text().trim());
        if (regex.test($(this).find("div").text().trim()) == true) {
          // console.log("regex.test == 1");

          if ($(this).hasClass("div_is_here")) {
          } else {
            $(this).addClass("div_is_here");
            var gotText = $(this).find("div").text().trim();

            gotText = gotText.replace(/\s/g, "");
            var gotNumber = gotText;
            var html =
              '<a style="cursor:pointer" href = "https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
              gotNumber +
              '" target="_blank" onclick="event.preventDefault();">' +
              gotText +
              "</a>";
            var size = $(this).css("font-size");
            html =
              html +
              '<img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
              size +
              " !important;width:" +
              size +
              ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/>';
            var sethtml = $(html);
            sethtml.click(function () {
              openNumberFront(gotNumber);
            });

            $(this).find("div").html(sethtml);
            // $(this).click(function(){ openNumber(gotNumber); });
            var smshtml = $(
              '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
                gotNumber +
                '&sms=1" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
                size +
                " !important;width:" +
                size +
                ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
            );
            $(this).find("div").append(smshtml);
            smshtml.click(function () {
              openSMSFront(gotNumber);
            });
            countnumbersfound = countnumbersfound + 1;
            updateCount(countnumbersfound);
          }
        }
      });
  }
}

function mergeTwoArray(array1, array2) {
  return array1.map((item, i) => {
    if (array2[i] && item.id === array2[i].id) {
      return array2[i];
    } else {
      return item;
    }
  });
}

function replaceIFS() {
  var test = window.location.href;
  var result = test.indexOf("nav");
  var result1 = test.indexOf("searchResult");

  if (result > 0 || result1 > 0) {
    var variable = $(
      'div.chunkFieldItem:contains("Phone 1") , div.chunkFieldItem:contains("Phone 2")'
    );

    variable.each(function () {
      if ($(this).hasClass("hello")) {
      } else {
        $(this).addClass("hello");

        var consoletext = $(this).next().text();
        // console.log(consoletext);

        // return;
        var gotText = consoletext.replace(/[^0-9]+/g, "").trim();
        // gotText = gotText.replace(/\s/g, '');
        // gotText = gotText.replace('(Other)', '');
        // gotText = gotText.replace('(Work)', '');
        // gotText = gotText.replace('(Mobile)', '');
        // gotText = gotText.replace('(Home)', '');
        console.log(gotText);
        var gotNumber = gotText;
        if (gotNumber != "") {
          // gotNumber = gotNumber.replace("+","");
          var size = $(this).next().css("font-size");
          var html =
            '<a style="cursor:pointer"  class = "val -ellipsis ng-pristine ng-untouched ng-valid ng-not-empty" onclick="event.preventDefault()"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>';
          html = $(html);
          $(this).next().after(html);
          html.click(function () {
            openNumber(gotNumber);
          });
          // $(this).remove();
          var smshtml = $(
            '<a onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
              size +
              " !important;width:" +
              size +
              ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
          );
          $(html).after(smshtml);
          smshtml.click(function () {
            openSMS(gotNumber);
          });
          countnumbersfound = countnumbersfound + 1;
          updateCount(countnumbersfound);
        }
      }
    });
  }
}

function replaceInfusionSoft() {
  var url = window.location.href;
  var contacts = $("div.contact-info").children().first();
  if (url.indexOf("keap") >= 0 || url.indexOf("infusionsoft") >= 0) {
    contacts.each(function () {
      var replacedtel = $(this).text().trim();
      var regex = /[+]?\d+/g;
      replacedtel = replacedtel.match(regex).join("");
      if ($(this).hasClass("hello")) {
      } else {
        $(this).addClass("hello");
        var size = $(this).css("font-size");
        var html = $(
          '<a style="display:inline" href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '" target="_blank" onclick="event.preventDefault();" class="calllink"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).after(html);
        html.click(function () {
          openNumber(replacedtel);
        });

        var smshtml = $(
          '<a style="display:inline" href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '&sms=1" target="_blank" onclick="event.preventDefault();" class="calllink"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        html.after(smshtml);
        smshtml.click(function () {
          openSMS(replacedtel);
        });
        countnumbersfound = countnumbersfound + 1;
        updateCount(countnumbersfound);
      }
    });
  }
}

function replaceInfusionsoftLis(infusionsoftlis) {
  // return;

  infusionsoftlis = $('li[name^="chunk-field-row-phoneWithExtension"]');

  infusionsoftlis.each(function () {
    if ($(this).hasClass("hello")) {
    } else {
      $(this).addClass("hello");
      var findthisline = $("span");
      var chunkdata = $(this).find(findthisline);
      var chunkdataspan = chunkdata[1];
      var text = $(chunkdataspan).text();
      var gotText = text.trim();
      gotText = text.replace(/[^0-9+]+/g, "").trim();
      gotText = gotText.replace(/\s/g, "");
      gotText = gotText.replace("(Other)", "");
      gotText = gotText.replace("(Work)", "");
      gotText = gotText.replace("(Mobile)", "");
      gotText = gotText.replace("(Home)", "");
      gotText = gotText.replace("(Cell)", "");
      // console.log(gotText);
      // console.log(chunkdata);
      // $(this).parent().css("display","inline-block");
      // var gotText = $(this).val();
      // // console.log(gotText);
      // // $(this).addClass("hello");
      // // console.log(gotText);
      var gotNumber = gotText;
      if (gotNumber != "") {
        // gotNumber = gotNumber.replace("+","");
        var size = $(chunkdataspan).css("font-size");
        var html =
          '<a style="cursor:pointer"  class = "val -ellipsis ng-pristine ng-untouched ng-valid ng-not-empty" onclick="event.preventDefault()"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
          size +
          " !important;width:" +
          size +
          ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>';
        html = $(html);
        $(chunkdataspan).after(html);
        html.click(function () {
          // console.log("https://justcall.io/dialer?numbersss="+gotNumber);
          openNumber(gotNumber);
        });
        // $(this).remove();
        var smshtml = $(
          '<a onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(html).after(smshtml);
        smshtml.click(function () {
          openSMS(gotNumber);
        });
        countnumbersfound = countnumbersfound + 1;
        updateCount(countnumbersfound);
      }
    }
  });

  var ifsoppurtunities = $("#contactPhone1_data");
  ifsoppurtunities.each(function () {
    if ($(this).hasClass("hello")) {
    } else {
      $(this).addClass("hello");
      var findthisline = $("div");
      var chunkdata = $(this).find(findthisline);

      var text = $(chunkdata).text();
      var gotText = text.replace(/[\r\n]/g, "").trim();
      gotText = gotText.replace(/\s/g, "");
      gotText = gotText.replace(/[^0-9+]+/g, "");
      gotText = gotText.replace("(Other)", "");
      gotText = gotText.replace("(Work)", "");
      gotText = gotText.replace("(Mobile)", "");
      gotText = gotText.replace("(Home)", "");
      gotText = gotText.replace("(Cell)", "");

      var gotNumber = gotText;
      if (gotNumber != "") {
        // gotNumber = gotNumber.replace("+","");
        var size = $(chunkdata).css("font-size");
        var html =
          '<a style="cursor:pointer"  class = "val -ellipsis ng-pristine ng-untouched ng-valid ng-not-empty" onclick="event.preventDefault()"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
          size +
          " !important;width:" +
          size +
          ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>';
        html = $(html);
        $(chunkdata).after(html);
        html.click(function () {
          openNumber(gotNumber);
        });
        // $(this).remove();
        var smshtml = $(
          '<a onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(html).after(smshtml);
        smshtml.click(function () {
          openSMS(gotNumber);
        });
        countnumbersfound = countnumbersfound + 1;
        updateCount(countnumbersfound);
      }
    }
  });
}

function replaceHubspotTable() {
  // return;
  var found = false;
  var elements = $("td[data-test-id*='phone'], td[data-test-id*='mobile']"),
    entity = null;
  var regex =
    /(\+?(?:(?:9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)|\((?:9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\))[0-9. -]{4,14})(?:\b|x\d+)/;
  var regex2 = /[a-zA-Z]/g;
  var striped_number = "";

  // search for contact type
  if (location.pathname.match(/^\/(company|companies)/i)) {
    entity = "company";
  } else if (location.pathname.match(/^\/(contact|contacts)/i)) {
    entity = "contact";
  }

  try {
    elements.each(function (index) {
      var element = $(this),
        number = element.text();
      
      number = number.replace(/[^\d+]/g, "");
      // var gotText = phone_number_element.replace(/[^0-9.+]/g, "");
      (numberData = {}), (hasId = null);

      numberData.entity_name = entity;

      hasId = location.pathname.match(/^.*\/(contact|company)\/([0-9]+)\/$/i);

      if (hasId && hasId.length > 1) {
        numberData.id = hasId[2];
      } else {
        var search = $(this).parents("tr");
        if (search.length > 0) {
          search = search.find("a.private-link");
          if (search.length > 0) {
            hasId = search
              .attr("href")
              .match(/^.*\/(contact|company)\/([0-9]+)\/$/i);
            if (hasId && hasId.length > 1) {
              numberData.id = hasId[2];
            }
          }
        }
      }

      if (
        number !== undefined &&
        element.find("a.justcallhs").length === 0 &&
        number.length >= 10 &&
        number.length <= 14
      ) {
        // gotText.length >= 10 && gotText.length < 14

        var iconURL = chrome.runtime.getURL("icon_16.png");
        var iconURLSMS = chrome.runtime.getURL("chat_icon.png");
        var calllhtml =
          '<a class="justcallhs" href="#"><img alt="Call ' +
          number +
          '" class="justcall_icon_call" src="' +
          iconURL +
          '"></img>' +
          "</a>";

        var smshtml =
          '<a class="justcallhs"  href="#"><img style="margin-right:5px" alt="SMS ' +
          number +
          '" class="justcall_icon_sms" src="' +
          iconURLSMS +
          '"></img>' +
          "</a>" +
          "<span>" +
          number +
          "</span>";
        calllhtml = $(calllhtml);
        smshtml = $(smshtml);
        calllhtml.click(function () {
          helloworldhubspot(number);
        });
        smshtml.click(function () {
          helloworldhubspotsms(number);
        });
        element.html(calllhtml.add(smshtml));
        found = true;
      }
    });
  } catch (e) {
    console.error(e);
  }
  return found;
}

function replaceHubspotTable2() {
  var found = false;
  var elements = $(".column-phone")
      .find(".private-truncated-string__inner")
      .find("span"),
    entity = null;

  // search for contact type
  if (location.pathname.match(/^\/(company|companies)/i)) {
    entity = "company";
  } else if (location.pathname.match(/^\/(contact|contacts)/i)) {
    entity = "contact";
  }

  try {
    elements.each(function (index) {
      var element = $(this),
        number = element.html(),
        numberData = {},
        hasId = null;

      numberData.entity_name = entity;

      hasId = location.pathname.match(/^.*\/(contact|company)\/([0-9]+)\/$/i);

      if (hasId && hasId.length > 1) {
        numberData.id = hasId[2];
      } else {
        var search = $(this).parents("tr");
        if (search.length > 0) {
          search = search.find("a.private-link");
          if (search.length > 0) {
            hasId = search
              .attr("href")
              .match(/^.*\/(contact|company)\/([0-9]+)\/$/i);
            if (hasId && hasId.length > 1) {
              numberData.id = hasId[2];
            }
          }
        }
      }

      if (
        number !== undefined &&
        element.parent().find("a.justcallhs").length === 0 &&
        /(\+)?[0-9]/gi.test(number)
      ) {
        var iconURL = chrome.runtime.getURL("icon_16.png");
        var iconURLSMS = chrome.runtime.getURL("chat_icon.png");
        var calllhtml =
          '<a class="justcallhs" href="#"><img alt="Call ' +
          number +
          '" class="justcall_icon_call" src="' +
          iconURL +
          '"></img>' +
          "</a>";

        var smshtml =
          '<a class="justcallhs"  href="#"><img style="margin-right:5px" alt="SMS ' +
          number +
          '" class="justcall_icon_sms" src="' +
          iconURLSMS +
          '"></img>' +
          "</a>" +
          "<span>" +
          number +
          "</span>";
        calllhtml = $(calllhtml);
        smshtml = $(smshtml);
        calllhtml.click(function () {
          helloworldhubspot(number);
        });
        smshtml.click(function () {
          helloworldhubspotsms(number);
        });
        // element.parent().append(calllhtml.add(smshtml));
        element.html(calllhtml.add(smshtml));
        // element.addClass("YAHAN");
        found = true;
      }
    });
  } catch (e) {
    console.error(e);
  }
  return found;
}

function helloworldhubspot(number) {
  chrome.runtime.sendMessage({
    message: "open_new_tab",
    url: "https://justcall.io/app/macapp/dialpad_app.php",
    numbers: number,
  });
}

function helloworldhubspotsms(number) {
  chrome.runtime.sendMessage({
    message: "open_new_tab",
    url: "https://justcall.io/app/macapp/dialpad_app.php",
    numbers: number,
    sms: "1",
  });
}

function replaceHubspotInputs(hubspotinputs) {
  hubspotinputs = $('input[data-field="phone"]');

  hubspotinputs.each(function () {
    if ($(this).hasClass("hello")) {
    } else {
      $(this).addClass("hello");
      // $(this).parent().css("display","inline-block");

      var pathname = window.location.pathname.split("/");

      var hubspotcontactid = "";
      for (var k = 0; k < pathname.length; k++) {
        if (pathname[k] == "contact") {
          hubspotcontactid = pathname[k + 1];
          break;
        }
      }

      var gotText = $(this).val();
      // console.log(gotText);
      // $(this).addClass("hello");
      // console.log(gotText);
      var gotNumber = gotText;
      // gotNumber = gotNumber.replace("+","");
      var size = $(this).css("font-size");
      var html =
        '<a style="cursor:pointer"   onclick="event.preventDefault()"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
        size +
        " !important;width:" +
        size +
        ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>';
      html = $(html);
      $(this).val(gotText);
      $(this).after(html);
      // console.log("hubspot contact id is "+hubspotcontactid);

      if (hubspotcontactid != "") {
        var urltosend =
          "https://justcall.io/app/macapp/dialpad_app.php?numbers=" +
          gotNumber +
          "&medium=hubspot&type=contact&entityid=" +
          hubspotcontactid;
        html.click(function () {
          openNumberZoho(urltosend, gotNumber, "call");
        });
      } else {
        html.click(function () {
          openNumber(gotNumber);
        });
      }
      // $(this).remove();
      var smshtml = $(
        '<a onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
          size +
          " !important;width:" +
          size +
          ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
      );
      $(html).after(smshtml);

      if (hubspotcontactid != "") {
        var smsurltosend =
          "https://justcall.io/app/macapp/dialpad_app.php?numbers=" +
          gotNumber +
          "&sms=1&medium=hubspot&type=contact&entityid=" +
          hubspotcontactid;
        smshtml.click(function () {
          openNumberZoho(smsurltosend, gotNumber, "sms");
        });
      } else {
        smshtml.click(function () {
          openSMS(gotNumber);
        });
      }
      countnumbersfound = countnumbersfound + 1;
      updateCount(countnumbersfound);
    }
  });

  var hubspotinputs2 = $('input[data-field="mobilephone"]');

  hubspotinputs2.each(function () {
    if ($(this).hasClass("hello")) {
    } else {
      $(this).addClass("hello");
      // $(this).parent().css("display","inline-block");
      var gotText = $(this).val();
      // console.log(gotText);
      // $(this).addClass("hello");
      // console.log(gotText);

      var pathname = window.location.pathname.split("/");

      var hubspotcontactid = "";
      for (var k = 0; k < pathname.length; k++) {
        if (pathname[k] == "contact") {
          hubspotcontactid = pathname[k + 1];
          break;
        }
      }

      var gotNumber = gotText;
      // gotNumber = gotNumber.replace("+","");
      var size = $(this).css("font-size");
      var this_size = size;
      var html =
        '<a style="cursor:pointer"   onclick="event.preventDefault()"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
        this_size +
        " !important;width:" +
        this_size +
        ' !important;margin-left:5px;max-height:18px;max-width:18px;display:inline"/></a>';
      html = $(html);
      $(this).val(gotText);
      $(this).after(html);

      if (hubspotcontactid != "") {
        var urltosend =
          "https://justcall.io/app/macapp/dialpad_app.php?numbers=" +
          gotNumber +
          "&medium=hubspot&type=contact&entityid=" +
          hubspotcontactid;
        html.click(function () {
          openNumberZoho(urltosend, gotNumber, "call");
        });
      } else {
        html.click(function () {
          openNumber(gotNumber);
        });
      }
      // $(this).remove();
      this_size = size;
      var smshtml = $(
        '<a onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
          this_size +
          " !important;width:" +
          this_size +
          ' !important;margin-left:5px;max-height:14px;max-width:14px;display:inline"/></a>'
      );
      $(html).after(smshtml);

      if (hubspotcontactid != "") {
        var smsurltosend =
          "https://justcall.io/app/macapp/dialpad_app.php?numbers=" +
          gotNumber +
          "&sms=1&medium=hubspot&type=contact&entityid=" +
          hubspotcontactid;
        smshtml.click(function () {
          openNumberZoho(smsurltosend, gotNumber, "sms");
        });
      } else {
        smshtml.click(function () {
          openSMS(gotNumber);
        });
      }
      countnumbersfound = countnumbersfound + 1;
      updateCount(countnumbersfound);
    }
  });
  hubspotinputs = $('textarea[data-field="phone"]');

  hubspotinputs.each(function () {
    if ($(this).hasClass("hello")) {
    } else {
      $(this).addClass("hello");
      // $(this).parent().css("display","inline-block");

      var pathname = window.location.pathname.split("/");

      var hubspotcontactid = "";
      for (var k = 0; k < pathname.length; k++) {
        if (pathname[k] == "contact") {
          hubspotcontactid = pathname[k + 1];
          break;
        }
      }

      var gotText = $(this).val();
      // console.log(gotText);
      // $(this).addClass("hello");
      // console.log(gotText);
      var gotNumber = gotText;
      // gotNumber = gotNumber.replace("+","");
      var size = $(this).css("font-size");
      var html =
        '<a style="cursor:pointer"   onclick="event.preventDefault()"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
        size +
        " !important;width:" +
        size +
        ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>';
      html = $(html);
      $(this).val(gotText);
      $(this).after(html);
      // console.log("hubspot contact id is "+hubspotcontactid);

      if (hubspotcontactid != "") {
        var urltosend =
          "https://justcall.io/app/macapp/dialpad_app.php?numbers=" +
          gotNumber +
          "&medium=hubspot&type=contact&entityid=" +
          hubspotcontactid;
        html.click(function () {
          openNumberZoho(urltosend, gotNumber, "call");
        });
      } else {
        html.click(function () {
          openNumber(gotNumber);
        });
      }
      // $(this).remove();
      var smshtml = $(
        '<a onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
          size +
          " !important;width:" +
          size +
          ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
      );
      $(html).after(smshtml);

      if (hubspotcontactid != "") {
        var smsurltosend =
          "https://justcall.io/app/macapp/dialpad_app.php?numbers=" +
          gotNumber +
          "&sms=1&medium=hubspot&type=contact&entityid=" +
          hubspotcontactid;
        smshtml.click(function () {
          openNumberZoho(smsurltosend, gotNumber, "sms");
        });
      } else {
        smshtml.click(function () {
          openSMS(gotNumber);
        });
      }
      countnumbersfound = countnumbersfound + 1;
      updateCount(countnumbersfound);
    }
  });

  var hubspotinputs2 = $('textarea[data-field="mobilephone"]');

  hubspotinputs2.each(function () {
    if ($(this).hasClass("hello")) {
    } else {
      $(this).addClass("hello");
      // $(this).parent().css("display","inline-block");
      var gotText = $(this).val();
      // console.log(gotText);
      // $(this).addClass("hello");
      // console.log(gotText);

      var pathname = window.location.pathname.split("/");

      var hubspotcontactid = "";
      for (var k = 0; k < pathname.length; k++) {
        if (pathname[k] == "contact") {
          hubspotcontactid = pathname[k + 1];
          break;
        }
      }

      var gotNumber = gotText;
      // gotNumber = gotNumber.replace("+","");
      var size = $(this).css("font-size");
      var this_size = size;
      var html =
        '<a style="cursor:pointer"   onclick="event.preventDefault()"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
        this_size +
        " !important;width:" +
        this_size +
        ' !important;margin-left:5px;max-height:18px;max-width:18px;display:inline"/></a>';
      html = $(html);
      $(this).val(gotText);
      $(this).after(html);

      if (hubspotcontactid != "") {
        var urltosend =
          "https://justcall.io/app/macapp/dialpad_app.php?numbers=" +
          gotNumber +
          "&medium=hubspot&type=contact&entityid=" +
          hubspotcontactid;
        html.click(function () {
          openNumberZoho(urltosend, gotNumber, "call");
        });
      } else {
        html.click(function () {
          openNumber(gotNumber);
        });
      }
      // $(this).remove();
      this_size = size;
      var smshtml = $(
        '<a onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
          this_size +
          " !important;width:" +
          this_size +
          ' !important;margin-left:5px;max-height:14px;max-width:14px;display:inline"/></a>'
      );
      $(html).after(smshtml);

      if (hubspotcontactid != "") {
        var smsurltosend =
          "https://justcall.io/app/macapp/dialpad_app.php?numbers=" +
          gotNumber +
          "&sms=1&medium=hubspot&type=contact&entityid=" +
          hubspotcontactid;
        smshtml.click(function () {
          openNumberZoho(smsurltosend, gotNumber, "sms");
        });
      } else {
        smshtml.click(function () {
          openSMS(gotNumber);
        });
      }
      countnumbersfound = countnumbersfound + 1;
      updateCount(countnumbersfound);
    }
  });
}

function replaceHubspotWorkflows(hubspotinputs) {
  hubspotinputs = $('a:contains("JustCall Workflow ID")');

  hubspotinputs.each(function () {
    if ($(this).hasClass("hello_workflow")) {
    } else {
      var got_campaign_id = $(this).siblings("span").text();
      got_campaign_id = got_campaign_id.replace(/[^0-9]/gi, "");
      $(this).addClass("hello_workflow");

      if (got_campaign_id != "") {
        var gotNumber =
          "https://justcall.io/app/sms-workflow-hubspotv2?hs_id=" +
          got_campaign_id;

        var size = $(this).css("font-size");
        var html =
          "<a style='cursor:pointer;margin-left:10px' href='" +
          gotNumber +
          "' target='_blank'>(Edit Template)</a>";
        html = $(html);
        $(this).parent().after(html);

        countnumbersfound = countnumbersfound + 1;
        updateCount(countnumbersfound);
      }
    }
  });
}

function replaceInfustionsoftInputs1(infusionsoftinputs1) {
  // return;
  infusionsoftinputs1 = $('input[id="Contact0Phone1"]');

  infusionsoftinputs1.each(function () {
    if ($(this).hasClass("hello")) {
    } else {
      $(this).addClass("hello");
      // $(this).parent().css("display","inline-block");
      var gotText = $(this).val();
      // $(this).addClass("hello");
      // console.log(gotText);
      gotText = gotText.replace(/\s/g, "");

      var gotNumber = gotText;
      // gotNumber = gotNumber.replace("+","");
      if (gotNumber != "") {
        let myParam = "";
        if (window.location.href.indexOf("infusionsoft.com/Contact") > -1) {
          const urlParams = new URLSearchParams(window.location.search);
          myParam = urlParams.get("ID");
          // console.log(myParam);
        }

        var size = $(this).css("font-size");
        var html =
          '<a style="cursor:pointer"   onclick="event.preventDefault()"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
          size +
          " !important;width:" +
          size +
          ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>';
        html = $(html);
        $(this).val(gotText);
        $(this).after(html);
        // console.log("my param "+myParam);
        if (myParam != "") {
          // console.log("came here");

          var urltosend =
            "https://justcall.io/dialer.php?numbers=" +
            gotNumber +
            "&medium=infusionsoft&type=contact&entityid=" +
            myParam;
          // console.log(urltosend);
          html.click(function () {
            openNumberZoho(urltosend, gotNumber, "call");
          });
        } else {
          html.click(function () {
            openNumber(gotNumber);
          });
        }
        // html.click(function(){ openNumber(gotNumber); });
        // $(this).remove();
        var smshtml = $(
          '<a onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(html).after(smshtml);

        if (myParam != "") {
          var smsurltosend =
            "https://justcall.io/dialer.php?numbers=" +
            gotNumber +
            "&sms=1&medium=infusionsoft&type=contact&entityid=" +
            myParam;
          smshtml.click(function () {
            openNumberZoho(smsurltosend, gotNumber, "sms");
          });
        } else {
          smshtml.click(function () {
            openNumber(gotNumber);
          });
        }
        // smshtml.click(function(){ openSMS(gotNumber); });
        countnumbersfound = countnumbersfound + 1;
        updateCount(countnumbersfound);
      } else {
        $(this).removeClass("hello");
      }
    }
  });
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function replaceZohoSkypes() {
  // return;
  // console.log("replace zoho skype is called");
  alldoublehrefs = $('a[href^="skype:"]');
  alldoublehrefs.each(function () {
    var href = $(this).attr("href");
    // console.log(href);
    $(this).css("visibility", "visible");
    var replacedtel = href.replace("skype:", "");
    replacedtel = replacedtel.replace("?call", "");

    var pathname = window.location.pathname.split("/");

    // console.log(pathname);

    var moduler = pathname[4];
    var zohoid = pathname[5];

    var typeentity = "";
    if (moduler == "Contacts") {
      typeentity = "contact";
    } else if (moduler == "Leads") {
      typeentity = "lead";
    } else if (moduler == "Potentials") {
      typeentity = "deal";
    }

    if (isNumber(zohoid)) {
    } else {
      zohoid = null;
    }
    if (zohoid == null) {
      //try to get zoho id from contact row
      // console.log()
      zohoid = $(this).closest("tr").attr("id");
    } else {
      //do nothing we have zoho id
    }
    // console.log("coming here");

    // replacedtel = replacedtel.replace("+","");
    $(this).attr(
      "href",
      "https://justcall.io/app/macapp/dialpad_app.php?numbers=" +
        replacedtel +
        "&medium=zoho&type=" +
        typeentity +
        "&zohoid=" +
        zohoid
    );
    $(this).attr("onclick", "event.preventDefault();");
    $(this).attr("target", "_blank");
    // $(this).css("padding","2px");
    // $(this).css("border-radius","15px");
    // $(this).removeClass();
    var size = $(this).css("font-size");
    var urltosend =
      "https://justcall.io/app/macapp/dialpad_app.php?numbers=" +
      replacedtel +
      "&medium=zoho&type=" +
      typeentity +
      "&zohoid=" +
      zohoid;
    var html = $(this).text();
    replacedtel = decodeURIComponent(replacedtel);
    $(this).removeClass();
    html =
      '<img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
      size +
      " !important;width:" +
      size +
      ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/>';
    $(this).html(html);
    $(this).click(function () {
      openNumberZoho(urltosend, replacedtel, "call");
    });
    var smsurltosend =
      "https://justcall.io/app/macapp/dialpad_app.php?numbers=" +
      replacedtel +
      "&sms=1&medium=zoho&type=" +
      typeentity +
      "&zohoid=" +
      zohoid;
    var smshtml = $(
      '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
        replacedtel +
        "&sms=1&medium=zoho&type=" +
        typeentity +
        "&zohoid=" +
        zohoid +
        '" target="_blank" onclick="event.preventDefault();" class="smslink"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
        size +
        " !important;width:" +
        size +
        ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
    );
    $(this).nextAll(".smslink").remove();
    $(this).after(smshtml);
    smshtml.click(function () {
      openNumberZoho(smsurltosend, replacedtel, "sms");
    });
    countnumbersfound = countnumbersfound + 1;
    updateCount(countnumbersfound);
  });
}

function replaceZohoCRMPSkypes() {
  // return;

  // console.log("replace zoho skype is called");

  var $iframe = $("#crmLoadFrame").contents();
  alldoublehrefs = $iframe.find('a[href^="skype:"]');
  alldoublehrefs.each(function () {
    var href = $(this).attr("href");
    // console.log(href);
    $(this).css("visibility", "visible");
    var replacedtel = href.replace("skype:", "");
    replacedtel = replacedtel.replace("?call", "");

    var pathname = window.location.href.split("/");

    // console.log(pathname);

    var moduler = pathname[7];
    var zohoid = pathname[8];

    var typeentity = "";
    if (moduler == "Contacts") {
      typeentity = "contact";
    } else if (moduler == "Leads") {
      typeentity = "lead";
    } else if (moduler == "Potentials") {
      typeentity = "deal";
    }

    if (isNumber(zohoid)) {
    } else {
      zohoid = null;
    }
    if (zohoid == null) {
      //try to get zoho id from contact row
      // console.log()
      zohoid = $(this).closest("tr").attr("id");
    } else {
      //do nothing we have zoho id
    }
    // console.log("coming here");

    // replacedtel = replacedtel.replace("+","");
    $(this).attr(
      "href",
      "https://justcall.io/app/macapp/dialpad_app.php?numbers=" +
        replacedtel +
        "&medium=zoho&type=" +
        typeentity +
        "&zohoid=" +
        zohoid
    );
    $(this).attr("onclick", "event.preventDefault();");
    $(this).attr("target", "_blank");
    // $(this).css("padding","2px");
    // $(this).css("border-radius","15px");
    // $(this).removeClass();
    var size = $(this).css("font-size");
    var urltosend =
      "https://justcall.io/app/macapp/dialpad_app.php?numbers=" +
      replacedtel +
      "&medium=zoho&type=" +
      typeentity +
      "&zohoid=" +
      zohoid;
    var html = $(this).text();
    replacedtel = decodeURIComponent(replacedtel);
    $(this).removeClass();
    html =
      '<img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
      size +
      " !important;width:" +
      size +
      ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/>';
    $(this).html(html);
    $(this).click(function () {
      openNumberZohoCRMP(urltosend, replacedtel, "call");
    });
    var smsurltosend =
      "https://justcall.io/app/macapp/dialpad_app.php?numbers=" +
      replacedtel +
      "&sms=1&medium=zoho&type=" +
      typeentity +
      "&zohoid=" +
      zohoid;
    var smshtml = $(
      '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
        replacedtel +
        "&sms=1&medium=zoho&type=" +
        typeentity +
        "&zohoid=" +
        zohoid +
        '" target="_blank" onclick="event.preventDefault();" class="smslink"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
        size +
        " !important;width:" +
        size +
        ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
    );
    $(this).nextAll(".smslink").remove();
    $(this).after(smshtml);
    smshtml.click(function () {
      openNumberZohoCRMP(smsurltosend, replacedtel, "sms");
    });
    countnumbersfound = countnumbersfound + 1;
    updateCount(countnumbersfound);
  });
}

function replacePWCRM() {
  //propertywarecrm
  // console.log("replacePWCRM");
  var regex =
    /(\+?(?:(?:9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)|\((?:9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\))[0-9. -]{4,14})(?:\b|x\d+)/;
  var test = window.location.hostname;
  if (test.indexOf("propertyware") != -1) {
    // console.log("propertyware == 1");

    $("#tenantContactsTable td").each(function () {
      if (regex.test($(this).text()) == true) {
        // console.log("regex.test == 1");

        if ($(this).hasClass("div_is_here")) {
        } else {
          $(this).addClass("div_is_here");
          var gotText = $(this).text();
          gotText = gotText.replace(/\s/g, "");
          var gotNumber = gotText;
          var html =
            '<a style="cursor:pointer" href = "https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            gotNumber +
            '" target="_blank" onclick="event.preventDefault();">' +
            gotText +
            "</a>";
          var size = $(this).css("font-size");
          html =
            html +
            '<img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/>';
          var sethtml = $(html);
          sethtml.click(function () {
            openNumber(gotNumber);
          });

          $(this).html(sethtml);
          // $(this).click(function(){ openNumber(gotNumber); });
          var smshtml = $(
            '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
              gotNumber +
              '&sms=1" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
              size +
              " !important;width:" +
              size +
              ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
          );
          $(this).append(smshtml);
          smshtml.click(function () {
            openSMS(gotNumber);
          });
          countnumbersfound = countnumbersfound + 1;
          updateCount(countnumbersfound);
        }
      }
    });
  }
}

function hubspotcompanyInContact() {
  // var company_phone = $("[data-selenium-test=sidebar-company-phone-number]").find('span').text();

  var test = window.location.href;
  var result = test.indexOf("hubspot");
  var regex =
    /(\+?(?:(?:9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)|\((?:9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\))[0-9. -]{4,14})(?:\b|x\d+)/;

  if (result != -1) {
    var allcontacts = $(
      "[data-selenium-test=sidebar-company-phone-number]"
    ).find("span");

    // allcontacts.addClass("hello");

    allcontacts.each(function () {
      if (regex.test($(this).text()) == true) {
        if ($(this).hasClass("hello")) {
        } else {
          var phone_number_element_A = $(this);
          $(this).addClass("hello");
          var phone_number_element = $(this).text();

          gotText = phone_number_element.replace(/\s/g, "");
          // console.log("deals number ",gotText);
          if (gotText.length >= 10 && gotText.length < 13) {
            var size = $(this).css("font-size");
            var html =
              '<a style="cursor:pointer" href = "https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
              gotText +
              '" target="_blank" onclick="event.stopPropagation()"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
              size +
              " !important;width:" +
              size +
              ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>';
            var sethtml = $(html);
            sethtml.click(function () {
              openNumber(gotText);
            });
            $(this).append(sethtml);
            var smshtml = $(
              '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
                gotText +
                '&sms=1" target="_blank" onclick="event.stopPropagation()"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
                size +
                " !important;width:" +
                size +
                ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
            );
            smshtml.click(function () {
              openSMS(gotText);
            });
            $(this).append(smshtml);
            countnumbersfound = countnumbersfound + 1;
            updateCount(countnumbersfound);
          }
        }
      }
    });
  }
}

function replaceFDCRM() {
  //propertywarecrm
  // console.log("replacePWCRM");
  var regex =
    /(\+?(?:(?:9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)|\((?:9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\))[0-9. -]{4,14})(?:\b|x\d+)/;
  var test = window.location.hostname;
  if (test.indexOf("freshdesk.com") != -1) {
    // console.log("freshdesk.com == 1");
    if ($(".contacts-table:visible")) {
      $(".contacts-table")
        .find("a[data-test-id='trigger-telephone']")
        .each(function () {
          // console.log($(this));
          if (regex.test($(this).text()) == true) {
            // console.log("regex.test == 1");
            $this = $(this).parent();

            if ($this.hasClass("div_is_here")) {
            } else {
              $this.addClass("div_is_here");
              var gotText = $(this).text();
              gotText = gotText.replace(/\s/g, "");
              var gotNumber = gotText;
              var html =
                '<a style="cursor:pointer" href = "https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
                gotNumber +
                '" target="_blank" onclick="event.preventDefault();">' +
                gotText +
                "</a>";
              var size = $(this).css("font-size");
              html =
                html +
                '<img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
                size +
                " !important;width:" +
                size +
                ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/>';
              var sethtml = $(html);
              sethtml.click(function () {
                openNumber(gotNumber);
              });

              $this.html(sethtml);
              // $(this).click(function(){ openNumber(gotNumber); });
              var smshtml = $(
                '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
                  gotNumber +
                  '&sms=1" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
                  size +
                  " !important;width:" +
                  size +
                  ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
              );
              $this.append(smshtml);
              smshtml.click(function () {
                openSMS(gotNumber);
              });
              countnumbersfound = countnumbersfound + 1;
              updateCount(countnumbersfound);
            }
          }
        });
    }

    if ($("#contact-info:visible")) {
      $("#contact-info")
        .find("div[data-test-id='contact-field-list']")
        .each(function () {
          $("#contact-info")
            .find("div[data-test-id='contact-field-list']")
            .css("background", "red");
          $siblingDiv = $(this).prev();

          if (regex.test($siblingDiv.text()) == true) {
            // console.log("regex.test == 1");
            if ($siblingDiv.hasClass("div_is_here")) {
            } else {
              $siblingDiv.addClass("div_is_here");
              $(this).remove();
              var gotText = $siblingDiv.text();
              gotText = gotText.replace(/\s/g, "");
              var gotNumber = gotText;
              var html =
                '<a style="cursor:pointer" href = "https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
                gotNumber +
                '" target="_blank" onclick="event.preventDefault();">' +
                gotText +
                "</a>";
              var size = $siblingDiv.css("font-size");
              html =
                html +
                '<img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
                size +
                " !important;width:" +
                size +
                ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/>';
              var sethtml = $(html);
              sethtml.click(function () {
                openNumber(gotNumber);
              });

              $siblingDiv.html(sethtml);
              // $(this).click(function(){ openNumber(gotNumber); });
              var smshtml = $(
                '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
                  gotNumber +
                  '&sms=1" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
                  size +
                  " !important;width:" +
                  size +
                  ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
              );
              $siblingDiv.append(smshtml);
              smshtml.click(function () {
                openSMS(gotNumber);
              });
              countnumbersfound = countnumbersfound + 1;
              updateCount(countnumbersfound);
            }
          }
        });
    }
  }
}

function replaceZohoAnother() {}

function addAutoDialerButton() {
  var element = $("#moreActionsDiv");
  // console.log("element length is ",element.length);

  if (element.length > 0) {
    if (element.hasClass("hello")) {
    } else {
      element.addClass("hello");
      element.prepend(
        '<span type="button" id="AutoDialer" data-zcqa="massDial" class="newwhitebtn fL" value="Auto Dial"> <img src="https://autodialer.justcall.io/assets/images/autodialer-fav.png" style="height:12px"/> Add to Sales Dialer </span>'
      );
      $("#AutoDialer").click(function () {
        autodialer("normal");
      });
    }
  }

  var $iframe = $("#crmLoadFrame").contents();

  element = $iframe.find("#moreActionsDiv");

  if (element.length > 0) {
    if (element.hasClass("hello")) {
    } else {
      element.addClass("hello");

      var html =
        '<span type="button" id="AutoDialer" data-zcqa="massDial" class="newwhitebtn fL" value="Auto Dial"> <img src="https://autodialer.justcall.io/assets/images/autodialer-fav.png" style="height:12px"/> Add to Sales Dialer </span>';
      html = $(html);

      element.prepend(html);
      html.click(function () {
        autodialer("crmplus");
      });
    }
  }
}

function addADbtnSalesforce() {
  var element = $(".oneActionsRibbon");
  if (element.length > 0) {
    if (element.hasClass("hello")) {
    } else {
      element.addClass("hello");
      element.prepend(
        '<li class="slds-button  slds-button--neutral" id="AutoDialer" ><!--render facet: 1600:0--><a  title="Add To Sales Dialer"  class="forceActionLink" role="button"><div title="Add To Sales Dialer" >Add To Sales Dialer</div></a></li>'
      );
      $("#AutoDialer").click(function () {
        autodialer_salesforce("normal");
      });
    }
  }
}

function autodialer_salesforce(arg) {
  var regex =
    /(\+?(?:(?:9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)|\((?:9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\))[0-9. -]{4,14})(?:\b|x\d+)/;
  var test = window.location.hostname;
  var checkedspans;
  var table = $(".slds-table tr");
  var contacts = {};
  let i = 0;
  table.each(function () {
    if ($(this).hasClass("selected")) {
      let temp_data = {};
      temp_data["id"] = $(this).find("[data-recordid]").attr("data-recordid");
      temp_data["name"] = $(this).find("[data-recordid]").text();

      for (let a = 0; a < $(this).find(".uiOutputPhone").length; a++) {
        let phone = $(this).find(".uiOutputPhone")[a].innerHTML;
        if (phone != "") {
          temp_data["phone"] = phone;
          break;
        }
      }
      contacts[i] = temp_data;
      i++;
    }
  });
  console.log(contacts);

  contacts = JSON.stringify(contacts);
  console.log(contacts);

  $("body").prepend(
    '<form target="_blank" action="https://autodialer.justcall.io/app/add_salesforce_contacts" method="post" style="display: none;" id="autodialer-form"><input type="hidden" id="salesforcedata" name="salesforcedata" ></form>'
  );
  $("#salesforcedata").val(contacts);
  $("#autodialer-form").submit();
}

function checkSalesforceAddon() {
  console.log("SalesForce");
  chrome.runtime.sendMessage({ message: "checkSalesforceAddonAD" });
}

function autodialer(arg) {
  var regex =
    /(\+?(?:(?:9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)|\((?:9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\))[0-9. -]{4,14})(?:\b|x\d+)/;
  var test = window.location.hostname;
  var url = window.location.href.split("?")[0];
  var checkedspans;
  selectedzohojson = [];
  selectedzohonamejson = [];
  selectedzohonumberjson = [];
  selectedzohomodulejson = [];

  var url_array = url.split("/");

  if (url_array.at(-1) == "kanban") {
    var $iframe = $("#crmLoadFrame").contents();
    if (arg == "crmplus") {
      checkedspans = $iframe.find("lyte-exptable-tr");
    } else {
      checkedspans = $(".customCheckBoxChecked");
    }

    checkedspans.each(function () {
      // if ($(this).hasClass("sv-stage-card")) {
      getphonenumber = $(this)
        .closest(".sv-stage-card")
        .find(".phoneRtl")
        .text();
      // console.log("GOT PHONE NUMBER HEERE",getphonenumber);

      getphonenumber = getphonenumber.replace("Call", "");
      getphonenumber = getphonenumber.replace("call", "");
      getphonenumber = getphonenumber.replace("Calls", "");
      getphonenumber = getphonenumber.replace("calls", "");

      if (regex.test(getphonenumber) == true) {
        //push to json, else don't push
        var actualidspan = "";
        var getphonenumber = "";
        var getname = "";
        var getmodule = "";
        var zohoidinspan = $(this).closest(".sv-stage-card").attr("id");
        actualidspan = zohoidinspan.replace("detailView_", "");
        selectedzohojson.push(actualidspan);

        getphonenumber = $(this)
          .closest(".sv-stage-card")
          .find(".phoneRtl")
          .text();

        let flag = 0;

        getphonenumber = $(this)
          .closest(".sv-stage-card")
          .find(".phoneRtl")
          .each(function () {
            if (flag == 0) {
              getphonenumber = $(this).text();
              selectedzohonumberjson.push(getphonenumber);
            }

            if (getphonenumber != "") {
              flag = 1;
            }
          });

        // console.log(selectedzohonumberjson);
        if (arg == "crmplus") {
          var temper = $iframe.find("#listView_" + actualidspan);
          getname = temper.text();
        } else {
          getname = $("#listView_" + actualidspan).text();
        }

        selectedzohonamejson.push(getname);

        if (arg == "crmplus") {
          var temper2 = $iframe.find("#detailView_" + actualidspan);
          getmodule = temper2.attr("href");
        } else {
          getmodule = $(this)
            .closest(".sv-stage-card")
            .find(".phoneRtl")
            .find("zpb-phone")
            .attr("module");
        }

        getmodule = getmodule.replace("/" + actualidspan, "");
        // console.log('module ',getmodule);

        var res = getmodule.split("/");
        var length = res.length;
        getmodule = res[length - 1];

        selectedzohomodulejson.push(getmodule);
      }
    });
  } else {
    var $iframe = $("#crmLoadFrame").contents();
    if (arg == "crmplus") {
      checkedspans = $iframe.find("lyte-exptable-tr");
    } else {
      checkedspans = $("lyte-exptable-tr");
    }

    checkedspans.each(function () {
      if ($(this).hasClass("listViewRowSelected")) {
        getphonenumber = $(this)
          .find(".lv_data_phone")
          .find(".phoneRtl")
          .text();

        getphonenumber = getphonenumber.replace("Call", "");
        getphonenumber = getphonenumber.replace("call", "");
        getphonenumber = getphonenumber.replace("Calls", "");
        getphonenumber = getphonenumber.replace("calls", "");

        if (regex.test(getphonenumber) == true) {
          //push to json, else don't push
          var actualidspan = "";
          var getphonenumber = "";
          var getname = "";
          var getmodule = "";
          var zohoidinspan = $(this).attr("id");
          actualidspan = zohoidinspan.replace("selectEntity_", "");
          selectedzohojson.push(actualidspan);

          getphonenumber = $(this)
            .find(".lv_data_phone")
            .find(".phoneRtl")
            .text();

          let flag = 0;

          getphonenumber = $(this)
            .find(".lv_data_phone")
            .find(".phoneRtl")
            .each(function () {
              if (flag == 0) {
                getphonenumber = $(this).text();
                selectedzohonumberjson.push(getphonenumber);
              }

              if (getphonenumber != "") {
                flag = 1;
              }
            });

          if (arg == "crmplus") {
            var temper = $iframe.find("#listView_" + actualidspan);
            getname = temper.text();
          } else {
            getname = $("#listView_" + actualidspan).text();
          }

          selectedzohonamejson.push(getname);

          if (arg == "crmplus") {
            var temper2 = $iframe.find("#listView_" + actualidspan);
            getmodule = temper2.attr("href");
          } else {
            getmodule = $("#listView_" + actualidspan).attr("href");
          }

          getmodule = getmodule.replace("/" + actualidspan, "");

          var res = getmodule.split("/");
          var length = res.length;
          getmodule = res[length - 1];

          selectedzohomodulejson.push(getmodule);
        }
      } else {
      }
    });
  }

  var string1 = JSON.stringify(selectedzohojson);
  var string2 = JSON.stringify(selectedzohonumberjson);
  var string3 = JSON.stringify(selectedzohonamejson);
  var string4 = JSON.stringify(selectedzohomodulejson);

  $("body").prepend(
    '<form target="_blank" action="https://autodialer.justcall.io/app/addcontacts" method="post" style="display: none;" id="autodialer-form"><input type="hidden" id="zohoid" name="zohoid"><input type="hidden" id="zohoname" name="zohoname"><input type="hidden" id="zohonumber" name="zohonumber"><input type="hidden" id="zohomodule" name="zohomodule"></form>'
  );
  $("#zohoid").val(string1);
  $("#zohoname").val(string3);
  $("#zohonumber").val(string2);
  $("#zohomodule").val(string4);
  $("#autodialer-form").submit();

  var urltoopen =
    "https://autodialer.justcall.io/app/addcontacts.php?zohoid=" +
    string1 +
    "&zohonumber=" +
    string2 +
    "&zohoname=" +
    string3 +
    "&zohomodule=" +
    string4;

  // openNumberZoho(urltoopen);
}

// $(".zoho-justcall-icon").click(function(e){
//   console.log("zoho-justcall-icon is clicked");
//   e.stopPropagation();
// });

// $('.zoho-justcall-icon').on('click', function(event) {
//   console.log("zoho-justcall-icon is clicked");
//   event.stopPropagation();
// });

function replaceZohoTable() {
  // return;
  // console.log("replace zoho skype is called");

  if (
    hostnameis.indexOf("zoho.com") >= 0 ||
    hostnameis.indexOf("zoho.in") >= 0 ||
    hostnameis.indexOf("zoho.eu") >= 0 ||
    hostnameis.indexOf("zoho.com.au") >= 0
  ) {
    // console.log("zoho if case");
    // return;

    var alldoublehrefs = $("zpb-phone, zt-phonebridge");
    alldoublehrefs.each(function () {
      var href = $(this).attr("number");
      // console.log(href);

      if ($(this).hasClass("hello")) {
      } else {
        $(this).addClass("hello");

        var pathname = window.location.pathname.split("/");

        // console.log(pathname);

        var moduler = pathname[4];
        var zohoid = pathname[5];

        var typeentity = "";
        if (moduler == "Contacts") {
          typeentity = "contact";
        } else if (moduler == "Leads") {
          typeentity = "lead";
        } else if (moduler == "Potentials") {
          typeentity = "deal";
        }

        if (isNumber(zohoid)) {
        } else {
          zohoid = null;
        }
        if (zohoid == null) {
          //try to get zoho id from contact row
          // console.log()
          zohoid = $(this).closest("tr").attr("id");
        } else {
          //do nothing we have zoho id
        }

        if (zohoid === undefined) {
          zohoid = $(this).attr("recordid");
        }

        // console.log("zohoid "+zohoid);

        $(this).addClass("hello");

        if (moduler == "Accounts") {
        } else {
          $(this).parent().css("display", "inline-block");
        }
        var gotText = $(this).attr("number");
        // console.log(gotText);
        // $(this).addClass("hello");
        // console.log(gotText);
        var gotNumber = gotText;
        // gotNumber = gotNumber.replace("+","");

        if (gotNumber == "") {
        } else {
          var size = $(this).css("font-size");

          var urltosend =
            "https://justcall.io/app/macapp/dialpad_app.php?numbers=" +
            gotNumber +
            "&medium=zoho&type=" +
            typeentity +
            "&zohoid=" +
            zohoid;
          var html =
            '<a style="cursor:pointer" onclick="event.stopPropagation()"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>';
          html = $(html);
          $(this).val(gotText);
          $(this).after(html);
          // $(this).after(html);
          html.click(function () {
            openNumberZoho(urltosend, gotNumber, "call");
          });
          // $(this).remove();
          var smshtml = $(
            '<a style="cursor:pointer" onclick="event.stopPropagation();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
              size +
              " !important;width:" +
              size +
              ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
          );
          $(html).after(smshtml);
          var smsurltosend =
            "https://justcall.io/app/macapp/dialpad_app.php?numbers=" +
            gotNumber +
            "&sms=1&medium=zoho&type=" +
            typeentity +
            "&zohoid=" +
            zohoid;
          // $(this).parent().closest('div').after(html);
          smshtml.click(function () {
            openNumberZoho(smsurltosend, gotNumber, "sms");
          });
          countnumbersfound = countnumbersfound + 1;
          updateCount(countnumbersfound);
        }
      }
    });
  } else {
    // console.log("else case");
    // return;

    alldoublehrefs = $(".phoneRtl");
    alldoublehrefs.each(function () {
      //done changes

      if ($(this).text() == "") {
      } else {
        // console.log("checking");
        var href = $(this).text();
        // console.log(href);

        if ($(this).hasClass("hello")) {
        } else {
          $(this).addClass("hello");
          // console.log("class hello");

          var pathname = window.location.pathname.split("/");

          // console.log(pathname);
          // console.log("hello");

          var moduler = pathname[4];
          var zohoid = pathname[5];

          var typeentity = "";
          if (moduler == "Contacts") {
            typeentity = "contact";
          } else if (moduler == "Leads") {
            typeentity = "lead";
          } else if (moduler == "Potentials") {
            typeentity = "deal";
          }

          if (isNumber(zohoid)) {
          } else {
            zohoid = null;
          }
          if (zohoid == null) {
            //try to get zoho id from contact row
            // console.log()
            zohoid = $(this).closest("tr").attr("id");
          } else {
            //do nothing we have zoho id
          }

          if (zohoid === undefined) {
            zohoid = $(this).attr("recordid");
          }

          $(this).addClass("hello");

          if (moduler == "Accounts") {
          } else {
            $(this).parent().css("display", "inline-block");
          }
          var gotText = $(this).text();
          // console.log(gotText);
          // $(this).addClass("hello");
          // console.log(gotText);
          var gotNumber = gotText;
          // gotNumber = gotNumber.replace("+","");
          var size = $(this).css("font-size");

          var urltosend =
            "https://justcall.io/app/macapp/dialpad_app.php?numbers=" +
            gotNumber +
            "&medium=zoho&type=" +
            typeentity +
            "&zohoid=" +
            zohoid;
          var html =
            '<a style="cursor:pointer"  class = "zoho-justcall-icon" onclick="event.preventDefault()"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>';
          html = $(html);
          $(this).val(gotText);
          $(this).before(html);
          // $(this).after(html);
          html.click(function () {
            openNumberZoho(urltosend, gotNumber, "call");
          });
          // $(this).remove();
          var smshtml = $(
            '<a style="cursor:pointer"  class = "zoho-justcall-icon" onclick="event.preventDefault()"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
              size +
              " !important;width:" +
              size +
              ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
          );
          $(html).before(smshtml);
          var smsurltosend =
            "https://justcall.io/app/macapp/dialpad_app.php?numbers=" +
            gotNumber +
            "&sms=1&medium=zoho&type=" +
            typeentity +
            "&zohoid=" +
            zohoid;
          // $(this).parent().closest('div').after(html);
          smshtml.click(function () {
            openNumberZoho(smsurltosend, gotNumber, "sms");
          });
          countnumbersfound = countnumbersfound + 1;
          updateCount(countnumbersfound);
          // console.log("checking");
        }
      }
    });
  }
}

function replaceZohoCRMPTable() {
  // return;
  // console.log("replace zoho skype is called");
  var $iframe = $("#crmLoadFrame").contents();

  alldoublehrefs = $iframe.find("zpb-phone");
  alldoublehrefs.each(function () {
    var href = $(this).attr("number");
    // console.log(href);

    if ($(this).hasClass("hello")) {
    } else {
      $(this).addClass("hello");

      var pathname = window.location.href.split("/");

      // console.log(pathname);

      var moduler = pathname[7];
      var zohoid = pathname[8];

      var typeentity = "";
      if (moduler == "Contacts") {
        typeentity = "contact";
      } else if (moduler == "Leads") {
        typeentity = "lead";
      } else if (moduler == "Potentials") {
        typeentity = "deal";
      }

      if (isNumber(zohoid)) {
      } else {
        zohoid = null;
      }
      if (zohoid == null) {
        //try to get zoho id from contact row
        // console.log()
        zohoid = $(this).closest("tr").attr("id");
      } else {
        //do nothing we have zoho id
      }

      if (zohoid === undefined) {
        zohoid = $(this).attr("recordid");
      }

      $(this).addClass("hello");

      if (moduler == "Accounts") {
      } else {
        $(this).parent().css("display", "inline-block");
      }
      var gotText = $(this).attr("number");
      // console.log(gotText);
      // $(this).addClass("hello");
      // console.log(gotText);
      var gotNumber = gotText;
      // gotNumber = gotNumber.replace("+","");
      var size = $(this).css("font-size");

      var urltosend =
        "https://justcall.io/app/macapp/dialpad_app.php?numbers=" +
        gotNumber +
        "&medium=zoho&type=" +
        typeentity +
        "&zohoid=" +
        zohoid;
      var html =
        '<a style="cursor:pointer"  onclick="event.stopPropagation()"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
        size +
        " !important;width:" +
        size +
        ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>';
      html = $(html);
      $(this).val(gotText);
      $(this).after(html);
      // $(this).after(html);
      html.click(function () {
        openNumberZohoCRMP(urltosend, gotNumber, "call");
      });
      // $(this).remove();
      var smshtml = $(
        '<a style="cursor:pointer" onclick="event.stopPropagation()" ><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
          size +
          " !important;width:" +
          size +
          ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
      );
      $(html).after(smshtml);
      var smsurltosend =
        "https://justcall.io/app/macapp/dialpad_app.php?numbers=" +
        gotNumber +
        "&sms=1&medium=zoho&type=" +
        typeentity +
        "&zohoid=" +
        zohoid;
      // $(this).parent().closest('div').after(html);
      smshtml.click(function () {
        openNumberZohoCRMP(smsurltosend, gotNumber, "sms");
      });
      countnumbersfound = countnumbersfound + 1;
      updateCount(countnumbersfound);
    }
  });
}

function replaceZohoCRMPAnother() {}

function replaceZohoAnother2() {}

function replaceZohoCRMPAnother2() {}

function replaceInfustionsoftInputs2(infusionsoftinputs2) {
  infusionsoftinputs2 = $('input[id="Contact0Phone2"]');

  infusionsoftinputs2.each(function () {
    if ($(this).hasClass("hello")) {
    } else {
      $(this).addClass("hello");
      // $(this).parent().css("display","inline-block");
      var gotText = $(this).val();
      gotText = gotText.replace(/\s/g, "");
      // console.log(gotText);
      // $(this).addClass("hello");
      // console.log(gotText);
      var gotNumber = gotText;
      if (gotNumber != "") {
        let myParam = "";
        if (window.location.href.indexOf("infusionsoft.com/Contact") > -1) {
          const urlParams = new URLSearchParams(window.location.search);
          myParam = urlParams.get("ID");
          // console.log(myParam);
        }

        // gotNumber = gotNumber.replace("+","");
        var size = $(this).css("font-size");
        var html =
          '<a style="cursor:pointer"   onclick="event.preventDefault()"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
          size +
          " !important;width:" +
          size +
          ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>';
        html = $(html);
        $(this).val(gotText);
        $(this).after(html);

        if (myParam != "") {
          // console.log("came here");

          var urltosend =
            "https://justcall.io/dialer.php?numbers=" +
            gotNumber +
            "&medium=infusionsoft&type=contact&entityid=" +
            myParam;
          // console.log(urltosend);
          html.click(function () {
            openNumberZoho(urltosend, gotNumber, "call");
          });
        } else {
          html.click(function () {
            openNumber(gotNumber);
          });
        }
        // html.click(function(){ openNumber(gotNumber); });
        // $(this).remove();
        var smshtml = $(
          '<a onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(html).after(smshtml);

        if (myParam != "") {
          var smsurltosend =
            "https://justcall.io/dialer.php?numbers=" +
            gotNumber +
            "&sms=1&medium=infusionsoft&type=contact&entityid=" +
            myParam;
          smshtml.click(function () {
            openNumberZoho(smsurltosend, gotNumber, "sms");
          });
        } else {
          smshtml.click(function () {
            openNumber(gotNumber);
          });
        }
        // smshtml.click(function(){ openSMS(gotNumber); });
        countnumbersfound = countnumbersfound + 1;
        updateCount(countnumbersfound);
      } else {
        $(this).removeClass("hello");
      }
    }
  });
}

function replaceInfusionsoftNotes() {
  notespara = $(".noteContentText");
  notespara.each(function () {
    if ($(this).hasClass("hello")) {
    } else {
      $(this).addClass("hello");
      //find callsid links and getNotes

      var linkifytext = linkify($(this).text());
      $(this).html(linkifytext);
    }
  });
}

function replaceZohoDeskLinks() {
  // return;
  var zohodeskdiv = $('p[id^="commentContent_"]');
  zohodeskdiv.each(function () {
    if ($(this).hasClass("hello")) {
    } else {
      $(this).addClass("hello");
      //find callsid links and getNotes
      var audiosrc = $(this).find("audio").attr("src");
      var linkifytext = linkify($(this).html());
      $(this).empty();
      $(this).html(linkifytext);
      $(this).find("audio").attr("src", audiosrc);
    }
  });
}

function replaceSynchroteamDescription() {
  notespara = $("#lblJobDesc");
  notespara.each(function () {
    if ($(this).val() != "") {
      if ($(this).hasClass("hello")) {
      } else {
        $(this).addClass("hello");
        //find callsid links and getNotes

        // console.log($(this).val());
        var linkifytext = linkify($(this).val());

        $(this).replaceWith("<p>" + linkifytext + "</p>");
      }
    }
  });
}

function replaceProsperworksActivity() {
  activitypara = $(".ActivityItem_content > span >p");
  activitypara.each(function () {
    if ($(this).hasClass("hello")) {
    } else {
      $(this).addClass("hello");
      //find callsid links and getNotes

      var linkifytext = linkify($(this).text());
      $(this).html(linkifytext);
    }
  });
}

function replaceZohoNotes() {
  // return;

  var test = window.location.href;
  var result = test.indexOf("recruit.zoho");

  if (result != -1) {
    return;
  }

  notespara = $("#subvalue_DESCRIPTION");
  notespara.each(function () {
    if ($(this).hasClass("hello")) {
    } else {
      $(this).addClass("hello");
      //find callsid links and getNotes

      var linkifytext = linkify($(this).text());
      $(this).html(linkifytext);
    }
  });

  notespara = $(".Ticket_body");
  notespara.each(function () {
    if ($(this).hasClass("hello")) {
    } else {
      $(this).addClass("hello");
      //find callsid links and getNotes

      var linkifytext = linkify($(this).text());
      $(this).html(linkifytext);
    }
  });
}

function replaceZohoCRMPNotes() {
  // return;

  var test = window.location.href;
  var result = test.indexOf("recruit.zoho");

  if (result != -1) {
    return;
  }

  var $iframe = $("#crmLoadFrame").contents();

  notespara = $iframe.find("#subvalue_DESCRIPTION");
  notespara.each(function () {
    if ($(this).hasClass("hello")) {
    } else {
      $(this).addClass("hello");
      //find callsid links and getNotes

      var linkifytext = linkify($(this).text());
      $(this).html(linkifytext);
    }
  });

  notespara = $iframe.find("#subvalue_CALLRESULT");
  notespara.each(function () {
    if ($(this).hasClass("hello")) {
    } else {
      $(this).addClass("hello");
      //find callsid links and getNotes

      var linkifytext = linkify($(this).text());
      $(this).html(linkifytext);
    }
  });

  var $iframe = $("#crmLoadFrame").contents();

  notespara = $iframe.find(".tableData");
  notespara.each(function () {
    if ($(this).hasClass("hello")) {
    } else {
      $(this).addClass("hello");
      //find callsid links and getNotes

      // console.log($(this).text());

      var test = $(this).text();
      if (test.indexOf("https://justcall.io/calls") >= 0) {
        // console.log("Found world");

        var linkifytext = linkify($(this).text());
        $(this).html(linkifytext);
      }

      if (test.indexOf("https://ruzg4.app") >= 0) {
        // console.log("Found world");

        var linkifytext = linkify($(this).text());
        $(this).html(linkifytext);
      }
    }
  });

  notespara = $(".tableData");
  notespara.each(function () {
    if ($(this).hasClass("hello")) {
    } else {
      $(this).addClass("hello");
      //find callsid links and getNotes

      // console.log($(this).text());

      var test = $(this).text();
      if (test.indexOf("https://justcall.io/calls") >= 0) {
        // console.log("Found world");

        var linkifytext = linkify($(this).text());
        $(this).html(linkifytext);
      }

      if (test.indexOf("https://ruzg4.app") >= 0) {
        // console.log("Found world");

        var linkifytext = linkify($(this).text());
        $(this).html(linkifytext);
      }
    }
  });

  notespara = $("#subvalue_CALLRESULT");
  notespara.each(function () {
    if ($(this).hasClass("hello")) {
    } else {
      $(this).addClass("hello");
      //find callsid links and getNotes

      // console.log($(this).text());

      // console.log("Found world");

      var linkifytext = linkify($(this).text());
      $(this).html(linkifytext);
    }
  });
}

function matchAll(str, regex) {
  var res = [];
  var m;
  if (regex.global) {
    while ((m = regex.exec(str))) {
      res.push(m[1]);
    }
  } else {
    if ((m = regex.exec(str))) {
      res.push(m[1]);
    }
  }
  return res;
}

function linkify(inputText) {
  var replacedText, replacePattern1, replacePattern2, replacePattern3;

  //URLs starting with http://, https://, or ftp://
  replacePattern1 =
    /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
  replacedText = inputText.replace(
    replacePattern1,
    '<a href="$1" target="_blank">$1</a>'
  );

  // //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
  // replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
  // replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

  // //Change email addresses to mailto:: links.
  // replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
  // replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

  return replacedText;
}

function replaceInfusionsoftNotesLinks() {
  // Fix for notes in agile

  if (hostnameis.indexOf("agilecrm") >= 0) {
    $(".bg-transparent").each(function () {
      if ($(this).hasClass("hello")) {
      } else {
        $(this).addClass("hello");
        var $this = $(this);
        var t = $this.text();
        $this.html(t.replace("&lt", "<").replace("&gt", ">"));
      }
    });

    $(".activities_second_line").each(function () {
      if ($(this).hasClass("hello")) {
      } else {
        $(this).addClass("hello");
        var $this = $(this);
        var t = $this.text();
        $this.html(t.replace("&lt", "<").replace("&gt", ">"));
      }
    });

    $(".notes-pre > pre").each(function () {
      if ($(this).hasClass("hello")) {
      } else {
        $(this).addClass("hello");
        var $this = $(this);
        var t = $this.text();
        $this.html(t.replace("&lt", "<").replace("&gt", ">"));
      }
    });
  }

  var rec_links = $("a[href^='https://ruzg4.app.goo.gl/']");

  rec_links.each(function () {
    if ($(this).hasClass("hello")) {
    } else {
      $(this).addClass("hello");
      //get call sid from this
      var test = window.location.hostname;
      var yehanchor = $(this);
      if (test.indexOf("prosperworks") != -1) {
        yehanchor.click(function () {
          // console.log("clicked");
          var win = window.open($(this).attr("href"), "_blank");
          win.focus();
        });
      }
    }
  });

  var call_links = $("a[href^='https://justcall.io/calls/']");
  call_links.each(function () {
    if ($(this).hasClass("hello")) {
    } else {
      $(this).addClass("hello");
      //get call sid from this
      var textgot = $(this).text();
      var callsid;
      if (textgot.startsWith("https://justcall.io/calls/")) {
        callsid = textgot.replace("https://justcall.io/calls/", "");
      } else if (textgot.startsWith("justcall.io/calls/")) {
        callsid = textgot.replace("justcall.io/calls/", "");
      }

      // var notes = getNotes(callsid);
      var thisanchor = $(this);
      $.ajax({
        type: "POST",
        url: "https://api2.justcall.io/api/getNotes.php",
        data: {
          callsid: callsid,
        },
        success: function (res2) {
          // console.log(res2);

          // console.log("notes coming from getnotes.php are "+res2);

          var test = window.location.hostname;

          if (test.indexOf("groovehq") != -1) {
            thisanchor.text(" (update)");
            thisanchor.before(res2);
            if (test.indexOf("intercom") != -1) {
              thisanchor
                .parent()
                .closest("div")
                .removeClass("u__one-truncated-line");
            }

            if (test.indexOf("prosperworks") != -1) {
              thisanchor.click(function () {
                var win = window.open(
                  "https://justcall.io/calls/" + callsid,
                  "_blank"
                );
                win.focus();
              });
            }
          }

          if (test.indexOf("justcall.io") != -1) {
          } else {
            thisanchor.text(" (update)");
            thisanchor.before(res2);
            if (test.indexOf("intercom") != -1) {
              thisanchor
                .parent()
                .closest("div")
                .removeClass("u__one-truncated-line");
            }

            if (test.indexOf("prosperworks") != -1) {
              thisanchor.click(function () {
                var win = window.open(
                  "https://justcall.io/calls/" + callsid,
                  "_blank"
                );
                win.focus();
              });
            }
          }
        },
      });
    }
  });

  var call_links = $(
    "a[href^='https://slack-redir.net/link?url=https%3A%2F%2Fjustcall.io%2Fcalls%2F']"
  );
  call_links.each(function () {
    if ($(this).hasClass("hello")) {
    } else {
      $(this).addClass("hello");
      //get call sid from this
      var textgot = $(this).text();
      var callsid;
      if (textgot.startsWith("https://justcall.io/calls/")) {
        callsid = textgot.replace("https://justcall.io/calls/", "");
      } else if (textgot.startsWith("justcall.io/calls/")) {
        callsid = textgot.replace("justcall.io/calls/", "");
      }

      // var notes = getNotes(callsid);
      var thisanchor = $(this);
      $.ajax({
        type: "POST",
        url: "https://api2.justcall.io/api/getNotes.php",
        data: {
          callsid: callsid,
        },
        success: function (res2) {
          // console.log(res2);

          var test = window.location.hostname;
          if (test.indexOf("justcall") != -1) {
          } else {
            thisanchor.text(" (update)");
            thisanchor.before(res2);
            if (test.indexOf("intercom") != -1) {
              thisanchor
                .parent()
                .closest("div")
                .removeClass("u__one-truncated-line");
            }
          }
        },
      });
    }
  });
}

function replaceZohoCRMNotesLink() {
  // return;
  var $iframe = $("#crmLoadFrame").contents();

  var call_links = $iframe.find("a[href^='https://justcall.io/calls/']");
  call_links.each(function () {
    if ($(this).hasClass("hello")) {
    } else {
      $(this).addClass("hello");
      //get call sid from this
      var textgot = $(this).text();
      var callsid;
      if (textgot.startsWith("https://justcall.io/calls/")) {
        callsid = textgot.replace("https://justcall.io/calls/", "");
      } else if (textgot.startsWith("justcall.io/calls/")) {
        callsid = textgot.replace("justcall.io/calls/", "");
      }

      // var notes = getNotes(callsid);
      var thisanchor = $(this);
      $.ajax({
        type: "POST",
        url: "https://api2.justcall.io/api/getNotes.php",
        data: {
          callsid: callsid,
        },
        success: function (res2) {
          // console.log(res2);

          var test = window.location.hostname;
          if (test.indexOf("justcall") != -1) {
          } else {
            thisanchor.text(" (update)");
            thisanchor.before(res2);
            if (test.indexOf("intercom") != -1) {
              thisanchor
                .parent()
                .closest("div")
                .removeClass("u__one-truncated-line");
            }
          }
        },
      });
    }
  });

  var $iframe = $("#supportLoadFrame").contents();

  var call_links = $iframe.find("a[href^='https://justcall.io/calls/']");
  call_links.each(function () {
    if ($(this).hasClass("hello")) {
    } else {
      $(this).addClass("hello");
      //get call sid from this
      var textgot = $(this).text();
      var callsid;
      if (textgot.startsWith("https://justcall.io/calls/")) {
        callsid = textgot.replace("https://justcall.io/calls/", "");
      } else if (textgot.startsWith("justcall.io/calls/")) {
        callsid = textgot.replace("justcall.io/calls/", "");
      }

      // var notes = getNotes(callsid);
      var thisanchor = $(this);
      $.ajax({
        type: "POST",
        url: "https://api2.justcall.io/api/getNotes.php",
        data: {
          callsid: callsid,
        },
        success: function (res2) {
          // console.log(res2);

          var test = window.location.hostname;
          if (test.indexOf("justcall") != -1) {
          } else {
            thisanchor.text(" (update)");
            thisanchor.before(res2);
            if (test.indexOf("intercom") != -1) {
              thisanchor
                .parent()
                .closest("div")
                .removeClass("u__one-truncated-line");
            }
          }
        },
      });
    }
  });
}

function replaceSalesforcephones(salesforcephones) {
  if (hostnameis.indexOf("lightning") != -1) {
    //Only for Lightning

    salesforcephones = $(".uiOutputPhone");

    salesforcephones.each(function () {
      if ($(this).parent().hasClass("disabledState")) {
        $(this).parent().remove();
      }

      if (!$(this).parent().hasClass("disabledState")) {
        if ($(this).hasClass("hello")) {
        } else {
          $(this).addClass("hello");

          var pathname = window.location.href;
          var typeentity = "";
          var sfid = "";
          var str_start = "Lead/";
          var str_end = "/";
          var regExString = new RegExp(
            "(?:" + str_start + ")((.[\\s\\S]*))(?:" + str_end + ")"
          ); //set ig flag for global search and case insensitive

          var testRE = regExString.exec(pathname);
          if (testRE && testRE.length > 1) {
            var final_type = "Lead";
            var final_sf_id = testRE[1];
          }

          if (final_type && final_sf_id) {
          } else {
            var str_start = "Contact/";

            var regExString = new RegExp(
              "(?:" + str_start + ")((.[\\s\\S]*))(?:" + str_end + ")"
            ); //set ig flag for global search and case insensitive

            var testRE = regExString.exec(pathname);
            if (testRE && testRE.length > 1) {
              var final_type = "Contact";
              var final_sf_id = testRE[1];
            }
          }

          if (final_type && final_sf_id) {
            typeentity = final_type;
            sfid = final_sf_id;
          }

          $(this).addClass("hello");

          if (typeentity == "Accounts") {
          } else {
            $(this).parent().css("display", "inline-block");
          }
          var gotText = $(this).text();
          // console.log(gotText);
          // $(this).addClass("hello");
          // console.log(gotText);
          var gotNumber = gotText;
          // gotNumber = gotNumber.replace("+","");
          var size = $(this).css("font-size");

          var urltosend =
            "https://justcall.io/app/macapp/dialpad_app.php?numbers=" +
            gotNumber +
            "&medium=salesforce&type=" +
            typeentity +
            "&sfid=" +
            sfid;
          var html =
            '<a style="cursor:pointer"  class = "val -ellipsis ng-pristine ng-untouched ng-valid ng-not-empty"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>';
          html = $(html);
          $(this).val(gotText);
          $(this).after(html);
          // $(this).after(html);
          html.click(function () {
            openNumberSalesforce(urltosend, gotNumber, 0);
          });
          // $(this).remove();
          var smshtml = $(
            '<a><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
              size +
              " !important;width:" +
              size +
              ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
          );
          $(html).after(smshtml);
          var smsurltosend =
            "https://justcall.io/app/macapp/dialpad_app.php?numbers=" +
            gotNumber +
            "&sms=1&medium=salesforce&type=" +
            typeentity +
            "&sfid=" +
            sfid;
          // $(this).parent().closest('div').after(html);
          smshtml.click(function () {
            openNumberSalesforce(smsurltosend, gotNumber, 1);
          });
          countnumbersfound = countnumbersfound + 1;
          updateCount(countnumbersfound);
        }
      }
    });

    salesforcephones_new = $(".forceOutputPhone");

    salesforcephones_new.each(function () {
      if ($(this).parent().hasClass("disabledState")) {
        $(this).parent().remove();
      }

      if (!$(this).parent().hasClass("disabledState")) {
        if ($(this).hasClass("hello")) {
        } else {
          $(this).addClass("hello");

          var pathname = window.location.href;
          var typeentity = "";
          var sfid = "";
          var str_start = "Lead/";
          var str_end = "/";
          var regExString = new RegExp(
            "(?:" + str_start + ")((.[\\s\\S]*))(?:" + str_end + ")"
          ); //set ig flag for global search and case insensitive

          var testRE = regExString.exec(pathname);
          if (testRE && testRE.length > 1) {
            var final_type = "Lead";
            var final_sf_id = testRE[1];
          }

          if (final_type && final_sf_id) {
          } else {
            var str_start = "Contact/";

            var regExString = new RegExp(
              "(?:" + str_start + ")((.[\\s\\S]*))(?:" + str_end + ")"
            ); //set ig flag for global search and case insensitive

            var testRE = regExString.exec(pathname);
            if (testRE && testRE.length > 1) {
              var final_type = "Contact";
              var final_sf_id = testRE[1];
            }
          }

          if (final_type && final_sf_id) {
            typeentity = final_type;
            sfid = final_sf_id;
          }

          $(this).addClass("hello");

          if (typeentity == "Accounts") {
          } else {
            $(this).parent().css("display", "inline-block");
          }
          var gotText = $(this).text();
          // console.log(gotText);
          // $(this).addClass("hello");
          // console.log(gotText);
          var gotNumber = gotText;
          // gotNumber = gotNumber.replace("+","");
          var size = $(this).css("font-size");

          var urltosend =
            "https://justcall.io/app/macapp/dialpad_app.php?numbers=" +
            gotNumber +
            "&medium=salesforce&type=" +
            typeentity +
            "&sfid=" +
            sfid;
          var html =
            '<a style="cursor:pointer"  class = "val -ellipsis ng-pristine ng-untouched ng-valid ng-not-empty"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>';
          html = $(html);
          $(this).val(gotText);
          $(this).after(html);
          // $(this).after(html);
          html.click(function () {
            openNumberSalesforce(urltosend, gotNumber, 0);
          });
          // $(this).remove();
          var smshtml = $(
            '<a><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
              size +
              " !important;width:" +
              size +
              ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
          );
          $(html).after(smshtml);
          var smsurltosend =
            "https://justcall.io/app/macapp/dialpad_app.php?numbers=" +
            gotNumber +
            "&sms=1&medium=salesforce&type=" +
            typeentity +
            "&sfid=" +
            sfid;
          // $(this).parent().closest('div').after(html);
          smshtml.click(function () {
            openNumberSalesforce(smsurltosend, gotNumber, 1);
          });
          countnumbersfound = countnumbersfound + 1;
          updateCount(countnumbersfound);
        }
      }
    });

    salesforcephones_inside = $("span[lightning-clicktodial_clicktodial]");

    salesforcephones_inside.each(function () {
      if (
        $(this)
          .text()
          .replace(/[^0-9.]/g, "").length > 7
      ) {
        if ($(this).hasClass("hello")) {
        } else {
          $(this).addClass("hello");

          var pathname = window.location.href;
          var typeentity = "";
          var sfid = "";
          var str_start = "Lead/";
          var str_end = "/";
          var regExString = new RegExp(
            "(?:" + str_start + ")((.[\\s\\S]*))(?:" + str_end + ")"
          ); //set ig flag for global search and case insensitive

          var testRE = regExString.exec(pathname);
          if (testRE && testRE.length > 1) {
            var final_type = "Lead";
            var final_sf_id = testRE[1];
          }

          if (final_type && final_sf_id) {
          } else {
            var str_start = "Contact/";

            var regExString = new RegExp(
              "(?:" + str_start + ")((.[\\s\\S]*))(?:" + str_end + ")"
            ); //set ig flag for global search and case insensitive

            var testRE = regExString.exec(pathname);
            if (testRE && testRE.length > 1) {
              var final_type = "Contact";
              var final_sf_id = testRE[1];
            }
          }

          if (final_type && final_sf_id) {
            typeentity = final_type;
            sfid = final_sf_id;
          }

          $(this).addClass("hello");

          if (typeentity == "Accounts") {
          } else {
            $(this).parent().css("display", "flex");
          }
          var gotText = $(this).text();
          // console.log(gotText);
          // $(this).addClass("hello");
          // console.log(gotText);
          var gotNumber = gotText;
          // gotNumber = gotNumber.replace("+","");
          var size = $(this).css("font-size");

          var urltosend =
            "https://justcall.io/app/macapp/dialpad_app.php?numbers=" +
            gotNumber +
            "&medium=salesforce&type=" +
            typeentity +
            "&sfid=" +
            sfid;
          var html =
            '<a style="cursor:pointer;display:block"  class = ""><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>';
          html = $(html);
          $(this).val(gotText);
          $(this).after(html);
          // $(this).after(html);
          html.click(function () {
            openNumberSalesforce(urltosend, gotNumber, 0);
          });
          // $(this).remove();
          var smshtml = $(
            '<a style="display:block"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
              size +
              " !important;width:" +
              size +
              ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
          );
          $(html).after(smshtml);
          var smsurltosend =
            "https://justcall.io/app/macapp/dialpad_app.php?numbers=" +
            gotNumber +
            "&sms=1&medium=salesforce&type=" +
            typeentity +
            "&sfid=" +
            sfid;
          // $(this).parent().closest('div').after(html);

          if ($(this).closest("div").attr("class") == "dropdownItems") {
          } else {
            $(this).closest("div").css("width", "130%");
          }

          smshtml.click(function () {
            openNumberSalesforce(smsurltosend, gotNumber, 1);
          });
          countnumbersfound = countnumbersfound + 1;
          updateCount(countnumbersfound);
        }
      }
    });
  } else {
    //Only for Classic

    salesforceClassic = $("span[class='tel']");

    salesforceClassic.each(function () {
      if ($(this).parent().hasClass("hello")) {
      } else {
        $(this).parent().addClass("hello");
        $(this).parent().css("display", "inline-block");
        var gotText = $(this).text();
        // console.log(gotText);
        // $(this).addClass("hello");
        // console.log(gotText);
        var gotNumber = gotText;
        // gotNumber = gotNumber.replace("+","");
        var size = $(this).css("font-size");
        var html =
          '<a style="cursor:pointer" onclick="event.preventDefault()"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
          size +
          " !important;width:" +
          size +
          ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>';
        html = $(html);
        $(this).after(html);
        // $(this).after(html);
        html.click(function () {
          openNumber(gotNumber);
        });
        // $(this).remove();
        var smshtml = $(
          '<a onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(html).after(smshtml);
        // $(this).parent().closest('div').after(html);
        smshtml.click(function () {
          openSMS(gotNumber);
        });
        countnumbersfound = countnumbersfound + 1;
        updateCount(countnumbersfound);
      }
    });

    salesforceClassic_alt = $(".labelCol");

    salesforceClassic_alt.each(function () {
      if (this.textContent == "Phone") {
        if ($(this).next().children().hasClass("hello")) {
        } else {
          $(this).next().children().addClass("hello");
          $(this).next().css("display", "inline-block");
          var gotText = $(this).next().text();
          // console.log(gotText);
          // $(this).addClass("hello");
          // console.log(gotText);
          var gotNumber = gotText;
          // gotNumber = gotNumber.replace("+","");
          var size = $(this).next().css("font-size");
          var html =
            '<a style="cursor:pointer" onclick="event.preventDefault()"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>';
          html = $(html);
          $(this).next().after(html);
          // $(this).after(html);
          html.click(function () {
            openNumber(gotNumber);
          });
          // $(this).remove();
          var smshtml = $(
            '<a onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
              size +
              " !important;width:" +
              size +
              ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
          );
          $(html).after(smshtml);
          // $(this).parent().closest('div').after(html);
          smshtml.click(function () {
            openSMS(gotNumber);
          });
          countnumbersfound = countnumbersfound + 1;
          updateCount(countnumbersfound);
        }
      }
    });
  }
}

setInterval(function () {
  replacePropserworksTable2();
}, 1000);

function replacePropserworksTable2() {
  var me = $(".main-ember-application")[0];
  // console.log("me me");
  // console.log(me);
  if (me === undefined) {
    // console.log("I am undefined");
  } else {
    var shadowbhai = $(".main-ember-application")[0].shadowRoot;
    // console.log(shadowbhai);
    var inputfields = $(shadowbhai).find(
      "input[placeholder='Add Phone'], input[placeholder='Phone hinzufügen']"
    );

    var inputfields2 = $(shadowbhai).find(".u-clickThrough");
    // console.log(inputfields2);

    // console.log("input fields ");
    // console.log(inputfields);

    inputfields.each(function () {
      var actualelement = $(this).next(".u-ellipsis");

      updatednumber = actualelement.text();

      updatednumber = updatednumber.replace(/\s/g, "");
      updatednumber = updatednumber.replace(/[^a-zA-Z0-9]/g, "");

      // console.log("updated number is "+updatednumber);
      // console.log(gotText);

      updatednumber = updatednumber.replace("(directline)", "");

      if (actualelement.hasClass("hello")) {
        //refresh this data
      } else {
        actualelement.addClass("hello");
        // $(this).parent().css("display","inline-block");

        var gotText = actualelement.text();

        if (gotText.length > 3) {
          gotText = gotText.replace(/\s/g, "");
          gotText = gotText.replace(/[^a-zA-Z0-9]/g, "");

          // console.log(gotText);

          var gotNumber = gotText.replace("(directline)", "");
          // gotNumber = gotNumber.replace("+","");
          var html =
            '<a style="cursor:pointer" id="pwcall" href = "https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            updatednumber +
            '" target="_blank" onclick="event.preventDefault();"></a>';
          var size = actualelement.css("font-size");
          html =
            html +
            '<img id="pwcallimage" src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/>';
          var sethtml = $(html);
          sethtml.click(function () {
            openNumberPW2(updatednumber, this);
          });

          actualelement.after(sethtml);
          // $(this).click(function(){ openNumber(gotNumber); });
          var smshtml = $(
            '<a id="pwtext"  target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
              size +
              " !important;width:" +
              size +
              ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
          );
          actualelement.after(smshtml);
          smshtml.click(function () {
            openSMSPW2(updatednumber, this);
          });
          countnumbersfound = countnumbersfound + 1;
          updateCount(countnumbersfound);
        }
      }
    });
  }
}

function replacePropserworksTable() {
  var url = window.location.href;
  if (
    url.indexOf("/lead/") >= 0 ||
    url.indexOf("/contact/") >= 0 ||
    url.indexOf("organization") >= 0
  ) {
    var inputfields = $(
      "input[placeholder='Add Phone'], input[placeholder='Phone hinzufügen']"
    );

    inputfields.each(function () {
      var actualelement = $(this).next(".u-ellipsis");
      var regex = /[+]?\d+/g;
      updatednumber = actualelement.text().trim();
      updatednumber = updatednumber.match(regex).join("");
      updatednumber = updatednumber.replace("/[^0-9]/", "");
      console.log(updatednumber);

      // updatednumber = updatednumber.replace(/\s/g, "");
      // updatednumber = updatednumber.replace(/[^a-zA-Z0-9]/g, "");

      // console.log("updated number is "+updatednumber);
      // console.log(gotText);

      // updatednumber = updatednumber.replace("(directline)", "");

      if (actualelement.hasClass("hello")) {
        //refresh this data
      } else {
        actualelement.addClass("hello");
        // $(this).parent().css("display","inline-block");
        var gotText = actualelement.text();

        if (gotText.length > 3) {
          // gotText = gotText.replace(/\s/g, "");
          // gotText = gotText.replace(/[^a-zA-Z0-9]/g, "");

          // console.log(gotText);

          // var gotNumber = gotText.replace("(directline)", "");
          // gotNumber = gotNumber.replace("+","");
          var html =
            '<a style="cursor:pointer" id="pwcall" href = "https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            updatednumber +
            '" target="_blank" onclick="event.preventDefault();"></a>';
          var size = actualelement.css("font-size");
          html =
            html +
            '<img id="pwcallimage" src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/>';
          var sethtml = $(html);
          sethtml.click(function () {
            console.log(updatednumber);
            openNumberPW(updatednumber, this);
          });

          actualelement.after(sethtml);
          // $(this).click(function(){ openNumber(gotNumber); });
          var smshtml = $(
            '<a id="pwtext" href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
              updatednumber +
              '&sms=1" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
              size +
              " !important;width:" +
              size +
              ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
          );
          actualelement.after(smshtml);
          smshtml.click(function () {
            openSMSPW(updatednumber, this);
          });
          countnumbersfound = countnumbersfound + 1;
          updateCount(countnumbersfound);
        }
      }
    });
  }
}

function replaceNimbleDetail() {
  // notespara = $(".desc");
  // notespara.each(function() {

  //     var linkifytext = linkify($(this).text());
  //     $(this).html(linkifytext);

  // });

  notespara = $(".desc");
  notespara.each(function () {
    if ($(this).hasClass("hello")) {
    } else {
      $(this).addClass("hello");
      //find callsid links and getNotes

      var linkifytext = linkify($(this).text());
      $(this).html(linkifytext);
    }
  });
}

function replaceDeskDivs(deskdivs) {
  var current = 'customer[\\"phone_numbers\\"][$index].value|linebreaks';
  deskdivs = $('div[ng-bind="' + current + '"]');

  deskdivs.each(function () {
    if ($(this).hasClass("hello")) {
    } else {
      $(this).addClass("hello");
      $(this).parent().css("display", "inline-block");
      var gotText = $(this).text();
      // console.log(gotText);
      // $(this).addClass("hello");
      // console.log(gotText);
      var gotNumber = gotText;
      // gotNumber = gotNumber.replace("+","");
      var size = $(this).css("font-size");
      var html =
        '<a style="cursor:pointer"  class = "val -ellipsis ng-pristine ng-untouched ng-valid ng-not-empty" onclick="event.preventDefault()"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
        size +
        " !important;width:" +
        size +
        ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>';
      html = $(html);
      $(this).val(gotText);
      $(this).parent().closest("div").after(html);
      // $(this).after(html);
      html.click(function () {
        openNumber(gotNumber);
      });
      // $(this).remove();
      var smshtml = $(
        '<a onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
          size +
          " !important;width:" +
          size +
          ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
      );
      $(html).after(smshtml);
      // $(this).parent().closest('div').after(html);
      smshtml.click(function () {
        openSMS(gotNumber);
      });
      countnumbersfound = countnumbersfound + 1;
      updateCount(countnumbersfound);
    }
  });
}

function replaceSuiteCRMtd() {
  // var current = 'customer[\\"phone_numbers\\"][$index].value|linebreaks';
  deskdivs = $('td[field="phone_work"]');

  deskdivs.each(function () {
    var value = $(this).text();

    if ($(this).hasClass("hello")) {
    } else {
      $(this).addClass("hello");
      var gotText = $(this).text();
      $(this).css("display", "inline-block");
      $(this).css("width", "110%");

      var gotNumber = $(this).text();
      gotNumber = gotNumber.replace(/\s/g, "");

      var html =
        '<a style="cursor:pointer" href = "https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
        gotNumber +
        '" target="_blank" onclick="event.preventDefault();">' +
        gotText +
        "</a>";
      var size = $(this).css("font-size");
      html =
        html +
        '<img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
        size +
        " !important;width:" +
        size +
        ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/>';
      var sethtml = $(html);
      sethtml.click(function () {
        openNumber(gotNumber);
      });

      $(this).html(sethtml);
      // $(this).click(function(){ openNumber(gotNumber); });
      var smshtml = $(
        '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
          gotNumber +
          '&sms=1" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
          size +
          " !important;width:" +
          size +
          ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
      );
      $(this).append(smshtml);
      smshtml.click(function () {
        openSMS(gotNumber);
      });
      countnumbersfound = countnumbersfound + 1;
      updateCount(countnumbersfound);
    }
  });
}

function addFrontCompose() {
  var nextospan = $("span.window-title");
  nextospan.each(function () {
    if ($(this).hasClass("hello")) {
    } else {
      $(this).addClass("hello");
      var buttonhtml =
        '<div class="fa-Btn-small -primary">Compose via JustCall</div>';
      var sethtml = $(buttonhtml);
      sethtml.click(function () {
        closeComposer();
      });
      $(this).after(sethtml);
    }
  });
}

function closeComposer() {
  // console.log("close front composer");
  // console.log("open JustCall composer");
  $(".close").trigger("click");
  var div =
    '<div class = "popover-overlay composer visible" id="justcallpopover">' +
    '<form class="popover -composer" name="form" fa-composer-popover="" onsubmit="event.preventDefault();">' +
    '<header class="window-header">' +
    '<button class="button close" id="closeJustCalldiv">' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14"><path fill-rule="evenodd" d="M5.94 7L3.994 8.945a.75.75 0 1 0 1.06 1.06L7 8.061l1.945 1.944a.75.75 0 0 0 1.06-1.06L8.061 7l1.944-1.945a.75.75 0 0 0-1.06-1.06L7 5.939 5.055 3.995a.75.75 0 1 0-1.06 1.06L5.939 7zM7 14A7 7 0 1 1 7 0a7 7 0 0 1 0 14z"></path></svg>' +
    "</button>" +
    '<span class="window-title hello">New Message</span>' +
    '<button class="button pop-out" ng-click="popupInExternalWindow()" style="visibility:hidden">' +
    '<svg width="15" height="15" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg"><path d="M2 5v6.998C2 12.55 2.456 13 3.002 13H10c0 1.113-.895 2-2 2H2c-1.113 0-2-.895-2-2V7c0-1.113.895-2 2-2zm3.992-5h7.016C14.1 0 15 .892 15 1.992v7.016A1.997 1.997 0 0 1 13.008 11H5.992A1.997 1.997 0 0 1 4 9.008V1.992C4 .9 4.892 0 5.992 0zM6 2v7h7V2H6z" fill-rule="evenodd"></path></svg>' +
    "</button>" +
    "</header>" +
    '<fa-composer class="fa-composer-base" conversation="conversation" message="message" is-popover="true" ng-if="message" base-tab-index="1000">' +
    '<div class ="composer-container">' +
    '<div class = "composer-header">' +
    '<div class="header-container">' +
    '<div class = "draft-recipients _styled-scrollbar">' +
    '<div class="-from-to" style="margin:5px">' +
    '<div class="column-left">' +
    '<span class="recipient-role">From </span>' +
    '<span class="form-control" id="nosmsnumbersfound_front" style="display:none;color:red">No numbers found</span>' +
    '<select class="form-control" style="background:#ffffff;border-color:#aaaaaa;width:200px;height:29px" name="defaultnumber" id="outboundtextnumber_front"></select>' +
    '<span class="recipients-editor -to" style="margin-left:10px;margin-right:10px">To</span>' +
    '<select id="mySelect2" style="margin-left:10px !important;width:37%;font-size:12px !important;"></select>' +
    '<input id="new_number" placeholder = "Enter number with country code" style="padding-left:10px;background: #ffffff; border: 1px solid; border-radius: 5px; border-color: #aaaaaa; /* width: 200px; */ height: 29px; width: 37%; margin-left: 10px !important; font-size: 12px !important;display:none" class="input-body -roboto"/>' +
    '<i class = "fa fa-plus-circle" style="margin-left:10px;color:#4a90e2;font-size:20px;cursor:pointer" id="new_sendingnumber"></i>' +
    '<i class = "fa fa-address-book" style="margin-left:10px;color:#4a90e2;font-size:20px;display:none;cursor:pointer" id="contacts_book"></i>' +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>" +
    '<div class = "draft-body">' +
    '<div class="draft-inner" style="height:100%">' +
    '<textarea id="bodyoftextmessage" class="editor input-body -roboto editor simple-editor" contenteditable="true"  placeholder="Write here…" tabindex="1005" style="width:100%"></textarea>' +
    "</div>" +
    "</div>" +
    '<footer class="composer-footer-container" fa-composer-footer-shortcuts="" ng-if="isPopover">' +
    '<div class="composer-footer" ng-switch="useSimplifiedChat()">' +
    '<div class="footer-actions -left" ng-switch-when="false">' +
    '<span style="color:crimson" style="font-size:14px;color:#d81717" id="errormessage"></span>' +
    "</div>" +
    '<div class="footer-actions -right" ng-switch-when="false">' +
    '<a class="action" fa-tooltip="" alt="Delete draft" ng-click="deleteMessage()">' +
    "</a>" +
    '<div class="fa-Btn-small -primary" id="sendtextmessage_justcall">' +
    "<span>Send text message</span>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</footer>" +
    "</div>" +
    "</fa-composer>" +
    "</form>" +
    "</div>";
  $("body").append(div);

  getTextNumbers();
}

function sendtextmessage() {
  var justcallnumber = $("#outboundtextnumber_front").val();
  // console.log("justcall number is ",justcallnumber);

  var testingnumber = $("#mySelect2").val();
  var sendingnumber = "";
  if (testingnumber != null) {
    sendingnumber = $("#mySelect2").val().split(",");
  } else {
    sendingnumber = null;
  }

  if (frontcompose == 1) {
    testingnumber = $("#new_number").val();
    if (testingnumber == "") {
      sendingnumber = null;
    } else {
      sendingnumber = testingnumber.split(",");
    }
  }

  // console.log("sending number is ",sendingnumber);
  var bodyofmessage = $("#bodyoftextmessage").val();
  // console.log("body of text message ", bodyofmessage);

  if (justcallnumber == null) {
    $("#errormessage").show();
    $("#errormessage").text(
      "Error: Please select a JustCall number to send text from."
    );
    return true;
  }

  if (sendingnumber == null) {
    $("#errormessage").show();
    $("#errormessage").text(
      "Error: Please select a Front contact to send text"
    );
    return true;
  }

  if (bodyofmessage == "") {
    $("#errormessage").show();
    $("#errormessage").text(
      "Error: Please write something for the text message"
    );
    return true;
  }

  $("#errormessage").hide();

  $("#sendtextmessage_justcall").attr("disabled", "disabled");
  $("#sendtextmessage_justcall").text("Sending ...");
  $.ajax({
    type: "POST",
    url: "https://justcall.io/api/sendmessage.php",
    data: {
      hash: jc_cookie,
      from: justcallnumber,
      to: sendingnumber,
      body: bodyofmessage,
    },
    success: function (res) {
      //console.log(res);
      res = JSON.parse(res);
      // console.log(res);
      if (res[0] == "success") {
        // window.setTimeout(function() {
        //   var elem = document.getElementById('showbubble');
        //   elem.scrollTop = elem.scrollHeight;
        // }, 1000);

        // $.gritter.add({
        //   title: 'Your text is on the way :)',
        //   class_name: 'color success'
        // });

        // location.reload();
        // gettotalmsg(justcallnumber,justcallfriendnumber,0,20);
        // var plustext = "<? echo $plustext; ?>";

        // closeJustCalldiv();
        $("#sendtextmessage_justcall").removeAttr("disabled");
        $("#sendtextmessage_justcall").text("Message sent");
        $("#bodyoftextmessage").val("");
        setTimeout(function () {
          $("#sendtextmessage_justcall").text("Send text message");
        }, 2000);
      } else {
        $("#sendtextmessage_justcall").removeAttr("disabled");
        $("#sendtextmessage_justcall").text("Send text message");
        $("#errormessage").show();
        $("#errormessage").text("Error: " + res[2]);
      }
    },
  });
}

function new_sendingnumber() {
  //hide front contacts select
  //show new input selection
  //show contacts icon

  $(".select2").hide();
  $("#new_number").show();

  frontcompose = 1;
  $("#new_number").focus();
  $("#contacts_book").show();
  $("#new_sendingnumber").hide();
}

function replaceHelpScout() {
  console.log("helpscout");
  var synchrosip = $("input#phones_EditableField7");
  synchrosip.each(function () {
    if ($(this).hasClass("hello")) {
    } else {
      $(this).addClass("hello");

      var replacedtel = $(this).val();

      var size = $(this).css("font-size");

      var html = $(
        '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
          replacedtel +
          '"target="_blank" onclick="event.preventDefault();" class = "calllink"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
          size +
          " !important;width:" +
          size +
          ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
      );
      $(this).nextAll(".calllink").remove();
      $(this).after(html);
      $(html).click(function () {
        openNumber(replacedtel);
      });
      var smshtml = $(
        '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
          replacedtel +
          '&sms=1" target="_blank" onclick="event.preventDefault();" class = "smslink"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
          size +
          " !important;width:" +
          size +
          ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
      );
      $(this).nextAll(".smslink").remove();

      html.after(smshtml);
      smshtml.click(function () {
        openSMS(replacedtel);
      });
      countnumbersfound = countnumbersfound + 1;
      updateCount(countnumbersfound);
    }
  });
}

function hide_sendingnumber() {
  //opp of above function

  $(".select2").show();
  frontcompose = 0;
  $("#new_number").hide();
  $("#contacts_book").hide();
  $("#new_sendingnumber").show();
}

function getTextNumbers() {
  $("#sendtextmessage_justcall").click(function () {
    sendtextmessage();
  });
  $("#new_sendingnumber").click(function () {
    new_sendingnumber();
  });
  $("#contacts_book").click(function () {
    hide_sendingnumber();
  });

  $("#closeJustCalldiv").click(function () {
    closeJustCalldiv();
  });
  try {
    $("#mySelect2").select2("destroy");
  } catch (e) {}
  var companyname = $(".clickable").first().attr("alt");
  companyname = companyname.toLowerCase();

  $("#mySelect2").select2({
    placeholder: "Search for Front contacts",

    ajax: {
      url: function (params) {
        return (
          "https://app.frontapp.com/api/1/companies/" +
          companyname +
          "/search_contact2/phone/" +
          params.term
        );
      },
      processResults: function (data) {
        return {
          results: $.map(data, function (obj) {
            return { id: obj.handle, text: obj.name + " - " + obj.handle };
          }),
        };
      },
    },
  });
  $("#outboundtextnumber_front").html("");
  var sethtmlnumber = "";
  $.ajax({
    type: "POST",
    url: "https://justcall.io/api/getallotednumber.php",
    data: { hash: jc_cookie, smsrequirement: "1" },
    success: function (res) {
      res = JSON.parse(res);
      count = res.count;
      if (count != 0) {
        $.each(res.data, function (index, value) {
          sethtmlnumber +=
            '<option value = "' +
            value.phone +
            '">' +
            value.friendly_name +
            "</option>";
        });
        // console.log(res.data[0]['phone']);
        $("#nosmsnumbersfound_front").hide();
        $("#outboundtextnumber_front").show();

        $("#outboundtextnumber_front").html(sethtmlnumber);
      } else {
        $("#nosmsnumbersfound_front").show();
        $("#outboundtextnumber_front").hide();
      }
    },
  });
}

function closeJustCalldiv() {
  $("#justcallpopover").remove();
  $(".popover-overlay").hide();
}

function replaceFreshsales() {
  var regex =
    /(\+?(?:(?:9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)|\((?:9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\))[0-9. -]{4,14})(?:\b|x\d+)/;
  var test = window.location.hostname;

  if (test.indexOf("freshsales") != -1 || test.indexOf("freshworks") != -1) {
    // console.log("here ok");
    var elements = $(
      "span[data-test-inline-edit-content] div[id*=ember].ember-view span[data-test-nophonefeature]"
    );

    if (elements.length == 0) {
      elements = $("td div.phone-content div.text-ellipsis").filter(
        function () {
          var $number = $(this)
            .text()
            .trim()
            .replace(/[^\+0-9]/g, "");
          // return ($class && $class.match(/^[0-9 \+-]{2,}$/));

          return $number;
        }
      );
    }

    elements.each(function (index) {
      var numberData = {};

      // conosle.log("found motherfucker");

      if (location.pathname.match(/^\/(organization)/i)) {
        numberData.entity_name = "organization";
      } else if (location.pathname.match(/^\/(person)/i)) {
        numberData.entity_name = "person";
      } else if (location.pathname.match(/^\/(deal)/i)) {
        numberData.entity_name = "deal";
      }

      if (location.pathname.match(/^\/(deal|person|organization)\/[0-9]+$/i)) {
        numberData.id = location.pathname.replace(/[^0-9]+/i, "");
      } else {
        var search = $(this).parents("tr");
        if (search.length > 0) {
          search = search.find('[data-field="name"] a');
          if (search.length > 0) {
            if (
              search
                .attr("href")
                .match(/\/(person|deal|organization)\/[0-9]+$/i)
            ) {
              numberData.id = search.attr("href").replace(/[^0-9]+/, "");
            }
          }
        }
      }

      this.numberData = numberData;
      var phonenumber = $(this).text();

      // console.log(this.numberData);

      // this.callNumber = $(this).text();

      // console.log($(this).text());

      if (regex.test($(this).text()) == true) {
        if (!$(this).preventDefault) $(this).preventDefault = function () {};
        if (!$(this).stopPropagation) $(this).stopPropagation = function () {};

        if (this.justcallEventClick == undefined) {
          // $(this).parent().find("a.justcallhs").remove();
        }
        if (this.justcallEventClick == undefined) {
          this.justcallEventClick = true;

          var iconURLSMS = chrome.runtime.getURL("chat_icon.png");
          var iconURL = chrome.runtime.getURL("icon_16.png");

          var smshtml =
            '<a class="justcallhs"  href="#"><img style="margin-right:5px" class="justcall_icon_sms" src="' +
            iconURLSMS +
            '"></img>' +
            "</a>";
          smshtml = $(smshtml);
          var parent = this;
          smshtml.click(function () {
            event.preventDefault();
            event.stopPropagation();
            // console.log('element sms', parent);
            // console.log('number', parent.callNumber);
            // console.log('data', parent.numberData);
            var numberjohai = parent.callNumber;
            var entityjohai = parent.numberData.entity_name;
            var entityidjohai = parent.numberData.id;
            var urltosend =
              "https://justcall.io/app/macapp/dialpad_app.php?numbers=" +
              phonenumber +
              "&sms=1&medium=teamwave&type=" +
              entityjohai +
              "&entityid=" +
              entityidjohai;
            // $(this).unbind().click(function() {
            openNumberPipedrive(urltosend, numberjohai, "sms");
            // });
            return false;
          });
          $(this).prepend(smshtml);

          var callhtml =
            '<a class="justcallhs"  href="#"><img style="margin-right:5px" class="justcall_icon" src="' +
            iconURL +
            '"></img>' +
            "</a>";
          callhtml = $(callhtml);
          var parent = this;
          callhtml.click(function () {
            event.preventDefault();
            event.stopPropagation();
            // console.log('element sms', parent);
            // console.log('number', parent.callNumber);
            // console.log('data', parent.numberData);
            var numberjohai = parent.callNumber;
            var entityjohai = parent.numberData.entity_name;
            var entityidjohai = parent.numberData.id;
            var urltosend =
              "https://justcall.io/app/macapp/dialpad_app.php?numbers=" +
              phonenumber +
              "&medium=teamwave&type=" +
              entityjohai +
              "&entityid=" +
              entityidjohai;
            // $(this).unbind().click(function() {
            openNumberPipedrive(urltosend, numberjohai, "call");
            // });
            return false;
          });
          $(this).prepend(callhtml);
          // $(this).parent().find('.salesPhoneIcon').remove();
        } else {
        }
      }
    });
  }
}

function replaceTeamwave() {
  var regex =
    /(\+?(?:(?:9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)|\((?:9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\))[0-9. -]{4,14})(?:\b|x\d+)/;
  var test = window.location.hostname;
  if (test.indexOf("teamwave.com") != -1) {
    var elements = $('a[ng-click^="phoneNumberFormat"]'),
      regexp = new RegExp("^(callto|tel|skype|facetime|jc):", "g");
    elements.each(function (index) {
      var numberData = {};

      if (location.pathname.match(/^\/(organization)/i)) {
        numberData.entity_name = "organization";
      } else if (location.pathname.match(/^\/(person)/i)) {
        numberData.entity_name = "person";
      } else if (location.pathname.match(/^\/(deal)/i)) {
        numberData.entity_name = "deal";
      }

      if (location.pathname.match(/^\/(deal|person|organization)\/[0-9]+$/i)) {
        numberData.id = location.pathname.replace(/[^0-9]+/i, "");
      } else {
        var search = $(this).parents("tr");
        if (search.length > 0) {
          search = search.find('[data-field="name"] a');
          if (search.length > 0) {
            if (
              search
                .attr("href")
                .match(/\/(person|deal|organization)\/[0-9]+$/i)
            ) {
              numberData.id = search.attr("href").replace(/[^0-9]+/, "");
            }
          }
        }
      }

      this.numberData = numberData;

      // console.log(this.numberData);

      this.callNumber = $(this).text();

      if (regex.test($(this).text()) == true) {
        if (!$(this).preventDefault) $(this).preventDefault = function () {};
        if (!$(this).stopPropagation) $(this).stopPropagation = function () {};

        if (this.justcallEventClick == undefined) {
          // $(this).parent().find("a.justcallhs").remove();
        }
        if (this.justcallEventClick == undefined) {
          this.justcallEventClick = true;

          var iconURLSMS = chrome.runtime.getURL("chat_icon.png");
          var iconURL = chrome.runtime.getURL("icon_16.png");

          var smshtml =
            '<a class="justcallhs"  href="#"><img style="margin-right:5px" class="justcall_icon_sms" src="' +
            iconURLSMS +
            '"></img>' +
            "</a>";
          smshtml = $(smshtml);
          var parent = this;
          smshtml.click(function () {
            event.preventDefault();
            event.stopPropagation();
            // console.log('element sms', parent);
            // console.log('number', parent.callNumber);
            // console.log('data', parent.numberData);
            var numberjohai = parent.callNumber;
            var entityjohai = parent.numberData.entity_name;
            var entityidjohai = parent.numberData.id;
            var urltosend =
              "https://justcall.io/app/macapp/dialpad_app.php?numbers=" +
              numberjohai +
              "&sms=1&medium=teamwave&type=" +
              entityjohai +
              "&entityid=" +
              entityidjohai;
            // $(this).unbind().click(function() {
            openNumberPipedrive(urltosend, numberjohai, "sms");
            // });
            return false;
          });
          $(this).prepend(smshtml);

          var callhtml =
            '<a class="justcallhs"  href="#"><img style="margin-right:5px" class="justcall_icon" src="' +
            iconURL +
            '"></img>' +
            "</a>";
          callhtml = $(callhtml);
          var parent = this;
          callhtml.click(function () {
            event.preventDefault();
            event.stopPropagation();
            // console.log('element sms', parent);
            // console.log('number', parent.callNumber);
            // console.log('data', parent.numberData);
            var numberjohai = parent.callNumber;
            var entityjohai = parent.numberData.entity_name;
            var entityidjohai = parent.numberData.id;
            var urltosend =
              "https://justcall.io/app/macapp/dialpad_app.php?numbers=" +
              numberjohai +
              "&medium=teamwave&type=" +
              entityjohai +
              "&entityid=" +
              entityidjohai;
            // $(this).unbind().click(function() {
            openNumberPipedrive(urltosend, numberjohai, "call");
            // });
            return false;
          });
          $(this).prepend(callhtml);
          // $(this).parent().find('.salesPhoneIcon').remove();
        } else {
        }
      }
    });
  }
}

function replacePipedrive() {
  replaceTeamwave();

  replaceFreshsales();
  var test = window.location.href;
  // console.log(test);

  if (
    test.indexOf("pipedrive.com") != -1 ||
    test.indexOf("gorgias.com") != -1 ||
    test.indexOf("teamwave.com") != -1 ||
    test.indexOf("nocrm.io") != -1
  ) {
    var elements = $(
        'a[href*="callto"],a[href*="tel"],a[href*="skype"],a[href*="facetime"],a[href*="jc"]'
      ),
      regexp = new RegExp("^(callto|tel|skype|facetime|jc):", "g");
    elements.each(function (index) {
      var numberData = {};

      if (location.pathname.match(/^\/(organization)/i)) {
        numberData.entity_name = "organization";
      } else if (location.pathname.match(/^\/(person)/i)) {
        numberData.entity_name = "person";
      } else if (location.pathname.match(/^\/(deal)/i)) {
        numberData.entity_name = "deal";
      }

      if (location.pathname.match(/^\/(deal|person|organization)\/[0-9]+$/i)) {
        numberData.id = location.pathname.replace(/[^0-9]+/i, "");
      } else {
        var search = $(this).parents("tr");
        if (search.length > 0) {
          search = search.find('[data-field="name"] a');
          if (search.length > 0) {
            if (
              search
                .attr("href")
                .match(/\/(person|deal|organization)\/[0-9]+$/i)
            ) {
              numberData.id = search.attr("href").replace(/[^0-9]+/, "");
            }
          }
        }
      }

      this.numberData = numberData;
      this.callNumber = this.href.replace(regexp, "");
      if (!this.preventDefault) this.preventDefault = function () {};
      if (!this.stopPropagation) this.stopPropagation = function () {};

      if (this.justcallEventClick == undefined) {
        // $(this).parent().find("a.justcallhs").remove();
      }
      if (this.href.match(regexp) && this.justcallEventClick == undefined) {
        this.justcallEventClick = true;
        this.setAttribute(
          "style",
          "background-image: url(" +
            chrome.extension.getURL("icon_16.png") +
            ") !important;" +
            "padding-right: 20px;" +
            "background-size: 15px;" +
            "background-repeat: no-repeat;" +
            "background-position: left;" +
            "backface-visibility: visible;" +
            "padding-left: 20px;"
        );
        var iconURLSMS = chrome.runtime.getURL("chat_icon.png");

        var smshtml =
          '<a class="justcallhs"  href="#"><img style="margin-right:5px" class="justcall_icon_sms" src="' +
          iconURLSMS +
          '"></img>' +
          "</a>";
        smshtml = $(smshtml);

        var parent = this;
        smshtml.click(function () {
          event.preventDefault();
          event.stopPropagation();
          // console.log('element sms', parent);
          // console.log('number', parent.callNumber);
          // console.log('data', parent.numberData);
          var numberjohai = parent.callNumber;
          var entityjohai = parent.numberData.entity_name;
          var entityidjohai = parent.numberData.id;
          var urltosend =
            "https://justcall.io/app/macapp/dialpad_app.php?numbers=" +
            numberjohai +
            "&sms=1&medium=pipedrive&type=" +
            entityjohai +
            "&entityid=" +
            entityidjohai;
          // $(this).unbind().click(function() {
          openNumberPipedrive(urltosend, numberjohai, "sms");
          // });
          return false;
        });
        $(this).prepend(smshtml);
        // $(this).parent().find('.salesPhoneIcon').remove();

        $(this).click(function () {
          // console.log('element', this);
          // console.log('number', this.callNumber);
          // console.log('data', this.numberData);
          var numberjohai = this.callNumber;
          var entityjohai = this.numberData.entity_name;
          var entityidjohai = this.numberData.id;
          var urltosend =
            "https://justcall.io/app/macapp/dialpad_app.php?numbers=" +
            numberjohai +
            "&medium=pipedrive&type=" +
            entityjohai +
            "&entityid=" +
            entityidjohai;
          // $(this).unbind().click(function() {
          openNumberPipedrive(urltosend, numberjohai, "call");
          // });

          return false;
        });
      } else {
      }
    });

    var pipedrivespans_pr = $(".gridCell__salesPhoneButton")
      .find(".gridCell__salesPhoneIcon")
      .next();
    // var pipedrivespans = pipedrivespans_pr.find('.gridCell__salesPhoneIcon');

    pipedrivespans_pr.each(function () {
      var gotText = $(this).text();
      gotText = gotText.replace(/[^+0-9]/g, "");
      var element = $(this).parent();

      if ($(this).hasClass(gotText)) {
        return;
      }

      $(this).removeClass();
      $(this).addClass("gridCell__valueRemark");
      $(this).addClass(gotText);
      element.find(".jc-call").remove();
      element.find(".jc-sms").remove();

      // $(this).addClass("hello");
      // $(this).addClass(gotText);

      var replacedtel = gotText;
      // console.log("replaced tel  is "+replacedtel);
      var n = replacedtel.length;

      if (n > 4) {
        var html =
          '<a class="jc-call" style="cursor:pointer" href = "https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
          replacedtel +
          '" target="_blank" onclick="event.stopPropagation;">';
        var size = $(this).css("font-size");
        html =
          html +
          '<img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
          size +
          " !important;width:" +
          size +
          ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>';
        var sethtml = $(html);
        sethtml.click(function () {
          event.preventDefault();
          event.stopPropagation();
          openNumber(replacedtel);
        });
        $(this).after(sethtml);

        // $(this).click(function(){ openNumber(gotNumber); });
        var smshtml = $(
          '<a class="jc-sms" href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            replacedtel +
            '&sms=1" target="_blank" onclick="event.stopPropagation;"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        $(this).after(smshtml);
        smshtml.click(function () {
          event.preventDefault();
          event.stopPropagation();
          openSMS(replacedtel);
        });
        countnumbersfound = countnumbersfound + 1;
        updateCount(countnumbersfound);

        // $(this).remove();
      }
    });
  }
}

function replaceoutreach() {
  var test = window.location.hostname;
  if (test.indexOf("outreach.io") != -1) {
    var allhrefs = $('a[href^="tel"]:visible');
    // console.log("hrefs on this page");

    allhrefs.each(function () {
      var element = $(this);

      var href = $(this).attr("href");
      // console.log(href);
      // console.log("mai hi hun");

      if ($(this).hasClass("hello")) {
      } else {
        $(this).addClass("hello");
        var replacedtel = href.replace("tel:", "");
        var number = replacedtel.trim().replace(/[^\+0-9]/g, "");
        var size = element.css("font-size");
        // element.html(html);
        // element.click(function(){ openNumber(gotNumber); });

        var callhtml = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            number +
            '" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        callhtml.click(function () {
          openNumberFront(number);
        });
        element.after(callhtml);

        var smshtml = $(
          '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
            number +
            '&sms=1" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
            size +
            " !important;width:" +
            size +
            ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
        );
        smshtml.click(function () {
          openSMSFront(number);
        });

        element.after(smshtml);
      }
    });
  }
}

function replaceProsperworksOppurtunities() {
  var test = window.location.href;
  // console.log(test);

  if (test.indexOf("/deal/") != -1) {
    var inputfields = $(".u-clickThrough");
    // console.log(inputfields);
    inputfields.each(function () {
      if ($(this).hasClass("TextField")) {
        //do nothing
      } else {
        var actualelement = $(this).children(".u-ellipsis");
        // console.log("length hai");
        // console.log(actualelement.length);

        if ($(this).hasClass("hello")) {
        } else {
          $(this).addClass("hello");
          var regex = /[+]?\d+/g;
          // console.log("maine hello dala");
          // $(this).parent().css("display","inline-block");
          $(this).css("pointer-events", "all");
          var gotText = actualelement.text();
          gotText = gotText.match(regex).join("");

          if (gotText.length > 3) {
            gotText = gotText.replace(/\s/g, "");
            gotText = gotText.replace(/[^a-zA-Z0-9]/g, "");

            // console.log(gotText);

            var gotNumber = gotText.replace("(directline)", "");
            // gotNumber = gotNumber.replace("+","");
            var html =
              '<a style="cursor:pointer" href = "https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
              gotNumber +
              '" target="_blank" onclick="event.preventDefault();"></a>';
            var size = actualelement.css("font-size");
            html =
              html +
              '<img src ="https://justcall.io/ckassets/rsz_favicon.png" style="height:' +
              size +
              " !important;width:" +
              size +
              ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/>';
            var sethtml = $(html);
            sethtml.click(function () {
              openNumberPWO(gotNumber, this);
            });

            // actualelement.after(sethtml);
            // $(this).click(function(){ openNumber(gotNumber); });
            var smshtml = $(
              '<a href="https://justcall.io/app/macapp/dialpad_app.php?numbers=' +
                gotNumber +
                '&sms=1" target="_blank" onclick="event.preventDefault();"><img src ="https://justcall.io/ckassets/rsz_favicon_1.png" style="height:' +
                size +
                " !important;width:" +
                size +
                ' !important;margin-left:5px;max-height:12px;max-width:12px;display:inline"/></a>'
            );
            // sethml.after(smshtml);
            smshtml.click(function () {
              openSMSPWO(gotNumber, this);
            });
            actualelement.append(sethtml);
            actualelement.append(smshtml);

            countnumbersfound = countnumbersfound + 1;
            updateCount(countnumbersfound);
          }
        }
      }
    });
  }
}

var observeDOM = (function () {
  var MutationObserver =
      window.MutationObserver || window.WebKitMutationObserver,
    eventListenerSupported = window.addEventListener;

  return function (obj, callback) {
    if (MutationObserver) {
      // define a new observer
      var obs = new MutationObserver(function (mutations, observer) {
        if (mutations[0].addedNodes.length || mutations[0].removedNodes.length)
          callback();
      });
      // have the observer observe foo for changes in children
      obs.observe(obj, { childList: true, subtree: true });
    } else if (eventListenerSupported) {
      obj.addEventListener("DOMNodeInserted", callback, false);
      obj.addEventListener("DOMNodeRemoved", callback, false);
    }
  };
})();

function observeFrontAppDOMIFrame() {
  setTimeout(function () {
    var iframe = document.querySelector("iframe[title='Settings']")
      .contentWindow.document.body;

    observeDOM(iframe, function () {
      replaceFrontSpans(frontspans);
      replaceFrontCRMS();
    });
  }, 2000);
}

function observeNimbleDOMIFrame() {
  setTimeout(function () {
    var iframeNimble = document.querySelector(".base-wrapper").contentWindow;
    var iframe =
      iframeNimble.document.querySelector(".gwt-Frame").contentWindow.document
        .body;
    var iframeNimbleContent = iframeNimble.document.body;
    observeDOM(iframeNimbleContent, function () {
      replaceNimbleCallto();
      observeNimbleDOMIFrame();
    });
    observeDOM(iframe, function () {
      replaceNimbleCallto();
    });
  }, 2000);
}

function attachlistener() {
  setTimeout(function () {
    observeDOM($(".main-ember-application")[0].shadowRoot, function () {
      // console.log('shadow root dom changed');
      setTimeout(function () {
        countnumbersfound = 0;
        replacePropserworksTable2();
        if (
          hostnameis == "boldheart.com" ||
          hostnameis == "myhometouch.com" ||
          hostnameis == "mail.google.com" ||
          hostnameis == "google.com" ||
          hostnameis == "www.lever.co" ||
          hostnameis == "lever.co" ||
          hostnameis == "trello.com"
        ) {
          replacePropserworksTable();
          replacePropserworksTable2();

          replaceProsperworksOppurtunities();
        }
      }, 2000);
    });
  }, 30000);
}

function attachzohoCRmplistener() {
  setTimeout(function () {
    // console.log("going to observe dom for zoho crm iframe");

    var iframe =
      document.getElementById("crmLoadFrame").contentWindow.document.body;
    observeDOM(iframe, function () {
      // console.log('shadow root dom changed');
      setTimeout(function () {
        // console.log("zoho crm me hui halchal");
        replaceZohoCRMPHrefs(allhrefs);
        replaceZohoCRMPSkypes();
        replaceZohoCRMPAnother();
        replaceZohoCRMPAnother2();
        replaceZohoCRMPTable();
        addAutoDialerButton();
        replaceZohoCRMPNotes();
      }, 2000);
    });

    // $('body').bind('mousemove',function(e){
    //     console.log("Mousemove event triggered!");
    //     replacePropserworksTable2();
    //     replacePropserworksTable();
    //     replaceProsperworksOppurtunities();

    // });
    // $(function(){
    //     $('body').trigger('mousemove');
    // });
  }, 20000);
}

function setOnChangeForAudioDialer() {
  var test = window.location.href;
  // console.log(test);

  if (test.indexOf("/dialer") != -1 || test.indexOf("/dialpad_app_v2") != -1) {
    // console.log("dialer");
    $("#speaker-devices").on("change", function () {
      // console.log('Speaker Devices Changed');
      var deviceLabel = $(this).find(":selected").attr("label");

      chrome.runtime.sendMessage({
        message: "dialer_speaker_devices_changed",
        option: deviceLabel,
      });
    });

    $("#input-devices").on("change", function () {
      // console.log('Input Devices Changed');
      var deviceLabel = $(this).find(":selected").attr("label");
      chrome.runtime.sendMessage({
        message: "dialer_input_devices_changed",
        option: deviceLabel,
      });
    });

    $("#ringtone-devices").on("change", function () {
      // console.log('Ringtone Devices Changed');
      var deviceLabel = $(this).find(":selected").attr("label");
      chrome.runtime.sendMessage({
        message: "dialer_ringtone_devices_changed",
        option: deviceLabel,
      });
    });
  }
}

var hubspotDOM = "true";
observeDOM(document.body, function () {
  var hostname = window.location.hostname;
  setTimeout(function () {
    countnumbersfound = 0;
    if (hostname == "app.frontapp.com") {
      observeFrontAppDOMIFrame();
    }

    if (hostname == "app.leadsimple.com" && showiconsready == 1) {
      replaceLeadSimpleHrefs();
    } else if (hostname == "app.frontapp.com") {
      replaceFrontSpans(frontspans);
      replaceFrontCRMS();
    } else if (hostname.indexOf("capsulecrm") >= 0) {
      replaceCapsule();
    } else if (hostname.indexOf("gorgias") >= 0) {
      replaceGorgias();
    } else if (hostname.indexOf("quickbase.com") >= 0) {
      replaceQuickbase();
    } else if (hostname.indexOf("planetaltig.com") >= 0) {
      replacePlanetaltig();
    } else if (hostname.indexOf("salesmate") >= 0) {
      replaceSalesmate();
    } else if (hostname.indexOf("salesloft.com") >= 0) {
      replaceSalesloft();
    } else if (
      hostname.indexOf("gohighlevel.com") >= 0 ||
      hostname.indexOf("595marketing.com") >= 0
    ) {
      replaceGoHighLevel();
    } else if (hostname.indexOf("sugarcrm.com") >= 0) {
      replaceSugarCRM();
    } else if (hostname.indexOf("engagebay.com") >= 0) {
      replaceEngagebay();
    } else if (hostname.indexOf("leadsquared.com") >= 0) {
      replaceLeadsquared();
    } else if (hostname.indexOf("bloobirds.com") >= 0) {
      replaceBloobirds();
    } else if (hostname.indexOf("amocrm.com") >= 0) {
      replaceAmoCRM();
    } else if (
      hostname.indexOf("app.prosperworks.com") >= 0 ||
      hostname.indexOf("copper.com") >= 0 ||
      hostname == "boldheart.com" ||
      hostname == "myhometouch.com" ||
      hostname == "mail.google.com" ||
      hostname == "google.com" ||
      hostname == "www.lever.co" ||
      hostname == "lever.co" ||
      hostname == "trello.com"
    ) {
      replaceProsperworksActivity();
      replacePropserworksTable();
      replacePropserworksTable2();

      replaceProsperworksOppurtunities();
    } else if (
      hostname == "crmplus.zoho.com" ||
      hostname == "crmplus.zoho.in" ||
      hostname == "crmplus.zoho.com.au" ||
      hostname == "crmplus.zoho.eu" ||
      hostname.indexOf("zoho.com") >= 0 ||
      hostname.indexOf("zoho.in") >= 0 ||
      hostname.indexOf("zoho.com.au") >= 0 ||
      hostname.indexOf("zoho.eu") >= 0
    ) {
      var zohourl =
        window.location != window.parent.location
          ? document.referrer
          : document.location.href;
      if (zohourl.indexOf("one.zoho") < 0) {
        attachzohoCRmplistener();
      }
      replaceZohoCRMPHrefs(allhrefs);
      replaceZohoAnother();
      replaceZohoAnother2();
      replaceZohoCRMNotesLink();
      replaceZohoCRMPAnother();
      replaceZohoCRMPAnother2();
      replaceZohoCRMPNotes();
      replaceZohoCRMPSkypes();
      replaceZohoCRMPTable();
      replaceZohoDeskLinks();
      replaceZohoNotes();
      replaceZohoSkypes();
      replaceZohoTable();
      addAutoDialerButton();
    } else if (hostname.indexOf("freshdesk.com") >= 0) {
      replaceFreshdeskSpans(freshdeskspans);
      replaceFDCRM();
    } else if (
      hostname.indexOf("freshsales") >= 0 ||
      hostname.indexOf("freshworks") >= 0
    ) {
      replaceFreshsales();
    } else if (hostname.indexOf("intercom.com") >= 0) {
      replaceIntercomSpans(intercomspans);
      replaceIntercomSpans2();
    } else if (hostname.indexOf("hubspot.com") >= 0) {
      if (hubspotDOM == "true") {
        replaceHubspotInputs(hubspotinputs);
        replaceHubspotTable();
        replaceHubspotTable2();
        replaceHubspotWorkflows(hubspotinputs);
        hubspotcompanyInContact();

        hubspotDOM = "false";
        setTimeout(function () {
          hubspotDOM = "true";
        }, 1000);
      }
    } else if (
      hostname.indexOf("infusionsoft") >= 0 ||
      hostname.indexOf("keap") >= 0
    ) {
      replaceInfusionSoft();
      replaceInfusionsoftLis(infusionsoftlis);
      replaceInfusionsoftNotes();
      replaceInfustionsoftInputs1(infusionsoftinputs1);
      replaceInfustionsoftInputs2(infusionsoftinputs2);
      replaceIFS();
    } else if (hostname.indexOf("syncroteam") >= 0) {
      replaceSynchroteamDescription();
      replaceSynchroteamSip(synchrosip);
    } else if (hostname.indexOf("groove") >= 0) {
      replaceGrooveParagraphs(grooveparagraphs);
    } else if (hostname.indexOf("force") >= 0) {
      replaceSalesforcephones(salesforcephones);
      if (salesforce_addon == true) {
        addADbtnSalesforce();
      }
      checkSalesforceAddon();
    } else if (hostname.indexOf("zendesk.com") >= 0) {
      replaceZendeskNumbers();
    } else if (hostname.indexOf("app.futuresimple.com") >= 0) {
      replaceZsell();
    } else if (hostname.indexOf("kustomer") >= 0) {
      replaceKustomerNumbers();
    } else if (hostname.indexOf("suitecrm") >= 0) {
      replaceSuiteCRMtd();
    } else if (hostname.indexOf("propertyware") >= 0) {
      replacePWCRM();
    } else if (hostname.indexOf("close.com") >= 0) {
      replaceOP();
    } else if (hostname.indexOf("helpscout") >= 0) {
      replaceHelpScout();
    } else if (hostname.indexOf("findmetrodchomes.com") >= 0) {
      replace_harley_dufek();
    } else if (hostname.indexOf("ontraport.com") >= 0) {
      replaceOntraport();
    } else if (hostname.indexOf("outreach.io") >= 0) {
      replaceoutreach();
    } else if (
      hostname.indexOf("pipedrive.com") >= 0 ||
      hostname.indexOf("nocrm") >= 0 ||
      hostname.indexOf("teamwave") >= 0
    ) {
      replacePipedrive();
    } else if (hostname.indexOf("lessannoyingcrm") >= 0) {
      replaceLA();
    } else if (hostname.indexOf("podio") >= 0) {
      replacePodio();
      replacePodioProfile();
    } else if (hostname.indexOf("reamaze") >= 0) {
      replaceReamaze();
    } else if (hostname.indexOf("nimble") >= 0) {
      observeNimbleDOMIFrame();
      replaceNimbleCallto();
    } else if (hostname.indexOf("onepagecrm.com") >= 0) {
      replaceOnePageCRM();
      replaceOPCSkypes();
    }

    if (hostname != "app.leadsimple.com" && showiconsready == 1) {
      replaceHrefs(allhrefs);
      replaceDoubleHrefs(alldoublehrefs);
      replaceDoubleCRMPHrefs(alldoublehrefs);
      replaceActiveCampaign();
      replaceInfusionsoftNotesLinks();
      replaceDeskDivs(deskdivs);
      addFrontCompose();
      // replaceCapsule();
    }
  }, 2000);
});

checkcookie();
// checkmic();

var countcheck = 0;

var hostname = window.location.hostname;

countnumbersfound = 0;
if (hostname == "app.frontapp.com") {
  observeFrontAppDOMIFrame();
}
if (hostname == "app.leadsimple.com" && showiconsready == 1) {
  replaceLeadSimpleHrefs();
} else if (hostname == "justcall.io") {
  setOnChangeForAudioDialer();
} else if (hostname == "app.frontapp.com") {
  replaceFrontSpans(frontspans);
  replaceFrontCRMS();
} else if (hostname.indexOf("capsulecrm") >= 0) {
  replaceCapsule();
} else if (hostname.indexOf("gorgias") >= 0) {
  replaceGorgias();
} else if (hostname.indexOf("quickbase.com") >= 0) {
  replaceQuickbase();
} else if (hostname.indexOf("planetaltig.com") >= 0) {
  replacePlanetaltig();
} else if (hostname.indexOf("salesmate") >= 0) {
  replaceSalesmate();
} else if (hostname.indexOf("salesloft.com") >= 0) {
  replaceSalesloft();
} else if (
  hostname.indexOf("gohighlevel.com") >= 0 ||
  hostname.indexOf("595marketing.com") >= 0
) {
  replaceGoHighLevel();
} else if (hostname.indexOf("sugarcrm.com") >= 0) {
  replaceSugarCRM();
} else if (hostname.indexOf("engagebay.com") >= 0) {
  replaceEngagebay();
} else if (hostname.indexOf("leadsquared.com") >= 0) {
  replaceLeadsquared();
} else if (hostname.indexOf("bloobirds.com") >= 0) {
  replaceBloobirds();
} else if (hostname.indexOf("amocrm.com") >= 0) {
  replaceAmoCRM();
} else if (
  hostname.indexOf("app.prosperworks.com") >= 0 ||
  hostname.indexOf("copper.com") >= 0 ||
  hostname == "boldheart.com" ||
  hostname == "myhometouch.com" ||
  hostname == "mail.google.com" ||
  hostname == "google.com" ||
  hostname == "www.lever.co" ||
  hostname == "lever.co" ||
  hostname == "trello.com"
) {
  replaceProsperworksActivity();
  replacePropserworksTable();
  replacePropserworksTable2();
  replaceProsperworksOppurtunities();
  attachlistener();
} else if (
  hostname == "crmplus.zoho.com" ||
  hostname == "crmplus.zoho.in" ||
  hostname == "crmplus.zoho.com.au" ||
  hostname == "crmplus.zoho.eu" ||
  hostname.indexOf("zoho.com") >= 0 ||
  hostname.indexOf("zoho.in") >= 0 ||
  hostname.indexOf("zoho.com.au") >= 0 ||
  hostname.indexOf("zoho.eu") >= 0
) {
  var zohourl =
    window.location != window.parent.location
      ? document.referrer
      : document.location.href;
  if (zohourl.indexOf("one.zoho") < 0) {
    attachzohoCRmplistener();
  }
  replaceZohoCRMPHrefs(allhrefs);
  replaceZohoAnother();
  replaceZohoAnother2();
  replaceZohoCRMNotesLink();
  replaceZohoCRMPAnother();
  replaceZohoCRMPAnother2();
  replaceZohoCRMPNotes();
  replaceZohoCRMPSkypes();
  replaceZohoCRMPTable();
  replaceZohoDeskLinks();
  replaceZohoNotes();
  replaceZohoSkypes();
  replaceZohoTable();
  addAutoDialerButton();
} else if (hostname == "app.freshdesk.com") {
  replaceFreshdeskSpans(freshdeskspans);
  replaceFDCRM();
} else if (
  hostname.indexOf("freshsales") >= 0 ||
  hostname.indexOf("freshworks") >= 0
) {
  replaceFreshsales();
} else if (hostname.indexOf("intercom.com") >= 0) {
  replaceIntercomSpans(intercomspans);
  replaceIntercomSpans2();
} else if (hostname.indexOf("hubspot.com") >= 0) {
  replaceHubspotInputs(hubspotinputs);
  replaceHubspotTable();
  replaceHubspotTable2();
  replaceHubspotWorkflows(hubspotinputs);
  hubspotcompanyInContact();
} else if (
  hostname.indexOf("infusionsoft") >= 0 ||
  hostname.indexOf("keap") >= 0
) {
  replaceInfusionSoft();
  replaceInfusionsoftLis(infusionsoftlis);
  replaceInfusionsoftNotes();
  replaceInfustionsoftInputs1(infusionsoftinputs1);
  replaceInfustionsoftInputs2(infusionsoftinputs2);
  replaceIFS();
} else if (hostname.indexOf("syncroteam") >= 0) {
  replaceSynchroteamDescription();
  replaceSynchroteamSip(synchrosip);
} else if (hostname.indexOf("groove") >= 0) {
  replaceGrooveParagraphs(grooveparagraphs);
} else if (hostname.indexOf("force") >= 0) {
  replaceSalesforcephones(salesforcephones);
  if (salesforce_addon == true) {
    addADbtnSalesforce();
  }
  checkSalesforceAddon();
} else if (hostname.indexOf("zendesk") >= 0) {
  replaceZendeskNumbers();
} else if (hostname.indexOf("app.futuresimple.com") >= 0) {
  replaceZsell();
} else if (hostname.indexOf("kustomer") >= 0) {
  replaceKustomerNumbers();
} else if (hostname.indexOf("suitecrm") >= 0) {
  replaceSuiteCRMtd();
}
// checkcookie();

// replaceNimbleDetail();
else if (hostname.indexOf("propertyware") >= 0) {
  replacePWCRM();
} else if (hostname.indexOf("close.com") >= 0) {
  replaceOP();
} else if (hostname.indexOf("helpscout") >= 0) {
  replaceHelpScout();
} else if (hostname.indexOf("findmetrodchomes.com") >= 0) {
  replace_harley_dufek();
} else if (hostname.indexOf("ontraport.com") >= 0) {
  replaceOntraport();
} else if (hostname.indexOf("outreach.io") >= 0) {
  replaceoutreach();
} else if (
  hostname.indexOf("pipedrive.com") >= 0 ||
  hostname.indexOf("nocrm") >= 0 ||
  hostname.indexOf("teamwave") >= 0
) {
  replacePipedrive();
} else if (hostname.indexOf("lessannoyingcrm") >= 0) {
  replaceLA();
} else if (hostname.indexOf("podio") >= 0) {
  replacePodio();
  replacePodioProfile();
} else if (hostname.indexOf("reamaze") >= 0) {
  replaceReamaze();
} else if (hostname.indexOf("nimble") >= 0) {
  observeNimbleDOMIFrame();
  replaceNimbleCallto();
} else if (hostname.indexOf("onepagecrm.com") >= 0) {
  replaceOnePageCRM();
  replaceOPCSkypes();
}
if (hostname != "app.leadsimple.com" && showiconsready == 1) {
  replaceHrefs(allhrefs);
  replaceDoubleHrefs(alldoublehrefs);
  replaceDoubleCRMPHrefs(alldoublehrefs);
  replaceActiveCampaign();
  replaceInfusionsoftNotesLinks();
  replaceDeskDivs(deskdivs);
  addFrontCompose();
  // replaceCapsule();
}
