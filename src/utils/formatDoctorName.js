// Some API names already include "Dr."; normalise so it is shown exactly once.
export const formatDoctorName = (name = '') => `Dr. ${name.replace(/^dr\.?\s+/i, '')}`;
