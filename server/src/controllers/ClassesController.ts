import { Request, Response } from 'express';
import db from '../database/connection';
import convertHourToMinutes from '../utils/convertHourToMinutes';

interface ScheduleItem {
  week_day: number;
  from: string;
  to: string;
}


export default class ClassesController {
  async index(request: Request, response: Response) {
    const filters = request.query;
    if (!filters.week_day && !filters.subject && !filters.time) {
      return response.status(400).json({ error: 'Missing filters to search classes '});
    }

    const subject = filters.subject as string;
    const week_day = filters.week_day as string;
    const timeInMinutes = filters.time ? convertHourToMinutes(filters.time as string) : undefined;

    const classes = await db('classes')
      .whereExists(function() {
        this.select('class_schedule.*')
          .from('class_schedule')
          .where(query => {
            query.whereRaw('`class_schedule`.`class_id` = `classes`.`id`');
            if(filters.subject)
              query.where('classes.subject', '=', subject)
    
            if(week_day)
              query.whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)]);
    
            if(filters.time)
              query.whereRaw('`class_schedule`.`from` <= ??', [Number(timeInMinutes)])
                .whereRaw('`class_schedule`.`to` > ??', [Number(timeInMinutes)]);
          })
      })
      .join('users', 'classes.user_id', '=', 'users.id')
      //.join('class_schedule', 'classes.id', '=', 'class_schedule.class_id')
      //, 'class_schedule.*'
      .select(['classes.*', 'users.*']); 

    response.json(classes);
  }

  async create (request: Request, response: Response) {
    const {
      name,
      avatar,
      whatsapp,
      bio,
      subject,
      cost,
      schedule
    } = request.body;
  
    const transaction = await db.transaction();
  
    try {
  
  
      const insertedUsersIds = await transaction('users').insert({
        name,
        avatar,
        whatsapp,
        bio
      });
  
      const insertedClassesIds = await transaction('classes').insert({
        subject,
        cost,
        user_id: insertedUsersIds[0]
      });
  
      const class_id = insertedClassesIds[0];
      const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
        return {
          class_id,
          week_day: scheduleItem.week_day,
          from: convertHourToMinutes(scheduleItem.from),
          to: convertHourToMinutes(scheduleItem.to)
        }
      })
  
      await transaction('class_schedule').insert(classSchedule);
  
      await transaction.commit();
      return response.status(201).send();
    } catch (error) {
      await transaction.rollback();
      return response.status(400).json({
        message: "Unexpected error!",
        error
      });
    }
  
  }
}