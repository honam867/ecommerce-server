const mongoose = require('mongoose');
const _ = require('lodash');

const router = require('@core/router').Router();
const ThrowReturn = require('@core/throwreturn');
const userutils = require('@utils/userutils');
const { USER_ROLES_PERMISSONS } = require('@utils/const');
const models = require('@models');

const PUBLIC_FIELDS = ['_id', 'username', 'role', 'name', 'address', 'contact', 'avatar'];

async function authenticate(req, res) {
    const { username, password } = req.body;
    const user = await models.USER.findOne({ username });
    const hashPasswords = userutils.hashPassword(password);
    console.log('🚀 ~ file: user.router.js ~ line 19 ~ authenticate ~ hashPasswords', hashPasswords);

    if (!user || user.password !== hashPasswords) {
        throw new ThrowReturn('Username or password is incorrect.');
    }
    if (!user.enable) {
        throw new ThrowReturn('User has been disabled.');
    }

    const token = await user.generateToken();
    await user.populate('avatar').execPopulate();

    res.sendData({ user: _.pick(user, PUBLIC_FIELDS), token });
}

async function getTabs(req, res) {
    const { user } = req.decoded;

    const roleGroup = await models.ROLE_GROUP.findOne({ role: user.role });
    await user.populate('avatar').execPopulate();

    res.sendData({ groups: roleGroup.groups, tabs: roleGroup.tabs, user: _.pick(user, PUBLIC_FIELDS) });
}

async function changePassword(req, res) {
    const { oldPassword, newPassword } = req.body;
    const user = await models.USER.findById(req.decoded.user._id);
    if (!user.equals('password', oldPassword)) {
        throw new ThrowReturn('Old passworld incorrect');
    }
    if (!userutils.validatePassword(newPassword)) {
        throw new ThrowReturn('Password is not valid');
    }

    await user.changePassword(newPassword);

    res.sendData();
}

async function updateNotiKey(req, res) {
    const userId = req.decoded.user._id;
    const { deviceName, notiId } = req.query;
    await models.USER_DEVICE.updateOrCreate(userId, deviceName, notiId);
    res.sendData();
}

async function getUserInfo(req, res) {
    const { user } = req.decoded;
    await user.populate('avatar').execPopulate();

    res.sendData({ user: _.pick(user, PUBLIC_FIELDS) });
}

async function updateUserInfo(req, res) {
    const { _id } = req.decoded.user;
    const user = await models.USER.updateUserInfo(_id, req.body, req.decoded.user._id);
    await user.populate('avatar').execPopulate();

    res.sendData({ user: _.pick(user, _.keys(req.body)) });
}

async function getManageUser(req, res) {
    const { user } = req.decoded;
    const { blockIds, account, role } = req.query;
    const users = await models.USER.getManageUser(
        user._id,
        user.role,
        role ? role.split(',') : role,
        account !== 'true',
        blockIds,
    );
    res.sendData({ users });
}

async function getCalling(req, res) {
    const { user } = req.decoded;

    const role = await models.ROLE_GROUP.findOne({ role: user.role });
    if (!role) throw new ThrowReturn('Role not found');

    const roles = await models.ROLE_GROUP.find({
        level: { $gte: role.level },
        'groups.name': USER_ROLES_PERMISSONS.CALLING,
    })
        .select('role')
        .then(r => r.map(v => v.role));

    const users = await models.USER.aggregate([
        {
            $match: {
                role: { $in: roles },
                enable: true,
            },
        },
        {
            $lookup: {
                from: models.SERVICE_STRINGEE_USER.collection.name,
                localField: '_id',
                foreignField: 'userId',
                as: 'config',
            },
        },
        {
            $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$config', 0] }, '$$ROOT'] } },
        },
        { $project: { config: 0 } },
    ]);
    res.sendData({ users });
}

async function reorder(req, res) {
    const { users } = req.body;
    await Promise.all(users.map(user => models.USER.updateOne({ _id: user._id }, { $set: { order: user.order } })));
    res.sendData();
}

async function updateCalling(req, res) {
    const { userId } = req.params;
    const { order, ...data } = req.body;
    if (order !== undefined) {
        const user = await models.USER.findById(userId);
        user.order = order;
        user.save();
    }
    const objUserId = mongoose.Types.ObjectId(userId);
    const user = await models.SERVICE_STRINGEE_USER.findOne({ userId: objUserId });
    if (user) {
        return res.sendData(
            await models.SERVICE_STRINGEE_USER.findOneAndUpdate(
                {
                    userId: objUserId,
                },
                data,
                { new: true },
            ),
        );
    }
    const newUser = await models.SERVICE_STRINGEE_USER.create({ userId: objUserId, ...data });
    res.sendData(newUser);
}

router.postS('/auth', authenticate, false);
router.getS('/tabs', getTabs);
router.postS('/changePassword', changePassword);
router.putS('/noti', updateNotiKey);
router.getS('/', getUserInfo);
router.putS('/', updateUserInfo);
router.getS('/getManageUser', getManageUser);

router.getS('/calling', getCalling);
router.putS('/calling/:userId', updateCalling);
router.postS('/reorder', reorder);

const activity = {
    USER_CHANGE_PASSWORD: {
        key: 'changePassword',
    },
    USER_UPDATE_INFO: {
        key: '/',
        exact: true,
        method: 'PUT',
    },
    USER_UPDATE_CALL_LIST: {
        key: '/calling',
        method: 'PUT',
    },
};

module.exports = { router, activity };
