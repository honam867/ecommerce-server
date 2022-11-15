// const mongoose = require('mongoose');
// const { USER_ROLES } = require('@utils/const');
// const ThrowReturn = require('@core/throwreturn');
// const models = require('@models');
// const { deny } = require('./role');

// function getParam(req, name) {
//     const objId = req.params[name] || req.query[name] || req.body[name];
//     if (objId && mongoose.Types.ObjectId.isValid(objId)) return objId;
//     return null;
// }

// async function blockAccess(blockId, user) {
//     const host = await models.HOST.findOne({
//         _id: user._id,
//         blockIds: blockId,
//     });
//     if (!host) {
//         deny();
//     }
// }

// function checkBlockId(req) {
//     const blockId = getParam(req, 'blockId');
//     if (blockId) {
//         return blockAccess(blockId, req.decoded.user);
//     }
// }

// async function checkRoomId(req) {
//     const roomId = getParam(req, 'roomId');
//     if (roomId) {
//         const room = await models.ROOM.findById(roomId).select('blockId');
//         if (room) {
//             return blockAccess(room.blockId, req.decoded.user);
//         }
//     }
// }

// async function checkListingId(req) {
//     const listingId = getParam(req, 'listingId');
//     if (listingId) {
//         const listing = await models.LISTING.findById(listingId).select('blockId');
//         if (listing) {
//             return blockAccess(listing.blockId, req.decoded.user);
//         }
//     }
// }

// async function checkBookingId(req) {
//     const bookingId = getParam(req, 'bookingId');
//     if (bookingId) {
//         const booking = await models.BOOKING.findById(bookingId).select('blockId');
//         if (booking) {
//             return blockAccess(booking.blockId, req.decoded.user);
//         }
//     }
// }

function hostRestriction(req) {
    // if (req.decoded.user.role === USER_ROLES.ADMIN) {
    //     return;
    // }
    // return Promise.all([checkBlockId(req), checkRoomId(req), checkListingId(req), checkBookingId(req)]);
}

module.exports = {
    hostRestriction,
};
