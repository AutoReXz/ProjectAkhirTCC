/**
 * Helper functions for database operations
 */
const { Op } = require('sequelize');

/**
 * Create pagination parameters for Sequelize queries
 * @param {Object} query - Request query parameters
 * @param {number} query.page - Page number (default: 1)
 * @param {number} query.limit - Items per page (default: 10)
 * @returns {Object} Pagination parameters for Sequelize
 */
const getPaginationParams = (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const offset = (page - 1) * limit;
  
  return {
    limit,
    offset
  };
};

/**
 * Format pagination metadata for response
 * @param {Object} data - Data from Sequelize findAndCountAll
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {Object} Pagination metadata
 */
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: items } = data;
  const currentPage = page ? +page : 1;
  const totalPages = Math.ceil(totalItems / limit);
  
  return {
    totalItems,
    items,
    totalPages,
    currentPage
  };
};

/**
 * Process search and filter parameters for Sequelize query
 * @param {Object} query - Request query parameters
 * @param {Array} searchFields - Fields to search in
 * @param {Object} filterOptions - Filter options
 * @returns {Object} Where clause for Sequelize
 */
const getSearchAndFilterParams = (query, searchFields = [], filterOptions = {}) => {
  const whereClause = {};
  
  // Process search query
  if (query.search && searchFields.length > 0) {
    whereClause[Op.or] = searchFields.map(field => ({
      [field]: { [Op.like]: `%${query.search}%` }
    }));
  }
  
  // Process filters
  Object.keys(filterOptions).forEach(key => {
    if (query[key] && filterOptions[key]) {
      whereClause[filterOptions[key]] = query[key];
    }
  });
  
  return whereClause;
};

module.exports = {
  getPaginationParams,
  getPagingData,
  getSearchAndFilterParams
};
