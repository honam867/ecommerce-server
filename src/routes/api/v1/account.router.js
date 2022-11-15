const model = require('@models');
const ThrowReturn = require('@core/throwreturn');
const router = require('@core/router').Router();
const userutils = require('@utils/userutils');

async function addAccount(req, res) {
    if (!req.body.password) {
        throw new ThrowReturn('Passwords must not be empty');
    }
    if (!req.body.username) {
        throw new ThrowReturn('Username must not be empty');
    }

    // create user
    const userId = req.decoded.user._id;
    const user = await model.USER.createNewAccount(req.body, userId);

    // create hosting
    const userHost = await model.HOST.findById(userId);
    req.body.blockIds = (userHost && userHost.blockIds) || [];
    const host = await model.HOST.createNewHost(user._id, req.body);

    const group = await model.USER_GROUP.findOne({ 'users.userId': userId }).select('_id');
    if (group) {
        await model.USER_GROUP.updateOne(
            {
                _id: group._id,
            },
            {
                $push: {
                    users: {
                        userId: user._id,
                        joinAt: new Date(),
                        acceptedBy: userId,
                    },
                },
            },
        );
    }

    res.sendData({ user, host });
}

async function getAccounts(req, res) {
    const { start = 0, limit = 20 } = req.query;
    const result = await model.USER.list(start, limit);
    res.sendData(result);
}

async function changeRole(req, res) {
    const { userId } = req.params;
    if (userId === req.decoded.user._id.toString()) {
        throw new ThrowReturn("Can't change your own role");
    }
    const { role } = req.body;
    if (role === req.decoded.user.role) {
        throw new ThrowReturn("Can't change to this role");
    }
    const user = await model.USER.findById(userId);
    if (!user) {
        throw new ThrowReturn('User not found');
    }

    user.role = role;
    await user.save();

    res.sendData({ user });
}

async function resetPassword(req, res) {
    const { userId } = req.params;
    const resetUser = await model.USER.findById(userId);
    if (!resetUser) {
        throw new ThrowReturn('User not found');
    }

    const newPassword = userutils.generatePassword();
    await resetUser.changePassword(userutils.md5Password(newPassword));

    res.sendData({ newPassword });
}

async function lockAccount(req, res) {
    const { userId } = req.params;
    const { enable = true } = req.body;
    await model.USER.findByIdAndUpdate(userId, { $set: { enable } });
    res.sendData();
}

async function getActivity(req, res) {
    if (!req.query.username) {
        const roles = await model.ROLE_GROUP.getUnderRoles(req.decoded.user.role, true, true);
        req.query.username = await model.USER.find({ role: { $in: roles } })
            .select('username')
            .then(users => users.map(u => u.username));
    }
    const data = await model.USER_LOG.getLogV2(req.query, req.decoded.user);

    res.sendData(data);
}

router.putS('/', addAccount);
router.getS('/', getAccounts);
router.putS('/changRole/:userId', changeRole);
router.postS('/resetPassword/:userId', resetPassword);
router.postS('/lock/:userId', lockAccount);
router.getS('/getActivity', getActivity);

const activity = {
    ACCOUNT_CREATE: {
        key: '/',
        exact: true,
        method: 'PUT',
    },
    ACCOUNT_CHANGE_ROLE: {
        key: 'changRole',
        method: 'PUT',
    },
    ACCOUNT_RESET_PASSWORD: {
        key: 'resetPassword',
    },
    ACCOUNT_LOCK: {
        key: 'lock',
    },
};

module.exports = { router, activity };
