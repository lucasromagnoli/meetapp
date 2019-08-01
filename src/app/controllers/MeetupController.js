import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';
import { isBefore, startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

class MeetupController {
  async index(req, res) {
    const { page = 1, date } = req.query;
    const where = {};

    if (date) {
      const searchDate = parseISO(date);
      where.date = {
        [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
      };
    }

    const meetups = await Meetup.findAll({
      attributes: ['id', 'title', 'description', 'localization', 'date'],
      where,
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: File,
          as: 'banner',
        },
      ],
    });

    return res.json(meetups);
  }

  async store(req, res) {
    const { date } = req.body;
    const dateIsBefore = isBefore(parseISO(date), new Date());

    if (dateIsBefore) {
      return res.status(400).json({
        error: 'Meetup date invalid',
      });
    }

    const data = { user_id: req.userId, ...req.body };

    const meetup = await Meetup.create(data);
    return res.json(meetup);
  }

  async update(req, res) {
    const meetup = await Meetup.findByPk(req.params.id);
    const { date } = req.body;

    if (!(meetup.user_id === req.userId)) {
      return res.status(401).json({
        error: 'You can only update yours meetups',
      });
    }

    if (meetup.past) {
      return res.status(401).json({
        error: 'This meetup is on past',
      });
    }

    const updatedDate = parseISO(date);
    const updatedDatePast = isBefore(updatedDate, new Date());

    if (date && updatedDatePast) {
      return res.status(400).json({
        error: 'The new date is on past.',
      });
    }

    return res.json(meetup);
  }

  async destroy(req, res) {
    const meetup = await Meetup.findByPk(req.params.id);

    if (!meetup) {
      return res.status(400).json({
        error: 'Meetup not found',
      });
    }

    await meetup.destroy();
    return res.json();
  }
}

export default new MeetupController();
