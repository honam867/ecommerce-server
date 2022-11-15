const _ = require('lodash');
const moment = require('moment');

const { WORK_NOTE_STATUS } = require('@utils/const');
const router = require('@core/router').Router();
const ThrowReturn = require('@core/throwreturn');
const model = require('@models');

async function list(bodyQuery, otherQuery = null) {
    let { blockId, roomTypeId, from, to, status, start, limit } = bodyQuery;

    from = from && moment(from).isValid() ? new Date(from).minTimes() : null;
    to = to && moment(to).isValid() ? new Date(to).maxTimes() : null;
    start = parseInt(start) || 0;
    limit = parseInt(limit) || 20;

    const query = {
        ...otherQuery,
        status: { $ne: WORK_NOTE_STATUS.CLOSED },
    };
    if (from) {
        _.set(query, ['createdAt', '$gte'], from);
    }
    if (to) {
        _.set(query, ['createdAt', '$lte'], to);
    }
    if (blockId) {
        query.blockId = blockId;
    }
    if (roomTypeId) {
        query.roomTypeId = roomTypeId;
    }
    if (status) {
        query.status.$eq = status;
    }

    const [data, total] = await Promise.all([
        model.WORK_NOTE.find(query)
            .sort({ createdAt: -1 })
            .skip(start)
            .limit(limit)
            .populate('createdBy', 'username name')
            .populate('bookingId', 'otaName otaBookingId')
            .populate('blockId', 'id name')
            .populate('roomTypeId', 'id name displayName')
            .populate('log.user', 'name username')
            .populate('images'),
        model.WORK_NOTE.countDocuments(query),
    ]);

    return {
        data,
        total,
    };
}

async function create(note) {
    delete note.log;
    const data = await model.WORK_NOTE.create(note);
    return data;
}

async function update(id, user, data) {
    const note = await model.WORK_NOTE.findById(id);
    if (!note) throw new ThrowReturn('Note not found!');

    if (note.status === WORK_NOTE_STATUS.CLOSED) throw new ThrowReturn('This note is closed!');

    const oldData = _.pick(note, _.keys(data));
    Object.assign(note, data);

    note.log.push({ user, date: new Date(), oldData, newData: data });
    await note.save();

    return note;
}

async function getNotes(req, res) {
    const data = await list(req.query, { type: { $in: [1, null] } });
    res.sendData(data);
}

async function getHostNotes(req, res) {
    const data = await list(req.query, { type: 2 });
    res.sendData(data);
}

async function getNote(req, res) {
    const { id } = req.params;
    const data = await model.WORK_NOTE.findById(id)
        .populate('createdBy', 'username name')
        .populate('bookingId', 'otaName otaBookingId')
        .populate('blockId', 'name')
        .populate('images')
        .populate('log.user', 'name username');

    res.sendData(data);
}

async function addNote(req, res) {
    req.body.createdBy = req.decoded.user._id;
    const data = await create(req.body);

    res.sendData(data);
}

async function addHostNote(req, res) {
    const note = req.body;
    note.createdBy = req.decoded.user._id;
    note.type = [2];

    const data = await create(note);

    res.sendData(data);
}

async function updateNote(req, res) {
    const { id } = req.params;
    const user = req.decoded.user._id;
    const data = req.body;

    const note = await update(id, user, data);
    res.sendData(_.pick(note, _.keys(data)));
}

router.getS('/', getNotes);
router.getS('/host', getHostNotes);

router.getS('/:id', getNote);

router.postS('/host', addHostNote);
router.postS('/', addNote);
router.putS('/:id', updateNote);

module.exports = { router };
