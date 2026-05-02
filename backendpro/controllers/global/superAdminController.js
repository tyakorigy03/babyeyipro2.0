const { School, User, Role, Agent, AgentStation, sequelize } = require('../../models');

// @desc    Onboard a completely new School to the Platform
// @route   POST /api/platform/schools/onboard
// @access  SuperAdmin Only
const onboardSchool = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { name, domain, address, admin_email, admin_password, admin_name } = req.body;

    // 1. Create the School Tenant
    const school = await School.create({
      name,
      domain,
      address,
      status: 'Active'
    }, { transaction: t });

    // 2. Setup Foundation Data (Default Roles)
    const adminRole = await Role.create({
      school_id: school.id,
      name: 'SchoolAdmin',
      description: 'Master administrator for the school',
      is_system: true,
      permissions: { all: true }
    }, { transaction: t });

    // 3. Create the School's Initial Admin User
    const adminUser = await User.create({
      school_id: school.id,
      role_id: adminRole.id,
      name: admin_name,
      email: admin_email,
      password: admin_password, // Will be hashed by model hook
      status: 'Active'
    }, { transaction: t });

    await t.commit();

    res.status(201).json({
      status: 'success',
      message: `School '${name}' successfully onboarded.`,
      data: {
        school_id: school.id,
        admin_email: adminUser.email
      }
    });

  } catch (error) {
    await t.rollback();
    console.error('School Onboarding Error:', error);
    res.status(500).json({ message: 'Server error during school onboarding' });
  }
};

// @desc    Register a new Global Agent and assign them to a Station
// @route   POST /api/platform/agents/register
// @access  SuperAdmin Only
const registerAgent = async (req, res) => {
  try {
    const { user_id, station_id } = req.body;

    // Note: This user_id should ideally belong to a user where school_id is NULL
    const agent = await Agent.create({
      user_id,
      station_id,
      wallet_balance: 0,
      commission_earned: 0,
      status: 'Active'
    });

    res.status(201).json({
      status: 'success',
      data: agent
    });

  } catch (error) {
    console.error('Agent Registration Error:', error);
    res.status(500).json({ message: 'Server error during agent registration' });
  }
};

module.exports = {
  onboardSchool,
  registerAgent
};
