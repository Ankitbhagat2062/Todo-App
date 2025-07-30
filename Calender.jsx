import React, { useState, useRef, useEffect, useCallback } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import NepaliDate from 'nepali-date-converter';
import Navbar from './Navbar';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegClock } from "react-icons/fa";
import { GoTag } from "react-icons/go";
import { CiCalendarDate } from "react-icons/ci";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoPersonOutline } from "react-icons/io5";
import { FaTimes } from "react-icons/fa";
import { GrPrevious } from "react-icons/gr";
import { GrNext } from "react-icons/gr";
const localizer = momentLocalizer(moment);

const holidays = {
  '1-1': ['Nepali New Year'],
  '2-15': ['Buddha Jayanti'],
  '6-15': ['Dashain'],
  '11-29': ['Holi'],
};

const initialEvents = [
  {
    id: 1,
    title: 'Sample Event',
    body: 'Sample event body',
    date: new Date(new Date().setHours(0, 0, 0, 0)),
    start: new Date(new Date().setHours(1, 0, 0, 0)),
    end: new Date(new Date().setHours(2, 0, 0, 0)),
    category: 'Work',
    color: 'red',
  },
  {
    id: 2,
    title: 'Sample Event',
    body: 'Sample event body',
    date: new Date(new Date().setHours(0, 0, 0, 0)),
    start: new Date(new Date().setHours(3, 0, 0, 0)),
    end: new Date(new Date().setHours(3, 3, 0, 0)),
    category: 'Work',
    color: 'yellow',
  },
];

