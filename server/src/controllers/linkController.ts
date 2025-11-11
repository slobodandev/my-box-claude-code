import { Request, Response } from 'express';
import Storage from '../models/Storage';
import { sendEmail } from '../utils/email';

export const createLink = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const link = Storage.createLink(email);
    const shareUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/share/${link.token}`;

    // Send email if email is provided
    if (email) {
      try {
        await sendEmail(email, link.token, shareUrl);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Continue even if email fails
      }
    }

    res.json({
      message: 'Link created successfully',
      link: {
        token: link.token,
        url: shareUrl,
        createdAt: link.createdAt
      }
    });
  } catch (error) {
    console.error('Create link error:', error);
    res.status(500).json({ error: 'Failed to create link' });
  }
};

export const getLinkInfo = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const link = Storage.getLink(token);

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    res.json({
      token: link.token,
      createdAt: link.createdAt,
      filesCount: link.files.length
    });
  } catch (error) {
    console.error('Get link info error:', error);
    res.status(500).json({ error: 'Failed to get link info' });
  }
};
