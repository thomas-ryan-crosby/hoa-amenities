import express from 'express';
import { Investor } from '../models';

const router = express.Router();

// POST /api/investors - Submit investor information
router.post('/', async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ 
        message: 'Name and email are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Invalid email format' 
      });
    }

    // Check if investor with this email already exists
    const existingInvestor = await Investor.findOne({
      where: { email }
    });

    if (existingInvestor) {
      // Update existing investor if phone is provided
      if (phone) {
        await existingInvestor.update({ phone, name });
        return res.json({ 
          message: 'Investor information updated',
          investor: existingInvestor
        });
      }
      return res.json({ 
        message: 'Investor already exists',
        investor: existingInvestor
      });
    }

    // Create new investor
    const investor = await Investor.create({
      name,
      email,
      phone: phone || null
    });

    console.log('✅ New investor submitted:', { name, email, phone });

    return res.json({ 
      message: 'Investor information submitted successfully',
      investor
    });

  } catch (error: any) {
    console.error('❌ Error submitting investor information:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      details: error.message || 'Unknown error'
    });
  }
});

export default router;