const Calandar = () => {
  // State for simple calendar
  const [bigView, setBigView] = useState(Views.DAY);
  const [bigDate, setBigDate] = useState(new Date());
  const scrollContainerRef = useRef(null);
  const [eventsState, setEventsState] = useState(initialEvents);
  const [addingEvent, setAddingEvent] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventBody, setNewEventBody] = useState('');
  const [simpleDate, setSimpleDate] = useState(new Date());
  const [newEventStart, setNewEventStart] = useState(null);
  const [newEventEnd, setNewEventEnd] = useState(null);
  const [newEventCategory, setNewEventCategory] = useState('Work');
  const [newEventColor, setNewEventColor] = useState('#10B981');
  const eventDetailsRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [EventId, setEventId] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [EditForm, setEditForm] = useState(null);
  const userId = localStorage.getItem("userId");

  React.useEffect(() => {
    if (userId) {
      fetch(`http://localhost:3000/api/v3/getEvent/${userId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          if (data && Array.isArray(data.Event)) {
            const fetchedEvents = data.Event.map(event => ({
              id: event._id || event.id,
              title: event.title,
              body: event.body,
              date: event.date ? (event.date) : new Date(),
              start: event.start ? new Date(event.start) : new Date(),
              end: event.end ? new Date(event.end) : new Date(),
              category: event.category,
              color: event.color,
            }));
            setEventsState(fetchedEvents);
          } else {
            console.error('Events data is not an array or is undefined:', data);
          }
        })
        .catch(error => {
          console.error('Error fetching events:', error);
        });
    }
  }, [userId]);
  // Handlers for simple calendar
  const onSimpleChange = (date) => {
    setSimpleDate(date);
    setBigDate(date);
  };

  // Handlers for big calendar
  const handleViewChange = (newView) => {
    setBigView(newView);
  };

  const handleNavigate = (newDate) => {
    setBigDate(newDate);
    setSimpleDate(newDate);
  };

  const handleAddEvent = (event) => {
    // Check if event is a real event object (has id or title) or a SyntheticBaseEvent
    const isRealEvent = event && (event.id !== undefined || event.title !== undefined);

    if (!isRealEvent) {
      setAddingEvent(true);
      setIsEditing(false);
      setNewEventTitle('');
      setNewEventBody('');
      setShowEditForm(true)
      const startDateTime = simpleDate ? new Date(simpleDate.setHours(0, 0, 0, 0)) : new Date(new Date().setHours(0, 0, 0, 0));
      const endDateTime = new Date(startDateTime);
      setNewEventStart(startDateTime);
      setNewEventEnd(endDateTime);
      setNewEventCategory('Other');
      setNewEventColor('#14b8a6');
    } else {
      setAddingEvent(true);
      setIsEditing(true);
      setNewEventTitle(event.title);
      setNewEventBody(event.body);
      const currentDate = (event.date) ? new Date(event.date) : new Date();
      setNewEventStart(event.start);
      setNewEventEnd(event.end);
      setNewEventCategory(event.category)
      setNewEventColor(event.color);
      setEditForm(event);
    }
  };
  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!newEventTitle || !newEventStart || !newEventEnd) {
      alert('Please fill in all fields and select a time slot.');
      return;
    }
    if (newEventStart >= newEventEnd) {
      alert('Start time must be before end time.');
      return;
    }
    const newEvent = {
      title: newEventTitle,
      body: newEventBody,
      start: newEventStart,
      date: simpleDate,
      end: newEventEnd,
      category: newEventCategory,
      color: newEventColor,
      user: userId,
    };
    setEventsState([...eventsState, newEvent]);
    setAddingEvent(false);
    setShowEditForm(false)
    if (userId) {
      try {
        const response = await fetch("http://localhost:3000/api/v3/addEvent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newEvent),
        });
        if (!response.ok) {
          console.log("Error Saving Successfully")
        }
        if (response.ok) {
          const data = await response.json();
          // Add the new event with id from backend if available
          const savedEvent = {
            id: data.event._id,
            title: data.event.title,
            body: data.event.body,
            date: data.event.date ? (data.event.date) : new Date(),
            start: data.event.start ? new Date(data.event.start) : new Date(),
            end: data.event.end ? new Date(data.event.end) : new Date(),
            category: data.event.category,
            color: data.event.color,
          };
          console.log("Data Saved Successfully")
          setEventsState([...eventsState, savedEvent]);
          setAddingEvent(false);
          setShowEditForm(false);
        } else {
          alert("Failed to save event.");
        }
      } catch (error) {
        console.error("Error saving event:", error);
        alert("Error saving event.");
      }
    }
  };
  const handleSelectSlot = ({ start, end }) => {
    if (addingEvent) {
      setNewEventStart(start);
      setNewEventEnd(end);
    }
  };

  // Effect to handle infinite vertical scrolling
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = scrollContainer.scrollTop;
          const scrollHeight = scrollContainer.scrollHeight;
          const clientHeight = scrollContainer.clientHeight;

          // Threshold in px to trigger date change
          const threshold = 50;

          if (scrollTop + clientHeight >= scrollHeight - threshold) {
            // Scrolled near bottom, increment date
            setBigDate((prevDate) => moment(prevDate).add(1, 'day').toDate());
            // Reset scroll to top after date change to simulate infinite scroll
            scrollContainer.scrollTop = 0;
          } else if (scrollTop <= threshold) {
            // Scrolled near top, decrement date
            setBigDate((prevDate) => moment(prevDate).subtract(1, 'day').toDate());
            // Reset scroll to bottom after date change
            scrollContainer.scrollTop = scrollHeight;
          }

          ticking = false;
        });

        ticking = true;
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [bigDate]);

  const CustomToolbar = (toolbar) => {
    const goToBack = () => {
      let mDate = moment(toolbar.date);
      let newDate = bigView === Views.MONTH ? mDate.subtract(1, 'month') : mDate.subtract(1, 'day');
      toolbar.onNavigate('prev', newDate.toDate());
    };

    const goToNext = () => {
      let mDate = moment(toolbar.date);
      let newDate = bigView === Views.MONTH ? mDate.add(1, 'month') : mDate.add(1, 'day');
      toolbar.onNavigate('next', newDate.toDate());
    };

    const goToToday = () => {
      toolbar.onNavigate('today', new Date());
    };

    const label = () => {
      return moment(toolbar.date).format('MMMM YYYY');
    };

    return (
      <div className="rbc-toolbar flex !justify-between items-center !p-1 bg-white rounded-md shadow-sm w-full mb-4">
        <span className="text-xl font-bold">Calender {label()}</span>
        <div className="flex space-x-4 items-center">
          <div className="flex items-center space-x-3 px-3 py-1 rounded-md gap-1">
            <button onClick={goToBack} className="!p-0.5"><GrPrevious className="text-lg hover:text-blue-600 font-medium" /></button>
            <button onClick={goToToday} className="text-sm !p-0.5 font-medium">Today</button>
            <button onClick={goToNext} className="!p-0.5"><GrNext className="text-lg hover:text-blue-600 font-medium" /></button>
          </div>
          <select
            onChange={(e) => handleViewChange(e.target.value)}
            value={bigView}
            className="text-sm cursor-pointer border-gray-300 rounded-md p-1 border-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value={Views.DAY}>Day</option>
            <option value={Views.WEEK}>Week</option>
            <option value={Views.MONTH}>Month</option>
          </select>
          <button
            onClick={handleAddEvent}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium !p-1 rounded-md shadow-sm">
            + Add Event
          </button>
        </div>
      </div>
    );
  };

  const eventPropGetter = (event) => {
    const isSelected =
      addingEvent &&
      newEventStart &&
      newEventEnd &&
      event.start >= newEventStart &&
      event.end <= newEventEnd;
    return {
      style: {
        backgroundColor: event.color || (isSelected ? '#2563eb' : '#3b82f6'),
        borderRadius: '4px',
        color: 'white',
        border: 'none',
        padding: '2px 4px',
        opacity: isSelected ? 1 : 0.8,
        transition: 'background-color 0.3s ease',
      },
      className: 'hover:bg-yellow-400'
    };
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const nepDate = new NepaliDate(date);
      const key = `${nepDate.getMonth() + 1}-${nepDate.getDate()}`;
      const holidayList = holidays[key];
      return (
        <div className="text-xs text-red-600">
          {holidayList ? holidayList.join(', ') : ''}
          <div>{nepDate.getDate()}</div>
        </div>
      );
    }
    return null;
  };

  // Handler for event click in calendar
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
    setEditForm(event)
  };
  // Handler to delete event
  const deleteEvent = async () => {
    const EventId = selectedEvent.id;
    if (selectedEvent) {
      setEventsState(eventsState.filter((event) => event.id !== selectedEvent.id));
      closeEventDetails();
      if (userId) {
        try {
          const response = await fetch(`http://localhost:3000/api/v3/deleteEvent/${EventId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user: userId })
          });
          if (response.ok) {
            console.log('Item deleted successfully.');
          } else {
            console.log('Failed to delete item.');
          }
        } catch (error) {
          console.log('Error during delete request:', error);
        }
      }
    }
  };

  // Handler to close event details popup
  const closeEventDetails = () => {
    setShowEventDetails(false);
    setSelectedEvent(null);
  };

  // Helper to format duration between two dates in hours and minutes
  const formatDuration = (start, end) => {
    const diffMs = end - start;
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    let result = '';
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m`;
    return result.trim();
  };

  // Helper to get time remaining or passed for event start
  const getTimeRemaining = (start) => {
    const now = new Date();
    const diffMs = start - now;
    const diffMins = Math.floor(Math.abs(diffMs) / 60000);
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    let result = '';
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m`;
    if (diffMs > 0) {
      return `Starts in ${result.trim()}`;
    } else {
      return `Started ${result.trim()} ago`;
    }
  };

  const handleEditEvent = (event) => {
    handleAddEvent(event)
    closeEventDetails()
    setShowEditForm(true)
    setEventId(event.id)
  }
  const handleUpdateEvent = useCallback(async (e) => {
    e.preventDefault();
    if (!newEventTitle || !newEventStart || !newEventEnd) {
      alert('Please fill in all fields and select a time slot.');
      return;
    }
    if (!EditForm) {
      console.error("No event selected for update.");
      return; // Exit if no event is selected
    }

    const updatedEvent = {
      id: EditForm.id,
      title: newEventTitle,
      body: newEventBody,
      date: simpleDate,
      user:userId,
      start: newEventStart,
      end: newEventEnd,
      category: newEventCategory,
      color: newEventColor,
    };

    setEventsState(prev => prev.map(event => event.id === EditForm.id ? updatedEvent : event));
    setAddingEvent(false);
    setSelectedEvent(null)
    setShowEditForm(false)
    if (userId) {
      await fetch(`http://localhost:3000/api/v3/updateEvent/${EventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEvent),
      }).then(async response => {
        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.message === "User not found") {
            console.error("There is no such user in our database. Please Sign up.");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        if (response.ok) {
          console.log('Resource Updated successfully');
          setEventsState(prev => prev.map(event => event.id === EditForm.id ? updatedEvent : event));
          setAddingEvent(false);
          setSelectedEvent(null)
          setShowEditForm(false)
          setEventId(null)
        }
        // Handle successful deletion (e.g., remove the item from the UI)
      })
        .catch(error => {
          console.error('Error Updating resource:', error);
        });
    }
  }, [EditForm, EventId, simpleDate, newEventTitle, newEventStart, newEventEnd, newEventBody, newEventCategory, newEventColor, userId]);

  return (
    <>
      <Navbar />
      <div className="relative gap-10 max-w-7xl mx-auto p-6 bg-white rounded-lg shadow space-x-10 [@media(min-width:868px)]:flex-row flex-col flex">
        {/* Advanced calendar with day time view */}
        <div className="md:w-3/4 w-full space-y-4 mx-auto">
          <BigCalendar
            localizer={localizer}
            events={eventsState}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            className='rounded shadow'
            view={bigView}
            onView={handleViewChange}
            date={bigDate}
            onNavigate={handleNavigate}
            components={{
              toolbar: CustomToolbar,
              event: ({ event }) => (
                <div onClick={() => handleSelectEvent(event)} className="p-1 cursor-pointer">
                  <h1 className="font-bold text-lg text-red-600 title">{event.title}</h1>
                  <div className="text-sm">{event.body}</div>
                  <div className="text-sm">{event.category} Category</div>
                </div>
              ),
              timeSlotWrapper: ({ children }) => (
                <div ref={scrollContainerRef} className="scrollable-time-slot bg-white border-r-0 overflow-y-auto max-h-96" style={{ minHeight: '80px', maxHeight: '400px', overflowY: 'auto' }}>
                  {children}
                </div>
              ),
            }}
            eventPropGetter={eventPropGetter}
            selectable={addingEvent}
            onSelectSlot={handleSelectSlot}
            min={new Date(1970, 0, 1, 0, 0, 0)}
            max={new Date(1970, 0, 1, 23, 59, 59)}
            timeslots={2}
            step={30} />
        </div>
        {/* Simple calendar with Nepali dates */}
        <div className="md:w-1/4 w-full space-y-4 mx-auto">
          <Calendar onChange={onSimpleChange} value={simpleDate} tileContent={tileContent} className={"rounded shadow"} />
          <div className="bg-gray-50 p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-1">Selected Date</h3>
            <p>English: {simpleDate.toDateString()}</p>
            <p>
              Nepali: {new NepaliDate(simpleDate).getYear()}-{new NepaliDate(simpleDate).getMonth() + 1}-
              {new NepaliDate(simpleDate).getDate()}
            </p>
          </div>
        </div>
      </div>
      {(addingEvent || showEditForm) && (
        <form onSubmit={isEditing ? handleUpdateEvent : handleSaveEvent} className="fixed top-20 left-1/2 z-50 w-96 -translate-x-1/2 rounded bg-white p-6 shadow-lg">
          <h3 className="mb-2 text-lg font-semibold">{isEditing ? 'Update Event' : 'Add Event'}</h3>
          <label className="mb-1 block font-medium" htmlFor="title">Title *</label>
          <input id="title" type="text" value={newEventTitle} onChange={(e) => setNewEventTitle(e.target.value)} className="mb-2 w-full rounded border border-gray-300 px-3 py-1" required />
          <label className="mb-1 block font-medium" htmlFor="body">Description</label>
          <textarea id="body" value={newEventBody} onChange={(e) => setNewEventBody(e.target.value)}
            className="mb-2 w-full resize-none rounded border border-gray-300 px-3 py-1" rows={4} />
          <label className="mb-1 block font-medium" htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={newEventStart ? moment(newEventStart).format('YYYY-MM-DD') : ''}
            onChange={(e) => {
              const selectedDate = e.target.value;
              if (newEventStart && newEventEnd) {
                const updateDate = (dateObj, newDateStr) => {
                  const time = {
                    hours: dateObj.getHours(),
                    minutes: dateObj.getMinutes(),
                    seconds: dateObj.getSeconds(),
                    milliseconds: dateObj.getMilliseconds(),
                  };
                  const newDate = new Date(newDateStr);
                  newDate.setHours(time.hours, time.minutes, time.seconds, time.milliseconds);
                  return newDate;
                };
                setNewEventStart(updateDate(newEventStart, selectedDate));
                setNewEventEnd(updateDate(newEventEnd, selectedDate));
              } else {
                const newStart = new Date(selectedDate);
                const newEnd = new Date(selectedDate);
                newEnd.setHours(newEnd.getHours() + 1);
                setNewEventStart(newStart);
                setNewEventEnd(newEnd);
              }
              setSimpleDate(new Date(selectedDate));
            }}
            className="mb-2 w-full rounded border border-gray-300 px-3 py-1"
            required
          />
          <div className="flex space-x-4 mb-2">
            <div className="flex flex-col w-1/2">
              <label className="block font-medium mb-1" htmlFor="startTime">Start Time *</label>
              <input id="startTime" type="time" value={newEventStart && moment(newEventStart).isValid() ? moment(newEventStart).format('HH:mm') : ''}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':');
                  const updatedDate = new Date(newEventStart || new Date());
                  updatedDate.setHours(parseInt(hours), parseInt(minutes));
                  setNewEventStart(updatedDate);
                }} className="rounded border border-gray-300 px-3 py-1" required />
            </div>
            <div className="flex flex-col w-1/2">
              <label className="block font-medium mb-1" htmlFor="endTime">End Time *</label>
              <input id="endTime" type="time" value={newEventEnd && moment(newEventEnd).isValid() ? moment(newEventEnd).format('HH:mm') : ''} onChange={(e) => {
                const [hours, minutes] = e.target.value.split(':');
                const updatedDate = new Date(newEventEnd || new Date());
                updatedDate.setHours(parseInt(hours), parseInt(minutes));
                setNewEventEnd(updatedDate);
              }} className="rounded border border-gray-300 px-3 py-1" required />
            </div>
          </div>
          <label className="mb-1 block font-medium" htmlFor="category">Category</label>
          <select
            id="category"
            value={newEventCategory}
            onChange={(e) => {
              setNewEventCategory(e.target.value);
              const categoryColors = {
                Work: '#3B82F6',
                Personal: '#10B981',
                Meeting: '#F59E0B',
                Appointment: '#EF4444',
                Task: '#8B5CF6',
                Reminder: '#EC4899',
                Other: '#6B7280',
              };
              setNewEventColor(categoryColors[e.target.value] || '#6B7280');
            }}
            className="mb-2 w-full rounded border border-gray-300 px-3 py-1">
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Appointment">Appointment</option>
            <option value="Task">Task</option>
            <option value="Reminder">Reminder</option>
            <option value="Other">Other</option>
          </select>
          <div className="flex space-x-2 mb-4">
            {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#6B7280'].map((color) => (
              <div key={color}
                className={`h-6 w-6 rounded-full cursor-pointer border-2 ${newEventColor === color ? 'border-black' : 'border-transparent'}`}
                style={{ backgroundColor: color }}
                onClick={() => {
                  setNewEventColor(color);
                  const colorCategoryMap = {
                    '#3B82F6': 'Work',
                    '#10B981': 'Personal',
                    '#F59E0B': 'Meeting',
                    '#EF4444': 'Appointment',
                    '#8B5CF6': 'Task',
                    '#EC4899': 'Reminder',
                    '#14B8A6': 'Other',
                    '#6B7280': 'Other',
                  };
                  setNewEventCategory(colorCategoryMap[color] || 'Other');
                }}
              />
            ))}
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={() => { setAddingEvent(false), setShowEditForm(false) }} className="rounded border border-gray-300 px-4 py-1 hover:bg-gray-100" >
              Cancel
            </button>
            <button type="submit" className="rounded bg-black px-4 py-1 text-white hover:bg-gray-900" >
              {(showEditForm) ? 'Add Event' : 'Update Event'}
            </button>
          </div>
        </form>
      )}
      {showEventDetails && selectedEvent && (
        <div ref={eventDetailsRef}
          className="fixed top-20 left-1/2 z-50 md:w-[420px] w-[350px] -translate-x-1/2 rounded-lg bg-white shadow-xl border border-gray-200">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-gray-200 px-5 py-4">
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: selectedEvent.color || "#3B82F6" }}>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{selectedEvent.title}</h3>
            </div>
            <div className="flex items-center gap-4 text-gray-500">
              <FaEdit onClick={() => handleEditEvent(selectedEvent)} className="cursor-pointer hover:text-gray-700" />
              <RiDeleteBin6Line onClick={() => deleteEvent()} className="cursor-pointer hover:text-gray-700" />
              <button onClick={closeEventDetails} className="hover:text-gray-700 cursor-pointer" aria-label="Close" >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Event Content */}
          <div className="px-5 py-4 space-y-3 text-gray-700">
            {/* Date & Time */}
            <div className="flex items-start gap-3">
              <FaRegClock className="mt-1 text-gray-500" />
              <div className="flex flex-col">
                <span className="font-medium">{moment(selectedEvent.date).format('dddd, MMMM Do YYYY')}</span>
                <span className="text-sm text-gray-600">
                  {moment(selectedEvent.start).format("h:mm A")} – {moment(selectedEvent.end).format("h:mm A")} (
                  {formatDuration(selectedEvent.start, selectedEvent.end)})
                </span>
              </div>
            </div>

            {/* Category */}
            <div className="flex items-center gap-3">
              <GoTag className="text-gray-500" />
              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded">
                {selectedEvent.category}
              </span>
            </div>

            {/* Body */}
            <div className="flex items-center gap-3">
              <CiCalendarDate className="text-gray-500" />
              <span>{selectedEvent.body}</span>
            </div>

            {/* Time Remaining */}
            <div className="flex items-center gap-3 text-gray-600">
              <IoMdNotificationsOutline className="text-gray-500" />
              <span>{getTimeRemaining(selectedEvent.start)}</span>
            </div>

            {/* Attendees */}
            <div className="flex items-center gap-3 text-gray-600">
              <IoPersonOutline className="text-gray-500" />
              <span>You</span>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-between items-center border-t border-gray-200 px-5 py-3">
            <button onClick={() => handleEditEvent(selectedEvent)}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">
              <FaEdit /> Edit Event
            </button>
            <button onClick={deleteEvent}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-red-300 px-4 py-2 text-red-600 hover:bg-red-50">
              <RiDeleteBin6Line /> Delete Event
            </button>
          </div>
        </div>
      )}

    </>
  )
};

export default Calandar;
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import NepaliDate from 'nepali-date-converter';
import Navbar from './Navbar';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegClock } from "react-icons/fa";
import { GoTag } from "react-icons/go";
import { CiCalendarDate } from "react-icons/ci";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoPersonOutline } from "react-icons/io5";
import { FaTimes } from "react-icons/fa";
import { GrPrevious } from "react-icons/gr";
import { GrNext } from "react-icons/gr";
const localizer = momentLocalizer(moment);

const holidays = {
  '1-1': ['Nepali New Year'],
  '2-15': ['Buddha Jayanti'],
  '6-15': ['Dashain'],
  '11-29': ['Holi'],
};

const initialEvents = [
  {
    id: 1,
    title: 'Sample Event',
    body: 'Sample event body',
    date: new Date(new Date().setHours(0, 0, 0, 0)),
    start: new Date(new Date().setHours(1, 0, 0, 0)),
    end: new Date(new Date().setHours(2, 0, 0, 0)),
    category: 'Work',
    color: 'red',
  },
  {
    id: 2,
    title: 'Sample Event',
    body: 'Sample event body',
    date: new Date(new Date().setHours(0, 0, 0, 0)),
    start: new Date(new Date().setHours(3, 0, 0, 0)),
    end: new Date(new Date().setHours(3, 3, 0, 0)),
    category: 'Work',
    color: 'yellow',
  },
];

const Calandar = () => {
  // State for simple calendar
  const [bigView, setBigView] = useState(Views.DAY);
  const [bigDate, setBigDate] = useState(new Date());
  const scrollContainerRef = useRef(null);
  const [eventsState, setEventsState] = useState(initialEvents);
  const [addingEvent, setAddingEvent] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventBody, setNewEventBody] = useState('');
  const [simpleDate, setSimpleDate] = useState(new Date());
  const [newEventStart, setNewEventStart] = useState(null);
  const [newEventEnd, setNewEventEnd] = useState(null);
  const [newEventCategory, setNewEventCategory] = useState('Work');
  const [newEventColor, setNewEventColor] = useState('#10B981');
  const eventDetailsRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [EventId, setEventId] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [EditForm, setEditForm] = useState(null);
  const userId = localStorage.getItem("userId");

  React.useEffect(() => {
    if (userId) {
      fetch(`http://localhost:3000/api/v3/getEvent/${userId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          if (data && Array.isArray(data.Event)) {
            const fetchedEvents = data.Event.map(event => ({
              id: event._id || event.id,
              title: event.title,
              body: event.body,
              date: event.date ? (event.date) : new Date(),
              start: event.start ? new Date(event.start) : new Date(),
              end: event.end ? new Date(event.end) : new Date(),
              category: event.category,
              color: event.color,
            }));
            setEventsState(fetchedEvents);
          } else {
            console.error('Events data is not an array or is undefined:', data);
          }
        })
        .catch(error => {
          console.error('Error fetching events:', error);
        });
    }
  }, [userId]);
  // Handlers for simple calendar
  const onSimpleChange = (date) => {
    setSimpleDate(date);
    setBigDate(date);
  };

  // Handlers for big calendar
  const handleViewChange = (newView) => {
    setBigView(newView);
  };

  const handleNavigate = (newDate) => {
    setBigDate(newDate);
    setSimpleDate(newDate);
  };

  const handleAddEvent = (event) => {
    // Check if event is a real event object (has id or title) or a SyntheticBaseEvent
    const isRealEvent = event && (event.id !== undefined || event.title !== undefined);

    if (!isRealEvent) {
      setAddingEvent(true);
      setIsEditing(false);
      setNewEventTitle('');
      setNewEventBody('');
      setShowEditForm(true)
      const startDateTime = simpleDate ? new Date(simpleDate.setHours(0, 0, 0, 0)) : new Date(new Date().setHours(0, 0, 0, 0));
      const endDateTime = new Date(startDateTime);
      setNewEventStart(startDateTime);
      setNewEventEnd(endDateTime);
      setNewEventCategory('Other');
      setNewEventColor('#14b8a6');
    } else {
      setAddingEvent(true);
      setIsEditing(true);
      setNewEventTitle(event.title);
      setNewEventBody(event.body);
      const currentDate = (event.date) ? new Date(event.date) : new Date();
      setNewEventStart(event.start);
      setNewEventEnd(event.end);
      setNewEventCategory(event.category)
      setNewEventColor(event.color);
      setEditForm(event);
    }
  };
  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!newEventTitle || !newEventStart || !newEventEnd) {
      alert('Please fill in all fields and select a time slot.');
      return;
    }
    if (newEventStart >= newEventEnd) {
      alert('Start time must be before end time.');
      return;
    }
    const newEvent = {
      title: newEventTitle,
      body: newEventBody,
      start: newEventStart,
      date: simpleDate,
      end: newEventEnd,
      category: newEventCategory,
      color: newEventColor,
      user: userId,
    };
    setEventsState([...eventsState, newEvent]);
    setAddingEvent(false);
    setShowEditForm(false)
    if (userId) {
      try {
        const response = await fetch("http://localhost:3000/api/v3/addEvent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newEvent),
        });
        if (!response.ok) {
          console.log("Error Saving Successfully")
        }
        if (response.ok) {
          const data = await response.json();
          // Add the new event with id from backend if available
          const savedEvent = {
            id: data.event._id,
            title: data.event.title,
            body: data.event.body,
            date: data.event.date ? (data.event.date) : new Date(),
            start: data.event.start ? new Date(data.event.start) : new Date(),
            end: data.event.end ? new Date(data.event.end) : new Date(),
            category: data.event.category,
            color: data.event.color,
          };
          console.log("Data Saved Successfully")
          setEventsState([...eventsState, savedEvent]);
          setAddingEvent(false);
          setShowEditForm(false);
        } else {
          alert("Failed to save event.");
        }
      } catch (error) {
        console.error("Error saving event:", error);
        alert("Error saving event.");
      }
    }
  };
  const handleSelectSlot = ({ start, end }) => {
    if (addingEvent) {
      setNewEventStart(start);
      setNewEventEnd(end);
    }
  };

  // Effect to handle infinite vertical scrolling
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = scrollContainer.scrollTop;
          const scrollHeight = scrollContainer.scrollHeight;
          const clientHeight = scrollContainer.clientHeight;

          // Threshold in px to trigger date change
          const threshold = 50;

          if (scrollTop + clientHeight >= scrollHeight - threshold) {
            // Scrolled near bottom, increment date
            setBigDate((prevDate) => moment(prevDate).add(1, 'day').toDate());
            // Reset scroll to top after date change to simulate infinite scroll
            scrollContainer.scrollTop = 0;
          } else if (scrollTop <= threshold) {
            // Scrolled near top, decrement date
            setBigDate((prevDate) => moment(prevDate).subtract(1, 'day').toDate());
            // Reset scroll to bottom after date change
            scrollContainer.scrollTop = scrollHeight;
          }

          ticking = false;
        });

        ticking = true;
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [bigDate]);

  const CustomToolbar = (toolbar) => {
    const goToBack = () => {
      let mDate = moment(toolbar.date);
      let newDate = bigView === Views.MONTH ? mDate.subtract(1, 'month') : mDate.subtract(1, 'day');
      toolbar.onNavigate('prev', newDate.toDate());
    };

    const goToNext = () => {
      let mDate = moment(toolbar.date);
      let newDate = bigView === Views.MONTH ? mDate.add(1, 'month') : mDate.add(1, 'day');
      toolbar.onNavigate('next', newDate.toDate());
    };

    const goToToday = () => {
      toolbar.onNavigate('today', new Date());
    };

    const label = () => {
      return moment(toolbar.date).format('MMMM YYYY');
    };

    return (
      <div className="rbc-toolbar flex !justify-between items-center !p-1 bg-white rounded-md shadow-sm w-full mb-4">
        <span className="text-xl font-bold">Calender {label()}</span>
        <div className="flex space-x-4 items-center">
          <div className="flex items-center space-x-3 px-3 py-1 rounded-md gap-1">
            <button onClick={goToBack} className="!p-0.5"><GrPrevious className="text-lg hover:text-blue-600 font-medium" /></button>
            <button onClick={goToToday} className="text-sm !p-0.5 font-medium">Today</button>
            <button onClick={goToNext} className="!p-0.5"><GrNext className="text-lg hover:text-blue-600 font-medium" /></button>
          </div>
          <select
            onChange={(e) => handleViewChange(e.target.value)}
            value={bigView}
            className="text-sm cursor-pointer border-gray-300 rounded-md p-1 border-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value={Views.DAY}>Day</option>
            <option value={Views.WEEK}>Week</option>
            <option value={Views.MONTH}>Month</option>
          </select>
          <button
            onClick={handleAddEvent}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium !p-1 rounded-md shadow-sm">
            + Add Event
          </button>
        </div>
      </div>
    );
  };

  const eventPropGetter = (event) => {
    const isSelected =
      addingEvent &&
      newEventStart &&
      newEventEnd &&
      event.start >= newEventStart &&
      event.end <= newEventEnd;
    return {
      style: {
        backgroundColor: event.color || (isSelected ? '#2563eb' : '#3b82f6'),
        borderRadius: '4px',
        color: 'white',
        border: 'none',
        padding: '2px 4px',
        opacity: isSelected ? 1 : 0.8,
        transition: 'background-color 0.3s ease',
      },
      className: 'hover:bg-yellow-400'
    };
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const nepDate = new NepaliDate(date);
      const key = `${nepDate.getMonth() + 1}-${nepDate.getDate()}`;
      const holidayList = holidays[key];
      return (
        <div className="text-xs text-red-600">
          {holidayList ? holidayList.join(', ') : ''}
          <div>{nepDate.getDate()}</div>
        </div>
      );
    }
    return null;
  };

  // Handler for event click in calendar
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
    setEditForm(event)
  };
  // Handler to delete event
  const deleteEvent = async () => {
    const EventId = selectedEvent.id;
    if (selectedEvent) {
      setEventsState(eventsState.filter((event) => event.id !== selectedEvent.id));
      closeEventDetails();
      if (userId) {
        try {
          const response = await fetch(`http://localhost:3000/api/v3/deleteEvent/${EventId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user: userId })
          });
          if (response.ok) {
            console.log('Item deleted successfully.');
          } else {
            console.log('Failed to delete item.');
          }
        } catch (error) {
          console.log('Error during delete request:', error);
        }
      }
      console.log(selectedEvent.id);
    }
  };

  // Handler to close event details popup
  const closeEventDetails = () => {
    setShowEventDetails(false);
    setSelectedEvent(null);
  };

  // Helper to format duration between two dates in hours and minutes
  const formatDuration = (start, end) => {
    const diffMs = end - start;
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    let result = '';
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m`;
    return result.trim();
  };

  // Helper to get time remaining or passed for event start
  const getTimeRemaining = (start) => {
    const now = new Date();
    const diffMs = start - now;
    const diffMins = Math.floor(Math.abs(diffMs) / 60000);
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    let result = '';
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m`;
    if (diffMs > 0) {
      return `Starts in ${result.trim()}`;
    } else {
      return `Started ${result.trim()} ago`;
    }
  };

  const handleEditEvent = (event) => {
    handleAddEvent(event)
    closeEventDetails()
    setShowEditForm(true)
    setEventId(event.id)
  }
  console.log(EventId)
  const handleUpdateEvent = useCallback(async (e) => {
    e.preventDefault();
    if (!newEventTitle || !newEventStart || !newEventEnd) {
      alert('Please fill in all fields and select a time slot.');
      return;
    }
    if (!EditForm) {
      console.error("No event selected for update.");
      return; // Exit if no event is selected
    }

    const updatedEvent = {
      id: EditForm.id,
      title: newEventTitle,
      body: newEventBody,
      date: simpleDate,
      user:userId,
      start: newEventStart,
      end: newEventEnd,
      category: newEventCategory,
      color: newEventColor,
    };

    setEventsState(prev => prev.map(event => event.id === EditForm.id ? updatedEvent : event));
    setAddingEvent(false);
    setSelectedEvent(null)
    setShowEditForm(false)
    if (userId) {
      await fetch(`http://localhost:3000/api/v3/updateEvent/${EventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEvent),
      }).then(async response => {
        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.message === "User not found") {
            console.error("There is no such user in our database. Please Sign up.");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        if (response.ok) {
          console.log('Resource Updated successfully');
          setEventsState(prev => prev.map(event => event.id === EditForm.id ? updatedEvent : event));
          setAddingEvent(false);
          setSelectedEvent(null)
          setShowEditForm(false)
          setEventId(null)
        }
        // Handle successful deletion (e.g., remove the item from the UI)
      })
        .catch(error => {
          console.error('Error Updating resource:', error);
        });
    }
  }, [EditForm, EventId, simpleDate, newEventTitle, newEventStart, newEventEnd, newEventBody, newEventCategory, newEventColor, userId]);

  return (
    <>
      <Navbar />
      <div className="relative gap-10 max-w-7xl mx-auto p-6 bg-white rounded-lg shadow space-x-10 [@media(min-width:868px)]:flex-row flex-col flex">
        {/* Advanced calendar with day time view */}
        <div className="md:w-3/4 w-full space-y-4 mx-auto">
          <BigCalendar
            localizer={localizer}
            events={eventsState}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            className='rounded shadow'
            view={bigView}
            onView={handleViewChange}
            date={bigDate}
            onNavigate={handleNavigate}
            components={{
              toolbar: CustomToolbar,
              event: ({ event }) => (
                <div onClick={() => handleSelectEvent(event)} className="p-1 cursor-pointer">
                  <h1 className="font-bold text-lg text-red-600 title">{event.title}</h1>
                  <div className="text-sm">{event.body}</div>
                  <div className="text-sm">{event.category} Category</div>
                </div>
              ),
              timeSlotWrapper: ({ children }) => (
                <div ref={scrollContainerRef} className="scrollable-time-slot bg-white border-r-0 overflow-y-auto max-h-96" style={{ minHeight: '80px', maxHeight: '400px', overflowY: 'auto' }}>
                  {children}
                </div>
              ),
            }}
            eventPropGetter={eventPropGetter}
            selectable={addingEvent}
            onSelectSlot={handleSelectSlot}
            min={new Date(1970, 0, 1, 0, 0, 0)}
            max={new Date(1970, 0, 1, 23, 59, 59)}
            timeslots={2}
            step={30} />
        </div>
        {/* Simple calendar with Nepali dates */}
        <div className="md:w-1/4 w-full space-y-4 mx-auto">
          <Calendar onChange={onSimpleChange} value={simpleDate} tileContent={tileContent} className={"rounded shadow"} />
          <div className="bg-gray-50 p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-1">Selected Date</h3>
            <p>English: {simpleDate.toDateString()}</p>
            <p>
              Nepali: {new NepaliDate(simpleDate).getYear()}-{new NepaliDate(simpleDate).getMonth() + 1}-
              {new NepaliDate(simpleDate).getDate()}
            </p>
          </div>
        </div>
      </div>
      {(addingEvent || showEditForm) && (
        <form onSubmit={isEditing ? handleUpdateEvent : handleSaveEvent} className="fixed top-20 left-1/2 z-50 w-96 -translate-x-1/2 rounded bg-white p-6 shadow-lg">
          <h3 className="mb-2 text-lg font-semibold">{isEditing ? 'Update Event' : 'Add Event'}</h3>
          <label className="mb-1 block font-medium" htmlFor="title">Title *</label>
          <input id="title" type="text" value={newEventTitle} onChange={(e) => setNewEventTitle(e.target.value)} className="mb-2 w-full rounded border border-gray-300 px-3 py-1" required />
          <label className="mb-1 block font-medium" htmlFor="body">Description</label>
          <textarea id="body" value={newEventBody} onChange={(e) => setNewEventBody(e.target.value)}
            className="mb-2 w-full resize-none rounded border border-gray-300 px-3 py-1" rows={4} />
          <label className="mb-1 block font-medium" htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={newEventStart ? moment(newEventStart).format('YYYY-MM-DD') : ''}
            onChange={(e) => {
              const selectedDate = e.target.value;
              if (newEventStart && newEventEnd) {
                const updateDate = (dateObj, newDateStr) => {
                  const time = {
                    hours: dateObj.getHours(),
                    minutes: dateObj.getMinutes(),
                    seconds: dateObj.getSeconds(),
                    milliseconds: dateObj.getMilliseconds(),
                  };
                  const newDate = new Date(newDateStr);
                  newDate.setHours(time.hours, time.minutes, time.seconds, time.milliseconds);
                  return newDate;
                };
                setNewEventStart(updateDate(newEventStart, selectedDate));
                setNewEventEnd(updateDate(newEventEnd, selectedDate));
              } else {
                const newStart = new Date(selectedDate);
                const newEnd = new Date(selectedDate);
                newEnd.setHours(newEnd.getHours() + 1);
                setNewEventStart(newStart);
                setNewEventEnd(newEnd);
              }
              setSimpleDate(new Date(selectedDate));
            }}
            className="mb-2 w-full rounded border border-gray-300 px-3 py-1"
            required
          />
          <div className="flex space-x-4 mb-2">
            <div className="flex flex-col w-1/2">
              <label className="block font-medium mb-1" htmlFor="startTime">Start Time *</label>
              <input id="startTime" type="time" value={newEventStart && moment(newEventStart).isValid() ? moment(newEventStart).format('HH:mm') : ''}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':');
                  const updatedDate = new Date(newEventStart || new Date());
                  updatedDate.setHours(parseInt(hours), parseInt(minutes));
                  setNewEventStart(updatedDate);
                }} className="rounded border border-gray-300 px-3 py-1" required />
            </div>
            <div className="flex flex-col w-1/2">
              <label className="block font-medium mb-1" htmlFor="endTime">End Time *</label>
              <input id="endTime" type="time" value={newEventEnd && moment(newEventEnd).isValid() ? moment(newEventEnd).format('HH:mm') : ''} onChange={(e) => {
                const [hours, minutes] = e.target.value.split(':');
                const updatedDate = new Date(newEventEnd || new Date());
                updatedDate.setHours(parseInt(hours), parseInt(minutes));
                setNewEventEnd(updatedDate);
              }} className="rounded border border-gray-300 px-3 py-1" required />
            </div>
          </div>
          <label className="mb-1 block font-medium" htmlFor="category">Category</label>
          <select
            id="category"
            value={newEventCategory}
            onChange={(e) => {
              setNewEventCategory(e.target.value);
              const categoryColors = {
                Work: '#3B82F6',
                Personal: '#10B981',
                Meeting: '#F59E0B',
                Appointment: '#EF4444',
                Task: '#8B5CF6',
                Reminder: '#EC4899',
                Other: '#6B7280',
              };
              setNewEventColor(categoryColors[e.target.value] || '#6B7280');
            }}
            className="mb-2 w-full rounded border border-gray-300 px-3 py-1">
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Appointment">Appointment</option>
            <option value="Task">Task</option>
            <option value="Reminder">Reminder</option>
            <option value="Other">Other</option>
          </select>
          <div className="flex space-x-2 mb-4">
            {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#6B7280'].map((color) => (
              <div key={color}
                className={`h-6 w-6 rounded-full cursor-pointer border-2 ${newEventColor === color ? 'border-black' : 'border-transparent'}`}
                style={{ backgroundColor: color }}
                onClick={() => {
                  setNewEventColor(color);
                  const colorCategoryMap = {
                    '#3B82F6': 'Work',
                    '#10B981': 'Personal',
                    '#F59E0B': 'Meeting',
                    '#EF4444': 'Appointment',
                    '#8B5CF6': 'Task',
                    '#EC4899': 'Reminder',
                    '#14B8A6': 'Other',
                    '#6B7280': 'Other',
                  };
                  setNewEventCategory(colorCategoryMap[color] || 'Other');
                }}
              />
            ))}
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={() => { setAddingEvent(false), setShowEditForm(false) }} className="rounded border border-gray-300 px-4 py-1 hover:bg-gray-100" >
              Cancel
            </button>
            <button type="submit" className="rounded bg-black px-4 py-1 text-white hover:bg-gray-900" >
              {(showEditForm) ? 'Add Event' : 'Update Event'}
            </button>
          </div>
        </form>
      )}
      {showEventDetails && selectedEvent && (
        <div ref={eventDetailsRef}
          className="fixed top-20 left-1/2 z-50 md:w-[420px] w-[350px] -translate-x-1/2 rounded-lg bg-white shadow-xl border border-gray-200">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-gray-200 px-5 py-4">
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: selectedEvent.color || "#3B82F6" }}>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{selectedEvent.title}</h3>
            </div>
            <div className="flex items-center gap-4 text-gray-500">
              <FaEdit onClick={() => handleEditEvent(selectedEvent)} className="cursor-pointer hover:text-gray-700" />
              <RiDeleteBin6Line onClick={() => deleteEvent()} className="cursor-pointer hover:text-gray-700" />
              <button onClick={closeEventDetails} className="hover:text-gray-700 cursor-pointer" aria-label="Close" >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Event Content */}
          <div className="px-5 py-4 space-y-3 text-gray-700">
            {/* Date & Time */}
            <div className="flex items-start gap-3">
              <FaRegClock className="mt-1 text-gray-500" />
              <div className="flex flex-col">
                <span className="font-medium">{moment(selectedEvent.date).format('dddd, MMMM Do YYYY')}</span>
                <span className="text-sm text-gray-600">
                  {moment(selectedEvent.start).format("h:mm A")} – {moment(selectedEvent.end).format("h:mm A")} (
                  {formatDuration(selectedEvent.start, selectedEvent.end)})
                </span>
              </div>
            </div>

            {/* Category */}
            <div className="flex items-center gap-3">
              <GoTag className="text-gray-500" />
              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded">
                {selectedEvent.category}
              </span>
            </div>

            {/* Body */}
            <div className="flex items-center gap-3">
              <CiCalendarDate className="text-gray-500" />
              <span>{selectedEvent.body}</span>
            </div>

            {/* Time Remaining */}
            <div className="flex items-center gap-3 text-gray-600">
              <IoMdNotificationsOutline className="text-gray-500" />
              <span>{getTimeRemaining(selectedEvent.start)}</span>
            </div>

            {/* Attendees */}
            <div className="flex items-center gap-3 text-gray-600">
              <IoPersonOutline className="text-gray-500" />
              <span>You</span>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-between items-center border-t border-gray-200 px-5 py-3">
            <button onClick={() => handleEditEvent(selectedEvent)}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">
              <FaEdit /> Edit Event
            </button>
            <button onClick={deleteEvent}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-red-300 px-4 py-2 text-red-600 hover:bg-red-50">
              <RiDeleteBin6Line /> Delete Event
            </button>
          </div>
        </div>
      )}

    </>
  )
};

export default Calandar;
