/*
 * API 
 * 
 * 
 * 
 * 
 * USER
 * /get/users = list all the users
 * /GET/users/{id} = get a single user
 * /POST/users/{id} = create
 * 
 * 
 * TimeSlot
 * /get/timeslots = list all the time slots (id, name)
 * /get/timeslots/{id} = grab all time slots that match the id
 * /post/timeslots = create a new timeslot with the values
 * /delete/timeslots = delete all the timeslots
 * /put/timeslots/{id} = change a timeslot
 * 
 * 
 * 
 * 
 * ScheduleOwner extends User
 * id: unique_value
 * name: string
 * short_display: string
 * long_display: string
 * 
 * ScheduleUser extends ScheduleOwner
 * email: string
 * first_name: string
 * last_name: string
 *
 * 
 * /get/scheduleowners = list of people / resource that have schedule data
 * /CRUD operations
 * 
 * Schedule
 * id: unique
 * date_start: date
 * date_end: date
 * name: string
 * creation_by: ScheduleUser
 * creation_date: date
 * schedule_people: Array<ScheduleUser>
 * schedule_people_limits: Map<ScheduleOwnerId, EventGroup> 
 * holiday_group: <HolidayGroup>
 * template: <ScheduleTemplate>
 * options: ScheduleOptions
 * versions: Array<ScheduleVersion>
 * notes: global notes (show on every version)
 * 
 * 
 * ScheduleVersion
 * id: <unqique>
 * ScheduleID: <scheduleid>
 * edited_by: <ScheduleOwner>
 * edited_when: date
 * publish: date
 * notes: string
 * ScheduleEvents: Array<ScheduleEvents>
 * /get/all = returns all events
 * /get/{scheduleownerid} = return only that schedule owners events
 * /get/{start}, {end} = return events between the two dates
 * 
 * ScheduleEvents
 * id: unique
 * value: number (mapped from EventGroup)
 * properties? : propertybag
 * ScheduleUser: <ScheduleUser>
 * 
 * Event
 * id:<id>
 * description: string
 * formating: <Format>
 * hidden: boolean
 * 
 * EventGroup
 * id: <id>
 * name: string
 * EventValues: Array<Event>
 * 
 */
