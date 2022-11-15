const { USER_ROLES_PERMISSONS } = require('@utils/const');
const ThrowReturn = require('@core/throwreturn');
const router = require('@core/router').Router();
const model = require('@models');

async function getPermissions(req, res) {
    const permissions = await model.ROLE_PERMISSION.find({ name: { $ne: USER_ROLES_PERMISSONS.ANONYMOUS } })
        .select('name description')
        .sort({ name: 1 });

    res.sendData({ permissions });
}

async function getRoleGroup(req, res) {
    const { role } = req.decoded.user;
    const roles = await model.ROLE_GROUP.getUnderRoles(role, false);

    res.sendData({ roles });
}

async function updateRoleGroup(req, res) {
    const { id } = req.params;
    const role = await model.ROLE_GROUP.findById(id);
    if (!role) {
        throw new ThrowReturn('ROLE_GROUP not found');
    }
    if (role.role === USER_ROLES_PERMISSONS.ANONYMOUS) {
        throw new ThrowReturn('No update for anonymous role');
    }

    role.groups = req.body.groups || role.groups;
    role.description = req.body.description || role.description;
    role.tabs = req.body.tabs || role.tabs;
    role.tasks = req.body.tasks || role.tasks;

    await role.save();
    res.sendData({ role });
}

async function addRoleGroup(req, res) {
    const roleGroup = await model.ROLE_GROUP.findOne({ role: req.decoded.user.role }).select('level');
    const role = new model.ROLE_GROUP(req.body);
    role.level = (roleGroup.level || 1) + 1;
    await role.save();
    res.sendData({ role });
}

router.getS('/permissions', getPermissions, true);
router.getS('/', getRoleGroup, true);
router.putS('/', addRoleGroup, true);
router.putS('/:id', updateRoleGroup, true);

module.exports = { router };
