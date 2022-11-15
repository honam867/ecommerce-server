const events = require('events');

const eventEmitter = new events.EventEmitter();

const EVENTS = {
    RESERVATION: 'reservation',
    RESERVATION_UPDATE: 'reservation_update',
    RESERVATION_ERROR: 'reservation_error',
    RESERVATION_CANCEL: 'reservation_cancel',

    INQUIRY: 'inquiry',
    UPDATE_AUTOMATION: 'update_automation',

    OTT_MSG: 'ott_msg',
    UPDATE_OTA: 'update_ota',

    CREATE_PAYOUT: 'create_payout',
    UPDATE_PAYOUT: 'update_payout',

    UPDATE_CALENDAR: 'update_calendar',

    CAMERA_RECOGNITION: 'camera_recognition',

    TASK_CREATE: 'task_create',
    BANKING_SMS: 'banking_sms',
    MESSAGE_SEND: 'message_send',
    MESSAGE_RECEIVE: 'message_receive',

    SEND_LOCKER_COMMAND: 'send_locker_command',
    SEND_LOCKER_CALLBACK: 'send_locker_callback',
};

module.exports = {
    EVENTS,
    eventEmitter,
};
