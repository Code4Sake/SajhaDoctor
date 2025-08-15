    import React, { useState, useEffect } from 'react';

const ScheduleSelector = ({ selectedSlots, onSlotSelect, doctorSchedule = [] }) => {
  const [weeklySchedule, setWeeklySchedule] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: []
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
  ];

  // Initialize schedule from props or existing data
  useEffect(() => {
    if (doctorSchedule.length > 0) {
      setWeeklySchedule(doctorSchedule);
    }
  }, [doctorSchedule]);

  const handleSlotToggle = (day, time) => {
   const slotId = `${day}-${time}`;
    const isSelected = weeklySchedule[day].includes(time);

    setWeeklySchedule(prev => ({
      ...prev,
      [day]: isSelected 
        ? prev[day].filter(slot => slot !== time)
        : [...prev[day], time].sort()
    }));

    // Notify parent component
    if (onSlotSelect) {
      onSlotSelect({ day, time, isSelected: !isSelected, slotId });
    }
  };

  const isSlotSelected = (day, time) => {
    return weeklySchedule[day].includes(time);
  };

  const handleSelectAllDay = (day) => {
    const allSelected = timeSlots.every(time => weeklySchedule[day].includes(time));
    
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: allSelected ? [] : [...timeSlots]
    }));

    // Notify parent for each slot
    if (onSlotSelect) {
      timeSlots.forEach(time => {
        onSlotSelect({ 
          day, 
          time, 
          isSelected: !allSelected, 
          slotId: `${day}-${time}`
        });
      });
    }
  };

  const clearAllSchedule = () => {
    const emptySchedule = {
      Monday: [], Tuesday: [], Wednesday: [], Thursday: [],
      Friday: [], Saturday: [], Sunday: []
    };
    setWeeklySchedule(emptySchedule);
    
    if (onSlotSelect) {
      onSlotSelect({ action: 'clearAll', schedule: emptySchedule });
    }
  };

  const getSelectedSlotsCount = () => {
    return Object.values(weeklySchedule).reduce((total, daySlots) => total + daySlots.length, 0);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-800">
            Set Your Weekly Schedule
          </h3>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Selected Slots: <span className="font-semibold text-emerald-600">{getSelectedSlotsCount()}</span>
            </span>
            <button
              type="button"
              onClick={clearAllSchedule}
              className="px-4 py-2 text-sm bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4">
          Select your available time slots for each day. Click on individual slots or use "Select All Day" to quickly select all slots for a day.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {daysOfWeek.map(day => (
          <div key={day} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-lg text-gray-800">{day}</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {weeklySchedule[day].length} slots
                </span>
                <button
                  type="button"
                  onClick={() => handleSelectAllDay(day)}
                  className="text-xs px-2 py-1 bg-emerald-100 text-emerald-600 rounded hover:bg-emerald-200 transition-colors"
                >
                  {weeklySchedule[day].length === timeSlots.length ? 'Clear All' : 'Select All'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map(time => (
                <button
                  key={time}
                  type="button"
                  onClick={() => handleSlotToggle(day, time)}
                  className={`
                    p-2 text-xs font-medium rounded-md transition-all duration-200 border
                    ${isSlotSelected(day, time)
                      ? 'bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600 shadow-md'
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600'
                    }
                  `}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {getSelectedSlotsCount() > 0 && (
        <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <h4 className="font-semibold text-emerald-800 mb-2">Schedule Summary:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            {Object.entries(weeklySchedule).map(([day, slots]) => (
              slots.length > 0 && (
                <div key={day} className="text-emerald-700">
                  <span className="font-medium">{day}:</span>
                  <span className="ml-2">{slots.length} slot{slots.length > 1 ? 's' : ''}</span>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p>💡 <strong>Tip:</strong> You can modify your schedule anytime from your doctor dashboard after registration.</p>
      </div>
    </div>
  );
};

export default ScheduleSelector;