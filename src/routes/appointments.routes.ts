import { request, response, Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { startOfHour, parseISO } from 'date-fns';

import CreateAppintmentService from '../services/CreateAppointmentService';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

const appointmentsRouter = Router();


appointmentsRouter.get('/', async (request, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);

  const appointments = await appointmentsRepository.find();
  return response.json(appointments);

});


appointmentsRouter.post('/', async (request, response) => {

  try {
    const { provider, date } = request.body;

    const parsedDate = startOfHour(parseISO(date));

    const createAppointment = new CreateAppintmentService();

    const appointment = await createAppointment.execute({
      provider,
      date: parsedDate
    })

    return response.json(appointment);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }

});


export default appointmentsRouter;