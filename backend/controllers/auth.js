const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        // Enforce Admin-only access
        if (!user || user.role !== 'admin' || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials or unauthorized' });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (e) { res.status(500).json({ message: e.message }); }
};
