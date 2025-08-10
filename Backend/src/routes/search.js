import express from 'express';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';

const router = express.Router();

// @route   GET /api/search/doctors
// @desc    Advanced doctor search with multiple filters
// @access  Public
router.get('/doctors', async (req, res) => {
  try {
    const {
      // Search terms
      q, // general search query
      specialization,
      location, // province, district, or municipality

      // Filters
      minRating = 0,
      maxRating = 5,
      minExperience = 0,
      maxFee,
      consultationType = 'video',
      languages,
      availableToday = false,
      emergency = false,

      // Sorting
      sortBy = 'averageRating',
      sortOrder = 'desc',

      // Pagination
      page = 1,
      limit = 12
    } = req.query;

    // Build aggregation pipeline
    const pipeline = [];

    // Match verified doctors
    pipeline.push({
      $match: {
        verificationStatus: 'verified'
      }
    });

    // Join with User collection
    pipeline.push({
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }
    });

    pipeline.push({ $unwind: '$user' });

    // Match active users only
    pipeline.push({
      $match: {
        'user.isActive': true,
        'user.userType': 'doctor'
      }
    });

    // Build search conditions
    const searchConditions = [];

    // General search query
    if (q) {
      searchConditions.push({
        $or: [
          { 'user.firstName': { $regex: q, $options: 'i' } },
          { 'user.lastName': { $regex: q, $options: 'i' } },
          { primarySpecialization: { $regex: q, $options: 'i' } },
          { secondarySpecializations: { $regex: q, $options: 'i' } },
          { bio: { $regex: q, $options: 'i' } },
          { specialistIn: { $regex: q, $options: 'i' } }
        ]
      });
    }

    // Specialization filter
    if (specialization) {
      searchConditions.push({
        $or: [
          { primarySpecialization: specialization },
          { secondarySpecializations: { $in: [specialization] } }
        ]
      });
    }

    // Location filter
    if (location) {
      searchConditions.push({
        $or: [
          { 'user.address.province': { $regex: location, $options: 'i' } },
          { 'user.address.district': { $regex: location, $options: 'i' } },
          { 'user.address.municipality': { $regex: location, $options: 'i' } }
        ]
      });
    }

    // Rating filter
    if (minRating > 0 || maxRating < 5) {
      searchConditions.push({
        averageRating: {
          $gte: parseFloat(minRating),
          $lte: parseFloat(maxRating)
        }
      });
    }

    // Experience filter
    if (minExperience > 0) {
      searchConditions.push({
        totalExperience: { $gte: parseInt(minExperience) }
      });
    }

    // Fee filter
    if (maxFee) {
      searchConditions.push({
        [`consultationFee.${consultationType}`]: { $lte: parseInt(maxFee) }
      });
    }

    // Language filter
    if (languages) {
      const languageArray = Array.isArray(languages) ? languages : [languages];
      searchConditions.push({
        languagesSpoken: { $in: languageArray }
      });
    }

    // Available today filter
    if (availableToday === 'true') {
      const today = new Date().toLocaleDateString('en-US', { weekday: 'lowercase' });
      searchConditions.push({
        isOnline: true,
        [`availability.${today}.available`]: true
      });
    }

    // Emergency availability
    if (emergency === 'true') {
      searchConditions.push({
        availableForEmergency: true,
        isOnline: true
      });
    }

    // Apply all search conditions
    if (searchConditions.length > 0) {
      pipeline.push({
        $match: {
          $and: searchConditions
        }
      });
    }

    // Add computed fields
    pipeline.push({
      $addFields: {
        fullName: { $concat: ['$user.firstName', ' ', '$user.lastName'] },
        currentFee: `$consultationFee.${consultationType}`,
        isAvailableNow: {
          $and: [
            '$isOnline',
            { [`$availability.${new Date().toLocaleDateString('en-US', { weekday: 'lowercase' })}.available`]: true }
          ]
        }
      }
    });

    // Sorting
    const sortDirection = sortOrder === 'desc' ? -1 : 1;
    let sortField = sortBy;

    // Map sort fields
    const sortMapping = {
      'name': 'fullName',
      'rating': 'averageRating',
      'experience': 'totalExperience',
      'fee': 'currentFee',
      'consultations': 'totalConsultations'
    };

    if (sortMapping[sortBy]) {
      sortField = sortMapping[sortBy];
    }

    pipeline.push({
      $sort: { [sortField]: sortDirection, _id: 1 } // Add _id for consistent sorting
    });

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: parseInt(limit) });

    // Project final fields
    pipeline.push({
      $project: {
        _id: 1,
        userId: 1,
        primarySpecialization: 1,
        secondarySpecializations: 1,
        totalExperience: 1,
        consultationFee: 1,
        averageRating: 1,
        totalReviews: 1,
        totalConsultations: 1,
        isOnline: 1,
        languagesSpoken: 1,
        bio: 1,
        availability: 1,
        availableForEmergency: 1,
        verificationStatus: 1,
        currentWorkplace: 1,
        fullName: 1,
        currentFee: 1,
        isAvailableNow: 1,
        'user.firstName': 1,
        'user.lastName': 1,
        'user.profilePicture': 1,
        'user.address': 1
      }
    });

    // Execute search
    const doctors = await Doctor.aggregate(pipeline);

    // Get total count for pagination (run same pipeline without skip/limit)
    const countPipeline = pipeline.slice(0, -3); // Remove skip, limit, and project
    countPipeline.push({ $count: 'total' });
    const countResult = await Doctor.aggregate(countPipeline);
    const totalDoctors = countResult[0]?.total || 0;

    // Get search suggestions/filters for frontend
    const suggestions = await Doctor.aggregate([
      { $match: { verificationStatus: 'verified' } },
      {
        $group: {
          _id: null,
          specializations: { $addToSet: '$primarySpecialization' },
          languages: { $addToSet: { $arrayElemAt: ['$languagesSpoken', 0] } },
          avgRating: { $avg: '$averageRating' },
          avgExperience: { $avg: '$totalExperience' },
          priceRange: {
            $push: {
              video: '$consultationFee.video',
              audio: '$consultationFee.audio',
              chat: '$consultationFee.chat'
            }
          }
        }
      }
    ]);

    res.json({
      status: 'success',
      results: doctors.length,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalDoctors / parseInt(limit)),
        totalDoctors,
        hasNext: skip + doctors.length < totalDoctors,
        hasPrev: parseInt(page) > 1
      },
      filters: suggestions[0] || {},
      data: {
        doctors
      }
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error performing search',
      error: error.message
    });
  }
});

