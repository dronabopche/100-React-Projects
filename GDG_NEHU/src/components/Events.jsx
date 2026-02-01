import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, ChevronRight } from 'lucide-react';

const Events = () => {
  const events = [
    {
      title: 'Flutter Festival NEHU',
      date: 'Feb 28, 2025',
      time: '10:00 AM - 4:00 PM',
      location: 'NEHU Tech Park, Shillong',
      type: 'Festival',
      attendees: 150,
      color: 'blue'
    },
    {
      title: 'Cloud Study Jam - Northeast Edition',
      date: 'Mar 15, 2025',
      time: '9:00 AM - 5:00 PM',
      location: 'Department of Computer Science',
      type: 'Workshop',
      attendees: 80,
      color: 'green'
    },
    {
      title: 'AI/ML Bootcamp',
      date: 'Apr 5, 2025',
      time: '2:00 PM - 6:00 PM',
      location: 'Virtual (Google Meet)',
      type: 'Bootcamp',
      attendees: 200,
      color: 'purple'
    },
    {
      title: 'Google I/O Extended NEHU',
      date: 'May 20, 2025',
      time: '9:00 AM - 6:00 PM',
      location: 'NEHU Auditorium',
      type: 'Conference',
      attendees: 300,
      color: 'yellow'
    },
  ];

  return (
    <section id="events" className="py-20 px-4 bg-gradient-to-b from-white to-blue-50/30">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title">
            Upcoming Events at{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">
              NEHU Campus
            </span>
          </h2>
          <p className="section-subtitle">
            Join our exciting events, workshops, and hackathons. Experience the vibrant tech culture 
            in the beautiful hills of Northeast India.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group"
            >
              {/* Event header */}
              <div className={`h-2 bg-gradient-to-r from-${event.color}-500 to-${event.color === 'blue' ? 'green' : event.color === 'green' ? 'blue' : event.color}-400`}></div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold bg-${event.color}-100 text-${event.color}-700`}>
                    {event.type}
                  </span>
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                
                <h3 className="font-bold text-gray-900 text-xl mb-4 group-hover:text-blue-600 transition-colors">
                  {event.title}
                </h3>
                
                {/* Event details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-3" />
                    <span className="text-sm">{event.date} • {event.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-3" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-3" />
                    <span className="text-sm">{event.attendees}+ attending</span>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-3 bg-gradient-to-r from-${event.color}-500 to-${event.color === 'blue' ? 'green' : event.color === 'green' ? 'blue' : event.color}-400 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center group/btn`}
                >
                  Register Now
                  <ChevronRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View all events button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.a
            href="#all-events"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-8 py-4 bg-white border-2 border-blue-500 text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition-all duration-300 shadow-md"
          >
            View All Events
            <ChevronRight className="h-5 w-5 ml-2" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Events;