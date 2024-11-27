// controllers/userController.js
// const { Sequelize, Op, fn, col, literal } = require('sequelize');
const asyncHandler = require(`express-async-handler`);
const { Transaction } = require('../Associations/Association');
const { Sequelize, Op, fn, col, literal } = require('sequelize');

exports.getTransaction = asyncHandler(async (req, res) => {

    // Fetch a single transaction that matches the provided ID and userID
    const transaction = await Transaction.findOne({
        where: {
            id: req.params.id,
            userID: req.user.id
        }
    });

    // If no transaction is found, return a 404 error
    if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found for this user' });
    }

    // Return the transaction
    res.status(200).json({ transaction });
});

exports.getTransactions = asyncHandler(async (req, res) => {

    // Get the page number and page size from the request query (default values are set if not provided)
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1
    const pageSize = parseInt(req.query.pageSize, 10) || 10; // Default to 10 items per page

    // Calculate the offset for pagination
    const offset = (page - 1) * pageSize;

    // Fetch all transactions for the authenticated user with pagination
    const { count, rows: transactions } = await Transaction.findAndCountAll({
        where: {
            userID: req.user.id
        },
        limit: pageSize,  // Number of records to return
        offset,           // Starting point
    });

    // Check if any transactions were found
    if (transactions.length === 0) {
        return res.status(404).json({ message: 'No transactions found for this user' });
    }

    // Calculate the total number of pages
    const totalPages = Math.ceil(count / pageSize);

    // Return the paginated transactions and meta information
    res.status(200).json({
        currentPage: page,
        totalPages,
        pageSize,
        totalTransactions: count,
        transactions
    });
});

exports.getIncome = asyncHandler(async (req, res) => {
    const { year } = req.query;

    if (!year) {
        return res.status(400).json({ message: "Year query parameter is required" });
    }

    // Query to group by month and calculate the total amount for each month
    const transactions = await Transaction.findAll({
        attributes: [
            [Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'month'],
            [Sequelize.fn('SUM', Sequelize.col('amount')), 'total']
        ],
        where: {
            createdAt: {
                [Sequelize.Op.between]: [`${year}-01-01`, `${year}-12-31`]
            }
        },
        group: ['month'],
        order: [['month', 'ASC']]
    });

    // Create a response for all 12 months
    const monthlyIncome = Array(12).fill(0).map((_, i) => {
        const monthData = transactions.find(t => t.dataValues.month === i + 1);
        return {
            month: i + 1,
            total: monthData ? monthData.dataValues.total : 0
        };
    });

    res.status(200).json(monthlyIncome);
});