// @route   GET /api/search/suggestions
// @desc    Get search suggestions and filter options
// @access  Public
router.get('/suggestions', async (req, res) => {
  try {
    const [specializations, locations, languages] = await Promise.all([
      // Get all unique specializations
      Doctor.aggregate([
        { $match: { verificationStatus: 'verified' } },
        {
          $group: {
            _id: null,
            primary: { $addToSet: '$primarySpecialization' },
            secondary: { $addToSet: '$secondarySpecializations' }
          }
        }
      ]),

      // Get all locations
      User.aggregate([
        { $match: { userType: 'doctor', isActive: true } },
        {
          $group: {
            _id: null,
            provinces: { $addToSet: '$address.province' },
            districts: { $addToSet: '$address.district' },
            municipalities: { $addToSet: '$address.municipality' }
          }
        }
      ]),

      // Get all languages
      Doctor.aggregate([
        { $match: { verificationStatus: 'verified' } },
        { $unwind: '$languagesSpoken' },
        {
          $group: {
            _id: null,
            languages: { $addToSet: '$languagesSpoken' }
          }
        }
      ])
    ]);

    // Flatten specializations
    const allSpecializations = [
      ...(specializations[0]?.primary || []),
      ...(specializations[0]?.secondary || []).flat()
    ];

    res.json({
      status: 'success',
      data: {
        specializations: [...new Set(allSpecializations)].sort(),
        locations: {
          provinces: (locations[0]?.provinces || []).filter(Boolean).sort(),
          districts: (locations[0]?.districts || []).filter(Boolean).sort(),
          municipalities: (locations[0]?.municipalities || []).filter(Boolean).sort()
        },
        languages: (languages[0]?.languages || []).sort(),
        consultationTypes: ['video', 'audio', 'chat'],
        priorityLevels: ['normal', 'urgent', 'emergency']
      }
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching suggestions',
      error: error.message
    });
  }
});

export default router;
