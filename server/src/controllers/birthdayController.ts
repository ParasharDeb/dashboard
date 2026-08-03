import { Request, Response, NextFunction } from 'express';
import Birthday from '../models/Birthday';

const getZodiacSign = (day: number, month: number): string => {
  const zodiacs = [
    { sign: 'Capricorn', day: 20, month: 1 },
    { sign: 'Aquarius', day: 19, month: 2 },
    { sign: 'Pisces', day: 20, month: 3 },
    { sign: 'Aries', day: 20, month: 4 },
    { sign: 'Taurus', day: 21, month: 5 },
    { sign: 'Gemini', day: 21, month: 6 },
    { sign: 'Cancer', day: 23, month: 7 },
    { sign: 'Leo', day: 23, month: 8 },
    { sign: 'Virgo', day: 23, month: 9 },
    { sign: 'Libra', day: 23, month: 10 },
    { sign: 'Scorpio', day: 22, month: 11 },
    { sign: 'Sagittarius', day: 22, month: 12 },
    { sign: 'Capricorn', day: 31, month: 12 },
  ];

  for (const z of zodiacs) {
    if (month < z.month || (month === z.month && day <= z.day)) {
      return z.sign;
    }
  }
  return 'Capricorn';
};

const calculateBirthdayMeta = (dobDate: Date) => {
  const today = new Date();
  const currentYear = today.getFullYear();

  const birthDate = new Date(dobDate);
  const birthMonth = birthDate.getMonth();
  const birthDay = birthDate.getDate();

  // Next birthday date in current or next year
  let nextBday = new Date(currentYear, birthMonth, birthDay);
  if (nextBday.getTime() < new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) {
    nextBday = new Date(currentYear + 1, birthMonth, birthDay);
  }

  const diffTime = nextBday.getTime() - new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const turningAge = nextBday.getFullYear() - birthDate.getFullYear();
  const isToday = daysRemaining === 0;
  const isThisWeek = daysRemaining > 0 && daysRemaining <= 7;
  const zodiac = getZodiacSign(birthDay, birthMonth + 1);

  return { daysRemaining, turningAge, isToday, isThisWeek, zodiac };
};

export const getBirthdays = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const birthdays = await Birthday.find();

    const formatted = birthdays.map((b) => {
      const meta = calculateBirthdayMeta(b.dateOfBirth);
      return {
        ...b.toObject(),
        ...meta,
      };
    });

    formatted.sort((a, b) => a.daysRemaining - b.daysRemaining);

    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    next(error);
  }
};

export const createBirthday = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, dateOfBirth, relationship, notes, avatarUrl } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      res.status(400).json({ success: false, error: 'Name is required' });
      return;
    }
    if (!dateOfBirth) {
      res.status(400).json({ success: false, error: 'Date of birth is required' });
      return;
    }

    const birthday = await Birthday.create({
      name: name.trim(),
      dateOfBirth: new Date(dateOfBirth),
      relationship: relationship ? String(relationship).trim() : 'Friend',
      notes: notes ? String(notes).trim() : '',
      avatarUrl: avatarUrl ? String(avatarUrl).trim() : '',
    });

    const meta = calculateBirthdayMeta(birthday.dateOfBirth);

    res.status(201).json({
      success: true,
      data: {
        ...birthday.toObject(),
        ...meta,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateBirthday = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, dateOfBirth, relationship, notes, avatarUrl } = req.body;

    const birthday = await Birthday.findById(id);
    if (!birthday) {
      res.status(404).json({ success: false, error: 'Birthday not found' });
      return;
    }

    if (name !== undefined) birthday.name = String(name).trim();
    if (dateOfBirth !== undefined) birthday.dateOfBirth = new Date(dateOfBirth);
    if (relationship !== undefined) birthday.relationship = String(relationship).trim();
    if (notes !== undefined) birthday.notes = String(notes).trim();
    if (avatarUrl !== undefined) birthday.avatarUrl = String(avatarUrl).trim();

    await birthday.save();
    const meta = calculateBirthdayMeta(birthday.dateOfBirth);

    res.json({
      success: true,
      data: {
        ...birthday.toObject(),
        ...meta,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBirthday = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const birthday = await Birthday.findByIdAndDelete(id);

    if (!birthday) {
      res.status(404).json({ success: false, error: 'Birthday not found' });
      return;
    }

    res.json({ success: true, message: 'Birthday deleted successfully' });
  } catch (error) {
    next(error);
  }
};
