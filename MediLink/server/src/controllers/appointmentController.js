import prisma from '../config/db.js'

// ─── POST /api/appointments ─── Create a new appointment
export async function createAppointment(req, res) {
  try {
    const {
      patientName,
      dateOfBirth,
      gender,
      contactNumber,
      email,
      requestFor,
      doctorOrService,
      appointmentDate,
      appointmentTime,
    } = req.body

    // Validate required fields
    if (!patientName || !dateOfBirth || !gender || !contactNumber || !email || !appointmentDate || !appointmentTime) {
      return res.status(400).json({
        message: 'Missing required fields: patientName, dateOfBirth, gender, contactNumber, email, appointmentDate, appointmentTime',
      })
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientName,
        dateOfBirth,
        gender,
        contactNumber,
        email,
        requestFor: requestFor || null,
        doctorOrService: doctorOrService || null,
        appointmentDate,
        appointmentTime,
        userId: req.user.userId,
      },
    })

    return res.status(201).json({ message: 'Appointment created', appointment })
  } catch (error) {
    console.error('Create appointment error:', error)
    return res.status(500).json({ message: error?.message || 'Internal server error' })
  }
}

// ─── GET /api/appointments ─── List all appointments for the logged-in user
export async function listAppointments(req, res) {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
    })

    return res.json({ appointments })
  } catch (error) {
    console.error('List appointments error:', error)
    return res.status(500).json({ message: error?.message || 'Internal server error' })
  }
}

// ─── GET /api/appointments/doctor/all ─── All appointments (doctor-only)
// Expects `authorize('doctor')` middleware to run before this
export async function listAllAppointmentsForDoctor(req, res) {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return res.json({ appointments })
  } catch (error) {
    console.error('Doctor list appointments error:', error)
    return res.status(500).json({ message: error?.message || 'Internal server error' })
  }
}

// ─── GET /api/appointments/:id ─── Get a single appointment
export async function getAppointment(req, res) {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: req.params.id },
    })

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' })
    }

    // Ensure the user owns this appointment
    if (appointment.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' })
    }

    return res.json({ appointment })
  } catch (error) {
    console.error('Get appointment error:', error)
    return res.status(500).json({ message: error?.message || 'Internal server error' })
  }
}

// ─── PUT /api/appointments/:id ─── Update an appointment
export async function updateAppointment(req, res) {
  try {
    const existing = await prisma.appointment.findUnique({
      where: { id: req.params.id },
    })

    if (!existing) {
      return res.status(404).json({ message: 'Appointment not found' })
    }

    if (existing.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' })
    }

    const {
      patientName,
      dateOfBirth,
      gender,
      contactNumber,
      email,
      requestFor,
      doctorOrService,
      appointmentDate,
      appointmentTime,
      status,
    } = req.body

    const appointment = await prisma.appointment.update({
      where: { id: req.params.id },
      data: {
        ...(patientName !== undefined && { patientName }),
        ...(dateOfBirth !== undefined && { dateOfBirth }),
        ...(gender !== undefined && { gender }),
        ...(contactNumber !== undefined && { contactNumber }),
        ...(email !== undefined && { email }),
        ...(requestFor !== undefined && { requestFor }),
        ...(doctorOrService !== undefined && { doctorOrService }),
        ...(appointmentDate !== undefined && { appointmentDate }),
        ...(appointmentTime !== undefined && { appointmentTime }),
        ...(status !== undefined && { status }),
      },
    })

    return res.json({ message: 'Appointment updated', appointment })
  } catch (error) {
    console.error('Update appointment error:', error)
    return res.status(500).json({ message: error?.message || 'Internal server error' })
  }
}

// ─── DELETE /api/appointments/:id ─── Delete an appointment
export async function deleteAppointment(req, res) {
  try {
    const existing = await prisma.appointment.findUnique({
      where: { id: req.params.id },
    })

    if (!existing) {
      return res.status(404).json({ message: 'Appointment not found' })
    }

    if (existing.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' })
    }

    await prisma.appointment.delete({
      where: { id: req.params.id },
    })

    return res.json({ message: 'Appointment deleted' })
  } catch (error) {
    console.error('Delete appointment error:', error)
    return res.status(500).json({ message: error?.message || 'Internal server error' })
  }
}
